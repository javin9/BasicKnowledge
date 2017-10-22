require('zepto/src/touch');
require('libs/carSelect/carSearchAllBiz.scss');
var template = require('libs/template');
var carSecondLevel = require('./carSecondLevel');
var IScroll = require('iscroll');
APIURL = APIURL || "http://api.chedai.bitauto.com/";
if (APIURL == '/') {
    APIURL = "http://api.chedai.bitauto.com/";
}

window.APIURL = window.APIURL || "http://api.chedai.bitauto.com/";

var $carSearch;
var $header;
var $wrapper;
var $hotCar;
var $carSearchResult;
var $noInfoTips;
var $pleaseInputSome;
var $input;
var $input_clear;
var _oldUrl="";
function CarSearch(option, callback) {
    this.defaults = {
        hide: false
    }
    $.extend(this.defaults, option);

    this.callback = callback;
    this.myScroll = null;
    this.businessType = "新车";
}

CarSearch.prototype.templateHtml = function () {

    var source = '<div id="carSearchAllBiz-container" class="defaultAni">' +
        '        <div class="relative-position"><form action="javascript:return true;">' +
        '            <header class="carSearch-header">' +
        '                <div class="carSearch-search-content"><div class="triangle-down"></div><span class="select-business font-size-24">新车</span><input type="search" class="carSearch-search-text font-size-26" placeholder="请输入心仪品牌或车型" autocomplete="off" /><span class="carSearch-search-text-clear"></span></div>' +
        '                <span class="carSearchAllBiz-close font-size-32">取消</span>' +
        '                <ul class="select-business-list"><li>新车</li><li>二手车</li></ul>'+
        '            </header></form>' +
        '            <div class="wrapper">' +
        '                <div class="scroller">' +
        '                    <article class="carSearch-article">' +
        '                        <section class="carSearch-history padding-left-30 padding-right-30 margin-bottom-20">' +
        '                            <!--<div class="carSearch-history-content">' +
        '                                <span class="carSearch-history-icon"></span>' +
        '                                <span class="carSearch-history-text">奥迪A4L</span>' +
        '                            </div>' +
        '                            <div class="carSearch-history-cleanHistory">清除历史记录</div>-->' +
        '                        </section>' +
        '                        <section class="carSearch-result padding-left-30 padding-right-30 margin-bottom-20">' +
        '                            <!--<div class="carSearch-result-link">' +
        '                                <span class="carSearch-result-icon"></span>' +
        '                                <span class="carSearch-result-text">查看所有“奥迪”品牌车型</span>' +
        '                            </div>' +
        '                            <div class="carSearch-result-typeText">奥迪A4L</div>-->' +
        '                        </section>' +
        '                        <section class="carSearch-hot padding-left-30 padding-bottom-10 padding-right-30 margin-bottom-20">' +
        '                            <div class="carSearch-hot-title font-size-30 font-weight-blod">热门搜索</div>' +
        '                              <div class="xinche-hot">'+
        '                               {{each hostCar as carlist i}}' +
        '                               <div class="carSearch-hot-block font-size-24 margin-right-20 margin-bottom-20 padding-left-50 padding-right-50" data-index={{i}}>{{carlist.CarSerialName}}</div>' +
        '                               {{/each}}' +
        '                              </div>'+
        '                              <div class="ershouche-hot">'+
        '                              </div>'+
        '                            <div class="clear"></div>' +
        '                        </section>' +
        '                        <section class="noInfoTips margin-top-240">' +
        '                            <span class="font-size-28">无相关信息，请调整关键字</span>' +
        '                        </section>' +
        '                        <section class="pleaseInputSome margin-top-120">' +
        '                            <span class="font-size-28 padding-right-30 padding-left-30">请输入心仪品牌或车型</span>' +
        '                        </section>' +
        '                    </article>' +
        '                </div>' +
        '            </div>' +
        '        </div>' +
        '    </div>';

    return source;
}

CarSearch.prototype.historyHtml = function () {
    var source = '  {{each data as result i}}' +
        '    <div data-name={{result.showname}} class="carSearch-history-content">' +
        '       {{if result.type == "主品牌"}}' +
        '           <span class="carSearch-history-icon"></span>' +
        '           <span class="carSearch-history-text font-size-28 margin-left-20">{{result.showname}}</span>' +
        '       {{else}}' +
        '           <span class="carSearch-history-text font-size-28 margin-left-20">{{result.showname}}</span>' +
        '       {{/if}}' +
        '    </div>' +
        '   {{/each}}' +
        '    <div class="carSearch-history-cleanHistory font-size-28">清除历史记录</div>';
    return source;
}

