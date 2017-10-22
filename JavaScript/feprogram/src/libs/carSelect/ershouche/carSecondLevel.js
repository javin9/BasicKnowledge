var carThirdLevel = require('./carThirdLevel')
var template = require('libs/template')
var IScroll = require('iscroll')
var carFirstLevel;
window.APIURL = window.APIURL || "http://api.chedai.bitauto.com/";
var windowHeight = $(window).height();
var $carSelectSecondLevel;
var $header;
var $wrapper;
var $tipsLetter;
var $letterList;
var $searchArea;
var $allBrand;
var $allBrand_1;
var $allBrand_2;

function CarSelectSecondLevel(option, carObj, callback) {
    this.carObj = carObj;
    this.callback = callback;
    this.imgDisplayStatus = "";
    this.priceDisplayStatus = "none";
    this.defaults = {
        onlyOnSale: true,
        showLevel: 3,
        showAllBrand: false,
        hide: false,
        //是否显示车系图片
        showSerialImg: true,
        CityId: null,
        secondInterfaceUrl: "",
        secondDataType: null,
        levelOrder: 'positive'//弹层排序参数正序positive 倒序reverse
    }
    if (option != null) {
        $.extend(this.defaults, option);
    }
    if (!this.defaults.showSerialImg) {
        this.imgDisplayStatus = "none";
    }
    if (this.defaults.levelOrder == "reverse") {
        carFirstLevel = require('./index');
    }
    this.carSelectSecondLevelScroller;
}

CarSelectSecondLevel.prototype.templateHtml = function (brandCar) {
    var source = `<div id="carSelectSecondLevel" class="defaultAni">
                   <div class="relative-position">
                      <header class="carSelectSecondLevel-header">
                        <span class="carSelectSecondLevel-close"></span>
                        <div class="carSelectSecondLevel-title font-size-34">${brandCar.name}</div>
                       </header>
                           <div class="wrapper loading_gray">
                               <div class="scroller">
                               </div>
                           </div>
                       </div>
                   </div>
               </div>`
    return source;
}

CarSelectSecondLevel.prototype.ajaxTemplateHtml = function () {
    var self = this;
    var source =
        '                    <article class="carSelectSecondLevel-article">' +
        '                        <div id="allBrand_1" class="ershoucheSecondLevel-carlist-title wlx padding-left-30 padding-right-30">*</div>' +
        '                        <section id="allBrand_2" class="ershoucheSecondLevel-allBrand  padding-left-30 padding-right-30">不限车系</section>' +
        '                        {{each allCar as carlist m}}' +
        '                        <section class="carSelectSecondLevel-carlist">' +
        '                            <div class="ershoucheSecondLevel-carlist-title padding-left-30 padding-right-30">' +
        '                                {{carlist.CategoryName}}' +
        '                            </div>' +
        '                            {{each carlist.CategoryCollection as collection n}}' +
        '                            <div class="ershoucheSecondLevel-carlist-detail padding-left-30 padding-right-30"' +
        '                                 data-firstIndex={{m}}' +
        '                                 data-secondIndex={{n}}>' +
        '                                <div class="carSelectSecondLevel-carlist-detail-img margin-right-24" style="display:' + self.imgDisplayStatus + '"><div><img src={{collection.ImgUrl}}></div></div>' +
        '                                <div class="carSelectSecondLevel-carlist-detail-text ">' +
        '                                    <div class="carSelectSecondLevel-carlist-detail-text-cetenr">' +
        '                                        <div class="ershoucheSecondLevel-carlist-detail-name ">{{collection.Name}}</div>' +
        '                                        <div style="display:' + self.priceDisplayStatus + '" class="carSelectSecondLevel-carlist-detail-price  margin-top-30">{{collection.Price}}</div>' +
        '                                    </div>' +
        '                                </div>' +
        '                                <div class="clear"></div>' +
        '                            </div>' +
        '                            {{/each}}' +
        '                        </section>' +
        '                        {{/each}}' +
        '                    </article>';

    return source;
}

CarSelectSecondLevel.prototype.init = function () {
    var self = this;
    var _data = {}, _url = "";
    _data.masterBrandId = self.carObj.masterBrand.id;
    if (!self.defaults.onlyOnSale) {
        _data.onlyOnSale = 'false';
    }
    if (!self.defaults.secondInterfaceUrl) {
        _url = APIURL + 'api/Common/GetCarSerialListWithBrand?callback=?'
    } else {
        _url = self.defaults.secondInterfaceUrl;
    }
    //请求远程汽车列表接口
    setTimeout(function () {
        $.ajax({
            url: _url,
            data: _data,
            dataType: self.defaults.secondDataType || "jsonp",
            success: function (data) {
                if (data.Result) {
                    CarSelectSecondLevel.data = $.extend({ allCar: data.Data }, { brandCar: self.carObj.masterBrand });
                    //操作DOM
                    self.domOpration();
                    //渲染页面
                    self.render();
                    // }
                } else {
                    console.log("请求失败");
                }
            },
            complete: function () {
            }
        });
    }, 100)
}

