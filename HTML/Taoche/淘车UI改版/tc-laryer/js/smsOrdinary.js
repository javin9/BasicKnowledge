//表单逻辑
var SmsOrdinary = (function(Validator, window, $) {
    //函数字节流
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

    /*验证插件*/
    var _v = new Validator();
    /*阻止默认滚动*/
    var preventDefaultScroll = function() {
        arguments[0].preventDefault();
    };

    var SmsOrdinary = function(opts) {
        this.settings = {
            wrapper: null,
            zIndex: 1000,
            maskSelector: "#shadow_detail",
            maskZindex: 999,
            codestate: true,
            activeClass: 'btn-sub',
            mobile: undefined,
            title: "",
            submitCallback: null,
            closeCallback: null,
            checkImgCodeCallback: null
        };
        this.settings = $.extend({}, this.settings, opts);
        this.options = {};
        this.codestate = this.settings.codestate;
    };
    SmsOrdinary.prototype = {
        init: function(isInit) {
            this.initOptions();
            this.bindEvent();
            this.showSms();
            this.bindData();
        },
        bindData: function() {
            if (!!this.options.title) {
                this.options.wrapper.find('.sms-pop_title').text(this.options.title);
            }
            var mobile = this.options.mobile;
            if (!!mobile) {
                this.options.phone.val(mobile);
                this.showDelIcon(".sms-phone");
                this.checkValidFunc();
            }

        },
        showSms: function() {
            var that = this,
                options = that.options;
            if (!!options.mask.length) {
                options.mask.show().css("z-index", options.maskZindex);

            }
            that.toggleImgCodeState();
            //显示浮层
            options.wrapper.show().css("z-index", options.zIndex);
        },
        hideSms: function() {
            var that = this;
            var options = that.options;
            that.hideSmsTransitionend();
        },
        hideSmsTransitionend: function() {
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
            that.options.clearSelector.hide();
            that.options.submit.removeClass(that.options.activeClass);
            typeof that.settings.closeCallback === "function" && that.settings.closeCallback.call(that, options);
        },
        toggleImgCodeState: function() {
            var that = this;
            var options = that.options;
            if (that.codestate) {
                options.codeWrapper.removeClass('hide');
            } else {
                options.codeWrapper.addClass('hide');
            }
        },
        initOptions: function() {
            var settings = this.settings,
                wrapper = settings.wrapper;
            this.options = {
                mobileValid: true,
                title: settings.title,
                phone: settings.phone,
                codeValid: true,
                activeClass: settings.activeClass,
                mask: !!settings.maskSelector ? $(settings.maskSelector) : null,
                wrapper: wrapper,
                zIndex: settings.zIndex,
                num: settings.num,
                codeWrapper: wrapper.find('.sms-imagecodewrapper'),
                code: wrapper.find('.sms-imgcode'),
                phone: wrapper.find('.sms-phone'),
                mobile: settings.mobile,
                submit: wrapper.find('.sms-submit'),
                alertWrapper: wrapper.find('.sms-alert-wrapper'),
                alertTxt: wrapper.find(".sms-alert-txt"),
                close: wrapper.find('.sms-close'),
                clearSelector: wrapper.find('.sms-del')
            };


        },
        bindEvent: function() {
            var that = this,
                options = that.options;

            /*提交表单*/
            options.submit.off().click(function() {
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
                    hide: function() {
                        that.hideSms();
                    }
                })
            });
            //关闭
            options.close.off().click(function() {
                that.hideSms();
            });
            //禁止滚动
            if (!!options.mask.length) {
                var timer = null;
                options.mask.on({
                    "touchstart": function() {
                        timer = setTimeout(function() {
                            that.hideSms();
                        }, 300);
                    },
                    "touchmove": function(ev) {
                        ev.preventDefault();
                        window.clearTimeout(timer);
                    }
                })
            }
            options.wrapper.on("touchmove", function(ev) {
                ev.preventDefault();
            });

            //清空输入内容
            options.clearSelector.click(function() {
                var $this = $(this),
                    clearTarget = $this.attr('data-target');
                if (!!clearTarget) {

                    setTimeout(function() {
                        that.checkValidFunc();
                    }, 0)

                    that.settings.wrapper.find(clearTarget).val('');
                    that.hideDelIcon(clearTarget);
                }
            });

            //手机号输入
            options.phone.off().keyup(_debounce(function() {
                var $this = $(this);
                var mobile = $this.val();
                if (!!!mobile) {
                    that.hideDelIcon('.sms-phone');
                } else {
                    that.showDelIcon('.sms-phone');
                }
                that.checkValidFunc();
            }, 30));

            // options.code
            options.code.off().keyup(_debounce(function() {
                var $this = $(this);
                var code = $this.val();
                if (!!!code) {
                    that.hideDelIcon('.sms-imgcode');
                } else {
                    that.showDelIcon('.sms-imgcode');
                }
                that.checkValidFunc();
            }, 30));
        },
        showDelIcon: function(section) {
            $(".sms-del[data-target='" + section + "']").show();
        },
        hideDelIcon: function(section) {
            $(".sms-del[data-target='" + section + "']").hide();
        },
        alertShow: function(title) {
            var options = this.options;
            options.alertTxt.text(title);
        },
        alertHide: function() {
            this.options.alertTxt.text('');
        },
        checkValidFunc: function() {
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
        checkCode: function(code) {
            var that = this;
            var options = that.options;
            //判断手机号
            if (that.codestate) {
                if (!code) {
                    that.alertShow('请您输入右侧验证码');
                    that.options.codeValid = false;
                    return false;
                }
                if (code) {

                }

            }

            that.options.codeValid = true;
            that.alertHide();
        },
        codeImgInit: function() {
            var that = this;
            var options = that.options;
            var cache = {};
            return function() {
                if (!!!cache[selector]) {
                    cache[selector] = 1;
                    $(selector).click(function() {
                        if (typeof Taoche.ImgCheckCode.refresh === "function") {
                            Taoche.ImgCheckCode.refresh(selector, 'advisory');
                        }
                    }).trigger('click');
                }
            }
        },
        checkPhone: function(mobile) {
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
        }
    };
    return SmsOrdinary;
})(Validator, window, $);


$.fn.SmsOrdinary = function(opts) {
    var opts = opts || {};
    opts["wrapper"] = $(this);
    var smsOrdinary = new SmsOrdinary(opts);
    smsOrdinary.init();
}

$("#ordinarySmsWrapper").SmsOrdinary({
    title: '是谁开着比亚迪掉进了水沟',
    mobile: '18600408090',
    codestate: false
});