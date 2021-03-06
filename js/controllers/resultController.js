'use strict';

define([
    './module',
    'text!../../partials/loading.html'
], function (controllers, loadingTemplate) {

    /**
     * Result Controller - итоги прохождение теста
     *
     * @param {angular.$scope} $scope
     * @param {angular.Testing} Testing
     * @param {angular.$state} $state
     * @param {angular.$ionicPopup} $ionicPopup
     * @param {angular.$ionicLoading} $ionicPopup
     * @ngInject
     */
    var ResultController = function ($scope, Testing, $state, $ionicPopup, $ionicLoading) {
        $ionicLoading.show({
            hideOnStateChange: true,
            template: loadingTemplate
        });

        $scope.sections = [];

        Testing.getResult().then(function(result) {
            $scope.result = result;

            angular.forEach(result.groups, function(sections) {
                $scope.sections = $scope.sections.concat(sections);
            });

        }, function(error) {
            // в случае ошибки - вывести alert
            $ionicPopup.alert({
                title: 'Помилка',
                template: error
            });
       }).finally(function() {
            $ionicLoading.hide();
        });

    };

    controllers.controller('ResultController', ResultController);
});
