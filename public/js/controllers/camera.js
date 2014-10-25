'use strict';

define(['angular'], function (angular) {

    return angular.module('myApp.controllers')
        .controller('CameraCtrl', ['$scope', 'detector', function ($scope, detector) {
            $scope.send = detector.send;
            detector.detect(function(data) {
                console.log('detected -> ' + data);
            });
        }]);

});