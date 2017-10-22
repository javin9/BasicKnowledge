require('./index.scss')
var template = require('libs/template')
var IScroll = require('iscroll')

window.APIURL = window.APIURL || "http://api.chedai.bitauto.com/";
var selCityNum = 1, selCityClear = "", windowHeight = $(window).height();
var beizhu='xiugai-chengshi-huidiao-xuanchengshi'
// old code to webpack
var $citySelect
var $wrapper
var $tipsLetter
var $searchInput
var $letterList,citySelectData


function CitySelect() {
    this.curCity = {
        CityId: 201,
        CityName: "北京",
        CitySpell: "beijing",
        RegionId: 110100,
        Url: "http://daikuan.com/beijing",
        isSaveCookie: true,
        NoHotCity: false,
        showCitySearch:true,
        showVisitedCity:true
    }
    this.callback = null;
    this.myScroll = null;
    this.letterArr = [];
    this.visitedCity = [];
}

CitySelect.prototype.init = function (curCity, callback) {
    var self = this;
    self.callback = callback;
    //创建静态DOM
    self.domOpration();
    //重写默认定位城市
    if (curCity != null) {
        if (curCity.SelectCityLevel && curCity.SelectCityLevel < 0) {
            curCity.CityName = "未检测到当前城市";
            curCity.cls = "no-city";
        } else {
            curCity.cls = "";
        }
        $.extend(self.curCity, curCity);
    } else {
        curCity = self.curCity;
    }

    var visitedCityCookie = tools.getCookie("visitedCity")
    if (visitedCityCookie) {
        // console.log(visitedCityCookie)
        self.visitedCity = JSON.parse(visitedCityCookie);
    }
    if (self.curCity.NoHotCity || !self.curCity.showCitySearch) {
        $('.citySelect-search-content').hide();
        $('.citySelect-search .title').show();
    }

    var load_url = APIURL + 'api/Common/GetGroupingCityList?callback=?';
    if (curCity.loadCityUrl) {
        load_url = curCity.loadCityUrl;
        var dataType = curCity.dataType || 'jsonp';
        // self.NoHotCity = true;
        $.ajax({
            url: load_url,
            type: 'get',
            dataType: dataType,
            beforeSend: function () {
            },
            success: function (data) {
                if (data.Result) {
                    var cityData = {};
                    cityData.curCity = self.curCity;
                    cityData.listCity = data.Data;
                    CitySelect.cityData = cityData;
                    var html = '';
                    for (var i = 0; i < data.Data.length; i++) {
                        if (!self.curCity.NoHotCity && i == 0) {
                            continue;
                        }
                        html += '<div>' + data.Data[i].GroupName + '</div>';
                    }

                    self.render();
                    $('#citySelect-letterList').html(html);
                    self.letterArr = [];
                    self.letterArr = $(".citySelect-letterList div");
                    self.letterArr.height((100 / self.letterArr.length) + "%");

                    if (self.curCity.NoHotCity) {
                        // $('.citySelect-search').hide();
                        var h = $('.wrapper').height();
                        $('.wrapper').height(h + 120);
                    } else {
                        // $('.citySelect-search').show();
                        var h = $('.wrapper').height();
                        $('.wrapper').height(h);
                    }


                } else {
                    console.log("请求失败");
                }
            }
        })
    } else {
        //请求远程城市列表接口
        $.ajaxJSONP({
            url: load_url,
            success: function (data) {
                if (data.Result) {
                    var cityData = {};
                    cityData.curCity = self.curCity;
                    cityData.listCity = data.Data;
                    CitySelect.cityData = cityData;

                    //console.log(cityData);
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
}

CitySelect.prototype.domOpration = function () {
    var self = this;
    //插入DOM中
    if ($('#citySelectComponent').length > 0) {
        return;
    }

    $('body').append(self.templateHtml());


    //DOM操作
    $citySelect = $('#citySelectComponent');
    // $citySelect.width($(window).width());
    // $citySelect.height($(window).height());
    $citySelect.css({
        'width': '10rem',
        'height': windowHeight,
    });

    $wrapper = $('#citySelectComponent .wrapper');
    $wrapper.addClass('loading_gray');

    var headerHeight = $citySelect.find('.citySelect-header').height() + $citySelect.find('.citySelect-search').height();
    $wrapper.height(windowHeight - headerHeight);
    //$wrapper.css("height", '1200px');
    //滚动条
    self.myScroll = new IScroll('#citySelectComponent .wrapper', {
        scrollbars: true,
        shrinkScrollbars: 'scale',
        fadeScrollbars: true,
        click: true,
        scrollbars: false
    });

    // 解决某些android浏览器 在浏览器工具栏显示隐藏后 城市控件高度不变的问题
    // qianyuan
    // 2017/4/7
    $(window).on('touchmove', '#citySelectComponent', function () {
        windowHeight = $(window).height();
        $citySelect.height(windowHeight);
        $wrapper.height(windowHeight - headerHeight);
        //$letterList.height(windowHeight - headerHeight - 5);
    });
    // 处理软键盘收起时，控件高度问题（安卓机qq浏览器）
    // qiany
    // 2017/5/2
    $(window).on('resize', function() {
        // 键盘收起时，去掉搜索框焦点
        // if ($(window).height() > windowHeight) {
        //     $searchInput.blur();
        // }
        windowHeight = $(window).height();
        $citySelect.height(windowHeight);
        $wrapper.height(windowHeight - headerHeight);
        //$letterList.height(windowHeight - headerHeight - 5);
    });
    $("input:focus").blur();
    selCityNum = 1;
    clearInterval(selCityClear);
    // alert(navigator.userAgent);
    function updateHeight() {
        // alert(selCityNum);
        if (selCityNum < 10) {
            $citySelect.height($(window).height());
            $wrapper.height($(window).height() - $citySelect.find('.citySelect-header').height() - $citySelect.find('.citySelect-search').height());
            //$letterList.height($wrapper.height() - 5);
            selCityNum++;
        } else {
            clearInterval(selCityClear);
        }
    }
    if (navigator.userAgent.indexOf("KOT49H") >= 0 || navigator.userAgent.indexOf("MQQBrowser") >= 0 || navigator.userAgent.indexOf("MicroMessenger") >= 0) {
        selCityClear = setInterval(updateHeight, 500);
    } else {
        setTimeout(function () {
            updateHeight();
        }, 400)
    }
    // if(navigator.userAgent.indexOf("MQQBrowser")>=0 ||navigator.userAgent.indexOf("MicroMessenger")>=0||navigator.userAgent.indexOf("EUI Browser")>=0 ||
    // (navigator.userAgent.indexOf("UCBrowser")>=0 && navigator.userAgent.indexOf("AppleWebKit")>=0)){

    // }

    // $(window).off("resize").on("resize",function(){
    //     setTimeout(function(){
    //         $citySelect.height($(window).height());
    //         $wrapper.height($(window).height() - $citySelect.find('.citySelect-header').height() - $citySelect.find('.citySelect-search').height());
    //         $letterList.height($wrapper.height() - 5);
    //     },400)

    // })
    //动画显示
    self.selectAnimate("show");

    //字母提示框
    $tipsLetter = $citySelect.find('.tipsLetter');
    //字母列表操作
    $letterList = $citySelect.find('.citySelect-letterList');
    // $letterList.height('440px');
    // $letterList.height($wrapper.height() - 5);
    $letterList.css({ "top": $citySelect.find('.citySelect-header').height() + $citySelect.find('.citySelect-search').height() + 5, "right": "0px", "bottom": '0px' });

    //将所有字母元素保存到数组中
    self.letterArr = $letterList.find('div');
    self.letterArr.height((100 / self.letterArr.length) + "%");
    // console.log(letterArr);
    //触摸事件处理
    $letterList.on("touchstart", function (e) {
        //console.log($(e.target).text());
        e.preventDefault();
        $tipsLetter.text($(e.target).text());
        $tipsLetter.show();
        self.myScroll.scrollToElement('.citySelect-allCity li[letter="' + $(e.target).text() + '"]', 100);
    });
    $letterList.on("touchmove", function (e) {
        e.preventDefault();
        var touch = e.targetTouches[0];
        var position = touch.clientY - ($citySelect.find('.citySelect-header').height() + $citySelect.find('.citySelect-search').height());
        var index = parseInt(position / ($(self.letterArr[0]).height()));
        if (index < 0) {
            index = 0;
        } else if (index > self.letterArr.length - 1) {
            index = self.letterArr.length - 1;
        }
        $tipsLetter.text($(self.letterArr[index]).text());
        //console.log($(self.letterArr[index]).text());
        self.myScroll.scrollToElement('.citySelect-allCity li[letter="' + $(self.letterArr[index]).text() + '"]', 100);
    });
    $letterList.on("touchend", function (e) {
        e.preventDefault();
        //console.log($(e.target));
        $tipsLetter.hide();
    });

    //输入框搜索
    $searchInput = $citySelect.find('.citySelect-search-input');
    $searchInput.blur();
    $searchInput.on('input', function (e) {
        //console.log($(e.target).val());
        var text = $(e.target).val();
        if (text == "") {
            self.myScroll.scrollTo(0, 0, 100);
        } else {
            text = text.toUpperCase();
            self.myScroll.scrollToElement('.citySelect-allCity li[letter^="' + text + '"]', 100);
        }
    });
    $searchInput.on('blur', function (e) {
        windowHeight = $(window).height();
        $citySelect.height(windowHeight);
        $wrapper.height(windowHeight - headerHeight);
    })
    //关闭按钮
    $citySelect.find('.citySelect-close').click(function (e) {
        CitySelect.callbackData = null;
        //history.back();
        // window.location.reload();
        $('#citySelectComponent').remove();
    });

    //监听hash变化
    // $(window).off('hashchange').on('hashchange', function (e) {
    //     //console.log(e)
    //     if (e.newURL + "#hide" == e.oldURL ) {
    //
    //         // self.callback(CitySelect.callbackData);
    //         self.selectAnimate("hide", function () {
    //             if (CitySelect.callbackData) {
    //                 //oppo自带浏览器bug
    //
    //                 if (navigator.userAgent.indexOf('OppoBrowser') >= 0 || navigator.userAgent.indexOf('13F69 Safari') >= 0) {
    //                     self.callback(CitySelect.callbackData);
    //                 }
    //                 //存入历史城市
    //                 var _cityObj = CitySelect.callbackData,
    //                     _visitedCityIndex,
    //                     _visitedCitylength = self.visitedCity.length;
    //
    //                 for (let i = 0; i < self.visitedCity.length; i++) {
    //                     if (_cityObj.CityId == self.visitedCity[i].CityId) {
    //                         _visitedCityIndex = i;
    //                         break;
    //                     } else {
    //                         _visitedCityIndex = -1;
    //                     }
    //                 }
    //                 // console.log(self.visitedCity);
    //
    //                 if (_visitedCitylength == 3) {
    //                     self.visitedCity.pop();
    //                 }
    //                 if (_visitedCityIndex >= 0) {
    //                     self.visitedCity.splice(_visitedCityIndex, 1);
    //                 }
    //                 self.visitedCity.unshift(_cityObj);
    //
    //                 if (document.domain.search(".daikuan.com") != -1) {
    //                     tools.setCookie("visitedCity", JSON.stringify(self.visitedCity), "", ".daikuan.com");
    //                 } else {
    //                     tools.setCookie("visitedCity", JSON.stringify(self.visitedCity), "", document.domain);
    //                 }
    //                 self.callback(CitySelect.callbackData);
    //             }
    //         });
    //     }
    // });
}
CitySelect.prototype.closeLayer = function(){
    var self = this;
    if($("#citySelectComponent").hasClass("defaultAniCity")){
        //存入历史城市
        var _cityObj = CitySelect.callbackData,
            _visitedCityIndex,
            _visitedCitylength = self.visitedCity.length;
        if(_cityObj.CityId === 0){
            return false;
        }
        for (let i = 0; i < self.visitedCity.length; i++) {
            if (_cityObj.CityId == self.visitedCity[i].CityId) {
                _visitedCityIndex = i;
                break;
            } else {
                _visitedCityIndex = -1;
            }
        }

        if (_visitedCityIndex >= 0) {
            self.visitedCity.splice(_visitedCityIndex, 1);
        }else{
            if (_visitedCitylength == 3) {
                self.visitedCity.pop();
            }
        }
        self.visitedCity.unshift(_cityObj);
        if (document.domain.search(".daikuan.com") != -1) {
            tools.setCookie("visitedCity", JSON.stringify(self.visitedCity), "", ".daikuan.com");
        } else {
            tools.setCookie("visitedCity", JSON.stringify(self.visitedCity), "", document.domain);
        }

    }

}
CitySelect.prototype.ajaxTemplateHtml_NoHotCity = function () {
    var source = '<article class="citySelect-content">' +
        '                        <!--当前城市-->' +
        '                        <section class="citySelect-curCity">' +
        '                           当前城市：<span class="{{curCity.cls}}">{{curCity.CityName}}</span>' +
        '                        </section>' +
        '                        <!--定位城市-->' +
        '                        <section class="citySelect-localCity margin-top-30 {{locationCity.cls}}">' +
        '                            <div class="citySelect-content-tips font-size-26 margin-left-30">定位城市</div>' +
        '                            <div class="citySelect-content-localCityBlock font-size-28 margin-left-30"  data-name={{locationCity.cityName}} data-spell={{locationCity.citySpell}} data-cityId={{locationCity.cityId}}>' +
        '                                <span class="citySelect-content-local-icon"></span>{{locationCity.cityName}}' +
        '                            </div>' +
        '                            <div class="clear"></div>' +
        '                        </section>' +
        '                        <!--最近访问城市-->' +
        '                        {{if curCity.showVisitedCity && visitedCity && visitedCity.length>0}}' +
        '                        <section class="citySelect-visitedCity margin-top-30">' +
        '                            <div class="citySelect-content-tips font-size-26 margin-left-30">最近访问城市</div>' +
        '                             {{each visitedCity as visitedCityItem i}}' +
        '                            <div class="citySelect-content-cityBlock font-size-28 margin-left-30"' +
        '                                 data-first-index={{i}}>' +
        '                                {{visitedCityItem.CityName?visitedCityItem.CityName:visitedCityItem.cityName}}' +
        '                            </div>' +
        '                            {{/each}}' +
        '                            <div class="clear"></div>' +
        '                        </section>' +
        '                        {{/if}}' +
        '                        <!--所有城市-->' +
        '                        <section class="citySelect-allCity padding-right-40">' +
        '                            <ul class="font-size-28">' +
        '                                {{each listCity as allCity j}}' +
        // '                                {{if j>0}}' +
        '                                <li letter={{allCity.GroupName}} class="citySelect-allCity-ul-li-letter margin-left-30">{{allCity.GroupName}}</li>' +
        '                                {{each allCity.ItemCollection as cityList m}}' +
        '                                <li letter={{cityList.CityName}} data-first-index={{j}} data-second-index={{m}} class="citySelect-allCity-ul-li-text padding-left-30">' +
        '                                    <span>' +
        '                                    {{cityList.CityName}}' +
        '                                    </span>' +
        '                                </li>' +
        '                                {{/each}}' +
        // '                                {{/if}}' +
        '                                {{/each}}' +
        '                            </ul>' +
        '                            <div class="clear"></div>' +
        '                        </section>' +
        '                    </article>';
    return source;
}
CitySelect.prototype.ajaxTemplateHtml = function () {
    var source = '<article class="citySelect-content">' +
        '                        <!--当前城市-->' +
        '                        <section class="citySelect-curCity">' +
        '                           当前城市：<span class="{{curCity.cls}}">{{curCity.CityName}}</span>' +
        '                        </section>' +
        '                        <!--定位城市-->' +
        '                        <section class="citySelect-localCity margin-top-30 {{locationCity.cls}}">' +
        '                            <div class="citySelect-content-tips font-size-26 margin-left-30">定位城市</div>' +
        '                            <div class="citySelect-content-localCityBlock font-size-28 margin-left-30"  data-name={{locationCity.cityName}} data-spell={{locationCity.citySpell}} data-cityId={{locationCity.cityId}}>' +
        '                                <span class="citySelect-content-local-icon"></span>{{locationCity.cityName}}' +
        '                            </div>' +
        '                            <div class="clear"></div>' +
        '                        </section>' +
        '                        <!--最近访问城市-->' +
        '                        {{if curCity.showVisitedCity && visitedCity && visitedCity.length>0}}' +
        '                        <section class="citySelect-visitedCity margin-top-30">' +
        '                            <div class="citySelect-content-tips font-size-26 margin-left-30">最近访问城市</div>' +
        '                             {{each visitedCity as visitedCityItem i}}' +
        '                            <div class="citySelect-content-cityBlock font-size-28 margin-left-30"' +
        '                                 data-first-index={{i}}>' +
        '                                {{visitedCityItem.CityName?visitedCityItem.CityName:visitedCityItem.cityName}}' +
        '                            </div>' +
        '                            {{/each}}' +
        '                            <div class="clear"></div>' +
        '                        </section>' +
        '                        {{/if}}' +
        '                        <!--热门城市-->' +
        '                        <section class="citySelect-hotCity margin-top-30">' +
        '                            <div class="citySelect-content-tips font-size-26 margin-left-30">热门城市</div>' +
        '                            {{each listCity[0].ItemCollection as hotCity i}}' +
        '                            <div class="citySelect-content-cityBlock font-size-28 margin-left-30" data-first-index="0"' +
        '                                 data-second-index={{i}}>' +
        '                                {{hotCity.CityName}}' +
        '                            </div>' +
        '                            {{/each}}' +
        '                            <div class="clear"></div>' +
        '                        </section>' +
        '                        <!--所有城市-->' +
        '                        <section class="citySelect-allCity padding-right-40">' +
        '                            <ul class="font-size-28">' +
        '                                {{each listCity as allCity j}}' +
        '                                {{if j>0}}' +
        '                                <li letter={{allCity.GroupName}} class="citySelect-allCity-ul-li-letter padding-left-30">{{allCity.GroupName}}</li>' +
        '                                {{each allCity.ItemCollection as cityList m}}' +
        '                                <li letter={{cityList.CityName}} data-first-index={{j}} data-second-index={{m}} class="citySelect-allCity-ul-li-text padding-left-30">' +
        '                                    <span>' +
        '                                    {{cityList.CityName}}' +
        '                                    </span>' +
        '                                </li>' +
        '                                {{/each}}' +
        '                                {{/if}}' +
        '                                {{/each}}' +
        '                            </ul>' +
        '                            <div class="clear"></div>' +
        '                        </section>' +
        '                    </article>';
    return source;
}
CitySelect.prototype.templateHtml = function () {
    var source = '<div id="citySelectComponent" class="defaultAniCity">' +
        '        <div class="relative-position">' +
        '            <section class="citySelect-search">' +
        '                <div class="citySelect-close"></div>' +
        '                <div class="citySelect-search-content">' +
        '                    <span class="citySelect-search-icon"></span>' +
        '                    <input class="citySelect-search-input font-size-24" placeholder="请输入城市名称或者首字母查询">' +
        '                </div>' +
        '                <div class="title" style="display: none;">选择城市</div>' +
        '            </section>' +
        '            <div class="wrapper">' +
        '                <div class="scroller">' +
        '                </div>' +
        '            </div>' +
        '            <!--首字母导航-->' +
        '            <section id="citySelect-letterList" class="citySelect-letterList font-size-22 padding-top-30">' +
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

CitySelect.prototype.render = function () {
    var self = this;
    //模板引擎生成页面
    //var html = template("citySelectTemplate", CitySelect.cityData);
    if(citySelectData){
        CitySelect.cityData["curCity"] =$.extend(CitySelect.cityData["curCity"],citySelectData);
    }
    if (self.curCity.NoHotCity) {
        var render = template.compile(self.ajaxTemplateHtml_NoHotCity());
    } else {
        var render = template.compile(self.ajaxTemplateHtml());
    }

    var locCityCookie = tools.getCookie("locationCity");
    var _locCityCookieObj = JSON.parse(locCityCookie);
    CitySelect.cityData["visitedCity"] = self.visitedCity;

    if (_locCityCookieObj) {
        _locCityCookieObj.cls = "";
        CitySelect.cityData["locationCity"] = _locCityCookieObj;
    } else {
        CitySelect.cityData["locationCity"] = { "cityId": -1, "cityName": "定位失败", "citySpell": -1, "cls": "no-locaton-city" }
    }
    var html = render(CitySelect.cityData);
    $('#citySelectComponent .scroller').html(html);
    $letterList.show();
    $wrapper.removeClass('loading_gray');
    self.myScroll.refresh();
}

CitySelect.prototype.selectAnimate = function (state, callback) {
    var self = this;
    var $citySelectComponent = $('#citySelectComponent');
    if (state == "show") {
        $citySelectComponent.addClass('drawAniCity');

        //每次打开都获取定位城市是否存在
        var locCityCookie = tools.getCookie("locationCity"),
            _locCityCookieObj = JSON.parse(locCityCookie),
            $citySelLocal = $(".citySelect-content .citySelect-localCity"),
            $localCityBlock = $citySelLocal.find(".citySelect-content-localCityBlock");
        if (_locCityCookieObj && ($citySelLocal.hasClass('no-locaton-city') || $localCityBlock.data("cityId") != _locCityCookieObj.cityId)) {
            $citySelLocal.removeClass('no-locaton-city');
            $localCityBlock.attr({
                'data-name': _locCityCookieObj.cityName,
                'data-spell': _locCityCookieObj.citySpell,
                'data-cityId': _locCityCookieObj.cityId
            }).text(_locCityCookieObj.cityName);
        }
        // $citySelectComponent.css("left", $(window).width());
        // $citySelectComponent.css("top", 0);
        // setTimeout(function () {
        //     $citySelectComponent.show();
        //     $citySelectComponent.animate({left: '0px'}, 300, 'ease-out');
        // }, 100);
    } else {
        $citySelectComponent.removeClass('drawAniCity');
        setTimeout(function () {
            self.closeLayer();
            $citySelectComponent.remove();
            if (callback) {
                callback();
            }
        }, 300)

        // $citySelectComponent.animate({left: $(window).width()}, 200, 'ease-out', function () {
        //     $citySelectComponent.remove();
        //     if(callback){
        //         callback();
        //     }
        // });
    }
}

//供外部调用的接口
var citySelect = function (curCity, callback) {
    if (typeof callback === 'function') {
        if ($('#citySelectComponent').length == 0) {//如果dom中已经存在该控件
            var citySelect = new CitySelect();
            citySelect.init(curCity, callback);
        }
        var saveCookie = function (cityID) {
            // console.log(cityID)
            if(cityID === 0){
                return false;
            }
            if (curCity && curCity.isSaveCookie != false) {
                if (document.domain.search(".daikuan.com") != -1) {
                    tools.setCookie("selectCityId", cityID, "", ".daikuan.com");
                    tools.setCookie("selectcity", cityID, "", ".daikuan.com");
                } else {
                    tools.setCookie("selectCityId", cityID, "", document.domain);
                    tools.setCookie("selectcity", cityID, "", document.domain);
                }
            }
        }
        //添加hash
        // if (window.location.href.search("#hide") == -1) {
        //     window.location.href = window.location.href + "#hide";
        // }
        //首先移除监听事件
        $(document).off('click');
        //监听定位城市选择事件
        $(document).on('click', '#citySelectComponent .citySelect-localCity .citySelect-content-localCityBlock', function (e) {
            let newLocationCity = {
                CityId: $(e.target).attr('data-cityId'),
                CityName: $(e.target).attr('data-name'),
                CitySpell: $(e.target).attr('data-spell')
            }
            saveCookie($(e.target).attr('data-cityId'));
            CitySelect.callbackData = newLocationCity;
            $('#citySelectComponent').remove();
            citySelectData = CitySelect.callbackData;
            callback(CitySelect.callbackData);
        });
        //监听热门城市选择事件
        $(document).on('click', '#citySelectComponent .citySelect-hotCity .citySelect-content-cityBlock', function (e) {
            var firstIndex = $(e.target).attr("data-first-index");
            var secondIndex = $(e.target).attr("data-second-index");
            var cityObj = CitySelect.cityData.listCity[firstIndex].ItemCollection[secondIndex];
            saveCookie(cityObj.CityId);
            CitySelect.callbackData = cityObj;
            citySelect.closeLayer();
            $('#citySelectComponent').remove();
            citySelectData = CitySelect.callbackData;
            callback(CitySelect.callbackData);
        });
        //监听城市列表选择事件
        $(document).on('click', '#citySelectComponent .citySelect-allCity li', function (e) {
            var firstIndex = $(e.target).parent(".citySelect-allCity-ul-li-text").attr("data-first-index");
            var secondIndex = $(e.target).parent(".citySelect-allCity-ul-li-text").attr("data-second-index");
            var cityObj = CitySelect.cityData.listCity[firstIndex].ItemCollection[secondIndex];
            //console.log(cityObj);
            saveCookie(cityObj.CityId);
            CitySelect.callbackData = cityObj;
            citySelect.closeLayer();
            $('#citySelectComponent').remove();
            citySelectData = CitySelect.callbackData;
            callback(CitySelect.callbackData);

        });

        //最近访问选择事件
        $(document).on('click', '#citySelectComponent .citySelect-visitedCity .citySelect-content-cityBlock', function (e) {
            var firstIndex = $(e.target).attr("data-first-index");
            var cityObj = CitySelect.cityData.visitedCity[firstIndex];
            // console.log(cityObj.CityId);
            saveCookie(cityObj.CityId);
            CitySelect.callbackData = cityObj;
            citySelect.closeLayer();
            $('#citySelectComponent').remove();
            citySelectData = CitySelect.callbackData;
            callback(CitySelect.callbackData);
        });
    } else {
        console.log("错误：该函数只接受回调方法！");
    }
}
module.exports = {
    citySelect: citySelect
};
