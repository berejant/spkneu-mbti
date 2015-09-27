'use strict';

define(['./module'], function (controllers) {

    /**
     * Home Controller
     *
     * @param {angular.$scope} $scope
     * @param {angular.$state} $state
     * @param {angular.$ionicHistory} $ionicHistory
     * @param {angular.Api} Api
     * @param {angular.Testing} Testing
     * @ngInject
     */
    var HomeController = function ($scope, $state, $ionicHistory, Api, Testing) {
        $scope.hideBackButton = $ionicHistory.backView() ? 'login' == $ionicHistory.backView().stateId : false;

        $scope.isTestCompleted = Api.getIsTestCompleted();

        if($scope.isTestCompleted) {
            $scope.resetResult = function () {
                Testing.resetResult().then(function () {
                    $state.go('test');
                })
            }
        }

    };

    controllers.controller('HomeController', HomeController);
});
