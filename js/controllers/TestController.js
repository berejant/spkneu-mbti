'use strict';

define([
    './module'
], function (controllers) {

    /**
     * Test Controller
     *
     * @param {angular.$scope} $scope
     * @param {angular.Api} Api
     * @param {angular.$ionicPopup} $ionicPopup
     * @ngInject
     */
    var TestController = function ($scope, Api, $ionicPopup) {

        $scope.answers = [];

        $scope.currentQuestionId = null;

        Api.getAnswers().then(function(answers) {
            $scope.answers = answers;

        }, function(error) {
            // в случае ошибки - вывести alert
            $ionicPopup.alert({
                title: 'Помилка',
                template: error
            });

        });

    };

    controllers.controller('TestController', TestController);
});
