(function(requirejs) {
    'use strict';

    requirejs.config({
        paths: {
            'sockjs': [window.sockjsURL],
            'jquery': [window.jqueryURL],
            'underscore': [window.underscoreURL],
            'angular': [window.angularURL],
            'angular-route': [window.angularRouteURL],
            'bootstrap': [window.bootstrapURL]
        },
        shim: {
        	'angular' : {'exports' : 'angular'},
        	'angular-route': ['angular'],
        	shim: { "bootstrap": [ "jquery" ] }
        },
        priority: [
            'angular'
        ]
    });

    require([
        'angular',
        'angular-route',
        'app',
        'routes',
        'services',
        'modules'], function(angular) {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['myApp']);
        });
    });

})(requirejs);