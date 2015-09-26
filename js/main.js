'use strict';

requirejs.config({
    //  псевдонимы и пути используемых библиотек и плагинов
    paths: {
        'domReady': '../lib/requirejs-domready/domReady',
        'angular': '../lib/angular/angular',
        'angular-route': '../lib/angular-route/angular-route',
        'angular-animate': '../lib/angular-animate/angular-animate',
        'angular-sanitize': '../lib/angular-sanitize/angular-sanitize',
        'angular-ui-router': '../lib/angular-ui-router/release/angular-ui-router',
        'angular-i18n': '../lib/angular-i18n',
        'angular-local-storage': '../lib/angular-local-storage/dist/angular-local-storage',
        'css': '../lib/require-css/css',
        'ionic': '../lib/ionic/release/js',
        'text': '../lib/text/text',
        'json': '../lib/requirejs-plugins/src/json'
    },
    map: {
        '*': {
            'css': '../lib/require-css/css', // or whatever the path to require-css is
            'config': 'json!../config.json'
        }
    },
    // angular не поддерживает AMD из коробки, поэтому экспортируем перменную angular в глобальную область
    shim: {
        'angular': {
            exports: 'angular'
        },
        'fastclick': {
            exports: 'FastClick'
        }
    },

    // запустить приложение
    deps: ['./bootstrap']
});
