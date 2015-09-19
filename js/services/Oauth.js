"use strict";

var angular;

define(["./module", 'config'], function (services, Config, Api) {

    /**
     * Oauth
     *
     * @param {angular.$q} $q
     * @param {angular.$state} $state
     * @param {angular.$location} $location
     * @param {angular.Api} Api
     * @ngInject
     * @constructor
     */
    var Oauth = function ($q, $state, $location, Api) {
         var service = {};

        service.start = function () {
            var url = Config.oauth.url;

            if(url.indexOf('?') === -1) {
                url += '?';
            } else {
                url += '&';
            }

            url += 'response_type=code';

            url += '&client_id=' +  encodeURIComponent(Config.oauth.clientId);

            var redirect_uri = location.protocol + '//' + location.host + location.pathname + $state.href('login');

            url += '&redirect_uri=' + encodeURIComponent(redirect_uri);

            window.location.href = url;
        };

        service.finish = function () {
            var params = $location.search();
            var state = params.state;

            if(params.code) {

                var code = params.code;

                $location.search('code', null);
                $location.search('state', null);

                return Api.login(code, $location.absUrl());

            } else if( typeof params.error !== "undefined"  ) {
                 var code =  params.error || 'Unknown';
                 var message = params.message || 'Невідома помилка';

                 return $q.reject('Помилка ' + code + ': ' + message);
            } else {
                return $q.defer().promise;
            }
        }

         return service;
    };

    services.factory("Oauth", Oauth);
});