'use strict';

define([
    'require',
    'angular',
    'app',
    'routes',
    'domReady',
    'ionic/ionic'
], function (require, ng) {
    require([
        'domReady!',
        'angular-animate',
        'angular-sanitize',
        'angular-ui-router',
        'ionic/ionic-angular',
        'angular-i18n/angular-locale_uk-ua',
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