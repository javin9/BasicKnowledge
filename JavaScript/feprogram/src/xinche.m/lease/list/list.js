require('./list.scss');
var car = require('libs/carSelect');
var IScroll = require('iscroll')
import Vue from 'vue';
import hideType from 'libs/hideType';

// todo
// 1. more-filter

//app下载链接
tools.appDown(true);

//隐藏所有超链接
// $(".choice").attr("href","javascript:void(0);");

// 按预算选车api
var BudgetAPI = {
    data: {
        cityId: -1,
        pageIndex: 1,
        pageSize: typeof window.pagesize !== 'undefined' && !isNaN(window.pagesize) ? window.pagesize : 10
    },
    arrCondition: [],   // 检索条件
    getProductUrl: getLeaseInfoUrl,
    // getProductCountUrl: getBudgetInfoCountUrl,

    upadteData: function(data) {
        this.data = $.extend(this.data, data);
        return this;
    },

    getProducts: function(callback) {
        var self = this,
            condition = self.dataToCondition();

        $.ajax({
            type: 'GET',
            url: self.getProductUrl,
            data: {
                condition:condition,
                cityId:self.data.cityId,
                pageIndex: self.data.pageIndex,
                pageSize: self.data.pageSize,
                source: 'undefined' !== typeof Source ? Source : '',
                channel: 'undefined' !== typeof Channel ? Channel : ''
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

    /* getProductsCount: function(callback) {
        var self = this,
            condition = self.dataToCondition();

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
    }, */

    getUrl: function() {
        var url = leaseListUrl;
        var _data = this.data,
            params = [],
            condition = this.dataToCondition();

        if ('undefined' !== typeof Source && Source) {
            params.push('source=' + Source);
        }
        if ('undefined' !== typeof Channel && Channel) {
            params.push('channel=' + Channel);
        }

        if(condition) {
            url += condition + '/';
        } else {
            url += 'list/';
        }
        if (params.length) {
            url += '?' + params.join('&');
        }

        return url;
    },

    dataToCondition: function() {
        var self = this,
            arrCondition = [];
        
        $('#search-bar .choice.active').each(function() {
            if (parseInt($(this).attr('data')) !== -1) {
                arrCondition.push($(this).attr('data'));
            }
        });
        self.arrCondition = arrCondition;
        
        return arrCondition.join('');
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

        self.afterChoose = ('undefined' !== typeof options) ? options.afterChoose : null;
        self.afterClose = ('undefined' !== typeof options) ? options.afterClose : null;

        $('.search-bar').on('click', '.dropdown .trigger', function() {
            var dropdown = $(this).parent();

            if (dropdown.hasClass('active')) {
                self.dropdownClose(dropdown);
            } else {
                if (!self.activedDropdown) {
                    self.dropdownOpen(dropdown);
                    self.activedDropdown = dropdown;
                } else {
                    self.dropdownClose(self.activedDropdown, 'fast');
                    self.dropdownOpen(dropdown, 'fast');
                    self.activedDropdown = dropdown;
                }
            }
        });

        $('#maskLayer').on('click', function() {
            if (self.activedDropdown) {
                self.dropdownClose(self.activedDropdown);
            }
        });

        $('.search-bar').on('click', '.dropdown .down-content .choice', function(e) {
            e.preventDefault();
            var choice = $(this),
                dropdown = choice.parents('.dropdown'),
                trigger = dropdown.find('.trigger');

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

            choice.addClass('active').siblings().removeClass('active');
            self.dropdownClose(dropdown);
        });

        var downWrappers = $('.dropdown .down-wrapper');
        downWrappers.each(function(index) {
            $(this).attr('id', 'down-wrapper-' + index);
        });

        // 隐藏下载app
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
        if ($('#appDown').length && !$('#appDown').hasClass('hide')) {
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
        if (!$('#header-bar').length || top >= $('#header-bar').offset().height) {
            $('#yxWrapper').addClass('search-bar-fixed');
        } else {
            $('#yxWrapper').removeClass('search-bar-fixed');
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
                $('#maskLayer').fadeIn(duration || 300);
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
                $('#maskLayer').fadeOut(duration || 150);
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
    history: true,
    loading: false,
    data: {},   // 缓存数据
    dom: {},   // 缓存dom
    arrHistory: [],
    conditionHistory: [],
    init: function() {
        var self = this;
        // var resetBtn = $('#reset-btn');
        // var viewBtn = $('#view-btn');
        // var carSelect = $('#car-select');
        var carList = $('.budget-carlist .carlist');

        self.dom.carList = carList;

        //初始化数据
        // 初始化内容（没有更多 或者 没有产品
        var cars = carList.children('.car');
        var total = parseInt(cars.eq(0).attr('data-Total')) || 0;

        if (cars.length >= total) {
            carList.addClass('all');
            if (total > 0) {
                carList.append('<li class="no-more">没有更多了~</li>');
            } else if(BudgetAPI.data.pageIndex === 1){
                $('.default-box').show();
                $('body').addClass('bg-white');
            }
        }

        self.arrHistory.push(BudgetAPI.getUrl());
        self.conditionHistory.push(BudgetAPI.arrCondition);

        // 选项
        $('.search-list, .choice-list').on('click', '.choice', function(e) {
            e.preventDefault();
            $(this).addClass('active').siblings().removeClass('active');
            var data = {},
                itemData = $(this).attr('data');
            
            if (itemData) {
                data.pageIndex = 1;
                self.updateDom(data, true);
            }
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
        /* $(window).on('popstate', function (e) {
            console.log('popstate');
            if (searchBar.activedDropdown) {
                searchBar.dropdownClose(searchBar.activedDropdown);
            } else {
                self.popHistory();
            }
        }); */
        // 回退按钮，优先收起导航
        $('#header-bar a.back-btn').bind('click', function(e) {
            // console.log('back-btn');
            e.preventDefault();
            if (searchBar.activedDropdown) {
                searchBar.dropdownClose(searchBar.activedDropdown);
            } else {
                self.popHistory();
            }
        });
    },

    // 更新dom
    updateDom: function(data, history) {
        var self = this;
        $('#carlist').empty();
        $('.default-box').hide();
        $('body').removeClass('bg-white');

        $('#slideup-box').hide();
        $('#car-loading').show();

        $(window).scrollTop(0);
        self.loading = true;
        BudgetAPI.upadteData(data);
        BudgetAPI.getProducts(function (result) {
            self.updateProduct.apply(self, [result]);
            if (history) {
                self.pushHistory();
            }
        });
    },

    // 更新数量
    updateProductCount: function(result) {
        // 更新总数
        // $('#view-btn #count').text(result);
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
            $('body').removeClass('bg-white');
        }
        carList.html(carList.html() + result.html);
        if (carList.children('.car').length >= result.total) {  // 到达底部（全部显示）
            carList.addClass('all');
            if (result.total > 0) {
                carList.append('<li class="no-more">没有更多了~</li>');
            } else if(BudgetAPI.data.pageIndex==1){
                $('.default-box').show();
                $('body').addClass('bg-white');
            }
        } else {
            $('#slideup-box').show();
        }

        $('#car-loading').hide();
        self.loading = false;
    },

    // 更新url
    pushHistory: function() {
        var url = BudgetAPI.getUrl();
        this.arrHistory.push(url);
        //console.log(this.arrHistory)
        this.conditionHistory.push(BudgetAPI.arrCondition);
        history.replaceState({type: 'forward'}, '', url);
    },

    popHistory: function() {
        this.arrHistory.pop();
        //console.log('back')
        //console.log(this.arrHistory)
        if (this.arrHistory.length > 0) {
            history.replaceState({type: 'backward'}, '', this.arrHistory[this.arrHistory.length - 1]);
            this.updateFilter();
        } else {
            history.go(-1)
        }
    },

    // 根据历史，更新搜索条件
    updateFilter: function() {
        var self = this;
        var data = {};
        var condition;

        self.conditionHistory.pop();
        condition = self.conditionHistory[self.conditionHistory.length - 1];
        
        $('.search-bar .dropdown').each(function() {
            let trigger = $(this).find('.trigger');
            let choices = $(this).find('.choice');
            choices.removeClass('active').eq(0).addClass('active');
            trigger.removeClass('selected').find('span').text(choices.eq(0).attr('select-show') || choices.eq(0).text());

            choices.each(function() {
                let data = $(this).attr('data');
                if (condition.indexOf(data) > -1) {
                    choices.removeClass('active');
                    $(this).addClass('active');
                    trigger.addClass('selected').find('span').text($(this).attr('select-show') || $(this).text());
                }
            });
        });

        data.pageIndex = 1;
        self.updateDom(data);
    }
};

$(function() {

    /*头部判断*/
    if (hideType.header) {
        $('body').addClass('no-header');
    }

    if (typeof city !== undefined && (city.cityId || city.CityId)) {
        BudgetAPI.upadteData({cityId: city.cityId || city.CityId});
    }
    // todo continue
    searchBar.init();

    // 选项改变
    BudgetControl.init();
});
