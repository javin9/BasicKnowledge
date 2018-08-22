/*
 ###  依赖
 js/underscore.js
 js/render.js
 ###  模板绑定用的render.js，里面调用了underscore.js的模板绑定方法，但是重写了<%%>,具体看render.js
 ###  对应 /js/taoche/libm/tc.brandswiper.js
 ### API接口
 var api = {
 brand: '//m.taoche.com/ajax/brand/getbrandmaster.ashx',
 car: '//m.taoche.com/ajax/brand/getbrandserial.ashx',
 hotbrand: '//m.taoche.com/ajax/brand/gethotbrandmaster.ashx',
 subcar: "//m.taoche.com/ajax/brand/getbrandcarbasic.ashx"
 };

 ### 滚动的默认配置
 var iscrollOptions = {
 bounce: false,
 tap: true,
 click: true
 };

 ### options参数说明(所有参数都是可选)

 *outerWrapper:[String] 最外层容器的选择器,默认"#carSelectComponent"
 *zIndex:[Number] 最外层容器的,默认10010

 *firstWrapperSelector:[String] 一级滚动容器的容器选择器,默认"#first-wrapper"

 *ainimateClass:[String] 一级动画的样式名 ,默认'drawAni'
 *ainimateHideAfter:[Function] 一级动画结束后的回调函数,默认null
 *ainimateClass2:[String] 二级动画的样式名 ,默认"drawAni2"
 *animateClass3:[String] 三级动画的样式名,默认"drawAni2"

 *maskSelector:[String] 遮罩的样式名,默认'.leftmask'
 *maskIndex:[Number] 遮罩的z-index值,默认99

 *hotTemplteName:[String]  ,默认"#hotTemplate"
 *hotContainerSelector: [String] ,默认"#hot-wrapper"

 *firstTemplteName: [String] 一级页面显示的模板 ,默认"#brandTemplate"
 *firstContainerSelector:[String]  ,默认"#wrapper .seller-scroller"
 *firstTriggerSure:[String] 不限车型的触发选择器,默认".first-trigger"
 *firstClickCallback:[Function] 不限车型的回调函数,默认为null,返回一个options参数{href,spell,id}

 *secondWarpperSelector:[String] 二级外层容器选择器,默认"#sery-wrapper"
 *secondTemplateName: [String] 二级页面的模板,默认"#carTemplate"
 *secondContainerSelector:[String] 二级页面内层内容的容器,默认"#sery-scroller"
 *secondTriggerSure:[String] 二级页面点击的选择器 ,默认".second-trigger"
 *secondClickCallback: [Function] 二级页面元素触发的回调函数,默认null,返回一个options参数{href,spell,id}
 *hideSecondLayerCallback:[Function] 隐藏二级的回调函数,默认 null
 *triggerSelector:[String] 二级页面内触发显示第三级的选择器,默认'li[data-action="car"]'

 *thirdWrapperSelector:[String] 三级外层容器选择器,默认"#third-wrapper"
 *thirdTemplateName:[String] 三级页面的模板,默认"#thirdTemplate"
 *thirdContainerSelector:[String] 三级页面内层内容的容器,默认"#third-scroller"
 *thirdClickCallback:[Function] 三级页面元素触发的回调函数,默认null,返回一个当前选择的carid数组
 *thirdTriggerSelector:[String]  三级页面内触发的选择器,默认"a[data-action='car-sub']"

 *gobackSelector:[String] 一级返回选择器 ,默认'.go-back'
 *subgobackSelector:[String] 二级返回选择器 ,默认'#goback-trigger'
 *thirdGobackSelector:[String] 三级返回选择器,默认".third-goback"
 *uponelevel:[String]  【已废弃,默认就可以】

 *extraparam:[String] 二级时候多余的参数,默认'ps=/all/'【@如果不需要用生成好的url跳转,默认就可以】
 *currentfirstid:[String] 一层级选中id,默认0
 *currentdsenondid:[String] 二层级选中id,默认0
 *currentthird:[Array] 三级选中id数组,默认[]【三级回绑数据比较复杂,暂时没用】

 *level:[Number] 显示层级数量,默认3  【如果是2，只显示到车型】

 *currentCharSelector:[String] 当前索引容器的选择器,默认".tipsLetter"
 *charContainerClassName:[String]  索引外层容器,默认'index-sidebar-container'
 *charChange:[Function] 索引改变时的回调函数,默认null
 *offsetTop:[Number] 索引自定义具体顶部高度,默认158,【已废弃,默认就可以】
 *offsetBottom:[Number] 索引自定义具体顶部高度,72,【已废弃,默认就可以】
 *lineScale:[Number] 默认0.7【已废弃,默认就可以】

 ### EXP:
 //声明实例
 var barnds = new BrandSelectComponent({
 charChange: function(letter) {
 if (letter === '热') {
 this.brandScroll.scrollTo(0, 0);
 } else {
 var target = document.querySelector('[data-letter="' + letter + '"]');
 if (!!target && !!target.nodeType) {
 this.brandScroll.scrollToElement(target, 0);
 }
 }
 },
 firstClickCallback: function(options) {
 console.log(options);
 },
 secondClickCallback: function(options) {
 console.log(options);
 },
 ainimateHideAfter: function() {
 console.log('ainimateHideAfter');
 },
 currentfirstid: 9, //第一层级选中id
 currentdsenondid: 2556, //第二层级选中id
 level: 3
 });

 //初始化
 barnds.init();
 */
