'use strict';

import '../css/ershouche.scss'
import './detail.scss'
import 'libs/swiper';
import Chart from 'Chart.js';

//声明变量
import app from '../script/app';
import XTK from '../script/XTK';
import Store from '../script/Store';
import YXSlider from 'libs/yxSlider';
import iScroll from 'iScroll';

var loadingBox = $(".loading-box");
var arry = [];
var indexShouFu;
var indexYuegong;
var isComment = false;
var isLoadList = false;
var pop_productID = 0;
var pop_packageid = 0;
Store.ershoucheAPI = ershoucheUrl;
Store.xincheAPI = xincheUrl;
XTK.ershoucheAPI = ershoucheUrl;
XTK.xincheAPI = xincheUrl;
var $CommentDom = $('[action="GET-COMMENT-LIST"]');
$(document).ready(function() {
    XTK.Action.bind();
    detail.initDetail();
});
var detail = {
    initDetail: function() {
        var _this = this;
        _this.swiperDetail();
        _this.detailsTabs();
        _this.MoreRecommended();
        _this.botAdviser();
        _this.downPaymentPeriod();
        _this.eQEvent();
        _this.loanAdviser();
    },
    sendAjax: function(options, _callback, _errorcallback) {
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
            beforeSend: function() {

            },
            success: function(res) {
                _callback(res);
            },
            complete: function(XMLHttpRequest, textStatus) {
                if (status == 'timeout') {
                    //超时,status还有success,error等值的情况
                    _errorcallback(textStatus);
                }
            }
        })
    },
    //tab 组件
    tabs: function(tabLi, conterDiv) {
        $(tabLi).eq(0).addClass('cur');
        $(conterDiv).eq(0).removeClass('hide');
        $(tabLi).click(function() {
            var _this = $(this);
            $(tabLi).removeClass('cur');
            _this.addClass('cur');

            $(conterDiv).addClass('hide');
            var activeTab = _this.attr('data-id');
            $('#' + activeTab).removeClass('hide');
            if ($(this).attr('action') && $(this).attr('action') == 'GET-COMMENT-LIST') {
                isComment = true;
            } else {
                isComment = false;
            }
            return false;
        });
    },
    //画圆环图形
    doughnutChart: function(downPaymentChart) {
        //
        var data = {
            labels: [],
            datasets: downPaymentChart
        };
        var options = {
            responsive: true,
            cutoutPercentage: 50,
            onAnimationComplete: function() {},
            animation: {
                animateScale: false,
                animateRotate: true
            },
            elements: {
                arc: { backgroundColor: 'rgb(255, 0, 0)', borderColor: 'rgb(0, 0, 255)', borderWidth: 0, hoverBackgroundColor: 'rgb(255, 255, 255)' }
            },
            tooltips: {
                enabled: false
            }
        }
        var ctx = document.getElementById("myChart");
        var myDoughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: options,
            events: {

            }
        });
    },
    //贷款顾问
    loanAdviser: function() {
        var self = this;
        var _url = adviserApi + "v2/group/getadviserlist?CityId=" + cityInfo.cityId + "&CompanyIds=" + companyID + "&BusinessLineId=551";
        self.sendAjax({
            url: _url,
            dataType: 'jsonp',
        }, adviserList, sendAgain);

        //获取成功
        function adviserList(result) {
            if (result.Data != null && result.Data[0] != null) {
                var ad = result.Data[0].Adviser;
                var html = `<ul style="">
                <li>
                    <div class="gotoAdviser" data="${ad.Id}"><img
                            src="${ad.Photo}">
                    </div>
                    <div class="gotoAdviser" data="${ad.Id}">
                        <p class="font-ctn"><span>${ad.Name}</span><i class="adviser-level skillLevel-${ad.SkillLevelId}"></i></p>
                        <p class="font-22">已帮${ad.ServeNumber}人贷款</p>
                    </div>
                    <a href="tel:${ad.CN400}"></a>
                </li>
            </ul>`;
                $('#adviserLayerCon').html(html);
                $('.adviser-list').html(html);
                $('.but_adviser').show();
            } else {
                $('#adviserLayerCon').html('');
                $('.adviser-list').html('');
                $('.but_adviser').hide();
            }

        }
        // 出错后重新加载
        function sendAgain(info) {
            self.sendAjax({
                url: _url,
                dataType: 'jsonp'
            }, adviserList, sendAgain);
        };
    },
    //swiper 系列
    swiperDetail: function() {
        //产品特点更多 nowrap
        var proFeat = $('.product-features'),
            productDiv = proFeat.find('.f24').length;
        proFeat.addClass('nowrap')
        proFeat.find('.more').addClass('hide');
        proFeat.find('.product-features-more').addClass('hide');
        if (productDiv > 3) {
            for (var i = 3; i < productDiv; i++) {
                proFeat.find('.f24').eq(i).addClass('hide');
            }
            proFeat.find('.more').addClass('hide');
            proFeat.find('.product-features-more').removeClass('hide');
        } else {
            proFeat.find('.more').addClass('hide');
        }
        $('.product-features-more').on('click', function() {
            var _this = $(this);
            _this.addClass('hide')
            $('.product-features').removeClass('nowrap');
            proFeat.find('.more').removeClass('hide');
            for (var i = 3; i < productDiv; i++) {
                proFeat.find('.f24').eq(i).removeClass('hide');
            }

        })
        $('.product-features .more').on('click', function(e) {
                var _this = $(this);
                _this.addClass('hide');
                $('.product-features').addClass('nowrap');
                $('.product-features-more').removeClass('hide')
                for (var i = 3; i < productDiv; i++) {
                    proFeat.find('.f24').eq(i).addClass('hide');
                }
            })
            //<!--产品图 swiper start-->
        var mySwiper = new Swiper('#detailSwiper .swiper-container', {
            loop: true,
            pagination: '#detailSwiper .swiper-pagination',
            paginationType: 'fraction',
            //new add
            autoplayDisableOnInteraction: false,
            observer: true,
            observeParents: true,
            onSlideChangeEnd: function(swiper) {
                swiper.update();
            },
        })
        $CommentDom.attr('data-commentCount', commentCount);
        //明细
        $('#detailPrice').click(function() {
            $('#maskLayer').css({ 'display': 'block' })
            $('#priceListLayer').css({ 'display': 'block' })
            var mt = -($('#priceListLayer').height()) / 2 + 'px';
            $('#priceListLayer').css({ 'margin-top': mt })
            $('body').bind('touchmove', function(e) {
                e.preventDefault()
            })
        })
        $('#priceListLayer .close').click(function() {
                $('#maskLayer').css({ 'display': 'none' })
                $('#priceListLayer').css({ 'display': 'none' })
                $('.financial_button_box').hide();
                $('body').unbind('touchmove');
            })
            //精真估弹层
        var maskLayer = $("#maskLayer"),
            financialPlanLayer = $("#financialPlanLayer"),
            priceListLayer = $("#priceListLayer"),
            adviserLayer = $("#adviserLayer"),
            financial_button_box = $('.financial_button_box'),
            jingzhenguLayer = $("#jingzhenguLayer");
        $("#jingzhengu").on('click', function(e) {
            maskLayer.show().css({ 'opacity': '0.6' });
            jingzhenguLayer.show();
            var _url = $("#jingzhenguIframe").attr("data-src");
            $("#jingzhenguIframe").attr("src", _url + "?v=" + new Date().getTime());
            $('body').css({ "overflow": "hidden", "height": "100%", "position": "fixed", "width": "100%" });
        });
        $("#jingzhenguLayer i,#maskLayer").on('click', function(e) {
            $('body').css({ "overflow": "visible", "height": "auto", "position": "static", "width": "auto" });
            maskLayer.hide();
            jingzhenguLayer.hide();
            financialPlanLayer.hide();
            financial_button_box.hide();
            priceListLayer.hide();
            adviserLayer.hide();
            $('body').unbind('touchmove');
        });
        $('.financial_button_box').hide();
    },
    // 贷款详情 用户评价 易问答
    detailsTabs: function() {
        detail.tabs('.details_tabs_box .tabs_ul li', '.details_tabs_box .tabs_content');
    },
    //更多推荐  最新成交
    MoreRecommended: function() {
        //json日期格式转换为正常格式
        function jsonDateFormat(jsonDate) {
            try {
                var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));
                var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var seconds = date.getSeconds();
                var milliseconds = date.getMilliseconds();
                return date.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + "." + milliseconds;
            } catch (ex) {
                return "";
            }
        }
        var _MoreData = {
                cityId: cityId_local,
                UCarId: v_ucarId,
                productId: v_productID,
                DisplayPrice: ucarPrice,
                MainBrandID: 32
            }
            //更多推荐
        Store.getRecommendCarList(_MoreData).then(function(result) {
            var data = result;
            if (result) {
                var h = "";
                for (var i = 0; i < data.Data.length; i++) {
                    var csn = "";
                    var carDate = data.Data[i].BuyCarDate,
                        carDateTxt = "";
                    carDate = jsonDateFormat(carDate);
                    carDate = carDate.split('-');
                    if (carDate[0] == '0001') {
                        carDateTxt = '未上牌';
                    } else {
                        carDateTxt = carDate[0] + "年上牌";
                    }
                    //1:原厂质保;2:延长质保;5:原厂质保+免费过户;6:延长质保+免费过户);
                    if (data.Data[i].WarrantyTypes == 1) {
                        csn = '<span class="icon_txt green">原厂质保</span>';
                    } else if (data.Data[i].WarrantyTypes == 2) {
                        csn = '<span class="icon_txt green2">延长质保</span>';
                    } else if (data.Data[i].WarrantyTypes == 5) {
                        csn = '<span class="icon_txt blue">免费过户</span>';
                    } else if (data.Data[i].WarrantyTypes == 6) {
                        csn = '<span class="icon_txt blue">免费过户</span>';
                    } else {
                        csn = '';
                    }
                    var is_youzhi = ''
                    if (data.Data[i].OrderNum == '10') {
                        is_youzhi = '<i class="free_transfer"></i>'
                    }
                    h += '<li><a href="/' + data.Data[i].CarCityId + '/u' + data.Data[i].UcarID + '?source=' + source + '&channel=' + channel + '">' +
                        '<div class="img">' + is_youzhi + '<img src="' + data.Data[i].FirstPicturePath.split("|")[0] + '" /></div>' +
                        '<div class="text"><div class="name">' + data.Data[i].CarFullName + '</div>' +
                        '<div class="car_info">' +
                        '<span class="info">' + carDateTxt + '/' + parseFloat((data.Data[i].Drivingmileage / 10000).toFixed(2)) + '万公里</span>' + csn + '</div><div class="price"><span class="price_txt">首付：</span>' +
                        '<span class="price_nub">' + (data.Data[i].DownPaymentAmount >= 1 ? data.Data[i].DownPaymentAmount.toFixed(2) + "万" : parseInt(data.Data[i].DownPaymentAmount * 10000) + '元') + '</span>' +
                        '<span class="price_txt">&nbsp;&nbsp;&nbsp;月供：</span>' +
                        '<span class="price_nub">' + (data.Data[i].MonthlyPayment >= 1 ? data.Data[i].MonthlyPayment.toFixed(2) + "万" : parseInt(data.Data[i].MonthlyPayment * 10000) + '元') + '</span>' +
                        '</div>' +
                        '</div>' +
                        '</a></li>'
                }
                $("#MoreRecommended .MoreRecommended_ul").html(h) //.show();
            }
        })
        var _data = {
                cityId: cityId_local,
                UCarId: v_ucarId,
                productId: v_productID,
                DisplayPrice: ucarPrice,
                MainBrandID: 32,
                SoldOrUnSold: 1
            }
            //最新成交
        Store.getRecommendCarList(_data).then(function(result) {
            var data = result;
            if (result) {
                var h = "";
                for (var i = 0; i < data.Data.length; i++) {
                    var csn = "";
                    var carDate = data.Data[i].BuyCarDate,
                        carDateTxt = "";
                    carDate = jsonDateFormat(carDate);
                    carDate = carDate.split('-');
                    if (carDate[0] == '0001') {
                        carDateTxt = '未上牌';
                    } else {
                        carDateTxt = carDate[0] + "年上牌";
                    }

                    h += '<li><a href="/' + data.Data[i].CarCityId + '/u' + data.Data[i].UcarID + '?source=' + source + '&channel=' + channel + '">' +
                        '<div class="img"><span class="deal_img"></span><img src="' + data.Data[i].FirstPicturePath.split("|")[0] + '" /></div>' +
                        '<div class="text"><div class="name">' + data.Data[i].CarFullName + '</div>' +
                        '<div class="car_info">' +
                        '<span class="info">' + carDateTxt + '/' + parseFloat((data.Data[i].Drivingmileage / 10000).toFixed(2)) + '万公里</span>' + '</div><div class="price"><span class="price_txt">首付：</span>' +
                        '<span class="price_nub">' + (data.Data[i].DownPaymentAmount >= 1 ? data.Data[i].DownPaymentAmount.toFixed(2) + "万" : parseInt(data.Data[i].DownPaymentAmount * 10000) + '元') + '</span>' +
                        '<span class="price_txt">&nbsp;&nbsp;&nbsp;月供：</span>' +
                        '<span class="price_nub">' + (data.Data[i].MonthlyPayment >= 1 ? data.Data[i].MonthlyPayment.toFixed(2) + "万" : parseInt(data.Data[i].MonthlyPayment * 10000) + '元') + '</span>' +
                        '</div>' +
                        '</div>' +
                        '</a></li>'
                }
                $("#latestDeal .MoreRecommended_ul").html(h)
            }
        })
        detail.tabs('.tabs_ul_more li', '.details_tabs_more .tabs_content')
    },
    //顾问 切换金融方案 立即申请
    botAdviser: function() {
        var _this = this;
        $("#but_apply").click(function() {
            _this.applyNow();
        });
        //切换金融方案
        $('.but_loan').on('click', function() {
            if (isLoadList == false) {
                isLoadList = true;
                _this.getFinancial();
            }
            $('#maskLayer').css({ 'display': 'block' })
            $('body').bind('touchmove', function(e) {
                e.preventDefault()
            })
            setTimeout(function() {
                $('#financialPlanLayer').css({ 'display': 'block' })
                $('.financial_button_box').show();
                $('.shortcontent').removeClass('hide');
                $('.longcontent').addClass('hide');
                var $i = $('.item').find('#i0');
                if ($i.attr('class') != 'icon-ok') {
                    $i.click();
                }
                var financialIscroll = new iScroll("#financialIscroll", {
                    'preventDefault': false,
                    'bounce': false
                });
            }, 200)
        })
        $('#financialPlanLayer .close').click(function() {
                $('#maskLayer').css({ 'display': 'none' })
                $('#financialPlanLayer').css({ 'display': 'none' })
                $('body').unbind('touchmove')
                $('.financial_button_box').hide();
            })
            //顾问
        $('.but_adviser').click(function() {
            $('#maskLayer').css({ 'display': 'block' })
            $('#adviserLayer').css({ 'display': 'block' })
            $('body').bind('touchmove', function(e) {
                e.preventDefault()
            })
            var adviserScroll = new iScroll("#adviserLayerCon", {
                'preventDefault': false,
            });
        })
        $('#adviserLayer .close').click(function() {
            $('#maskLayer').css({ 'display': 'none' })
            $('#adviserLayer').css({ 'display': 'none' })
            $('body').unbind('touchmove')
        })
    },
    getFinancial: function() {
        var _this = this;
        var html = '';
        var params = {
            carid: v_carId,
            carPrice: ucarPrice,
            cityid: cityId_local,
            packageId: packageId
        }
        var pidlist = [];
        Store.getPackageList(params).then((result) => {
            for (let i = 0; i < result.Data.length; i++) {
                var p = result.Data[i];
                pidlist.push(p);
                html += '<li class="item"  id="li' + i + '">';
                html += '<i id="i' + i + '"" packageId="' + p.ID + '" v_productID="' + p.ProductId + '" name="icon"  data-id="' + i + '" class="icon"></i>';
                html += '<div id="shortcontent' + i + '""  data-id="' + i + '" class="shortcontent">';
                html += '<div class="img"><img src="' + p.CompanyLogoUrl + '"/></div>';
                html += '<div class="txt">';
                html += '<div class="financial_name">' + p.PackageName + '</div>';
                html += '<div class="txt_info">';
                html += ' <span>首付' + p.DownPaymentRate * 100 + '%:<font>¥' + tools.addCmma(p.DownPaymentText) + '</font></span>';
                html += '<span>月供' + p.RepaymentPeriod + '期:<font>¥' + tools.addCmma(p.MonthPaymentText) + '</font></span>';
                html += '<span class="tip_bot" id="tip_bot' + i + '" style="display:none;"  data-id="' + i + '"><i></i></span>';
                html += '</div>';
                html += '</div>';
                _this.getHtml(p, i);
                html += '</li>';
            }
            html += '<div style="height:1.46666rem"><div>';
            $('.financial_plan_ul').html(html);
            //展开当前金融产品
            $('.tip_bot').click(function() {
                var id = $(this).attr('data-id');
                $('#shortcontent' + id).addClass('hide');
                $('#longcontent' + id).removeClass('hide');
                var financialIscroll = new iScroll("#financialIscroll", {
                    'preventDefault': false,
                    'bounce': false
                });
                financialIscroll.scrollToElement('#longcontent' + id, 100);
            });
            //展开当前金融产品
            $('.shortcontent').click(function() {
                var id = $(this).attr('data-id');
                $('#shortcontent' + id).addClass('hide');
                $('#longcontent' + id).removeClass('hide');
                var financialIscroll = new iScroll("#financialIscroll", {
                    'preventDefault': false,
                    'bounce': false
                });
                financialIscroll.scrollToElement('#longcontent' + id, 100);
            });
            //选择当前金融产品
            $('i[name="icon"]').click(function() {
                var c = $(this).attr('class');
                if (c == 'icon') {
                    $('i[name="icon"]').attr('class', 'icon');
                    $(this).attr('class', 'icon-ok');
                    pop_packageid = $(this).attr('packageId');
                    pop_productID = $(this).attr('v_productID');
                } else {
                    $(this).attr('class', 'icon');
                }
                if ($('.icon-ok').length > 0) {
                    $('#financial_but_apply_no').hide();
                    $('#financial_but_apply').show();
                } else {
                    $('#financial_but_apply').hide();
                    $('#financial_but_apply_no').show();
                }
            });
            $('#financial_but_apply').click(function() {
                _this.popApplyNow();
            })
            var financialIscroll = new iScroll("#financialIscroll", {
                'preventDefault': false,
                'bounce': false
            });
            var $i = $('.item').find('#i0');
            if ($i.attr('class') != 'icon-ok') {
                $i.click();
            }
        })
    },
    getYXSlider: function(product, i) {
        var _this = this;
        if ($('#index_shoufu' + product.ID)[0]) {
            arry[i] = [];
            arry[i][0] = new YXSlider('index_shoufu' + product.ID, [
                { 'text': 20, 'isDisable': false, 'isDefault': true, 'unit': '%' }
            ], (data) => {
                _this.getDownPaymentPeriodByProductID(data.ProductID, i)
            })
            arry[i][1] = new YXSlider('index_yuegong' + product.ID, [
                { 'text': 12, 'isDisable': false, 'isDefault': true, 'unit': '期' }
            ], (data) => {
                _this.getDownPaymentPeriodByProductID(data.ProductID, i)
            });
            _this.loadData(product.ProductId, arry[i][0], arry[i][1], 2);
        }
    },
    getHtml: function(p, index) {
        var _this = this;
        var params = {
            carPrice: ucarPrice,
            productId: p.ProductId,
            carId: v_carId
        }
        Store.calculateLoanInfo(params).then((res) => {
            if (res.Result) {
                var _downPayment = res.Data.downPayment * 10000,
                    _loanAmount = res.Data.loanAmount * 10000,
                    _totalCost = res.Data.totalCost * 10000,
                    _monthlyPayment = res.Data.monthlyPayment * 10000,
                    _finalPaymentAmount = res.Data.finalPaymentAmount * 10000,
                    _interestRate = res.Data.interestRate * 100,
                    _totalInterest = res.Data.totalInterest * 10000,
                    _serviceFee = res.Data.serviceFee * 10000,
                    _purchaseTax = res.Data.purchaseTax * 10000,
                    _finalPaymentRate = res.Data.finalPaymentRate,
                    _totalExpenses = _downPayment + _totalCost + _loanAmount;
                var html = '';
                html += '<div id="longcontent' + index + '" class="longcontent hide">';
                html += '<div class="title">';
                html += '<div class="img"><img src="' + p.CompanyLogoUrl + '"></div>';
                html += '<div class="financial_name f24">' + p.PackageName + '</div>';
                html += '<div class="financial_btn">';
                html += ' <a id="longcontent_a' + index + '" href="/' + cityInfo.citySpell + '/u' + v_ucarId + '/p' + p.ProductId + '?source=' + source + '&channel=' + channel + '">查看详情</a>';
                html += '</div>';
                html += '</div>';
                html += ' <div class="sel-items">';
                html += '<h3>首付<span id="index_shoufu_text' + index + '" class="font-red font-ctn">¥' + tools.addCmma(_downPayment) + '</span></h3>';
                html += ' <div class="yx-silder-wrapper">';
                html += '<div id="index_shoufu' + p.ID + '"></div>';
                html += ' </div>';
                html += ' </div>';
                html += '<div class="sel-items">';
                html += '<h3>月供<span id="index_yuegong_text' + index + '" class="font-red font-ctn">¥' + tools.addCmma(_monthlyPayment) + '</span></h3>';
                html += '<div class="yx-silder-wrapper">';
                html += '<div id="index_yuegong' + p.ID + '"></div>';
                html += '</div>';
                html += '</div>';
                html += '<dl class="dl loan_amount">';
                html += '<dt>贷款额度<span class="">(车价-首付)</span></dt>';
                html += '<dd>¥<span id="dkedText' + index + '">' + tools.addCmma(_loanAmount) + '</span></dd>';
                html += '</dl>';
                if (_finalPaymentAmount != 0) {
                    html += '<dl class="dl loan_payment">';
                    html += '<dt>贷款尾款<span id="dkwkRateText' + index + '">(车价*' + (_finalPaymentRate * 100).toString() + '%)</span></dt>';
                    html += '<dd>¥<span id="dkwkText' + index + '">' + tools.addCmma(_finalPaymentAmount) + '</span></dd>';
                    html += '</dl>';
                }
                html += '<div data-id="' + index + '" class="tip_top"></div>';
                html += '</div>';
                html += '</div>';
            }
            $('#li' + index).append(html);
            $('#tip_bot' + index).show();
            _this.getYXSlider(p, index);
            $('.tip_top').click(function() {
                var id = $(this).attr('data-id');
                $('#shortcontent' + id).removeClass('hide');
                $('#longcontent' + id).addClass('hide');
                var financialIscroll = new iScroll("#financialIscroll", {
                    'preventDefault': false,
                    'bounce': false
                });
                financialIscroll.scrollToElement('#shortcontent' + id, 100);
            })
        });
    },
    //获取首付月供
    getDownPaymentPeriodByProductID: function(productID, index) {
        $('#longcontent_a' + index).attr('href', '/' + cityInfo.citySpell + '/u' + v_ucarId + '/p' + productID + '?source=' + source + '&channel=' + channel + '');
        var _this = this;
        _this.loadData(productID, arry[index][0], arry[index][1], 2, index);
    },
    //获取首付月供
    downPaymentPeriod: function() {
        var _this = this;
        indexShouFu = new YXSlider('index_shoufu', [
            { 'text': 20, 'isDisable': false, 'isDefault': true, 'unit': '%' }
        ], (data) => {
            _this.loadData(data.ProductID, indexShouFu, indexYuegong);
        });

        indexYuegong = new YXSlider('index_yuegong', [
            { 'text': 12, 'isDisable': false, 'isDefault': true, 'unit': '期' }
        ], (data) => {
            _this.loadData(data.ProductID, indexShouFu, indexYuegong);
        });

        _this.loadData(v_productID, indexShouFu, indexYuegong);
    },
    loadData: function(_productId, indexShouFu, indexYuegong, type, index) {
        var _this = this;
        Store.getSecondCarFinanceInfo(_productId).then((res) => {
            var shoufuList = [];
            var yuegongList = [];
            if (res.Result) {
                if (type == 2) {
                    pop_productID = _productId;
                    _this.loadCalculateLoanInfoOther(_productId, index);
                } else {
                    //更改当前的产品ID，提交订单用
                    v_productID = _productId;
                    _this.loadCalculateLoanInfo(_productId);
                }
                //构造首付数据
                for (var i = 0; i < res.ProductDownpaymentrates.length; i++) {
                    var s = res.ProductDownpaymentrates[i];
                    var isDisable = false;
                    if (s.ProductID == _productId) {
                        isDisable = true;
                    }
                    if (type == 2) {
                        shoufuList.push({ 'text': s.DownPaymentRate * 100, 'isDisable': !s.HasProduct, 'isDefault': isDisable, 'ProductID': s.ProductID });
                    } else {
                        if (SoldOrUnSold == '1') {
                            shoufuList.push({ 'text': s.DownPaymentRate * 100, 'isDisable': !isDisable, 'isDefault': isDisable, 'ProductID': s.ProductID });
                        } else {
                            shoufuList.push({ 'text': s.DownPaymentRate * 100, 'isDisable': !s.HasProduct, 'isDefault': isDisable, 'ProductID': s.ProductID });
                        }
                    }
                }
                //构造月供数据
                for (var i = 0; i < res.ProductRepaymentperiods.length; i++) {
                    var s = res.ProductRepaymentperiods[i];
                    var isDisable = false;
                    if (s.ProductID == _productId) {
                        isDisable = true;
                    }
                    if (type == 2) {
                        yuegongList.push({ 'text': s.RepaymentPeriod, 'isDisable': !s.HasProduct, 'isDefault': isDisable, 'ProductID': s.ProductID });
                    } else {
                        if (SoldOrUnSold == '1') {
                            yuegongList.push({ 'text': s.RepaymentPeriod, 'isDisable': !isDisable, 'isDefault': isDisable, 'ProductID': s.ProductID });
                        } else {
                            yuegongList.push({ 'text': s.RepaymentPeriod, 'isDisable': !s.HasProduct, 'isDefault': isDisable, 'ProductID': s.ProductID });
                        }
                    }
                }
                //重新绘制滚动轴
                //new 完后至每次调用接口返回的数据在 update中更新
                indexShouFu.update(shoufuList);
                //new 完后至每次调用接口返回的数据在 update中更新
                indexYuegong.update(yuegongList);
            }
        })
    },
    loadCalculateLoanInfo: function(productID) {
        var _this = this;
        var params = {
            carPrice: ucarPrice,
            productId: productID,
            carId: v_carId
        }
        Store.calculation(params).then((re) => {
            if (re.Data) {
                if (re.Data.LoanRateTable.length > 0) {
                    var t = re.Data.LoanRateTable;
                    var html = '<tbody>';
                    html += '<tr>';
                    for (var i = 0; i < t.length; i++) {
                        if (i == 0) {
                            html += '<th>' + t[i][0] + '</th>';
                        } else {
                            html += '<td>' + t[i][0] + '</td>';
                        }
                    }
                    html += '</tr>';
                    html += '<tr>';
                    for (var i = 0; i < t.length; i++) {
                        if (i == 0) {
                            html += '<th>' + t[i][1] + '</th>';
                        } else {
                            html += '<td>' + t[i][1] + '</td>';
                        }
                    }
                    html += '</tr>';
                    html += '</tbody>';
                }
                $('.tables').html(html);
            }
        });
        var loadCalculateLoanInfoModel = {};
        Store.calculateLoanInfo(params).then((res) => {
            if (res.Result) {
                var _downPayment = res.Data.downPayment * 10000,
                    _loanAmount = res.Data.loanAmount * 10000,
                    _totalCost = res.Data.totalCost * 10000,
                    _monthlyPayment = res.Data.monthlyPayment * 10000,
                    _finalPaymentAmount = res.Data.finalPaymentAmount * 10000,
                    _interestRate = res.Data.interestRate * 100,
                    _totalInterest = res.Data.totalInterest * 10000,
                    _serviceFee = res.Data.serviceFee * 10000,
                    _purchaseTax = res.Data.purchaseTax * 10000,
                    _finalPaymentRate = res.Data.finalPaymentRate,
                    _totalExpenses = _downPayment + _totalCost + _loanAmount;
                //车价
                loadCalculateLoanInfoModel.carPrices = ucarPrice;
                //首付金额
                loadCalculateLoanInfoModel.downPayment = tools.addCmma(_downPayment);
                //首付比例
                loadCalculateLoanInfoModel.downPaymentRate = (res.Data.downPaymentRate * 100).toString() + '%';
                //贷款金额
                loadCalculateLoanInfoModel.loanAmount = tools.addCmma(_loanAmount);
                //首付金额万为单位
                loadCalculateLoanInfoModel.downPayment2 = res.Data.downPayment;
                //贷款金额万为单位
                loadCalculateLoanInfoModel.loanAmount2 = res.Data.loanAmount;
                //贷款成本
                loadCalculateLoanInfoModel.totalCost = tools.addCmma(_totalCost);
                //月供
                loadCalculateLoanInfoModel.monthlyPayment = tools.addCmma(_monthlyPayment);
                //贷款尾款
                loadCalculateLoanInfoModel.finalPaymentAmount = tools.addCmma(_finalPaymentAmount);
                loadCalculateLoanInfoModel.finalPaymentAmountNum = _finalPaymentAmount;
                //尾款比例
                loadCalculateLoanInfoModel.finalPaymentRate = (res.Data.finalPaymentRate * 100).toString() + '%';
                //月费率/月利率文本
                loadCalculateLoanInfoModel.rateText = res.Data.rateText;
                //月费率/月利率金额
                loadCalculateLoanInfoModel.interestRate = _interestRate.toFixed(2) + "%";
                //利息
                loadCalculateLoanInfoModel.totalInterest = tools.addCmma(_totalInterest);
                //手续费
                loadCalculateLoanInfoModel.serviceFee = tools.addCmma(_serviceFee);
                //总花费
                loadCalculateLoanInfoModel.totalExpenses = tools.addCmma(_totalExpenses);
                //环形图初始数据
                loadCalculateLoanInfoModel.datasetsData = [{
                    data: [
                        _downPayment, //首付
                        _loanAmount, //贷款额度
                        _totalCost, //贷款成本
                    ],
                    backgroundColor: [
                        "#000000", //首付
                        "#dbb76c", //贷款额度
                        "#5f5f5e", //贷款成本
                    ],
                    hoverBackgroundColor: [
                        "#000000", //首付
                        "#dbb76c", //贷款额度
                        "#5f5f5e", //贷款成本
                    ],
                    label: '总花费'
                }];
                //刷新环形图
                _this.doughnutChart(loadCalculateLoanInfoModel.datasetsData);
                _this.loadViewDom(loadCalculateLoanInfoModel);
            }
        })
    },
    loadCalculateLoanInfoOther: function(productID, index) {
        var _this = this;
        var params = {
            carPrice: ucarPrice,
            productId: productID,
            carId: v_carId
        }
        var loadCalculateLoanInfoModel = {};
        Store.calculateLoanInfo(params).then((res) => {
            if (res.Result) {
                var _downPayment = res.Data.downPayment * 10000,
                    _loanAmount = res.Data.loanAmount * 10000,
                    _monthlyPayment = res.Data.monthlyPayment * 10000,
                    _finalPaymentRate = res.Data.finalPaymentRate,
                    _finalPaymentAmount = res.Data.finalPaymentAmount * 10000
                    //首付金额
                loadCalculateLoanInfoModel.downPayment = tools.addCmma(_downPayment);
                //首付比例
                loadCalculateLoanInfoModel.downPaymentRate = (res.Data.downPaymentRate * 100).toString() + '%';
                //首付金额万为单位
                loadCalculateLoanInfoModel.downPayment2 = res.Data.downPayment;
                //月供
                loadCalculateLoanInfoModel.monthlyPayment = tools.addCmma(_monthlyPayment);
                //动态数据页面价格数据
                $('#index_shoufu_text' + index).html('¥' + loadCalculateLoanInfoModel.downPayment);
                $('#index_yuegong_text' + index).html('¥' + loadCalculateLoanInfoModel.monthlyPayment);
                $('#dkedText' + index).html(tools.addCmma(_loanAmount));
                $('#dkwkRateText' + index).html('(车价*' + (_finalPaymentRate * 100).toString() + '%)');
                $('#dkwkText' + index).html(tools.addCmma(_finalPaymentAmount));
            }
        })
    },
    loadViewDom: function(data) {
        var _this = this;
        if (data.finalPaymentAmount == 0) {
            $('#weikuan').hide();
        } else {
            $('#weikuan').show();
            $('#weikuanChart').html('¥' + data.finalPaymentAmount);
        }
        //动态数据页面价格数据
        $('#downPaymentChart').html('¥' + data.downPayment);
        $('#loanAmountChart').html('¥' + data.loanAmount);
        $('#borrowingCostsChart').html('¥' + data.totalCost);
        $('#total_price').html(data.totalExpenses);
        $('#index_shoufu_text').html('¥' + data.downPayment);
        $('#index_yuegong_text').html('¥' + data.monthlyPayment);

        //huabing
        ////税费=购置税 + 500（上牌） + 950（强险）
        //self.vm.taxation = tools.addCmma(_purchaseTax + 1450);
        //_purchaseTax = res.Data.purchaseTax *10000,
        if (data.finalPaymentAmountNum == 0) {
            var html = `  <li class="font-title padding-left30 font-bold">总花费：<font class="font-36 font-red">¥${data.totalExpenses}</font></li>
        <li>
            <div>
                <span class="td01">首付<br><font class="col_red">¥${data.downPayment}</font></span>
                <span class="td02">车价<font class="font-bold">${tools.addCmma(data.carPrices * 10000)}</font></span>
                <span class="td03">×<font>　</font></span>
                <span class="td04">首付比例<font class="f font-bold">${data.downPaymentRate}</font></span>
            </div>
        </li>
        <li>
            <div>
                <span class="td01">贷款额度<font class="col_red">¥${data.loanAmount}</font></span>
                <span class="td02">车价<font class="font-bold">${tools.addCmma(data.carPrices * 10000)}</font></span>
                <span class="td03">-<font>　</font></span>
                <span class="td04">首付<font class="font-bold">${data.downPayment}</font></span>
            </div>
        </li>
        <li>
            <div>
                <span class="td01">月供<font class="col_red">¥${data.monthlyPayment}</font></span>
                <span class="td02"><i>月费率</i><font class="font-bold">${data.interestRate}</font></span>
                <span class="td03"></span>
                <span class="td04"></span>
            </div>
        </li>
        <li class="col_grey6">
            <div>
                <span class="td01 f24">贷款成本<font>¥${data.totalCost}</font></span>
                <span class="td02 f24">利息<font class="lf">${data.totalInterest}</font></span>
            </div>
        </li>
        `
            $('#priceHtml').html(html);
        } else {
            var html = `  <li class="font-title padding-left30 font-bold">总花费：<font class="font-36 col_red">¥${data.totalExpenses}</font></li>
        <li>
            <div>
                <span class="td01">首付<br><font class="">¥${data.downPayment}</font></span>
                <span class="td02">车价<font class="font-bold">${tools.addCmma(data.carPrices * 10000)}</font></span>
                <span class="td03">×<font>　</font></span>
                <span class="td04">首付比例<font class="f font-bold">${data.downPaymentRate}</font></span>
            </div>
        </li>
        <li>
            <div>
                <span class="td01">贷款额度<font class="col_red">¥${data.loanAmount}</font></span>
                <span class="td02">车价<font class="font-bold">${tools.addCmma(data.carPrices * 10000)}</font></span>
                <span class="td03">-<font>　</font></span>
                <span class="td04">首付<font class="font-bold">${data.downPayment}</font></span>
            </div>
        </li>
       
          <li>
            <div>
                <span class="td01 f24 td-tax">尾款<font  style="    margin-top: .4rem;" class=" f24 td-tax">¥${data.finalPaymentAmount}</font></span>
                <span class="td02 f24 td-tax">车价<font class=" f24 td-tax">${tools.addCmma(data.carPrices * 10000)}</font></span>
                <span class="td03">×<font>　</font></span>
                <span class="td04 f24 td-tax">尾款比例<font class=" f24 td-tax">${data.finalPaymentRate}</font></span>
            </div>
        </li>
        <li>

            <div>
                <span class="td01">月供<font class="col_red">¥${data.monthlyPayment}</font></span>
                <span class="td02"><i>月费率</i><font class="font-bold">${data.interestRate}</font></span>
                <span class="td03"></span>
                <span class="td04"></span>
            </div>
        </li>
        <li class="col_grey6">
            <div>
                <span class="td01 f24 td-tax">贷款成本<font  style="    margin-top: .3rem;">¥${data.totalCost}</font></span>
                <span class="td02 f24 td-tax">利息<font class="lf f24 td-tax">${data.totalInterest}</font></span>
            </div>
           
        </li>
        `
            $('#priceHtml').html(html);
        }

    },
    popApplyNow: function() {
        $("#orderInfoForm").find('input[name="Orders"]').val(pop_packageid + "_" + pop_productID + "_0");
        $("#orderInfoForm").find('input[name="CarId"]').val(v_carId);
        $("#orderInfoForm").find('input[name="CityId"]').val(cityId_local);
        $("#orderInfoForm").find('input[name="CarPrice"]').val(ucarPrice);
        $("#orderInfoForm").find('input[name="Source"]').val(source);
        $("#orderInfoForm").find('input[name="Channel"]').val(channel);
        $("#orderInfoForm").find('input[name="From"]').val(fromTxt);
        $("#orderInfoForm").find('input[name="UcarId"]').val(v_ucarId);
        document.getElementById("orderInfoForm").submit();
    },
    applyNow: function() {
        $("#orderInfoForm").find('input[name="Orders"]').val(packageId + "_" + v_productID + "_0");
        $("#orderInfoForm").find('input[name="CarId"]').val(v_carId);
        $("#orderInfoForm").find('input[name="CityId"]').val(cityId_local);
        $("#orderInfoForm").find('input[name="CarPrice"]').val(ucarPrice);
        $("#orderInfoForm").find('input[name="Source"]').val(source);
        $("#orderInfoForm").find('input[name="Channel"]').val(channel);
        $("#orderInfoForm").find('input[name="From"]').val(fromTxt);
        $("#orderInfoForm").find('input[name="UcarId"]').val(v_ucarId);
        document.getElementById("orderInfoForm").submit();
    },
    //易问答
    eQEvent: function() {
        //易问答 点赞
        $(".pariseEvent").on('click', function() {
            var $that = $(this);
            if (!$that.hasClass("cur")) {
                var $num = $that.find("span");
                var count = parseInt($num.text()) + 1;
                var qId = $that.parents("li").data("id");
                var params = {
                    questionId: qId,
                    agreeUserId: loanUserId,
                    deviceId: deviceId
                }
                Store.clickAgree(params).then(function(re) {
                    if (re.Result) {
                        $that.addClass("cur");
                        $num.text(count);
                    } else {
                        tools.showAlert(re.Message);
                    }
                })
            }
        });
    },
}

//滚动加载
$(window).scroll(function() {
    var scrollHeight = document.body.scrollTop || document.documentElement.scrollTop;
    var moreHeight;
    if ($("#evaluationList").length) {
        moreHeight = $("#evaluationList").offset().top - $(window).height() + $("#evaluationList").height() - 5;
    }
    if (moreHeight) {
        if (scrollHeight >= moreHeight) {
            if ($('#userEvaluation')) {
                if (isComment) {
                    $CommentDom.click();
                }
            }
        }
    }
});