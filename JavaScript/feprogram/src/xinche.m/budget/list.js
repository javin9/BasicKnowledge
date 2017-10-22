require('./budget.scss');
// var car = require('libs/carSelect');
var IScroll = require('iscroll')
import Vue from 'vue';
import CarSelector from 'libs/vue-components/car-selector'
import hideType from 'libs/hideType';

//app下载链接
tools.appDown(true);

//隐藏所有超链接
$(".choice a").attr("href","javascript:void(0);");
// 按预算选车api
var BudgetAPI = {
    data: {
        carPrice: -1,
        downPayment: -1,
        monthlyPayment: -1,
        repaymentPeriod: -1,
        carMasterBrandId: -1,
        carSerialLevel: -1,
        sort: '',
        cityId: -1,
        pageIndex: 1,
        pageSize: 6,
        isFirst:true
    },
    getProductUrl: getBudgetInfoUrl,
    getProductCountUrl: getBudgetInfoCountUrl,
    upadteData: function(data) {
        this.data = $.extend(this.data, data);
        return this;
    },
    getProducts: function(callback) {
        var self = this,
            condition='';
        for (var i in self.data) {
            if (self.data[i] != -1 && i != 'cityId' && i != 'pageIndex' && i != 'pageSize') {
                if(i=='carMasterBrandId'){
                    condition += 'b'+ self.data[i];
                }else {
                    condition += self.data[i];
                }
            }
        }

        $.ajax({
            type: 'GET',
            url: self.getProductUrl,
            data: {
                condition:condition,
                source:Source,
                channel:Channel,
                cityId:self.data.cityId,
                pageIndex: self.data.pageIndex,
                pageSize: self.data.pageSize
            },
            success: function (result) {
                var obj = {
                    html: result,
                    total: parseInt($(result).eq(0).attr('data-Total')) || 0
                }
                callback(obj);
            }
        });
        return this;
    },
    getProductsCount: function(callback) {
        var self = this,
            condition='';
        for (var i in self.data) {
            if (self.data[i] != -1 && i != 'cityId' && i != 'pageIndex' && i != 'pageSize') {
                if(i=='carMasterBrandId'){
                    condition += 'b'+ self.data[i];
                }else {
                    condition += self.data[i];
                }
            }
        }

        $.ajax({
            type: 'GET',
            url: self.getProductCountUrl,
            data: {
                condition:condition,
                source:Source,
                channel:Channel,
                cityId:self.data.cityId
            },
            success: function (result) {
                if (result.Result) {
                    callback(result.RowCount);
                }
            }
        });
        return this;
    },
    getUrl: function() {//已改
        var url = BudgetUrl || '/home/budget';
        var _data = this.data,
            params = [],
            condition='';
        // console.log( _data);
        for (var i in _data) {
            if (_data[i] != "-1" && i != 'cityId' && i != 'pageIndex' && i != 'pageSize' && i!='isFirst') {
                if(i=='carMasterBrandId'){
                    condition += 'b'+ _data[i];
                }else{
                    condition += _data[i];
                }

            }
        }

        if (Source) {
            params.push('source=' + Source);
        }
        if (Channel) {
            params.push('channel=' + Channel);
        }
        if (params.length) {
            if(condition){
                url += '/'+ condition +'/?' + params.join('&') +'&cityId='+this.data.cityId;
            }else{
                url +='/?' + params.join('&') +'&cityId='+this.data.cityId;
            }
        }
        return url;
    }
};