CarSearch.prototype.searchResultHtml = function () {
    var source = '{{each sreachReuslt as result i}}' +
        '    {{if result.type == "主品牌"}}' +
        '    <div class="carSearch-result-link" data-index={{i}}>' +
        '        <span class="carSearch-result-icon"></span>' +
        '        <span class="carSearch-result-text margin-left-10 font-weight-blod font-size-28">查看所有“{{result.showname}}”品牌车型</span>' +
        '    </div>' +
        '    {{else if result.type == "子品牌"}}' +
        '    <div class="carSearch-result-typeText font-size-28" data-index={{i}}>{{result.showname}}</div>' +
        '    {{/if}}' +
        '    {{/each}}';

    return source;
}


CarSearch.prototype.init = function () {
    //console.log("车型搜索初始化成功...");
    var self = this;
    //请求远程热门车型列表接口
    $.ajaxJSONP({
        url: APIURL + 'api/carrecommend/GetHotSearchCarSerials?callback=?',
        data: { type:"xinche"},
        success: function (data) {
            if (data.Result) {
                if ($('#carSearchAllBiz-container').length == 0) {
                    CarSearch.data = { hostCar: data.Data };
                    //渲染页面
                    self.render();
                }
            } else {
                console.log("请求失败");
            }
        },
        complete: function () {
            //console.log("完成！");
        }
    });
}

CarSearch.prototype.render = function () {
    var self = this;
    //渲染页面
    var render = template.compile(self.templateHtml());
    var html = render(CarSearch.data);
    $('body').append(html);

    self.domOpration();

}

