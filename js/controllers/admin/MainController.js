'use strict';

define([
    './../module'
], function (controllers) {

    /**
     * Home Controller
     *
     * @param {angular.$scope} $scope
     * @param {angular.$state} $state
     * @param {angular.$ionicPopup} $ionicPopup
     * @param {angular.Api} Api
     * @param {angular.Testing} Testing
     * @ngInject
     */
    var AdminController = function ($scope, $state,$ionicPopup, Api, Testing) {

        var showError = function (error) {
            $ionicPopup.alert({title:'Помилка', template:error});
        };

        if( 'admin' !== Api.getUserType() ) {
            $state.go('home', {}, {location:'replace'});
            return;
        }

        $scope.personTypes = Testing.getPersonTypes();

        Api.getGroups().then(function(groups) {
            $scope.groups = groups;
        }, showError);

        $scope.filters = {
            groupId: null
        };
        $scope.result = [];

        $scope.$watchCollection('filters', function(filters) {
            Api.getAdminResults(filters).then(function(result){
                $scope.result = result;
            }, showError);
        });

    };

    controllers.controller('AdminController', AdminController);
});