var searchBar = {
    activedDropdown: null,
    closeTimeout: null,
    iscroll: {},
    cssTop: 0,

    init: function(options) {
        var self = this;
        var dropdowns = $('.search-bar .dropdown');
        self.afterChoose = options.afterChoose;
        self.afterClose = options.afterClose;

        $('.search-bar').on('click', '.dropdown .trigger', function() {
            var dropdown = $(this).parent();

            if (dropdown.hasClass('active')) {
                self.dropdownClose(dropdown);
            } else if($(this).parent('div').attr('id') != 'car-select'){
                if (!self.activedDropdown) {
                    self.dropdownOpen(dropdown);
                    self.activedDropdown = dropdown;
                } else {
                    self.dropdownClose(self.activedDropdown, 'fast');
                    self.dropdownOpen(dropdown, 'fast');
                    self.activedDropdown = dropdown;
                }
            // 点到car-select
            } else if (self.activedDropdown) {
                self.dropdownClose(self.activedDropdown, 'fast');
                self.activedDropdown = null;
            }
        });

        $('#maskLayer').on('click', function() {
            if (self.activedDropdown) {
                self.dropdownClose(self.activedDropdown);
            }
        });

        $('.search-bar').on('click', '.dropdown .down-content', function(e) {
            e.preventDefault();
            var target = $(e.target);
            var choice = target.hasClass('choice') ? target : target.parents('.choice').eq(0);

            if (choice) {
                var trigger = choice.parents('.dropdown').find('.trigger');
                if (!trigger.hasClass('no-update')) {
                    trigger.find('span').text(choice.attr('select-show') || choice.text());
                }
                if (choice.prev('.choice').length) {
                    trigger.addClass('selected');
                } else {
                    trigger.removeClass('selected');
                }
                if (self.afterChoose) {
                    self.afterChoose(choice);
                }
            }
        });

        $('.choice-list .choice').on('click', function() {
            var dropdown = $(this).parents('.dropdown');
            $(this).addClass('active').siblings().removeClass('active');
            self.dropdownClose(dropdown);
        });

        var downWrappers = $('.dropdown .down-wrapper');
        downWrappers.each(function(index) {
            $(this).attr('id', 'down-wrapper-' + index);
        });


        // // 隐藏下载app
        $(document).on("click","#app_colse", function() {
            $('body').removeClass('appShow');
            dropdowns.each(function() {
                if ($(this).hasClass('active')) {
                    self.dropdownClose($(this));
                }
            });
            self.dropdownPos();
        });
        document.addEventListener("appDownShow",function(e){
            $('body').addClass('appShow');
        })
        if (!$('#appDown').hasClass('hide')) {
            $('body').addClass('appShow');
        }
        tools.telChannel({
            'PageType': 4,
            'CityId': city.cityId,
            'CityText': city.cityName,
            'isDefault': false,
            'id': 'userTel',//初始化DOM结构id
            'telId': 'listTel',//手机号输入框id
            'statisticalMarker': 'm-xinche-budget-list-btn-tel-channel'
        }); 

        // 窗口尺寸变化 改变下拉尺寸
        $('html, body').resize(function() {
            if (self.activedDropdown) {
                self.dropdownOpen(self.activedDropdown, 'fast', 100);
            }
            self.dropdownPos();
        });
        self.dropdownPos();

        $(window).bind('touchmove', self.searchFix);
        $(window).bind('scroll', self.searchFix);
    },

    searchFix: function() {
        var top = document.documentElement.scrollTop || document.body.scrollTop;
        if (top >= $('#header-bar').offset().height) {
            $('#search-bar').addClass('fixed');
        } else {
            $('#search-bar').removeClass('fixed');
        }
    },

    dropdownPos: function() {
        return false;
        var dropdownWraps = $('.down-wrapper');
        // var top = $('#search-bar').height() + $('#header-bar').height() + $('#appDown .appdown_area').height();
        // var top = $('#yxWrapper').width()/10*170/75 + $('#appDown .appdown_area').height();
        var top = $('#search-bar').offset().top + $('#search-bar').offset().height-(document.documentElement.scrollTop||document.body.scrollTop);
        dropdownWraps.each(function() {
            $(this).css('top', top);
        });
    },

    dropdownOpen: function(elem, speed, duration) {
        var self = this;
        var downWrapper = elem.find('.down-wrapper');
        if (downWrapper && downWrapper.length) {
            downWrapper.addClass('opened');
            // var top = $('#search-bar').height() + $('#header-bar').height() + $('#appDown .appdown_area').height();
            // var top = $('#yxWrapper').width()/10*170/75 + $('#appDown .appdown_area').height();
            var top = $('#search-bar').offset().top + $('#search-bar').offset().height-(document.documentElement.scrollTop||document.body.scrollTop);
            var height, scrollFunction;
            if (downWrapper[0].scrollHeight < (document.documentElement.clientHeight - top - 80)) {
                height = downWrapper[0].scrollHeight;
                scrollFunction = function() {};
            } else {
                height = document.documentElement.clientHeight - top - 80;
                scrollFunction = function() {
                    if (!downWrapper.hasClass('iscroll-init')) {
                        self.iscroll[downWrapper.attr('id')] =  new IScroll('#' + downWrapper.attr('id'), {
                            scrollbars: true,
                            shrinkScrollbars: 'scale',
                            fadeScrollbars: true,
                            bounce: false,
                            click: true
                        });
                        downWrapper.addClass('iscroll-init')
                    } else {
                        self.iscroll[downWrapper.attr('id')].refresh();
                    }
                };
            }
            //downWrapper.css('top', top);
            downWrapper.animate({height: height}, duration || 300, scrollFunction);
            if (speed !== 'fast') {
                $('#maskLayer').fadeIn();
            }
        }
        if (self.closeTimeout) {
            clearTimeout(self.closeTimeout);
            self.closeTimeout = null;
        }
        elem.css('z-index', 1).addClass('active');

        $('body').bind('touchmove',function(e){
            e.preventDefault();
        });
    },

    dropdownClose: function(elem, speed, duration) {
        var self = this;
        var downWrapper = elem.find('.down-wrapper');
        var duration = 0;
        if (downWrapper && downWrapper.length) {
            if (speed !== 'fast') {
                $('#maskLayer').fadeOut();
            }
            downWrapper.animate({height: 0}, duration || 150);
            self.closeTimeout = setTimeout(function() {
                downWrapper.removeClass('opened');
            }, duration || 150);
        }
        elem.css('z-index', 0).removeClass('active');

        if (self.afterClose) {
            self.afterClose(elem);
        }
        self.activedDropdown = null;

        $('body').unbind('touchmove');
    }
};

