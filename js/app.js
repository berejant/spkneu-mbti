define([
    'angular',
    'config',
    './controllers/index',
    './directives/index',
    './filters/index',
    './services/index',
], function (ng, Config) {
    'use strict';

    /**
     * Run handler - устанавливает базовые переменные
     *
     * @param {angular.$rootScope} $rootScope - The Root Scope
     * @param {angular.$cookies} $cookies - Angular Cookies Service
     * @param {angular.$location} $location - Angular Location Service
     * @ngInject
     */
    var run = function ($rootScope) {
        $rootScope.title = Config.title;
    };

    return ng.module('mbti', [
        'ngRoute',
        'mbti.services',
        'mbti.controllers',
        'mbti.filters',
        'mbti.directives'
    ]).run(run);
});