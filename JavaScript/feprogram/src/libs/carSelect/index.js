require('./index.scss')
var template = require('libs/template')
var carSearch = require('./carSearch')
var carSecondLevel = require('./carSecondLevel')
var IScroll = require('iscroll')

window.APIURL = window.APIURL||"http://api.chedai.bitauto.com/";
var mySelScroll = null;
var selCarNum = 1,selCarClear="",selCarNum2 = 1,selCarClear2="",windowHeight = $(window).height();
var $carSelect
var $header
var $wrapper
var $tipsLetter
var $letterList
var $searchArea
var $allBrand

function CarSelect(option, callback) {
    this.callback = callback;
    this.defaults = {
        type: "xinche",
        onlyOnSale: true,
        showLevel: 3,
        showSearch: true,
        showAllBrand: false,
        //是否显示车系图片
        showSerialImg:true,
        hide: false,
        CityId:null,
        secondInterfaceUrl:'',
        thirdInterfaceUrl:'',
        secondDataType:null,
        thirdDataType:null,
        showHotCar: false,
        unmount: false,
        levelOrder: 'positive', //弹层排序参数正序positive 倒序reverse
        searchText: '',
        searchLink: ''
    }
    if (option != null) {
        $.extend(this.defaults, option);
    }
    this.renderSuc = false;
    this.myScroll = null;
}

CarSelect.prototype.ajaxTemplateHtml = function () {
    var source = '<article class="carSelect-content">' +
        '                        <section class="carSelect-allBrand font-size-26 padding-left-30 padding-right-30">全部品牌</section>' +
        '                        <section class="carSelect-recommendBrand">' +
        '                            <div class="carSelect-recommendBrand-title font-size-26 padding-left-30 padding-right-30">' +
        '                                推荐品牌' +
        '                            </div>' +
        '                            <div class="carSelect-recommendBrand-content padding-right-30">' +
        '                                {{each hostCar as hostlist m}}' +
        '                                <div class="carSelect-recommendBrand-car margin-top-40" data-firstIndex={{m}}>' +
        '                                    <div class="carSelect-recommendBrand-img"><img src={{hostlist.Logo}}></div>' +
        '                                    <div class="carSelect-recommendBrand-name font-size-24">' +
        '                                        {{hostlist.CarMasterBrandName}}' +
        '                                    </div>' +
        '                                </div>' +
        '                                {{/each}}' +
        '                                <div class="clear"></div>' +
        '                            </div>' +
        '                            <div class="clear"></div>' +
        '                        </section>' +
        '                        {{if hotCar && hotCar.length}}' +
        '                        <section class="carSelect-hot">' +
        '                            <div class="carSelect-hot-title">' +
        '                                热卖车型' +
        '                            </div>' +
        '                            <div class="carSelect-hot-content padding-right-30">' +
        '                                {{each hotCar as hotlist m}}' +
        '                                <div class="carSelect-hot-car" rel="{{hotlist.CarSerialAllSpell}}">' +
        '                                    <div class="carSelect-hot-img"><img src={{hotlist.ImageUrl}}></div>' +
        '                                    <div class="carSelect-hot-name">' +
        '                                        {{hotlist.CarSerialName}}' +
        '                                    </div>' +
        '                                </div>' +
        '                                {{/each}}' +
        '                                <div class="clear"></div>' +
        '                            </div>' +
        '                            <div class="clear"></div>' +
        '                        </section>' +
        '                        {{/if}}' +
        '                        <section class="carSelect-allCar">' +
        '                            <div class="carSelect-allCar-title padding-left-30 padding-right-30">所有品牌</div>' +
        '                            <ul class="carSelect-allCar-ul">' +
        '                                {{each allCar as carlist i}}' +
        '                                <li class="carSelect-allCar-li-letter font-size-28 padding-left-30 padding-right-30"' +
        '                                    letter={{carlist.CategoryName}}>' +
        '                                    {{carlist.CategoryName}}' +
        '                                </li>' +
        '                                {{each carlist.CategoryCollection as collection j}}' +
        '                                <li class="carSelect-allCar-li-car padding-left-30 padding-right-30"' +
        '                                    data-firstIndex={{i}} data-secondIndex={{j}}>' +
        '                                    <div class="carSelect-allCar-img"><img src={{collection.ImgUrl}}></div>' +
        '                                    <div class="carSelect-allCar-name"> {{collection.Name}}</div>' +
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
        '                <div class="carSelect-search-content">' +
        '                    <div class="relative-position" style="display:table">' +
        '                        <div class="carSelect-search-icon"></div>' +
        '                        <div class="carSelect-search-text font-size-28">'+(this.defaults.searchText || '请输入心仪品牌或车型')+'</div>' +
        '                    </div>' +
        '                </div>' +
        '            </header>' +
        '            <div class="wrapper">' +
        '                <div class="scroller">' +
        '                </div>' +
        '            </div>' +
        '            <!--首字母导航-->' +
        '            <section class="carSelect-letterList font-size-20">' +
        '                <div data-text="推荐品牌" style="display:none" class="letter-host">荐</div>' +
        '                <div data-text="热卖车型" style="display:none" class="letter-hot">热</div>' +
        '                <div>A</div>' +
        '                <div>B</div>' +
        '                <div>C</div>' +
        '                <div>D</div>' +
        '                <div>E</div>' +
        '                <div>F</div>' +
        '                <div>G</div>' +
        '                <div>H</div>' +
        '                <div>I</div>' +
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
        '                <div>U</div>' +
        '                <div>V</div>' +
        '                <div>W</div>' +
        '                <div>X</div>' +
        '                <div>Y</div>' +
        '                <div>Z</div>' +
        '            </section>' +
        '            <!--滑动时提示字母-->' +
        '            <div class="tipsLetter"></div>' +
        '        </div>' +
        '    </div>';
    return source;
}

