import './detail.scss';

import 'jquery.lazyload';
import Swiper from 'libs/swiper/2.0';
// import selCar from 'libs/carSelect/selCar.pc.js';
import check from 'libs/check';
import carPhotos from 'libs/carPhotos';

/*  货币格式化  */
function formatCurrency(num, _bool) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
    if (_bool) {
        return (((sign) ? '' : '-') + num + '.' + cents);
    } else {
        return (((sign) ? '' : '-') + num);
    }
};

var DetailPage = function () {
    //吸顶以及右侧吸底特效DOM缓存
    this.ceilingBox = $("#ceilingBox");
    this.ceilingBoxPos = $('#details-con').offset().top;
    this.detailsLeftTop = $(".details-left-box").offset().top;

    this.userEvaluate = $("#userEvaluate");
    this.commonProblem = $("#commonProblem");
    this.listPagination = $("#listPagination");

    //滚动状态
    this.rollingState= true;
    this.pageSize = 10;
    this.pageIndex = 1;
};

DetailPage.prototype = {
    init: function () {
        var self = this;

        setTimeout(function() {
            self.ceilingBoxPos = $('#details-con').offset().top;
            self.detailsLeftTop = $(".details-left-box").offset().top;
            // alert(self.detailsLeftTop )
        }, 300);

        // 车图
        carPhotos.opts({})//配置相关参数需要时可以配置不需要可以省略
        carPhotos.init();//启动
        if ($('#SPhotosList li').length <= 4) {
            $('.carphoto .photos-prev-btn, .carphoto .photos-next-btn').hide();
        }

        // 顾问电话
        self.getAdviserTel();

        //form表单
        this.formDom = $("#orderInfoForm");
        this.formDom.attr("action",loanOrderApplyUrl);
        self.renderDom();
        self.dynamicLayout();

        //用户评价
        //self.getUserEvaluate(); //变为第一页直接输出之后再异步
        //tools.listPagination("listPagination", 1, 1);
        self.bindCommentsPagedEvent();

    },
    //修正位置
    correctPosition:function(){
        var self = this;
        setTimeout(function(){
            //重新获取定位(修正位置)
            self.ceilingBoxPos = $('#details-con').offset().top;
            self.detailsLeftTop = $(".details-left-box").offset().top;
        },500)
    },
    //渲染DOM及特效
    renderDom: function () {
        var self = this;

        //选择、资质下拉菜单事件
        $.each($("#Content .select-ctrl"), function (index, item) {
            $(item).selectControl(selCallBack,"click","notRender");
        });
        //下拉菜单的返回方法
        function selCallBack(selDataId, selText, item, selCategory, oldObj,link) {
            // if(link){
            //    window.location.href = link;
            // }
        }

        // 选择城市
        $(".sel-city-box2").selCity({
            loadCityUrl:APIURL +"/api/Common/GetSupportGroupingCityList?packageId="+product.packageID +"&carId="+car.carId,
            isRelationHeader:true
        });

        window.selCityCallback = function(obj) {
            $(".sel-city-box .city-con, .sel-city-box2 .city-con").attr("data-id",obj.cityId).text(obj.cityName);
            var loc = window.location.href.replace(new RegExp(city.citySpell,"g"), obj.citySpell);
            window.location.href = loc;
        };

        //开启惰性加载
        $("img.lazy").lazyload({
            effect: "fadeIn"
        });

        // todo wtf
        /* check.telChannel('detailTel', 'feedMobile', BusinessLine, {
            'CityId': city.cityId,
            'CityText': city.cityName,
            'PageType': 6,//入口页类型 1-首页 2-列表页结果区 3-列表页无结果 4-按预算列表无结果 5-列表页底部 6-详情页
            'CarId': car.carId,
            'PackageId': '',
            'CarText': car.carSerialShowName+car.carName,
            'CompanyId': dealer.dealerId,
            'PackageText': product.packageName,
            'statisticalMarker': 'pc-xinche-detail-btn-tel-channel'
        }); */

        self.bindEvent();

    },

    //吸顶吸底的动态布局
    dynamicLayout:function(){
        var self = this;

        //吸顶判断
        // console.log($('#details-con').offset().top)
        if ($(window).scrollTop() > $('#details-con').offset().top) {
            if (!self.ceilingBox.hasClass('fixed')) {
                self.ceilingBox.css({
                    position: 'fixed'
                });
                self.ceilingBox.find('.btn-wrap .tag').stop().fadeIn('fast');
                self.ceilingBox.addClass('fixed');
            }
            self.ceilingBox.css({
                left: $('#details-con').offset().left - $(window).scrollLeft()
            });
        } else {
            if (self.ceilingBox.hasClass('fixed')) {
                self.ceilingBox.css({
                    position: 'absolute',
                    left: 0
                });
                self.ceilingBox.find('.btn-wrap .tag').stop().fadeOut('fast');
                self.ceilingBox.removeClass('fixed');
            }
        }

        //贷款详情等按钮
        if(self.rollingState){
            if($(window).scrollTop() >= self.commonProblem.offset().top){
                self.ceilingBox.find("[data-name = 'commonProblem']").addClass("cur").siblings("a").removeClass("cur");
            }else if ($(window).scrollTop() >= self.userEvaluate.offset().top && $(window).scrollTop() < self.commonProblem.offset().top) {
                self.ceilingBox.find("[data-name = 'userEvaluate']").addClass("cur").siblings("a").removeClass("cur");
            } else {
                self.ceilingBox.find("[data-name = 'loanDetails']").addClass("cur").siblings("a").removeClass("cur");
            }
        }
    },

    //绑定事件
    bindEvent: function () {
        var self = this;
        //滚动判断
        $(window).on("scroll resize", function () {
            self.dynamicLayout();
        });

        // 导航锚点
        $(".product-intro-title a").bind('click', function (e) {
            $(this).addClass("cur").siblings('a').removeClass("cur");

            self.rollingState = false;
            var _idName = "#" + $(this).attr("data-name"),
                _itemTop;

            /* if (self.ceilingBox.css("position") === "fixed") {
                _itemTop = ($(_idName).offset().top - 20) + "px";
            } else {
                _itemTop = ($(_idName).offset().top - 50) + "px";
            } */
            _itemTop = ($(_idName).offset().top) + "px";

            $('html,body').animate({
                "scrollTop": _itemTop
            }, 500);
            setTimeout(function(){
                self.rollingState  = true;
            },600);
        });

        // 下单
        $("#Content .apply-btn").bind('click', function() {
            if(!$(this).hasClass("disabled")){
                tools.isApply(function(bln){
                    if(bln){
                        self.applyNow();
                    }
                });
            }
        });
    },
    //立即申请
    applyNow: function(){

        var self = this;

        //source, from
        var source = tools.getUrlParam("source") || window.source,
            from = tools.getCookie('from') || window.from,
            orderForm = self.formDom;

        orderForm.find('input[name="Orders"]').val(product.packageID + "_" + product.productID + "_0");
        orderForm.find('input[name="CarId"]').val(car.carId);
        orderForm.find('input[name="CityId"]').val(city.cityId);
        orderForm.find('input[name="CarPrice"]').val(car.carPrice);
        // orderForm.find('input[name="AdviserId"]').val(self.adviserId || '');
        orderForm.find('input[name="Source"]').val(typeof source !== 'undefined' && source ? source : 0);
        orderForm.find('input[name="From"]').val(typeof from !== 'undefined' && from ? from : 0);
        orderForm.find('input[name="Channel"]').val(typeof channel !== 'undefined' && channel ? channel : 0);
        orderForm.find('input[name="Shop"]').val(typeof shop !== 'undefined' && shop ? shop : 0);
        orderForm.find('input[name="OrderType"]').val(3);

        //经销商
        if (typeof dealer !== 'undefined' && dealer.dealerId) {
            orderForm.find('input[name="DealerId"]').val(dealer.dealerId);
            orderForm.find('input[name="DealerName"]').val(dealer.dealerName);
            if (dealer.dealerTel) {
                orderForm.find('input[name="DealerTelphone"]').val(dealer.dealerTel);
            }
        }

        self.formDom.submit();
    },

    // 顾问电话
    getAdviserTel: function() {
        var self = this;
        var _url = adviserApi + `/v2/group/getextenlist/`;
        self.sendAjax({
            url: _url,
            data: {
                CityId: window.city.cityId,
                CompanyIds: window.companyID,
                BusinessLineId: window.BusinessLine
            },
            dataType: 'jsonp'
        }, adviserList, sendAgain);

        //获取成功
        function adviserList(result) {  // todo check
            let _adviserId = '',
                _adviserTitleHtml = '',
                _advTelStr='',
                _advTelStrHtml01 = '',
                _advTelStrHtml02 = '',
                _adviserListHtml = '',
                _adviserIdHtml = '';
            var fomatPhone = function(phone) {
                return phone.slice(0,4) + '-' + phone.slice(4,7)  + '-' + phone.slice(7,phone.length);
            };
            if(!result.Total) {
                _adviserTitleHtml = `<em>4000-598-598</em>`;
            } else {
                var data = result.Data[0],
                    _advLength = data.CallGroup.length;
                _adviserTitleHtml += `<em>${fomatPhone(data.CallGroup[0].CN400)}</em>`;
                if (_advLength > 1) {
                    _adviserListHtml = '<dt>直接联系我们：</dt>'
                    for (let i = 0; i < _advLength; ++i) {
                        _adviserListHtml += ' <dd><span class="num"><em>' + fomatPhone(data.CallGroup[i].CN400) + '</em></span></dd>';
                    }
                }
            }

            let isWhiteBg = !result.Total || _advLength <= 1 ?true:false;
            _adviserIdHtml = `<span class="tel-box">${_adviserTitleHtml}</span>
                              <span class="adv-list hide">
                                <span class="adv-box">
                                  <dl>
                                    ${_adviserListHtml}
                                  </dl>
                                  <span class="${isWhiteBg?'adviser-tip bg-white':'adviser-tip'}">
                                    <b>小贴士 : </b>顾问服务时间为 <font>9:00-21:00</font>，<br/>我们将为您提供免费的贷款咨询及申请服务，期待您的来电！
                                  </span>
                                </span>
                              </span>`;

            $(".car-infomation .advice-btn")
                .css('display', 'inline-block')
                .html(_adviserIdHtml)
                .bind({
                    'mouseenter': function() {
                        $(this).find('.adv-list').stop().fadeIn();
                    },
                    'mouseleave': function() {
                        $(this).find('.adv-list').stop().fadeOut();
                    }
                });
        };

        // 出错后重新加载
        function sendAgain(info) {
            self.sendAjax({
                url: _url,
                dataType: 'jsonp'
            }, adviserList, sendAgain);
        };
    },

    //评价列表
    getUserEvaluate: function(){
        var self = this;
        this.sendAjax({
                url: GetRecentOrders,
                type: 'GET',
                data: {
                    // carId: car.carId,
                    // productId: product.productID,
                    pageIndex: self.pageIndex,
                    pageSize: self.pageSize
                },
                dataType:"json"
            },
            function (res) {
                var htmlstr = '<table>' +
                                    '<tr>' +
                                        '<th>购车人</th>' +
                                        '<th>所在城市</th>' +
                                        '<th>选择车型</th>' +
                                        '<th>成交时间</th>' +
                                    '</tr>';
                for (var i = 0; i < res.Data.length; i++) {
                    var time = /\d+/.exec(res.Data[i].CreateTime);
                    htmlstr +=  `<tr>` +
                                    `<td>${self.formatMobile(res.Data[i].Telphone)}</td>` +
                                    `<td>${res.Data[i].CityName}</td>` +
                                    `<td>${res.Data[i].CarFullName}</td>` +
                                    `<td>${time ? self.formatTime(parseInt(time[0])) : ''}</td>` +
                                `</tr>`;
                }
                $("#pagedCommentDiv").html(htmlstr);
            },
            function (textStatus) { });
    },

    bindCommentsPagedEvent:function(){
        var self = this;

        if(totalComments>self.pageSize){
            $("#listPagination").show();
        }else{
            $("#listPagination").hide()
        }
        var pageCount = Math.ceil(totalComments/self.pageSize);
        self.getUserEvaluate();
        tools.listPagination("listPagination", pageCount, self.pageIndex, callBacks);

        function callBacks(pageindex) {
            self.pageIndex = pageindex;
            self.getUserEvaluate();
            $('html,body').stop().animate({
                "scrollTop": $("#userEvaluate").offset().top
            },500);
        }
    },

    add0: function(m){
        return m<10?'0'+m:m
    },

    formatTime: function(shijianchuo){
        var self = this;
        //time是整数，否则要parseInt转换
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        return y+'-'+self.add0(m)+'-'+self.add0(d);
    },

    formatMobile: function(mobile) {
        return mobile.slice(0, 3) + '****' + mobile.slice(7, mobile.length);
    },

    //ajax
    sendAjax: function (options, _callback, _errorcallback) {
        var self = this;
        var setting = {
            url: '',
            timeout: 5000,
            type: 'get',
            dataType: 'json',
            cache: true,
            async: true,
            data: {}
        };
        setting = $.extend(setting, options);
        $.ajax({
            url: setting.url,
            type: setting.type,
            dataType: setting.dataType,
            async: setting.async,
            cache: setting.cache,
            data: setting.data,
            beforeSend: function () {
            },
            success: function (res) {
                _callback(res);
            },
            complete: function (XMLHttpRequest, textStatus) {
                if (status == 'timeout') {//超时,status还有success,error等值的情况
                    _errorcallback(textStatus);
                }
            }
        })
    }
};

$(function () {
    var detailPage = new DetailPage();
    detailPage.init();
});
