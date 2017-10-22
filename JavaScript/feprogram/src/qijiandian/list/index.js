import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import YXSlider from "libs/yxSlider/YXSlider.pc.js";
import carPhotos from "libs/carPhotos/index.js";
import 'libs/carSelect/selCar.pc.js';

var ko = require('knockout');
var ProductList = require('libs/productList/productList.js');
var listViewModel = {
    /***车型数据***/
    carId: ko.observable(),
    carPrice: ko.observable(),
    /***城市信息***/
    cityId: ko.observable(),
    cityName: ko.observable(),
    /***贷款数据相关***/
    carPrice: ko.observable(), //车款报价
    downPaymentPercent: ko.observable(), // 首付比例
    downPaymentPercentText: ko.observable(),
    downPayment: ko.observable(), //首付
    suggestMonthlyPayment: ko.observable(),//建议月供
    loanVolumn: ko.observable(), //贷款额度
    taxes: ko.observable(), //税费
    purchaseTax: ko.observable(), //购置税
    purchaseTaxText: ko.observable(), //购置税显示文本
    purchaseTaxRate: ko.observable(), //购置税率
    repaymentPeriod: ko.observable(), // 分期类别
    career: ko.observable(), // 职业身份
    creditRecord: ko.observable(), // 信用记录
    housingStatus: ko.observable(), // 住房状态
    insuranceCertificate: ko.observable(), // 社保证明
    fundStatus: ko.observable(), // 公积金
    /***产品列表相关**/
    itemTotal: ko.observable("--"),//产品总数
    pageSize: ko.observable(), //产品数据页大小
    newPageSize: ko.observable(),
    pageIndex: ko.observable(), //产品当前数据页
    pageTotal: ko.observable(), //产品总页数
    sortType: ko.observable(), //排序类型
    productsData: ko.observable(), //产品数据
    productsView: ko.observableArray(), //产品视图
    filterParam: ko.observable(),

    tiexi: ko.observable(false), // 是否贴息
    elasticTail: ko.observable(), // 是否弹性尾款
    selectNum: ko.observable(),//选择数量
    company: ko.observable(""),//
    isYouXuan: ko.observable(false),//
    filterName: ko.observable(""),//vip顾问

    loanAdviserOrders: ko.observableArray(), //贷款顾问
    loanAdviserShows: ko.observableArray(),
    loanAdviserCount: ko.observable(), //贷款顾问数量
    isLoanAdviser: ko.observable()//是否显示贷款顾问
}

var ListPage = function () {
    //接口
    this.productsUrl = APIURL + "api/FinancialProduct/SearchFinancialProducts";
    //防止刷接口
    this.isShowData = true;

    //加载中
    this.loginBox = $(".loading-list");
    //列表内容
    this.listBox = $(".list-box");
    //缺省内容
    this.defaultBox = $(".no-product");

    //筛选条件标记
    this.filter = {};
    this.filter.downPayment = -1;  // 首付选项
    this.filter.repaymentPeriod = -1; // 分期时间
    this.filter.sortSign = 'MR';   // 排序方式

    // 产品数据
    this.oData = [];    // 原始数据
    this.viewData = []; // 显示数据（筛选+排序后）

    //随机贷款顾问ID
    this.adviserId = 0;

    //防止刷接口
    this.isShowData = true;
    //列表选中个数
    this.checkboxNum = 0;
    //form表单
    this.formDom = $("#orderInfoForm");
    //选车提交按钮DOM
    this.getLoanBtn = $(".hot-car .sel-car-box .btn");

    this.isApplyNow = true;//是否可点击申请
    this.browser = navigator.appName;
}

