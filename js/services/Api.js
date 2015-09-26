"use strict";

var angular;

define(["./module", 'config'], function (services, Config) {

    /**
     * Взаимодействие с серверов
     *
     * @param {angular.$http} $http
     * @param {angular.$q} $q
     * @param {angular.localStorageService} localStorageService
     * @param {angular.$state} $state
     * @ngInject
     * @constructor
     */
    var Api = function ($http, $q, localStorageService, $state) {

        var executeHttp = function (request) {
            return $http(request).then(function (response) {

                if (null === response.data) {
                    return jsonError(response);
                }

                if(response.data.error) {
                    return apiError(response.data.error);
                }

                return response.data;
            }, httpError);
        }

        var httpError = function (response) {
            if(500 === response.status) {
                return apiError(response.data && response.data.error ? response.data.error : null);
            }

            if(401 === response.status)
            {// сессия истекла
                session.expire = 0;
                service.isLogged();
                $state.go('home', {}, {location:'replace'});

                return sessionError();
            }

            return $q.reject('Помилка мережі: ' + response.status + ' ' + response.statusText);
        }

        var apiError = function (error) {
            if(error && "offline" === error.error_code) {
                return $q.reject(error.error_msg);
            }

            return $q.reject('Помилка серверу' + (error ? ' #' + error.error_code + ': ' + error.error_msg : ''));
        }

        var jsonError = function (response) {
            return $q.reject('Некорректна відповідь сервера');
        }

        var sessionError = function (error) {
            return $q.reject('Авторизуйтесь повторно');
        }

        var getHttpRequest = function () {
            return {
                method: 'get',
                url: 'api/',
                responseType: 'json',
                headers: service.isLogged() ? {
                    Authorization: 'Bearer ' + session.token
                } : null,

            };
        };

        var service = {};

        var session = localStorageService.get('session');

        /**
         * Проверить, авторизирован ли пользователь
         *
         * @return {boolean}
         */
        service.isLogged = function () {
            if(session && session.expire * 1E3 < (new Date).getTime()) {
                localStorageService.remove('session');
                session = null;
            }

            return !!(session && session.token);
        };

        service.isLogged();

        /**
         *
         * @param {string} code
         * @param {string} redirect_uri
         * @returns {angular.Promise}
         */
        service.login = function (code, redirect_uri) {

            var request = getHttpRequest();

            request.url += 'login';
            request.params = {code: code, redirect_uri: redirect_uri};

            return executeHttp(request).then(function (data) {
                session = {
                    token: data.token,
                    userType: data.user_type,
                    expire: Math.floor((new Date).getTime() / 1E3) + data.timeout
                };

                localStorageService.set('session', session);

            });
        };

        /**
         * Получить ответы пользователя
         */
        service.getAnswers = function() {

            if(angular.isDefined(session.answers)) {
                return $q.when(session.answers);
            }

            var request = getHttpRequest();

            request.url += 'answers';

            return executeHttp(request).then(function (data) {
                session.answers = data;
                return session.answers;
            });
        };

        service.saveAnswer = function (data) {
            if(service.saveAnswer.lastRequestStop) {
                service.saveAnswer.lastRequestStop.resolve();
            }

            service.saveAnswer.lastRequestStop = $q.defer();

            var request = getHttpRequest();

            request.url += 'answers';
            request.method = "POST";
            request.data = data;

            request.timeout = service.saveAnswer.lastRequestStop.promise;

            return executeHttp(request).then(function (data) {
                angular.extend(session.answers, data);

                return data;
            }, httpError);

        };

        return service;
    };

    services.factory("Api", Api);
});