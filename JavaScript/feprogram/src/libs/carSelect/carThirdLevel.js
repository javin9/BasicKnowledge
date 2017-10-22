require('./index.scss');

var template = require('libs/template')
var IScroll = require('iscroll')
var carSecondLevel;
window.APIURL = window.APIURL || "http://api.chedai.bitauto.com/";

var $carSelectThirdLevel;
var $header;
var $wrapper;
var $tipsLetter;
var $letterList;
var $searchArea;
var $allBrand;
var $allBrand_1;
var $allBrand_2;
window.carSelectThirdLevelCallback;
function CarSelectThirdLevel(option, carObj, callback) {
    // console.log('CarSelectThirdLevel-option', option);
    // console.log('CarSelectThirdLevel-carObj', carObj);
    this.carObj = carObj;
    this.callback = callback;
    window.carSelectThirdLevelCallback=callback;
    this.defaults = {
        onlyOnSale: true,
        showLevel: 3,
        hide: false,
        CityId: null,
        thirdInterfaceUrl: '',
        thirdDataType: null,
        levelOrder: 'positive'//弹层排序参数正序positive 倒序reverse
    }
    if (option != null) {
        $.extend(this.defaults, option);
    }
    if (this.defaults.levelOrder == "reverse") {
        carSecondLevel = require('./carSecondLevel');
    }
    this.carSelectThirdLevelScroller;
}
CarSelectThirdLevel.prototype.templateHtml = function () {
    var source = '<div id="carSelectThirdLevel">' +
        '           <div class="relative-position">' +
        '               <div class="carSelectThirdLevel-background"></div>' +
        '               <div class="carSelectThirdLevel-close-btn font-size-32">点<br/>击<br/>收<br/>起</div>' +
        '               <div class="carSelectThirdLevel-content defaultAni">' +
        '                   <header class="carSelectThirdLevel-header">' +
        '                       <span class="carSelectThirdLevel-close"></span>' +
        '                       <div class="carSelectThirdLevel-title font-size-26">选择车款</div>' +
        '                   </header>' +
        '                   <div class="wrapper loading_gray">' +
        '                       <div class="scroller">' +
        '                       </div>' +
        '                   </div>' +
        '               </div>' +
        '           </div>' +
        '       </div>';
    return source;
}

CarSelectThirdLevel.prototype.ajaxTemplateHtml = function () {

    var source = '<article class="carSelectThirdLevel-article">' +
        '                            <section class="carSelectThirdLevel-brand padding-right-30 padding-left-30">' +
        '                                <div class="carSelectThirdLevel-brand-img"><img src={{brandCar.brandLogo||brandCar.logo}}></div>' +
        '                                <div class="carSelectThirdLevel-brand-text margin-left-24 font-size-30">{{brandCar.name}}</div>' +
        '                            </section>' +
        '                            {{each allCar as carlist m}}' +
        '                            <section class="carSelectThirdLevel-carlist">' +
        '                                <div class="carSelectThirdLevel-carlist-title font-size-26 padding-right-30 padding-left-30">{{carlist.CategoryName}}</div>' +
        '                                {{each carlist.CategoryCollection as collection n}}' +
        '                                <div class="carSelectThirdLevel-carlist-detail padding-right-30 padding-left-30" data-year={{carlist.CategoryName}} data-firstIndex={{m}}' +
        '                                     data-secondIndex={{n}}>' +
        '                                    <!--<div class="carSelectThirdLevel-carlist-detail-img"><img src="src/img/m_75_55.png">' +
        '                                    </div>-->' +
        '                                    <div class="carSelectThirdLevel-carlist-detail-text">' +
        '                                        <div class="carSelectThirdLevel-carlist-detail-text-cetenr">' +
        '                                            <div class="carSelectThirdLevel-carlist-detail-name font-size-28">{{collection.Name}}</div>' +
        '                                            <div class="carSelectThirdLevel-carlist-detail-price font-size-24 margin-top-30">{{collection.Price}}万</div>' +
        '                                        </div>' +
        '                                    </div>' +
        '                                    <div class="clear"></div>' +
        '                                </div>' +
        '                                {{/each}}' +
        '                            </section>' +
        '                            {{/each}}' +
        '                        </article>';

    return source;
}

