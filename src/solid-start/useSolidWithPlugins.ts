import solid from 'solid-start/vite'
import adapterNode from 'solid-start-node'
import { mergeProps } from 'solid-js'
import { useUpperCaseFirst } from '../format/useUpperCaseFirst'

export interface Plugin {
  name: string
  preStart?(config: any, serverOptions: any): Promise<any>
  postStart?(config: any, serverOptions: any): Promise<any>
  preBuild?(config: any, serverOptions: any): Promise<any>
  postBuild?(config: any, serverOptions: any): Promise<any>
}

// solid(options: Options); Options are not exported, so we need to extract
type SolidFnParameters = Parameters<typeof solid>
type SolidUserOptions = SolidFnParameters[0]

export interface Adapter {
  name: string
  start(config: any, serverOptions: any): Promise<any>
  build(config: any, serverOptions: any): Promise<any>
  dev?(config: any, serverOptions: any): Promise<any>
}

type PluginOptions = {
  /**
   * One or more plugins to use per build/start phase
   * - start means dev mode
   * - build means prod mode
   */
  plugins?: Array<Plugin>

  adapter?: Adapter
}

type Options = SolidUserOptions & PluginOptions

export type AdapterHookName = 'start' | 'build' | 'dev'

const defaultOptions: Options = {
  plugins: [],
  adapter: adapterNode(), // default adapter according to current impl.
}

const callHooks = async (targets: Array<Plugin | Adapter>, hookName: string, args: Array<any>, callInBand = false) => {
  for (let i = 0; i < targets.length; i++) {
    const target = targets[i]
    let result: any

    if (typeof target[hookName] === 'function') {
      // one call waits for the next one to happen; useful for adapters
      // because here, one might need to wait for another to finish
      if (callInBand) {
        console.log('[solid-with-plugins] (in band)', target.name, '/', hookName)
        result = Promise.resolve(await target[hookName as string](...args))
      } else {
        console.log('[solid-with-plugins] (in parallel)', target.name, '/', hookName)
        result = target[hookName as string](...args)
      }
    } else {
      throw new Error(
        '[solid-with-plugins] hook "' + hookName + '" does not exist in adapter or plugin: ' + target.name,
      )
    }

    // assign a name to the result
    result.$targetName = target.name

    // push onto stack to make sure the result is available for the next adapter to use
    // when executed in band
    args[0].solidWithPlugins[hookName].push(result)
  }
}

const composedHookCalls = async (options: Options, hookName: AdapterHookName, args: Array<any>) => {
  // first argument should always be the config object,
  // but just in case...
  if (!args[0]) {
    args[0] = {}
  }

  // in case there is no solidWithPlugins sub-config yet, prepare
  if (!args[0].solidWithPlugins) {
    args[0].solidWithPlugins = {
      [hookName]: [],
    }
  }

  // run pre hooks on plugins in prallel
  callHooks(options.plugins, `pre${useUpperCaseFirst(hookName)}`, args)

  // run all adapters in band and wait
  await callHooks([options.adapter], hookName, args, true)

  // run post hooks on plugins in parallel
  callHooks(options.plugins, `post${useUpperCaseFirst(hookName)}`, args)

  const adapterResults = args[0].solidWithPlugins[hookName]

  // in case of only one adapter named, this yields the default behaviour
  // in case more than one are declared, the last adapter named has control
  // over the behaviour of the composed adapter array (e.g. an SSR+SSG proxy composer adapter)
  const lastAdapterResult = adapterResults[adapterResults.length - 1]

  return lastAdapterResult
}

export const useSolidWithPlugins = function (options: Options = defaultOptions) {
  options = mergeProps(defaultOptions, options)

  const doesAdapterImplementDevHook = !!options.adapter.dev

  const composedAdapter: Adapter = {
    name: 'solid-with-plugins',
    async start(viteConfig: any, server: any) {
      return composedHookCalls(options, 'start', [viteConfig, server])
    },

    async build(viteConfig: any, builder: any) {
      return composedHookCalls(options, 'build', [viteConfig, builder])
    },
  }

  if (doesAdapterImplementDevHook) {
    // the dev hook has an extra logic:
    // if it is implemented in an adapter, the default devServer is overridden
    // and it doesn't start up. Therefore we should only declare the property
    // on the composed adapter implementation, in case it is implemented in
    // at least one of them; see:
    // https://github.com/solidjs/solid-start/blob/main/packages/start/vite/plugin.js#L432
    composedAdapter.dev = (viteConfig: any, server: any) => {
      return composedHookCalls(options, 'dev', [viteConfig, server])
    }
  }

  return solid({
    adapter: composedAdapter,
  })
}
