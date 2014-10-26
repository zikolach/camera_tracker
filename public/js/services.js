'use strict';

define(['angular', 'sockjs'], function(angular, SockJS) {

    function Detector() {
        var sock = null;
        var detect = null;
        var connect = function() {
            sock = new SockJS("/echo");
            sock.onopen = function() {
                console.log('open');
            };
            sock.onmessage = function(e) {
                if (!!detect && typeof detect === 'function') {
                    detect(JSON.parse(e.data));
                }
            };
            sock.onclose = function() {
                console.log('close');
            };
        };
        connect();

        return {
            send: function(data, features) {
                if (!!sock) {
                    var ts = Date.now(),
                        buff = JSON.stringify({
                        timestamp: ts,
                        image: data,
                        features: features
                    });
                    sock.send(buff);
                }
            },
            detect: function(d) {
                detect = d;
            }
        };
    };

    angular.module('myApp.services', [])

    .value('version', '0.0.0')

    .service('detector', Detector);

});