/*车型三级层*/
var arrMark = {},
    salesYearCount = 0;
var $body = $('body');
//折叠下划线控制
function removeborder() {
    var $smalls = this.find('.tt-small');
    $smalls.each(function (index, curr) {
        var $current = $(curr);
        setTimeout(function () {
            if (index < $smalls.length - 1) {
                if ($current.next().height() == 0) {
                    $current.css('border-bottom', '1px solid #E9E9E9');
                } else {
                    $current.css('border-bottom', '0px solid #E9E9E9');
                }
            }
        }, 300);
    })
};

function getConfig() {
    var $swipeLeft = this,
        $leftPopup = $swipeLeft.parent(),
        key = $leftPopup.attr('data-key');
    return eval('api.' + key);

};

//三级联动
$body.on('rightswipe3', function (ev, paras) {
    var setting = {
        model_hide: false, //是否隐藏车款页
        selected: false, //是否自动打开车款页
        actionNameModel: null,
        alert: null,
        back: null,
        flatFn1: function (data, paras) {
            return { list: data }
        },
        flatFn2: null,
        onBeforeScrollStart: null,
        closeEnd: function () {
            //后退回调
            $('.tone').each(function (index, curr) {
                var $curr = $(curr);
                if (!$curr.hasClass('open')) {
                    $curr.height(0);
                    $curr.prev().find('i').removeClass('up');
                } else {
                    $curr.height(parseInt($curr.attr('data-height')));
                    $curr.prev().find('i').addClass('up');
                }
            });
        },
        masterselect: function (masterid) {
            this.trigger('brandselect', masterid);
        },
        carselect: function ($click) {
            var $swipeLeft = this;
            //从新获取选中状态
            $swipeLeft.find('[data-id]').each(function (index, curr) {
                var $current = $(curr);
                $current.parent()[0].className = '';
                if ($click.attr('data-id') == $current.attr('data-id').toString()) {
                    $current.parent()[0].className = 'current';
                }
            })
        },
        selectmark: null,
        fnEnd1: null,
        fnEnd2: null
    }
    var options = Object.extend(paras, setting);
    //车型层
    $body.trigger('publicswipe1', {
        actionName: '[data-action=car]',
        alert: options.alert,
        back: options.back,
        snap: 'li,div',
        onBeforeScrollStart: options.onBeforeScrollStart,
        fliterData: function (ds, paras) {
            var $swipeLeft = this;
            var config = getConfig.call($swipeLeft);
            return config.url.replace('{0}', paras.$current.attr('data-id'));
        },
        fliterTemplate: function (templateid, paras) {
            var $swipeLeft = this;
            var config = getConfig.call($swipeLeft);
            return config.templteName;
        },
        dataCallBack: function (paras) {
            var $swipeLeft = this,
                $leftPopup = $swipeLeft.parent();
            var $brandName = $leftPopup.find('.brand-name');
            $brandName[0] && $brandName.html(paras.$current.find('.brand-name,[data-key=name]').html());
            var $brandborder = $leftPopup.find('.brand-logo-none-border'),
                $brandlogo = paras.$current.find('.brand-logo');
            $brandborder[0] && $brandlogo[0] && ($brandborder[0].className = 'brand-logo-none-border ' + $brandlogo[0].className.split(' ')[1]);

            /*绑定滚动插件*/
            $swipeLeft.iScroll({ snap: options.snap });

            var $back = $('.' + $leftPopup.attr('data-back'));
            $back.touches({ touchstart: function (ev) { ev.preventDefault(); }, touchmove: function (ev) { ev.preventDefault(); } });
            var $loading = $('.template-loading');
            var config = getConfig.call($swipeLeft);
            /*一级选中*/

            /*二级连选*/
            if (options.model_hide) {
                $swipeLeft.find('[data-id]').click(function (ev) {
                    var $click = $(this);
                    //一级选中
                    options.masterselect && options.masterselect.call($body.find('.content'), paras.$current.attr('data-id'));
                    //二级选中
                    options.carselect && options.carselect.call($swipeLeft, $click);

                    var masterid = paras.$current && paras.$current.attr('data-id') || 0,
                        carid = $click && $click.attr('data-id') || 0;
                    config.clickEnd && config.clickEnd.call($leftPopup, { masterobj: paras.$current, $carSwipeLeft: $swipeLeft, masterid: masterid, carid: carid, carobj: $click });
                })

            } else {
                /*一级车款*/
                $body.trigger('rightswipe1', { actionName: options.actionNameModel, $carSwipeLeft: $swipeLeft, $masterobj: paras.$current, masterselect: options.masterselect, carselect: options.carselect, selectmark: options.selectmark, alert: options.alert, back: options.back, flatFn: options.flatFn2, fnEnd: options.fnEnd2 });
            }
            options.fnEnd1 && options.fnEnd1.call($swipeLeft);
        },
        insertHtml: function (html) {
            this.html('<div class="tt-list absolute">' + html + '</div>');
        },
        flatFn: options.flatFn1
    })
})

