/*默认值*/
Object.extend = function (destination, source) {
    if (!destination) return source;
    for (var property in source) {
        if (!destination[property]) {
            destination[property] = source[property];
        }
    }
    return destination;
};

/*公共控件*/
(function ($) {
    /*二次封装滑动幻灯片*/
    $.fn.slider = function (options) {
        var setting = {
            mode: "horizontal", //屏幕方向
            loop: false, //循环
            init: null, //初始化
            setIndex:null, //初始化索引
            autoplay: null, //是否自动播放
            calculateHeight: false,
            initialSlide :0,//显示图片索引
            time: 3000 //幻灯片间隔时间
        }
        var interval = 0;
        options = Object.extend(options, setting);
        var $this = this;
        $this.slider = new Swiper($this[0], {
            mode: options.mode,
            loop: options.loop,
            grabCursor: true,
            paginationClickable: false,
            calculateHeight: options.calculateHeight,
            initialSlide :options.initialSlide,
            visiblilityFullfit: false,
            onSlideChangeStart: function (swiper) {         
                options.setIndex && options.setIndex.call($this, swiper);
            },
            onTouchStart: function () {
                $this.trigger('stop');
            }
        });

        $this.on('set', function (event, idx) {
            $this.trigger('stop');
            $this.slider.swipeTo(idx, function () { options.autoplay && $this.trigger('play'); });
        })

        //自定义播放事件
        $this.on('play', function () {
            $this.trigger('stop');
            interval = setInterval(function () {
                $this.slider.swipeNext($this.slider.activeLoopIndex);
            }, options.time);
        });

        $this.on('stop', function () {
            clearInterval(interval);
        })

        options.autoplay && $this.trigger('play');
        options.init && options.init.call($this);
    }
})(jQuery);


/*初始化*/
$(function () {
   

    //推荐车源
    (function () {
        var $container = $('.swiper-container-cars'),
            items = $container.find('.swiper-slide'),
            li = $container.prev().find('.tags-sub li');
        $container.show();
        if (items.length <= 1) { return };
        $container.slider({
            loop: true,
            setIndex: function (swiper) {
                this.trigger('index', swiper.activeLoopIndex);
            },
            init: function () {
                var $this = this;
                /*解决高度自适应问题*/
                $(window).resize(function () {
                    setTimeout(function () {
                        var li = $container.find('.swiper-slide');
                        var height = 3 * ($this.find('li').height()) + 25;

                        if (height > 0) {
                            li.height(height);
                            li.parent().height(height);
                            li.find('tc-car-list-v').height(height);
                        }
                    }, 50);
                }).trigger('resize');
            }
        });

        li.each(function (index, curr) {
            (function ($o, idx) {
                $o.find('a').on('click', function (ev) {
                    ev.preventDefault();
                    $container.trigger('set', idx);
                })
            })($(curr), index);
        })

        $container.on('index', function (event, idx) {
            li.removeClass('current');
            li.eq(idx).addClass('current');
            $("#divLink").find("div").hide();
            $("#divLink").find("div").eq(idx).show();
        });

        $container.trigger('index', 0);
    })();
});
