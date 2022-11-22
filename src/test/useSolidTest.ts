import { mergeProps } from 'solid-js'
import { UserConfig } from 'vitest/config'

type TestUserConfig = UserConfig['test']

export const useSolidTest = (overrideConfig: TestUserConfig): TestUserConfig =>
  mergeProps(
    {
      deps: {
        registerNodeLoader: true,
      },
      environment: 'jsdom',
      globals: true,
      setupFiles: ['node_modules/@testing-library/jest-dom/extend-expect'],
      transformMode: { web: [/\.[jt]sx?$/] },
    } as TestUserConfig,
    overrideConfig,
  )
