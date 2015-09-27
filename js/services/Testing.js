"use strict";

var angular;

define([
    "./module",
    "json!../../config/questions.json",
    "json!../../config/personTypes.json",
], function (services, questions, personTypes) {

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
        };

        service.getQuestion = function (questionId) {
            if(typeof questions[questionId] === "undefined") {
                return $q.when(null);
            }

            var question = questions[questionId];
            question.id = questionId;

            return getAnswer(questionId).then(function(answer){
                question.selectedAnswerId = answer;
                return question;
            });
        };


        var lastSaveError = null;
        var saveQueue = {};

        service.saveAnswer = function(question) {
            saveQueue[question.id] = question.selectedAnswerId;

            var promise = Api.saveAnswer(saveQueue).then(function(responseData) {
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

                return error;
            });

            lastSaveError = null;

            return promise;
        };

        service.getLastServiceError = function () {
            return lastSaveError;
        };

        service.getFirstUnansweredQuestionId = function (ignoreQuestionId) {
            return Api.getAnswers().then(function (answers) {
                for (var questionId in questions) {
                    if (questionId !== ignoreQuestionId && questions.hasOwnProperty(questionId) && angular.isUndefined(answers[questionId])) {
                        return questionId;
                    }
                }

                return null;
            });
        };

        service.getResult = function () {
            return Api.getResult().then(function(result){
                result.personType = personTypes[result.formula];

                return result;
            });
        }

        service.resetResult = function () {
            return Api.resetResult().then(function() {
                saveQueue = {};
                lastSaveError = null;
            });
        };

        return service;
    };

    services.factory("Testing", Testing);
});