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

        service.getQuestion = function (questionId) {
            if(typeof questions[questionId] === "undefined") {
                return $q.when(null);
            }

            var question = questions[questionId];
            question.id = questionId;

            var nextId = ++questionId
            question.nextId = typeof questions[nextId] ? nextId : null;

            return getAnswer(questionId).then(function(asnwer){
                question.answer = asnwer;
                return question;
            });
        }

        var getAnswer = function(questionId) {
            return Api.getAnswers().then(function (answers) {
                return typeof answers[questionId] ? answers[questionId] : null;
            });
        }

        return service;
    };

    services.factory("Testing", Testing);
});