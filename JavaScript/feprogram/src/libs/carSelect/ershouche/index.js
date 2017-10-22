import 'libs/carSelect/ershouche/index.scss';
import template from 'libs/template'
import carSearch from 'libs/carSelect/carSearch';
import carSecondLevel from './carSecondLevel';
import IScroll from 'iscroll';

window.APIURL = window.APIURL || "http://api.chedai.bitauto.com/";
var mySelScroll = null;
var selCarNum = 1, selCarClear = "", selCarNum2 = 1, selCarClear2 = "", windowHeight = $(window).height();
var $carSelect;
var $header;
var $wrapper;
var $tipsLetter;
var $letterList;
var $searchArea;
var $allBrand;
function CarSelect(option, callback) {
    this.callback = callback;
    this.defaults = {
        type: "xinche",
        onlyOnSale: true,
        showLevel: 3,
        showSearch: true,
        showAllBrand: false,
        //是否显示车系图片
        showSerialImg: true,
        hide: false,
        CityId: null,
        secondInterfaceUrl: '',
        thirdInterfaceUrl: '',
        secondDataType: null,
        thirdDataType: null,
        levelOrder: 'positive'//弹层排序参数正序positive 倒序reverse
    }
    if (option != null) {
        $.extend(this.defaults, option);
    }
    this.renderSuc = false;
    this.myScroll = null;
}

CarSelect.prototype.ajaxTemplateHtml = function () {
    var source = '<article class="carSelect-content">' +
        '                        <section class="ershouche-recommendBrand">' +
        '                            <div letter="热" class="ershouche-hotBrand padding-left-30 padding-right-30">' +
        '                                热门品牌' +
        '                            </div>' +
        '                            <div class="carSelect-recommendBrand-content padding-right-30">' +
        '                                {{each hostCar as hostlist m}}' +
        '                                <div class="carSelect-recommendBrand-car margin-top-40" data-firstIndex={{m}}>' +
        '                                    <div class="ershouche-recommendBrand-img"><img src={{hostlist.Logo}}></div>' +
        '                                    <div class="ershouche-recommendBrand-name">' +
        '                                        {{hostlist.bs_Name}}' +
        '                                    </div>' +
        '                                </div>' +
        '                                {{/each}}' +
        '                                <div class="clear"></div>' +
        '                            </div>' +
        '                            <div class="clear"></div>' +
        '                        </section>' +
        '                        <section class="carSelect-allCar">' +
        '                            <div class="carSelect-allCar-title padding-left-30 padding-right-30">所有品牌</div>' +
        '                            <ul class="carSelect-allCar-ul">' +
        '                                <li class="ershouche-allCar-li-letter wlx padding-left-30 padding-right-30"' +
        '                                    letter="*">' +
        '                                    *' +
        '                                </li>' +
        '                                <li class="ershouche-allCar-li-car allBrand padding-left-30 padding-right-30"' +
        '                                   >' +
        '                                    <div   class="carSelect-allCar-bx allBrand"> 不限品牌</div>' +
        '                                </li>' +
        '                                {{each allCar as carlist i}}' +
        '                                <li class="ershouche-allCar-li-letter padding-left-30 padding-right-30"' +
        '                                    letter={{carlist.CategoryName}}>' +
        '                                    {{carlist.CategoryName}}' +
        '                                </li>' +
        '                                {{each carlist.CategoryCollection as collection j}}' +
        '                                <li class="ershouche-allCar-li-car padding-left-30 padding-right-30"' +
        '                                    data-firstIndex={{i}} data-secondIndex={{j}}>' +
        '                                    <div class="ershouche-allCar-img"><img src={{collection.ImgUrl}}></div>' +
        '                                    <div class="ershouche-allCar-name"> {{collection.Name}}</div>' +
        '                                </li>' +
        '                                {{/each}}' +
        '                                {{/each}}' +
        '                            </ul>' +
        '                            <div class="clear"></div>' +
        '                        </section>' +
        '                    </article>';

    return source;
}

