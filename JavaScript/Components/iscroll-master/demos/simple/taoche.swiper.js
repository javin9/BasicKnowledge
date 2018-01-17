(function(factory) {

    if (typeof module === 'object' && module.export) {
        module.export = factory();
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define([], factory);
    } else if (typeof window !== 'undefined') {
        window.TaocheSwiper = factory();
    }

})(function(argument) {
    /*默认值*/
    var extend = function(destination, source) {
        if (!destination) return source;
        for (var property in source) {
            destination[property] = source[property];
        }
        return destination;
    };

    /*TaocheSwiper Obj*/
    var TaocheSwiper = function(wrapper, opts) {
        this.wrapper = wrapper;
        this.$wrapper = $(wrapper);
        this.opts = {
            bounce: false,
            wrapper: '',
            ele: "",
            back: ".leftmask",
            hideback: true,
            trigger: "",
            zIndex: '',
            elementClickCallbck: null,
            afterShowCallback: null,
            afterHideCallback: null,
            secondInit: null
        };
        this.opts = extend(this.opts, opts);
        // debugger;
        //初始化滚动条
        this.scroll = null;
    }
    TaocheSwiper.prototype = {
        init: function() {
            var that = this;
            that.bindEvent();
            that.initCss();
            typeof this.opts.secondInit === "function" && this.opts.secondInit.call(that);
        },
        bindEvent: function() {
            //点击子类
            var that = this,
                opts = that.opts;
            if (!!opts.elementClickCallbck && !!opts.ele) {
                that.$wrapper.find(opts.ele).on("tap", function(ev) {
                    ev.preventDefault();
                    var ele = this;
                    typeof opts.elementClickCallbck === 'function' && opts.elementClickCallbck.call(ele, opts);
                });
            }
            //遮罩层事件
            $(opts.back).click(function() {
                that.hide();
            });

            //触发事件
            opts.trigger.click(function() {
                that.show();
            })
        },

        show: function() {
            var that = this,
                opts = that.opts;
            that.$wrapper.show();
            //初始化滚动条
            that.scroll = new IScroll(that.wrapper, {
                bounce: opts.bounce,
                tap: true
            });
            window.setTimeout(function() {
                that.$wrapper.addClass('swipeLeft-block');
                typeof opts.afterShowCallback === 'function' && opts.afterShowCallback.call(that, opts);
            }, 100);
            $(opts.back).show();
        },
        hide: function() {
            var that = this,
                opts = that.opts;
            that.$wrapper.hide().removeClass('swipeLeft-block');
            typeof opts.afterHideCallback === 'function' && opts.afterHideCallback.call(that, opts);
            if (opts.hideback) {
                $(opts.back).hide();
            }
            this.scroll = null;
        },
        initCss: function() {
            var that = this,
                opts = that.opts;
            //初始化zIndex层级关系
            if (!!opts.zIndex) {
                that.$wrapper.css("z-index", opts.zIndex);
            }

        }
    };
    return TaocheSwiper;
});

$.fn.TaocheSwiper = function(wrapper, opts) {
    if (!!wrapper && typeof wrapper === "string") {
        var opts = opts || {};
        opts["trigger"] = $(this);
        var swiper = new TaocheSwiper(wrapper, opts);
        swiper.init();
        return false;
    }
    throw new new Error('wrapper is undefined');
}