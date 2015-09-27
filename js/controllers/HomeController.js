'use strict';

define(['./module'], function (controllers) {

    /**
     * Home Controller
     *
     * @param {angular.$scope} $scope
     * @param {angular.$state} $state
     * @param {angular.$ionicHistory} $ionicHistory
     * @param {angular.$ionicPopup} $ionicPopup
     * @param {angular.Api} Api
     * @param {angular.Testing} Testing
     * @ngInject
     */
    var HomeController = function ($scope, $state, $ionicHistory, $ionicPopup, Api, Testing) {
        $scope.hideBackButton = $ionicHistory.backView() ? 'login' == $ionicHistory.backView().stateId : false;

        $scope.isTestCompleted = Api.getIsTestCompleted();

        if($scope.isTestCompleted) {
            $scope.resetResult = function () {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Підтвердження',
                    template: 'Ви дійсно хочете видалити результати та пройти тест знову?',
                    okText: 'Так',
                    cancelText: 'Ні'
                });

                confirmPopup.then(function(confirmed) {
                    if(confirmed) {
                        Testing.resetResult().then(function () {
                            $state.go('test');
                        })
                    }
                });
            }
        }

    };

    controllers.controller('HomeController', HomeController);
});
