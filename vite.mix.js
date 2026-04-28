import { resolve } from 'path'
import { createHash } from 'crypto'
import { writeFileSync } from 'fs'

export default (manifestName = 'mix-manifest.json') => {
    return {
        name: 'vite-mix',

        config() {
            return {
                build: {
                    manifest: false,
                    rollupOptions: {
                        output: {
                            entryFileNames: 'assets/js/[name].js',
                            chunkFileNames: 'assets/js/[name].js',
                            assetFileNames: (assetInfo) => {
                                if (assetInfo.name?.endsWith('.css')) {
                                    return 'assets/css/[name][extname]'
                                }
                                return 'assets/[name][extname]'
                            },
                        },
                    },
                },
            }
        },

        writeBundle(options, bundle) {
            let manifest = {}

            for (let [fileName, chunk] of Object.entries(bundle)) {
                if (chunk.type !== 'asset' && chunk.type !== 'chunk') continue

                let source = chunk.type === 'asset' ? chunk.source : chunk.code
                let hash = createHash('md5')
                    .update(Buffer.isBuffer(source) ? source : Buffer.from(source))
                    .digest('hex')

                let logical = `/${fileName}`
                manifest[logical] = `${logical}?id=${hash}`
            }

            writeFileSync(
                resolve(options.dir, manifestName),
                JSON.stringify(manifest, null, 2)
            )
        }
    }
}
