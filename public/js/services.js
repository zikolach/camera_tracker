'use strict';

function Detector() {
    var detect = null;
    return {
        send: function(data) {
            console.log('send ==> ' + data);
            setTimeout(function() {
                if (!!detect && typeof detect === 'function') {
                    detect(data);
                }
            }, 1000);
        },
        detect: function(d) {
            detect = d;
        }
    };
}

define(['angular'], function(angular) {
    angular.module('myApp.services', [])

    .value('version', '0.0.0')

    .service('detector', Detector);

});