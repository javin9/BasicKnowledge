//表单逻辑
var Sms = (function(Validator, window, $) {
    /*验证插件*/
    var _v = new Validator();
    /*阻止默认滚动*/
    var preventDefaultScroll = function() {
        arguments[0].preventDefault();
    };
    var Sms = function(opts) {
        this.settings = {
            wrapper: null,
            maskSelector: "#shadow_detail",
            mobile: undefined,
            title: "",
            autoPlay: false,
            num: 10,
            submitCallback: null,
            money: undefined
        };
        this.settings = $.extend({}, this.settings, opts);
        this.options = {};
        this.timer = null;
        this.num = this.settings.num;
    };
    Sms.prototype = {
        init: function(isInit) {
            this.initOptions();
            this.bindEvent();
            this.showSms();
            this.bindData();
        },
        bindData: function() {
            if (!!this.options.title) {
                this.options.wrapper.find('.pop_title').text(this.options.title);
            }
            var mobile = this.options.mobile;
            if (!!mobile) {
                this.options.phone.val(mobile);
            }
            if (this.options.autoPlay) {
                this.options.countdown.trigger('click');
            }
        },
        showSms: function() {
            if (!!this.options.mask.length) {
                this.options.mask.show();
            }
            //显示浮层
            this.options.wrapper.show();
        },
        hideSms: function() {
            var that=this;
            var options = that.options;
            if (!!options.mask) {
                options.mask.hide();
            }
            //显示浮层
            window.clearInterval(that.timer);
            options.wrapper.hide();
            this.alertHide();
            options.phone.val('').prop("disabled",false);
            options.code.val('');
            options.countdown.show();
            options.recountdown.hide();
            options.countdownNumWrapper.show();
        },
        initOptions: function() {
            var settings = this.settings,
                wrapper = settings.wrapper;
            this.options = {
                autoPlay: settings.autoPlay,
                mobileValid: true,
                title: settings.title,
                phone: settings.phone,
                codeValid: true,
                mask: !!settings.maskSelector ? $(settings.maskSelector) : null,
                wrapper: wrapper,
                num: settings.num,
                code: wrapper.find('.sms-code'),
                phone: wrapper.find('.sms-phone'),
                mobile: settings.mobile,
                submit: wrapper.find('.sms-submit'),
                alertWrapper: wrapper.find('.sms-alert-wrapper'),
                alertTxt: wrapper.find(".alert-txt"),
                countdown: wrapper.find(".countdown"),
                countdownNum: wrapper.find(".countdown-num"),
                countdownNumWrapper: wrapper.find('.countdown-num-wrapper'),
                recountdown: wrapper.find(".recountdown"),
                close: wrapper.find('.sms-close')
            };
        },
        bindEvent: function() {
            var that = this,
                options = that.options;
            //点击发送
            options.countdown.click(function() {
                that.send(function(options) {
                    options.countdown.hide();
                });
            });
            //重新发送
            options.recountdown.click(function() {
                that.send();
            });
            /*提交表单*/
            options.submit.click(function() {
                var phone_value = $.trim(options.phone.val());
                that.checkPhone(phone_value);
                if (!options.mobileValid) { return false; }

                var code_value = $.trim(options.code.val());
                that.checkCode(code_value);
                if (!options.codeValid) { return false; }

                //TODO
                console.log('调用银光接口');
                var submitCallback = that.settings.submitCallback;
                typeof submitCallback === "function" && submitCallback.call(that, {
                    mobile: phone_value,
                    money: that.settings.money,
                    code: code_value,
                    hide: function() {
                        that.hideSms();
                    }
                })
            });
            //关闭
            options.close.click(function() {
                that.hideSms();
            });
            //禁止滚动
            if (!!options.mask.length) {
                var timer = null;
                options.mask.on({
                    "touchstart": function() {
                        console.log('mask touchstart');
                        timer = setTimeout(function() {
                            that.hideSms();
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
        alertShow: function(title) {
            var options = this.options;
            options.alertWrapper.show();
            options.alertTxt.text(title);
        },
        alertHide: function() {
            this.options.alertWrapper.hide();
        },
        sendSms: function(mobile) {
            $.ajax({
                type: 'get',
                url: 'http://ajax.taoche.cn/smscode/getcode.ashx',
                data: { phone: mobile, t: 20 },
                dataType: 'jspnp',
                success: function (data) {
                    console.log(data);
                },
                error: function (data) {
                    console.log(data);
                }
            });
        },
        checkCode: function(code) {
            var that = this;
            //判断手机号
            if (!code) {
                that.alertShow('请输入验证码');
                that.options.submit.removeClass("mat30");
                that.options.codeValid = false;
                return false;
            }
            if (!_v.isCode(code)) {
                that.alertShow('验证码输入有误');
                that.options.submit.removeClass("mat30");
                that.options.codeValid = false;
                return false;
            }
            that.options.codeValid = true;
            that.alertHide();
            that.options.submit.addClass("mat30");
        },
        checkPhone: function(mobile) {
            var that = this;
            //判断手机号
            if (!mobile) {
                that.alertShow('没有手机号，没法联系您哦');
                that.options.submit.removeClass("mat30");
                that.options.mobileValid = false;
                return false;
            }
            if (!_v.isPhone(mobile)) {
                that.alertShow('客官 , 给个靠谱的手机号呗');
                that.options.submit.removeClass("mat30");
                that.options.mobileValid = false;
                return false;
            }
            that.options.mobileValid = true;
            that.alertHide();
            that.options.submit.addClass("mat30");
        },
        send: function(fn) {
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
                    options.recountdown.removeClass("colf9").addClass("col9");
                    that.timer = setInterval(function() {
                        that.countdownFunc();
                    }, 1000)
                    that.sendSms(mobile);
                }

            }
        },
        countdownFunc: function() {
            var that=this;
            var options = that.options;
            if (options.num > 1) {
                options.num = options.num - 1;
                options.countdownNum.text(options.num);
            } else {
                options.num = that.num;
                options.countdownNumWrapper.hide();
                options.recountdown.removeClass('counting');
                clearInterval(that.timer);
                options.recountdown.removeClass("col9").addClass("colf9");
                options.phone.removeClass('input-dis').prop({ disabled: false });
                typeof options.callback == "function" && options.callback.call(this);
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

$.fn.Sms = function(opts) {
    var opts = opts || {};
    opts["wrapper"] = $(this);
    var sms = new Sms(opts);
    sms.init();
}

//例子
$(".li-xdj").click(function() {
    $("#smsWrapper").Sms({
        mobile: '18600408090',
        title: "我的中国心",
        autoPlay: false,
        num: 20
    });
});