CarSelectThirdLevel.prototype.init = function () {
    var self = this;
    var dataObj = null,
        _url = "";
    if (self.defaults.CityId) {
        dataObj = { serialId: self.carObj.brand.id, cityId: self.defaults.CityId, onlyOnSale: self.defaults.onlyOnSale };
    } else {
        dataObj = { serialId: self.carObj.brand.id, onlyOnSale: self.defaults.onlyOnSale };
    }

    if (!self.defaults.thirdInterfaceUrl) {
        _url = APIURL + 'api/Common/GetCarListWithPrice?callback=?'
    } else {
        _url = self.defaults.thirdInterfaceUrl;
    }

    //操作DOM
    this.domOpration();

    //请求远程汽车列表接口
    $.ajax({
        url: _url,
        data: dataObj,
        dataType: self.defaults.thirdDataType || "jsonp",
        success: function (data) {
            if (data.Result) {
                // if ($("#carSelectThirdLevel").length == 0) {
                CarSelectThirdLevel.data = $.extend({ allCar: data.Data }, { brandCar: self.carObj.brand });
                // console.log(CarSelectThirdLevel.data);
                //渲染页面
                self.render();
                // }
            } else {
                console.log("请求失败");
            }
        },
        complete: function () {
            //console.log("完成！");
        }
    });
}

CarSelectThirdLevel.prototype.render = function () {
    var self = this;
    //渲染页面
    //var html = template("carSelect_ThirdLevelTemplate", CarSelectThirdLevel.data);
    var render = template.compile(self.ajaxTemplateHtml());
    var html = render(CarSelectThirdLevel.data);
    $('#carSelectThirdLevel .wrapper').removeClass('loading_gray');
    self.carSelectThirdLevelScroller.html(html);
    //滚动条
    var myScroll = new IScroll('#carSelectThirdLevel .wrapper', {
        scrollbars: true,
        shrinkScrollbars: 'scale',
        fadeScrollbars: true,
        click: true
    });

}