var BudgetControl = {
    loading: false,
    data: {},   // 缓存数据
    dom: {},   // 缓存dom
    arrHistroy: [],
    init: function() {
        var self = this;
        var resetBtn = $('#reset-btn');
        var viewBtn = $('#view-btn');
        var carList = $('.budget-carlist .carlist');
        var carSelect = $('#car-select');

        self.dom.carList = carList;


        //初始化数据
        BudgetAPI.data.carPrice = $('#carPrice span.active').attr('data');
        BudgetAPI.data.downPayment = $('#downPayment span.active').attr('data');
        BudgetAPI.data.monthlyPayment = $('#monthlyPayment span.active').attr('data');
        BudgetAPI.data.repaymentPeriod = $('#repaymentPeriod span.active').attr('data');
        BudgetAPI.data.carSerialLevel = $('#carSerialLevel span.active').attr('data');
        BudgetAPI.data.sort = $('#sort span.active').attr('data')=='x0'?"":$('#sort span.active').attr('data');
        BudgetAPI.data.carMasterBrandId = typeof(brandId)!="undefined"?brandId:'-1';
        // console.log(BudgetAPI.data);
        // 初始化内容（没有更多 或者 没有产品
        var cars = carList.children('.car');
        var total = parseInt(cars.eq(0).attr('data-Total')) || 0;
        if (cars.length >= total) {
            carList.addClass('all');
            if (total > 0) {
                carList.append('<li class="no-more">没有更多了~</li>');
            } else if(BudgetAPI.data.pageIndex ==1){
                $('.default-box').show();
            }
        }

        // 选车控件
        carSelect.bind('click', () => vm.$broadcast('showCarSelector'))

        // 根据url更新搜索栏
        self.updateFilterByUrl();
        BudgetAPI.getProductsCount(function(result) {
            self.updateProductCount.apply(self, [result]);
        });
        self.arrHistroy.push(BudgetAPI.getUrl());

        // 选项
        $('.search-list, .choice-list').on('click', '.choice', function() {
            $(this).addClass('active').siblings().removeClass('active');
            var data = {},
                itemData=$(this).attr('data');
            if (itemData) {
                var _id= $(this).parent().attr('id');
                data[_id] = itemData;
                data.pageIndex = 1;
                if ($(this).parents('.choice-list').length) {
                    // 排序不计入url回退(已改成计入)
                    // $(this).parents('#sort').length ? false :
                    var history =  true;
                    self.updateDom(data, history);
                } else {
                    $(this).parents('.dropdown').addClass('changed');
                    self.updateDom(data, false);
                }
            }
        });

        // 重置
        resetBtn.bind('click', function(e) {
            e.preventDefault();
            var data = {};
            $('.search-list dd').each(function() {
                $(this).find('.choice').removeClass('active').eq(0).addClass('active');
                var itemData = $(this).find('.choice').eq(0).attr('data');

                if (itemData) {
                    var _id= $(this).parent('dd').attr('id');
                    data[_id] = itemData;
                    BudgetAPI.upadteData(data);
                }
            });
            data = {
                downPayment: -1,
                monthlyPayment: -1,
                repaymentPeriod: -1,
                carSerialLevel: -1,
                pageIndex: 1
            };
            self.updateDom(data, false);
            $('#more-filter').addClass('changed');
            $('#more-filter .trigger').removeClass('selected').find('.sup').hide();
        });

        // 查看
        viewBtn.bind('click', function(e) {
            e.preventDefault();
            searchBar.dropdownClose($('#more-filter'));
        });

        // 滚动加载更多
        $(document).bind('scroll', function(e) {
            var top = document.documentElement.scrollTop || document.body.scrollTop;
            if (top >= document.documentElement.scrollHeight - document.documentElement.clientHeight - 1) {
                if (!carList.hasClass('all') && !self.loading) {
                    self.loading = true;
                    $('#slideup-box').hide();
                    $('#car-loading').show();
                    BudgetAPI.data.pageIndex = BudgetAPI.data.pageIndex + 1;
                    BudgetAPI.getProducts(function(result) {
                        self.updateProduct.apply(self, [result]);
                    });
                }
            }
        });
        if (!$('#carlist').hasClass('all')) {
            $('#slideup-box').show();
        }

        // 返回
        $(window).on('popstate', function (e) {
            // alert(BudgetAPI.data.isFirst);
            if (!BudgetAPI.data.isFirst) {
                self.updateFilterByUrl();
                self.updateDom({}, false);
                if (searchBar.activedDropdown) {
                    searchBar.dropdownClose(searchBar.activedDropdown);
                }
            }
        });
        // 回退按钮，优先收起导航
        $('#header-bar a.back-btn').bind('click', function(e) {
            e.preventDefault();
            if (searchBar.activedDropdown) {
                searchBar.dropdownClose(searchBar.activedDropdown);
            } else {
                self.popHistory();
                self.updateFilterByUrl();
                self.updateDom();
            }
        });
    },

    // 更新dom
    updateDom: function(data, history) {

        var self = this;
        BudgetAPI.data.isFirst = false;
        // console.log(data)
        $('#carlist').empty();
        $('.default-box').hide();

        $('#slideup-box').hide();
        $('#car-loading').show();

        self.loading = true;
        BudgetAPI.upadteData(data).getProductsCount(function(result) {
            self.updateProductCount.apply(self, [result]);
        }).getProducts(function (result) {
            self.updateProduct.apply(self, [result]);
            if (history) {
                self.pushHistory();
            }
        });
    },
    // 更新数量
    updateProductCount: function(result) {
        // 更新总数
        $('#view-btn #count').text(result);
    },
    // 更新列表
    updateProduct: function(result) {
        var self = this;
        var carList = self.dom.carList;

        // 更新列表
        if (BudgetAPI.data.pageIndex === 1) {
            carList.empty();
            carList.removeClass('all');
            $('.default-box').hide();
        }
        carList.html(carList.html() + result.html);
        if (carList.children('.car').length >= result.total) {  // 到达底部（全部显示）
            carList.addClass('all');
            if (result.total > 0) {
                carList.append('<li class="no-more">没有更多了~</li>');
            } else if(BudgetAPI.data.pageIndex==1){
                $('.default-box').show();
            }
        } else {
            $('#slideup-box').show();
        }

        $('#car-loading').hide();
        self.loading = false;
    },

    // 更新url
    pushHistory: function() {
        //console.log('push history');
        var url = BudgetAPI.getUrl();
        this.arrHistroy.push(url);
        //alert(this.arrHistroy.length);
        history.replaceState({type: 'forward'}, '', url);
    },

    popHistory: function() {
        this.arrHistroy.pop();
        //alert(this.arrHistroy.length);
        if (this.arrHistroy.length > 0) {
            history.replaceState({type: 'backward'}, '', this.arrHistroy[this.arrHistroy.length - 1]);
        } else {
            history.go(-1)
        }
    },

    // 根据url 更新搜索条件
    updateFilterByUrl: function() {
        var self = this;
        var url = location.href;
        var key, value;
        // for (key in BudgetAPI.dataAttrShort) {
        //     var value = tools.getUrlParam(key);
        //     if (value) {
        //         BudgetAPI.data[BudgetAPI.dataAttrShort[key]] = value;
        //     } else {
        //         BudgetAPI.data[BudgetAPI.dataAttrShort[key]] = -1;
        //     }
        // }
        BudgetAPI.data.pageIndex = 1;
        // console.log(BudgetAPI.data);

        // TODO 更新搜索栏
        // if (!self.data.CarPrice) {
        //     self.getFilterData();
        // }
        // var carPrice = self.data.carPrice,
        //     downpayment = self.data.downpayment,
        //     monthlyPayment = self.data.monthlyPayment,
        //     repaymentPeriod = self.data.repaymentPeriod,
        //     serialLevel = self.data.serialLevel;
        //
        // // 车价
        // var carPriceChoice = filterCheck(carPrice, ['carPriceMin']);
        // if (carPriceChoice) {
        //     carPrice.elemTrigger.addClass('selected');
        //     carPrice.elemTriggerText.text(carPriceChoice.text());
        // } else {
        //     carPrice.elemTrigger.removeClass('selected');
        //     carPrice.elemTriggerText.text(carPrice.elemChoices.eq(0).text());
        // }
        //
        // // 更多筛选
        // var moreNum = 0;
        // moreNum += filterCheck(downpayment, ['downPaymentMin', 'downPaymentMax']) ? 1 : 0;
        // moreNum += filterCheck(monthlyPayment, ['monthlyPaymentMin']) ? 1 : 0;
        // moreNum += filterCheck(repaymentPeriod, ['repaymentPeriod']) ? 1 : 0;
        // moreNum += filterCheck(serialLevel, ['carSerialLevel', 'carSerialSecondLevel']) ? 1 : 0;
        // if (moreNum) {
        //     downpayment.elemTrigger.addClass('selected');
        //     downpayment.elemTriggerNum.text(moreNum).show();
        // } else {
        //     downpayment.elemTrigger.removeClass('selected');
        //     downpayment.elemTriggerNum.text(moreNum).hide();
        // }
        //
        // // 返回选中项，默认值被选中返回false
        // function filterCheck(obj, attrs) {
        //     var arrData = obj.arrData;
        //     var elemChoices = obj.elemChoices;
        //     var equal;
        //
        //     if (parseInt(BudgetAPI.data[attrs[0]]) !== -1) {
        //         for (var i = 0; i < arrData.length; i++) {
        //             equal = true;
        //             for (var j = 0; j < attrs.length; j++) {
        //                 if (parseInt(arrData[i][attrs[j]]) !== parseInt(BudgetAPI.data[attrs[j]])) {
        //                     equal = false;
        //                     break;
        //                 }
        //             }
        //             if (equal) {
        //                 break;
        //             }
        //         }
        //         elemChoices.removeClass('active').eq(i).addClass('active');
        //         return elemChoices.eq(i);
        //     } else {
        //         elemChoices.removeClass('active').eq(0).addClass('active');
        //         return false;
        //     }
        // }
        //
        // // 车型
        // if (!self.data.carBrands) {
        //     self.data.carBrands = {'-1': '全部品牌'};
        //     $.ajaxJSONP({
        //         url: APIURL + 'api/Common/GetCarMasterBrandListWithFirstLetter?callback=?',
        //         data: {onlyOnSale: true},
        //         success: function (data) {
        //             if (data.Result) {self.data.carBrands
        //                 for (var i = 0; i < data.Data.length; i++) {
        //                     for (var j = 0; j < data.Data[i].CategoryCollection.length; j++) {
        //                         self.data.carBrands[data.Data[i].CategoryCollection[j]['Id']] = data.Data[i].CategoryCollection[j]['Name'];
        //                     }
        //                 }
        //                 updateBrand();
        //             }
        //         }
        //     });
        // } else {
        //     updateBrand();
        // }
        //
        // function updateBrand() {
        //     if (parseInt(BudgetAPI.data.carMasterBrandId) !== -1) {
        //         $('#car-select .trigger').addClass('selected').find('span').text(self.data.carBrands[BudgetAPI.data.carMasterBrandId]);
        //     } else {
        //         $('#car-select .trigger').removeClass('selected').find('span').text(self.data.carBrands[BudgetAPI.data.carMasterBrandId]);
        //     }
        // }
    },

    getFilterData: function() {
        // arrData, elemChoices, elemTrigger, elemTriggerText, elemTriggerNum
        var self = this;

        self.data.carPrice = getData('carPrice');
        self.data.downpayment = getData('downPayment');
        self.data.monthlyPayment = getData('monthlyPayment');
        self.data.repaymentPeriod = getData('repaymentPeriod');
        self.data.serialLevel = getData('carSerialLevel');

        function getData(id) {
            return $("#" + id + " span.active").attr("data");
        }
    }
};

