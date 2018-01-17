;
(function(factory) {

    if (typeof module === 'object' && module.export) {
        module.export = factory();
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define([], factory);
    } else if (typeof window !== 'undefined') {
        window.CitySelectComponent = factory();
    }
})
(function() {
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
        provinces: '//m.taoche.com/ajax/city/getprovinceandotherdata.ashx',
        city: '//m.taoche.com/ajax/city/getcitysbypid.ashx',
        area: '//m.taoche.com/ajax/city/getarea.ashx'
    };

    /*滚动的默认配置*/
    var iscrollOptions = {
        bounce: false,
        tap: true,
        click: true
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

        firstTemplteName: "#provinceTemplate",
        firstContainerSelector: "#wrapper .seller-scroller",

        secondWarpperSelector: "#city-wrapper",
        secondTemplateName: "#cityTemplate",
        secondContainerSelector: "#city-scroller",

        areaWarpperSelector: "#area-wrapper",
        areaTemplateName: "#areaTemplate",
        areaContainerSelector: "#area-scroller",

        currentCharSelector: ".tipsLetter",
        charContainerClassName: 'index-sidebar-container',
        charChange: null,
        offsetTop: 158,
        offsetBottom: 72,
        lineScale: 0.5,
        gobackSelector: '.go-back',
        subgobackSelector: '#goback-trigger',
        areagobackSelector: '#goback-trigger-sub',
        uponelevel: '.up-one-level',

        extraparam: '', //求情第二级时候多余的参数
        triggerSelector: 'a[data-action="province"]', 
        currentfirstid: 0, //第一层级选中id
        currentdsenondid: 0, //第二层级选中id

        triggerSecondSelector: 'a[data-action="city"]',
        secondClickCallback: null, //点击第二部分回调

        hideSecondLayerCallback: null,
        triggerAreaSelector: 'a[data-action="area"]',
        afterRender:null
    }

    function CitySelectComponent(options) {
        options = options || {};
        this.options = extend(options, defaultOptions);
        this.specialAreaData = null;
        this.sepicalCityData = null;
        this.provinceData = null;
        this.charList = null;
        this.cityData = {};
        this.areaData = {};
        this.charsArr = ["#"];
        this.firstScroll = null;
        this.secondScroll = null;
        this.areaScroll = null;
        this.areaState = false;
        this.cityState = false;
        // this.currentBrandId=options.currentBrandId;
    }

    CitySelectComponent.prototype = {
        init: function() {
            this.renderProvinceAndOther();
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
                    $(options.outerWrapper).css({ "z-index": -1, "transform": 'translateZ(-1px)', "-webkit-transform": 'translateZ(-1px)' });
                    that.firstScroll.scrollTo(0, 0);
                    that.hideWrapper();
                }, 300)

            } else {
                if (!!options.zIndex) {
                    $(options.outerWrapper).css({ "z-index": options.zIndex, "transform": 'translateZ(' + options.zIndex + 'px)', "-webkit-transform": 'translateZ(' + options.zIndex + 'px)' });
                }
                $("#" + options.charContainerClassName).show();
            }
            $firstWrapperSelector.toggleClass(options.ainimateClass);
        },
        toggleCityAnimate: function() {
            var that = this,
                options = that.options;
            var $secondWarpperSelector = $(options.secondWarpperSelector);
            setTimeout(function() {
                if ($secondWarpperSelector.hasClass(options.ainimateClass2)) {
                    if (that.cityState&&!that.areaState) {
                        $(options.maskSelector).hide().css("z-index", -1);
                    }
                    that.cityState = false;
                } else {
                    $(options.maskSelector).show().css("z-index", options.maskIndex);
                    that.cityState = true;
                }
                $secondWarpperSelector.toggleClass(options.ainimateClass2);
            }, 10);
        },
        toggleAreaAnimate: function() {
            var that = this,
                options = that.options;
            var $areaWarpperSelector = $(options.areaWarpperSelector);
            setTimeout(function() {
                if ($areaWarpperSelector.hasClass(options.ainimateClass2)) {
                    $(options.maskSelector).hide().css("z-index", -1);
                    that.areaState = false;
                } else {
                    $(options.maskSelector).show().css("z-index", options.maskIndex);
                    that.areaState = true;
                }
                $areaWarpperSelector.toggleClass(options.ainimateClass2);
            }, 10);
        },
        bindEvent: function() {
            var that = this,
                options = that.options;

           //第一级返回
            $(options.gobackSelector).off().click(function() {
                that.toggleAnimate();
            });

            //第二级返回 subgobackSelector
            $(options.maskSelector).off().click(function() {
                if (that.cityState) {
                    that.toggleCityAnimate();
                }
                if (that.areaState) {
                    that.toggleAreaAnimate();
                }

            });

            $(options.subgobackSelector).click(function() {
                if (that.cityState) {
                    that.toggleCityAnimate();
                }
            });

            
            $(options.areagobackSelector).off().click(function() {
                if (that.areaState) {
                    that.toggleAreaAnimate();
                }
            });
            //

            $(options.secondWarpperSelector).off().on('tap', options.uponelevel, function() {
                $(options.maskSelector).hide().css("z-index", -1);
                $(options.secondWarpperSelector).removeClass(options.ainimateClass2);
            });

            //点击二级城市选项
            $(options.outerWrapper).on('tap', options.triggerSecondSelector, function() {
                var $this = $(this);
                var params = {
                    id: $this.attr("data-id"),
                    spell: $this.attr("data-spell")
                };
                typeof options.secondClickCallback === 'function' && options.secondClickCallback.call(that, params);
            });

            //触发Area显示区域页面
            $(options.outerWrapper).on('tap', options.triggerAreaSelector, function() {
                $(options.areaContainerSelector).html('<img src="//image.bitautoimg.com/uimg/mbt2015/images/loading.gif" class="seller-load">');

                that.toggleAreaAnimate();

                var $this = $(this);
                var id = $this.attr('data-id');
                var spell = $this.attr('data-spell');

                if (!id) { return false; }
                var data = that.areaData[id];
                if (!data) {
                    that.getAreaData(id, spell);
                } else {
                    that.renderArea(data, id, spell);
                }
            });

            //城市页面
            $(options.outerWrapper).on('tap', options.triggerSelector, function() {
                $(options.secondContainerSelector).html('<img src="//image.bitautoimg.com/uimg/mbt2015/images/loading.gif" class="seller-load">');
                that.toggleCityAnimate();
                var pid = $(this).attr('data-id');
                if (!pid) { return false; }
                var name = $(this).attr('data-name');
                var data = that.cityData[pid];
                if (!data) {
                    that.getCityData(pid, name);
                } else {
                    that.renderCity(data, pid, name);
                }
            })
        },
        initSecondScroll: function() {
            var that = this;
            if (!!that.secondScroll) {
                that.secondScroll.destroy();
            }
            var options = that.options;
            var wrapper = options.secondWarpperSelector + " .wrapper";
            that.secondScroll = new IScroll(wrapper, iscrollOptions);

        },
        initAreaScroll: function() {
            var that = this;
            if (!!that.areaScroll) {
                that.areaScroll.destroy();
            }
            var options = that.options;
            var wrapper = options.areaWarpperSelector + " .wrapper";

            that.areaScroll = new IScroll(wrapper, iscrollOptions);

        },
        initProvinceScroll: function() {
            var that = this;
            var options = that.options;
            var wrapper = options.firstWrapperSelector + " .wrapper";
            that.firstScroll = new IScroll(wrapper, iscrollOptions);
        },
        bindGetCityEvent: function() {
            var that = this,
                options = that.options;
           
        },
        getData: function() {
            var that = this,
                options = that.options;
            $.ajax({
                type: 'get',
                url: api.provinces,
                dataType: "jsonp",
                success: function(data) {
                    that.provinceData = data.Provinces;
                    that.sepicalCityData = data.SpecialCity;
                    that.specialAreaData = data.SpecailArea;

                    that.charList = data.CharList;

                    htmlRender.render({
                        containerid: options.firstContainerSelector,
                        templateid: options.firstTemplteName,
                        data: {
                            data: that.provinceData,
                            specialAreaData:that.specialAreaData,
                            sepicalCityData: that.sepicalCityData
                        },
                        type: "html"
                    });
                    that.initProvinceScroll();
                    window.setTimeout(function() {
                        that.initIndexSiderBar();
                    }, 0);
                    typeof options.afterRender==='function'&&options.afterRender.call(that,options);
                }
            });
        },
        getAreaData: function(pid, name) {
            if (!pid) { return false; }
            var that = this,
                options = that.options;
            var areaUrl = api.area + "?id=";
            areaUrl += pid;
            $.ajax({
                type: 'get',
                url: areaUrl,
                async: false,
                dataType: "jsonp",
                cache: true,
                success: function(data) {
                    if (!!data && !!data.length) {
                        that.areaData[pid] = data;
                        that.renderArea(data, pid, name);
                    }
                }
            });
        },
        getCityData: function(pid, name) {
            if (!pid) { return false; }
            var that = this,
                options = that.options,
                extraparam = options.extraparam;
            var cityUrl = api.city + "?pid=";
            cityUrl += pid;
            if (!!extraparam) {
                cityUrl += "&rul=";
                cityUrl += extraparam;
            }

            $.ajax({
                type: 'get',
                url: cityUrl,
                async: false,
                dataType: "jsonp",
                cache: true,
                success: function(data) {
                    if (!!data && !!data.length) {
                        that.cityData[pid] = data;
                        that.renderCity(data, pid, name);
                    }
                }
            });
        },
        initIndexSiderBar: function(data) {
            var that = this;
            var options = that.options;
            var charsSet = that.charList || {};
            for (var key in charsSet) {
                that.charsArr.push(key);
            }
            var indexSidebar = new IndexSidebar({
                isAdjust:false,
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
        renderProvinceAndOther: function() {
            var that = this;
            if (!that.provinceData) {
                that.getData();
            }
        },
        showWrapper: function() {
            // $(this.options.outerWrapper).show();
        },
        hideWrapper: function() {
            //$(this.options.outerWrapper).hide();
        },
        renderCity: function(data, pid, name) {
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
            that.initSecondScroll();
        },
        renderArea: function(data, pid, spell) {
            var that = this;
            var options = that.options;
            htmlRender.render({
                containerid: options.areaContainerSelector, //specialArea
                templateid: options.areaTemplateName,
                data: {
                    data: data,
                    pid: pid,
                    spell: spell,
                    currentid: options.currentdsenondid
                },
                type: "html"
            });
            that.initAreaScroll();
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

    return CitySelectComponent;

});