ListPage.prototype = {
    init: function () {
        ko.applyBindings(listViewModel);
        this.initViewModel();
        this.getListData();
        this.domInit();
    },

    //初始化视图Model
    initViewModel: function () {
        /***车款数据***/
        listViewModel.carId(car.carId);

        /***城市信息***/
        listViewModel.cityId(city.cityId);
        listViewModel.cityName(city.cityName);
        /***贷款数据***/
        listViewModel.carPrice(car.carPrice);
        listViewModel.downPaymentPercent();
        listViewModel.downPaymentPercentText();
        listViewModel.repaymentPeriod(36);
        listViewModel.purchaseTaxRate(car.purchaseTaxRate);
        listViewModel.downPayment("--");
        listViewModel.suggestMonthlyPayment("--");
        listViewModel.loanVolumn("--");
        listViewModel.purchaseTaxText("--");
        listViewModel.career(0);
        listViewModel.creditRecord(0);
        listViewModel.insuranceCertificate(0);
        listViewModel.fundStatus(0);
        listViewModel.housingStatus(0);
        // listViewModel.filterParam("isDiscount=false&packageType=0");
        listViewModel.sortType("MR");

        listViewModel.pageSize(10);
        listViewModel.newPageSize(0);
        listViewModel.pageIndex(1);
    },

    // 其他dom
    domInit: function () {
        var self = this;

        //图片轮播
        carPhotos.opts({ conwidth: 420 });
        carPhotos.init();

        // 选车款
        // TODO 换pc控件
        function GetCarList() {
            var _url = "/ShopIndex/GetCarList";
            $.ajax({
                url: _url,
                data: {
                    "serialId": car.serialId,
                    "comId": shopcompanyid
                },
                dataType: 'json',
                success: function (res) {
                    if (res.Data.length > 0) {
                        //加载车款
                        $("#selCar").click(function (e) {
                            e.preventDefault();
                            carSelect_thirdLevel.carThirdLevel({
                                onlyOnSale: true,
                                showLevel: 3,
                                thirdInterfaceUrl: _url + '?comId=' + shopcompanyid + '&serialId' + car.serialId,
                                thirdDataType: 'json'
                            },
                                {
                                    brand: {
                                        id: car.serialId,
                                        logo: car.masterBrandLogo,
                                        brandLogo: car.masterBrandLogo,
                                        name: car.carSerialShowName,
                                        price: car.carPrice,
                                        companyid: shopcompanyid,
                                        spell: car.carSerialAllSpell
                                    }
                                },
                                function (result) {
                                    $("#carSelectThirdLevel").hide();
                                    location = "/product/" + city.citySpell + "/m" + result.carType.id + (!dealer.dealerId ? '' : '/d' + dealer.dealerId) + "?source=" + source;
                                });
                        });
                    } else {
                        //加载车款
                        $("#selCar").click(function (e) {
                            e.preventDefault();
                            carSelect_thirdLevel.carThirdLevel({
                                onlyOnSale: true,
                                showLevel: 3,
                                CityId: city.cityId
                            },
                                {
                                    brand: {
                                        id: car.serialId,
                                        logo: car.masterBrandLogo,
                                        name: car.carSerialShowName,
                                        price: car.carPrice,
                                        spell: car.carSerialAllSpell
                                    }
                                },
                                function (result) {
                                    $("#carSelectThirdLevel").hide();
                                    location = CheDaiURL + city.citySpell + "/" + result.brand.spell + "/m" + result.carType.id + (!dealer.dealerId ? '' : '/d' + dealer.dealerId) + "?source=" + source;
                                });
                        });
                    }
                }
            });
        }
        // GetCarList();

        // 筛选
        $('.sort-order a').on('click', function (e) {
            e.preventDefault();
            $(this).addClass('cur').siblings().removeClass('cur');
            self.filter.sortSign = $(this).attr('data-id');
            self.updateListData();
        });

        //icon 礼包
        $(".Pack-Amount .li-li").on("mouseover", function () {
            var _packageGiftUrl = APIURL + "api/FinancialProduct/GetPackageGiftInfoList?packageId=" + $(this).attr("data-id");
            var _tipBox = $(this).find(".info");
            var _this = $(this)
            $.ajax({
                url: _packageGiftUrl,
                dataType: 'jsonp',
                cache: true,
                beforeSend: function () {

                },
                success: function (res) {
                    if (res.Result) {
                        var _packageGiftStr = "申请成功后即赠：";
                        $.each(res.Data, function (index, val) {
                            _packageGiftStr += ("<br/>" + val.GiftDescription);
                        });
                        _tipBox.html(_packageGiftStr);
                        _this.stop().fadeIn(300);

                    }
                }
            });

        })
        //列表页面总成本
        $('.list-left-box').on("mouseover", '.bor-bot6', function () {
            $(this).siblings('.TotalCost-tip').stop().fadeIn();
        }).on("mouseout", '.bor-bot6', function () {
            $(this).siblings('.TotalCost-tip').stop().fadeOut();
        });
        //礼 付 惠
        $('.list-left-box').on("mouseover", ".Pack-Amount li>div", function () {
            $(this).find(".Pack-Amount-tip").stop().fadeIn();
        }).on("mouseout", ".Pack-Amount li>div", function () {
            $(this).find(".Pack-Amount-tip").stop().fadeOut();
        });
        //申请要求//严格、一般、宽松
        $('.list-left-box').on("mouseover", ".CommonRequirementType", function () {
            var _html = $(this).find(".info").html();
            if (_html != '') {
                $(this).find(".CommonRequirementType-tip").stop().fadeIn();
            }

        }).on("mouseout", ".CommonRequirementType", function () {
            $(this).find(".CommonRequirementType-tip").stop().fadeOut();
        });

        //1小时速批
        $('.list-left-box').on("mouseover", ".PackageEvent", function () {
            var _html = $(this).parents(".dl-Package").find(".info").html();
            if (_html != '' && $(this).parents(".dl-Package").find(".apply-btn").length > 0 &&
                ($(this).parents(".dl-Package").find(".apply-btn font").text() == "1小时速批" || $(this).parents(".dl-Package").find(".apply-btn font").text() == "一小时速批")) {
                $(this).parents(".dl-Package").find(".jisushenpi").stop().fadeIn();
            } else if ($(this).hasClass("yxHxm-btn")) {
                $(this).parents(".dl-Package").find(".shouxinma").stop().fadeIn();
            }
        }).on("mouseout", ".PackageEvent", function () {
            $(this).parents(".dl-Package").find(".CommonRequirementType-tip").stop().fadeOut();
        });
        //暂无评论.CommentCount
        $('.list-left-box').on("mouseover", '.eventip', function () {
            $(this).siblings('.CommentCount-tip').stop().fadeIn();
        }).on("mouseout", '.eventip', function () {
            $(this).siblings('.CommentCount-tip').stop().fadeOut();
        });

        //列表总成本滑过
        $(".list-left-box").on("mouseover", ".price-box i", function () {
            $(this).siblings("font").stop().fadeIn();
        }).on("mouseout", "i", function () {
            $(this).siblings("font").stop().fadeOut();
        });

        //列表中的事件 立即申请
        $(".list-left-box").on("click", ".checkbox,li .apply-btn", function (e) {
            var curItem = $(e.currentTarget);
            if (curItem.is(".checkbox") && !curItem.hasClass('disabled')) {
                if (self.checkboxNum >= 5 && !curItem.hasClass('cur')) {
                    tools.showAlert("最多申请5个金融机构！");
                } else {
                    if ($(this).hasClass("cur")) {
                        $(this).removeClass("cur");
                        self.checkboxNum -= 1;
                        listViewModel.selectNum(self.checkboxNum);
                    } else {
                        $(this).addClass("cur");
                        self.checkboxNum += 1;
                        listViewModel.selectNum(self.checkboxNum);
                    }
                }

            } else if (curItem.is(".apply-btn") && !curItem.hasClass("disabled")) {
                var _dataApplyUrl = $(this).parents(".footer-info").attr("data-applyUrl");
                var _strUrl = loanOrderApplyUrl +  (_dataApplyUrl.toLocaleLowerCase().indexOf("/onlineapproval")>=0?_dataApplyUrl.toLocaleLowerCase().replace("/onlineapproval", "/orderapplyyx"):_dataApplyUrl);

                $("#orderInfoForm").attr("action", _strUrl);
                self.checkboxNum = 1;
                listViewModel.selectNum(self.checkboxNum);
                self.listBox.find(".checkbox").removeClass('cur');
                //点击立即申请按钮
                if (self.isApplyNow) {
                    self.applyNow($(this));
                    self.isApplyNow = false;
                    setTimeout(function () {
                        self.isApplyNow = true;
                    }, 1000);
                } else {
                    tools.showAlert("大侠手太快啦，等下再试试！")
                }
            }

        });

        // //贷款顾问展示
        // $(".list-left-box").on('mouseenter', '.adviser-box', function(){
        //     $(this).find(".advBox").show();
        // }).on('mouseleave', '.adviser-box', function(){
        //     $(this).find(".advBox").hide();
        // });

        //下拉菜单事件
        $.each($(".car-info .select-ctrl"), function (index, item) {
            $(item).selectControl(function () { }, "click", "notRender");
        });

        //选择城市
        window.selCityCallback = function (obj) {
            var url = location.href;
            url = url.replace(city.citySpell, obj.citySpell);
            $('.area-city-con').text(obj.cityName);
            location.href = url;
        }
        $(".area-city-box").selCity({
            isRelationHeader: true,
            loadCityUrl: "/shopIndex/GetCitiesByCompany?comId=" + shopcompanyid +"&carid=" + car.carId,
            dataType: 'json'
        });
        $(".area-city").selCity({
            isRelationHeader: true,
            loadCityUrl: "/shopIndex/GetCitiesByCompany?comId=" + shopcompanyid +"&carid=" + car.carId,
            dataType: 'json'
        });

        // 热销车款
        $.ajax({
            url: '/shopindex/gethotsalelist?comid=' + shopcompanyid + '&cityid=' + city.cityId,
            method: 'GET',
            data: 'json',
            success: function (res) {
                if (res.length) {
                    var htmlstr = '';
                    for (var i = 0; i < res.length; i++) {
                        htmlstr += '<dd class="clrfix">' +
                            '<a class="clrfix" href="/product/' + city.citySpell + '/m' + res[i].Car_Id + '/c' + res[i].CompanyID + '" target="_blank">' +
                            '<img src="' + res[i].CarSerialImgUrl + '" width="100" height="60">' +
                            '<div>' +
                            '<b class="ut-s">' + res[i].csName + '</b>' +
                            '<div>车价：' + res[i].CarReferPriceText.replace('¥', '') + '</div>';
                        if (res[i].MonthlyPaymentText) {
                            htmlstr += '<div>月供：<span>' + res[i].MonthlyPaymentText + '</span></div>';
                        }
                        htmlstr += '</div></a></dd>';
                    }
                    $('#hotCarList').append(htmlstr);
                }
            }
        });

        //hover选车
        let _BrandsUrl = isshowallbrand ? false : '/ShopIndex/GetMasterBrandListBlueSky?comid=' + shopcompanyid + '&cityid=' + city.cityId,
            _SerialsUrl = isshowallbrand ? false : '/ShopIndex/GetCarSerialByMasterBrand?comid=' + shopcompanyid + '&cityid=' + city.cityId + '&bsid=',
            _dataType = isshowallbrand ? 'jsonp' : 'json';
        $('#hoverCar').selCar({
            BrandsUrl: _BrandsUrl,
            BrandsType: _dataType,
            SerialsUrl: _SerialsUrl,
            SerialsType: _dataType,
            EventType: 'hover',
            IsOpenSearch: false,
            CallBacks: function (obj) {
                window.open("/product/" + city.citySpell + '/s' + obj.carTypeId + '/c' + shopcompanyid);
            }
        });
    },

    //立即申请
    applyNow: function (item) {
        var self = this;
        var footerItem = item.parents("footer.clrfix");

        var _adviserId = footerItem.prev("header").find('.adviser-box').attr("data-id");
        var _checkbox = footerItem.siblings("header.clrfix").find(".checkbox");

        var _strData = _checkbox.attr('data-pa') + '_' + _checkbox.attr('data-pd') + '_' + (_checkbox.attr('data-pp') ? _checkbox.attr('data-pp') : 0);
        var _arr = [_strData];
        self.formDom.find('input[name="Orders"]').val(_arr.join());
        self.formDom.find('input[name="CarId"]').val(car.carId);
        self.formDom.find('input[name="CityId"]').val(city.cityId);
        self.formDom.find('input[name="CarPrice"]').val(car.carPrice);
        self.formDom.find('input[name="Source"]').val(source ? source : 0);
        self.formDom.find('input[name="Line"]').val(BusinessLine);
        self.formDom.find('input[name="AdviserId"]').val(_adviserId);
        self.formDom.find('input[name="From"]').val('');
        self.formDom.find('input[name="Shop"]').val(companycode);
        self.formDom.submit();
    },

    //计算贷款数据
    calculateLoanData: function () {
        var self = this;
        var carPrice = listViewModel.carPrice() * 10000;
        var downPayment = 0;
        var loanVolumn = 0;
        var taxes = 0;
        var purchaseTaxText = "";
        var purchaseTax = 0;
        var suggestMonthlyPayment = 0;
        var downPaymentPercent = listViewModel.downPaymentPercent();
        if (carPrice == "") {
            downPayment = "--";
            carPrice = "--";
            loanVolumn = "--";
            taxes = "--";
            purchaseTax = "--";
            suggestMonthlyPayment = "--";
        }
        else {
            downPayment = tools.addCmma(carPrice * downPaymentPercent);
            loanVolumn = tools.addCmma(carPrice - carPrice * downPaymentPercent);
            taxes = tools.addCmma(carPrice / 1.17 * listViewModel.purchaseTaxRate() + 500 + 950);
            purchaseTax = carPrice / 1.17 * listViewModel.purchaseTaxRate();
            purchaseTaxText = tools.addCmma(purchaseTax);

            /***
             市场月供＝　（贷款金额×（１＋费率））/期限
             贷款金额 = 车价 ×（1-首付比例）
             参考费率：
             12  9%
             24  17%
             36  25%
             48  34%
             60  42%
             ***/
            var rate = 0.25;
            var repaymentPeriod = listViewModel.repaymentPeriod();

            switch (repaymentPeriod) {
                case 12:
                    rate = 0.09;
                    break;
                case 24:
                    rate = 0.17;
                    break;
                case 36:
                    rate = 0.25;
                    break;
                case 48:
                    rate = 0.34;
                    break;
                case 60:
                    rate = 0.42;
                    break;
                default:
                    rate = 0.25;
                    break;
            }
            suggestMonthlyPayment = tools.addCmma(((carPrice * (1 - parseFloat(downPaymentPercent))) * (1 + rate)) / repaymentPeriod);
        }

        if (self.filter.downPayment === -1) {
            downPayment = downPayment + '起';
        }
        listViewModel.downPayment(downPayment);
        listViewModel.loanVolumn(loanVolumn);
        listViewModel.taxes(taxes);
        listViewModel.purchaseTaxText(purchaseTaxText);
        listViewModel.purchaseTax(purchaseTax);
        listViewModel.suggestMonthlyPayment(suggestMonthlyPayment);
    },

    //获取数据
    getListData: function () {
        var self = this;
        self.defaultBox.hide();

        tools.$ajax({
            // TODO 查找条件
            url: self.productsUrl + '?carPrice=' + listViewModel.carPrice() + '&carId=' + car.carId + '&cityId=' + city.cityId + '&downPaymentRate=-1&repaymentPeriod=-1&ChannelCode=&sortName=' + listViewModel.sortType() + '&job=' + listViewModel.career() + '&credit=' + listViewModel.creditRecord() + '&house=' + listViewModel.housingStatus() + '&socialSecurity=' + listViewModel.insuranceCertificate() + '&fund=' + listViewModel.fundStatus() + '&isDiscount=' + listViewModel.tiexi() + '&packageType=' + (listViewModel.elasticTail() ? 7 : 0) + '&pageIndex=1' + '&pageSize=1000' + '&isNeedTop=true&companyId=' + companyid + '&isYouXuan=' + listViewModel.isYouXuan() + '&filterName=' + listViewModel.filterName(),
            type: 'Get',
            dataType: 'jsonp',
            success: function (res) {
                if (!res.Result) {
                    return tools.showAlert(res.Message);
                }

                self.loginBox.addClass("hide");

                var data = res.Data,
                    newData = [],
                    sortData = [];

                if (res.RowCount > 0) {
                    // TODO wtf
                    for (var i = 0; i < data.length; ++i) {
                        if (data[i].PackageType === 37 || parseInt(data[i].CompanyId) !== parseInt(companyid))
                            continue;
                        newData.push(data[i]);
                    }
                }

                if (newData.length) {
                    // 10.14 排序newData
                    var packageArr = [];
                    for (var i = 0; i < newData.length; i++) {
                        if (packageArr.indexOf(newData[i].PackageId) < 0) {
                            packageArr.push(newData[i].PackageId);
                        }
                    }

                    for (var i = 0; i < packageArr.length; i++) {
                        var temparr = [];
                        for (var j = 0; j < newData.length; j++) {
                            if (packageArr[i] == newData[j].PackageId) {
                                temparr.push(newData[j]);
                            }
                        }

                        // 先按首付从低到高排序
                        temparr.sort(function (a, b) {
                            return a.DownPaymentRate - b.DownPaymentRate;
                        });

                        var temparr2 = [],
                            sortedTemparr = [];
                        for (var j = 0; j < temparr.length; j++) {
                            if (temparr2.length && temparr2[temparr2.length - 1].DownPaymentRate !== temparr[j].DownPaymentRate) {
                                temparr2.sort(function (a, b) {
                                    return b.RepaymentPeriod - a.RepaymentPeriod;
                                });
                                sortedTemparr = sortedTemparr.concat(temparr2);
                                temparr2 = [];
                            }
                            temparr2.push(temparr[j]);
                        }
                        if (temparr2.length) {
                            temparr2.sort(function (a, b) {
                                return b.RepaymentPeriod - a.RepaymentPeriod;
                            });
                            sortedTemparr.concat(temparr2);
                            sortedTemparr = sortedTemparr.concat(temparr2);
                        }
                        sortData = sortData.concat(sortedTemparr);
                    }

                    // totest： 查看排序是否正确
                    /* for (var i = 0; i < sortData.length; i++) {
                     console.log('id：' + sortData[i].PackageId + ', DownPaymentRate:' + sortData[i].DownPaymentRate + ', RepaymentPeriod:' + sortData[i].RepaymentPeriod);
                     } */

                    self.oData = sortData;
                    self.viewData = sortData;

                    // TODO 首付，分期 拖拽控件
                    var downPaymentArr = [],
                        repaymentPeriodArr = [];

                    for (var i = 0; i < sortData.length; i++) {
                        if (downPaymentArr.indexOf(sortData[i].DownPaymentRate) < 0) {
                            downPaymentArr.push(sortData[i].DownPaymentRate);
                        }
                        if (repaymentPeriodArr.indexOf(sortData[i].RepaymentPeriod) < 0) {
                            repaymentPeriodArr.push(sortData[i].RepaymentPeriod);
                        }
                    }
                    downPaymentArr.sort(function (a, b) {
                        return a - b;
                    });
                    repaymentPeriodArr.sort(function (a, b) {
                        return a - b;
                    });
                    // console.log(downPaymentArr);
                    // console.log(repaymentPeriodArr);

                    var downPaymentParam = [{ 'text': -1, 'isDisable': false, 'isDefault': true, 'unit': '%' }],
                        repaymentPeriodParam = [{ 'text': -1, 'isDisable': false, 'isDefault': true, 'unit': '期' }];
                    for (var i = 0; i < downPaymentArr.length; i++) {
                        downPaymentParam.push({ 'text': downPaymentArr[i] * 100, 'isDisable': false, 'isDefault': false, 'unit': '%' });
                    }
                    for (var i = 0; i < repaymentPeriodArr.length; i++) {
                        repaymentPeriodParam.push({ 'text': repaymentPeriodArr[i], 'isDisable': false, 'isDefault': false, 'unit': '期' });
                    }

                    var downPaymentSlider = new YXSlider('downPaymentSlider', downPaymentParam, function (val) {
                        if (val.text < 0) {
                            listViewModel.downPaymentPercent(downPaymentArr[0]);
                            listViewModel.downPaymentPercentText(downPaymentArr[0] * 100);
                            self.filter.downPayment = val.text;
                        } else {
                            listViewModel.downPaymentPercent(val.text / 100);
                            listViewModel.downPaymentPercentText(val.text);
                            self.filter.downPayment = val.text / 100;
                        }
                        self.calculateLoanData();
                        self.updateListData();
                    });
                    var repaymentPeriodSlider = new YXSlider('repaymentPeriodSlider', repaymentPeriodParam, function (val) {
                        self.filter.repaymentPeriod = val.text;
                        self.calculateLoanData();
                        self.updateListData();
                    });

                    // 根据最小首付和最大期限
                    listViewModel.downPaymentPercent(downPaymentArr[0]);
                    listViewModel.downPaymentPercentText(downPaymentArr[0] * 100);
                    self.calculateLoanData();

                    // 显示数据
                    self.updateListData();

                    self.listBox.removeClass("hide");
                    self.defaultBox.hide();
                } else {
                    self.listBox.addClass("hide");
                    self.defaultBox.show();
                    $('.car-info-Taxes').hide();
                    new YXSlider('downPaymentSlider', [{ 'text': -1, 'isDisable': false, 'isDefault': true, 'unit': '%' }], function (val) { });
                    new YXSlider('repaymentPeriodSlider', [{ 'text': -1, 'isDisable': false, 'isDefault': true, 'unit': '期' }], function (val) { });
                }
            }
        });
    },

    // 更新列表数据集合
    updateListData: function () {
        // this.filter.downPayment = '';  // 首付选项
        // this.filter.repaymentPeriod = ''; // 分期时间
        // this.filter.sortSign = 'MR';   // 排序方式
        var self = this,
            oData = this.oData,
            filterData = [];

        //console.log(self.filter.downPayment);
        //console.log(self.filter.repaymentPeriod);

        // 筛选
        for (var i = 0; i < oData.length; i++) {
            if ((self.filter.downPayment < 0 || self.filter.downPayment >= 0 && oData[i].DownPaymentRate === self.filter.downPayment) &&
                (self.filter.repaymentPeriod < 0 || self.filter.repaymentPeriod >= 0 && oData[i].RepaymentPeriod === self.filter.repaymentPeriod)) {
                filterData.push(oData[i]);
            }
        }

        // 去重
        var packageArr = [];
        var finalData = [];
        for (var i = 0; i < filterData.length; i++) {
            var flag = false;
            for (var j = 0; j < packageArr.length; j++) {
                if (filterData[i].PackageId === packageArr[j]) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                finalData.push(filterData[i]);
                packageArr.push(filterData[i].PackageId);
            }
        }

        // 排序
        switch (self.filter.sortSign) {
            case 'CB':
                finalData.sort(function (a, b) {
                    return (a.TotalCostText.indexOf("万") > 0 ? parseFloat(a.TotalCostText) * 10000 : parseFloat(a.TotalCostText)) - (b.TotalCostText.indexOf("万") > 0 ? parseFloat(b.TotalCostText) * 10000 : parseFloat(b.TotalCostText));
                });
                break;
            case 'YG':
                finalData.sort(function (a, b) {
                    return (a.MonthlyPaymentText.indexOf("万") > 0 ? parseFloat(a.MonthlyPaymentText) * 10000 : parseFloat(a.MonthlyPaymentText)) - (b.MonthlyPaymentText.indexOf("万") > 0 ? parseFloat(b.MonthlyPaymentText) * 10000 : parseFloat(b.MonthlyPaymentText));
                });
                break;
            case 'RQ':
                finalData.sort(function (a, b) {
                    return parseFloat(b.ApplyCount) - parseFloat(a.ApplyCount);
                });
                break;
            default:
                break;
        }

        // totest： 查看排序是否正确
        /* var sortData = finalData;
         for (var i = 0; i < sortData.length; i++) {
         console.log('id：' + sortData[i].PackageId + ', DownPaymentRate:' + sortData[i].DownPaymentRate + ', RepaymentPeriod:' + sortData[i].RepaymentPeriod);
         } */

        for (var i = 0; i < filterData.length; i++) {
            if (self.filter.downPayment < 0) {
                filterData[i].showDownPayment = true;
            } else {
                filterData[i].showDownPayment = false;
            }
            if (self.filter.repaymentPeriod < 0) {
                filterData[i].showRepaymentPeriod = true;
            } else {
                filterData[i].showRepaymentPeriod = false;
            }
        }

        listViewModel.itemTotal(finalData.length);

        self.viewData = finalData;
        self.updateListView();
    },

    // 更新列表视图
    updateListView: function () {
        var self = this,
            newData = self.viewData;

        self.listBox.html('');

        listViewModel.productsView(newData);
        ReactDOM.render(
            <ProductList data={listViewModel.productsView()} cityId={city.cityId} citySpell={city.citySpell} carId={car.carId} dealerId={dealer.dealerId} source={source} channel={channel} shopcode={shopcode} depositPackageType={depositpackagetype} adviserApi={adviserApi} cheDaiUrl={CheDaiURL} renderReady={self.loanAdviser} />,
            document.getElementById('product-list')
        );

        if (newData.length) {
            this.defaultBox.hide();
        } else {
            this.defaultBox.show();
        }
    },

    //贷款顾问
    loanAdviser: function () {
        var fomatPhone = function (phone) {
            return phone.slice(0, 4) + '-' + phone.slice(4, 7) + '-' + phone.slice(7, phone.length);
        }
        $.ajax({
            url: adviserApi + "v2/group/getadviserlist?CityId=" + city.cityId + "&CompanyIds=" + companyid,
            method: 'get',
            dataType: 'jsonp',
            success: function (result) {
                if (result.Data != null && result.Data[0] != null) {
                    $('ul.list-box>li').each(function (index, elem) {
                        var pId = $(elem).attr('data-productid');
                        var adviserAdv = result.Data[0].Adviser;
                        var _adviserId=adviserAdv.Id;
                        var _adviserIdHtml = '<span class="img-box"><img src="' + adviserAdv.Photo + '" class="image" /></span><span class="name-box">' + adviserAdv.Name + '</span><span class="tel-box"><font class="col-red">' + fomatPhone(adviserAdv.CN400) + '</font> </span>';
                        $(elem).find(".adviser-box").show().attr("data-id", _adviserId).html(_adviserIdHtml);
                    });
                }
            }
        });
    }
}

$(function () {
    var listPage = new ListPage();
    listPage.init();
});