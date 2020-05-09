let mix = require('laravel-mix');
let fs = require('fs');

// Mix Public Path
mix.setPublicPath('web');

// Mix Options
mix.options({
    clearConsole: Mix.isWatching()
});

// Extra Webpack Config
mix.webpackConfig({
    module: {
        rules: [
            {
                test: /\.scss$/,
                loader: 'import-glob-loader',
            },

            // Global jquery
            /* {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: '$',
                }],
            }, */
        ],
    },

    watchOptions: {
        poll: Mix.isPolling() ? 1700 : false,
        aggregateTimeout: 600,
        ignored: [ /^(?!.*resources)/ ]
    },
});

/* mix.autoload({
    jquery: ['$', 'jQuery', 'window.$', 'window.jQuery']
}); */

// Asset Config

let getFiles = function (dir) {
    return fs.readdirSync(dir).filter(file => {
        return fs.statSync(`${dir}/${file}`).isFile();
    });
};

// Get all JS and output to individual files
getFiles('resources/js').forEach(function (filepath) {
    mix.js('resources/js/' + filepath, 'resources/js');
});

// Do the rest
mix.sass('resources/sass/styles.scss', 'resources/css')
    .extract()
    .sourceMaps()
    .version();
