define([
    'angular',
    'config',
    './controllers/index',
    './directives/index',
    './filters/index',
    './services/index',
], function (ng, Config) {
    'use strict';

    /**
     * Run handler - устанавливает базовые переменные
     *
     * @param {angular.$rootScope} $rootScope - The Root Scope
     * @param {angular.$state} $state - Angular Location Service
     * @param {angular.Api} $state - Api Service
     * @ngInject
     */
    var run = function ($rootScope, $state, Api) {
        $rootScope.title = Config.title;

        $rootScope.$on('$stateChangeStart', function (event, toState) {
            $rootScope.loading = true;

            if (!Api.isLogged() && toState.name !== 'login') {
                event.preventDefault();
                $state.go('login', {}, {location: 'replace'});
            }
        });

        $rootScope.$on('$stateChangeSuccess', function () {
            $rootScope.loading = false;
        });


    };

    return ng.module('mbti', [
        'ionic',
        'mbti.services',
        'mbti.controllers',
        'mbti.filters',
        'mbti.directives'
    ]).run(run);
});