let mix = require('laravel-mix')
let fs = require('fs')

// Mix Public Path
mix.setPublicPath('web')

// Extra Webpack Config
mix.webpackConfig({
    module: {
        rules: [
            {
                test: /\.scss$/,
                loader: 'import-glob-loader',
            },
        ],
    },
})

// Asset Config
let getFiles = function (dir) {
    return fs.readdirSync(dir).filter((file) => {
        return fs.statSync(`${dir}/${file}`).isFile()
    })
}

// Get all JS and output to individual files
getFiles('resources/js').forEach(function (filepath) {
    mix.js('resources/js/' + filepath, 'assets/js')
})

// Do the rest
mix.sass('resources/sass/styles.scss', 'assets/css')
    .extract()
    .sourceMaps()
    .version()