//弹出层二次封装
$body.on('models', function (ev, paras) {
    //车款层
    var $swipeLeftModels;
    var $this = paras.$models;
    var selected = paras.selected || false;
    $this.rightSwipe({
        currentid: api.car.currentid,
        selected: selected,
        onBeforeScrollStart: paras.onBeforeScrollStart,
        clickCallBack: paras.clickCallBack,
        back: paras.back,
        alert: paras.alert,
        clickEnd: function (b, $current) {
            $leftPopupModels = this;
            if (b) {
                $swipeLeftModels = $leftPopupModels.find('.swipeLeft');
                $swipeLeftModels.touches({ touchmove: function (ev) { ev.preventDefault(); } });
                var $back = $('.' + $swipeLeftModels.parent().attr('data-back'))
                $back.touches({ touchstart: function (ev) { ev.preventDefault(); }, touchmove: function (ev) { ev.preventDefault(); } });
                paras.$current = $current;
                paras.fnEnd && paras.fnEnd.call($swipeLeftModels, paras);
            }
        },
        closeEnd: function () {
            paras.closeEnd && paras.closeEnd.call(this);
        }
    });
})

//车款一级弹出层
$body.on('rightswipe1', function (ev, paras) {
    var setting = {
        actionName: '[data-action=models]',
        carobj: null,
        fnEnd: null,
        loading: '.template-loading',
        $carSwipeLeft: null,
        $masterobj: null,
        masterselect: null,
        carselect: null,
        onBeforeScrollStart: null,
        alert: null,
        back: null,
        snap: 'li,div',
        fliterData: function (ds, paras) {
            var $swipeLeft = this;
            var config = getConfig.call($swipeLeft);
            return config.url.replace('{0}', paras.$current.attr('data-id'));

        },
        fliterTemplate: function (templateid, paras) {
            var $swipeLeft = this;
            var config = getConfig.call($swipeLeft);
            return config.templteName;
        },
        selectmark: function ($click) {
            //从新获取选中状态
            this.find('[data-id]').each(function (index, curr) {
                var $current = $(curr);
                $current.parent()[0].className = '';
                if ($click.attr('data-id').toString() == $current.attr('data-id').toString()) {
                    $current.parent()[0].className = 'current';
                }
            })
        },
        flatFn: function (data) {
            for (var n in data.CarList) {
                var SaleStateCount = 0;
                for (var i = 0; i < data.CarList[n].length; i++) {
                    if (data.CarList[n][i].SaleState != '停销') {
                        SaleStateCount++;
                    }
                };

                if (SaleStateCount > 0) {
                    arrMark[n.replace('s', '')] = true;
                };
            };
            return data;
        }
    }
    var options = Object.extend(paras, setting);
    var $car = $(options.actionName, $body);
    $body.trigger('publicswipe1', {
        actionName: options.actionName,
        back: options.back,
        alert: options.alert,
        onBeforeScrollStart: options.onBeforeScrollStart,
        dataCallBack: function (pms) {
            var $swipeLeft = this,
                $leftPopup = $swipeLeft.parent(),
                $back = $('.' + $leftPopup.attr('data-back'));
        },
        fliterData: options.fliterData,
        fliterTemplate: options.fliterTemplate,
        dataCallBack: function (paras) {
            salesYearCount = 0;
            paras.$masterobj = options.$masterobj;
            paras.$carSwipeLeft = options.$carSwipeLeft;
            var $swipeLeftModels = this,
            $leftPopupModels = $swipeLeftModels.parent();
            var config = getConfig.call($swipeLeftModels);
            //绑定滚动插件
            $swipeLeftModels.iScroll({ snap: options.snap });
            //获取第二层的高度值
            var heights = [];
            function toResize() {
                heights.length = 0;
                $('.tone ul').each(function (index, curr) {
                    heights[index] = $(curr).height();
                });
            }

            $(window).resize(toResize).trigger('resize');
            var $back = $('.' + $leftPopupModels.attr('data-back'));
            $leftPopupModels.find('.return').click(function (ev) {
                ev.preventDefault();
                $back.trigger('close', { leftPopup: $leftPopupModels });
            });

            $('[data-slider=pic-txt-h]').sliderBox({
                heightFn: function (index) { return heights[index]; },
                isCloseFn: function (idx, index) {
                    var isopen = !this.hasClass('open');
                    if (isopen) {
                        this.prev().find('i').removeClass('up');
                    }
                    else {
                        this.prev().find('i').addClass('up');
                    }
                    return isopen;
                },
                onlyOne: settings.sliderBox.onlyOne,
                clickEnd: function (paras) {
                    if (settings.sliderBox.onlyOne) {
                        this.parent().find('.tt-small i').removeClass('up');
                    }
                    if (paras.k == 'up') {
                        this.find('i').removeClass('up');
                    } else {
                        this.find('i').addClass('up');
                    }
                    removeborder.call($swipeLeftModels);
                }
            });

            removeborder.call($swipeLeftModels);

            $swipeLeftModels.find('[data-id]').click(function (ev) {
                var $click = $(this);
                //选中
                options.selectmark && options.selectmark.call($swipeLeftModels, $click);
                var masterid = paras.$masterobj && paras.$masterobj.attr('data-id') || 0,
                carid = paras.$current && paras.$current.attr('data-id') || 0,
                modelid = $click.attr('data-id') || 0;

                //一级选中
                options.masterselect && options.masterselect.call($body.find('.content'), masterid);
                //二级选中
                options.carselect && options.carselect.call($swipeLeftModels, $click);

                config.clickEnd && config.clickEnd.call($click, { swipeLeft: $swipeLeftModels, carSwipeLeft: paras.$carSwipeLeft, masterobj: paras.$masterobj, carobj: paras.$current, modelobj: $click, masterid: masterid, carid: carid, modelid: modelid });
            });
            options.fnEnd && options.fnEnd.call($swipeLeftModels, { swipeLeft: $swipeLeftModels, carSwipeLeft: paras.$carSwipeLeft, masterobj: paras.$masterobj, carobj: paras.$current });

        },
        insertHtml: function (html) {
            this.html('<div class="tt-list absolute">' + html + '</div>');
        },
        flatFn: options.flatFn
    });
})

