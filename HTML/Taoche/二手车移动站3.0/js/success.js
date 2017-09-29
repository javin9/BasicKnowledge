var SuccessModal = (function() {
    var SuccessModal = function(opts) {
    	console.log(opts);
        this.opts = {
            wrapper: null,
            maskWrapper: undefined,
            title: '',
            content: '',
            btn: ''
        };
        this.opts = $.extend(this.opts, opts);
        console.log(this.opts);
    };
    SuccessModal.prototype = {
        init: function() {
            this.showModal();
            this.bindEvent();
        },
        bindData: function() {
            var options = this.opts;
            if (!options.title) {
                options.wrapper.find('.success-title').text(options.title);
            }
            if (!options.content) {
                options.wrapper.find('.success-content').text(options.content);
            }
            if (!options.btn) {
                options.wrapper.find('.success-btn').html(options.btn);
            }

        },
        bindEvent: function() {
            var that = this,
                options = this.opts;
            options.wrapper.find('.success-btn').click(function() {
                that.hideModal();
            });
            options.wrapper.find('.success-close').click(function() {
                that.hideModal();
            });
            var shadow_detai = this.opts.maskWrapper;
            if (!shadow_detai) { return false; }
            var timer = null;
            $(shadow_detai).on({
                "touchstart": function() {
                    timer = setTimeout(function() {
                        that.hideModal();
                    }, 300);
                },
                "touchmove": function(ev) {
                    ev.preventDefault();
                    window.clearTimeout(timer);
                }
            });
        },
        showModal: function() {
        	var opts=this.opts;
                opts.wrapper.show();
            var shadow_detai = opts.maskWrapper;
            if (!shadow_detai) { return false; }
            $(shadow_detai).show();
        },
        hideModal: function() {
        	var opts=this.opts;
             opts.wrapper.hide();
              var shadow_detai = opts.maskWrapper;
            if (!shadow_detai) { return false; }
            $(shadow_detai).hide();
        }
    };
    return SuccessModal;
})()

$.fn.SuccessModal = function(opts) {
    opts = opts || {};
    var wrapper=$(this);
    opts["wrapper"] =wrapper;
    var success = new SuccessModal(opts);
    success.init();
};
