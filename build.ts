import { build } from 'esbuild'
import tabularFilesizeGzip from 'tabular-filesize-gzip'
;(async () => {
  await build({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    format: 'esm',
    minify: true,
    sourcemap: 'external',
    outfile: './dist/index.js',
    external: [
      'solid-js',
      'solid-js/web',
      'solid-js/store',
      'solid-use',
      '@solidjs/router',
      'solid-start-node',
      'vitest/config',
      'solid-start/vite',
      'solid-start/server',
      'solid-start/session',
    ],
  })

  console.log(
    tabularFilesizeGzip([
      {
        title: 'Bundle Size',
        groups: [
          {
            title: 'Source',
            files: 'dist/index.js',
          },
          {
            title: 'SourceMap',
            files: 'dist/index.js.map',
          },
        ],
      },
    ]),
  )
})()