CarSelect.prototype.templateHtml = function () {
    var source = '<div id="carSelectComponent" class="defaultAni">' +
        '        <div class="relative-position">' +
        '            <header class="carSelect-header">' +
        '                <span class="carSelect-close"></span>' +
        '  <div class="carSelectSecondLevel-title font-size-34">品牌</div>'+
        '            </header>' +
        '            <div class="wrapper">' +
        '                <div class="scroller">' +
        '                </div>' +
        '            </div>' +
        '            <!--首字母导航-->' +
        '            <section class="ershouche-letterList">' +
        '                <div id="letter_re">热</div>' +
        '                <div>*</div>' +
        '                <div>A</div>' +
        '                <div>B</div>' +
        '                <div>C</div>' +
        '                <div>D</div>' +
        '                <div>F</div>' +
        '                <div>G</div>' +
        '                <div>H</div>' +
        '                <div>J</div>' +
        '                <div>K</div>' +
        '                <div>L</div>' +
        '                <div>M</div>' +
        '                <div>N</div>' +
        '                <div>O</div>' +
        '                <div>P</div>' +
        '                <div>Q</div>' +
        '                <div>R</div>' +
        '                <div>S</div>' +
        '                <div>T</div>' +
        '                <div>W</div>' +
        '                <div>X</div>' +
        '                <div>Y</div>' +
        '                <div>Z</div>' +
        '            </section>' +
        '            <!--滑动时提示字母-->' +
        '            <div class="ershouche_tipsLetter"></div>' +
        '        </div>' +
        '    </div>';
    return source;
}

CarSelect.prototype.init = function () {
    var self = this;

    //操作DOM
    self.domOpration();

    var getAllCar = function () {
        //请求远程汽车列表接口
        $.ajaxJSONP({
            url: APIURL + 'api/Common/GetCarMasterBrandListWithFirstLetter?callback=?',
            data: { onlyOnSale: self.defaults.onlyOnSale },
            success: function (data) {
                if (data.Result) {
                    $.extend(CarSelect.data, { allCar: data.Data });
                    //渲染页面
                    self.renderSuc = true;
                    self.render();
                } else {
                    console.log("请求失败");
                }
            },
            complete: function () {
            }
        });
    }
    $.get(ershoucheUrl + 'Interface/GetHotBrandListByCity?cityid=' + cityInfo.id, function (data) {
        if (data != null) {
            CarSelect.data = { hostCar: data.Data };
            getAllCar();
        } else {
            console.log("请求失败");
        }
    })
}

CarSelect.prototype.render = function () {
    var self = this;
    //渲染页面
    var render = template.compile(self.ajaxTemplateHtml());
    var html = render(CarSelect.data);
    $('#carSelectComponent .scroller').html(html);
    $allBrand = $('.allBrand');
    if (self.defaults.showAllBrand) {
        $allBrand.show();
        $allBrand.click(function (e) {
            goBack({ allBrand: "firstAllBrand" });
        });
    } else {
        $allBrand.hide();
    }
    self.myScroll.refresh();
    $wrapper.removeClass("loading_gray");
    $letterList.show();

    function goBack(result) {
        if (self.defaults.levelOrder == "reverse") {
            if (self.defaults.hide) {
                setTimeout(function () {
                    window.carSelectThirdLevelCallback(result);
                    history.back();
                }, 100);
            }
            else {
                window.carSelectThirdLevelCallback(result);
            }
        } else {
            if (self.defaults.hide) {
                setTimeout(function () {
                    self.callback(result);
                    history.back();
                }, 100);
            }
            else {
                self.callback(result);
            }
        }
    }
}

