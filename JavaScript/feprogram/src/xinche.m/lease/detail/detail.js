import './detail.scss';
import 'libs/swiper';
import 'zepto/src/touch';
import citySelect from 'libs/citySelect';

import Vue from 'vue';
import Share from 'libs/share/index';

// 用于处理页面回退回来，对于产品支持的城市，去掉按钮的disabled类
window.onpageshow = function(event) {
    if (canApply === 'True') {
        $('.apply-wrapper .order-btn').removeClass('disabled');
    }
};

$(window).on('touchmove', '#citySelectComponent', function() {
    $('#citySelectComponent').height(document.documentElement.clientHeight);
});

var isApp = Boolean(tools.isWebView() === 'yixinapp');
if(isApp){
    tools.jsNativeBridge("showShare",{
        downPayments:$('.scheme>span:first-child>em').text(),
        carSerialShowName:car.carSerialShowName,
        packageName:$('.product-info>h3:first-child').text(),
        imgSrc:$('.car-photos img').attr('src').indexOf('http')<0?('http:'+$('.car-photos img').attr('src')):$('.car-photos img').attr('src'),
        url:window.location.href,
        pageId:101
    });
}

var vm = new Vue({
    el: '#shareBox',
    ready() {
        this.domInit();
        this.loadCityTips();
    },
    components: {
        Share
    },
    data() {
        var _downPayments = $('.scheme>span:first-child>em').text(),
            _imgUrl = $('#wx_pic img').attr('src');
        return {
            //分享数据
            shareOptions: {
                title: '首付'+_downPayments+'，'+ car.carSerialShowName +'开回家，快来看下吧~',
                url: window.location.href,
                desc: '首付仅需1成，年年开新车哦！（分享来自@易鑫车贷平台）',
                image:_imgUrl
            }
        }
    },
    methods: {
        //dom渲染
        domInit() {
            var self = this;

            // 导航menu
            var $navMenu = $('#navTips');
            $('#tools-nav').on('click',function (e) {
                $navMenu.toggleClass('hide');
            });

            $navMenu.on('click', function(e) {
                $navMenu.addClass('hide');
            });
            $navMenu.on('touchmove', function(e) {
                $navMenu.bind('touchend', function() {
                    $navMenu.addClass('hide');
                    $navMenu.unbind('touchend');
                });
            });

            $navMenu.find('a').on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if ($(e.target).attr('id') !== 'shareNavTip') {
                    location.href = $(this).attr('href');
                } else {
                    $navMenu.addClass('hide');
                    self.$nextTick(() => self.$broadcast('showShare', 'share'));
                }
            });

            // 导航切换城市
            var $navCity = $('#navCity');
            $navCity.on('touchend', function(e) {
                e.preventDefault();
                city.loadCityUrl = APIURL + "api/Common/GetSupportGroupingCityList/?packageId=" + product.packageID + "&carId=" + car.carId;
                city.NoHotCity = true;
                citySelect.citySelect(city, function (result) {
                    setTimeout(function () {
                        var loc = window.location.href,
                            reg = new RegExp(city.CitySpell, 'gi');
                        window.location.href = loc.replace(reg, result.CitySpell.toLowerCase());
                    }, 100);
                });
            });
        },
        loadCityTips: function () {
            let cityTipsCookie = tools.getCookie("leaseCityTips");
            console.log(cityTipsCookie);
            if (cityTipsCookie && cityTipsCookie == 1) {
                $('.tips_text').addClass('hide');
                //已经提示过
            } else {
                $('.tips_text').removeClass('hide');
                setTimeout(() => {
                    $('.tips_text').addClass('hide');
                }, 3000)
                if (document.domain.search(".daikuan.com") != -1)
                    tools.setCookie("leaseCityTips", 1, "", ".daikuan.com");
                else
                    tools.setCookie("leaseCityTips", 1, "", document.domain);
            }
        }
    }
});


