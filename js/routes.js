'use strict';

define([
    './app',
    'text!../partials/home.html',
    'text!../partials/login.html',
    'text!../partials/test.html'
], function (app, homeTemplate, loginTemplate, testTemplate) {

    /**
     * Конфигурация роутинга
     * @ngInject
     * @param {angular.$stateProvider} $stateProvider
     * @param {angular.$urlRouterProvider} $urlRouterProvider
     * @returns {undefined}
     */
    var config = function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/");
        //
        // Now set up the states
        $stateProvider
            .state('home', {
                url: "/",
                template: homeTemplate,
                controller: 'HomeController'

            })
            .state('login', {
                url: "/login",
                template: loginTemplate,
                controller: 'LoginController'
            })
            .state('test', {
                url: "/test/:questionId",
                template: testTemplate,
                controller: 'TestController',
                params: {
                    questionId: 1
                }
            })
    };

    return app.config(config);
});