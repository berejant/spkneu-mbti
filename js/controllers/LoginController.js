'use strict';

define(['./module'], function (controllers) {

    /**
     * Login Controller
     *
     * @param {angular.$scope} $scope
     * @param {angular.Oauth} Oauth
     * @param {angular.$ionicPopup} $ionicPopup
     * @param {angular.$state} $state
     * @ngInject
     */
    var controller = function ($scope, Oauth, $ionicPopup, $state) {

        Oauth.finish().then(function () {
            // после успешной авторизации - отправить на главную
            $state.go('home', {}, {location: 'replace'});
        }, function(error) {
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
