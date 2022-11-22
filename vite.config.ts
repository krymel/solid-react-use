import { defineConfig } from 'vitest/config'
import { useSolidTest } from './src/test/useSolidTest'
import { useSolidWithPlugins } from './src/solid-start/useSolidWithPlugins'

export default defineConfig({
  plugins: [useSolidWithPlugins()],
  test: useSolidTest({
    coverage: {
      provider: 'c8',
    },
  }),
})
