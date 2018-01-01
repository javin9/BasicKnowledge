//倒计时
var CountDown = function(opts) {
    var defaultOpts = {
        wrapper: "#countdown-wrapper",
        beforeFn: null,
        callback: null,
        num: 10
    };
    var options = $.extend({}, defaultOpts, opts);
    this.num = options.num;

    var wrapper = $(options.wrapper);
    this.options = {
        num: options.num,
        beforeFn: options.beforeFn,
        callback: options.callback,
        wrapper: wrapper,
        countdownNum: wrapper.find(".countdown-num"),
        countdownNumWrapper: wrapper.find('.countdown-num-wrapper'),
        recountdown: wrapper.find(".recountdown")
    };
    this.timer = null;
};
CountDown.prototype = {
    init: function(trigger) {
        this.bindEvent();
        trigger.hide();
        this.send();
    },
    send: function() {
        var that = this,
            options = that.options;
        if (!options.recountdown.hasClass('counting')) {
            options.recountdown.addClass('counting');
            options.countdownNum.text(options.num);
            options.countdownNumWrapper.show();
            options.recountdown.show();
            that.timer = setInterval(function() {
                that.countdownFunc();
            }, 1000)
        }
    },
    countdownFunc: function() {
        var options = this.options;
        if (options.num > 0) {
            options.num = options.num - 1;
            options.countdownNum.text(options.num);
        } else {
            options.num = this.num;
            options.countdownNumWrapper.hide();
            options.recountdown.removeClass('counting');
            clearInterval(this.timer);
            typeof options.callback == "function" && options.callback.call(this);
        }
    },
    bindEvent: function() {
        var that = this,
            options = that.options;
        $(options.recountdown).click(function() {
            that.send();
        });
    }
};