;
(function(factory) {

    if (typeof module === 'object' && module.export) {
        module.export = factory();
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define([], factory);
    } else if (typeof window !== 'undefined') {
        window.BrandSelectComponent = factory();
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
        brand: '//m.taoche.com/ajax/brand/getbrandmaster.ashx',
        car: '//m.taoche.com/ajax/brand/getbrandserial.ashx',
        hotbrand: '//m.taoche.com/ajax/brand/gethotbrandmaster.ashx',
        subcar: "//m.taoche.com/ajax/brand/getbrandcarbasic.ashx"
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
        animateClass3: "drawAni2", //三级动画

        maskSelector: '.leftmask',
        maskIndex: 99,

        hotTemplteName: "#hotTemplate",
        hotContainerSelector: "#hot-wrapper",

        firstTemplteName: "#brandTemplate",
        firstContainerSelector: "#wrapper .seller-scroller",
        firstTriggerSure: ".first-trigger",
        firstClickCallback: null, //点击不限车型的回调

        secondWarpperSelector: "#sery-wrapper",
        secondTemplateName: "#carTemplate",
        secondContainerSelector: "#sery-scroller",
        secondTriggerSure: ".second-trigger",
        secondClickCallback: null, //传回一个options对象
        triggerSelector: 'li[data-action="car"]',

        thirdWrapperSelector: "#third-wrapper",
        thirdTemplateName: "#thirdTemplate",
        thirdContainerSelector: "#third-scroller",
        thirdClickCallback: null, //传回一个 当前选择的carid数组
        thirdTriggerSelector: "a[data-action='car-sub']",

        currentCharSelector: ".tipsLetter",
        charContainerClassName: 'index-sidebar-container',
        charChange: null,
        offsetTop: 158,
        offsetBottom: 72,
        lineScale: 0.7,
        gobackSelector: '.go-back',
        subgobackSelector: '#goback-trigger',
        uponelevel: '.up-one-level',
        thirdGobackSelector: ".third-goback",

        extraparam: 'ps=/all/', //求情第二级时候多余的参数
        currentfirstid: 0, //第一层级选中id
        currentdsenondid: 0, //第二层级选中id
        currentthird: [], //第三级算中id

        hideSecondLayerCallback: null,

        level: 3

    }

    function BrandSelectComponent(options) {
        options = options || {};
        this.options = extend(options, defaultOptions);
        this.hotBrandData = null;
        this.brandData = null;
        this.seryData = {};
        this.subCarData = {},
            this.charsArr = ["热"];
        this.brandScroll = null;
        this.carScroll = null;
        this.subCarScroll = null;
        this.isInited = null;

        // this.currentBrandId=options.currentBrandId;
    }

    BrandSelectComponent.prototype = {
        init: function() {
            this.showWrapper();
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
                    $(options.outerWrapper).css({ "z-index": -1, "transform": 'translateZ(-1px)', "-webkit-transform": 'translateZ(-1px)' });
                    that.brandScroll.scrollTo(0, 0);
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
        toggleSecondAnimate: function(hide) {
            var that = this,
                options = that.options;
            var $secondWarpperSelector = $(options.secondWarpperSelector);
            setTimeout(function() {
                if (hide || $secondWarpperSelector.hasClass(options.ainimateClass2)) {
                    $(options.maskSelector).hide().css("z-index", -1);
                    $secondWarpperSelector.removeClass(options.ainimateClass2);
                } else {
                    $(options.maskSelector).show().css("z-index", options.maskIndex);
                    $secondWarpperSelector.addClass(options.ainimateClass2);
                }

            }, 100);
        },
        toggleThirdAnimate: function(hide) {
            var that = this,
                options = that.options;

            var $thirdWrapperSelector = $(options.thirdWrapperSelector);
            setTimeout(function() {
                if (hide || $thirdWrapperSelector.hasClass(options.animateClass3)) {
                    $thirdWrapperSelector.removeClass(options.animateClass3);
                } else {
                    $thirdWrapperSelector.addClass(options.animateClass3);
                }

            }, 100);
        },
        bindEvent: function() {
            var that = this,
                options = that.options;

            if (that.isInited) {
                return false;
            }

            //第二级返回 subgobackSelector
            $(options.maskSelector).off().click(function() {
                that.toggleSecondAnimate(true);
                if (options.level == 3) {
                    that.toggleThirdAnimate(true);
                }
            });
            $(options.subgobackSelector).off().click(function() {
                that.toggleSecondAnimate();
            });

            //第一级返回
            $(options.gobackSelector).off().click(function() {
                that.toggleAnimate();
            });

            $(options.secondWarpperSelector).off().on('tap', options.uponelevel, function() {
                $(options.maskSelector).hide().css("z-index", -1);
                $(options.secondWarpperSelector).removeClass(options.ainimateClass2);
            });
            //触发显示二级
            $(options.outerWrapper).on('tap', options.triggerSelector, function() {
                $(options.secondContainerSelector).html('<img src="//image.bitautoimg.com/uimg/mbt2015/images/loading.gif" class="seller-load">');
                that.toggleSecondAnimate();
                var pid = $(this).attr('data-id');
                if (!pid) { return false; }
                var name = $(this).attr('data-name');
                var data = that.seryData[pid];
                if (!data) {
                    that.getCarData(pid, name);
                } else {
                    that.renderCar(data, pid, name);
                }
            });
            //点击第一级回调
            $(options.outerWrapper).on('tap', options.firstTriggerSure, function(ev) {
                ev.preventDefault();
                var $this = $(this);
                typeof options.firstClickCallback === 'function' && options.firstClickCallback.call($this, {
                    id: $this.attr("data-id"),
                    href: $this.attr("data-href"),
                    spell: $this.attr("data-spell")
                });
            });
            //点击第二级回调
            $(options.outerWrapper).on('tap', options.secondTriggerSure, function(ev) {
                ev.preventDefault();
                var $this = $(this);
                typeof options.secondClickCallback === 'function' && options.secondClickCallback.call($this, {
                    id: $this.attr("data-id"),
                    href: $this.attr("data-href"),
                    spell: $this.attr("data-spell")
                });
            });
            //触发显示三级
            $(options.outerWrapper).on('tap', options.thirdTriggerSelector, function() {
                $(options.thirdContainerSelector).html('<img src="//image.bitautoimg.com/uimg/mbt2015/images/loading.gif" class="seller-load">');
                that.toggleThirdAnimate();
                var $this = $(this);
                var pid = $this.attr('data-id');
                if (!pid) { return false; }
                var name = $this.attr('data-name');
                var href = $this.attr('data-href');
                var data = that.subCarData[pid];
                if (!data) {
                    that.getSubCarData(pid, name, href);
                } else {
                    that.renderSubCar(data, pid, name, href);
                }
            });

            //all-car-models
            $(options.outerWrapper).on('tap', ".all-car-models", function() {
                var ele = $(this).find('.nex-selebox ');
                if (ele.hasClass('selbox-curron')) {
                    $(options.outerWrapper).find('.all-year').removeClass('select-all-sery');
                    $(options.outerWrapper).find('.selbox-curron').removeClass('selbox-curron');
                } else {
                    $(options.outerWrapper).find('.nex-selebox').addClass('selbox-curron');
                    $(options.outerWrapper).find('.all-year').addClass('select-all-sery')
                }
            });

            //thirdGobackSelector
            $(options.outerWrapper).find(options.thirdGobackSelector).click(function() {
                that.toggleThirdAnimate(true);
            });
            //all-year all-car-models
            $(options.outerWrapper).on('tap', ".all-year", function() {
                var ele = $(this),
                    parent = ele.parent(),
                    selebox = ele.find('.nex-selebox '),
                    allCarModels = $(options.outerWrapper).find('.all-car-models'),
                    len = allCarModels.attr('data-len'),
                    pid = ele.attr("data-pid");
                if (!pid) {
                    return false;
                }
                if (selebox.hasClass('selbox-curron')) {
                    parent.find('.nex-selebox').removeClass('selbox-curron');
                    ele.removeClass('select-all-sery')
                    allCarModels.find('.nex-selebox').removeClass('selbox-curron');
                } else {
                    parent.find(".nex-selebox").addClass('selbox-curron');
                    ele.addClass('select-all-sery');

                    var nodeList = $(options.outerWrapper).find('.all-year').find('.selbox-curron');
                    if (!!nodeList && !!nodeList[0] && nodeList.length && nodeList.length == len) {
                        allCarModels.find('.nex-selebox').addClass('selbox-curron');
                    }
                    that.selectAll();
                }

            });

            //item-clos
            $(options.outerWrapper).on('tap', ".item-clos", function() {
                var ele = $(this),
                    parent = ele.parent(),
                    len = parent.attr('data-len') || 0,
                    selebox = ele.find('.nex-selebox '),
                    pid = ele.attr("data-pid");

                if (selebox.hasClass('selbox-curron')) {
                    selebox.removeClass('selbox-curron');
                    parent.find('.all-year').removeClass('select-all-sery').find('.nex-selebox').removeClass('selbox-curron');
                    $(options.outerWrapper).find(".all-car-models").find(".nex-selebox").removeClass('selbox-curron');
                } else {
                    selebox.addClass('selbox-curron');

                    var nodeList = parent.find('.item-clos').find('.selbox-curron');
                    if (!!nodeList && !!nodeList[0] && nodeList.length && nodeList.length == len) {
                        parent.find('.all-year').addClass('select-all-sery').find('.nex-selebox').addClass('selbox-curron');
                    }
                    that.selectAll();
                }

            });

            //brand-reset 重置
            $("#brand-reset").click(function() {
                $(options.outerWrapper).find('.selbox-curron').removeClass('selbox-curron');
            });
            //确定
            $("#brand-true").click(function() {
                //all-car-models
                var allCarModels = $(options.outerWrapper).find('.all-car-models'), //.find('.selbox-curron');
                    selbox = allCarModels.find('.selbox-curron'),
                    allYearWrapper = $(options.outerWrapper).find('.all-year-wrapper'); //
                var url = allCarModels.attr('data-href');;
                var selectArray = [];
                var itemArr = [];
                var returnQuerysArray = [];
                if ((!!selbox && selbox.length > 0) || ($(options.outerWrapper).find('.selbox-curron').length === 0)) {
                    //全部车款
                    // url = allCarModels.attr('data-href');
                } else {
                    //select-all-sery
                    var allyear = allYearWrapper.find('.all-year');
                    allyear = [].slice.call(allyear);
                    allyear.forEach(function(item) {
                        var $item = $(item);
                        if ($item.hasClass('select-all-sery')) {
                            selectArray.push("y" + $item.attr("data-pid"));
                        } else {
                            var parent = $item.parent();
                            var selBoxArray = parent.find('.selbox-curron');
                            selBoxArray = [].slice.call(selBoxArray);
                            selBoxArray.forEach(function(itemCols) {
                                var $itemCols = $(itemCols);
                                $itemColsParent = $itemCols.parent();
                                itemArr.push($itemColsParent.attr('data-id') || 0);
                            })
                        }

                    });
                    returnQuerysArray = selectArray.concat(itemArr);
                }
                typeof options.thirdClickCallback === 'function' && options.thirdClickCallback.call(that, {
                    returnQuerysArray: returnQuerysArray,
                    reffeUrl: url
                });

            });
            this.isInited = true;

        },
        selectAll: function() {
            //nex-selebox selbox-curron
            var that = this,
                options = that.options;
            var nexSeleBoxNodeList = $(options.outerWrapper).find(".nex-sel-carlist").find('.nex-selebox');
            var selBoxCurronNodelist = $(options.outerWrapper).find(".nex-sel-carlist").find('.selbox-curron');
            if (nexSeleBoxNodeList.length === selBoxCurronNodelist.length) {
                $(options.outerWrapper).find(".all-car-models").find(".nex-selebox").addClass('selbox-curron');
            }
        },
        initCarScroll: function() {
            var that = this;
            if (!!that.carScroll) {
                that.carScroll.destroy();
            }
            that.carScroll = null;
            var options = that.options;
            var wrapper = options.secondWarpperSelector + " .wrapper";
            that.carScroll = new IScroll(wrapper, iscrollOptions);

        },
        initSubCarScroll: function() {
            var that = this;
            if (!!that.subCarScroll) {
                that.subCarScroll.destroy();
            }
            that.subCarScroll = null;
            var options = that.options;
            var wrapper = options.thirdWrapperSelector + " .wrapper";
            that.subCarScroll = new IScroll(wrapper, iscrollOptions);
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

        },
        getHotBrandData: function() {
            var that = this,
                options = that.options;
            $.ajax({
                type: 'get',
                url: api.hotbrand,
                dataType: "jsonp",
                success: function(data) {
                    var len = data.length;
                    if (len > 8) {
                        data.length = 8;
                    }

                    htmlRender.render({
                        containerid: options.hotContainerSelector,
                        templateid: options.hotTemplteName,
                        data: {
                            data: data
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
                carUrl += "&ps=";
                carUrl += encodeURIComponent(extraparam);
            }

            $.ajax({
                type: 'get',
                url: carUrl,
                async: false,
                dataType: "jsonp",
                success: function(data) {
                    if (!!data && !!data.length) {
                        that.seryData[pid] = data;
                        that.renderCar(data, pid, name);
                    }
                }
            });
        },
        getSubCarData: function(pid, name, href) {
            if (!pid) { return false; }
            var that = this,
                options = that.options;
            var subCarUrl = api.subcar + "?csid=";
            subCarUrl += pid;

            $.ajax({
                type: 'get',
                url: subCarUrl,
                async: false,
                dataType: "jsonp",
                success: function(data) {
                    if (!!data) {
                        console.log(data);
                        that.subCarData[pid] = data;
                        that.renderSubCar(data, pid, name, href);
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
            var indexSidebar = new IndexSidebar({
                isAdjust: false,
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
        showWrapper: function() {
            // $(this.options.outerWrapper).show();
        },
        hideWrapper: function() {
            //$(this.options.outerWrapper).hide();
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
        renderSubCar: function(data, pid, name, href) {
            var that = this;
            var options = that.options;
            htmlRender.render({
                containerid: options.thirdContainerSelector,
                templateid: options.thirdTemplateName,
                data: {
                    data: data,
                    pid: pid,
                    name: name,
                    href: href,
                    kLen: Object.keys(data).length
                },
                type: "html"
            });
            that.initSubCarScroll();
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