CarSelectSecondLevel.prototype.render = function () {
    var self = this;
    //渲染页面
    var render = template.compile(self.ajaxTemplateHtml());
    var html = render(CarSelectSecondLevel.data);
    $('#carSelectSecondLevel .wrapper').removeClass('loading_gray');
    self.carSelectSecondLevelScroller.html(html);
    //滚动条
    var myScroll = new IScroll('#carSelectSecondLevel .wrapper', {
        scrollbars: true,
        shrinkScrollbars: 'scale',
        fadeScrollbars: true,
        click: true
    });
    //是否显示全部车型
    $allBrand_1 = $('#carSelectSecondLevel #allBrand_1');
    $allBrand_2 = $('#carSelectSecondLevel #allBrand_2');
    if (self.defaults.showAllBrand) {
        $allBrand_1.show();
        $allBrand_2.show();
        $allBrand_2.click(function (e) {
            selectAnimate("hide");
            $('#carSelectComponent').removeClass('drawAni').addClass('hideAni');
            goBack(self.carObj);
        });
    } else {
        $allBrand_1.hide();
        $allBrand_2.hide();
    }

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
    myScroll.refresh();
}

CarSelectSecondLevel.prototype.domOpration = function () {
    var self = this;
    $('body').append(self.templateHtml(CarSelectSecondLevel.data.brandCar));
    self.carSelectSecondLevelScroller = $('#carSelectSecondLevel .scroller');
    $carSelectSecondLevel = $("#carSelectSecondLevel");
    $carSelectSecondLevel.css({
        'width': '10rem',
        'height': '100%',
    });
    $header = $carSelectSecondLevel.find('.carSelectSecondLevel-header');
    $wrapper = $carSelectSecondLevel.find('.wrapper');
    $wrapper.css({
        height: (windowHeight > $(window).height()) ? windowHeight : $(window).height() - $header.height()
    });
    //动画显示
    selectAnimate("show");

    //关闭按钮
    $carSelectSecondLevel.find('.carSelectSecondLevel-close').click(function (e) {
        goBack_backBtn();
    });

    //列表选择
    $carSelectSecondLevel.on('click', '.ershoucheSecondLevel-carlist-detail', function (e) {
        //进入三级
        var $currentTarget = $(e.currentTarget);
        var obj = CarSelectSecondLevel.data.allCar[$currentTarget.attr("data-firstIndex")].CategoryCollection[$currentTarget.attr("data-secondIndex")];
        var carObj = {
            id: obj.Id,
            name: obj.Name,
            imgUrl: obj.ImgUrl,
            brandLogo: self.carObj.masterBrand.logo,
            price: obj.Price,
            spell: obj.Spell,
            otherData: obj.OtherData
        };
        secondLevelSelect(carObj);
    });

    function secondLevelSelect(carObj) {
        if (self.defaults.levelOrder == "reverse") {
            if (self.defaults.showLevel == 2) {
                goBack({ masterBrand: self.carObj.masterBrand, brand: carObj });
            } else if (self.defaults.showLevel == 3) {
                carThirdLevel.carThirdLevel(self.defaults, {
                    masterBrand: self.carObj.masterBrand,
                    brand: carObj
                }, window.carSelectThirdLevelCallback);
            }
        } else {
            if (self.defaults.showLevel == 2) {
                $carSelectSecondLevel.remove();
                $('#carSelectComponent').removeClass('drawAni').addClass('hideAni');
                goBack({ masterBrand: self.carObj.masterBrand, brand: carObj });
            } else if (self.defaults.showLevel == 3) {
                carThirdLevel.carThirdLevel(self.defaults, {
                    masterBrand: self.carObj.masterBrand,
                    brand: carObj
                }, function (result) {
                    goBack(result);
                });
            }
        }
    }

    function goBack(result) {
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
    function goBack_backBtn() {

        if (self.defaults.levelOrder == 'positive') {
            setTimeout(function () {
                history.back();
            }, 100);
        } else if (self.defaults.levelOrder == 'reverse') {
            history.replaceState(null, '', location.pathname + location.search);
            selectAnimate("hide");
            carFirstLevel.carSelect(self.defaults, function (result) {
            });
        }
    }

    //监听hash变化
    $(window).on('hashchange', function (e) {
        if (e.newURL + "#hideSencond" == e.oldURL) {
            selectAnimate("hide");
        }
    });
}

//显示动画
var selectAnimate = function (state) {
    var $carSelectSecondLevel = $('#carSelectSecondLevel');
    if (state == "show") {
        $carSelectSecondLevel.addClass('drawAni');
    } else {
        $carSelectSecondLevel.removeClass('drawAni');
        setTimeout(function () {
            $carSelectSecondLevel.remove();
        }, 300)
    }
}

//供外部调用的接口
var carSecondLevel = function (option, carObj, callback) {
    if (typeof callback === 'function') {
        if ($('#carSelectSecondLevel').length == 0) {
            var second = new CarSelectSecondLevel(option, carObj, callback);
            second.init();
        }
    }
    else {
        console.log("错误：该函数只接受回调方法！");
    }
    //添加hash
    if (window.location.href.search('#hideSencond') == -1) {
        window.location.href = window.location.href + "#hideSencond";
    }
}

module.exports = {
    carSecondLevel: carSecondLevel
}
