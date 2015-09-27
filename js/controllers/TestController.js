'use strict';

define([
    './module',
    'text!../../partials/loading.html'
], function (controllers, loadingTemplate) {

    /**
     * Test Controller - прохождение теста
     *
     * @param {angular.$scope} $scope
     * @param {angular.Testing} Testing
     * @param {angular.$state} $state
     * @param {angular.$ionicPopup} $ionicPopup
     * @param {angular.$ionicLoading} $ionicPopup
     * @ngInject
     */
    var TestController = function ($scope, Testing, $state, $ionicPopup, $ionicLoading) {
        $scope.question = {
            id: $state.params.questionId
        };

        $ionicLoading.show({
            hideOnStateChange: true,
            template: loadingTemplate
        });

        Testing.getQuestion($scope.question.id).then(function(question) {
            $scope.question = question;
        }, function(error) {
                // в случае ошибки - вывести alert
                $ionicPopup.alert({
                    title: 'Помилка',
                    template: error
                });
       }).finally(function() {
            $ionicLoading.hide();
        });

        $scope.next = function () {
            if($scope.question.selectedAnswerId) {

                var savePromise = Testing.saveAnswer($scope.question);
console.log($state.current);
                if (null !== $scope.question.nextId) {
                    $state.go($state.current.name, {questionId: $scope.question.nextId});
                } else {
                    savePromise.then(function() {
                       $state.go('test.result');
                    });
                }
            }
        }

        $scope.questionsCount = Testing.questionsCount;

        $scope.$watch(Testing.getLastServiceError, function(lastSaveError) {
            $scope.lastSaveError = lastSaveError;
        });

    };

    controllers.controller('TestController', TestController);
});