//一级公共菜单
$body.on('publicswipe1', function (ev, paras) {
    var setting = {
        actionName: '[data-action=model]',
        templateid: '#modelTemplate',
        loading: '.template-loading',
        ds: '',
        fnEnd: null,
        snap: 'li',
        insertHtml: function (html) {
            this.html(html);
        },
        flatFn: null,
        onBeforeScrollStart: null, //默认滚动前事件 ev.preventDefault()
        clickCallBack: null,//右侧层默认展开回调
        back: null,
        alert: null,
        //默认回调绑定滑动层
        dataCallBack: function (pms) {
            var $swipeLeft = this,
                $leftPopup = $swipeLeft.parent(),
                $back = $('.' + $leftPopup.attr('data-back'));
            $back.touches({ touchstart: function (ev) { ev.preventDefault(); }, touchmove: function (ev) { ev.preventDefault(); } });
            var $swipeLeft = $leftPopup.find('.swipeLeft');
            $swipeLeft.touches({ touchstart: function (ev) { ev.preventDefault(); },touchmove: function (ev) { ev.preventDefault(); } });
            $swipeLeft.iScroll({ snap: options.snap });
            paras.fnEnd && paras.fnEnd.call($swipeLeft, pms);
        },
        fliterData: function (ds, paras) {
            return ds;
        },
        fliterTemplate: function (templateid, paras) {
            return templateid.toString();
        },
        closeEnd: null
    }
    var options = Object.extend(paras, setting);
    var $car = $(options.actionName, $body);
    //解析回调方法
    function dataCallBack(html, paras) {
        options.insertHtml.call(this, html);
        options.dataCallBack.call(this, paras);
    }
    $body.trigger('models', {
        back: options.back,
        alert: options.alert,
        $models: $car,
        onBeforeScrollStart: options.onBeforeScrollStart,
        clickCallBack: options.clickCallBack,
        closeEnd: function () {
            var $swipeLeft = this;
            var $loading = $(options.loading);
            $swipeLeft.empty().append($loading.clone().children(0));
            options.closeEnd && options.closeEnd.call($swipeLeft);
        },
        fnEnd: function (paras) {
            var $this = this;
            if (typeof options.ds == 'string') {
                $this.swipeApi({
                    url: options.fliterData.call($this, options.ds, paras),
                    templateid: options.fliterTemplate.call($this, options.templateid, paras),
                    flatFn: options.flatFn,
                    callback: function (html) {
                        dataCallBack.call($this, html, paras);
                    },
                    paras: paras
                })
            } else {
                $this.swipeData({
                    data: options.fliterData.call($this, options.ds, paras),
                    templateid: options.fliterTemplate.call($this, options.templateid, paras),
                    flatFn: options.flatFn,
                    callback: function (html) {
                        dataCallBack.call($this, html, paras);
                    },
                    paras: paras
                })
            }
        }
    });
})


