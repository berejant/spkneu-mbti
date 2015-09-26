({
    baseUrl: "./js/",
    mainConfigFile: 'js/main.js',
    out: "js/min.js",
    locale: 'ru-ru',
    useStrict: true,
    excludeShallow: [
        '../lib/require-css/css!../css/main'
    ],
    include: [
        'main',
        'app',
        'routes'
    ],
    optimize: 'none',
    generateSourceMaps: false,
    preserveLicenseComments: false,

    onBuildWrite: function( name, path, contents ) {
        if( 'bootstrap' === name) {
            contents = contents.replace('/css/main.css', '/css/min.css');
        }
        return contents
    }
})