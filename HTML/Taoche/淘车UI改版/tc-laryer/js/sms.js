//表单逻辑
var Sms = (function (Validator, window, $) {
    //函数字节流
    //函数字节流
    var _debounce = function (func, wait, immediate) {
        // immediate默认为false
        var timeout, args, context, timestamp, result;

        var later = function () {
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

        return function () {
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

    /*验证插件*/
    var _v = new Validator();
    /*阻止默认滚动*/
    var preventDefaultScroll = function () {
        arguments[0].preventDefault();
    };

    var Sms = function (opts) {
        this.settings = {
            wrapper: null,
            zIndex: 1000,
            maskSelector: "#shadow_detail",
            maskZindex: 999,
            activeClass: 'btn-sub',
            countActiveClass: 'colff2',
            mobile: undefined,
            title: "",
            autoPlay: false,
            num: 10,
            submitCallback: null,
            closeCallback: null,
            money: undefined
        };
        this.settings = $.extend({}, this.settings, opts);
        this.options = {};
        this.timer = null;
        this.num = this.settings.num;
    };
    Sms.prototype = {
        init: function (isInit) {
            this.initOptions();
            this.bindEvent();
            this.showSms();
            this.bindData();
        },
        bindData: function () {
            if (!!this.options.title) {
                this.options.wrapper.find('.sms-pop_title').text(this.options.title);
            }
            var mobile = this.options.mobile;
            if (!!mobile) {
                this.options.phone.val(mobile);
                this.showDelIcon(".sms-phone");
                this.options.autoPlay && this.options.countdown.trigger('click');
            }

        },
        showSms: function () {
            var that = this,
                options = that.options;
            if (!!options.mask.length) {
                options.mask.show().css("z-index", options.maskZindex);

            }
            //显示浮层
            // this.options.wrapper.show().css("z-index", options.zIndex);
            options.wrapper.show().css("z-index", options.zIndex);
            //var transition = "all 0.3s ease";
            //options.wrapper[0].style.webkitTransition = transition;
            //options.wrapper[0].style.Transition = transition;
            

            //setTimeout(function () {
            //    cssTransform(options.wrapper[0], "translateY", 0);
            //}, 10);
        },
        hideSms: function () {
            var that = this;
            var options = that.options;
            that.hideSmsTransitionend();

            //var height = options.wrapper.height();
            //cssTransform(options.wrapper[0], "translateY", height);
            //addEnd(options.wrapper[0], end);

            //function addEnd(obj, fn) {
            //    obj.addEventListener('WebkitTransitionEnd', fn, false);
            //    obj.addEventListener('transitionend', fn, false);
            //}

            //function removeEnd(obj, fn) {
            //    obj.removeEventListener('WebkitTransitionEnd', fn, false);
            //    obj.removeEventListener('transitionend', fn, false);
            //}

            //function end() {
            //    options.wrapper[0].style.webkitTransition = '';
            //    options.wrapper[0].style.Transition = ''
            //    that.hideSmsTransitionend();
            //    removeEnd(options.wrapper[0], end);
            //}
        },
        hideSmsTransitionend: function () {
            var that = this;
            var options = that.options;
            if (!!options.mask) {
                options.mask.hide();
            }
            //显示浮层
            options.wrapper.hide();
            window.clearInterval(that.timer);
            that.alertHide();
            options.phone.val('').prop("disabled", false);
            options.code.val('');
            options.countdown.show();
            options.recountdown.hide().removeClass('counting');
            options.countdownNumWrapper.show();
            that.options.clearSelector.hide();
            that.options.submit.removeClass(that.options.activeClass);
            typeof that.settings.closeCallback === "function" && that.settings.closeCallback.call(that, options);
        },
        initOptions: function () {
            var settings = this.settings,
                wrapper = settings.wrapper;
            this.options = {
                autoPlay: settings.autoPlay,
                mobileValid: true,
                title: settings.title,
                phone: settings.phone,
                codeValid: true,
                activeClass: settings.activeClass,
                countActiveClass: settings.countActiveClass,
                mask: !!settings.maskSelector ? $(settings.maskSelector) : null,
                maskZindex:settings.maskZindex,
                wrapper: wrapper,
                zIndex: settings.zIndex,
                num: settings.num,
                code: wrapper.find('.sms-code'),
                phone: wrapper.find('.sms-phone'),
                mobile: settings.mobile,
                submit: wrapper.find('.sms-submit'),
                alertWrapper: wrapper.find('.sms-alert-wrapper'),
                alertTxt: wrapper.find(".sms-alert-txt"),
                countdown: wrapper.find(".countdown"),
                countdownNum: wrapper.find(".countdown-num"),
                countdownNumWrapper: wrapper.find('.countdown-num-wrapper'),
                recountdown: wrapper.find(".recountdown"),
                close: wrapper.find('.sms-close'),
                clearSelector: wrapper.find('.sms-del')
            };
        },
        bindEvent: function () {
            var that = this,
                options = that.options;
            //点击发送
            options.countdown.off().click(function () {
                that.send(function (options) {
                    options.countdown.hide();
                });
            });
            //重新发送
            options.recountdown.off().click(function () {
                that.send();
            });
            /*提交表单*/
            options.submit.off().click(function () {
                var phone_value = $.trim(options.phone.val());
                that.checkPhone(phone_value);
                if (!options.mobileValid) { return false; }

                var code_value = $.trim(options.code.val());
                that.checkCode(code_value);
                if (!options.codeValid) { return false; }

                //TODO
                var submitCallback = that.settings.submitCallback;
                typeof submitCallback === "function" && submitCallback.call(that, {
                    submitBtn: options.submit,
                    mobile: phone_value,
                    money: that.settings.money,
                    code: code_value,
                    hide: function () {
                        that.hideSms();
                    }
                })
            });
            //关闭
            options.close.off().click(function () {
                that.hideSms();
            });
            //禁止滚动
            if (!!options.mask.length) {
                var timer = null;
                options.mask.on({
                    "touchstart": function () {
                        timer = setTimeout(function () {
                            that.hideSms();
                        }, 300);
                    },
                    "touchmove": function (ev) {
                        ev.preventDefault();
                        window.clearTimeout(timer);
                    }
                })
            }
            options.wrapper.on("touchmove", function (ev) {
                ev.preventDefault();
            });

            //清空输入内容
            options.clearSelector.click(function () {
                var $this = $(this),
                    clearTarget = $this.attr('data-target');
                if (!!clearTarget) {

                    setTimeout(function () {
                        that.checkValidFunc();
                    }, 0)

                    that.settings.wrapper.find(clearTarget).val('');
                    that.hideDelIcon(clearTarget);
                }
            });

            //手机号输入
            options.phone.off().keyup(_debounce(function () {
                var $this = $(this);
                var mobile = $this.val();
                if (!!!mobile) {
                    that.hideDelIcon('.sms-phone');
                    // $(".sms-del[data-target='.sms-phone']").hide();
                } else {
                    that.showDelIcon('.sms-phone');
                    // $(".sms-del[data-target='.sms-phone']").show();
                }
                // that.checkPhone(mobile);
                that.checkValidFunc();
            }, 30));

            // options.code
            options.code.off().keyup(_debounce(function () {
                var $this = $(this);
                var code = $this.val();
                if (!!!code) {
                    that.hideDelIcon('.sms-code');
                    // $(".sms-del[data-target='.sms-code']").hide();
                } else {
                    that.showDelIcon('.sms-code');
                    // $(".sms-del[data-target='.sms-code']").show();
                }
                // that.checkCode(code);
                that.checkValidFunc();
            }, 30));
        },
        showDelIcon: function (section) {
            $(".sms-del[data-target='" + section + "']").show();
        },
        hideDelIcon: function (section) {
            $(".sms-del[data-target='" + section + "']").hide();
        },
        alertShow: function (title) {
            var options = this.options;
            // options.alertWrapper.show();
            options.alertTxt.text(title);
        },
        alertHide: function () {
            this.options.alertTxt.text('');
        },
        sendSms: function (mobile) {
            $.ajax({
                type: 'get',
                url: 'http://ajax.taoche.cn/smscode/getcode.ashx',
                data: { phone: mobile, t: 20 },
                dataType: 'jspnp',
                success: function (data) { },
                error: function (data) {
                    console.log(data);
                }
            });
        },
        checkValidFunc: function () {
            var that = this,
                options = that.options;

            var code_value = $.trim(options.code.val());
            that.checkCode(code_value);
            var phone_value = $.trim(options.phone.val());
            that.checkPhone(phone_value);
            if (options.mobileValid && options.codeValid) {
                options.submit.addClass(options.activeClass);
            } else {
                options.submit.removeClass(options.activeClass);
            }

        },
        checkCode: function (code) {
            var that = this;
            //判断手机号
            if (!code) {
                that.alertShow('请输入验证码');
                that.options.codeValid = false;
                return false;
            }
            if (!_v.isCode(code)) {
                that.alertShow('验证码输入有误');
                that.options.codeValid = false;
                return false;
            }

            that.options.codeValid = true;
            that.alertHide();
        },
        checkPhone: function (mobile) {
            var that = this;
            //判断手机号
            if (!mobile) {
                that.alertShow('没有手机号，没法联系您哦');
                that.options.mobileValid = false;
                return false;
            }
            if (!_v.isPhone(mobile)) {
                that.alertShow('客官 , 给个靠谱的手机号呗');
                that.options.mobileValid = false;
                return false;
            }

            that.options.mobileValid = true;
            that.alertHide();
        },
        send: function (fn) {
            var that = this;
            var options = that.options;

            if (!options.recountdown.hasClass('counting')) {
                var mobile = $.trim(options.phone.val());
                that.checkPhone(mobile);
                if (options.mobileValid) {
                    typeof fn === "function" && fn.call(this, options);
                    that.options.num = that.num;
                    options.phone.addClass('input-dis').prop({ disabled: true });
                    options.recountdown.addClass('counting');
                    options.countdownNum.text(options.num);
                    options.countdownNumWrapper.show();
                    options.recountdown.show();
                    options.recountdown.removeClass(options.countActiveClass);
                    that.timer = setInterval(function () {
                        that.countdownFunc();
                    }, 1000)
                    that.sendSms(mobile);
                }

            }
        },
        countdownFunc: function () {
            var that = this;
            var options = this.options;
            if (options.num > 1) {
                options.num = options.num - 1;
                options.countdownNum.text(options.num);
            } else {
                options.num = that.num;
                options.countdownNumWrapper.hide();
                options.recountdown.removeClass('counting');
                clearInterval(that.timer);
                options.recountdown.addClass(options.countActiveClass);
                options.phone.removeClass('input-dis').prop({ disabled: false });
                typeof options.callback == "function" && options.callback.call(that);
            }
        }
    };
    return Sms;
})(Validator, window, $);



// $.fn.Sms = (function() {
//     var sms = null;
//     return function(options) {
//         var opts = options || {};
//         var isInit = true;
//         if (!sms) {
//             opts["wrapper"] = $(this);
//             sms = new Sms(opts);
//             isInit = false;
//         } else {
//             isInit = true;
//         }
//         sms.init(isInit);
//     }
// })();

$.fn.Sms = function (opts) {
    var opts = opts || {};
    opts["wrapper"] = $(this);
    var sms = new Sms(opts);
    sms.init();
}

// $("#smsWrapper").Sms({
//     title: '是谁开着比亚迪掉进了水沟'
// });