CarSelect.prototype.init = function () {
    var self = this;

    //操作DOM
    self.domOpration();

    var getAllCar = function () {
        if(self.defaults.showHotCar && !CarSelect.data.hostCar){
            return false
        }
        //请求远程汽车列表接口
        $.ajaxJSONP({
            url: APIURL+'api/Common/GetCarMasterBrandListWithFirstLetter?callback=?',
            data: {onlyOnSale: self.defaults.onlyOnSale},
            success: function (data) {
                if (data.Result) {
                    //CarSelect.data = {allCar: data.Data};
                    $.extend(CarSelect.data, {allCar: data.Data});
                    //console.log(CarSelect.data.allCar);
                    //渲染页面
                    self.renderSuc = true;
                    self.render();
                } else {
                    console.log("请求失败");
                }
            },
            complete: function () {
                //console.log("完成！");
            }
        });
    }
    //请求推荐品牌
    $.ajaxJSONP({
        url: APIURL+'api/carrecommend/GetRecommendCarMasterBrands?callback=?',
        data: {onlyOnSale: self.defaults.onlyOnSale, type: self.defaults.type},
        success: function (data) {
            if (data.Result) {
                CarSelect.data = Object.assign(CarSelect.data || {}, {hostCar: data.Data})
                if(data.Data && data.Data.length){
                    $('.letter-host').show()
                }
                getAllCar()
            } else {
                console.log("请求失败");
            }
        }
    });

    if(this.defaults.showHotCar){
        $.ajaxJSONP({
            url: APIURL+'api/carrecommend/GetStaticHotCarSerials?amount=6&callback=?',
            success: function (data) {
                if (data.Result) {
                    CarSelect.data = Object.assign(CarSelect.data || {}, {hotCar: data.Data})
                    if(data.Data && data.Data.length){
                        $('.letter-hot').show()
                    }
                    getAllCar()
                } else {
                    console.log("请求失败");
                }
            }
        })
    }

}

