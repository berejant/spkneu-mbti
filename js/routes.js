'use strict';

define(['./app'], function (app) {

    /**
     * Конфигурация роутинга
     * @ngInject
     * @param {angular.$routeProvider} $routeProvider
     * @returns {undefined}
     */
    var config = function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeController'
        });

        $routeProvider.otherwise({
            redirectTo: '/'
        });
    };

    return app.config(config);
});