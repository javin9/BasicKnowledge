var Bargain = (function(window, $, Validator) {
    /*验证插件*/
    var _v = new Validator();
    //函数字节流
    var _debounce = function(func, wait, immediate) {
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

        return function() {
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

    //构造函数
    var Bargain = function(opts) {
        this.settings = {
            wrapper: null,
            maskSelector: "#shadow_detail",
            carPrice: 0,
            islogin: false,
            mobile: undefined,
            submitCallback: null,
            smsOpts: {
                smswrapperid: undefined,
                title: undefined,
                autoPlay: false,
                num: 60
            }
        };
        this.settings = $.extend({}, this.settings, opts);
        this.options = {};
    };
    //原型
    Bargain.prototype = {
        init: function() {
            this.initOptions();
            this.bindEvent();
            this.bindData();
            this.showBargain();
        },
        showBargain: function() {
            //显示遮罩
            this.options.mask.show();
            //显示浮层
            this.options.wrapper.show();
        },
        initOptions: function() {
            var settings = this.settings,
                wrapper = settings.wrapper;

            this.options = {
                islogin: settings.islogin,
                carPrice: settings.carPrice,
                mobile: settings.mobile,
                isValid: true,
                mask: $(settings.maskSelector),
                wrapper: wrapper,
                price: wrapper.find('.bargain-price'),
                phone: wrapper.find('.bargain-phone'),
                submit: wrapper.find('.bargain-submit'),
                close: wrapper.find('.bargin-close'),
                alertWrapper: wrapper.find('.bargain-alert-wrapper'),
                alertTxt: wrapper.find(".alert-txt")
            };
        },
        bindData: function() {
            var options = this.options,
                carPrice = options.carPrice || 0;
            options.wrapper.find('.show-price').text(carPrice + "万");
            if (!!options.mobile) {
                options.phone.val(options.mobile);
            }
        },
        bindEvent: function() {
            var that = this;
            var options = that.options,
                price = options.price, //心理价格
                phone = options.phone, //手机号
                submit = options.submit; //砍价
            //价格
            price.keyup(_debounce(function(e) {
                if (!e.currentTarget.validity.valid) {
                    options.isValid = false;
                    that.alertShow("最多输入3位整数，2位小数");
                    return false;
                }
                var money = $.trim(price.val());
                that.checkPrice(money);
            }, 800));

            //提交
            submit.click(function() {
                var money = $.trim(price.val());
                that.checkPrice(money);
                if (!options.isValid) { return false; }

                var mobile = $.trim(phone.val());
                that.checkPhone(mobile);
                if (!options.isValid) { return false; }

                //TODO

                if (options.islogin && mobile === that.settings.mobile) {
                    //登录的逻辑
                    var parameters = {
                        money: money,
                        mobile: mobile,
                        hide: function() {
                            that.hideBargain();
                        }
                    };

                    console.log('已经登录的逻辑');
                    var submitCallback = that.settings.submitCallback;
                    typeof submitCallback === 'function' && submitCallback.call(that, parameters);
                } else {
                    //sms逻辑
                    that.triggerSmsInit(options);
                }
            });
            /*SMS*/

            //关闭
            options.close.click(function() {
                that.hideBargain();
            });
            //禁止滚动
            if (!!options.mask.length) {
                var timer = null;
                options.mask.on({
                    "touchstart": function() {
                        console.log('mask touchstart');
                        timer = setTimeout(function() {
                            that.hideBargain();
                        }, 300);
                    },
                    "touchmove": function(ev) {
                        console.log('mask touchmove');
                        ev.preventDefault();
                        window.clearTimeout(timer);
                    }
                })
            }
            options.wrapper.on("touchmove", function(ev) {
                ev.preventDefault();
            });
        },
        triggerSmsInit: function(options) {
            var mobile = $.trim(options.phone.val());
            if (options.islogin && mobile === this.settings.mobile) { return false; }
            var that = this,
                settings = that.settings,
                smsOpts = that.settings.smsOpts;
            if (!smsOpts.smswrapperid) { throw new Error('smsOpts.smswrapperid is undefined'); }

            smsOpts["maskSelector"] = settings.maskSelector;
            smsOpts["mobile"] = mobile;
            smsOpts["submitCallback"] = that.settings.submitCallback;
            smsOpts["money"] = $.trim(options.price.val());

            that.hideBargain();
            $(smsOpts.smswrapperid).Sms(smsOpts);
        },
        hideBargain: function() {
            var options = this.options;
            if (!!options.mask) {
                options.mask.hide();
            }
            options.wrapper.hide();
            options.price.val('');
            options.phone.val('');
        },
        alertShow: function(title) {
            var options = this.options;
            options.alertWrapper.show();
            options.alertTxt.text(title);
            this.lowPriceHide();
        },
        alertHide: function() {
            this.options.alertWrapper.hide();
        },
        lowPriceShow: function() {
            this.alertHide();
            this.options.wrapper.find('#bargin-pricelow').show();
        },
        lowPriceHide: function() {
            this.options.wrapper.find('#bargin-pricelow').hide();
        },
        checkPrice: function(money) {
            var that = this,
                options = that.options;
            if (!money) {
                options.isValid = false;
                that.alertShow("最多输入3位整数，2位小数");
                return false;
            }
            if (!!money) {
                money = parseFloat(money) || null;
                if (Object.prototype.toString.call(money) === "[object Number]") { //不是数字
                    money = parseFloat(money.toFixed(2));
                    if (money > 999.99) {
                        that.lowPriceHide();
                        that.alertShow("最多输入3位整数，2位o小数");
                        that.options.isValid = false;
                        return false;
                    }
                    if (money / options.carPrice < 0.7) {
                        that.alertHide();
                        this.lowPriceShow();
                        that.options.isValid = false;
                        return false;
                    }
                } else {
                    that.lowPriceHide();
                    that.alertShow("最多输入3位整数，2位小数");
                    that.options.isValid = false;
                    return fasle;
                }
            }

            that.options.isValid = true;
            that.alertHide();
            that.lowPriceHide();

        },
        checkPhone: function(mobile) {
            var that = this;
            //判断手机号
            if (!mobile) {
                that.alertShow('没有手机号，没法联系您哦');
                that.options.isValid = false;
                return false;
            }
            if (!_v.isPhone(mobile)) {
                that.alertShow('客官 , 给个靠谱的手机号呗');
                that.options.isValid = false;
                return false;
            }
            that.options.isValid = true;
            that.alertHide();
        }
    };
    return Bargain;
})(window, $, Validator);

$.fn.Bargain = function(options) {
    var opts = options || {};
    opts["wrapper"] = $(this);
    var bargarin = new Bargain(opts);
    bargarin.init();
}

// $.fn.Bargain = (function() {
//     var bargarin = null;
//     return function(options) {
//         var opts = options || {};
//         var isInit = true;
//         if (!bargarin) {
//             opts["wrapper"] = $(this);
//             bargarin = new Bargain(opts);
//             isInit = false;
//         } else {
//             isInit = true;
//         }
//         bargarin.init(isInit);
//     }
// })();



/*已登录*/
// $(".li-xdj").click(function() {
//     $("#barginWrapper").Bargain({
//         carPrice: 99,
//         islogin: true,
//         mobile: 18600408090,
//         submitCallback: function(options) {
//             console.log(options);
//             options.hide();
//              $("#successWrapper").SuccessModal({
//                 maskWrapper: "#shadow_detail"
//             });
//         }
//     });
// });

/*未登录*/
// $(".li-xdj").click(function() {
//     $("#barginWrapper").Bargain({
//         carPrice: 99,
//         islogin: false,
//         mobile: '',
//         submitCallback: function(options) {
//             console.log(options);
//             options.hide();
//             $("#successWrapper").SuccessModal({
//                 maskWrapper: "#shadow_detail"
//             });
//         },
//         smsOpts: {
//             smswrapperid: '#smsWrapper',
//             title: '我的中国心',
//             autoPlay: true,
//             num: 10,
//         }
//     });
// });