CarSelectThirdLevel.prototype.domOpration = function () {
    var self = this;
    $('body').append(self.templateHtml());
    self.carSelectThirdLevelScroller = $('#carSelectThirdLevel .scroller');
    $carSelectThirdLevel = $("#carSelectThirdLevel");
    // $carSelectThirdLevel.width($(window).width());
    // $carSelectThirdLevel.height($(window).height());
    $carSelectThirdLevel.css({
        'width': '10rem',
        'height': $(window).height()
    });
    $header = $carSelectThirdLevel.find('.carSelectThirdLevel-header');
    $wrapper = $carSelectThirdLevel.find('.wrapper');
    $wrapper.height($(window).height() - $header.height());


    //动画显示
    selectAnimate("show");

    //关闭按钮
    $carSelectThirdLevel.find('.carSelectThirdLevel-background,.carSelectThirdLevel-close-btn').click(function (e) {
        e.preventDefault();
        //goBack_backBtn();
        history.back();

    });
    //关闭按钮
    $carSelectThirdLevel.find('.carSelectThirdLevel-close').click(function (e) {
        e.preventDefault();
        goBack_backBtn();
    });


    //右划
    var startPosition, endPosition, deltaX, deltaY, moveLength;
    document.getElementById("carSelectThirdLevel").addEventListener('touchstart', function (e) {
        // e.preventDefault();
        var touch = e.touches[0];
        startPosition = {
            x: touch.pageX,
            y: touch.pageY
        }
    })
    document.getElementById("carSelectThirdLevel").addEventListener('touchmove', function (e) {
        e.preventDefault();
        var touch = e.touches[0];
        endPosition = {
            x: touch.pageX,
            y: touch.pageY
        };

        deltaX = endPosition.x - startPosition.x;
        deltaY = endPosition.y - startPosition.y;
        moveLength = Math.sqrt(Math.pow(Math.abs(deltaX), 2) + Math.pow(Math.abs(deltaY), 2));
    })
    document.getElementById("carSelectThirdLevel").addEventListener('touchend', function (e) {

        // e.preventDefault();
        if (deltaX < 0) { // 向左划动

        } else if (deltaX > 100 && deltaY > -50 && deltaY < 100) { // 向右划动
            history.back();
        }
    });

    $carSelectThirdLevel.on('click', '.carSelectThirdLevel-carlist-detail', function (e) {
        //进入三级
        var $currentTarget = $(e.currentTarget);
        var obj = CarSelectThirdLevel.data.allCar[$currentTarget.attr("data-firstIndex")].CategoryCollection[$currentTarget.attr("data-secondIndex")];
        // console.log(CarSelectThirdLevel.data.allCar)
        var carObj = {
            id: obj.Id,
            name: obj.Name,
            logo: obj.ImgUrl,
            price: obj.Price,
            spell: obj.Spell,
            otherData: obj.OtherData
        };
        //回调
        if (!self.carObj.masterBrand) {
            goBack({ masterBrand: self.carObj.masterBrand, brand: self.carObj.brand, carType: carObj, year: $currentTarget.attr("data-year") });
        } else {
            self.carObj.brand.masterBrandId = self.carObj.masterBrand.id;
            self.carObj.brand.masterBrandName = self.carObj.masterBrand.name;
            self.carObj.brand.logo = self.carObj.masterBrand.logo;
            goBack({ masterBrand: self.carObj.masterBrand, brand: self.carObj.brand, carType: carObj, year: $currentTarget.attr("data-year") });
        }
    });

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
            // console.log('self.carObj', self.carObj);
            if (self.carObj.brand.masterBrandId && self.carObj.brand.masterBrandName) {

                var carObj = { id: self.carObj.brand.masterBrandId, name: self.carObj.brand.masterBrandName, logo: self.carObj.brand.logo };

                carSecondLevel.carSecondLevel(self.defaults, { masterBrand: carObj }, self.callback);
            } else if (self.carObj.masterBrand) {
                var carObj = { id: self.carObj.masterBrand.id, name: self.carObj.masterBrand.name, logo: self.carObj.masterBrand.logo };
                carSecondLevel.carSecondLevel(self.defaults, { masterBrand: carObj }, self.callback);
            } else {
                console.error("第二个参数中找不到key:masterBrandId或者masterBrandName");
            }

        }
    }

    //监听hash变化
    $(window).on('hashchange', function (e) {
        //console.log(e)
        if (e.newURL + "#hideThird" == e.oldURL) {
            selectAnimate("hide");
        }
    });
}

//显示动画
var selectAnimate = function (state) {
    var $carSelectThirdLevel = $('#carSelectThirdLevel');
    // $carSelectThirdLevel.show();
    // var width = $carSelectThirdLevel.width();
    var $carSelectThirdLevel_content = $carSelectThirdLevel.find('.carSelectThirdLevel-content');
    if (state == "show") {

        $carSelectThirdLevel_content.addClass('drawAni2');
        $carSelectThirdLevel.find('.carSelectThirdLevel-close-btn').show(200);
        // $carSelectThirdLevel_content.css("left", width);
        // setTimeout(function () {
        //     $carSelectThirdLevel_content.animate({left: '20%'}, 200, 'ease-out');
        // }, 100);
    } else {
        $carSelectThirdLevel_content.removeClass('drawAni2');
        $carSelectThirdLevel.find('.carSelectThirdLevel-close-btn').hide();
        setTimeout(function () {
            $carSelectThirdLevel.remove();
        }, 300)
        // $carSelectThirdLevel_content.animate({left: width}, 200, 'ease-out', function () {
        //     $carSelectThirdLevel.remove();
        // });
    }
}

//供外部调用的接口
var carThirdLevel = function (option, carObj, callback) {
    // alert(typeof callback === 'function')
    if (typeof callback === 'function') {
        if ($("#carSelectThirdLevel").length > 0) {
            $("#carSelectThirdLevel").remove();
        }
        var third = new CarSelectThirdLevel(option, carObj, callback);
        third.init();
    }
    else {
        console.log("错误：该函数只接受回调方法！");
    }
    //添加hash
    if (window.location.href.search("#hideThird") == -1) {
        window.location.href = window.location.href + "#hideThird";
    }
}

module.exports = {
    carThirdLevel: carThirdLevel
}
