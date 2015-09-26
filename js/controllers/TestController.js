'use strict';

define([
    './module',
    'json!../../questions.json',
    'text!../../partials/loading.html'
], function (controllers, questions, loadingTemplate) {

    /**
     * Test Controller - прохождение теста
     *
     * @param {angular.$scope} $scope
     * @param {angular.Api} Api
     * @param {angular.$ionicPopup} $ionicPopup
     * @param {angular.$ionicLoading} $ionicPopup
     * @ngInject
     */
    var TestController = function ($scope, Api, $ionicPopup, $ionicLoading) {
        var answers = [];

        var questionId = null;
        $scope.question = null;

        /**
         * Идентификаторы вопросов в очереди к показу
         * @type {Array}
         */
        var questionIdsQueue = Object.keys(questions);

        var nextQuestion = function () {
            if(!questionIdsQueue.length) {
                // complete test
                return true;
            }

            questionId = questionIdsQueue.shift();

            if(typeof questions[questionId] === "undefined") {
                return nextQuestion();
            }

            $scope.question = questions[questionId];
            $scope.question.id = questionId;
            if(answers[questionId] !== "undefined") {
                $scope.question.selectedAnswer = answers[questionId];
            }
        };

        $ionicLoading.show({
            hideOnStateChange: true,
            template: loadingTemplate
        });

        Api.getAnswers().then(function(result) {
            answers = result;

            if(Object.keys(answers).length !== questionIdsQueue.length) {
                var _newQueue = [];

                // если ответили не на все вопросы - значит отображать будем вопрос, на которые не дали ответа
                for(var i=0; i<questionIdsQueue.length; i++)
                {
                    var questionId = questionIdsQueue[i];
                    if(typeof answers[questionId] === "undefined") {
                        _newQueue.push(questionIdsQueue[i]);
                    }
                }
            }

            nextQuestion();
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

    controllers.controller('TestController', TestController);
});
