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

//幻灯片
(function ($) {
    /*options:公共配置,sliderOptions:幻灯片配置*/
    $.fn.slider = function (options, sliderOptions) {
        var setting = {
            eventName: 'onmouseover',
            itemName: '.rsSlide',
            init: function () {
                var $this = this,
                $box = $this.parent().parent();
                $this.stop = false;
                var $focus_left = $box.find('.focus_left').click(function (ev) {
                    ev.preventDefault();
                    if ($this.stop) {
                        return;
                    }
                    $this.royalSlider.prev();
                    $this.stop = true;
                })

                var $focus_right = $box.find('.focus_right').click(function (ev) {
                    ev.preventDefault();
                    if ($this.stop) {
                        return;
                    }
                    $this.royalSlider.next();
                    $this.stop = true;
                })

                $this.royalSlider.ev.on('rsAfterSlideChange', function (event) {
                    $this.stop = false;
                });
                if ($this.itemCount > 1) {
                    $focus_left.show();
                    $focus_right.show();
                } else {
                    $focus_left.hide();
                    $focus_right.hide();
                }
            },
            findMenu: function () {
                return this.parent().parent().find('.focus_dot');
            },
            createMenu: function () {
                var $this = this;
                $this.$menu = options.findMenu.call($this);
				console.log($this.$menu)
                if ($this.$menu[0]) {
                    if ($root.itemCount > 1) {
                        for (var i = 0; i < $this.royalSlider.numSlides; i++) {
                            var li = $('<li>');
                            li[0].index = i;
                            li[0][options.eventName] = function (ev) {
                                $this.royalSlider.goTo(this.index);
                            }
                            li.appendTo(this.$menu);
                        }
                        this.$menu.width(this.royalSlider.numSlides * this.$menu.find('li').eq(0).width() + 10 * this.royalSlider.numSlides);
                    }
                    options.selectMenu.call($root, 0);
                }
            },
            selectMenu: function (idx) {
                if (this.$menu[0]) {
                    var lis = this.$menu.find('li')
                    lis.removeClass('current');
                    lis.eq(idx).addClass('current');
                }
            }
        }

        var $root = this;
        options = Object.extend(options, setting);
        $root.itemCount = $root.find(options.itemName).length;

        var sliderSetting = {
            arrowsNav: false,
            loop: true,
            startSlideId: 0,
            autoPlay: false,
            transitionType: $root.itemCount > 1 ? 'move' : 'fade',
            globalCaption: true,
            deeplinking: {
                enabled: true,
                change: false
            },
            allowCSS3: true,
            fadeinLoadedSlide: false,
            loopRewind: false,
            transitionSpeed: 300,
            sliderTouch: false,
            sliderDrag: false
        }

        sliderOptions = Object.extend(sliderOptions, sliderSetting);


        console.log(sliderOptions)
        $root.royalSlider = $root.royalSlider(sliderOptions).data('royalSlider');

        options.createMenu.call($root);
        //rsAfterSlideChange 滑动之前触发
        $root.royalSlider.ev.on('rsBeforeAnimStart', function (event) {
            // triggers after slide change
            options.selectMenu.call($root, $root.royalSlider.currSlideId);
        });

        options.init && options.init.call($root);
    }
})(jQuery);