CarSelect.prototype.domOpration = function () {
    var self = this;
    if ($("#carSelectComponent").length > 0 && self.renderSuc) {
        return;
    }
    $('body').append(self.templateHtml());
    $carSelect = $("#carSelectComponent");
    $carSelect.css({
        'width': '10rem',
        'height': '100%',
    });
    $header = $carSelect.find('.carSelect-header');
    $wrapper = $carSelect.find('.wrapper');
    $wrapper.height((windowHeight > $(window).height()) ? windowHeight : $(window).height() - $header.height());
    $wrapper.addClass("loading_gray");
    //滚动条
    mySelScroll = self.myScroll = new IScroll('#carSelectComponent .wrapper', {
        scrollbars: true,
        shrinkScrollbars: 'scale',
        fadeScrollbars: true,
        click: true,
    });

    $(window).off("resize").on("resize", function () {
        $carSelect.height($(window).height());
        $wrapper.height($(window).height() - $header.height());
    })

    //动画显示
    selectAnimate("show");

    //字母提示框
    $tipsLetter = $carSelect.find('.ershouche_tipsLetter');
    //字母列表操作
    $letterList = $carSelect.find('.ershouche-letterList');
    $letterList.height($wrapper.height() - 5);
    $letterList.css({ "top": $header.height() + 5, "right": "0px" });

    //将所有字母元素保存到数组中
    var letterArr = $letterList.find('div');
    //触摸事件处理
    $letterList.on("touchstart", function (e) {
        e.preventDefault();
        $tipsLetter.text($(e.target).text());
        $tipsLetter.show();
        self.myScroll.scrollToElement('[letter="' + $(e.target).text() + '"]', 100);
    });
    $letterList.on("touchmove", function (e) {
        e.preventDefault();
        var touch = e.targetTouches[0];
        var position = touch.clientY - $header.height();
        var index = parseInt(position / ($(letterArr[0]).height()));
        if (index < 0) {
            index = 0;
        } else if (index > letterArr.length - 1) {
            index = letterArr.length - 1;
        }
        $tipsLetter.text($(letterArr[index]).text());
        //console.log($(letterArr[index]).text());
        self.myScroll.scrollToElement('[letter="' + $(letterArr[index]).text() + '"]', 100);
    });
    $letterList.on("touchend", function (e) {
        e.preventDefault();
        //console.log($(e.target));
        $tipsLetter.hide();
    });
    //关闭按钮
    $carSelect.find('.carSelect-close').click(function (e) {
        goBack_backBtn();
    });
    //搜索框点击
    $searchArea = $carSelect.find('.carSelect-search-content');
    if (self.defaults.showSearch) {
        $searchArea.addClass('carSelect-search-content-show');
        $searchArea.click(function () {
            carSearch.search(self.defaults, function (result) {
                goBack(result);
            });
        });
    } else {
        $searchArea.addClass('carSelect-search-content-hide');
        $searchArea.html("选择品牌");
    }
    //热门车型选择
    $carSelect.on('click', '.carSelect-recommendBrand-car', function (e) {
        var $currentTarget = $(e.currentTarget);
        var obj = CarSelect.data.hostCar[$currentTarget.attr("data-firstIndex")];
        var carObj = { id: obj.bs_Id, name: obj.bs_Name, logo: obj.Logo };
        firstLevelSelect(carObj);
    });
    //列表车型选择
    $carSelect.on('click', '.ershouche-allCar-li-car', function (e) {
        if (!$(this).hasClass('allBrand')) {
            var $currentTarget = $(e.currentTarget);
            var obj = CarSelect.data.allCar[$currentTarget.attr("data-firstIndex")].CategoryCollection[$currentTarget.attr("data-secondIndex")];
            var carObj = { id: obj.Id, name: obj.Name, logo: obj.ImgUrl };
            firstLevelSelect(carObj);
        } else {
            goBack({ allBrand: "firstAllBrand" });
            $('#carSelectComponent').removeClass('drawAni').addClass('hideAni');
        }
    });

    function firstLevelSelect(carObj) {
        if (self.defaults.showLevel == 1) {
            goBack({ masterBrand: carObj });
        } else {
            carSecondLevel.carSecondLevel(self.defaults, { masterBrand: carObj }, function (result) {
                goBack(result);
            });
        }
    }

    function goBack(result) {
        if (self.defaults.hide) {
            setTimeout(function () {
                self.callback(result);
                $('#carSelectComponent').removeClass('drawAni').addClass('hideAni');
                history.back();
            }, 100);
        }
        else {
            self.callback(result);
        }
    }

    function goBack_backBtn() {
        setTimeout(function () {
            history.back();
            $('#carSelectComponent').removeClass('drawAni').addClass('hideAni');
        }, 100);
    }

    //监听hash变化
    $(window).off('hashchange').on('hashchange', function (e) {
        if (e.newURL + "#hide" == e.oldURL) {
            selectAnimate("hide");
        }
    });
}

//显示动画
var selectAnimate = function (state) {
    var $carSelectComponent = $('#carSelectComponent');
    if (state == "show") {
        $carSelectComponent.removeClass('hideAni').addClass('drawAni');
    } else {
        $carSelectComponent.removeClass('drawAni').addClass('hideAni');
    }
}

//供外部调用的接口
var carSelect = function (option, callback) {
    if (typeof callback === 'function') {
        if ($("#carSelectComponent").length == 0) {
            var carSelect = new CarSelect(option, callback);
            carSelect.init();
        }
    }
    else {
        console.log("错误：该函数只接受回调方法！");
    }
    //添加hash
    if (window.location.href.search("#hide") == -1) {
        window.location.href = window.location.href + "#hide";
        if ($("#carSelectComponent").length > 0) {
            selectAnimate("show");
        }
    } else if ($("#carSelectComponent").hasClass('defaultAni') && $("#carSelectComponent").length > 0) {
        selectAnimate("show");
    }
}

module.exports = {
    carSelect: carSelect
};
