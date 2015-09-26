'use strict';

define([
    'require',
    'angular',
    'domReady',
    'ionic/ionic',
    'css!../css/main.css'
], function (require, ng, document) {
    require([
        'domReady!',
        'app',
        'routes'
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