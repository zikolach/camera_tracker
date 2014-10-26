'use strict';

define(['angular', 'jquery', 'underscore'], function (angular, $, _) {

    return angular.module('myApp.controllers')
        .controller('CameraCtrl', ['$scope', 'detector', function ($scope, detector) {

            var width = 0, height = 0, fps = 0, streaming = false,
                faces = [], rects = [],
                captureTimer = null,
                facesReceived = true, rectsReceived = true;

            $scope.features = {
                rects: [],
                faces: []
            };

            var updateFeatures = function(data) {
                $scope.$apply(function() {
                    $scope.features.faces = data.faces || $scope.features.faces;
                    $scope.features.rects = data.rects || $scope.features.rects;
                    facesReceived = _.isArray(data.faces) || facesReceived;
                    rectsReceived = _.isArray(data.rects) || rectsReceived;
//                    console.log('faces - ' + facesReceived + ' rects ' + rectsReceived);
                });
            };

            $scope.captureFrame = function(data) {
                if (facesReceived && rectsReceived) {
                    detector.send(data);
                    facesReceived = false;
                    rectsReceived = false;
                }
            };

            detector.detect(updateFeatures);
        }])
        .directive('capture', ['$interval', function($interval) {
            return {
                restrict: 'E',
                templateUrl: 'partials/capture.html',
                scope: {
                    timeout: '=timeout',
                    onCapture: '=onCapture',
                    features: '='
                },
                link: function link(scope, element, attrs) {

                    var width = 0, height = 0,
                        streaming = false,
                        timeout = scope.timeout || 33,
                        localStream = null,
                        captureTimer = null;

                    var drawFeatures = function(context) {
                        // faces
                        context.beginPath();
                        _.each(scope.features.faces, function(face) {
                            context.rect(face.x, face.y, face.w, face.h);
                        });
                        context.strokeStyle = '#00ff00';
                        context.stroke();
                        // rects
                        context.beginPath();
                        _.each(scope.features.rects, function(rect) {
                            context.moveTo(rect.a.x, rect.a.y);
                            context.lineTo(rect.b.x, rect.b.y);
                            context.lineTo(rect.c.x, rect.c.y);
                            context.lineTo(rect.d.x, rect.d.y);
                            context.lineTo(rect.a.x, rect.a.y);
                        });
                        context.strokeStyle = '#ff0000';
                        context.stroke();
                    };

                    var captureImage = function(v, c) {
                            try {
                                var capCtx = c.getContext('2d');
                                capCtx.drawImage(v, 0, 0, width, height);
                                drawFeatures(capCtx);
                                var data = c.toDataURL("image/jpeg", 0.5);
                                scope.onCapture(data);
                            } catch (e) {
                                // firefox bug - component not available
                                console.log(e);
                            }
                        };

                    var adjustSize = function(v, c) {
                        console.log('Adjusting size...');
                        if (!streaming) {
                            width = $(v).width();
                            if (v.videoWidth > 0) {
                                height = v.videoHeight / (v.videoWidth / width);
                            } else {
                                height = $(v).height();
                            }
                            console.log('width ' + width + ' height ' + height);
                            $(v).attr('width', width);
                            $(v).attr('height', height);
                            $(c).attr('width', width);
                            $(c).attr('height', height);
                        }
                    };

                    var init = function() {
                        var v = $(element).children('#v')[0];
                        var c = $(element).children('#c')[0];
                        navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
                                                  navigator.mozGetUserMedia || navigator.msGetUserMedia);
                        if (navigator.getUserMedia) {
                            navigator.getUserMedia({
                                video: true,
                                audio: false
                            }, function(stream) {
                                localStream = stream;
                                if (navigator.mozGetUserMedia) {
                                    v.mozSrcObject = stream;
                                } else {
                                    var url = window.URL || window.webkitURL;
                                    v.src = url ? url.createObjectURL(stream) : stream;
                                }
                                $(v).on('canplay', function() {
                                    adjustSize(v, c);
                                    streaming = true;
                                    captureTimer = $interval(function() {
                                        captureImage(v, c);
                                    }, timeout);
                                    console.log(captureTimer);
                                });
                                v.play();
                            }, function(error) {
                              alert('Something went wrong. (error code ' + error.code + ')');
                            });
                        } else {
                            alert('Sorry, the browser you are using does not support getUserMedia');
                        }
                    };

                    scope.$on('$destroy', function() {
                        console.log("destroy");
                        localStream.stop();
                        if (!!captureTimer) {
                            $interval.cancel(captureTimer);
                        }
                    });

                    init();
                }
            };
        }]);

});