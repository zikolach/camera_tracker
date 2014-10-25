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
        'services'], function(angular) {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['myApp']);
        });
    });

//    require(['sockjs', 'jquery', 'underscore'], function(SockJS, $, _) {
//
//        var sock = null;
//        var v = $('#v')[0],
//            c = $('#c')[0],
//            o = $('#o')[0],
//            f = $('#fps'),
//            capCtx = c.getContext('2d'),
//            outCtx = o.getContext('2d'),
//            width = 0, height = 0, fps = 0, streaming = false,
//            faces = [], rects = [],
//            captureTimer = null;
//
//        var adjustSize = function() {
//            if (!streaming) {
//                width = $(v).width();
//                if (v.videoWidth > 0) {
//                    height = v.videoHeight / (v.videoWidth / width);
//                } else {
//                    height = $(v).height();
//                }
//                console.log('width ' + width + ' height ' + height);
//                $(v).attr('width', width);
//                $(v).attr('height', height);
//                $(c).attr('width', width);
//                $(c).attr('height', height);
//                $(o).attr('width', width);
//                $(o).attr('height', height);
//                streaming = true;
//                connect();
//            }
//        };
//
//        $(v).on('canplay', adjustSize);
//
//        var captureImage = function() {
//            try {
//                capCtx.drawImage(v, 0, 0, width, height);
//                capCtx.beginPath();
//                _.each(faces, function(face) {
//                    capCtx.rect(face.x, face.y, face.w, face.h);
//                });
//                capCtx.strokeStyle = '#00ff00';
//                capCtx.stroke();
//                capCtx.beginPath();
//                _.each(rects, function(rect) {
//                    capCtx.moveTo(rect.a.x, rect.a.y);
//                    capCtx.lineTo(rect.b.x, rect.b.y);
//                    capCtx.lineTo(rect.c.x, rect.c.y);
//                    capCtx.lineTo(rect.d.x, rect.d.y);
//                    capCtx.lineTo(rect.a.x, rect.a.y);
//                });
//                capCtx.strokeStyle = '#ff0000';
//                capCtx.stroke();
//            } catch (e) {
//                // firefox bug - component not available
//                clearTimeout(captureTimer);
//                captureTimer = setTimeout(captureImage, 1000);
//            }
//            var data = c.toDataURL("image/jpeg", 0.5);
//            if (!!sock) {
//                var ts = Date.now(),
//                    buff = JSON.stringify({
//                    timestamp: ts,
//                    image: data
//                });
//                sock.send(buff);
//            }
//        };
//
//        var drawImage = function(data) {
//            if (!!data.image) {
//                var img = new Image();
//                img.addEventListener('load', function() {
//                    outCtx.drawImage(img, 0, 0);
//                    fps = Math.round(parseFloat(fps) * 0.9 + (1000 / (Date.now() - data.timestamp)) * 0.1);
//                    f.text(fps);
//                    clearTimeout(captureTimer);
//                    captureTimer = setTimeout(captureImage, 0);
//                });
//                img.src = data.image;
//            } else {
//                clearTimeout(captureTimer);
//                captureTimer = setTimeout(captureImage, 0);
//            }
//            faces = data.faces || faces;
//            rects = data.rects || rects;
//        };
//
//        var connect = function() {
//            sock = new SockJS("/echo");
//            sock.onopen = function() {
//                console.log('open');
//                setTimeout(captureImage, 0);
//            };
//            sock.onmessage = function(e) {
//                drawImage(JSON.parse(e.data));
//            };
//            sock.onclose = function() {
//                console.log('close');
//            };
//        };
//
//        navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
//                                  navigator.mozGetUserMedia || navigator.msGetUserMedia);
//        if (navigator.getUserMedia) {
//            navigator.getUserMedia({
//                video: true,
//                audio: false
//            }, function(stream) {
//                if (navigator.mozGetUserMedia) {
//                    v.mozSrcObject = stream;
//                } else {
//                    var url = window.URL || window.webkitURL;
//                    v.src = url ? url.createObjectURL(stream) : stream;
//                }
//                v.play();
//            }, function(error) {
//              alert('Something went wrong. (error code ' + error.code + ')');
//            });
//        }
//        else {
//            alert('Sorry, the browser you are using does not support getUserMedia');
//        }
//    });

})(requirejs);