CarSearch.prototype.domOpration = function () {
    var self = this;
    //操作DOM
    $carSearch = $("#carSearchAllBiz-container");
    $carSearch.css({
        'width': '10rem',
        'height': $(window).height(),
    });
    $carSearch.addClass('drawAni');
    
    var $ershoucheHot = $carSearch.find(".ershouche-hot"),
        $xincheHot = $carSearch.find(".xinche-hot");
    $carSearch.addClass('drawAni');
    $header = $carSearch.find('.carSearch-header');
    $wrapper = $carSearch.find('.wrapper');
    $wrapper.height($(window).height() - $header.height());
    //增加二手车热门
    $.ajaxJSONP({
        url: APIURL + 'api/carrecommend/GetHotSearchCarSerials?callback=?',
        data: { type:"ershouche"},
        success: function (data) {
            if (data.Result) {
                var _ershoucheHotData = "";
               $.each(data.Data, function(index, val) {
                    _ershoucheHotData += '<div class="carSearch-hot-block font-size-24 margin-right-30 margin-bottom-30 padding-left-50 padding-right-50" data-index="'+index+'">'+val.CarSerialName+'</div>';
               });
               $ershoucheHot.html(_ershoucheHotData);
            } else {
                console.log("请求失败");
            }
        },
        complete: function () {
            //console.log("完成！");
        }
    });
    //滚动条
    self.myScroll = new IScroll('#carSearchAllBiz-container .wrapper', {
        scrollbars: true,
        shrinkScrollbars: 'scale',
        fadeScrollbars: true,
        click: true
    });
    //选择业务
    var $businessList = $carSearch.find('.select-business-list'),
        $selectBusiness = $carSearch.find('.select-business'),
        $triangleDown = $carSearch.find('.triangle-down');
    $carSearch.on('click','.select-business-list li,.select-business',function(event) {
        event.preventDefault();
        event.stopPropagation();
        if($(this).hasClass('select-business')){
            if($businessList.css("display") == "none"){
                $businessList.show();
                $triangleDown.addClass('triangle-up');
            }else{
                $businessList.hide();
                $triangleDown.removeClass('triangle-up');
            }
        }else{
            $businessList.hide();
            $triangleDown.removeClass('triangle-up');
            var _typeTxt = $(this).text();
            self.businessType = _typeTxt;
            $selectBusiness.text(_typeTxt);
            if(_typeTxt == "新车"){
                $ershoucheHot.hide();
                $xincheHot.show();
            }else if(_typeTxt == "二手车"){
                $ershoucheHot.show();
                $xincheHot.hide();
            }
        }
    });
    $input = $carSearch.find('.carSearch-search-text');


    $(document).on('click',function(event) {
        event.preventDefault();
        event.stopPropagation();
        if($(event.target)!= $businessList && $(event.target).parents(".select-business").length <= 0){
            $businessList.hide();
            $triangleDown.removeClass('triangle-up');
        }
    });
    //关闭按钮
    $carSearch.find('.carSearchAllBiz-close').click(function (e) {
        goBack_backBtn();
    });

    //热门车型
    $hotCar = $carSearch.find('.carSearch-hot');
    $hotCar.on('tap', '.carSearch-hot-block', function (e) {
        var dataIndex = $(e.currentTarget).attr("data-index");
        //console.log(CarSearch.data.hostCar[dataIndex]);
        //回调
        goBack({ hotCar: CarSearch.data.hostCar[dataIndex] });
    });

    //保存历史记录
    var setHistorySearch = function (value) {
        if (localStorage.historySearch) {
            var arr = JSON.parse(localStorage.historySearch);
            if (arr == null) {
                arr = [];
            }
            if (arr.length < 5) {
                var bl = true;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].showname == value.showname) {
                        bl = false;
                        break;
                    }
                }
                if (bl) {
                    arr.push(value);
                }
            } else {
                arr.splice(0, 1);
                arr.push(value);
            }
            localStorage.historySearch = JSON.stringify(arr);
        } else {
            var arr = [value];
            localStorage.historySearch = JSON.stringify(arr);
        }
    }
    var getHistorySearch = function () {
        if (localStorage.historySearch) {
            var arr = JSON.parse(localStorage.historySearch);
            if (arr != null) {
                return arr.reverse();
            } else {
                return [];
            }
        }
        else {
            return [];
        }
    }
    var clearHistorySearch = function () {
        localStorage.historySearch = null;
    }
    //搜索结果
    $carSearchResult = $carSearch.find('.carSearch-result');
    $carSearchResult.on('tap', '.carSearch-result-link,.carSearch-result-typeText', function (e) {
        var dataIndex = $(e.currentTarget).attr("data-index");
        var searchResult = CarSearch.resultData.sreachReuslt[dataIndex];
        //setHistorySearch(searchResult);
        //console.log(searchResult)
        if (searchResult.type == "主品牌") {
            setTimeout(function () {
                $input.blur();
                carSecondLevel.carSecondLevel({
                    showLevel: 2,
                    type: self.defaults.type
                }, { masterBrand: searchResult }, function (result) {
                    //console.log("二级："+result)
                    history.back();
                    goBack(result);
                });
            }, 300);
        } else {
            goBack({ searchCar: searchResult });
        }
    });

    //提示内容
    $noInfoTips = $carSearch.find('.noInfoTips');
    $pleaseInputSome = $carSearch.find('.pleaseInputSome');

    //历史记录
    var $carSearchHistory = null;

    /*$input.focusin(function (e) {
     historyOperation();
     });*/
    /* setTimeout(function(){
     $input.focus();
     },100);*/
    // $('body').tap(function () {
    //     $input.blur();
    // });
    //清空文本按钮
    $input_clear = $carSearch.find('.carSearch-search-text-clear');
    $input_clear.tap(function () {
        $input_clear.hide();
        $input.val("");
        $hotCar.show();
        $carSearchResult.hide();
    });
    $input.off('input');
     /*$input.off('search');
    $input.bind('search')*/
    $input.on('input', function (e) {
        $noInfoTips.hide();
        $pleaseInputSome.hide();

        if ($input.val() == "") {
            $hotCar.show();
            $carSearchResult.hide();
            $input_clear.hide();
            //historyOperation();
        } else {
            $hotCar.hide();
            $input_clear.show();
            if ($carSearchHistory != null) {
                $carSearchHistory.html("");
            }
            self.getAllBrand($input.val());
        }
    });
    $input.on('search', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if ($input.val() == "") {
            $pleaseInputSome.show();
            $pleaseInputSome.animate({ opacity: 0 }, 2000, 'ease-out', function () {
                $pleaseInputSome.hide();
                $pleaseInputSome.css('opacity', 1);
            });
        } else {
            $pleaseInputSome.hide();
            if (CarSearch.resultData.sreachReuslt) {
                if (CarSearch.resultData.sreachReuslt.length > 0) {
                    var searchResult = CarSearch.resultData.sreachReuslt[0];
                    //console.log(searchResult);
                    if (searchResult.type == "主品牌") {
                        // if (window.location.href.search('?') == -1) {
                        //     window.location.href = window.location.href + "?";
                        // }
                        setTimeout(function () {
                            $input.blur();
                            carSecondLevel.carSecondLevel({
                                showLevel: 2,
                                type: self.defaults.type,
                            }, { masterBrand: searchResult }, function (result) {
                                //console.log('主品牌',result);
                                history.back();
                                goBack(result);
                                //alert('主品牌result')
                            });

                         }, 300);
                    } else if (searchResult.type == "子品牌") {
                        //alert('子品牌')
                        goBack({ searchCar: searchResult });
                    }
                }
            }
        }

    });


    function goBack(result) {
        // console.log('goBack',result);
        // console.log(window.location.href)
        $input.blur();
        $carSearch.removeClass('drawAni');
        result.business = self.businessType;

        // if(window.location.href.indexOf("?") >= 0){
        // window.history.replaceState(null, null, _oldUrl);
            // }
        if (self.defaults.hide) {
            setTimeout(function () {
                self.callback(result);
                history.back();
            }, 100);
        }
        else {
            self.callback(result);
        }
        $input_clear.hide();
        $input.val("");
        $hotCar.show();
        $carSearchResult.hide();


        
    }

    function goBack_backBtn() {
        setTimeout(function () {
            history.back();
        }, 100);
    }

    //监听hash变化
    $(window).on('hashchange', function (e) {
        //console.log(e)
        if (e.newURL + "#hideSearch" == e.oldURL) { 
            $carSearch.removeClass('drawAni');

            if(window.location.href.indexOf("?") >= 0){
                window.history.replaceState(null, null, _oldUrl);
            }
            setTimeout(function(){
                $carSearch.remove();
            }, 300)
        }
    });
}

