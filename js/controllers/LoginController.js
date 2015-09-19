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

        Oauth.finish().catch(function(error) {
            $ionicPopup.alert({
                title: 'Помилка входу',
                template: error
            });
        });

        $scope.oauthStart = function () {
            Oauth.start();
        }
    };

    controllers.controller('LoginController', controller);
});
