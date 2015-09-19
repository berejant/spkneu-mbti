'use strict';

requirejs.config({
    //  псевдонимы и пути используемых библиотек и плагинов
    paths: {
        'domReady': '../lib/requirejs-domready/domReady',
        'angular': '../lib/angular/angular',
        'angular-route': '../lib/angular-route/angular-route',
        'angular-locale-ru': '../lib/angular-locale-ru/angular-locale_ru',
        'css': '../lib/require-css/css',
        'mobile-angular-ui': '../lib/mobile-angular-ui/dist/js',
        'config': '../config'
    },
    map: {
        '*': {
            'css': '../lib/require-css/css' // or whatever the path to require-css is
        }
    },
    // angular не поддерживает AMD из коробки, поэтому экспортируем перменную angular в глобальную область
    shim: {
        'angular': {
            exports: 'angular'
        }
    },
    // запустить приложение
    deps: ['./bootstrap']
});

