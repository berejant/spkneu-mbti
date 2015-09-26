"use strict";

var angular;

define([
    "./module",
    "json!../../questions.json",
], function (services, questions) {

    /**
     * Сервис для проведения тестирования пользователя
     *
     * @param {angular.Api} Api
     * @param {angular.$q} $q
     * @ngInject
     * @constructor
     */
    var Testing = function (Api, $q) {

        var service = {};

        service.questionsCount = Object.keys(questions).length;

        var getAnswer = function(questionId) {
            return Api.getAnswers().then(function (answers) {
                return angular.isDefined(answers[questionId]) ? answers[questionId] : null;
            });
        }

        service.getQuestion = function (questionId) {
            questionId = parseInt(questionId);

            if(typeof questions[questionId] === "undefined") {
                return $q.when(null);
            }

            var question = questions[questionId];
            question.id = questionId;

            var nextId = 1 + questionId;
            question.nextId = angular.isDefined(questions[nextId]) ? nextId : null;

            return getAnswer(questionId).then(function(answer){
                question.selectedAnswerId = answer;
                return question;
            });
        }


        var lastSaveError = null;
        var saveQueue = {};

        service.saveAnswer = function(question) {
            saveQueue[question.id] = question.selectedAnswerId;

            Api.saveAnswer(saveQueue).then(function(responseData) {
                lastSaveError = null;

                // умная система отправки данных, для того чтобы в случае ошибок - данные сохранились при следующем вызове
                angular.forEach(responseData, function(value, key){
                    if(saveQueue[key] === value) {
                        delete saveQueue[key];
                    }
                });
            }, function (error) {
                if(Object.keys(saveQueue).length) {
                    lastSaveError = error;
                }
            });

            lastSaveError = null;
        }

        service.getLastServiceError = function () {
            return lastSaveError;
        }

        return service;
    };

    services.factory("Testing", Testing);
});