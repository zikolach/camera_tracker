(function(requirejs) {
    'use strict';

    requirejs.config({
        paths: {
            'sockjs': [window.sockjsURL],
            'jquery': [window.jqueryURL],
            'underscore': [window.underscoreURL]
        }
    });

    require(['sockjs', 'jquery'], function(SockJS, $, _) {
        console.log('Hello world!!!');

        var sock = null;
        var v = $('#v')[0],
            c = $('#c')[0],
            o = $('#o')[0],
            f = $('#fps'),
            capCtx = c.getContext('2d'),
            outCtx = o.getContext('2d'),
            width = 0, height = 0, fps = 0;

        var adjustSize = function() {
            width = $(v).width(), height = $(v).height();
            $(c).attr('width', width);
            $(c).attr('height', height);
            $(o).attr('width', width);
            $(o).attr('height', height);
        };

//        var createFramePartMessage = function(data) {
//            var PART_SIZE = 64 * 1024, // magic number
//                parts = Math.ceil(data.length / PART_SIZE),
//                chunks = [];
//            for (var i = 0; i < parts; i++) {
//                chunks.push(data.slice(PART_SIZE * i, PART_SIZE * i + PART_SIZE));
//            }
//            return chunks;
//        };

        var sendImage = function() {
            capCtx.drawImage(v, 0, 0, width, height);
            var data = c.toDataURL("image/jpeg", 0.5);
//            console.log(data);
            if (!!sock) {
                var ts = Date.now(),
                    buff = JSON.stringify({
                    timestamp: ts,
                    image: data
                });
//                console.log(data.length);
//                _.each(createFramePartMessage(buff), sock.send);
                sock.send(buff);
            }
        };

        var drawImage = function(data) {
            var img = new Image();
            img.addEventListener('load', function() {
                outCtx.drawImage(img, 0, 0);
                fps = Math.round(parseFloat(fps) * 0.9 + (1000 / (Date.now() - data.timestamp)) * 0.1);
                f.text(fps);
                setTimeout(sendImage, 0);
            });
            img.src = data.image;
        };

        var connect = function() {
            sock = new SockJS("/echo");
            sock.onopen = function() {
                console.log('open');
                adjustSize();
                setTimeout(sendImage, 0);
            };
            sock.onmessage = function(e) {
                drawImage(JSON.parse(e.data));
            };
            sock.onclose = function() {
                console.log('close');
            };
        };

        navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
                                  navigator.mozGetUserMedia || navigator.msGetUserMedia);
        if (navigator.getUserMedia) {
            navigator.getUserMedia({
                video: true,
                audio: false
            }, function(stream) {
                var url = window.URL || window.webkitURL;
                v.src = url ? url.createObjectURL(stream) : stream;
                v.play();
                connect();
            }, function(error) {
              alert('Something went wrong. (error code ' + error.code + ')');
            });
        }
        else {
            alert('Sorry, the browser you are using does not support getUserMedia');
        }
    });

})(requirejs);