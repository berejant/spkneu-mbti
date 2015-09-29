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
     * @param {angular.localStorageService} localStorageService
     * @ngInject
     * @constructor
     */
    var Testing = function (Api, $q, localStorageService) {

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
        var storageSaveQueueKey = 'answersSaveQueue';
        var saveQueue = localStorageService.get(storageSaveQueueKey) || {};

        service.saveAnswer = function(question) {
            if(question) {
                saveQueue[question.id] = question.selectedAnswerId;
                localStorageService.set(storageSaveQueueKey, saveQueue);
            }

            var promise = Api.saveAnswer(saveQueue).then(function(responseData) {
                lastSaveError = null;

                // умная система отправки данных, для того чтобы в случае ошибок - данные сохранились при следующем вызове
                angular.forEach(responseData, function (value, key) {
                    if (saveQueue[key] === value) {
                        delete saveQueue[key];
                    }
                });

                if (Object.keys(saveQueue).length) {
                    localStorageService.set(storageSaveQueueKey, saveQueue);
                } else {
                    localStorageService.remove(storageSaveQueueKey);
                }

            }, function (error) {
                console.log(error);
                if(Object.keys(saveQueue).length) {
                    lastSaveError = error;
                }

                return error;
            });

            lastSaveError = null;

            return promise;
        };

        if (Object.keys(saveQueue).length) {
            // если есть ответы к сохранению (из хранилища сессии) - запускаем функцию для сохранение результатов
            service.saveAnswer();
        }

        service.getLastServiceError = function () {
            return lastSaveError;
        };

        service.getFirstUnansweredQuestionId = function () {
            return Api.getAnswers().then(function (answers) {
                for (var questionId in questions) {
                    if (questions.hasOwnProperty(questionId) && angular.isUndefined(answers[questionId]) && angular.isUndefined(saveQueue[questionId])) {
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