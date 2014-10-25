'use strict';

define([
	'angular',
    'modules',
	'controllers/index',
	'controllers/camera',
	'controllers/credits',
	'angular-route'
], function (angular) {

		// Declare app level module which depends on filters, and services

		return angular.module('myApp', [
			'ngRoute',
			'myApp.controllers'
		]);
});