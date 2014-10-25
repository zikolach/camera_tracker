'use strict';

define([
    'angular',
    'app'
], function(angular, app) {

	return app.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'partials/index.html',
			controller: 'IndexCtrl'
		});
		$routeProvider.when('/camera', {
			templateUrl: 'partials/camera.html',
			controller: 'CameraCtrl'
		});
		$routeProvider.when('/credits', {
			templateUrl: 'partials/credits.html',
			controller: 'CreditsCtrl'
		});
		$routeProvider.otherwise({redirectTo: '/'});
	}]);

});