var detailPage = {
    adviserId: '',
    commentPageIndex: 1,
    commentPageSize: 10,
    commentCount: 0,
    commentMax: window.totalComments,

    init: function() {
        var self = this;

        // 车图轮播
        if ($('.car-photos .swiper-slide').length > 1) {
            var photoSwiper = new Swiper('.car-photos .swiper-container', {
                loop: true,
                // 如果需要分页器
                pagination: '.swiper-pagination'
            });
        }

        // 产品详情锚点
        var productDetail = $('#product-detail');
        var productMarks = productDetail.find('.bookmark .mark');
        var productCons = productDetail.find('.conwrap .con');
        productMarks.each(function(index) {
            $(this).bind('click', function(e) {
                e.preventDefault();
                self.scrollTo(Math.ceil(productCons.eq(index).offset().top - productMarks.eq(0).offset().height) + 2, 250);
            });
        });

        $(window).bind('scroll', function() {
            var top = document.documentElement.scrollTop || document.body.scrollTop;
            if (top >= productDetail.offset().top) {
                productDetail.addClass('fix-nav');
            } else {
                productDetail.removeClass('fix-nav');
            }

            for (var i = productCons.length - 1; i > 0;  i--) {
                if (/* 页面底部 */ top >= Math.floor(document.documentElement.scrollHeight - document.documentElement.clientHeight) - 1 || top >= Math.floor(productCons.eq(i).offset().top - productMarks.eq(0).offset().height)) {
                    break;
                }
            }
            if (!productMarks.eq(i).hasClass('active')) {
                productMarks.removeClass('active').eq(i).addClass('active');
            }
        });

        // 产品详情图片懒加载
        window.Echo.init({
            offset: 0,
            throttle: 0
        });

        // 获取顾问
        $.ajax({
            type: 'get',
            url: adviserApi + 'v2/group/getadviserlist',
            data: {
                CityId: city.cityId,
                CompanyIds: companyID,
                BusinessLineId: window.BusinessLine // 租赁业务线id
            },
            dataType: 'jsonp',
            success: function(respond) {
                if (respond.Result && respond.Data.length) {
                    var data = respond.Data[0],
                        telnum = 'tel:' + data.Adviser.CN400;
                    self.adviserId = data.Adviser.Id;
                    $('.apply-wrapper .adviser-btn')
                        .show()
                        .bind('click', function() {
                            self.callAdivser(telnum);
                        });
                } else {
                    // $('.apply-wrapper .adviser-btn').hide();
                }
            }
        });

        // 获取评价
        self.getUserComments();
        $('#more-comment').click(function() {
            self.getUserComments();
        });

        // 提交订单
        $('.apply-wrapper .order-btn').bind('click', function() {
            if ($(this).hasClass('disabled')) {
                return false;
            }
            $(this).addClass('disabled');
            self.applyNow($(this).attr('order-action'));
        });
    },
    // 页面滚动
    scrollTo: function(scrollTo, time) {
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
    },
    // 呼叫顾问
    callAdivser: function(telnum) {
         location.href = telnum;
    },
    //立即申请
    applyNow: function (action) {
        var self = this,
            orderForm = $('#orderInfoForm'),
            orderAction = (action || orderForm.attr('action')).replace(/\/?$/, '/');

        orderForm.attr('action', orderAction)
        orderForm.find('input[name="Orders"]').val(product.packageID + "_" + product.productID + "_0");
        orderForm.find('input[name="CarId"]').val(car.carId);
        orderForm.find('input[name="CityId"]').val(city.cityId);
        orderForm.find('input[name="CarPrice"]').val(car.carPrice);
        orderForm.find('input[name="AdviserId"]').val(self.adviserId || '');
        orderForm.find('input[name="Source"]').val(typeof source !== 'undefined' && source ? source : '');
        orderForm.find('input[name="Channel"]').val(typeof channel !== 'undefined' && channel ? channel : '');
        orderForm.find('input[name="Shop"]').val(typeof shop !== 'undefined' && shop ? shop : '');
        orderForm.find('input[name="From"]').val(tools.getCookie('from') || '');

        //经销商
        if (typeof dealer !== 'undefined' && dealer.dealerId) {
            orderForm.find('input[name="DealerId"]').val(dealer.dealerId);
            orderForm.find('input[name="DealerName"]').val(dealer.dealerName);
            if (dealer.dealerTel) {
                orderForm.find('input[name="DealerTelphone"]').val(dealer.dealerTel);
            }
        }

        // 卡券
        if (tools.getCookie('CouponCardId')) {
            orderForm.find('input[name="CouponCardId"]').val(tools.getCookie('CouponCardId'));
            orderForm.find('input[name="TypeOfTakingCouponCard"]').val(2);
        } else {
            orderForm.find('input[name="CouponCardId"]').val(0);
            orderForm.find('input[name="TypeOfTakingCouponCard"]').val(0);
        }

        orderForm.submit();

    },
    //评价列表
    getUserComments: function(){
        var self = this;
        $.ajax({
            url: GetRecentOrders,
            type: 'GET',
            data: {
                // carId: car.carId,
                // productId: product.productID,
                pageIndex: self.commentPageIndex,
                pageSize: self.commentPageSize
            },
            dataType:"json",
            success: function (res) {
                var htmlstr = '',
                    time;
                for (var i = 0; i < res.Data.length; i++) {
                    time = /\d+/.exec(res.Data[i].CreateTime);
                    htmlstr += `<dt>${res.Data[i].CarFullName}</dt>
                                <dd>
                                    <span class="tel">${self.formatMobile(res.Data[i].Telphone)}</span>
                                    <span class="loc">${res.Data[i].CityName}</span>
                                    <span class="date">${time ? self.formatTime(parseInt(time[0])) : ''}</span>
                                </dd>`;
                }
                $("#comment-list").append(htmlstr);
                self.commentPageIndex++;
                self.commentCount += res.Data.length;
                if (self.commentCount >= self.commentMax) {
                    $('#more-comment').hide();
                }
            }
        });
    },

    formatTime: function(shijianchuo){
        var self = this;
        //time是整数，否则要parseInt转换
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        return y+'-'+self.add0(m)+'-'+self.add0(d);
    },

    add0: function(m){
        return m<10?'0'+m:m
    },

    formatMobile: function(mobile) {
        return mobile.slice(0, 3) + '****' + mobile.slice(7, mobile.length);
    }
};

