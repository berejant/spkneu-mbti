'use strict';

define(['./module'], function (controllers) {

    /**
     * Login Controller
     *
     * @param {angular.$scope} $scope
     * @param {angular.Oauth} Oauth
     * @param {angular.$ionicPopup} $ionicPopup
     * @param {angular.$ionicLoading} $ionicLoading
     * @param {angular.$state} $state
     * @ngInject
     */
    var controller = function ($scope, Oauth, $ionicPopup, $ionicLoading, $state) {

        Oauth.finish().then(function (status) {
            if(status) {
            // после успешной авторизации - отправить на главную
                $state.go('home', {}, {location: 'replace'});
            } else {
                $scope.showLoginButton = true;
            }
        }, function(error) {
            $scope.showLoginButton = true;

            // в случае ошибки - вывести alert
            var alertPromise = $ionicPopup.alert({
                title: 'Помилка входу',
                template: error
            });

            if("API" === error.type && 403 === error.error_code) {
                alertPromise.then(function() {
                    Oauth.logout(true);
                });
            }
        });

        $scope.oauthStart = function () {
            Oauth.start();
        }
    };

    controllers.controller('LoginController', controller);
});
