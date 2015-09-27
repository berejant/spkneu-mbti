'use strict';

define([
    './app',
    'text!../partials/home.html',
    'text!../partials/login.html',
    'text!../partials/test.html',
    'text!../partials/result.html'
], function (app, homeTemplate, loginTemplate, testTemplate, resultTemplate) {

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
                controller: 'TestController'
            })
            .state('result', {
                url: "/result",
                template: resultTemplate,
                controller: 'ResultController'
            })
    };

    return app.config(config);
});