'use strict';

define([
    'require',
    'angular',
    'app',
    'routes',
    'domReady'
], function (require, ng) {
    require([
        'domReady!',
        'angular-route',
        'angular-locale-ru',
        'mobile-angular-ui/mobile-angular-ui',
        'mobile-angular-ui/mobile-angular-ui.core',
    ], function (document) {
        /*
         * Запуск приложения, после загрузки всех зависимостей и domReady
         */
        ng.bootstrap(document, ['mbti']);

        /*
         * сброс body display:none (до полной загрузки приложения - ничего не отображается)
         */
        document.body.style.display = '';
    });
});