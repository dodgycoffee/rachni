import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readdirSync, statSync } from 'fs'
import sassGlobImports from 'vite-plugin-sass-glob-import'

let getFiles = (dir, prefix = '') => {
    return Object.fromEntries(
        readdirSync(dir)
            .filter(file => statSync(`${dir}/${file}`).isFile())
            .map(file => [`${prefix}${file.replace(/\.[^/.]+$/, '')}`, resolve(__dirname, `${dir}/${file}`)])
    )
}

export default defineConfig({
    plugins: [
        sassGlobImports(),
    ],

    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ['import'],
            },
        },
    },

    build: {
        outDir: 'web',
        manifest: 'manifest.json',

        rollupOptions: {
            input: {
                styles: resolve(__dirname, 'resources/sass/styles.scss'),
                global: resolve(__dirname, 'resources/js/global.js'),
                ...getFiles('resources/js/components', 'components/'),
            },

            output: {
                entryFileNames: 'assets/js/[name].[hash].js',
                chunkFileNames: 'assets/js/[name].[hash].js',

                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith('.css')) {
                        return 'assets/css/[name].[hash][extname]'
                    }
                    return 'assets/[name][extname]'
                },
            },
        },
    },
})
