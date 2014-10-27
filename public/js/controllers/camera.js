'use strict';

define(['angular', 'jquery', 'underscore'], function (angular, $, _) {

    return angular.module('myApp.controllers')
        .controller('CameraCtrl', ['$scope', 'detector', function ($scope, detector) {
            $scope.detectFaces = true;
            $scope.detectRects = true;

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
                    if (_.isArray(data.faces) && !facesReceived) {
                        facesReceived = true;
                        $scope.features.faces = data.faces;
                    }
                    if (_.isArray(data.rects) || !rectsReceived) {
                        rectsReceived = true;
                        $scope.features.rects = data.rects;
                    }
                });
            };

            $scope.captureFrame = function(data) {
                if (facesReceived && rectsReceived) {
                    var features = [];
                    if ($scope.detectFaces) {
                        features.push('face');
                        facesReceived = false;
                    } else {
                        $scope.features.faces = [];
                    }
                    if ($scope.detectRects) {
                        features.push('rect');
                        rectsReceived = false;
                    } else {
                        $scope.features.rects = [];
                    }
                    detector.send(data, features);
                }
            };

            detector.detect(updateFeatures);
        }])
        .directive('capture', ['$timeout', function($timeout) {
            return {
                restrict: 'E',
                templateUrl: 'partials/capture.html',
                scope: {
                    timeout: '=timeout',
                    onCapture: '=onCapture',
                    features: '='
                },
                link: function link(scope, element, attrs) {

                    var defaultTimeout = 33,
                        width = 0, height = 0,
                        streaming = false,
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
                        context.strokeStyle = '#0000ff';
                        context.stroke();
                    };

                    var captureImage = function(v, capCtx) {
                            try {
                                capCtx.drawImage(v, 0, 0, width, height);
                                drawFeatures(capCtx);
                                scope.onCapture(capCtx.canvas.toDataURL("image/jpeg", 0.5));
                            } catch (e) {
                                // firefox bug - component not available
                                console.log(e);
                            }
                            captureTimer = $timeout(function() {
                                captureImage(v, capCtx);
                            }, scope.timeout || defaultTimeout);
                        };

                    var adjustSize = function(v, c) {
                        if (!streaming) {
                            width = $(v).width();
                            if (v.videoWidth > 0) {
                                height = v.videoHeight / (v.videoWidth / width);
                            } else {
                                height = $(v).height();
                            }
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
                                    captureTimer = $timeout(function() {
                                        captureImage(v, c.getContext('2d'));
                                    }, scope.timeout || defaultTimeout);
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
                        localStream.stop();
                        if (!!captureTimer) {
                            $timeout.cancel(captureTimer);
                        }
                    });

                    init();
                }
            };
        }]);

});