//下按钮菜单
$body.on('publicswipe2', function (ev, paras) {
    var setting = {
        actionName: '[data-action=model]',
        templateid: '#modelTemplate',
        loading: '.template-loading',
        ds: '',
        fnEnd: null,
        back: null,
        swipeLeftChildren: '.y2015-car-02',
        closeEnd: null,
        snap: 'li'
    }
    var options = Object.extend(paras, setting);
    //回调绑定滑动层
    options.dataCallBack = function (pms) {
        var $swipeLeft = this,
          $leftPopup = $swipeLeft.parent();
        var $back = $('.' + $leftPopup.attr('data-back'))
        $back.touches({ touchstart: function (ev) { ev.preventDefault(); }, touchmove: function (ev) { ev.preventDefault(); } });
        var $swipeLeft = $leftPopup.find('.swipeLeft');
        $swipeLeft.touches({ touchmove: function (ev) { ev.preventDefault(); } });
        var $y2015 = $swipeLeft.find(options.swipeLeftChildren);
        var $cbox = $y2015.children(0);
        $cbox.height(document.documentElement.clientHeight - 50);
        $cbox.iScroll({ snap: options.snap });
        $swipeLeft.find('.swipeLeft-header').show();
        paras.fnEnd && paras.fnEnd.call($swipeLeft, pms);
    }
    $body.trigger('publicswipe1', options);

})


//公共二级连选
$body.on('publicselect2', function (ev, paras) {
    var setting = {
        controlName1: 'publicswipe1',
        controlName2: 'publicswipe1',
        actionName1: '[data-action=model1]',
        actionName2: '[data-action=model2]',
        templateid1: '',
        templateid2: '',
        loading: '.template-loading',
        ds1: '',
        ds2: '',
        fnEnd1: null,
        fnEnd2: null,
        flatFn1: null,
        flatFn2: null,
        fliterTemplate: function (templateid, f) {
            return f.$current.attr('data-tempate');
        },
        fliterData1:function(ds, f){
        	
        	var data = [];
            for (var n in ds) {
            	
                if (n.toString() == f.$current.attr('data-id').toString()) {
                    data = ds[n];
                }
            }
            return data;
        },
        fliterData2: function (ds, f) {
            var data = [];
            for (var n in ds) {
                if (n.toString() == f.$current.attr('data-id').toString()) {
                    data = ds[n];
                }
            }
            return data;
        }
    }
    var options = Object.extend(paras, setting);
    $body.trigger(options.controlName1, {
        actionName: options.actionName1,
        templateid: options.templateid1,
        loading: options.loading,
        ds: options.ds1,
        fliterData:options.fliterData1,
        flatFn: options.flatFn1,
        fnEnd: function (pms1) {
            var $swipeLeft = this;
            $body.trigger(options.controlName2, {
                actionName: options.actionName2,
                templateid: options.templateid2,
                loading: options.loading,
                ds: options.ds2,
                fliterTemplate: options.fliterTemplate,
                fliterData: options.fliterData2,
                fnEnd: options.fnEnd2,
                flatFn: options.flatFn2,
            });
            options.fnEnd1 && options.fnEnd1.call($swipeLeft, pms1);
        }
    });
})

