'use strict';

define([
	'angular',
	'controllers/index',
	'controllers/camera',
	'controllers/credits',
	'angular-route'
], function (angular) {

		return angular.module('myApp', [
			'ngRoute',
			'myApp.controllers'
		]);
});