(function(factory) {

    if (typeof module === 'object' && module.export) {
        module.export = factory();
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define([], factory);
    } else if (typeof window !== 'undefined') {
        window.BrandSelectComponent = factory();
    }

})(function() {
    /*iscroll.js里面的帮助函数*/
    // function isPassive() {
    //     var supportsPassiveOption = false;
    //     try {
    //         addEventListener("test", null, Object.defineProperty({}, 'passive', {
    //             get: function() {
    //                 supportsPassiveOption = true;
    //             }
    //         }));
    //     } catch (e) {}
    //     return supportsPassiveOption;
    // }

    // document.addEventListener('touchmove', function(e) { e.preventDefault(); }, isPassive() ? {
    //     capture: false,
    //     passive: false
    // } : false);

    /*brand 开始*/
    var extend = function(destination, defaultOptions) {
        for (var k in defaultOptions) {
            if (defaultOptions.hasOwnProperty(k)) {
                destination[k] = destination[k] || defaultOptions[k]
            }
        }
        return destination;
    };
    /*接口*/
    var api = {
        brand: 'http://m.taoche.com/ajax/brand/getbrandmaster.ashx',
        car: 'http://m.taoche.com/ajax/brand/getbrandserial.ashx',
        hotbrand: 'http://m.taoche.com/ajax/brand/gethotbrandmaster.ashx'
    };


    /*滚动的默认配置*/
    var iscrollOptions = {
        bounce: false,
        tap: true
    };

    /*默认参数*/
    var defaultOptions = {
        outerWrapper: "#carSelectComponent", //最外层id
        zIndex: 10010, //最外层的zIndex

        firstWrapperSelector: "#first-wrapper", //第一级 wrapper

        ainimateClass: 'drawAni', //动画className
        ainimateHideAfter: null,
        ainimateClass2: "drawAni2", //二级动画

        maskSelector: '.leftmask',
        maskIndex: 99,

        hotTemplteName: "#hotTemplate",
        hotContainerSelector: "#hot-wrapper",

        firstTemplteName: "#brandTemplate",
        firstContainerSelector: "#wrapper .seller-scroller",

        secondWarpperSelector: "#sery-wrapper",
        secondTemplateName: "#carTemplate",
        secondContainerSelector: "#sery-scroller",

        currentCharSelector: ".tipsLetter",
        charContainerClassName: 'index-sidebar-container',
        charChange: null,
        offsetTop: 158,
        offsetBottom: 72,
        lineScale: 0.7,
        gobackSelector: '.go-back',
        uponelevel: '.up-one-level',

        extraparam: 'ps=/all/', //求情第二级时候多余的参数
        triggerSelector: 'li[data-action="car"]', //$("input[name='newsletter']").attr("checked", true);
        currentfirstid: 0, //第一层级选中id
        currentdsenondid: 0 //第二层级选中id

    }

    function BrandSelectComponent(options) {
        options = options || {};
        this.options = extend(options, defaultOptions);
        this.hotBrandData = null;
        this.brandData = null;
        this.seryData = {};
        this.charsArr = ["热"];
        this.brandScroll = null;
        this.carScroll = null;
        // this.currentBrandId=options.currentBrandId;
    }

    BrandSelectComponent.prototype = {
        init: function() {
            this.renderHotBrand();
            this.renderBrand();

            this.toggleAnimate();
            this.bindEvent();
        },
        toggleAnimate: function() {
            var that = this,
                options = that.options;

            var $firstWrapperSelector = $(options.firstWrapperSelector);
            if ($firstWrapperSelector.hasClass(options.ainimateClass)) {
                $("#" + options.charContainerClassName).hide();
                typeof options.ainimateHideAfter && options.ainimateHideAfter.call(options);
                setTimeout(function() {
                    $(options.outerWrapper).css({ "z-index": -1, "transform": 'translateZ(-1px)' });
                }, 300)

            } else {
                if (!!options.zIndex) {
                    $(options.outerWrapper).css({ "z-index": options.zIndex, "transform": 'translateZ(' + options.zIndex + 'px)' });
                }
                $("#" + options.charContainerClassName).show();
            }


            $firstWrapperSelector.toggleClass(options.ainimateClass);
        },
        toggleCarAnimate: function() {
            var that = this,
                options = that.options;

            var $secondWarpperSelector = $(options.secondWarpperSelector);
            setTimeout(function() {
                if ($secondWarpperSelector.hasClass(options.ainimateClass2)) {
                    $(options.maskSelector).hide().css("z-index", -1);
                } else {
                    $(options.maskSelector).show().css("z-index", options.carZIndex);
                }
                $secondWarpperSelector.toggleClass(options.ainimateClass2);
            }, 100);
        },
        bindEvent: function() {
            var that = this,
                options = that.options;
            $(options.maskSelector).click(function() {
                that.toggleCarAnimate();
            });
            $(options.gobackSelector).click(function() {
                that.toggleAnimate();
            });

            $(options.secondWarpperSelector).off().on('tap', options.uponelevel, function() {
                $(options.maskSelector).hide().css("z-index", -1);
                $(options.secondWarpperSelector).removeClass(options.ainimateClass2);
            });
        },
        initCarScroll: function() {
            var that = this;
            that.carScroll = null;
            var options = that.options;
            var wrapper = options.secondWarpperSelector + " .wrapper";
            that.carScroll = new IScroll(wrapper, iscrollOptions);

        },
        initBrandScroll: function() {
            var that = this;
            var options = that.options;
            var wrapper = options.firstWrapperSelector + " .wrapper";
            that.brandScroll = new IScroll(wrapper, iscrollOptions);
        },
        bindGetCarEvent: function() {
            var that = this,
                options = that.options;

            $(options.triggerSelector).off().on('tap', function() {
                that.toggleCarAnimate();
                var pid = $(this).attr('data-id');
                if (!pid) { return false; }
                var name = $(this).attr('data-name');
                var data = that.seryData[pid];
                if (!data) {
                    that.getCarData(pid, name);
                } else {
                    that.renderCar(data, pid, name);
                }

            })
        },
        getHotBrandData: function() {
            var that = this,
                options = that.options;
            $.ajax({
                type: 'get',
                url: api.hotbrand,
                dataType: "jsonp",
                success: function(data) {
                    var len=data.length;
                    if (len>8) {
                        data.length=8;
                    }

                    htmlRender.render({
                        containerid: options.hotContainerSelector,
                        templateid: options.hotTemplteName,
                        data: {
                            data:data
                        },
                        type: "html"
                    });
                }
            });
        },
        getBrandData: function() {
            var that = this,
                options = that.options;
            $.ajax({
                type: 'get',
                url: api.brand,
                dataType: "jsonp",
                success: function(data) {
                    that.brandData = data;
                    htmlRender.render({
                        containerid: options.firstContainerSelector,
                        templateid: options.firstTemplteName,
                        data: {
                            data: that.brandData,
                            currentid: options.currentfirstid
                        },
                        type: "append"
                    });
                    that.initBrandScroll();
                    that.initIndexSiderBar();
                    that.bindGetCarEvent();
                }
            });
        },
        getCarData: function(pid, name) {
            if (!pid) { return false; }
            var that = this,
                options = that.options,
                extraparam = options.extraparam;
            var carUrl = api.car + "?pid=";
            carUrl += pid;
            if (!!extraparam) {
                carUrl += "&";
                carUrl += extraparam;
            }

            console.log(carUrl);
            $.ajax({
                type: 'get',
                url: carUrl,
                async: false,
                dataType: "jsonp",
                success: function(data) {
                    console.log('1')
                    if (!!data && !!data.length) {
                        that.seryData[pid] = data;
                        console.log(that.seryData);
                        that.renderCar(data, pid, name);
                    }
                }
            });
        },
        initIndexSiderBar: function(data) {
            var that = this;
            var options = that.options;
            var charsSet = that.brandData.CharList || {};
            for (var key in charsSet) {
                that.charsArr.push(key);
            }
            console.log(that.charsArr);
            var indexSidebar = new IndexSidebar({
                chars: that.charsArr.join(''),
                containerSelector: options.firstWrapperSelector,
                offsetTop: options.offsetTop,
                offsetBottom: options.offsetBottom,
                lineScale: options.lineScale,
                charContainerClassName: options.charContainerClassName,
                currentCharSelector: options.currentCharSelector
            });
            if (typeof options.charChange === "function") {
                indexSidebar.on("charChange", function(ch) {
                    options.charChange.call(that, ch);
                });
            }

        },
        renderBrand: function() {
            var that = this;
            if (!that.brandData) {
                that.getBrandData();
            }
        },
        renderHotBrand: function() {
            var that = this;
            if (!that.hotBrandData) {
                that.getHotBrandData();
            }
        },
        renderCar: function(data, pid, name) {
            var that = this;
            var options = that.options;
            htmlRender.render({
                containerid: options.secondContainerSelector,
                templateid: options.secondTemplateName,
                data: {
                    data: data,
                    pid: pid,
                    name: name,
                    currentid: options.currentdsenondid
                },
                type: "html"
            });
            that.initCarScroll();
        },
        trigger: function(event, data) {
            var listeners = this._listeners && this._listeners[event];
            if (listeners) {
                listeners.forEach(function(listener) {
                    listener(data);
                })
            }
        },
        on: function(event, callback) {
            this._listeners = this._listeners || {}
            var listeners = this._listeners[event] || (this._listeners[event] = [])
            listeners.push(callback);
        },
        off: function(event, callback) {
            var listeners = this._listeners && this._listeners[event];
            if (listeners) {
                var i = listeners.indexOf(callback);
                if (i > -1) {
                    listeners.splice(i, 1);
                    if (listeners.length === 0) {
                        this._listeners[event] = null;
                    }
                }
            }
        }

    };

    return BrandSelectComponent;

});