/*模拟电话本组件*/
$(function () {
    //模拟电话本
    var $body = $('body');
    $body.on('note', function (ev, paras) {
        var setting = {
            noteTouchStart: null,
            noteTouchEnd: null,
            top:0
        }
        var options = Object.extend(paras, setting);
        var $navs = $body.find('.fixed-nav'),
        as = $navs.find('a'),
        $alert = $body.find('.alert'),
        $header = $body.find('.flex-header'),
        $headerLi = $header.find('span');
        //竖屏显示横屏隐藏
        $.rotateEnd(function (v) {
            switch (v) {
                case 'horizontal':
                    $navs.hide();
                    break;
                case "vertical":
                    $navs.show();
                    break;
            }
        })

        var rows = $('.phone-title', $body);
        var arr = [];
        for (var i = 0; i < rows.length; i++) {
            arr.push(rows[i].getAttribute('data-key'));
        }
        var $frist = rows.eq(0),
            istouch = false;

        //算高度居中
        var $rowsbox = $navs.find('.rows-box'),
            rowsA = $rowsbox.find('a');
        var height = rowsA.length * rowsA.height();
        $rowsbox.height(height);
        $navs.height(height);
        var clientHeight = document.documentElement.clientHeight < document.body.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
        //自适应右侧导航
        var $navli = $navs.find('li');
        var h = rowsA.height() * ((clientHeight / $navs.height()) * 0.8);
        $navli.height(h);
        height = rowsA.length * h;
        $navs.height(h);

        $navs[0].style.top =  clientHeight / 2 - height / 2 + 'px';

        //导航插件
        rows.navigate({
            speed: 100,
            top:options.top,
            init: function () {
                var $navigate = this;
                $navs.gesture({
                    offsetTop: clientHeight / 2 - height / 2,
                    top: 0,
                    init: function () {
                        var $gesture = this;
                        $navs.touches({
                            touchstart: function (ev) {
                                ev.preventDefault();
                                istouch = true;
                                $gesture.trigger('compareTop', ev);
                                options.noteTouchStart && options.noteTouchStart.call($gesture, ev);
                            },
                            touchmove: function (ev) {
                                $gesture.trigger('compareTop', ev);
                            },
                            touchend: function () {
                                istouch = false;
                                setTimeout(function () { $alert.hide(); }, 200);
                                options.noteTouchEnd && options.noteTouchEnd.call($gesture);
                            }
                        })
                        $frist.on('select', function (event, idx) {
                            as.removeClass('current');
                            as.eq(idx).addClass('current');
                        })

                        $navs.css('opacity', 1);
                    },
                    selectFn: function (v) {
                        var index = arr.indexOf(v);
                        if (index != -1) {
                            $navigate.trigger('to', index);
                        }
                        var $current = as.eq(index);
                        $alert.html('<span>' + v + '</span>');
                        $alert.show();
                        $frist.trigger('select', index);
                    }
                })
            },
            selectFn: function (idx) {
                /*自定义导航头*/
                var $this = this;
                var currentTOP = $(window).scrollTop();
                if (idx > 0) {
                    var k = arr[idx];
                    if (k == '#') { k = '推荐' }
                    if (rows.eq(idx + 1)[0].offsetTop - currentTOP >= 0 && rows.eq(idx + 1)[0].offsetTop - currentTOP <= 30) {
                        $header.css('top', rows.eq(idx + 1)[0].offsetTop - currentTOP - 30);
                    } else if (rows.eq(idx)[0].offsetTop - currentTOP <= 40 && rows.eq(idx)[0].offsetTop - currentTOP >= 0) {
                        $header.css('top', -(30 - (rows.eq(idx)[0].offsetTop - currentTOP)));
                    } else {
                        $header.css('top', 0);
                    }
                    //if (rows.eq(idx + 1)[0].offsetTop - currentTOP < 270) {
                    //    $headerLi.html(k);
                    //}

                    $headerLi.html(k);
                }

            },
            scrollTo: function () {
                var currentTOP = $(window).scrollTop();
                //$('.first-tags').html(currentTOP + ',' + rows.eq(2)[0].offsetTop);
                if (currentTOP >= rows.eq(1)[0].offsetTop + 30) {
                    {
                        $header.css('visibility', 'visible');
                    }
                } else {
                    $header.css('visibility', 'hidden');
                }
            }
        });
        $navs.show();

    })

})
