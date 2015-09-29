"use strict";

var angular;

define([
    "./module",
    'Config'
], function (services, Config) {

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
        };

        var httpError = function (response) {
            if(500 === response.status) {
                return apiError(response.data && response.data.error ? response.data.error : null);
            }
console.log(response);
            return $q.reject('Помилка мережі' + ( response.status>0 ||response.statusText ? ': ' + response.status + ' ' + response.statusText : ''));
        };

        var apiError = function (error) {
            if(error && "offline" === error.error_code) {
                return $q.reject(error.error_msg);
            }

            if(error && "unauthorized" === error.error_code) {
                session.expire = 0;
                service.isLogged();
                $state.go('home', {}, {location:'replace'});

                return sessionError();
            }

            error.type = "API";

            error.toString = function() {
                return 'Помилка серверу' + (error ? ' #' + error.error_code + ': ' + error.error_msg : '');
            }

            return $q.reject(error);
        };

        var jsonError = function (response) {
            return $q.reject('Некорректна відповідь сервера');
        };

        var sessionError = function (error) {
            return $q.reject('Авторизуйтесь повторно');
        };

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
                localStorageService.clearAll();
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

                if(data.is_test_completed) {
                    localStorageService.set('isTestCompleted', true);
                }

                return true;
            });
        };

        /**
         * Выйти из сессии
         * @returns {boolean}
         */
        service.logout = function () {

            if(session) {
                var request = getHttpRequest();
                request.url += 'logout';
                executeHttp(request);

                session.expire = 0;

                return !service.isLogged();
            }

            return true;
        }

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

            var request = getHttpRequest();

            request.url += 'answers';
            request.method = "POST";
            request.data = data;

            var isRequestStopped = false;

            service.saveAnswer.lastRequestStop = $q.defer();
            request.timeout = service.saveAnswer.lastRequestStop.promise;
            request.timeout.then(function(){
                isRequestStopped = true;
            })

            return executeHttp(request).then(function (data) {
                session.answers =  session.answers || {};
                angular.extend(session.answers, data);

                return data;
            }, function(error) {
                if(isRequestStopped) {
                    console.log('stopped');
                    return {};
                }
                return $q.reject(error);
            });

        };

        service.getResult = function () {
            var request = getHttpRequest();
            request.url += 'result';

            return executeHttp(request).then(function(result) {
                localStorageService.set('isTestCompleted', true);

                return result;
            });
        }

        service.getIsTestCompleted = function () {
            return !!localStorageService.get('isTestCompleted');
        }

        service.resetResult = function() {
            var request = getHttpRequest();

            request.method = "DELETE";
            request.url += 'result';

            return executeHttp(request).then(function(result) {
                localStorageService.remove('isTestCompleted');
                delete session.answers;
            });
        }


        return service;
    };

    services.factory("Api", Api);
});