Object.extend = function (destination, source) {
    if (!destination) return source;
    for (var property in source) {
        if (!destination[property]) {
            destination[property] = source[property];
        }
    }
    return destination;
};

(function ($) {
    //滑动幻灯片公共库
    $.fn.sliderbase = function (options) {
        var setting = {
            item: '.swiper-slide',
            init: null,
            fnChange: null,
            fnEnd: null,
            speed: 30
        }
        options = Object.extend(options, setting);
        this.each(function (r, current) {
            var $current = $(current);
            (function ($o) {
                var items = $o.find(options.item);
                if (items.length <= 1) return;
                var $ul = items.parent(), w = items[0].offsetWidth; ulwidth = w * items.length, left = 0;
                options.init && options.init.call($o, items);

                $o.index = 0;
                var arr = [];
                for (var i = items.length - 1; i >= 0; i--) {
                    arr.push(items[i].outerHTML);
                }
                arr.unshift(arr[arr.length - 1]);
                $ul[0].innerHTML = arr.join('');
                $ul[0].innerHTML += $ul[0].innerHTML;
                $ul.css('width', ulwidth * 2);
                $o.on('startMove', function (event, opt) {
                    var obj = opt.obj, iTarget = opt.iTarget, fnEnd = opt.fnEnd;
                    clearInterval(obj.timer);
                    obj.timer = setInterval(function () {
                        var suc = true;
                        var speed = (iTarget - left) / 4;
                        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                        left += speed;
                        if (left != iTarget) suc = false;
                        if (left < 0) {
                            obj.style.left = left % ulwidth + 'px';
                        } else {
                            obj.style.left = (left % ulwidth - ulwidth) % ulwidth + 'px';
                        }
                        if (suc) {
                            clearInterval(obj.timer);
                            fnEnd && fnEnd.call($o);
                        }
                    }, options.speed);
                })


                $o.on('prev', function (event) {
                    $o.index = $o.index + 1;
                    $o.trigger('startMove', { obj: $ul[0], iTarget: -($o.index * w), fnEnd: options.fnChange });
                })

                $o.on('next', function (event) {
                    $o.index = $o.index - 1;
                    $o.trigger('startMove', { obj: $ul[0], iTarget: -($o.index * w), fnEnd: options.fnChange });
                })

                $o.on('setIndex', function (event, index) {
                    $o.trigger('startMove', { obj: $ul[0], iTarget: -(index * w), fnEnd: options.fnChange });
                })

                options.fnEnd && options.fnEnd.call($o, items);
            })($current);
        })
    }
    //渐显幻灯片公共库
    $.fn.fadesliderbase = function (options) {
        var setting = {
            item: '.swiper-slide',
            init: null,
            fnChange: null,
            fnEnd: null,
            speed: 600
        }
        options = Object.extend(options, setting);

        this.each(function (r, current) {
            var $current = $(current);
            (function ($o) {

                $o.oindex = $o.index = 0;
                var items = $o.find(options.item);
                var count = items.length;
                $o.on('prev', function (event) {
                    $o.oindex = $o.index;
                    $o.index = $o.index - 1;
                    if ($o.index == 0) $o.index = count - 1;
                    $o.trigger('trans');
                });

                $o.on('next', function (event) {
                    $o.oindex = $o.index;
                    $o.index = $o.index + 1;
                    if ($o.index > count - 1) {
                        $o.index = 0;
                    }
                    $o.trigger('trans');
                })

                $o.on('trans', function (event) {
                    items.eq($o.index).css('z-index', 10).fadeIn(options.speed);
                    if ($o.index == $o.oindex) return;
                    items.eq($o.oindex).css('z-index', 0).fadeOut();
                    options.fnChange && options.fnChange.call($o);
                })
                options.init && options.init.call($o, items);
				
				items.each(function(index,curr){
					  $(curr).css('z-index', 0).fadeIn()
					  if(index != 0){
					 	 $(curr).hide();
					  }
				})
            })($current);
        });
    }
})(jQuery);

