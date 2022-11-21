import { build } from 'esbuild'
import tabularFilesizeGzip from 'tabular-filesize-gzip'
;(async () => {
  const result = await build({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    format: 'esm',
    minify: true,
    sourcemap: 'external',
    outfile: './dist/index.js',
    external: ['solid-js'],
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
