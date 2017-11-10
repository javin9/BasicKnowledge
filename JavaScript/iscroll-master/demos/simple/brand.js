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
    function isPassive() {
        var supportsPassiveOption = false;
        try {
            addEventListener("test", null, Object.defineProperty({}, 'passive', {
                get: function() {
                    supportsPassiveOption = true;
                }
            }));
        } catch (e) {}
        return supportsPassiveOption;
    }

    document.addEventListener('touchmove', function(e) { e.preventDefault(); }, isPassive() ? {
        capture: false,
        passive: false
    } : false);

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
        brand: 'http://beijing.m.taoche.com/ajax/brand/getbrandmaster.ashx',
        car: 'http://beijing.m.taoche.com/ajax/brand/getbrandserial.ashx?pid={0}&{1}'
    };

    /*默认参数*/
    var defaultOptions = {
        outerWrapper: "#carSelectComponent",
        containerSelector: ".relative-position",

        ainimateClass: 'drawAni', //动画className
        ainimateHideAfter: null,


        brandTemplteName: "#brandTemplate",
        brandContainerSelector: "#wrapper",

        carTemplageName: null,
        carContainerSelector: "#car-wrapper",

        currentCharSelector: ".tipsLetter",
        charContainerClassName: 'index-sidebar-container',
        charChange: null,
        offsetTop: 70,
        offsetBottom: 10,
        lineScale: 0.7
    }

    function BrandSelectComponent(options) {
        options = options || {};
        this.options = extend(options, defaultOptions);
        this.brandData = null;
        this.charsArr = ["#"];
        this.brandScroll = null;
    }

    BrandSelectComponent.prototype = {
        init: function() {
            this.renderBrand();
            this.toggleAnimate();
        },
        toggleAnimate: function() {

            var that = this,
                options = that.options;
            $(options.outerWrapper).attr("z-index", 999);

            var $containerSelector = $(options.containerSelector);
            if ($containerSelector.hasClass(options.ainimateClass)) {
                $(options.outerWrapper).css("z-index", -1);
                $("#" + options.charContainerClassName).hide();
                typeof options.ainimateHideAfter && options.ainimateHideAfter.call(options);
            } else {
                $(options.outerWrapper).css("z-index", 999);
                $("#" + options.charContainerClassName).show();
            }


            $containerSelector.toggleClass(options.ainimateClass);

            // if ($containerSelector.hasClass(options.ainimateClass)) {
            //     $("#" + options.charContainerClassName).show();
            // } else {
            //     $("#" + options.charContainerClassName).hide();
            //     typeof options.ainimateHideAfter&&options.ainimateHideAfter.call(options);
            // }
        },
        initBrandScroll: function() {
            var that = this;
            that.brandScroll = new IScroll('#wrapper', {
                mouseWheel: true,
                bounce: false
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
                        containerid: options.brandContainerSelector + " ul",
                        templateid: options.brandTemplteName,
                        data: {
                            data: that.brandData,
                        },
                        type: "html"
                    });
                    that.initBrandScroll();
                    that.initIndexSiderBar();
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
                containerSelector: options.containerSelector,
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
        renderCar: function() {

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