CarSearch.prototype.getHistory = function (data) {
    var self = this;
    var historyData = data;
    var render = function () {
        $carSearch = $("#carSearchAllBiz-container");
        //渲染页面
        //var html = template("carSearchAllBiz-container-history", historyData);
        var render = template.compile(self.historyHtml());
        var html = render(historyData);
        var historyDiv = $carSearch.find('.carSearch-history');
        historyDiv.html(html);
        historyDiv.show();
        self.myScroll.refresh();
    }
    if (historyData.data.length > 0) {
        render();
    } else {
        $carSearch.find('.carSearch-history').html("");
    }
}

CarSearch.prototype.getAllBrand = function (text) {
    var self = this;
    CarSearch.resultData = null;
    $noInfoTips = $carSearch.find('.noInfoTips');
    $.ajaxJSONP({
        url: 'http://59.151.102.96/yichesugforcar.php?callback=?',
        data: { k: text },
        success: function (data) {
            var arr = [];
            for (var index in data) {
                if (data[index].type != "品牌") {
                    arr.push(data[index]);
                }
            }
            CarSearch.resultData = { sreachReuslt: arr };
            //console.log(CarSearch.resultData)
            if (data.length == 0) {
                $noInfoTips.show();
                $carSearchResult.html("");
            } else {
                $noInfoTips.hide();
                render();
            }
        },
        complete: function () {
            //console.log("完成！");
        }
    });

    var render = function () {
        $carSearch = $("#carSearchAllBiz-container");
        //渲染页面
        //var html = template("carSearchAllBiz-container-result", CarSearch.resultData);
        var render = template.compile(self.searchResultHtml());
        var html = render(CarSearch.resultData);
        var resultDiv = $carSearch.find('.carSearch-result');
        resultDiv.html(html);
        resultDiv.show();
        self.myScroll.refresh();
    }
}


var search = function (option, callback) {
    if (typeof callback === "function") {
        if ($('#carSearchAllBiz-container').length == 0) {
            var carSearch = new CarSearch(option, callback);
            carSearch.init();

        }
    } else {
        console.log("错误：此方法只接收回调函数");
    }
    //添加hash
    _oldUrl = window.location.href;
    if(_oldUrl.indexOf("?") <0){
        window.history.pushState(null, null, "?");
    }
    if (window.location.href.search("#hideSearch") == -1) {
        window.location.href = window.location.href + "#hideSearch";
    }
}

module.exports = {
    search: search
}
