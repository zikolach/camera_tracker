'use strict';

define([
	'angular',
	'controllers',
	'angular-route',
	], function (angular, controllers) {

		// Declare app level module which depends on filters, and services

		return angular.module('myApp', [
			'ngRoute',
			'myApp.controllers'
		]);
});