// 卡券
var Coupon = {
    CouponCardId: 0,
    CardFullName: '',
    message: {
        success: '领取成功！',
        received: '您已经领取过了！'
    },
    init: function() {
        var self = this;
        $.ajax({
            url: window.GetCouponInfoUrl,
            method: 'get',
            dataType: 'json',
            success: function (res) {
                if (res.Result) {
                    self.CouponCardId = res.Data.CouponCardId;
                    self.CardFullName = res.Data.CardFullName;
                    self.message = {
                        success: `${res.Data.CardFullName}领取成功，首次下单后发放至您的个人账户`,
                        received: `您已经领取过该券，首次下单后发放至您的个人账户`
                    };
                    self.show();
                }
            }
        });
    },
    show: function() {
        var couponElem = $(`<div class="coupon">
                                <span class="tag">立减500元</span>
                                <span class="coupon-name">购车送${this.CardFullName}</span>
                                <span class="btn">领取</span>
                            </div>`),
            self = this;

        if (tools.getCookie('CouponCardId')) {
            couponElem.addClass('received');
            couponElem.find('.btn').text('已领取');
        }
        couponElem.find('.btn').click(function() {
            if (couponElem.hasClass('received')) {
                tools.showAlert(self.message.received);
            } else {
                couponElem.addClass('received');
                couponElem.find('.btn').text('已领取');
                tools.showAlert(self.message.success);
                tools.setCookie('CouponCardId', self.CouponCardId);
            }
        });
        $('div.car-info').after(couponElem);
    }
};

$(function() {
    detailPage.init();

    // 卡券
    if (!tools.isWebView()) {
        Coupon.init();
    }
});