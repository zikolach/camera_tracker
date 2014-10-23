'use strict';

define(['angular'], function (angular) {

	/* Controllers */

	return angular.module('myApp.controllers', [])
		.controller('MyCtrl1', ['$scope', function ($scope) {
			$scope.scopedAppVersion = 123;
		}]);
});