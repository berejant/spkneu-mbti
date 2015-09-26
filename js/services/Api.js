"use strict";

var angular;

define(["./module", 'config'], function (services, Config) {

    /**
     * Oauth
     *
     * @param {angular.$http} $http
     * @param {angular.$q} $q
     * @param {angular.localStorageService} localStorageService
     * @param {angualr.$state} $state
     * @ngInject
     * @constructor
     */
    var Api;

    Api = function ($http, $q, localStorageService, $state) {

        var httpError = function (response) {
            if(500 === response.status && response.data && response.data.error) {
                return apiError(response.data.error);
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
            return $q.reject('Помилка серверу #' + error.error_code + ': ' + error.error_msg);
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
        }

        service.isLogged();

        if(session && session.expire * 1E3 < (new Date).getTime()) {
            localStorageService.remove('session');
            session = null;
        }

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

            return $http(request).then(function (response) {

                if (null === response.data) {
                    return jsonError(response);
                }

                session = {
                    token: response.data.token,
                    userType: response.data.user_type,
                    expire: Math.floor((new Date).getTime() / 1E3) + response.data.timeout
                };

                localStorageService.set('session', session);

            }, httpError);
        };

        /**
         * Получить ответы пользователя
         */
        service.getAnswers = function() {

            var request = getHttpRequest();

            request.url += 'answers';

            return $http(request).then(function (response) {

                if (null === response.data) {
                    return jsonError(response);
                }

                return response.data;
            }, httpError);
        };

        return service;
    };

    services.factory("Api", Api);
});