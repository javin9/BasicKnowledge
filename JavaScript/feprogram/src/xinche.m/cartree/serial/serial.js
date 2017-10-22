import './serial.scss'

import 'zepto/src/touch';

var page = {
    data: {
        id: window.car.serialId,
        downpayment: window.downpayment,
        periods: window.periods
    },
    dom: {
        cars: $('.car-wrapper li')
    },
    interface: {
        getSimpleCalcUrl: window.GetSimpleCalcUrl
    },
    init: function() {
        $('.main-content').css('min-height', document.documentElement.clientHeight - $('.header-bar').height() - $('.breadcrumb').height() - $('.escdk13').height());
        this.initYears();
        this.initFilter();
    },
    initYears: function() {
        var tabsAll = $('.years a');
        var tabs = $('.years a:not(.all)');
        var tabcons = $('.car-wrapper ul');

        tabs.on('tap', function(e) {
            e.preventDefault();
            var i = tabs.index(this);
            tabcons.css('display', 'none').eq(i).css('display', 'block');
            tabsAll.removeClass('active');
            $(this).addClass('active');
        });

        $('.years a.all').on('tap', function(e) {
            e.preventDefault();
            tabcons.css('display', 'block');
            tabs.removeClass('active');
            $(this).addClass('active');
        });
    },
    initFilter: function () {
        var filterTabs = $('#filter-wrapper .filter-tab a'),
            filterTabcons = $('#filter-wrapper .filter-tabcons ul'),
            self = this;

        // 展开
        $('#filter-tab-page a').each(function(index) {
            $(this).on('tap', function(e) {
                e.preventDefault();
                showFilter(index);
                $('#filter-wrapper').fadeIn(150, function() {
                    scroll(0, 100);
                });
                $('body').bind('touchmove', function(e) {
                    e.preventDefault();
                });
            });
        });
        // 切换
        filterTabs.each(function(index) {
            $(this).on('tap', function(e) {
                e.preventDefault();
                if ($(this).hasClass('active')) {
                    hideFilter();
                } else {
                    showFilter(index);
                }
            });
        });
        // 关闭
        $('#filter-wrapper').bind('tap', function(e) {
            var id = $(e.target).attr('id');
            if ('filter-wrapper' === id || 'filter-wrapper-close' === id) {
                hideFilter();
            }
        });
        // 改变筛选条件
        $('#filter-wrapper .filter-tabcons a').on('tap', function(e) {
            e.preventDefault();
            var data = $(this).attr('data').split(':'),
                key = data[0],
                value = data[1];
            self.data[key] = value;
            self.getSimpleCalc();
            self.setFilterText(key, $(this).text());
            $(this).parents('ul').find('a').removeClass('active');
            $(this).addClass('active');
            hideFilter();
        });

        // 展开菜单
        function showFilter(index) {
            filterTabs.removeClass('active').eq(index).addClass('active');
            filterTabcons.hide().eq(index).show();
        }
        // 收起菜单
        function hideFilter() {
            $('#filter-wrapper').fadeOut(150);
            $('body').unbind('touchmove');
        }
        // 滚动动画
        function scroll(scrollTo, time) {
            var scrollFrom = parseInt(document.documentElement.scrollTop || document.body.scrollTop),
                i = 0,
                runEvery = 5; // run every 5ms
            scrollTo = parseInt(scrollTo);
            time /= runEvery;
            var interval = setInterval(function () {
                i++;
                document.documentElement.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;
                document.body.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;
                if (i >= time) {
                    clearInterval(interval);
                }
            }, runEvery);
        }
    },
    getSimpleCalc: function() {
        var self = this;
        $.ajax({
            url: self.interface.getSimpleCalcUrl,
            method: 'GET',
            data: self.data,
            dataType: 'json',
            success: function(res) {
                //console.log(res);
                if (res.Result) {
                    var resData = res.Data,
                        carElem,
                        carid,
                        i;
                    self.dom.cars.each(function() {
                        carElem = $(this);
                        carid = carElem.attr('data-id').trim();
                        for (i = 0; i < resData.length; i++) {
                            if (carid === resData[i].Id.toString()) {
                                carElem.find('.downpayment').text(resData[i].DownPaymentText);
                                carElem.find('.monthly-payment').text(resData[i].MonthlyPaymentText);
                                carElem.find('.periods').text(self.data.periods);
                            }
                        }
                    });
                }
            }
        });
    },
    setFilterText: function(key, value) {
        $('em[key='+ key + ']').text(value);
    }
};

$(function () {
    page.init();
});