$(function () {
    var $body = $('body');
    //渐显幻灯片
    (function ($b) {
        var $sliderBox = $('.slider-root-box', $b);
        $sliderBox.index = 0;
        var menuli = [];
        $sliderBox.fadesliderbase({
			speed:300,
            init: function (items) {
                var $this = this;
                $sliderBox.count = items.length;
                var $menu = $this.find('.slider-menu-1'), $menuUl = $menu.find('ul');
                $menuUl.width(items.length * 16);
                items.each(function (index, curr) {
                    var li = document.createElement('li');
                    if (index == 0) {
                        li.className = 'current';
                    }
                    var $a = $('<a>');
                    $a.attr('href', '###');
                    $a.on('mouseover', function () {
                        $this.oindex = $this.index;
                        $this.index = index;
                        $sliderBox.trigger('trans');
                    })
                    li.appendChild($a[0]);
                    menuli.push(li);
                    $menuUl[0].appendChild(li);
                })
                $sliderBox.on('setIndex', function (event, idx) {
                    $(menuli).each(function (index, curr) {
                        $(curr).removeClass('current');
                    })
                    idx = idx < 0 ? menuli.length - Math.abs(idx) : idx;
                    $(menuli[idx]).addClass('current');
                })

                $sliderBox.on('start', function () {
                    clearInterval($sliderBox.interval);
                    $sliderBox.interval = setInterval(function () {
                        $this.trigger('next');
                    }, 3000);
                })

                $sliderBox.on('stop', function () {
                    clearInterval($sliderBox.interval);
                });

                $sliderBox.hover(function () {
                    $sliderBox.trigger('stop');
                }, function () {
                    $sliderBox.trigger('start');
                }).trigger('start');
				
            },
            fnChange: function () {
                $sliderBox.trigger('setIndex', this.index % $sliderBox.count);
            }
        });
    })($body);

    //滑动幻灯片
    (function ($b) {
        var $sliderBox = $('.slider-box', $b);
        var menuli = [];
        $sliderBox.sliderbase({
            item: '.slide-items',
            speed: 60, //滚动速度 30 - 60
            init: function (items) {
                var $this = this;
                $sliderBox.count = items.length;
                var $menu = $this.next(), $menuUl = $menu.find('ul'), bl = $sliderBox.find('.b-l'), br = $sliderBox.find('.b-r');
                $menuUl.width(items.length * 20);

                items.each(function (index, curr) {
                    var li = document.createElement('li');
                    if (index == 0) {
                        li.className = 'current';
                    }
                    var $a = $('<a>');
                    $a.attr('href', '###');
                    $a.on('mouseover', function () {
                        $this.index = items.length - index;
                        $sliderBox.trigger('setIndex', items.length - index);
                    })
                    li.appendChild($a[0]);
                    menuli.push(li);
                    $menuUl[0].appendChild(li);
                })

                $sliderBox.on('sidx', function (event, idx) {
                    $(menuli).each(function (index, curr) {
                        $(curr).removeClass('current');
                    })

                    idx = idx > 0 ? menuli.length - idx : Math.abs(idx);

                    $(menuli[idx]).addClass('current');
                })

                $sliderBox.on('start', function () {
                    clearInterval($sliderBox.interval);
                    $sliderBox.interval = setInterval(function () { $this.trigger('next'); }, 3000);
                })

                $sliderBox.on('stop', function () { clearInterval($sliderBox.interval); });

                bl.on('click', function () {
                    $this.trigger('prev');
                })

                br.on('click', function () {
                    $this.trigger('next');
                })

                $sliderBox.hover(function () {
                    $sliderBox.trigger('stop');
                    bl.show();
                    br.show();
                }, function () {
                    $sliderBox.trigger('start');
                    bl.hide();
                    br.hide();
                }).trigger('start');


                $menu.hover(function () {
                    $sliderBox.trigger('stop');
                }, function () {
                    $sliderBox.trigger('start');
                })

            },
            fnChange: function () {
                $sliderBox.trigger('sidx', this.index % $sliderBox.count);
            }
        })
    })($body);

})