CarSelect.prototype.render = function () {
    var self = this;
    //渲染页面
    //var html = template("carSelectTemplate", CarSelect.data);
    var render = template.compile(self.ajaxTemplateHtml());
    var html = render(CarSelect.data);
    $('#carSelectComponent .scroller').html(html);
    $allBrand = $('#carSelectComponent .carSelect-allBrand');
    if (self.defaults.showAllBrand) {
        $allBrand.show();
        $allBrand.click(function (e) {
            goBack({allBrand: "firstAllBrand"});
        });
    } else {
        $allBrand.hide();
    }
    self.myScroll.refresh();
    $wrapper.removeClass("loading_gray");
    $letterList.show();

    $('.carSelect-hot-car').click(function(){
        goBack({
            carType: {
                spell: $(this).attr('rel')
            }
        })
    })

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
    // $carSelect.();
    // $carSelect.css({width:"100%",height:"100%"})
    // $carSelect.();
    $carSelect.css({
        'width':'10rem',
        'height': '100%',
    });
    $header = $carSelect.find('.carSelect-header');
    $wrapper = $carSelect.find('.wrapper');
    $wrapper.height((windowHeight>$(window).height())?windowHeight:$(window).height() - $header.height());
    $wrapper.addClass("loading_gray");
    //滚动条
    mySelScroll = self.myScroll = new IScroll('#carSelectComponent .wrapper', {
        scrollbars: true,
        shrinkScrollbars: 'scale',
        fadeScrollbars: true,
        click: true
    });


    //  if(navigator.userAgent.indexOf("MQQBrowser")>=0 ||navigator.userAgent.indexOf("MicroMessenger")>=0||navigator.userAgent.indexOf("EUI Browser")>=0||
    // (navigator.userAgent.indexOf("UCBrowser")>=0 && navigator.userAgent.indexOf("AppleWebKit")>=0)){

    // }
    $(window).off("resize").on("resize",function(){
        $carSelect.height($(window).height());
        $wrapper.height($(window).height() - $header.height());
    })

    //动画显示
    selectAnimate("show");

    //字母提示框
    $tipsLetter = $carSelect.find('.tipsLetter');
    //字母列表操作
    $letterList = $carSelect.find('.carSelect-letterList');
    $letterList.height($wrapper.height() - 5);
    $letterList.css({"top": $header.height() + 5,"right": "0px"});

    //将所有字母元素保存到数组中
    var letterArr = $letterList.find('div');
    //触摸事件处理
    $letterList.on("touchstart", function (e) {
        var text = $(e.target).data('text') || $(e.target).text()
        var scrollTarget = ''
        e.preventDefault();
        $tipsLetter.text(text);
        $tipsLetter.css('display', 'block');
        if(text === '推荐品牌'){
            scrollTarget = '.carSelect-recommendBrand'
        }else if(text === '热卖车型'){
            scrollTarget = '.carSelect-hot'
        }else{
            scrollTarget = '.carSelect-allCar li[letter="' + $(e.target).text() + '"]'
        }
        self.myScroll.scrollToElement(scrollTarget, 100)
    });
    $letterList.on("touchmove", function (e) {
        e.preventDefault();
        var scrollTarget = ''
        var touch = e.targetTouches[0];
        var position = touch.clientY - $header.height();
        var index = parseInt(position / ($(letterArr[0]).height()));
        if (index < 0) {
            index = 0;
        } else if (index > letterArr.length - 1) {
            index = letterArr.length - 1;
        }
        var text = $(letterArr[index]).data('text') || $(letterArr[index]).text()
        $tipsLetter.text(text);
        if(text === '推荐品牌'){
            scrollTarget = '.carSelect-recommendBrand'
        }else if(text === '热卖车型'){
            scrollTarget = '.carSelect-hot'
        }else{
            scrollTarget = '.carSelect-allCar li[letter="' + $(letterArr[index]).text() + '"]'
        }
        self.myScroll.scrollToElement(scrollTarget, 100);
    });
    $letterList.on("touchend", function (e) {
        e.preventDefault();
        //console.log($(e.target));
        $tipsLetter.hide();
    });
    //关闭按钮
    $carSelect.find('.carSelect-close').click(function (e) {
        goBack_backBtn.call(self)
    });
    //搜索框点击
    $searchArea = $carSelect.find('.carSelect-search-content');
    if (self.defaults.showSearch) {
        $searchArea.addClass('carSelect-search-content-show');
        $searchArea.click(function () {
            carSearch.search(self.defaults, function (result) {
                //console.log(result);
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
        var carObj = {id: obj.CarMasterBrandID, name: obj.CarMasterBrandName, logo: obj.Logo};
        //console.log(carObj);
        firstLevelSelect(carObj);
    });
    //列表车型选择
    $carSelect.on('click', '.carSelect-allCar-li-car', function (e) {
        var $currentTarget = $(e.currentTarget);
        var obj = CarSelect.data.allCar[$currentTarget.attr("data-firstIndex")].CategoryCollection[$currentTarget.attr("data-secondIndex")];
        var carObj = {id: obj.Id, name: obj.Name, logo: obj.ImgUrl};
        //console.log(carObj);
        firstLevelSelect(carObj);
    });

    function firstLevelSelect(carObj) {
        if (self.defaults.showLevel == 1) {
            goBack({masterBrand: carObj});
        } else {
            carSecondLevel.carSecondLevel(self.defaults, {masterBrand: carObj}, function (result) {
                //console.log("二级："+result)
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
        setTimeout(() => {
            history.back();
            $('#carSelectComponent').removeClass('drawAni').addClass('hideAni');
            if(this.defaults.unmount){
                setTimeout(() => {
                    $('#carSelectComponent').remove()
                    CarSelect.data = {}
                }, 300)
            }
        }, 100);
    }

    //监听hash变化
    $(window).off('hashchange').on('hashchange', function (e) {
        //console.log(e)
        //console.log(e.newURL ,e.oldURL)
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
        
        // 需要重设高度以防从文本框直接点击触发区域调出选车控件
        setTimeout(()=>{
            $wrapper.height($(window).height() - $header.height());
        },0)

        // $carSelectComponent.css("left", $(window).width());
        // $carSelectComponent.css("top", 0);
        // setTimeout(function () {
        //     $carSelectComponent.show();
        //     $carSelectComponent.animate({left: '0px'}, 200, 'ease-out');
        // }, 100);
    } else {
        $carSelectComponent.removeClass('drawAni').addClass('hideAni');
        // setTimeout(function(){
        //     $carSelectComponent.remove();
        // },300)
        // $carSelectComponent.animate({left: $(window).width()}, 200, 'ease-out', function () {
        //     $carSelectComponent.remove();
        // });
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
        // var _url =  window.location.href,
        //     _title = document.title;
        // history.pushState({title:_title,url:_url},_title,_url);
        
        if ($("#carSelectComponent").length > 0) {
            selectAnimate("show");
        }
    }else if($("#carSelectComponent").hasClass('defaultAni') && $("#carSelectComponent").length > 0){
        selectAnimate("show");
    }
}

module.exports =  {
    carSelect: carSelect
};
