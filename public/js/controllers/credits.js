'use strict';

define(['angular'], function (angular) {

	return angular.module('myApp.controllers')

		.controller('CreditsCtrl', ['$scope', 'version', function ($scope, version) {
		    $scope.version = version;
		}]);
});