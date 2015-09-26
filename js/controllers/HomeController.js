'use strict';

define(['./module'], function (controllers) {

    /**
     * Home Controller
     *
     * @param {angular.$scope} $scope
     * @param {angular.$state} $state
     * @param {angular.$ionicHistory} $ionicHistory
     * @param {angular.Api} Api
     * @ngInject
     */
    var HomeController = function ($scope, $state, $ionicHistory, Api) {
        $scope.hideBackButton = $ionicHistory.backView() ? 'login' == $ionicHistory.backView().stateId : false;

    };

    controllers.controller('HomeController', HomeController);
});
