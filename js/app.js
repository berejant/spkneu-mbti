define([
    'angular',
    'Config',
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
     * @param {angular.Api} Api - Api Service
     * @param {angular.Oauth} Oauth - Api Service
     * @ngInject
     */
    var run = function ($rootScope, $state, Api, Oauth) {
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

        $rootScope.dblClickInfo = false;

        if(!ionic.Platform.isIOS() && !ionic.Platform.isAndroid() && !ionic.Platform.isWindowsPhone() ) {
            angular.element(document.body).one('mousemove', function(){
                $rootScope.dblClickInfo = true;
                $rootScope.$apply();
            });
        }

        $rootScope.hideDblClickInfo = function() {
            $rootScope.dblClickInfo = false;
        };

        $rootScope.logout = function() {
            if(!Api.isLogged()) {
                return;
            }

            Oauth.logout();
        }
    };

    /**
     * @param {angular.$ionicConfigProvider} $ionicConfigProvider
     * @param {angular.localStorageServiceProvider} localStorageServiceProvider
     * @ngInject
     */
    var сonfig = function($ionicConfigProvider, localStorageServiceProvider) {
        $ionicConfigProvider.backButton.text('Назад').previousTitleText(false);

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
    ]).config(сonfig).run(run);
});