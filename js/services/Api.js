"use strict";

var angular;

define(["./module", 'config'], function (services, Config) {

    /**
     * Oauth
     *
     * @param {angular.$http} $http
     * @param {angular.$q} $q
     * @ngInject
     * @constructor
     */
    var Api;

    Api = function ($http, $q) {
        var service = {};

        var  accessToken = null;

        var httpError = function (response) {
            return $q.reject('Помилка мережі:' + repsonse.status + ' ' + response.statusText);
        }

        var jsonError = function (response) {
            return $q.reject('Некорректна відповідь сервера');
        }

        var getHttpRequest = function () {
            return {
                method: 'get',
                url: 'api/',
                responseType: 'json'
            };
        }

        /**
         *
         * @param {string} code
         * @param {string} redirect_uri
         * @returns {angular.Promise}
         */
        service.login = function (code, redirect_uri) {

            var request = getHttpRequest();

            request.url += 'getAccessToken';
            request.params = {code: code, redirect_uri: redirect_uri};

            return $http(request).then(function (response) {

                if (null === response.data) {
                    return jsonError(response);
                }

                console.log(response.data);
            }, httpError);
        };

        /**
         * Проверить, авторизирован ли пользователь
         *
         * @return {boolean}
         */
        service.isLogged = function () {
            return false;
        }

        return service;
    };

    services.factory("Api", Api);
});