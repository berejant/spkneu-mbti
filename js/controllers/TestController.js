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
     * @param {angular.$q} $q
     * @ngInject
     */
    var TestController = function ($scope, Testing, $state, $ionicPopup, $ionicLoading, $q) {

        $scope.question = {
            id: $state.params.questionId
        };

        var goToNextQuestion = function(locationMode, waitingMoveToResultPagePromise) {
            return Testing.getFirstUnansweredQuestionId($scope.question.id).then(function(questionId){
                if(questionId !== null) {
                    return $state.go($state.current.name, {questionId: questionId}, {location: locationMode});
                } else {
                    return $q.when(waitingMoveToResultPagePromise).then(function(){
                        return $state.go('result', {}, {location:locationMode});
                    });
                }
            });
        }

        $ionicLoading.show({
            hideOnStateChange: true,
            template: loadingTemplate
        });

        if(!$scope.question.id) {
            goToNextQuestion('replace');
            // дожидаемся загрузки первого вопроса. Текущий контроллер нам не нужен
            return;
        }

        Testing.getQuestion($scope.question.id).then(function(question) {
            $scope.question = question;

            if(!$scope.question) {
                $state.go('home', {}, {location:'replace'});
            }
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

                goToNextQuestion(true, savePromise);
            }
        }

        $scope.questionsCount = Testing.questionsCount;

        $scope.$watch(Testing.getLastServiceError, function(lastSaveError) {
            $scope.lastSaveError = lastSaveError;
        });

    };

    controllers.controller('TestController', TestController);
});
