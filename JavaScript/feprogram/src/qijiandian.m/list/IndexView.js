require('./list.scss');
require('libs/swiper');

import 'zepto/src/fx';
import 'zepto/src/fx_methods';
import 'zepto/src/touch';

// var citySelect = require('libs/citySelect');
var carSelect_thirdLevel = require('libs/carSelect/carThirdLevel');
var iScroll = require('iscroll');
var ko = require('knockout');
import YXSlider from "libs/yxSlider/index";

var listViewModel = {
    /***车型数据***/
    carId: ko.observable(),
    carPrice: ko.observable(),
    carPriceText: ko.observable(),
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
    filterParam:ko.observable(),

    tiexi: ko.observable(false), // 是否贴息
    elasticTail: ko.observable(), // 是否弹性尾款
    selectNum: ko.observable(),//选择数量
    company: ko.observable(""),//
    isYouXuan:ko.observable(false),//
    filterName:ko.observable(""),//vip顾问

    loanAdviserOrders: ko.observableArray(), //贷款顾问
    loanAdviserShows: ko.observableArray(),
    loanAdviserCount: ko.observable(), //贷款顾问数量
    isLoanAdviser: ko.observable(),//是否显示贷款顾问

    isShowLoanCost: ko.observable(true),//是否隐藏贷款成本
}

var ListPage = function(){
    //接口
    this.productsUrl = APIURL + "api/FinancialProduct/SearchFinancialProducts";
    //防止刷接口
    this.isShowData = true;

    //加载中
    this.loginBox = $(".login-box");
    //列表内容
    this.listBox = $(".content-box");
    //缺省也卖弄
    this.defaultBox = $(".default-box");

    //筛选条件标记
    this.filter = {};
    this.filter.downPayment =  -1;  // 首付选项
    this.filter.repaymentPeriod =  -1; // 分期时间
    this.filter.sortSign = 'MR';   // 排序方式

    // 产品数据
    this.oData = [];    // 原始数据
    this.viewData = []; // 显示数据（筛选+排序后）

    //随机贷款顾问ID
    this.adviserId = 0;
    this.scrollEvent = false;
    this.defaultOrloginHeight = null;
}

