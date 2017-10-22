require('zepto/src/touch')
var template = require('libs/template')
var carSecondLevel = require('./carSecondLevel')
var IScroll = require('iscroll')
APIURL = APIURL || "http://api.chedai.bitauto.com/";
if (!dev && APIURL == '/') {
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

function CarSearch(option, callback) {
    this.defaults = {
        type: "xinche",
        hide: false,
        searchText: '',
        levelOrder: 'positive'//弹层排序参数正序positive 倒序reverse
    }
    $.extend(this.defaults, option);

    this.callback = callback;
    this.myScroll = null;
}

CarSearch.prototype.templateHtml = function () {

    var source = '<div id="carSearch-container">' +
        '        <div class="relative-position">' +
        '            <header class="carSearch-header">' +
        '                <span class="carSearch-close"></span>' +
        '                <div class="carSearch-search-content">' +
        '                <form class="car-search-form" action="'+(this.defaults.searchLink || '')+'">' +
        '                <input type="search" class="carSearch-search-text font-size-26" placeholder="'+(this.defaults.searchText || '请输入心仪品牌或车型')+'">' +
        '                </form>' +
        '                <span class="carSearch-search-text-clear"></span></div>' +
        '                <span class="carSearch-search-btn font-size-30">搜索</span>' +
        '            </header>' +
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
        '                        <section class="carSearch-hot">' +
        '                            <div class="carSearch-hot-title">热门搜索</div>' +
        '                            {{each hostCar as carlist i}}' +
        '                            <div class="carSearch-hot-block" data-index={{i}}>{{carlist.CarSerialName}}</div>' +
        '                            {{/each}}' +
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
        data: { type: self.defaults.type },
        success: function (data) {
            if (data.Result) {
                if ($('#carSearch-container').length == 0) {
                    CarSearch.data = { hostCar: data.Data };
                    //console.log(CarSearch.data);
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
    //var html = template("carSelect_SearchTemplate", CarSearch.data);
    var render = template.compile(self.templateHtml(this.defaults));
    var html = render(CarSearch.data);
    $('body').append(html);

    self.domOpration();
}

CarSearch.prototype.domOpration = function () {
    var self = this;
    //操作DOM
    $carSearch = $("#carSearch-container");
    // $carSearch.width($(window).width());
    // $carSearch.height();
    $carSearch.css({
        'width': '10rem',
        'height': $(window).height(),
    });

    $carSearch.show();

    $header = $carSearch.find('.carSearch-header');
    $wrapper = $carSearch.find('.wrapper');
    $wrapper.height($(window).height() - $header.height());
    //滚动条
    self.myScroll = new IScroll('#carSearch-container .wrapper', {
        scrollbars: true,
        shrinkScrollbars: 'scale',
        fadeScrollbars: true,
        click: true
    });

    // 软键盘搜索按钮逻辑
    // 若有输入, 有查询结果，去查询结果第一条;无查询结果不跳转
    // 若设了searchLink，无输入情况下去searchLink(提交表单)
    $('.car-search-form').on('submit', () => {
        const target = CarSearch.resultData && CarSearch.resultData.sreachReuslt && CarSearch.resultData.sreachReuslt[0]
        const value = $('.carSearch-search-text').val()

        if(this.defaults.searchLink && !value){
            window.location.href = this.defaults.searchLink
        }

        if(target){
            $('.carSearch-result-typeText').eq(0).trigger('tap')
            return false
        }

        return false
    })

    //关闭按钮
    $carSearch.find('.carSearch-close').click(function (e) {
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
                carSecondLevel.carSecondLevel({
                    showLevel: 2,
                    type: self.defaults.type
                }, { masterBrand: searchResult }, function (result) {
                    //console.log("二级："+result)
                    goBack(result);
                });
            }, 1000);
        } else {
            goBack({ searchCar: searchResult });
        }
    });

    //提示内容
    $noInfoTips = $carSearch.find('.noInfoTips');
    $pleaseInputSome = $carSearch.find('.pleaseInputSome');

    //历史记录
    var $carSearchHistory = null;
    $input = $carSearch.find('.carSearch-search-text');
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

    //历史记录操作
    /*function historyOperation() {
     self.getHistory({data: getHistorySearch()});
     $carSearchHistory = $carSearch.find('.carSearch-history');

     $carSearchHistory.find('.carSearch-history-content').tap(function (e) {
     $target = $(e.currentTarget);
     var dataName = $target.attr('data-name');
     $input.val(dataName);
     self.getAllBrand($input.val());
     $hotCar.hide();
     $carSearchHistory.html("");
     self.myScroll.refresh();
     });
     $carSearchHistory.find('.carSearch-history-cleanHistory').tap(function (e) {
     clearHistorySearch();
     $carSearchHistory.html("");
     self.myScroll.refresh();
     });
     }*/

    //点击搜索
    $carSearch.find('.carSearch-search-btn').tap(function () {
        //console.log($input.val());
        if ($input.val() == "") {
            if(self.defaults.searchLink){
                window.location.href = self.defaults.searchLink
            }else{
                // $pleaseInputSome.show();
                // $pleaseInputSome.animate({ opacity: 0 }, 2000, 'ease-out', function () {
                //     $pleaseInputSome.hide();
                //     $pleaseInputSome.css('opacity', 1);
                // });
            }
        } else {
            $pleaseInputSome.hide();
            if (CarSearch.resultData.sreachReuslt) {
                if (CarSearch.resultData.sreachReuslt.length > 0) {
                    var searchResult = CarSearch.resultData.sreachReuslt[0];
                    //console.log(searchResult);
                    if (searchResult.type == "主品牌") {
                        setTimeout(function () {
                            carSecondLevel.carSecondLevel({
                                showLevel: 2,
                                type: self.defaults.type
                            }, { masterBrand: searchResult }, function (result) {
                                //console.log("二级："+result)
                                goBack(result);
                            });
                        }, 1000);
                    } else if (searchResult.type == "子品牌") {
                        goBack({ searchCar: searchResult });
                    }
                }
            }
        }
    });

    function goBack(result) {
        if (self.defaults.levelOrder == "reverse") {
            if (self.defaults.hide) {
                setTimeout(function () {
                    //self.callback(result);
                    window.carSelectThirdLevelCallback(result);
                    history.back();
                }, 100);
            }
            else {
                //self.callback(result);
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

    function goBack_backBtn() {
        setTimeout(function () {
            history.back();
        }, 100);
    }

    //监听hash变化
    $(window).on('hashchange', function (e) {
        //console.log(e)
        if (e.newURL + "#hideSearch" == e.oldURL) {
            $carSearch.remove();
        }
    });

    $('.car-search-form input').focus()
}

CarSearch.prototype.getHistory = function (data) {
    var self = this;
    var historyData = data;
    var render = function () {
        $carSearch = $("#carSearch-container");
        //渲染页面
        //var html = template("carSearch-container-history", historyData);
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
        $carSearch = $("#carSearch-container");
        //渲染页面
        //var html = template("carSearch-container-result", CarSearch.resultData);
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
        if ($('#carSearch-container').length == 0) {
            var carSearch = new CarSearch(option, callback);
            carSearch.init();
        }
    } else {
        console.log("错误：此方法只接收回调函数");
    }
    //添加hash
    if (window.location.href.search("#hideSearch") == -1) {
        window.location.href = window.location.href + "#hideSearch";
    }
}

module.exports = {
    search: search
}
