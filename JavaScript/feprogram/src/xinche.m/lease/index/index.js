import './index.scss';
import 'zepto/src/touch';
import 'libs/swiper';

import Vue from 'vue';
import Share from 'libs/share/index'
import Navbar from 'libs/vue-components/navbar'

var isApp = Boolean(tools.isWebView() === 'yixinapp');
if(isApp){
    if(tools.getUrlParam("source") == "1035" || tools.getUrlParam("source") == "1036"){
        tools.jsNativeBridge("isTabBar");
    }else{
        tools.jsNativeBridge("showShare",{
            pageId:100
        });
    }

}

var vm = new Vue({
    el: 'body',
    ready() {
        this.domInit();
    },
    components: {
        Share,
        Navbar
    },
    data() {
        var _imgUrl = $('#wx_pic img').attr('src');
        return {
            //分享数据
            shareOptions: {
                title: '1成首付开走吧，年年新车任性换！',
                url: window.location.href,
                desc: '低资金门槛 + 低还款压力 + 灵活分期（分享来自@易鑫车贷平台）',
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
        }
    }
});


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
        var couponElem = $('<div class="coupon"></div>'),
            self = this;

        if (tools.getCookie('CouponCardId')) {
            couponElem.addClass('received');
        }
        couponElem.click(function() {
            if ($(this).hasClass('received')) {
                tools.showAlert(self.message.received);
            } else {
                $(this).addClass('received');
                tools.showAlert(self.message.success);
                tools.setCookie('CouponCardId', self.CouponCardId);
            }
        });
        $('section.intro').after(couponElem);
    }
};

let ABtest = {
    init() {
        let utrace = tools.getCookie('_utrace');
        if (!utrace) {
            utrace = this.setUuid();
        }

        if (parseInt(utrace.substring(0,1),16) % 2) {
            $('body').addClass('ki-b');
        } else {
            $('body').addClass('ki-a');
        }
    },
    setUuid() {
        let uuid;

        // 先从localStorage取值
        if (window.localStorage) {
            uuid = window.localStorage.getItem('_utrace');
        }

        // 自己生成
        if (!uuid) {
            uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                let r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8)
                return v.toString(16)
            });

            // 若uuid空的情况下（具体浏览器未知）, 保证拿到一个不重复的值
            if(!uuid){
                uuid = +new Date()+'-'+Math.round(Math.random()*100000)
            }

            if (window.localStorage) {
                window.localStorage.setItem('_utrace', uuid);
            }
        }

        tools.setCookie('_utrace', uuid, 'd30');
        return uuid;
    }
};


$(function() {
    var slides = $('.banner .swiper-slide');
    if (slides.length > 1) {
        var mySwiper = new Swiper ('.banner .swiper-container', {
            // 如果需要分页器
            pagination: '.swiper-pagination',
            speed: 300,
            autoplay: 3300,
            autoplayDisableOnInteraction: false
        })
    }

    // 卡券
    if (!tools.isWebView()) {
        Coupon.init();
    }

    // ABtest
    ABtest.init();
});