ListPage.prototype = {
    init: function(){
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
    domInit: function(){
        var self = this;
        self.defaultOrloginHeight = $(window).height() - $(".list-header").height();
        //self.defaultBox.css({'height':self.defaultOrloginHeight, 'background-color':'#fff'});
        self.loginBox.css({'height':self.defaultOrloginHeight, 'background-color':'#fff'});

        // 判断是否是不显示贷款成本的城市
        let noLoanCityArr = noLoanCostCityIds.split(',');
        if(noLoanCityArr.indexOf(city.CityId)>=0){
            listViewModel.isShowLoanCost(false);
        }

        //图片轮播
        if ($("#swiper img").length <= 1) {
            $(".fy").html("1/1");
        }else{
            var swiper = new Swiper('#swiper', {
                autoplay: 3000,
                loop: true,
                autoplayDisableOnInteraction:false,
                pagination: '.swiper-pagination',
                paginationClickable: true,
                onInit: function(swiper){
                    $(".fy").html(swiper.activeIndex+"/"+(swiper.slides.length-2));
                },
                onSlideChangeEnd: function(swiper){
                    var num = swiper.activeIndex,
                        leg = swiper.slides.length-2;
                    if(num==0){
                        $(".fy").html(leg+"/"+leg);
                    }else if(num <= leg){
                        $(".fy").html(num+"/"+leg);
                    }else if(num > leg){
                        $(".fy").html((num-leg)+"/"+leg);
                    }
                }
            });
        }

        // 选车款
        /* $("#selCar").click(function(e){
            e.preventDefault();
            carSelect_thirdLevel.carThirdLevel({
                onlyOnSale: true,
                showLevel: 3,
                CityId:city.cityId
            }, {
                brand: {
                    id: car.serialId,
                    logo: car.masterBrandLogo,
                    name: car.masterBrandName,
                    price: car.carPrice,
                    spell: car.carSerialAllSpell
                }
            },function(result){
                $("#carSelectThirdLevel").hide();
                location="/"+city.citySpell+"/"+result.brand.spell+"/m"+result.carType.id +(!dealer.dealerId?'':'/d'+dealer.dealerId) +"?source=" + source;
            });
        }); */

        function GetCarList() {
            var _url = "/ShopIndex/GetCarList";
            $.ajax({
                url: _url,
                data: {
                    "serialId": car.serialId,
                    "comId": shopcompanyid,
                    "cityid": city.CityId
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
                                thirdInterfaceUrl: _url + '?comId=' + shopcompanyid + "&cityid=" + city.CityId,
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
                                location.href = "/product/" + city.citySpell + "/m" + result.carType.id + '/c' + shopcompanyid + (!dealer.dealerId ? '' : '/d'+dealer.dealerId) +"?source=" + source;
                            });
                        });
                    } else {
                        //加载车款
                        $("#selCar").click(function (e) {
                            e.preventDefault();
                            carSelect_thirdLevel.carThirdLevel({
                                onlyOnSale: true,
                                showLevel: 3,
                                CityId:city.cityId
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
                            function (result){
                                $("#carSelectThirdLevel").hide();
                                location = "/product/" + city.citySpell + "/m" + result.carType.id + '/c' + shopcompanyid + (!dealer.dealerId ? '' : '/d'+dealer.dealerId) +"?source=" + source;
                            });
                        });
                    }
                }
            });
        }
        GetCarList();

        // 报价
        if($("#dealerQuotes").length >=1){
            var dealeContent = new iScroll("#dealeContent",{'click':true,"onScrollStart":function(){scrollSign=false},"onScrollEnd":function(){ setTimeout(function(){ scrollSign=true}, 1000);}})
            $(".car-price.border-b").click(function(){
                self.showDealerOrAdviser("dealerQuotes",dealeContent);
            });

            $(".close").click(function(){
                self.hideDealerOrAdviser("dealerQuotes");
            });

            $.each($("#dealeContent a"), function(index, val) {
                var _dataHref=$(this).attr("href");
                $(this).attr({
                    "data-href":_dataHref,
                    "href":"javascript:void(0);"
                })
            });

            $("#dealerQuotes").on('click', '#dealeContent a', function(event) {
                event.preventDefault();
                self.hideDealerOrAdviser("dealerQuotes");
                location.href=$(this).attr("data-href");
            });
        }

        //贷款顾问
        var adviserBox = new iScroll(".win_box_max",{
            'preventDefault': false,
            'preventDefaultException': { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/ }
        });
        $("#list").on("click", ".adviser", function(){
            var h=$(this).data("tel");
             location.href = h;
        });
        $('#adviserBox').on('click', '.adv-tel', function(e) {
            e.preventDefault();
            var phoneNum = $(this).attr('href');
           location.href = phoneNum;

        });
        $(".adv-close").click(function(){
            self.hideDealerOrAdviser("adviserBox");
        });
        $("#maskLayer").click(function(){
            self.hideDealerOrAdviser("adviserBox");
        });

        // 筛选
        $('.list-header .tap').on('click', function() {
            $(this).addClass('active').siblings().removeClass('active');
            self.filter.sortSign = $(this).attr('data-id');
            self.updateListData();
        });

        // app下载
        // $('#appDown').on('click', '.appdown_close', function(e){
        //     e.preventDefault();
        //     // 关闭浮层，记录cookie
        //     $('#appDown').addClass('hide');
        //     $('body').animate({
        //         'padding-top': 0});
        //     var cookieString = 'hideAppDown=1;path=/;domain=' + tools.wildcardUrl();
        //     document.cookie = cookieString;
        // });

    },

    //计算贷款数据
    calculateLoanData: function () {
        var self = this;
        var carPrice = listViewModel.carPrice()*10000;
        var carPriceText = '';
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
            carPriceText = "暂无";
            loanVolumn = "--";
            taxes = "--";
            purchaseTax = "--";
            suggestMonthlyPayment = "--";
        }
        else {
            carPriceText = "￥" + tools.addCmma(carPrice);
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
        listViewModel.carPriceText(carPriceText);
        listViewModel.downPayment(downPayment);
        listViewModel.loanVolumn(loanVolumn);
        listViewModel.taxes(taxes);
        listViewModel.purchaseTaxText(purchaseTaxText);
        listViewModel.purchaseTax(purchaseTax);
        listViewModel.suggestMonthlyPayment(suggestMonthlyPayment);
    },

    //获取数据
    getListData: function(){
        var self = this;
        self.defaultBox.addClass("hide");

        tools.$ajax({
            // TODO 查找条件
            url: self.productsUrl + '?carPrice='+listViewModel.carPrice()+'&carId='+car.carId+'&cityId='+city.cityId+'&downPaymentRate=-1&repaymentPeriod=-1&ChannelCode=&sortName='+listViewModel.sortType()+'&job='+listViewModel.career()+'&credit='+listViewModel.creditRecord()+'&house='+listViewModel.housingStatus()+'&socialSecurity='+listViewModel.insuranceCertificate()+'&fund='+listViewModel.fundStatus()+'&isDiscount='+listViewModel.tiexi()+'&packageType='+ (listViewModel.elasticTail()?7:0) +'&pageIndex=1'+'&pageSize=1000'+'&isNeedTop=true&companyId='+companyid+'&isYouXuan='+listViewModel.isYouXuan()+'&filterName='+listViewModel.filterName(),
            type: 'Get',
            dataType: 'jsonp',
            success: function(res){
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

                    var downPaymentParam = [{'text':-1,'isDisable':false,'isDefault':true,'unit':'%'}],
                        repaymentPeriodParam = [{'text':-1,'isDisable':false,'isDefault':true,'unit':'期'}];
                    for (var i = 0; i < downPaymentArr.length; i++) {
                        downPaymentParam.push({'text':downPaymentArr[i]*100,'isDisable':false,'isDefault':false,'unit':'%'});
                    }
                    for (var i = 0; i < repaymentPeriodArr.length; i++) {
                        repaymentPeriodParam.push({'text':repaymentPeriodArr[i],'isDisable':false,'isDefault':false,'unit':'期'});
                    }

                    var downPaymentSlider =  new YXSlider('downPaymentSlider', downPaymentParam, function(val) {
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
                    var repaymentPeriodSlider =  new YXSlider('repaymentPeriodSlider', repaymentPeriodParam, function(val) {
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

                    /* if($(".list-ctn").height() <= self.defaultOrloginHeight){
                        $(".list-ctn").css({'height':self.defaultOrloginHeight, 'background-color': '#f2f2f2'});
                    } */
                    self.listBox.removeClass("hide");
                    self.defaultBox.addClass("hide");
                }else{
                    self.listBox.addClass("hide");
                    self.defaultBox.removeClass("hide");
                    $('.selBox').hide();
                    $('.info-box').hide();
                }
            }
        });
    },

    // 更新列表数据集合
    updateListData: function() {
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

        self.viewData = finalData;
        self.updateListView();
    },

    // 更新列表视图
    updateListView: function() {
        var self = this,
            newData = self.viewData;

        self.listBox.html('');

        for(var j = 0; j < newData.length; ++j){
            var proData = new Object(),
                pData = newData[j];

            proData.CompanyLogoUrl = pData.CompanyLogoUrl;//logo
            proData.PackageName = pData.PackageName;//金融产品名称
            proData.CompanyName = pData.CompanyName;//公司名称

            proData.MonthlyPaymentPrefix = '';
            proData.MonthlyPaymentText = pData.MonthlyPaymentText.replace("元", "").replace("万", "");//月供
            proData.MonthlyPaymentUnit = pData.MonthlyPaymentText.indexOf("万") > 0?"万":"元";
            // proData.CommentScore = pData.CommentScore;//评分
            // proData.CommentCount = pData.CommentCount;//评价条数

            var CommentHtml = '';
            if(pData.CommentCount == 0){
                CommentHtml = '<span>暂无评价</span>'
            }else{
                CommentHtml = '<span class="font-title col_rede font_no_blod">'+ (pData.CommentScore%1 != 0?pData.CommentScore:pData.CommentScore+'.0') + '</span>分／<span class="evaluation"><span>'+ pData.CommentCount +'</span>条评价</span>'
            }
            proData.CommentHtml = CommentHtml;

            proData.ApplyCount = pData.ApplyCount;//申请人数
            proData.TotalCostPrefix = listViewModel.isShowLoanCost()?'分期成本':'';
            proData.TotalCostText = listViewModel.isShowLoanCost()?pData.TotalCostText:'';//总成本
            proData.SubHeading = pData.SubHeading;//副标题

            proData.IsSubtitleKlass = (pData.IsTop || pData.CompanyId == 803 || pData.OrderApplyUrl.indexOf("YxHxm")>=0)?"dl subtitle":"dl subtitle hide";

            proData.CommonRequirementName = '申请信息';
            if (pData.CommonRequirementType == 1) {
                proData.CommonRequirement = "严格";
                proData.CommonRequirementKlass = "font-28 level_one";
            }else if(pData.CommonRequirementType == 3){
                proData.CommonRequirement = "宽松";
                proData.CommonRequirementKlass = "font-28 level_three";
            }else{
                proData.CommonRequirement = "一般";
                proData.CommonRequirementKlass = "font-28 level_two";
            }

            //产品特点
            proData.PackageFeatureHrml = pData.PackageFeatureIcon1 && pData.PackageFeatureIcon2? '<span class="font-22 tag_blue">'+ pData.PackageFeatureIcon1 +'</span><span class="font-22 tag_red">'+ pData.PackageFeatureIcon2 +'</span>':'';

            //惠：MultiLabel，双竖杠分隔（PC站特殊标签说明：MultiLabelRemark，双竖杠分隔，与标签一一对应）ApplyCondition
            proData.MultiLabel = pData.MultiLabel?pData.MultiLabel.replace(/\|\|/g, "；"):"";
            proData.MultiLabelKlass = pData.MultiLabel?"uf uf-ic ut-s":"uf uf-ic ut-s hide";

            // 付：在线支付1元押金抵1000元，两个数字字段名分别为：DepositAmount，OffsetDownPaymentAmount
            if(pData.PaySimpleInfoList && pData.PaySimpleInfoList.length){
                proData.FuLabelKalss = "uf uf-ic ut-s";
                proData.PaySimpleInfo = pData.PaySimpleInfoList.join(";");
            }else{
                proData.FuLabelKalss = "uf uf-ic ut-s hide";
                proData.PaySimpleInfo = "";
            }
            // if(pData.DepositAmount == 0 || pData.DepositAmount == null || pData.OffsetDownPaymentAmount == 0 || pData.OffsetDownPaymentAmount == null){
            //  proData.FuLabelKalss = "uf uf-ic ut-s hide";
            //  proData.DepositAmount = "";
            //  proData.OffsetDownPaymentAmount ="";
            // }else{
            //  proData.FuLabelKalss = "uf uf-ic ut-s";
            //  proData.DepositAmount = pData.DepositAmount;
            //  proData.OffsetDownPaymentAmount = pData.OffsetDownPaymentAmount;
            // }

            //礼：礼包：PackageGiftValueAmount套餐礼包价值，为0不显示
            if(pData.PackageGiftValueAmount == 0 || pData.PackageGiftValueAmount == null){
                proData.PackageGiftValueAmount = "";
                proData.PackageGiftValueKlass = "uf uf-ic ut-s hide";
            }else{
                proData.PackageGiftValueAmount = pData.PackageGiftValueAmount;
                proData.PackageGiftValueKlass = "uf uf-ic ut-s";
            }

            //角标
            proData.RecommendText = pData.RecommendText;
            if(pData.RecommendText){
                if(pData.PackageGiftValueAmount || pData.MultiLabel || pData.PaySimpleInfoList.length>0){
                    proData.RecommendTextKlass = "corner corner-lifuhui";
                    proData.ImgInfoKlass = "img_info";
                }else{
                    proData.RecommendTextKlass = "corner";
                    proData.ImgInfoKlass = "img_info hide";
                }
            }else{
                proData.RecommendTextKlass = "hide";
                if(!pData.MultiLabel && (!pData.PaySimpleInfoList || pData.PaySimpleInfoList.length==0)){
                    proData.ImgInfoKlass = "hide";
                }else{
                    proData.ImgInfoKlass = "img_info";
                }
            }
            proData.IsTopKlass = pData.IsTop?"top-tag":"top-tag hide";//置顶是佛显示
            proData.detailUrl = CheDaiURL + city.citySpell + "/m" + car.carId + "/p" + pData.ProductId+ (dealer.dealerId != ""?"/d" + dealer.dealerId:"")+ "?carprice=" + car.carPrice + "&source=" + source + "&shop=" + shopcode;

            if (pData.PackageType === 38 && pData.IsTop === true) {
                proData.MonthlyPaymentPrefix = '租金：';
                proData.MonthlyPaymentText = pData.MonthlyRent;//月供
                proData.MonthlyPaymentUnit = "元";
                if (pData.YzdgMonthlyPaymentText) {
                    proData.TotalCostPrefix = '先开后买租金：';
                    proData.TotalCostText = pData.YzdgMonthlyPaymentText + '/月';//总成本
                } else {
                    proData.TotalCostPrefix = '';
                    proData.TotalCostText = '';
                }
                proData.CommonRequirementName = '提交材料';
                proData.detailUrl = CheDaiURL + "lease/" + city.citySpell + "/m" + car.carId + "/p" + pData.ProductId+ (dealer.dealerId != ""?"/d" + dealer.dealerId:"")+ "?carprice=" + car.carPrice + "&source=" + 912 + "&shop=" + shopcode;
            }

            proData.DownPayment = self.filter.downPayment < 0 ?  '(首付'+ pData.DownPaymentRate * 100 + '%：'+ pData.DownPaymentText + ')' : '';
            proData.RepaymentPeriod = self.filter.repaymentPeriod < 0 ? '('+ pData.RepaymentPeriod + '期)' : ''

            listViewModel.productsView.push(proData);
        }

        $.ajax({
            url: adviserApi + "v2/group/getadviserlist/?CityId=" + city.cityId + "&CompanyIds=" + newData[0].CompanyId,
            timeout: 50000,
            type: 'Get',
            dataType: 'jsonp',
            async: true,
            cache: true,
            success: function(result){
               if (result.Data != null && result.Data[0] != null) {
                    var adviserAdv = result.Data[0].Adviser;
                    $.each(newData, function(index, val) {
                        $(".pro-groups").eq(index).prepend('<a class="adviser" data-tel=tel:' + adviserAdv.CN400 + ' data-companyid=' + val.CompanyId + '>' +
                            '<div class="uf uf-ic">' +
                            '<div class="name uf uf-ic"><img class="ad-photo" src="' + adviserAdv.Photo + '">' +
                            '<span>' + adviserAdv.Name + '</span>' +
                            '</div>' +
                            '<div class="ad-tel"></div>' +
                            '</div>' +
                            '</a>').addClass('has-expert');
                    });
                }
            }
        });

        if (newData.length) {
            this.defaultBox.addClass('hide');
        } else {
            this.defaultBox.removeClass('hide');
        }
    },

    //贷款顾问
    loanAdviser: function(CompanyId){
        var self = this;
        var _url = adviserApi + "adviser/" + city.cityId + "/" + CompanyId + "/";
        tools.$ajax({
            url: _url,
            dataType: 'jsonp',
            success: function(res){
                if (res.Advisers == null) {
                    listViewModel.isLoanAdviser(false);
                    self.adviserId = 0;
                } else {
                    listViewModel.isLoanAdviser(true);

                    var loanAdviserShows = [];
                    var loanAdvisers = [],
                        advisers = res.Advisers,
                        adviserCount = advisers.length,
                        supplement = 3 - (adviserCount % 3),
                        maxIndex,
                        adviserNum = res.Advisers.length,
                        adviserIndex = Math.floor(Math.random() * adviserNum + 1) - 1;
                    self.adviserId = advisers[adviserIndex].Id;
                    (adviserCount > 3) ? maxIndex = (adviserCount + supplement) : maxIndex = adviserCount;
                    listViewModel.loanAdviserCount(adviserCount);
                    if (adviserCount == 0) {
                        $(".cpxq14").css("display", "none");
                        $(".cpxq171").css("display", "none");
                        $(".cpxq17 a").css("width", "100%");
                    }
                    var skillLevelClass = "jz";
                    for (var i = 0 ; i < adviserCount; i++) {
                        var adviser = advisers[i],
                            _tip = "";
                        if (adviser) {
                            if (adviser.SkillLevelId == 1) {
                                _tip = "铜牌顾问：热情周到，跟进迅速，服务能力突出";
                                skillLevelClass = "tz";
                            } else if (adviser.SkillLevelId == 2) {
                                _tip = "银牌顾问：贷款成功率高，可针对不同用户的不同需求做出评估指导";
                                skillLevelClass = "yz";
                            } else {
                                _tip = "金牌顾问：精通车贷业务，全方位服务用户，用户评价较高";
                                skillLevelClass = "jz";
                            }
                        }

                        var loanAdviserObj;
                        //console.log(i +"__"+(adviserCount + supplement -2))

                        loanAdviserObj = {
                            Id: adviser.Id,
                            name: adviser.Name,
                            workingYears: adviser.WorkingYears,
                            skillLevelId: adviser.SkillLevelId,
                            skillLevelClass: skillLevelClass,
                            photo: adviser.Photo,
                            cN400: adviser.CN400,
                            exTen: adviser.ExTen,
                            serveNumber: "已帮" + adviser.ServeNumber + "人贷款　",// + adviser.Rate + "%好评"
                            tip: _tip,
                            specialClass: "swiper-slide"
                        }

                        loanAdvisers.push(loanAdviserObj);
                        if (i < 3) {
                            loanAdviserShows.push(loanAdviserObj);
                        }
                    }
                    listViewModel.loanAdviserShows(loanAdviserShows);
                    listViewModel.loanAdviserOrders(loanAdvisers);

                };
            }
        })
    },

    //报价和贷款顾问显示
    showDealerOrAdviser: function(id, scrollName){
        $("#"+id).removeClass("hide");
        $("#maskLayer").css("display","block");
        $("html").css('overflow-y','hidden');
        $('body').bind('touchmove',function(e){
            e.preventDefault();
        });
        setTimeout(function(){
            scrollName.refresh();
        }, 300);
    },//报价和贷款顾问隐藏
    hideDealerOrAdviser: function(id){
        $("#"+id).addClass("hide");
        $('body').unbind('touchmove');
        $("#maskLayer").css("display","none");
        $("html").css('overflow-y','auto');
    }
}

$(function(){
    var listPage = new ListPage();
    listPage.init();
    tools.appDown(true);
    // if(tools.getCookie("YiXinAppInfo")){
    //     $('#appDown').addClass('hide');
    // }else{
    //     // app下载
    //     if( tools.getCookie('hideAppDown') == '1' ){
    //         $('#appDown').addClass('hide');
    //     } else {
    //         $('#appDown').removeClass('hide');
    //         $('body').css({'padding-top': '1.44rem'});
    //
    //         var ua = navigator.userAgent;
    //         var platform = /MicroMessenger/i.test(ua) ? "weixin" : /Android/i.test(ua) ? "android" : /iPhone|iPad|iPod/i.test(ua) ? "ios" : "pc";
    //         if (platform != "pc" && platform != "android" &&  tools.getCookie('hasOpen') != '1' ) {
    //             // 记录第一次打开
    //             var cookieHasOpen = 'hasOpen=1;path=/;domain=' + tools.wildcardUrl();
    //             document.cookie = cookieHasOpen;
    //
    //             $('#loadAppButton').trigger('click');
    //         }
    //     }
    // }
    
});