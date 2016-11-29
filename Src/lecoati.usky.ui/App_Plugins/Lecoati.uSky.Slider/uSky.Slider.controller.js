angular.module("umbraco").directive('ngFocus', ['$parse', function ($parse) {
    return function (scope, element, attr) {
        var fn = $parse(attr['ngFocus']);
        element.bind('focus', function (event) {
            scope.$apply(function () {
                fn(scope, { $event: event });
            });
        });
    }
}]);

angular.module("umbraco").directive('ngBlur', ['$parse', function ($parse) {
    return function (scope, element, attr) {
        var fn = $parse(attr['ngBlur']);
        element.bind('blur', function (event) {
            scope.$apply(function () {
                fn(scope, { $event: event });
            });
        });
    }
}]);

angular.module("umbraco")
    .controller("uSky.Slider.controller",
    function ($scope, $http, assetsService, $rootScope, dialogService, mediaResource, imageHelper, $timeout, $window) {

        // Text default sizes
        $scope.sizes = ["9", "10", "11", "12", "13", "14", "16", "18", "24", "28", "36", "48", "64", "72"];

        // Slide transition
        $scope.dataTransition = [
            "random",
            "boxslide",
            "boxfade",
            "slotzoom-horizontal",
            "slotslide-horizontal",
            "slotfade-horizontal",
            "slotzoom-vertical",
            "slotslide-vertical",
            "slotfade-vertical",
            "curtain-1",
            "curtain-2",
            "curtain-3",
            "slideleft",
            "slideright",
            "slideup",
            "slidedown",
            "fade"
        ];

        // Easing
        $scope.dataEasing = [
            "",
            "Linear.easeNone",
            "Power0.easeIn",
            "Power0.easeInOut",
            "Power0.easeOut",
            "Power1.easeIn",
            "Power1.easeInOut",
            "Power1.easeOut",
            "Power2.easeIn",
            "Power2.easeInOut",
            "Power2.easeOut",
            "Power3.easeIn",
            "Power3.easeInOut",
            "Power3.easeOut",
            "Power4.easeIn",
            "Power4.easeInOut",
            "Power4.easeOut",
            "Quad.easeIn",
            "Quad.easeInOut",
            "Quad.easeOut",
            "Cubic.easeIn",
            "Cubic.easeInOut",
            "Cubic.easeOut",
            "Quart.easeIn",
            "Quart.easeInOut",
            "Quart.easeOut",
            "Quint.easeIn",
            "Quint.easeInOut",
            "Quint.easeOut",
            "Strong.easeIn",
            "Strong.easeInOut",
            "Strong.easeOut",
            "Back.easeIn",
            "Back.easeInOut",
            "Back.easeOut",
            "Bounce.easeIn",
            "Bounce.easeInOut",
            "Bounce.easeOut",
            "Circ.easeIn",
            "Circ.easeInOut",
            "Circ.easeOut",
            "Elastic.easeIn",
            "Elastic.easeInOut",
            "Elastic.easeOut",
            "Expo.easeIn",
            "Expo.easeInOut",
            "Expo.easeOut",
            "Sine.easeIn",
            "Sine.easeInOut",
            "Sine.easeOut",
            "SlowMo.ease",
        ];

        // Animation
        $scope.animationClasses = [
            //note: first item will be the default
            { value: "", alias: "none"}, 
            { value: "sft", alias: "ShortfromTop" },
            { value: "sfb", alias: "ShortfromBottom" },
            { value: "sfr", alias: "ShortfromRight" },
            { value: "sfl", alias: "ShortfromLeft" },
            { value: "lft", alias: "LongfromTop" },
            { value: "lfb", alias: "LongfromBottom" },
            { value: "lfr", alias: "LongfromRight" },
            { value: "lfl", alias: "LongfromLeft" },
            { value: "fade", alias: "Fading" }
        ];

        // Alignment
        $scope.alignment = [
            "top left",
            "top center",
            "top right",
            "center left",
            "center center",
            "center right",
            "bottom left",
            "bottom center",
            "bottom right",
        ];

        // Fit
        $scope.fit = [
            "auto",
            "cover",
            "contain",
            "custom"
        ];

        // Split
        $scope.split = [
            "none",
            "chars",
            "words",
            "lines"
        ]

        // Slide slot amount
        $scope.dataSlotamount = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        //$scope.selectedSlideIndex = -1;
        //$scope.selectedLayerIndex = -1;
        $scope.currentSlide;

        if (!$scope.model.config.mediaStartNode)
            $scope.model.config.mediaStartNode = -1;

        /********************************************************************************************/
        /* Slide managment */
        /********************************************************************************************/

        /* add a new slide */
        $scope.addSlide = function () {
            $scope.model.value.slides.splice($scope.model.value.slides.length + 1, 0,
            {
                dataTransition: "random",
                dataSlotamount: 0,
                dataDelay: 0,
                dataDuration: 0,
                dataEase: "",
                dataMasterspeed: 0,
                dataThumbMediaId: -1,
                dataThumbMediaSrc: '',
                dataThumbMediaThumbnail: '',
                bgMediaId: -1,
                bgMediaSrc: '',
                bgMediaThumbnail: '',
                bgKenBurns: false,
                bgColor: '',
                bgAlt: '',
                bgFit: '',
                bgFitEnd: '',
                bgFitSelect: '',
                bgFitEndSelect: '',
                bgPosition: '',
                bgPositionEnd: '',
                //previousParentWidth: $scope.fluidWidth,
                //previousParentHeight: $scope.fluidHeight,
                layers: []
            });
        }

        /* duplicate slide */
        $scope.duplicateSlide = function (slide, $index) {
            $scope.model.value.slides.splice($index + 1, 0,
                angular.copy(slide)
            );
        }

        /* edit the current slide */
        $scope.editSlide = function (slide) {
            $scope.currentSlide = slide;

            if ($scope.currentSlide.layers && $scope.currentSlide.layers.length > 0) {
                $scope.currentLayer = $scope.currentSlide.layers[0];
            }
            else {
                $scope.currentLayer = undefined;
            }
            $scope.loadGoogleFont($scope.currentSlide);
        }

        /* remove slide */
        $scope.removeSlide = function ($index) {
            $scope.model.value.slides.splice($index, 1);
            $scope.closeEditSlide();
        }

        /* close slide editing */
        $scope.closeEditSlide = function () {
            $scope.currentSlide = undefined;
        }

        /* remove media slide background */
        $scope.removeMedia = function (slide) {
            slide.bgColor = '';
            slide.bgMediaThumbnail = '';
            slide.bgMediaId = -1;
            slide.bgMediaSrc = ''
        }

        /* add slide media background*/
        $scope.addMedia = function (slide) {
            dialogService.mediaPicker({
                multiPicker: false,
                startNodeId : $scope.model.config.mediaStartNode,
                callback: function (data) {

                    //it's only a single selector, so make it into an array
                    if (!false) {
                        data = [data];
                    }

                    _.each(data, function (media, i) {
                        media.thumbnail = imageHelper.getThumbnailFromPath(media.image);
                        slide.bgMediaId = media.id;
                        slide.bgMediaSrc = media.image;
                        slide.bgMediaThumbnail = media.thumbnail;
                    });

                }
            });
        };

        /* remove data-thumb media */
        $scope.removeDataThumbMedia = function (slide) {
            slide.dataThumbMediaThumbnail = '';
            slide.dataThumbMediaId = -1;
            slide.dataThumbMediaSrc = ''
        }

        /* add data-thumb media */
        $scope.addDataThumbMedia = function (slide) {
            dialogService.mediaPicker({
                multiPicker: false,
                startNodeId: $scope.model.config.mediaStartNode,
                callback: function (data) {

                    //it's only a single selector, so make it into an array
                    if (!false) {
                        data = [data];
                    }

                    _.each(data, function (media, i) {
                        media.thumbnail = imageHelper.getThumbnailFromPath(media.image);
                        slide.dataThumbMediaId = media.id;
                        slide.dataThumbMediaSrc = media.image;
                        slide.dataThumbMediaThumbnail = media.thumbnail;
                    });

                }
            });
        };

        /* update bg-fit combobox */
        $scope.setBgFit = function(slide) {
            if (slide.bgFitSelect == 'custom')
                slide.bgFit = '100'
            else
                slide.bgFit = slide.bgFitSelect
        }

        /* update bg-fit-end combobox */
        $scope.setBgFitEnd = function (slide) {
            if (slide.bgFitEndSelect == 'custom')
                slide.bgFitEnd = '100'
            else
                slide.bgFitEnd = slide.bgFitEndSelect
        }

        /********************************************************************************************/
        /* Layer managment */
        /********************************************************************************************/

        $scope.currentLayer;
        $scope.overLayer;

        $scope.setOverLayer = function (layer) {
            $scope.overLayer = layer;
        }

        $scope.initOverLayer = function (layer) {
            $scope.overLayer = undefined;
        }

        $scope.editLayer = function (layer) {
            $scope.currentLayer = layer;
        }

        $scope.removeLayer = function (index) {
            $scope.currentSlide.layers.splice(index, 1);
        };

        $scope.loadGoogleFont = function (slide) {
            var wf = document.createElement('script');
            wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
                      '://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js';
            wf.type = 'text/javascript';
            wf.async = 'true';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(wf, s);
            WebFontConfig = {
                google: {
                    families: []
                }
            };
            if (slide.layers) {
                if (slide.layers.length > 0) {
                    $scope.updateGoogleFont(slide);
                }
            }
        };

        $scope.updateGoogleFont = function (slide) {
            var families = _.map(slide.layers, function (layer) {
                return layer.fontName;
            });
            WebFontConfig.google.families = families;
        };

        $scope.addTextLayer = function () {
            if ($scope.currentSlide.layers == undefined) { $scope.currentSlide.layers = []; }
            $scope.currentSlide.layers.splice($scope.currentSlide.layers.length + 1, 0, {
                name: "Text " + ($scope.currentSlide.layers.length + 1),
                index: ($scope.currentSlide.layers.length + 1),
                mediaName: "",
                content: "Lorem lipsum",
                type: "text",
                animationClass: $scope.animationClasses[0],
                dataX: 0,
                dataY: 0,
                dataSpeed: 1000,
                dataEndSpeed: 1000,
                dataStart: 800,
                dataEasing: "",
                dataSplitIn: "none",
                dataSplitOut: "none",
                dataElementDelay: 0,
                width: "",
                height: "",
                color: "",
                fontSize: "",
                fontStyle: "",
                bgColor: "",
                padding: "",
                customCss: "",
                customStyle: "",
                customIn: "",
                customOut: ""
                //dataEndeasing: "0",
                //dataCaptionhidden: "0"
            });
            $scope.currentLayer = $scope.currentSlide.layers[$scope.currentSlide.layers.length -1];
        }

        $scope.addLinkLayer = function () {
            dialogService.linkPicker({
                multiPicker: false,
                callback: function (data) {

                    //it's only a single selector, so make it into an array
                    if (!false) {
                        data = [data];
                    }

                    _.each(data, function (link, i) {
                        if ($scope.currentSlide.layers == undefined) { $scope.currentSlide.layers = []; }
                        $scope.currentSlide.layers.splice($scope.currentSlide.layers.length + 1, 0, {
                            name: "Link " + ($scope.currentSlide.layers.length + 1),
                            content: link,
                            type: "link",
                            animationClass: "sft",
                            dataX: "0",
                            dataY: "0",
                            dataSpeed: "1000",
                            dataStart: "800",
                            dataEasing: "",
                            width: 200,
                            height: "",
                            color: "",
                            fontSize: "",
                            fontStyle: "",
                            fontName: "",
                            padding: "",
                            customCss: "",
                            cssClass: "btn btn-default"
                            //dataEndspeed: "0",
                            //dataEndeasing: "0",
                            //dataEndspeed: "0",
                            //dataCaptionhidden: "0"
                        });
                        $scope.currentLayer = $scope.currentSlide.layers[$scope.currentSlide.layers.length - 1];
                    });

                }
            });
        }

        $scope.addPictureLayer = function () {
            dialogService.mediaPicker({
                multiPicker: false,
                callback: function (data) {

                    //it's only a single selector, so make it into an array
                    if (!false) {
                        data = [data];
                    }

                    _.each(data, function (media, i) {

                        media.thumbnail = imageHelper.getThumbnailFromPath(media.image);
                        if ($scope.currentSlide.layers == undefined) { $scope.currentSlide.layers = []; }
                        $scope.currentSlide.layers.splice($scope.currentSlide.layers.length + 1, 0, {
                            name: "Image " + ($scope.currentSlide.layers.length + 1),
                            index: ($scope.currentSlide.layers.length + 1),
                            mediaName: media.name,
                            content: media.image,
                            type: "image",
                            animationClass: $scope.animationClasses[0],
                            dataX: 0,
                            dataY: 0,
                            dataSpeed: 1000,
                            dataEndSpeed: 1000,
                            dataStart: 800,
                            dataEasing: "",
                            dataSplitIn: "none",
                            dataSplitOut: "none",
                            width: 200,
                            height: "",
                            color: "",
                            fontSize: "",
                            fontStyle: "",
                            padding: "",
                            customCss: "",
                            customStyle: "",
                            customIn: "",
                            customOut: ""
                            //dataEndeasing: "0",
                            //dataCaptionhidden: "0"
                        });
                        $scope.currentLayer = $scope.currentSlide.layers[$scope.currentSlide.layers.length - 1];
                        $scope.setLayerName($scope.currentLayer);
                    });

                }
            });
        }

        $scope.addMovieLayer = function () {

            dialogService.embedDialog({
                callback: function (data) {
                    if ($scope.currentSlide.layers == undefined) { $scope.currentSlide.layers = []; }
                    $scope.currentSlide.layers.splice($scope.currentSlide.layers.length + 1, 0, {
                        name: "Embed " + ($scope.currentSlide.layers.length + 1),
                        content: data,
                        type: "embed",
                    });
                    $scope.currentLayer = $scope.currentSlide.layers[$scope.currentSlide.layers.length - 1];
                }
            });

        };

        $scope.setSliderStyle = function () {
            if ($scope.model.value && $scope.currentSlide) {
                return {
                    'background-color': $scope.currentSlide.bgColor,
                    'background-image': 'url(' + $scope.currentSlide.bgMediaSrc + ')',
                    'height': $scope.model.value.editorHeight + 'px',
                    'background-size':  $scope.model.config.imageFullWidth == 0 ? 'cover' : '100%',
                    'background-position': $scope.currentSlide.bgPosition
                }
            }
        };

        $scope.setSliderHeight = function () {
            if ($scope.model.value && $scope.currentSlide) {
                return {
                    'width': $scope.model.value.editorWidth + 'px'
                }
            }
        };

        $scope.setLayerName = function(layer) {
            if (layer) {
                if (layer.type == "text") {
                    layer.name = layer.content;
                }
                else if (layer.type == "image" && layer.mediaName) {
                    layer.name = layer.mediaName
                } else {
                    layer.name = layer.index;
                }
            }
        }

        $scope.setLayerStyle = function (layer) {
            if (layer) {
                return {
                    'top': layer.dataY,
                    'left': layer.dataX,
                    'width': layer.width + 'px',
                    'height': layer.height + 'px'
                }
            }
        };

        $scope.setLayerStyleInto = function (layer) {
            if (layer) {
                return {
                    'background-color': layer.backgroundColor,
                    'font-size': layer.fontSize + 'px',
                    'font-family': "'" + layer.fontName + "'",
                    'line-height': layer.fontSize + 'px',
                    'color': layer.color,
                    'padding': layer.padding + 'px'
                }
            }
        };

        /********************************************************************************************/
        /* General */
        /********************************************************************************************/

        $scope.sortableOptions = {
            handle: ".icon-navigation",
            delay: 150,
            distance: 5,
            update: function (e, ui) {
            },
            stop: function (e, ui) {
            }
        };

        var width = $scope.model.config.width ? $scope.model.config.width : 1140;
        var height = $scope.model.config.height ? $scope.model.config.height : 550;
        var editorWidth = $scope.model.config.editorWidth ? $scope.model.config.editorWidth : 1140;
        var editorHeight = $scope.model.config.editorHeight ? $scope.model.config.editorHeight : 550;
        var cssContainer = $scope.model.config.containerCss;
        var cssSlider = $scope.model.config.sliderCss;

        if (!$scope.model.value ||
            $scope.model.value == '') {
            $scope.model.value = {
                width: width,
                height: height,
                editorWidth: editorWidth,
                editorHeight: editorHeight,
                cssContainer: cssContainer,
                cssSlider: cssSlider,
                slides: []
            }
        }
        else {
            $scope.model.value.width = width,
            $scope.model.value.height = height,
            $scope.model.value.editorWidth = editorWidth,
            $scope.model.value.editorHeight = editorHeight,
            $scope.model.value.cssContainer = cssContainer,
            $scope.model.value.cssSlider = cssSlider
        }

        var unsubscribe = $scope.$on("formSubmitting", function () {
            $scope.closeEditSlide();
        });

        assetsService.loadCss("/App_Plugins/Lecoati.uSky.Slider/lib/jquery-ui-1.10.4.custom/css/ui-lightness/jquery-ui-1.10.4.custom.min.css");
        assetsService.loadCss("/App_Plugins/Lecoati.uSky.Slider/lib/colorpicker.css");
        assetsService.loadCss("/App_Plugins/Lecoati.uSky.Slider/lib/uSky.Slider.css");

    });