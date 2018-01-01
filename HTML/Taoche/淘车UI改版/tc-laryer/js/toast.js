var Toast = (function() {
    var getSingle = function(fn) {
        var result;
        return function() {
            return result || (result = fn.apply(this, arguments));
        }
    };
    var createToast = function(content) {
        var div = document.createElement('div');
        div.className = "todos";
        div.style.display = 'none';
        var p = document.createElement('p');
        div.appendChild(p);
        document.body.appendChild(div);
        return div;
    };

    var Toast = function(opts) {
        this.settings = {
            time: 3000
        }
        this.settings = $.extend({}, this.settings, opts);
        this.toast = null;
    };

    Toast.prototype = {
        init: function() {
            var that = this;
            that.toast = getSingle(createToast)();
        },
        show: function(title) {
            var that = this,
                $toast = $(that.toast);
            $toast.find('p').text(title);
            $toast.show();
            window.setTimeout(function() {
                that.hide();
            }, that.settings.time);
        },
        hide: function() {
            $(this.toast).hide();
        }
    };
    return Toast;
})();

// var toast = new Toast();
// toast.init();
// toast.show('北京欢迎您');