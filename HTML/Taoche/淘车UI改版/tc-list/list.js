$(function() {
    /*Validator start*/
    String.prototype.format = String.prototype.format || function(obj) {
        var that = this;
        if (typeof obj == "object") {
            for (var attr in obj) {
                var regAttr = eval("/\\{" + attr + "\\}/ig");
                that = that.replace(regAttr, obj[attr]);
            }
        } else {
            //把参数放到数组里面 slice() 方法可从已有的数组中返回选定的元素。
            var arr = [].slice.call(arguments, 1);
            //调用自己
            return format(that, arr);
        }
        return that;
    };
    /*Validator end*/

    /*param start*/
    var parametersHelper = {
        paramsKeys: ['p', 'g', 'e', 's', 'b', 'x', 'c', 'd', 'z', 'a', 'o', 'q', 't', 'r'],
        params: {},
        paramsbak: {},
        querysKeys: ['pic', 'bm', 'newcar', 'cy', 'active', 'lp', 'hp'], //有图,帮买,准新车,国别,活动,低价格,高价格
        querys: {},
        querysbak: {},
        currenturl: '',
        url: '/buycar/p4g4e2s2bx2c2dz29859889811a5o2q1t1r2/?pic=1&bm=1&t=3&newcar=1&active=1',
        urlQuery: 'pic=1&bm=1&t=3&newcar=1&active=1&cy=2', //window.location.search.substr(1),
        urlquerys: window.location.search.substr(1),
        urlfragment: '/buycar/',
        urlMoreFragment: 'pgesbxcdzaoqtr',
        init: function() {
            this.splitUrl();
            this.createParams();
            this.createQuerys();
        },
        getParamValue: function(paramter, name) {
            var reg = new RegExp('(' + name + '+)(\\d*)');
            console.log(reg)
            var r = paramter.match(reg);
            if (r != null) return unescape(r[2]);
        },

        getQueryValue: function(name) {
            var that = this;
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        createParams: function() {
            var that = this;
            that.paramsKeys.forEach(function(item, index) {
                var itemValue = that.getParamValue(that.urlMoreFragment, item);
                that.params[item] = itemValue;
            });
            console.log(that.params);
            that.paramsbak = $.extend({}, that.params);
        },
        createQuerys: function() {
            var that = this;
            var hash,
                querysJson = {},
                hashes = that.urlQuery.split('&');

            console.log(hashes);
            for (var i = 0, len = hashes.length; i < len; i++) {
                hash = !!hashes[i] && hashes[i].split('=');
                if (!!hash[0]) {
                    querysJson[hash[0]] = hash[1];
                }
            }

            that.querys = querysJson;
            that.querysbak = querysJson;
            console.log(that.querys);
        },
        geturl: function() {
            var that = this;
            //params
            var params = that.params;
            var paramsStr = '';
            for (var property in params) {
                paramsStr += property;
                var paramsValue = params[property];
                paramsStr += !!paramsValue ? paramsValue : '';
            }
            //querys
            var querys = that.querys;
            var querysStr = '';
            for (var item in querys) {
                var querysValue = querys[item];
                if (!!querysValue) {
                    querysStr += item;
                    querysStr += "=";
                    querysStr += querys[item];
                    querysStr += "&";
                }
            }

            querysStr = querysStr.substr(0, querysStr.length - 1);
            console.log(that.urlfragment);
            console.log(paramsStr);
            console.log(querysStr);

            that.currenturl = that.urlfragment + paramsStr + "?" + querysStr;
            console.log(that.currenturl);

        },
        splitUrl: function() {
            var that = this;
            var reg = /(\/(\w+)\/)|((\w+)\/)/ig;

            var paramsFragments = that.url.match(reg);

            that.urlfragment = paramsFragments[0];
            if (that.urlfragment == "/all/") {
                that.urlfragment = "/buycar/";
            }
            if (paramsFragments.length > 1) {
                that.urlMoreFragment = paramsFragments[1].substr(0, paramsFragments[1].length - 1);
            }
        }

    }
    parametersHelper.init();
    console.log(parametersHelper);
    parametersHelper.geturl();
    /*param end*/

    /*filterBar  start*/
    function FilterBar(argument) {
        this.filterBarSelector = $('#filter-bar');
        this.filterBarContentSelector = $('#filter-bar>div');

        this.filterOrder = this.filterBarSelector.find("#filter-order");
        this.filterOrderLayer = this.filterBarSelector.find("#filter-order-layer");

        this.filterPrice = this.filterBarSelector.find('#filter-price');
        this.filterPriceLayer = this.filterBarSelector.find('#filter-price-layer');

        this.filterMore = this.filterBarSelector.find('#filter-more');
        this.filterMoreLayer = this.filterBarSelector.find('#filter-more-layer');

        this.maskCover = $("#mask-cover");
        this.top = this.filterBarSelector.offset().top;

        this.carAgeId = this.filterMoreLayer.find("#carAgeId");

        this.isInited = false;
        this.filterMoreLayerScroll = null;

        this.dataSet = null;

        this.init();
    }

    FilterBar.prototype = {
        init: function() {
            this.getMoreData();
            this.bindEvent();
        },
        scrolling: function(scrollTop) {
            var that = this;
            var filterBarTop = that.top;
            if (scrollTop >= filterBarTop && that.filterBarContentSelector.hasClass('posit-rel')) {
                that.filterBarContentSelector.removeClass('posit-rel').addClass('posit-fix');
            } else if (scrollTop < filterBarTop && that.filterBarContentSelector.hasClass('posit-fix')) {

                that.filterBarContentSelector.removeClass('posit-fix').addClass('posit-rel');
            }
        },
        resetData: function() {
            var that = parametersHelper;
            that.params = $.extend({}, that.paramsbak);
            that.querys = $.extend({}, that.querysbak);
            this.bindHtml(this.dataSet);
        },
        bindHtml: function(data) {
            console.log(data);
            var that = this;
            that.createCarAgeHtml(data.dictCarAge, parametersHelper.params.a); //车龄
            that.createMileageHtml(data.dictMileage, parametersHelper.params.x); //里程
            that.createLevelHtml(data.dicCarLevelCustom, parametersHelper.params.g); //级别
            that.createExhaustHtml(data.dictExhaust, parametersHelper.params.e); //排量
            that.createGearBoxHtml(data.dicCustomGearBox, parametersHelper.params.b); //变速箱
            that.createEmissionHtml(data.dicEmission, parametersHelper.params.o); //排放标准
            that.createDriveHtml(data.dicCarDrive, parametersHelper.params.q); //驱动
            that.createCarBodyHtml(data.dicCarBody, parametersHelper.params.t); //车身
            that.createCarFuelHtml(data.dicFuel, parametersHelper.params.r); //燃料
            that.createCarCountryHtml(data.dicCountry, parametersHelper.querys.cy); //国别
            that.createCarColorHtml(data.dicCarColor, parametersHelper.params.c); //颜色
            that.createCarConfigHtml(data.listConfiguration, parametersHelper.params.z); //亮点配置
            that.createPicHtml(); //有图
            this.createBmHtml(); //帮买
            this.createNewCarHtml(); //准新车
            this.createSourceHtml(); //来源
            setTimeout(function() {
                !!that.filterMoreLayerScroll && that.filterMoreLayerScroll.refresh();
            }, 0);
            setTimeout(function() {
                that.dataSet = data;
            }, 10)
        },
        getMoreData: function() {
            var that = this;
            $.ajax({
                type: 'get',
                url: 'http://m.taoche.com/ajax/filtercondition/getfiltercondition.ashx',
                dataType: "jsonp",
                success: function(data) {
                    that.bindHtml(data);
                }
            });

        },
        createSourceHtml: function() {
            var s = parametersHelper.params['s'];
            $("#source-tag>a[data-id='" + s + "']").parent().addClass('cur');
        },
        createPicHtml: function() {
            var pic = parametersHelper.querys['pic'];
            if (!!pic) {
                $(".pic-tag").addClass('cur');
            }
        },
        createBmHtml: function() {
            var bm = parametersHelper.querys['bm'];
            if (!!bm) {

                $(".bm-tag").addClass('cur');
            }
        },
        createNewCarHtml: function() {
            var newcar = parametersHelper.querys['newcar'];
            if (!!newcar) {
                $(".newcar-tag").addClass('cur');
            }
        },
        createCarAgeHtml: function(data, current) {
            current = current || '';
            htmlRender.render({
                containerid: '#carAgeId',
                templateid: '#systemTemplate',
                data: {
                    data: data,
                    current: current,
                    logwt: 'wap_buycar_select_more_age_'
                },
                type: "html"
            });
        },
        createMileageHtml: function(data, current) {
            current = current || '';
            htmlRender.render({
                containerid: '#mileageId',
                templateid: '#systemTemplate',
                data: {
                    data: data,
                    current: current,
                    logwt: 'wap_buycar_select_more_mileage_'
                },
                type: "html"
            });
        },
        createLevelHtml: function(data, current) {
            current = current || '';
            htmlRender.render({
                containerid: '#levelId',
                templateid: '#customTemplate',
                data: {
                    data: data,
                    current: current,
                    logwt: 'wap_buycar_select_more_level_'
                },
                type: "html"
            });
        },
        createExhaustHtml: function(data, current) {
            current = current || '';
            htmlRender.render({
                containerid: '#exhaustId',
                templateid: '#systemTemplate',
                data: {
                    data: data,
                    current: current,
                    logwt: 'wap_buycar_select_more_exhuast_'
                },
                type: "html"
            });
        },
        createGearBoxHtml: function(data, current) {
            current = current || '';
            htmlRender.render({
                containerid: '#gearBoxId',
                templateid: '#carGearBoxTemplate',
                data: {
                    data: data,
                    current: current
                },
                type: "html"
            });
        },
        createEmissionHtml: function(data, current) {
            current = current || '';
            htmlRender.render({
                containerid: '#emissionId',
                templateid: '#systemTemplate',
                data: {
                    data: data,
                    current: current,
                    logwt: 'wap_buycar_select_more_emissionstandard_'
                },
                type: "html" ////carLevelCustomTemplate exhaustId  emissionId 
            });
        },
        createDriveHtml: function(data, current) {
            current = current || '';
            this.createTagData({
                data: data,
                current: current,
                selector: '#selected-item-cardrive',
                tagId: "Id",
                tagName: "Name"
            });
            htmlRender.render({
                containerid: '#carDriveId',
                templateid: '#carDriveTemplate',
                data: {
                    data: data,
                    current: current
                },
                type: "html" //carBodyId
            });
        },
        createCarBodyHtml: function(data, current) {
            current = current || '';
            this.createTagData({
                data: data,
                current: current,
                selector: '#selected-item-carbody',
                tagId: "TagCode",
                tagName: "TagName"
            });
            htmlRender.render({
                containerid: '#carBodyId',
                templateid: '#systemTemplate',
                data: {
                    data: data,
                    current: current,
                    logwt: 'wap_buycar_select_more_body_'
                },
                type: "html"
            });
        },
        createCarFuelHtml: function(data, current) {
            current = current || '';
            this.createTagData({
                data: data,
                current: current,
                selector: '#selected-item-carfuel',
                tagId: "TagCode",
                tagName: "TagName"
            });

            htmlRender.render({
                containerid: '#carFuelId',
                templateid: '#systemTemplate',
                data: {
                    data: data,
                    current: current,
                    logwt: 'wap_buycar_select_more_fuel_'
                },
                type: "html"
            });
        },
        createCarCountryHtml: function(data, current) {
            current = current || '';
            this.createTagData({
                data: data,
                current: current,
                selector: '#selected-item-carcounty',
                tagId: "TagCode",
                tagName: "TagName"
            });

            htmlRender.render({
                containerid: '#carCountyId',
                templateid: '#systemTemplate',
                data: {
                    data: data,
                    current: current,
                    logwt: 'wap_buycar_select_more_conutry_'
                },
                type: "html" //carBodyId
            });
        },
        createCarColorHtml: function(data, current) {
            current = current || '';

            this.createTagData({
                data: data,
                current: current,
                selector: '#selected-item-carcolor',
                tagId: "Id",
                tagName: "Name"
            });

            htmlRender.render({
                containerid: '#carColorId',
                templateid: '#carCarColorTemplate',
                data: {
                    data: data,
                    current: current
                },
                type: "html"
            });
        },
        createCarConfigHtml: function(data, current) {
            current = current || '';
            var currentArr = !!current ? current.split('98') : [];
            htmlRender.render({
                containerid: '#carConfigId',
                templateid: '#carHotConfigTemplate',
                data: {
                    data: data,
                    arr: currentArr
                },
                type: "html" //carBodyId carConfigId
            });
            this.createConfigData(data, currentArr);
        },
        createConfigData: function(data, currentArr) {
            var that = this;
            var currentItem = [];
            data.forEach(function(item) {
                if (currentArr.indexOf(String(item.CCDID)) > -1) {
                    currentItem.push(item);
                }
            });


            if (!!currentItem) {
                setTimeout(function() {
                    that.createTag('#selected-item-hotconfig', currentItem, "CCName");
                }, 10)
            }

        },
        createTagData: function(options) {
            var data = options.data,
                current = options.current,
                selector = options.selector,
                tagId = options.tagId,
                tagName = options.tagName;

            var that = this;
            var currentItem = [];
            data.forEach(function(item) {
                if (item[tagId] == current) {
                    currentItem.push(item);
                }
            });
            console.log(currentItem);


            if (!!currentItem) {
                setTimeout(function() {
                    that.createTag(selector, currentItem, tagName);
                }, 10)
            }
        },
        createTag: function(selector, arr, key) {
            var str = '';
            arr.forEach(function(item) {
                str += item[key];
            });
            $(selector).text(str);
        },
        initMoreLayer: function() {
            var dcHeight = document.documentElement.clientHeight,
                outerHeight = dcHeight - 100,
                innerHeight = outerHeight - 100;
            this.filterMoreLayer.css('height', outerHeight + "px");
            $('#filter-more-wrapper').css('height', innerHeight + "px");
            this.filterMoreLayerScroll = new IScroll("#filter-more-wrapper", {
                bounce: false,
                tap: true
            });
        },
        bindEvent: function() {
            var that = this;
            //排序点击
            that.filterOrder.click(function() {
                var target = $(this);
                var params = {
                    target: target,
                    showMask: true,
                    initLayerScroll: null,
                    showCallback: function() {
                        /* body... */
                    },
                    hideCallback: function() {

                    },
                    layer: that.filterOrderLayer
                }
                //调用
                that.toogleSelect(params);
            });
            //价格点击
            that.filterPrice.click(function() {
                var target = $(this);

                var params = {
                    target: target,
                    showMask: true,
                    initLayerScroll:null,
                    showCallback: function() {
                        /* body... */
                    },
                    hideCallback: function() {
                        /* body... */
                    },
                    layer: that.filterPriceLayer
                }
                //调用
                that.toogleSelect(params);
            });
            //更多点击
            that.filterMore.click(function() {
                var target = $(this);
                var params = {
                    target: target,
                    showMask: false,
                    initLayerScroll: function() {
                        if (!that.isInited) {
                            that.initMoreLayer();
                            that.isInited = true;
                        }
                    },
                    destoryScroll: function() {
                        that.filterMoreLayerScroll = null;
                    },
                    showCallback: function() {
                        /* body... */
                    },
                    hideCallback: function() {
                        console.log(999999999999);
                        that.resetData();
                    },
                    layer: that.filterMoreLayer
                }
                //调用
                that.toogleSelect(params);
            });
            //
            $('#close-more-filterlayer').click(function() {
                that.filterMore.trigger('click');
            });
            //遮罩层
            that.maskCover.click(function() {
                var filterTarget = that.filterBarSelector.find('.seller-nav-sel').eq(0).attr('data-filter');
                console.log(filterTarget);
                filterTarget && that[filterTarget] && that[filterTarget].trigger('click');
            });

            //车源特色
            $('#sourceid').on("tap", ".source-tag>a", function() {
                var $this = $(this),
                    parent = $this.parent(),
                    id = $this.attr("data-id");
                parent.addClass('cur').siblings('.source-tag').removeClass('cur');
                parametersHelper.params["s"] = id;
                console.log("s=" + id);
                console.log(parametersHelper);
                parametersHelper.geturl();

            });
            //准新车
            $('#sourceid').on("tap", ".newcar-tag>a", function() {
                var $this = $(this),
                    parent = $this.parent();
                if (parent.hasClass('cur')) {
                    parametersHelper.querys['newcar'] = 0;
                    parent.removeClass('cur');
                } else {
                    parametersHelper.querys['newcar'] = 1;
                    parent.addClass('cur');
                    $('#carAgeId').find('li').removeClass('cur');
                    parametersHelper.params["a"] = '';
                    $('#mileageId').find('li').removeClass('cur');
                    parametersHelper.params["x"] = '';
                }
                console.log(parametersHelper);
                parametersHelper.geturl();
            });
            //有图
            $('#sourceid').on("tap", ".pic-tag>a", function() {
                var $this = $(this),
                    parent = $this.parent();
                if (parent.hasClass('cur')) {
                    parametersHelper.querys['pic'] = 0;
                    parent.removeClass('cur');
                } else {
                    parametersHelper.querys['pic'] = 1;
                    parent.addClass('cur');
                }
                console.log(parametersHelper);
                parametersHelper.geturl();
            });
            //帮买车源
            $('#sourceid').on("tap", ".bm-tag>a", function() {
                var $this = $(this),
                    parent = $this.parent();
                if (parent.hasClass('cur')) {
                    parametersHelper.querys['bm'] = 0;
                    parent.removeClass('cur');
                } else {
                    parametersHelper.querys['bm'] = 1;
                    parent.addClass('cur');
                }
                console.log(parametersHelper);
                parametersHelper.geturl();
            });
            //车龄
            $('#carAgeId').on('tap', "a", function() {
                var $this = $(this),
                    parent = $this.parent();

                if (parent.hasClass('cur')) {
                    parent.removeClass('cur');
                    parametersHelper.params["a"] = '';

                } else {
                    var id = $this.attr("data-id");
                    parent.addClass('cur').siblings().removeClass('cur');
                    parametersHelper.params["a"] = id;
                    $('#sourceid .newcar-tag').removeClass('cur');
                    parametersHelper.querys['newcar'] = 0;
                    console.log("a=" + id);
                }
                console.log(parametersHelper);
                parametersHelper.geturl();
            });
            //里程
            $('#mileageId').on('tap', "a", function() {
                var $this = $(this),
                    parent = $this.parent();

                if (parent.hasClass('cur')) {
                    parent.removeClass('cur');
                    parametersHelper.params["x"] = '';
                } else {
                    var id = $this.attr("data-id");
                    parent.addClass('cur').siblings().removeClass('cur');
                    parametersHelper.params["x"] = id;

                    $('#sourceid .newcar-tag').removeClass('cur');
                    parametersHelper.querys['newcar'] = 0;
                    console.log("x=" + id);
                }

                console.log(parametersHelper);
                parametersHelper.geturl();
            });
            //级别
            $('#levelId').on('tap', "a", function() {
                var $this = $(this),
                    parent = $this.parent();

                if (parent.hasClass('cur')) {
                    parent.removeClass('cur');
                    parametersHelper.params["g"] = '';
                } else {
                    var id = $this.attr("data-id");
                    parent.addClass('cur').siblings().removeClass('cur');
                    parametersHelper.params["g"] = id;
                    console.log("g=" + id);
                }

                console.log(parametersHelper);
                parametersHelper.geturl();
            });
            //排量
            $('#exhaustId').on('tap', "a", function() {
                var $this = $(this),
                    parent = $this.parent();

                if (parent.hasClass('cur')) {
                    parent.removeClass('cur');
                    parametersHelper.params["e"] = '';
                } else {
                    var id = $this.attr("data-id");
                    parent.addClass('cur').siblings().removeClass('cur');
                    parametersHelper.params["e"] = id;
                    console.log("e=" + id);
                }

                console.log(parametersHelper);
                parametersHelper.geturl();
            });

            //变速箱
            $('#gearBoxId').on('tap', "a", function() {
                var $this = $(this),
                    parent = $this.parent();

                if (parent.hasClass('cur')) {
                    parent.removeClass('cur');
                    parametersHelper.params["b"] = '';
                } else {
                    var id = $this.attr("data-id");
                    parent.addClass('cur').siblings().removeClass('cur');
                    parametersHelper.params["b"] = id;
                    console.log("b=" + id);
                }

                console.log(parametersHelper);
                parametersHelper.geturl();
            });
            //排放标准
            $('#emissionId').on('tap', "a", function() {
                var $this = $(this),
                    parent = $this.parent();

                if (parent.hasClass('cur')) {
                    parent.removeClass('cur');
                    parametersHelper.params["o"] = '';
                } else {
                    var id = $this.attr("data-id");
                    parent.addClass('cur').siblings().removeClass('cur');
                    parametersHelper.params["o"] = id;
                    console.log("o=" + id);
                }


                console.log(parametersHelper);
                parametersHelper.geturl();
            });
            //驱动  
            $('#carDriveId').on('tap', "a", function() {
                var $this = $(this),
                    parent = $this.parent();

                if (parent.hasClass('cur')) {
                    parent.removeClass('cur');
                    parametersHelper.params["q"] = '';
                    $('#selected-item-cardrive').text('');
                } else {
                    var current = $this.attr("data-id");
                    parent.addClass('cur').siblings().removeClass('cur');
                    parametersHelper.params["q"] = current;
                    that.createTagData({
                        data: that.dataSet.dicCarDrive,
                        current: current,
                        selector: '#selected-item-cardrive',
                        tagId: "Id",
                        tagName: "Name"
                    });
                }
                console.log(parametersHelper);
                parametersHelper.geturl();



            });
            //车身  
            $('#carBodyId').on('tap', "a", function() {
                var $this = $(this),
                    parent = $this.parent();
                if (parent.hasClass('cur')) {
                    parent.removeClass('cur');
                    parametersHelper.params["t"] = '';
                    $('#selected-item-carbody').text('');
                } else {
                    var current = $this.attr("data-id");
                    parent.addClass('cur').siblings().removeClass('cur');
                    parametersHelper.params["t"] = current;
                    that.createTagData({
                        data: that.dataSet.dicCarBody,
                        current: current,
                        selector: '#selected-item-carbody',
                        tagId: "TagCode",
                        tagName: "TagName"
                    });
                }
                console.log(parametersHelper);
                parametersHelper.geturl();
            });
            //燃料  
            $('#carFuelId').on('tap', "a", function() {
                var $this = $(this),
                    parent = $this.parent();

                if (parent.hasClass('cur')) {
                    parent.removeClass('cur');
                    parametersHelper.params["r"] = '';
                    $('#selected-item-carfuel').text('');
                } else {
                    var current = $this.attr("data-id");
                    parent.addClass('cur').siblings().removeClass('cur');
                    parametersHelper.params["r"] = current;
                    that.createTagData({
                        data: that.dataSet.dicFuel,
                        current: current,
                        selector: '#selected-item-carfuel',
                        tagId: "TagCode",
                        tagName: "TagName"
                    });
                }

            });
            //国别  
            $('#carCountyId').on('tap', "a", function() {
                var $this = $(this),
                    parent = $this.parent();

                if (parent.hasClass('cur')) {
                    parent.removeClass('cur');
                    parametersHelper.querys["cy"] = '';
                    $('#selected-item-carcounty').text('');
                } else {
                    var current = $this.attr("data-id");
                    parent.addClass('cur').siblings().removeClass('cur');
                    parametersHelper.querys["cy"] = current;
                    that.createTagData({
                        data: that.dataSet.dicFuel,
                        current: current,
                        selector: '#selected-item-carcounty',
                        tagId: "TagCode",
                        tagName: "TagName"
                    });
                }

            });
            //颜色  
            $('#carColorId').on('tap', "a", function() {
                /*
                var $this = $(this),
                    parent = $this.parent(),
                    current = $this.attr("data-id");
                parent.addClass('cur').siblings().removeClass('cur');
                parametersHelper.params["c"] = current;
                console.log("c=" + current);
                console.log(parametersHelper);parametersHelper.geturl();

                that.createTagData({
                    data: that.dataSet.dicCarColor,
                    current: current,
                    selector: '#selected-item-carcolor',
                    tagId: "Id",
                    tagName: "Name"
                });
                */
                var $this = $(this),
                    parent = $this.parent();

                if (parent.hasClass('cur')) {
                    parent.removeClass('cur');
                    parametersHelper.params["c"] = '';
                    $('#selected-item-carcolor').text('');
                } else {
                    var current = $this.attr("data-id");
                    parent.addClass('cur').siblings().removeClass('cur');
                    parametersHelper.params["c"] = current;
                    that.createTagData({
                        data: that.dataSet.dicCarColor,
                        current: current,
                        selector: '#selected-item-carcolor',
                        tagId: "Id",
                        tagName: "Name"
                    });
                }

            });

            //亮点配置  
            $('#carConfigId').on('tap', "a", function() {
                var $this = $(this),
                    parent = $this.parent();
                if (parent.hasClass('cur')) {
                    parent.removeClass('cur')
                } else {
                    parent.addClass('cur')
                }
                var selected = [];
                $('#carConfigId').find('li.cur>a').each(function(index, item) {
                    var id = $(item).attr('data-id');
                    selected.push(id);
                });
                console.log(selected);
                that.createConfigData(that.dataSet.listConfiguration, selected);
                parametersHelper.params["z"] = selected.join('98');
                console.log(parametersHelper)
            });
            //点击确定
            $(document).on('tap', '#li-sure', function() {
                parametersHelper.geturl();
            });
        },
        toogleSelect: function(options) {
            var that = this;
            if (options.target.hasClass('seller-nav-sel')) {
                var scrollTop = getScrollTop();
                that.scrolling(scrollTop);
                options.target.removeClass('seller-nav-sel');
                that.maskCover.addClass('hide');
                options.layer.addClass('hide');
                typeof options.destoryScroll === 'function' && options.destoryScroll.call(that);
                typeof options.hideCallback === 'function' && options.hideCallback.call(that);
                document.removeEventListener('touchmove', preventScroll);
            } else {
                document.addEventListener('touchmove', preventScroll, isPassive() ? {
                    capture: false,
                    passive: false
                } : false);
                if (!that.filterBarContentSelector.hasClass('posit-fix')) {
                    that.filterBarContentSelector.removeClass('posit-rel').addClass('posit-fix');
                }

                options.target.addClass('seller-nav-sel').siblings('li').removeClass('seller-nav-sel');
                //mask-cover
                if (options.showMask && that.maskCover.hasClass('hide')) {
                    that.maskCover.removeClass('hide');
                }

                options.layer.siblings('.filter-layer').addClass('hide');
                options.layer.removeClass('hide');

                typeof options.initLayerScroll === 'function' && options.initLayerScroll.call(that);
            }

        }
    };

    var filterBar = new FilterBar();
    /*filterBar  end*/

    /*Price start*/
    function PriceHanlder() {
        this.maxSelector = $('#max-price');
        this.minSelector = $('#min-price');
        this.submitSelector = $('#price-btn');
        this.reg = /^\d{1,3}$/;
        this.pricesquerytemplate = 'hp={0}&lp={1}';
        this.pricesquery = '';
        this.init();
    }
    PriceHanlder.prototype = {
        init: function() {
            this.bindEvent();
        },
        checkValid: function() {
            /* body... */
        },
        controlSubmitState: function() {
            var that = this,
                maxValue = parseInt(that.maxSelector.val()) || 0,
                minValue = parseInt(that.minSelector.val()) || 0;

            if (!that.reg.test(minValue)) {
                that.submitSelector.removeClass('btn-sel');
                return false;
            }

            if (!that.reg.test(maxValue)) {
                that.submitSelector.removeClass('btn-sel');
                return false;
            }

            //0
            if (!minValue && !maxValue) {
                that.submitSelector.removeClass('btn-sel');
                return false;
            }

            if (maxValue < minValue) {
                that.submitSelector.removeClass('btn-sel');
                return false;
            }

            console.log('minValue=' + minValue);
            console.log('maxValue=' + maxValue);
            that.pricesquery = that.pricesquerytemplate.format([maxValue, minValue]);
            console.log(that.pricesquery)
            that.submitSelector.addClass('btn-sel');

        },
        bindEvent: function() {
            var that = this;
            var tempMaxValue = '';
            that.maxSelector.off()
                .keydown(function(e) {
                    if (e.currentTarget.validity.valid) {
                        tempMaxValue = that.maxSelector.val();
                    }
                })
                .keyup(function(e) {
                    if (!e.currentTarget.validity.valid && that.submitSelector.hasClass('btn-sel')) {
                        that.submitSelector.removeClass('btn-sel');
                        that.maxSelector.val(tempMaxValue);
                        return false;
                    }
                    var currentValue = that.maxSelector.val();
                    if (!!currentValue && currentValue.length > 3) {
                        that.maxSelector.val(tempMaxValue);
                    }
                    that.controlSubmitState();

                    // var money = $.trim(price.val());
                    // that.checkPrice(money);
                });

            var tempMinValue = '';
            that.minSelector.off()
                .keydown(function(e) {
                    if (e.currentTarget.validity.valid) {
                        tempMinValue = that.minSelector.val();
                    }
                })
                .keyup(function(e) {
                    if (!e.currentTarget.validity.valid && that.submitSelector.hasClass('btn-sel')) {
                        that.submitSelector.removeClass('btn-sel');
                        that.minSelector.val(tempMinValue);
                        return false;
                    }

                    var currentValue = that.minSelector.val();
                    if (!!currentValue && currentValue.length > 3) {
                        that.minSelector.val(tempMinValue);
                    }
                    that.controlSubmitState();
                    // var money = $.trim(price.val());
                    // that.checkPrice(money);
                });

            //价格提交
            that.submitSelector.click(function() {
                var $this = $(this);
                if (!$this.hasClass('btn-sel')) {
                    return false;
                }

                console.log(that.pricesquery);
            });
        },

    }

    var pricehanlder = new PriceHanlder();
    /*Price end*/

    /*brand start*/
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
        ainimateHideAfter: function() {
            console.log('ainimateHideAfter');
        },
        currentfirstid: 9, //第一层级选中id
        currentdsenondid: 2556 //第二层级选中id
    });

    $(".brand-trigger").click(function() {
        barnds.init();
        $("#mask-cover").trigger('click');
    });

    /*brand end*/


    /*scroll function start */
    $(window).scroll(function() {
        var scrollTop = getScrollTop();
        //筛选banner浮层；
        filterBar.scrolling(scrollTop);


        //加载更多

    });

    /*scroll function end */

    /*filter more start*/

    $('#filter-more-layer .term-box .stle-close').click(function() {
        var $this = $(this);
        $this.toggleClass('hide').siblings('div').toggleClass('hide');

        setTimeout(function() {
            filterBar.filterMoreLayerScroll.refresh();
            filterBar.filterMoreLayerScroll.scrollToElement($this.parent()[0]);
        }, 0);

    });

    $('#filter-more-layer .term-box .tt-small-ext').click(function() {
        $(this).toggleClass('hide').siblings('div').toggleClass('hide');
        setTimeout(function() {
            filterBar.filterMoreLayerScroll.refresh();
        }, 0);
    });


    /*filter more start*/

    /*common function*/
    function getScrollTop() {
        return document.body && document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
    }

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



    function preventScroll() {
        arguments[0].preventDefault();
    }

    function _debounce(func, wait, immediate) {
        // immediate默认为false
        var timeout, args, context, timestamp, result;

        var later = function() {
            // 当wait指定的时间间隔期间多次调用_.debounce返回的函数，则会不断更新timestamp的值，导致last < wait && last >= 0一直为true，从而不断启动新的计时器延时执行func
            var last = (+(new Date())) - timestamp;

            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                }
            }
        };

        return function(e) {
            context = this;
            args = arguments;
            timestamp = +(new Date());
            // 第一次调用该方法时，且immediate为true，则调用func函数
            var callNow = immediate && !timeout;
            // 在wait指定的时间间隔内首次调用该方法，则启动计时器定时调用func函数
            if (!timeout) timeout = setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }
            return result;
        };
    };

});


