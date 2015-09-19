'use strict';

define(['./app'], function (app) {

    /**
     * Конфигурация роутинга
     * @ngInject
     * @param {angular.$stateProvider} $stateProvider
     * @param {angular.$urlRouterProvider} $urlRouterProvider
     * @returns {undefined}
     */
    var config;

    config = function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/");
        //
        // Now set up the states
        $stateProvider
            .state('home', {
                url: "/",
                template: '<ion-view view-title="{{title}} - Головна">',
                controller: 'HomeController'

            })
            .state('login', {
                url: "/login",
                templateUrl: "partials/login.html",
                controller: 'LoginController'
            })
    };

    return app.config(config);
});