//公共三级连选
$body.on('publicselect3', function (ev, paras) {
    var setting = {
        controlName1: 'publicswipe1',
        controlName2: 'publicswipe1',
        controlName3: 'publicswipe1',
        actionName1: '[data-action=model1]',
        actionName2: '[data-action=model2]',
        actionName3: '[data-action=model3]',
        templateid1: '',
        templateid2: '',
        templateid3: '',
        loading: '.template-loading',
        ds1: '',
        ds2: '',
        ds3: '',
        fnEnd1: null,
        fnEnd2: null,
        fnEnd3: null,
        flatFn1: null,
        flatFn2: null,
        flatFn3: null,
        fliterTemplate: function (templateid, f) {
            return f.$current.attr('data-tempate');
        },
        fliterData: function (ds, f) {
            var data = [];
            for (var n in ds) {
                if (n.toString() == f.$current.attr('data-id').toString()) {
                    data = ds[n];
                }
            }
            return data;
        },
        fliterTemplate1: function (templateid, f) {
            return f.$current.attr('data-tempate');
        },
        fliterData1: function (ds, f) {
            var data = [];
            for (var n in ds) {
                if (n.toString() == f.$current.attr('data-id').toString()) {
                    data = ds[n];
                }
            }
            return data;
        }
    }
    var options = Object.extend(paras, setting);
    $body.trigger(options.controlName1, {
        actionName: options.actionName1,
        templateid: options.templateid1,
        loading: options.loading,
        ds: options.ds1,
        flatFn: options.flatFn1,
        fnEnd: function (pms1) {
            var $swipeLeft = this;
            $body.trigger(options.controlName2, {
                actionName: options.actionName2,
                templateid: options.templateid2,
                loading: options.loading,
                ds: options.ds2,
                fliterTemplate: options.fliterTemplate,
                fliterData: options.fliterData,
                flatFn: options.flatFn2,
                fnEnd: function (pms2) {
                    var $swipeLeft2 = this;
                    $body.trigger(options.controlName3, {
                        actionName: options.actionName3,
                        templateid: options.templateid3,
                        loading: options.loading,
                        ds: options.ds3,
                        fliterTemplate: options.fliterTemplate1,
                        fliterData: options.fliterData1,
                        flatFn: options.flatFn3,
                        fnEnd: options.fnEnd3
                    });
                    options.fnEnd2 && options.fnEnd2.call($swipeLeft2, pms2);
                }
            });
            options.fnEnd1 && options.fnEnd1.call($swipeLeft, pms1);
        }
    });
})

//不注册事件弹出层
$body.on('fristSwipeOneNb', function (ev, options) {
    var setting = {
        fnEnd: null,
        $click: null,
        $swipe: null,
        snap: 'li',
        setIsCroll: function () {
            var $swipeLeft = this,
               $leftPopup = $swipeLeft.parent(),
               $back = $('.' + $leftPopup.attr('data-back'));
            $back.touches({ touchstart: function (ev) { ev.preventDefault(); }, touchmove: function (ev) { ev.preventDefault(); } });
            $swipeLeft.touches({ touchmove: function (ev) { ev.preventDefault(); } });
            $swipeLeft.iScroll({ snap: options.snap });
        }
    }
    options = Object.extend(options, setting);
    options.clickEnd = function () {
        var $leftPopup = this;
        options.setIsCroll && options.setIsCroll.call($leftPopup.find('.swipeLeft'))
        options.fnEnd && options.fnEnd.call($leftPopup);
    }
    options.$swipe.rightSwipe(options, options.$click);
})

//不注册事件弹出层（带导航按钮）
$body.on('fristSwipeOne', function (ev, options) {
    var setting = {
        fnEnd: null,
        $click: null,
        $swipe: null,
        swipeLeftChildren: '.y2015-car-02',
        snap: 'li',
        setIsCroll: function () {
            var $swipeLeft = this,
            $leftPopup = $swipeLeft.parent();
            var $back = $('.' + $leftPopup.attr('data-back'))
            $back.touches({ touchstart: function (ev) { ev.preventDefault(); }, touchmove: function (ev) { ev.preventDefault(); } });
            var $swipeLeft = $leftPopup.find('.swipeLeft');
            $swipeLeft.touches({ touchmove: function (ev) { ev.preventDefault(); } });
            var $y2015 = $swipeLeft.find(options.swipeLeftChildren);
            var $cbox = $y2015.children(0);
            $cbox.height(document.documentElement.clientHeight - 50);

            $cbox.iScroll({ snap: options.snap });

            $swipeLeft.find('.swipeLeft-header').show();
        }
    }
    options = Object.extend(options, setting);
    options.clickEnd = function () {
        var $leftPopup = this;
        options.setIsCroll && options.setIsCroll.call($leftPopup.find('.swipeLeft'))
        options.fnEnd && options.fnEnd.call($leftPopup);
    }
    options.$swipe.rightSwipe(options, options.$click);
})