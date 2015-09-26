define([
    'angular',
    'config',
    'ionic/ionic',
    'angular-animate',
    'angular-sanitize',
    'angular-ui-router',
    'ionic/ionic-angular',
    'angular-i18n/angular-locale_uk-ua',
    'angular-local-storage',
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
                $state.go('login', {}, {location: false});
            }
        });

        $rootScope.$on('$stateChangeSuccess', function () {
            $rootScope.loading = false;
        });


    };

    /**
     * @param {angular.localStorageServiceProvider} localStorageServiceProvider
     * @ngInject
     */
    var storageConfig = function(localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('mbti')
            .setStorageType('sessionStorage')
            .setStorageCookie(0, '/');
    }

    return ng.module('mbti', [
        'ionic',
        'LocalStorageModule',
        'mbti.services',
        'mbti.controllers',
        'mbti.filters',
        'mbti.directives'
    ]).config(storageConfig).run(run);
});