$(function() {

    /*头部判断*/
    // console.log(hideType.header)
    if(hideType.nav){
        $('body').addClass('no-header');
    }

    if (typeof city !== undefined && (city.cityId || city.CityId)) {
        BudgetAPI.upadteData({cityId: city.cityId || city.CityId});
    }

    searchBar.init({
        afterChoose: function(choice) {
            var dropdown = choice.parents('.dropdown');
            if (dropdown.attr('id') === 'more-filter') {
                var chosen = dropdown.find('.choice.active');
                var num = chosen.length - chosen.filter('[data-type=default]').length;
                if (num) {
                    dropdown.find('.trigger').addClass('selected').find('.sup').show().text(num);
                } else {
                    dropdown.find('.trigger').removeClass('selected').find('.sup').hide().text(num);
                }
            }
        },
        afterClose: function(elem) {
            if (elem.attr('id') === 'more-filter' && elem.hasClass('changed')) {
                BudgetControl.pushHistory();
                elem.removeClass('changed');
            }
        }
    });
    // 更多选择。。
    var moreFilter = $('#more-filter .down-wrapper');
    moreFilter.css({
        display: 'block',
        opacity: 0
    });
    if (moreFilter[0].offsetHeight < moreFilter.find('.down-content')[0].scrollHeight) {
        $('#more-filter').addClass('fixed');
        moreFilter.append(moreFilter.find('.bottom-btn'));
    }
    moreFilter.css({
        display: 'block',
        opacity: 1
    });

    // 选项改变
    BudgetControl.init();
});

var vm = new Vue({
    el: 'body',
    data: {
    },
    methods:{
        selectCarCallback(data){
            const brandId = data.brand.id
            const brandName = data.brand.name
            const carSelect = $('#car-select')
            if(brandId === 0){
                carSelect.find('.trigger').removeClass('selected').find('span').text('全部品牌')
            }else{
                carSelect.find('.trigger').addClass('selected').find('span').text(brandName)
            }
            BudgetControl.updateDom({
                carMasterBrandId: brandId || -1,
                pageIndex: 1
            }, true);
            carSelect.removeClass('active')
            $('#maskLayer').fadeOut(function() {
                $('#maskLayer').css('z-index', 200).hide();
            })
            searchBar.activedDropdown = null
        }
    },
    components: {
        CarSelector
    },
});