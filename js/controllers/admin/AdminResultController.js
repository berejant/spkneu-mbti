'use strict';

define([
    './../module',
    'text!../../../partials/loading.html'
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
    var AdminResultController = function ($scope, Testing, $state, $ionicPopup, $ionicLoading) {
        $ionicLoading.show({
            hideOnStateChange: true,
            template: loadingTemplate
        });

        $scope.sections = [];

        Testing.getAdminResult($state.params.studentId).then(function(result) {
            $scope.result = result;

            angular.forEach(result.groups, function(sections) {
                $scope.sections = $scope.sections.concat(sections);
            });

        }, function(error) {
            $ionicPopup.alert({
                title: 'Помилка',
                template: error
            });
        }).finally(function() {
            $ionicLoading.hide();
        });

    };

    controllers.controller('AdminResultController', AdminResultController);
});
