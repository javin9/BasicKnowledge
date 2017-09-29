var TaocheSwiper = (function(argument) {
    /*默认值*/
    var extend = function(destination, source) {
        if (!destination) return source;
        for (var property in source) {
            destination[property] = source[property];
        }
        return destination;
    };

    /*TaocheSwiper Obj*/
    var TaocheSwiper = function(wrapper, opts, customOpts) {
        this.wrapper = wrapper;
        this.opts = {
            bonuce: false,
            tap: true
        };
        this.opts = extend(this.opts, opts);
        this.customOpts = null;
        this.scroll = new IScroll(this.wrapper, this.opts);
        // $('.sub').on("click", function() {
        //     console.log('111')
        // });
    }
    TaocheSwiper.prototype = {
        init: function(opts) {
            var defaultOpts = {
                ele: "",
                elementClickCallbck: null
            };
            this.customOpts = extend(defaultOpts, opts);
            this.bindEvent();
        },
        bindEvent: function() {
            var that = this;
            if (!!that.customOpts.elementClickCallbck && !!that.customOpts.ele) {
                 $(that.wrapper).find(that.customOpts.ele).on("tap",that.customOpts.elementClickCallbck);
            }
          
        }

    };
    return TaocheSwiper;
})();