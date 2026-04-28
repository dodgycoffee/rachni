import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readdirSync, statSync } from 'fs'
import sassGlobImports from 'vite-plugin-sass-glob-import'
import viteMix from './vite.mix.js'

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
        viteMix(),
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

        rollupOptions: {
            input: {
                styles: resolve(__dirname, 'resources/sass/styles.scss'),
                global: resolve(__dirname, 'resources/js/global.js'),
                ...getFiles('resources/js/components', 'components/'),
            },
        },
    },
})
