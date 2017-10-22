import './detail.scss';

import Vue from 'vue';
import CarSelector from 'libs/vue-components/car-selector'
import Share from 'libs/share/index';
import citySelect from 'libs/citySelect';
import YXSlider from 'libs/yxSlider';
import iScroll from 'iscroll';
import 'swiper';
import 'chart.js';

tools.appDown(true);

var DetailPage = function () {
    var self = this
    this.myDoughnut = null;
    //环形图初始数据
    this.datasetsData = [{
        data: [
            100,//首付
            100,//贷款额度
            100,//贷款成本
            100//税费
        ],
        backgroundColor: [
            "#06C1AE",//首付
            "#CECECE",//贷款成本
            "#FB8971",//贷款额度
            // "#a4a4a4"//税费
        ],
        hoverBackgroundColor: [
            "#06C1AE",//首付
            "#CECECE",//贷款成本
            "#FB8971",//贷款额度
            // "#a4a4a4"//税费
        ],
        label: '总花费'
    }];
    this.isRefresh = true;//是否刷新月供
    this.adviserId = "";//贷款顾问ID
    this.isDownPaymentPeriodAjax = true;//是否可以加载首付月供
    this.isInitYXSlider = true;//是否初始化slider
    this.downPaymentSlider = null;
    this.repaymentPeriodSlider = null;
    this.isDownPaymentSlider = true;

    this.carPriceScroll = null;
    //DOM
    this.domCache = {
        flagshipStoreLink: $("#flagshipStoreWrapper").data("link"),//旗舰店跳转url
        loanDetailsDom: $("#detailsConWrapper .loan-details"),//贷款详情
        userEvaluatioDom: $("#detailsConWrapper .user-evaluation"),//用户评论
        faqDom: $("#detailsConWrapper .eQ-con"),//易问答
        inOrderToShareDom: $("#inOrderToShare"),//车主晒单
        myChart: document.getElementById("myChart") && document.getElementById("myChart").getContext("2d"),//canvas
        priceLayer: $("#priceListLayer"),//价格弹层
        maskLayer: $("#maskLayer"),//灰色蒙层
        downPaymentDom: $("#downPayment"),//首付
        repaymentPeriodDom: $("#repaymentPeriod"),//月供
        carPriceLayer: $("#carPriceLayer"),//经销商报价
        isBorder: $("#carWrapper .car-price .no-border").length,//厂家指导价的下划线
        featuresMoreBox: $(".detail-features-more"),
        toggleTag2: $("#toggleTag2>span"),//用户评价tab数量
        evaluationLoad: $(".user-evaluation .loading"),//评价加载
        evaluationList: $("#evaluationList"),//评价列表
        evaluationDefault: $(".user-evaluation .default-box"),//评价缺省
        evaluationHeader: $(".user-evaluation .evaluation-header"),
        adviserLayer: $("#adviserLayer"),//贷款顾问弹层
        sliderUpBox: $(".user-evaluation .sliderUp-box"),//向下滑动
        formDom: $("#orderInfoForm"),//form
        adviserStatus: $(".adviser-status"),//判断贷款顾问显示隐藏状态的class
        hxmPayment: $(".hxm-payment-wrapper"),
        orderShareLoad: $("#inOrderToShare .loading"),//车主晒单加载
        orderShareList: $("#inOrderToShare .order-share-list"),//车主晒单列表
        orderShareDefault: $("#inOrderToShare .order-share-default"),//车主晒单缺省
        sliderUpBox2: $("#inOrderToShare .sliderUp-box"),//车主晒单向下滑动

        loanCondPopup: $('#loanCondPopup'),//首付&期限弹层
        infoUp: $('#infoUp'),//优惠信息弹层
        // infoScroll: $('#infoScroll'),//优惠信息滚动
        typicalUp: $('#typicalUp'),//产品特点弹层
        typicalScroll: $('#typicalScroll'),//产品特点滚动

        toolsNav: $('#tools-nav'),//导航tips触发
        navTips: $('#navTips'),//导航tips
    }

    this.downPaymentNoUnitArr  = []; //首付比数组
    this.downPaymentNoUnitNumArr = [];
    this.downPaymentPIdArr = [];//首付比产品ID数组
    this.repaymentNoUnitArr  = [];//期限数组
    this.repaymentNoUnitNumArr = [];
    this.repaymentPIdArr = [];//期限产品ID数组
    //评价相关数据
    this.evaluationData = {
        pageCount: 0,//总页码
        pageIndex: 1,//评价当前页面
        pageSize: 10,//每页条数
        scrollSign: false,//是否可以滚动
    }
    //车主晒单相关数据
    this.inOrderToShareData = {
        pageCount: 0,//总页码
        pageIndex: 1,//评价当前页面
        pageSize: 10,//每页条数
        scrollSign: false,//是否可以滚动
    }

    //数据绑定
    this.vm = new Vue({
        el: '#viewsWrapper',
        components: {
            CarSelector,
            Share
        },
        data() {
            var _imgUrl = $('#wx_pic img').attr('src');
            var _desc = $(".package-wrapper h1").text() + '贷车，还款灵活哦！易鑫车贷，一站式互联网汽车金融平台，尽享优惠快捷！（分享来自@易鑫车贷平台）';
            // alert(_desc);
            return {
                cityId:+city.cityId,
                interfaceCar: `${dev ? '/' : window.APIURL}api/Other/GetCarAndPriceListNew/?pkgId=${product.packageID}`,
                //分享数据
                shareOptions: {
                    title: car.carSerialShowName,
                    url: window.location.href,
                    desc:_desc,
                    image: _imgUrl
                },
                quotationType: '--',//报价类型
                quotationAmount: "--",//报价金额
                downPayment: "--",//首付金额
                downPaymentCount: "--",//首付数值
                downPaymentRate: "--",//首付比例
                loanAmount: "--",//贷款金额
                loanAmountCount: "--",//贷款额度数值
                loanAmount2: "--",//贷款金额万为单位
                downPayment2: "--",//首付金额万为单位
                totalCost: "--",//贷款成本（利息、手续费之和）
                totalCostCount: "--",//贷款成本数值
                totalExpenses: "--",//总花费（车价 + 贷款成本 + 税费）
                monthlyPayment: "--",//月供
                monthlyPaymentCount: "--",//月供数值
                securityDeposit:"--",//保证金
                securityDepositCount:"--",
                oldMonthlyPayment: "--", //原月供
                oldMonthlyPaymentCount: "--", //原月供数值
                finalPaymentAmount: "--",//贷款尾款
                finalPaymentAmountCount: "--",//贷款尾款
                finalPaymentAmountNum: 0,
                finalPaymentRate: "--",//尾款比例
                rateText: "--",//月费率/月利率文本
                oldRateText:'--',//原费率／原利率文本
                interestRate: "--",//月费率/月利率金额
                oldInterestRate: "--", //原月费率/原月利率金额
                totalInterest: "--",//利息
                serviceFee: "--",//手续费
                purchaseTax: "--",//购置税
                taxation: "--",//税费=购置税 + 500（上牌） + 950（强险）
                carPrice: car.carPrice,//车价
                productId: product.productID,
                packageId: product.packageID,
                // commonQuestions:[],//常见问题列表
                evaluationQuotes: [],//评价列表
                downPaymentHtml: "",//首付文本Html
                repaymentHtml: "",//月供文本Html
                isLoanAdviser: false,//贷款顾问是否显示
                loanAdviserOrders: [],//贷款顾问列表
                loanAdviserCount: 0,//贷款顾问数量
                loanAdviserTel: 'tel:4000169169',
                loanAdviserShows: [],//最多三个贷款顾问
                carPriceFormat: tools.addCmma(car.carPrice * 10000),
                inOrderToShareArr: [],//车主晒单列表

                isShowLoanCost : true,//是否隐藏贷款成本true
                ABTestkey : 1,//是否隐藏贷款成本传递参数
                firstPayment : "--",//首次支付
                firstPaymentMoney : "--",//首次支付元
                isLumpPayment: isLumpPayment.toLowerCase()=='true'?true:false, //是否支持一次性支付
                isDeposit: isDeposit.toLowerCase()=='true'?true:false, //是否支持保证金
                isPromotionExpired: product.productPromotionId !== '0' && isPromotionExpired === "False" && isTieXi === "False"?true:false,//是否促销

                repaymentPeriod: "--",//期限
            }
        },
        
        methods: {
            selectCarCallback(data){
                const href = `${window.baseRoutes || ''}/${city.citySpell}/m${data.car.id}/p${this.productId}?carprice=${data.car.price}&source=${window.source}`
                if(dev){
                    console.log(href)
                }else{
                    window.location.href = href
                }
            },
            selectPayment: function (id) {
                $('.cur').removeClass('cur');
                this.productId = id
                $('span[data-id="' + id + '"]').addClass('cur')
                self.loanInfo()
            }
        }
    })
    this.curTab = 0;
    this.init();
};


DetailPage.prototype = {
    init: function () {
        var self = this;
        //是否支持该城市和促销是否过期
        if (isForCity == "False") {
            if (typeof hasCityFitCar != 'undefined' && hasCityFitCar == "False") {
                $('.applyBtnEvent').addClass('disabled').text('暂不支持该城市');
                tools.showAlert("暂不支持该车款", 2000);
            } else {
                // tools.showAlert("暂不支持该城市<br/>("+ city.cityName  +")",2000);
                $('#none-this-city').css('display', 'block');
                var mySwiper = new Swiper('#none-this-city .swiper-container', {
                    // 如果需要滚动条
                    slidesPerView: 'auto',
                    scrollbar: '.swiper-scrollbar'
                });
                var cover = $('#none-this-city .cover');
                var opener = $('#none-this-city .opener');
                var content = $('#none-this-city .product-wrapper');
                content.css('height', content[0].scrollHeight + 'px');
                cover.on('click', function (e) {
                    e.preventDefault();
                    cover.fadeOut();
                    content.css('height', 0);
                    opener.addClass('closed');
                });
                opener.on('click', function (e) {
                    e.preventDefault();
                    if (opener.hasClass('closed')) {
                        cover.fadeIn();
                        content.css('height', content[0].scrollHeight + 'px');
                        opener.removeClass('closed');
                    } else {
                        cover.fadeOut();
                        content.css('height', 0 + 'px');
                        opener.addClass('closed');
                    }
                });
            }
        } else if (isPromotionExpired == "True") {
            $('.applyBtnEvent').addClass('disabled').text('过期已下线');
            tools.showAlert("过期已下线", 2000);
        }

        // 判断是否是不显示贷款成本的城市 奇数存传1 偶数传2
        //1：奇数：可以看到贷款成本
        //2：偶数：看不到贷款成本
        //if (tools.getCookie('_utrace')){}

        /*let noLoanCityArr = noLoanCostCityIds.split(',');
         if(noLoanCityArr.indexOf(city.CityId)>=0){
            self.vm.isShowLoanCost = false;
         }tools.setCookie('_utrace','4c1bf906-1940-4503-a4c9-388ebdd09037')
         console.log(noLoanCityArr,parseInt((tools.getCookie('_utrace')).substring(0,1),16),self.vm.isShowLoanCost)

         tools.setCookie('_utrace','4c1bf906-1940-4503-a4c9-388ebdd09037')
         */
        //当_utrace的值为奇数传1，偶数传2。   参数为：ABTestkey
        let utrace = tools.getCookie('_utrace');

        if (!utrace) {
            let uuid;

            // 先从localStorage取值
            if (window.localStorage) {
                uuid = window.localStorage.getItem('_utrace');
            }

            // 自己生成
            if (!uuid) {
                uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
                    return v.toString(16)
                });

                // 若uuid空的情况下（具体浏览器未知）, 保证拿到一个不重复的值
                if (!uuid) {
                    uuid = +new Date() + '-' + Math.round(Math.random() * 100000)
                }

                if (window.localStorage) {
                    window.localStorage.setItem('_utrace', uuid);
                }
            }

            //s20是代表20秒,h是指小时，如12小时则是：h12,d是天数，30天则：d30
            tools.setCookie('_utrace', uuid, 'd30');
            utrace = uuid;
        }

        if (parseInt(utrace.substring(0,1),16) % 2 === 0) {
            self.vm.isShowLoanCost = false;
            self.vm.ABTestkey = 2;
        }
        // 判断是否是不显示贷款成本的城市结束


        $("#orderInfoForm").attr('action', orderApplyUrl)
        //车主晒单
        this.inOrderToShare();

        //首付期限
        this.downPaymentPeriod();
        this.bindEvents();
        if(this.vm.finalPaymentAmountNum > 0){
            $('#loanCond .weikuan').show();
        }

        //常见问题
        // this.commonQuestions();

        //经销商报价
        if (document.getElementById('carPriceLayerCon')) {
            self.carPriceScroll = new iScroll("#carPriceLayerCon", {
                'click': true,
            });
        }

        //明细弹层
        // this.priceLayerScroll = new iScroll("#priceListLayer", {
        //     'click': true,
        // });

        //贷款顾问弹层
        this.adviserScroll;
        //用户评价
        this.userEvaluation();

        //贷款顾问
        this.loanAdviser();

        Echo.init({
            offset: 0,
            throttle: 0
        });

        // ADD by qianyuan 2016,.9.26
        // 租车
        var rentLabels = $('.lease .product label');
        rentLabels.bind('touchend', function (e) {
            e.preventDefault();
            rentLabels.removeClass('active');
            $(this).addClass('active');
            self.vm.productId = $(this).attr('attr-id');
        });

        // app下载
        // if (tools.getCookie('hideAppDown') == '1' || isApp) {
        //     $('#appDown').addClass('hide');
        // } else {
        //     $('#appDown').removeClass('hide');
        //     $('body').css({ 'padding-top': '1.44rem' });
        //
        //     var ua = navigator.userAgent;
        //     var platform = /MicroMessenger/i.test(ua) ? "weixin" : /Android/i.test(ua) ? "android" : /iPhone|iPad|iPod/i.test(ua) ? "ios" : "pc";
        //     if (platform != "pc" && platform != "android" && tools.getCookie('hasOpen') != '1') {
        //         // 记录第一次打开
        //         var cookieHasOpen = 'hasOpen=1;path=/;domain=' + tools.wildcardUrl();
        //         document.cookie = cookieHasOpen;
        //
        //         $('#loadAppButton').trigger('click');
        //     }
        // }

    },
    //环状图
    doughnutChart: function (datasets) {
        var self = this;
        self.myDoughnut = null;

        var config = {
            type: 'doughnut',
            data: {
                datasets: datasets,
                labels: []
            },
            options: {
                responsive: true,
                cutoutPercentage: 55,
                //Function - Will fire on animation completion.
                onAnimationComplete: function () {
                },
                animation: {
                    animateScale: false,
                    animateRotate: true
                },
                elements: {
                    arc: {
                        backgroundColor: 'rgb(255, 0, 0)',
                        borderColor: 'rgb(0, 0, 255)',
                        borderWidth: 0,
                        hoverBackgroundColor: 'rgb(255, 255, 255)',
                    }
                },
                tooltips: {
                    enabled: false
                }

            }
        };
        if (self.domCache.myChart) {
            self.myDoughnut = new Chart(self.domCache.myChart, config);
        }
    },
    //获取首付、期限
    downPaymentPeriod: function () {
        var self = this,
            _url = '/Product/GetById/' + self.vm.productId +'?carPrice=' + car.carPrice;

        self.sendAjax({
            url: _url
        }, success, sendAgain);

        function success(res) {
            self.loanInfo();
            // 在线审批
            if (self.domCache.hxmPayment.length) {
                self.selectBlock(res)
            } else if(self.domCache.downPaymentDom.length){
                // 普通滑块

                if (self.isInitYXSlider) {
                    // self.slideBlock(res);
                    // 首付比
                    self.setYXSlider({
                        'sliderData': res.ProductDownpaymentrates
                    });
                    // 期限
                    self.setYXSlider({
                        'id': 'repaymentPeriod',
                        'sliderData': res.ProductRepaymentperiods,
                        'unitArrName': 'repaymentPeriodUnitArr',
                        'noUnitArrName' : 'repaymentPeriodNoUnitArr',
                        'noUnitArrNumName' : 'repaymentNoUnitNumArr',
                    });
                    self.isInitYXSlider = false;
                }
            }
        }

        // 出错后重新加载
        function sendAgain(info) {
            //console.log(info);
            self.sendAjax({
                url: _url,
            }, success, sendAgain);
        };
    },
    //通过车价和产品计算贷款信息
    loanInfo: function () {
        var self = this,
            _url = '/Product/Calculation/?carPrice=' + car.carPrice + '&productId=' + self.vm.productId + '&carId=' + car.carId;

        self.sendAjax({
            url: _url
        }, success, sendAgain);

        function success(res) {
            if (res.Result) {
                var _downPayment = res.Data.downPayment * 10000,
                    _loanAmount = res.Data.loanAmount * 10000,
                    _totalCost = Math.round((self.vm.isPromotionExpired?res.Data.promotionTotalCost:res.Data.totalCost) * 10000),
                    // _promotionTotalCostText = res.Data.promotionTotalCostText * 10000,
                    _monthlyPayment = res.Data.monthlyPayment * 10000,
                    _promotionMonthlyPayment = res.Data.promotionMonthlyPayment * 10000,
                    _finalPaymentAmount = res.Data.finalPaymentAmount * 10000,
                    _interestRate = res.Data.interestRate * 100,
                    _promotionInterestRate = res.Data.promotionInterestRate *100,
                    _totalInterest = res.Data.totalInterest * 10000,
                    _serviceFee = res.Data.serviceFee * 10000,
                    _purchaseTax = res.Data.purchaseTax * 10000,
                    _totalExpenses = self.vm.carPrice * 10000 + _totalCost + _purchaseTax + 1450,
                    _fistPayment = Math.round((res.Data.firstPayment+ self.vm.isPromotionExpired?res.Data.promotionTotalCost:res.Data.totalCost) * 10000);
                //首付金额
                self.vm.downPayment = tools.addCmma(_downPayment);
                self.vm.downPaymentCount = self.changeNumber(res.Data.downPayment);
                //首付比例
                self.vm.downPaymentRate = (res.Data.downPaymentRate * 100).toString() + '%';
                // console.log('loanInfo',res.Data.downPaymentRate);
                //贷款金额
                self.vm.loanAmount = tools.addCmma(_loanAmount);
                self.vm.loanAmountCount = self.changeNumber(res.Data.loanAmount);
                //保证金
                self.vm.securityDepositCount = self.changeNumber(res.Data.securityDeposit);
                self.vm.securityDeposit= tools.addCmma(Math.round(res.Data.securityDeposit * 10000));
                // 首次支付
                self.vm.firstPayment = tools.addCmma(Math.round(res.Data.firstPayment * 10000)+Math.round(_totalCost));
                self.vm.firstPaymentMoney = self.changeNumber(res.Data.firstPayment+(self.vm.isPromotionExpired?res.Data.promotionTotalCost:res.Data.totalCost));
                //首付金额万为单位
                self.vm.downPayment2 = res.Data.downPayment;
                //贷款金额万为单位
                self.vm.loanAmount2 = res.Data.loanAmount;
                //贷款成本
                self.vm.totalCost = tools.addCmma(_totalCost);
                self.vm.totalCostCount = self.changeNumber(self.vm.isPromotionExpired?res.Data.promotionTotalCost:res.Data.totalCost);
                //月供
                self.vm.monthlyPayment = self.vm.isPromotionExpired ? tools.addCmma(_promotionMonthlyPayment):tools.addCmma(_monthlyPayment);
                self.vm.monthlyPaymentCount  = self.vm.isPromotionExpired ? self.changeNumber(res.Data.promotionMonthlyPayment) :self.changeNumber(res.Data.monthlyPayment);
                self.vm.oldMonthlyPayment = tools.addCmma(_monthlyPayment);
                self.vm.oldMonthlyPaymentCount = self.changeNumber(res.Data.monthlyPayment);
                //贷款尾款
                self.vm.finalPaymentAmount = tools.addCmma(_finalPaymentAmount);
                self.vm.finalPaymentAmountCount = self.changeNumber(res.Data.finalPaymentAmount);
                self.vm.finalPaymentAmountNum = _finalPaymentAmount;
                //尾款比例
                self.vm.finalPaymentRate = (res.Data.finalPaymentRate * 100).toString() + '%';
                //月费率/月利率文本
                self.vm.rateText = res.Data.rateText;
                self.vm.oldRateText = res.Data.rateText == "月费率"?"原费率":"原利率";
                //月费率/月利率金额
                self.vm.interestRate = self.vm.isPromotionExpired ? _promotionInterestRate.toFixed(2) + "%" : _interestRate.toFixed(2) + "%";
                self.vm.oldInterestRate = _interestRate.toFixed(2) + "%";
                //利息
                self.vm.totalInterest = tools.addCmma(_totalInterest);
                //手续费
                self.vm.serviceFee = tools.addCmma(_serviceFee);
                //购置税
                self.vm.purchaseTax = tools.addCmma(_purchaseTax);
                //税费=购置税 + 500（上牌） + 950（强险）
                self.vm.taxation = tools.addCmma(_purchaseTax + 1450);
                //总花费
                self.vm.totalExpenses = tools.addCmma(_totalExpenses);
                //分享
                var _curDownPayment = self.vm.downPaymentCount;
                if(self.vm.isLumpPayment || self.vm.isDeposit) {
                    _curDownPayment = self.vm.firstPaymentMoney;
                }
                self.vm.shareOptions.title = car.carSerialShowName + '首付只要'+ _curDownPayment +'，月供'+self.vm.monthlyPaymentCount+'，易鑫帮您贷回家~';
                self.vm.$nextTick(() => self.vm.$broadcast('updateShare',self.vm.shareOptions));

                //环形图初始数据
                self.datasetsData = [{
                    data: [
                        !self.vm.isLumpPayment?_downPayment:_fistPayment,//首付
                        _totalCost,//贷款成本
                        _loanAmount,//贷款额度
                        // _purchaseTax + 1450,//税费
                    ],
                    backgroundColor: [
                        "#06C1AE",//首付
                        "#CECECE",//贷款成本
                        "#FB8971",//贷款额度
                        // "#a4a4a4",//税费
                    ],
                    hoverBackgroundColor: [
                        "#06C1AE",//首付
                        "#CECECE",//贷款成本
                        "#FB8971",//贷款额度
                        // "#a4a4a4",//税费
                    ],
                    // label: '总花费'
                }];
                //刷新环形图
                $('#priceBox').removeClass('hide');
                self.doughnutChart(self.datasetsData);
                // $('#priceBox').removeClass('hide');
                if(self.vm.finalPaymentAmountNum > 0){
                    $('#loanCond .weikuan').show();
                }


            }

        }

        // 出错后重新加载
        function sendAgain(info) {
            //console.log(info);
            self.sendAjax({
                url: _url,
            }, success, sendAgain);
        };
    },
    //数值转换
    changeNumber: function(numberName){
        return numberName < 1? Math.round(numberName*10000)+'元' : numberName.toFixed(2)+'万';
    },
    //车主晒单
    inOrderToShare: function () {
        var self = this,
            _url = '/shareorder/GetTopicList/?brandId=' + car.masterBrandId + '&cityId=' + city.cityId + '&pageIndex=' + self.inOrderToShareData.pageIndex + '&pageSize=' + self.inOrderToShareData.pageSize;

        self.sendAjax({
            url: _url,
            dataType: 'json'
        }, success, sendAgain);

        function success(res) {
            // console.log(res);
            var _data = res.Data;
            if (_data.length > 0) {
                self.inOrderToShareData.pageCount = Math.ceil(res.RowCount / self.inOrderToShareData.pageSize);//计算总页码
                self.domCache.orderShareLoad.addClass('hide');
                self.domCache.orderShareList.removeClass('hide');
                self.domCache.orderShareDefault.addClass('hide');

                $.each(_data, function (index, val) {
                    var _inOrderToShareObj = {};
                    var imagesSrc = [],
                        imageLiClassName = "";
                    if (val.ListImage.length >= 3) {
                        imagesSrc = val.ListImage.slice(0, 3);
                        imageLiClassName = "";
                    } else if (val.ListImage.length == 1) {
                        imageLiClassName = "one-list";
                        imagesSrc = (val.ListImage);
                    } else {
                        imageLiClassName = "double-list";
                        imagesSrc = (val.ListImage);
                    }

                    var dataTime = val.CreatedOn.split("(")[1].split(")")[0];

                    _inOrderToShareObj.createdOn = self.formatTime(parseInt(dataTime));
                    _inOrderToShareObj.browserCount = val.BrowserCount;
                    _inOrderToShareObj.agreeCount = val.AgreeCount;
                    // _inOrderToShareObj.userName = val.UserName;
                    _inOrderToShareObj.listImage = imagesSrc;
                    _inOrderToShareObj.title = val.Title;
                    _inOrderToShareObj.userAvatar = val.UserAvatar;
                    _inOrderToShareObj.nickName = val.UserName || val.NickName;
                    _inOrderToShareObj.imageLiClassName = imageLiClassName;
                    _inOrderToShareObj.url = val.Url;
                    self.vm.inOrderToShareArr.push(_inOrderToShareObj);
                })


                self.domCache.sliderUpBox2.removeClass('hide');
                if (self.inOrderToShareData.pageIndex < self.inOrderToShareData.pageCount) {
                    self.inOrderToShareData.scrollSign = true;
                    self.domCache.sliderUpBox2.html('<i class="sliderUp"></i>向上滑动刷新');
                } else {
                    self.inOrderToShareData.scrollSign = false;
                    self.domCache.sliderUpBox2.html('没有更多了~');
                }

            } else {
                self.sendAjax({
                    url: '/shareorder/GetTopicList/?brandId=0&cityId=' + city.cityId + '&pageIndex=1&pageSize=1',
                    dataType: 'json'
                }, successDefault, sendAgainDefault);


                self.inOrderToShareData.scrollSign = false;
                self.domCache.orderShareLoad.addClass('hide');
                self.domCache.orderShareList.addClass('hide');
                self.domCache.orderShareDefault.removeClass('hide');

            }
        }

        function successDefault(res) {
            self.domCache.orderShareDefault.find("a").eq(1).html("更多车款晒单(" + res.RowCount + ")")
        }
        function sendAgainDefault() {
            //console.log(info);
            self.sendAjax({
                url: _url,
            }, successDefault, sendAgainDefault);
        }

        // 出错后重新加载
        function sendAgain(info) {
            //console.log(info);
            self.sendAjax({
                url: _url,
            }, success, sendAgain);
        };
    },
    //用户评价
    userEvaluation: function () {
        var self = this,
            _url = '/PackageComment/Get/?packageId=' + self.vm.packageId + '&pageIndex=' + self.evaluationData.pageIndex + '&pageSize=' + self.evaluationData.pageSize;

        self.sendAjax({
            url: _url
        }, success, sendAgain);

        function success(res) {
            if (res.Result) {
                var _data = res.Data;
                if (_data.length > 0) {
                    self.evaluationData.pageCount = Math.ceil(res.RowCount / self.evaluationData.pageSize);//计算总页码
                    self.domCache.evaluationLoad.addClass('hide');
                    self.domCache.evaluationList.removeClass('hide');
                    self.domCache.evaluationDefault.addClass('hide');
                    self.domCache.evaluationHeader.removeClass('hide');
                    $(".user-evaluation .sliderUp-box.font-ctn").removeClass('hide');
                    self.domCache.toggleTag2.text('(' + res.RowCount + ')');
                    $.each(_data, function (index, val) {

                        var _evaluation = {}

                        _evaluation.carAllName = !val.CarBaseInfo ? "" : val.CarBaseInfo.CarSerialShowName + ' ' + val.CarBaseInfo.CarYear + '款 ' + val.CarBaseInfo.CarName;
                        _evaluation.nickName = val.UserComment.NickName;
                        _evaluation.content = val.UserComment.ProductJudgeContent ? val.UserComment.ProductJudgeContent : ((val.UserComment.ProductTag) ? '' : '该用户仅评分，未填写评价内容');
                        _evaluation.serviceScore = String(val.UserComment.ProductJudgeScore * 20) + "%"
                        // _evaluation.ProductJudgeClass = val.UserComment.ProductJudgeContent?'prom-cont f-3 drop-tree':'prom-cont f-6 drop-tree';

                        var dataTime = val.UserComment.UpdateTime.split("(")[1].split(")")[0];
                        _evaluation.updateTime = self.formatTime(parseInt(dataTime));

                        if (val.UserComment.ProductTag) {
                            var tags = val.UserComment.ProductTag.split("|");
                            for (var i = 0; i < tags.length; i++) {
                                if (tags[i] == "" || typeof (tags[i]) == "undefined") {
                                    tags.splice(i, 1);
                                    i = i - 1;
                                }
                            }

                            _evaluation.tags = tags;
                        } else {
                            _evaluation.tags = "";
                        }

                        self.vm.evaluationQuotes.push(_evaluation);
                    });

                    // console.log(self.evaluationData.pageIndex +"__"+self.evaluationData.pageCount)
                    self.domCache.sliderUpBox.removeClass('hide');
                    if (self.evaluationData.pageIndex < self.evaluationData.pageCount) {
                        self.evaluationData.scrollSign = true;
                        self.domCache.sliderUpBox.html('<i class="sliderUp"></i>向上滑动刷新');
                    } else {
                        self.evaluationData.scrollSign = false;
                        self.domCache.sliderUpBox.html('没有更多了~');
                    }
                } else {
                    self.evaluationData.scrollSign = false;
                    self.domCache.sliderUpBox.addClass('hide');
                    self.domCache.toggleTag2.text('');
                    self.domCache.evaluationLoad.addClass('hide');
                    self.domCache.evaluationList.addClass('hide');
                    self.domCache.evaluationDefault.removeClass('hide');
                    self.domCache.evaluationHeader.addClass('hide');
                }
            }
        }

        // 出错后重新加载
        function sendAgain(info) {
            //console.log(info);
            self.sendAjax({
                url: _url,
            }, success, sendAgain);
        };
    },
    // 按钮选择
    selectBlock: function (res) {
        var self = this;
    },
    // 月供数组需要修改的下标
    getIndex: function(arr, data, callback) {
        let contrastArr = arr,
            index = 0;
        for (let i = 0; i < contrastArr.length; ++i) {
            if (data == contrastArr[i]) {
                index = i;
                callback(index);
            }
        }
    },
    setYXSlider: function(obj){
        var self = this;
        // 默认值为期限
        let defaultObj = {
            'id': 'downPayment',
            'sliderData': {},
            'unitArrName': 'downPaymentUintArr',
            'noUnitArrName' : 'downPaymentNoUintArr',
            'noUnitArrNumName' : 'downPaymentNoUnitNumArr'
        },
        newData = $.extend(defaultObj, obj),
        _id = newData.id,
        isDownPament = _id == 'downPayment'?true:false;
        let newProData = [];
        newData.unitArrName = [];
        newData.noUnitArrName = [];
        newData.noUnitArrNumName = [];
        // console.log(newData.sliderData)
        for(let i = 0; i < newData.sliderData.length; ++i){
            let dpayment = newData.sliderData[i];
            if(dpayment.ProductID > 0){
                let _textNum =  isDownPament?dpayment.DownPaymentRate*100: dpayment.RepaymentPeriod,
                    _isDefaultBooln = dpayment.ProductID == product.productID ? true : false,
                    unitObj = {
                        'text': _textNum, 
                        'isDisable': !dpayment.IsFitForFinance,
                        'isDefault': _isDefaultBooln, 
                        'unit': isDownPament?'%':'期'
                    },
                    noUnitObj = {
                        'text': _textNum, 
                        'isDisable': !dpayment.IsFitForFinance,
                        'isDefault': _isDefaultBooln, 
                    };
                // console.log(!dpayment.IsFitForFinance)
                if(_isDefaultBooln && newData.id=="downPayment"){
                    if(_isDefaultBooln && !dpayment.IsFitForFinance && $('.applyBtnEvent').text().indexOf("立即申请")>=0){
                        $('.applyBtnEvent').addClass('disabled').text('已超出贷款额范围');
                    }else if($('.applyBtnEvent').text().indexOf("已超出贷款额范围") >=0){
                        $('.applyBtnEvent').removeClass('disabled').text('立即申请');
                    }
                }

                if(_id == 'repaymentPeriod' && dpayment.ProductID == product.productID){
                    self.vm.repaymentPeriod = dpayment.RepaymentPeriod;
                }
                newData.unitArrName.push(unitObj);   
                newData.noUnitArrNumName.push(_textNum);
                newData.noUnitArrName.push(noUnitObj);
                if(isDownPament)
                    self.downPaymentPIdArr[_textNum] = dpayment.ProductID; 
                else
                    self.repaymentPIdArr[_textNum] = dpayment.ProductID; 
            }
        }
        if(self.isInitYXSlider && isDownPament){
            self.downPaymentNoUnitArr = newData.noUnitArrName;
            self.downPaymentNoUnitNumArr = newData.noUnitArrNumName;
        }
        else if(self.isInitYXSlider && !isDownPament){
            self.repaymentNoUnitArr = newData.noUnitArrName;
            self.repaymentNoUnitNumArr = newData.noUnitArrNumName;
        }

        self[_id +'Slider'] =  new YXSlider(_id, newData.unitArrName, function(result){
            self.isDownPaymentSlider = _id == 'downPayment'?true:false;

            if (self.isDownPaymentPeriodAjax) {
                self.isDownPaymentPeriodAjax = false;
                self.vm.productId = self.isDownPaymentSlider?self.downPaymentPIdArr[parseInt(result.text)]:self.repaymentPIdArr[parseInt(result.text)];
                self.loanInfo();
                switch(_id) {
                    case 'downPayment':
                        self.vm.downPaymentRate = result.text+'%';
                        // self.isDownPaymentSlider = true;
                        // console.log(1,self.vm.downPaymentRate)
                        break;

                    case 'repaymentPeriod':
                        self.vm.repaymentPeriod = result.text;
                        // self.isDownPaymentSlider = false;
                        break;  
                }
                tools.$ajax({
                    url: '/Product/GetById/' + self.vm.productId +'?carPrice=' + car.carPrice,
                    type: 'get',
                    dataType: 'json',
                    success: function(newRes){
                        self.isDownPaymentPeriodAjax = true;
                        let changeData = self.isDownPaymentSlider? newRes.ProductRepaymentperiods : newRes.ProductDownpaymentrates,
                        newRepaymentArr = [],
                        repaymentNumArr = [],
                        newDownPaymentArr = [],
                        downpaymentNumArr = [];

                        if(self.isDownPaymentSlider)
                            self.repaymentPIdArr = [];
                        else
                            self.downPaymentPIdArr = [];


                        for(let i = 0; i < changeData.length; ++i){
                            let changes = changeData[i];

                            if(changes.ProductID > 0){
                                let isDefaultBloon = false,
                                    _newText = !self.isDownPaymentSlider?changes.DownPaymentRate*100: changes.RepaymentPeriod;
                                if(self.isDownPaymentSlider) {
                                    isDefaultBloon = changes.RepaymentPeriod == self.vm.repaymentPeriod ? true: false;
                                }else {
                                    isDefaultBloon = changes.DownPaymentRate*100 == self.vm.downPaymentRate.replace('%','') ? true: false;
                                    // isDefaultBloon = changes.ProductID == self.vm.productId ? true : false;
                                }

                                let nounitObj = {
                                    'text': _newText,
                                    'isDisable': !changes.IsFitForFinance,
                                    'isDefault': isDefaultBloon ? true : false, 
                                }

                                if(isDefaultBloon && _id=="downPayment"){
                                    if(isDefaultBloon && !changes.IsFitForFinance && $('.applyBtnEvent').text().indexOf("立即申请")>=0){
                                        $('.applyBtnEvent').addClass('disabled').text('已超出贷款额范围');
                                    }else if($('.applyBtnEvent').text().indexOf("已超出贷款额范围") >=0){
                                        $('.applyBtnEvent').removeClass('disabled').text('立即申请');
                                    }
                                }

                                if(self.isDownPaymentSlider){
                                    newRepaymentArr.push(nounitObj);
                                    repaymentNumArr.push(_newText);
                                    self.repaymentPIdArr[_newText] = changes.ProductID; 
                                }else{
                                    newDownPaymentArr.push(nounitObj);
                                    downpaymentNumArr.push(_newText);
                                    self.downPaymentPIdArr[_newText] = changes.ProductID; 
                                }
                            }
                        }
                        if(self.isDownPaymentSlider && repaymentNumArr.indexOf(self.vm.repaymentPeriod) < 0){
                            self.vm.repaymentPeriod = newRepaymentArr[0].text;
                            newRepaymentArr[0].isDefault = true;
                        }

                        if(self.isDownPaymentSlider){
                            self.repaymentPeriodSlider.update(newRepaymentArr);
                            self.repaymentNoUnitNumArr = repaymentNumArr;
                            self.repaymentNoUnitArr = newRepaymentArr;
                        }else{
                            self.downPaymentSlider.update(newDownPaymentArr);
                            self.downPaymentNoUnitNumArr = downpaymentNumArr;
                            self.downPaymentNoUnitArr = newDownPaymentArr;
                        }
                    // console.log(2,self.vm.downPaymentRate)
                    }
                })
            } else {
                setTimeout(function(){
                    // console.log(3, self.vm.downPaymentRate);
                    let oldNum = isDownPament? parseInt(self.vm.downPaymentRate.replace('%','')): self.vm.repaymentPeriod,
                        noUnit = isDownPament? self.downPaymentNoUnitArr: self.repaymentNoUnitArr,
                        noUnitNum = isDownPament? self.downPaymentNoUnitNumArr: self.repaymentNoUnitNumArr;
                    self.getIndex(noUnitNum, oldNum, function(i) {

                        for (let j = 0; j < noUnit.length; ++j) {
                            noUnit[j].isDefault = false;
                        }
                        noUnit[i].isDefault = true;

                        if(self.isDownPaymentSlider)
                            self.vm.downPaymentRate = noUnit[i].text+'%';
                        else
                            self.vm.repaymentPeriod = noUnit[i].text;

                        self[_id +'Slider'].update(noUnit);
                    });
                    return tools.showAlert("大侠手太快啦<br/>等下再试试！");
                }, 300);
            }
        });

    },
    //贷款顾问
    loanAdviser: function () {
        var self = this;
        var _url = adviserApi + "v2/group/getadviserlist/?CityId=" + city.cityId + "&CompanyIds=" + companyID;
        self.sendAjax({
            url: _url,
            dataType: 'jsonp',
        }, adviserList, sendAgain);

        //获取成功
        function adviserList(result) {
            self.vm.isLoanAdviser = false;
            self.adviserId = 0;
            self.domCache.adviserStatus.removeClass('hide');
            if (result.Data != null && result.Data[0] != null) {
                self.vm.loanAdviserTel ="tel:"+result.Data[0].Adviser.CN400;
            }else{
                 self.vm.loanAdviserTel="tel:4000169169";
            }
            self.domCache.adviserStatus.click(function (e) {
                //alert(self.vm.loanAdviserTel);
                var h = self.vm.loanAdviserTel;
                location.href = h;
                e.preventDefault();

            });
        }
        // 出错后重新加载
        function sendAgain(info) {
            // console.log(info);
            self.sendAjax({
                url: _url,
                dataType: 'jsonp'
            }, adviserList, sendAgain);
        };
    },
    formatTime: function (shijianchuo) {
        var self = this;
        //time是整数，否则要parseInt转换
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
    },
    bindEvents: function () {
        var self = this;

        //分享按钮
        $("#shareNavTip").on('click',function(e){
            self.vm.$nextTick(() => self.vm.$broadcast('showShare', 'share'))
        })
        //判断转屏
        function screenChange() {
            location.reload();
        }
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", screenChange, false);

        //选车位置的交互
        $("#carWrapper").on("click", ".car-name", function (e) {
            if ($(this).hasClass('car-name')) {//选车
                self.vm.$broadcast('showCarSelector',{
                    brand: {
                        id: +car.masterBrandId,
                        name: car.masterBrandName,
                        logo: car.masterBrandLogo
                    },
                    series: {
                        id: +car.serialId,
                        name: car.carSerialShowName
                    } 
                })
            }
        });
        //切换报价
        $("#carWrapper").on("click", ".car-price", function (e) {
            if (self.domCache.isBorder <= 0) {
                self.domCache.carPriceLayer.show().removeClass('sliderDownInfo').addClass('sliderUpInfo');
                self.domCache.maskLayer.show();

                setTimeout(function(){
                    self.carPriceScroll.refresh();
                }, 500);
                $('body').bind('touchmove', function (e) {
                    e.preventDefault();
                });
                $('html').css('overflow-y', 'hidden');
            }
        });

        //经销商报价关闭按钮
        $.each(self.domCache.carPriceLayer.find("li"), function (index, val) {
            var _dataHref = $(this).find("a").attr("href");
            $(this).find("a").attr({
                "data-href": _dataHref,
                "href": "javascript:void(0);"
            })
        });

        $("#carPriceLayer>dt>i").on("click", function (e) {
            self.domCache.maskLayer.hide();
            self.domCache.carPriceLayer.addClass('sliderDownInfo').removeClass('sliderUpInfo');
            $('html').css('overflow-y', 'auto');
            $('body').unbind('touchmove');
        })
        self.domCache.carPriceLayer.on("click", "li a", function (e) {
            self.domCache.carPriceLayer.addClass('sliderDownInfo').removeClass('sliderUpInfo');
            self.domCache.maskLayer.hide();
            location.href = $(this).attr("data-href");
            $('html').css('overflow-y', 'auto');
            $('body').unbind('touchmove');
        })

        //价格部分的交互
        $("#priceWrapper").on("click", ".price-detailed", function (e) {
            self.domCache.maskLayer.show();
            self.domCache.priceLayer.show().removeClass('sliderDownInfo').addClass('sliderUpInfo');

            if(self.domCache.priceLayer.height() >= $(window).height()){
                self.domCache.priceLayer.css({
                    height: $(window).height()-100
                });
                // self.priceLayerScroll.refresh();
            }
            // self.domCache.priceLayer.css({
            //     marginTop: -(self.domCache.priceLayer.height() - $(".layer-close-btn").height()) / 2 - 20
            // });
            $('html').css('overflow-y', 'hidden');
            $('body').bind('touchmove', function (e) {
                e.preventDefault();
            });
        });
        //产品特点更多
        /* $(".detail-features .more").on("click",function(e){
            if($(this).hasClass('icon-bg')){
                $(this).html("<span></span>").removeClass('icon-bg');
                self.domCache.featuresMoreBox.removeClass('hide');
            }else{
                $(this).html("").addClass('icon-bg');
                self.domCache.featuresMoreBox.addClass('hide');
            }
        }); */
        // edit by qiany 2016.11.29
        var features = $('.product-features');
        if (features.length) {
            if (features[0].scrollHeight > features[0].clientHeight) {
                var oHeight = features[0].clientHeight + 1;
                features.find('.more').show().on('click', function (e) {
                    if ($(this).hasClass('icon-bg')) {
                        $(this).html("<span></span>").removeClass('icon-bg');
                        features.css('height', 'auto');
                    } else {
                        $(this).html("").addClass('icon-bg');
                        features.css({ 'height': oHeight, 'box-sizing': 'border-box' });
                    }
                })
            }
        }

        //初始化选择城市
        $('#selectCity').click(function () {
            city.loadCityUrl = APIURL + "api/Common/GetSupportGroupingCityList/?packageId=" + self.vm.packageId + "&carId=" + car.carId;
            city.NoHotCity = true;
            citySelect.citySelect(city, function (result) {
                setTimeout(function () {
                    var pams = '';
                    try {
                        pams = location.href.split('?')[1];
                    } catch (e) {
                        pams = '';
                    }
                    // 区分租车和购车， qiany
                    if (location.href.toLowerCase().indexOf('/lease') > -1) {
                        location.href = '/lease/' + result.CitySpell + '/m' + car.carId + '/p' + self.vm.productId + '?' + pams;
                    } else {
                        location.href = '/' + result.CitySpell + '/m' + car.carId + '/p' + self.vm.productId + '?' + pams;
                    }
                }, 100);
            });
        });


        //弹层关闭按钮
         self.domCache.priceLayer.find('.close-popup').on("click", function (e) {
            $('html').css('overflow-y', 'auto');;
            $('body').unbind('touchmove');
            self.domCache.maskLayer.hide();
            self.domCache.priceLayer.addClass('sliderDownInfo').removeClass('sliderUpInfo');
        });


        //贷款顾问弹层
        function adviserLayerFun() {
            self.domCache.maskLayer.show();
            self.domCache.adviserLayer.removeClass('hide');
            self.adviserScroll.refresh();
            $('html').css('overflow-y', 'hidden');
            $('body').bind('touchmove', function (e) {
                e.preventDefault();
            });
  
        }
        self.domCache.loanDetailsDom.on("click", "#adviserMore", function (e) {
            // adviserLayerFun();
        })

        $(".apply-wrapper").on("click", ".flex2,.flex3", function (e) {
            if ($(this).hasClass('flex2')) {
                //adviserLayerFun();
            } 
            // else {
                //申请按钮 TODO qianyuan
                // if (!$(this).hasClass("disabled")) {
                //     var orderAction = $(this).attr('order-action');
                //     tools.isApply(function (bln) {
                //         // console.log(bln)
                //         if (bln) {
                //             self.applyNow(orderAction);
                //         }
                //     });

                // }
            // }
        })

        // 立即申请
        $('.applyBtnEvent').click(function(){
            if ($(this).hasClass('btn')) {
                $('html').css('overflow-y', 'auto');
                $('body').unbind('touchmove');
                self.domCache.maskLayer.hide();
                self.domCache.loanCondPopup.addClass('sliderDownInfo').removeClass('sliderUpInfo');
                self.domCache.priceLayer.addClass('sliderDownInfo').removeClass('sliderUpInfo');
            }

            if (!$(this).hasClass("disabled")) {
                var orderAction = $(this).attr('order-action');
                tools.isApply(function (bln) {
                    // console.log(bln)
                    if (bln) {
                        self.applyNow(orderAction);
                    }
                });
            }
        });

        self.domCache.adviserLayer.on("click", "dt .icon-bg", function (e) {
            self.domCache.maskLayer.hide();
            self.domCache.adviserLayer.addClass('hide');
            $('html').css('overflow-y', 'auto');
            $('body').unbind('touchmove');
        });

        //蒙层事件
        self.domCache.maskLayer.on("click", function (e) {
            e.stopPropagation();
            $('html').css('overflow-y', 'auto');
            $('body').unbind('touchmove');
            $(this).hide();
            self.domCache.priceLayer.addClass('sliderDownInfo').removeClass('sliderUpInfo');
            self.domCache.carPriceLayer.addClass('sliderDownInfo').removeClass('sliderUpInfo');
            self.domCache.adviserLayer.addClass('hide');
            self.domCache.infoUp.addClass('sliderDownInfo').removeClass('sliderUpInfo');
            self.domCache.typicalUp.addClass('sliderDownInfo').removeClass('sliderUpInfo');
            self.domCache.loanCondPopup.addClass('sliderDownInfo').removeClass('sliderUpInfo');
        });
        //车主晒单列表
        self.domCache.orderShareList.on("click", "dl", function (e) {
            location.href = $(this).attr("data-url");
        });
        //旗舰店交互
        $("#flagshipStoreWrapper").on("click", function (e) {
            location = self.domCache.flagshipStoreLink;
        });

        //详细内容部分的交互
        $("#detailsConWrapper").on("click", ".toggle-tag>li", function (e) {
            if ($(this).is(".toggle-tag>li")) {
                $(this).addClass('cur').siblings('li').removeClass('cur');
                var _index = $(this).index();
                if (_index == 0) {
                    self.curTab = 0;
                    self.evaluationData.scrollSign = false;
                    self.inOrderToShareData.scrollSign = false;
                    self.domCache.loanDetailsDom.removeClass('hide');
                    self.domCache.userEvaluatioDom.addClass('hide');
                    self.domCache.faqDom.addClass('hide');
                    self.domCache.inOrderToShareDom.addClass('hide');
                } else if (_index == 1) {
                    self.curTab = 1;
                    self.evaluationData.scrollSign = true;
                    self.inOrderToShareData.scrollSign = false;
                    self.domCache.loanDetailsDom.addClass('hide');
                    self.domCache.userEvaluatioDom.removeClass('hide');
                    self.domCache.faqDom.addClass('hide');
                    self.domCache.inOrderToShareDom.addClass('hide');
                } else if (_index == 2) {
                    self.curTab = 2;
                    self.evaluationData.scrollSign = false;
                    self.inOrderToShareData.scrollSign = false;
                    self.domCache.loanDetailsDom.addClass('hide');
                    self.domCache.userEvaluatioDom.addClass('hide');
                    self.domCache.faqDom.removeClass('hide');
                    self.domCache.inOrderToShareDom.addClass('hide');
                } else {
                    self.curTab = 3;
                    self.evaluationData.scrollSign = false;
                    self.inOrderToShareData.scrollSign = true;
                    self.domCache.loanDetailsDom.addClass('hide');
                    self.domCache.userEvaluatioDom.addClass('hide');
                    self.domCache.faqDom.addClass('hide');
                    self.domCache.inOrderToShareDom.removeClass('hide');
                }

            }
        });
        //易问答 点赞
        $(".eQEvent").on('click', '.pariseEvent', function () {
            var $that = $(this);
            if (!$that.hasClass("cur")) {
                var $num = $that.find("span"),
                    count = parseInt($num.text()) + 1,
                    qId = $that.parents("li").data("id");
                tools.$ajax({
                    url: '/ExpertQuestion/ClickAgree/?questionId=' + qId + '&agreeUserId=' + loanUserId + '&deviceId=' + deviceId,
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (res.Result) {
                            $that.addClass("cur");
                            $num.text(count);
                        } else {
                            return tools.showAlert(res.Message);
                        }
                    }
                })
            }
        });
        //返回上一步
        $(".backGoPage").off("click").on("click", function () {
            history.go(-1);
            return false;
        })

        //滚动加载
        $(window).scroll(function () {
            var scrollHeight = document.body.scrollTop || document.documentElement.scrollTop;
            var moreHeight, moreHeight2;
            if ($("#evaluationList").length) {
                moreHeight = $("#evaluationList").offset().top - $(window).height() + $("#evaluationList").height() - 5;
            }
            if ($("#inOrderToShare .order-share-list").length) {
                moreHeight2 = $("#inOrderToShare .order-share-list").offset().top - $(window).height() + $("#inOrderToShare .order-share-list").height() - 5;
            }
            // console.log(moreHeight +"__"+scrollHeight)
            // console.log(self.evaluationData.scrollSign)
            if (self.evaluationData.scrollSign && self.curTab == 1 && moreHeight) {

                if (scrollHeight >= moreHeight && (self.evaluationData.pageIndex < self.evaluationData.pageCount)) {
                    self.evaluationData.scrollSign = false;
                    ++self.evaluationData.pageIndex;
                    self.domCache.sliderUpBox.removeClass('hide');
                    // self.domCache.sliderUpBox.html('数据加载中');
                    self.domCache.sliderUpBox.html('<i class="sliderUp"></i>向上滑动刷新');
                    self.userEvaluation();
                }
            } else if (self.inOrderToShareData.scrollSign && self.curTab == 3 && moreHeight2) {
                // console.log(scrollHeight +"__"+ moreHeight2 , self.inOrderToShareData.pageIndex +"___"+self.inOrderToShareData.pageCount)
                if (scrollHeight >= moreHeight2 && (self.inOrderToShareData.pageIndex < self.inOrderToShareData.pageCount)) {
                    self.inOrderToShareData.scrollSign = false;
                    ++self.inOrderToShareData.pageIndex;
                    self.domCache.sliderUpBox2.removeClass('hide');
                    // self.domCache.sliderUpBox2.html('数据加载中');
                    self.domCache.sliderUpBox2.html('<i class="sliderUp"></i>向上滑动刷新');
                    self.inOrderToShare();
                }
            };
        });

        // app下载
        // $('#appDown').on('click', '.appdown_close', function (e) {
        //     e.preventDefault();
        //     // 关闭浮层，记录cookie
        //     $('#appDown').addClass('hide');
        //     $('body').animate({
        //         'padding-top': 0
        //     });
        //     var cookieString = 'hideAppDown=1;path=/;domain=' + tools.wildcardUrl();
        //     document.cookie = cookieString;
        // });

        // 首付&期限弹层
        if(isHXM == "True"){
            $('#verifiCode .loan-box').click(function(){
                $(this).addClass('cur').siblings('.loan-box').removeClass('cur');
                self.vm.productId = $(this).data('productid');
                self.loanInfo();
            });
        }else {
            $('#loanCond').click(function(){
                self.domCache.loanCondPopup.show().removeClass('sliderDownInfo').addClass('sliderUpInfo');
                self.domCache.maskLayer.show();
                $('html').css('overflow-y', 'hidden');
                $('body').bind('touchmove', function (e) {
                    e.preventDefault();
                });
            });

            self.domCache.loanCondPopup.find('.close-popup').click(function(){
                $('html').css('overflow-y', 'auto');
                $('body').unbind('touchmove');
                self.domCache.loanCondPopup.addClass('sliderDownInfo').removeClass('sliderUpInfo');
                self.domCache.maskLayer.hide();
            });
        }

        // 导航tips
        self.domCache.toolsNav.click(function(){
            self.domCache.navTips.toggleClass('hide');
        });
        self.domCache.navTips.find('a').click(function(){
            self.domCache.navTips.addClass('hide');
        });

        $('body').click(function(e){
            // e.stopPropagation();
            if($(e.target).attr('id') !== 'tools-nav')
                self.domCache.navTips.addClass('hide');
        });
        // 活动详情及产品特点
        self.showInfoDetail('info');
        self.showInfoDetail('typical');
    },
    showInfoDetail: function(id){
        var self = this;
        $('#'+id).click(function(){
            $('#'+id+'Up').show().addClass('sliderUpInfo').removeClass('sliderDownInfo');
            // 产品特点弹层
            if(id == "typical" &&　self.domCache.typicalScroll.find('dl').height() + self.domCache.typicalUp.find('.header').height() > self.domCache.typicalUp.find('.popup-box').height()){
                self.showTypicalScroll = new iScroll("#typicalScroll", {
                    'click': true,
                });
                self.showTypicalScroll.refresh();
            }
            self.domCache.maskLayer.show();
            $('html').css('overflow-y', 'hidden');
            $('body').bind('touchmove', function (e) {
                e.preventDefault();
            });
        });
        $('#'+id+'Up .popup-btn').click(function(){
            $('html').css('overflow-y', 'auto');
            $('body').unbind('touchmove');
            $('#'+id+'Up').addClass('sliderDownInfo').removeClass('sliderUpInfo');
            self.domCache.maskLayer.hide();
        });
    },
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
    },
    //立即申请
    applyNow: function (orderAction) {
        var self = this;
        orderAction = (orderAction || self.domCache.formDom.attr('action')).replace(/\/?$/, '/')
        self.domCache.formDom.attr('action', orderAction)
        self.domCache.formDom.find('input[name="Orders"]').val(self.vm.packageId + "_" + self.vm.productId + "_0");
        self.domCache.formDom.find('input[name="CarId"]').val(car.carId);
        self.domCache.formDom.find('input[name="CityId"]').val(city.cityId);
        self.domCache.formDom.find('input[name="CarPrice"]').val(self.vm.carPrice);
        self.domCache.formDom.find('input[name="Source"]').val(source ? 20000 +  parseInt(source) : '20');
        // self.domCache.formDom.find('input[name="Channel"]').val(channel ? channel : 0);
        self.domCache.formDom.find('input[name="AdviserId"]').val(self.adviserId);
        self.domCache.formDom.find('input[name="From"]').val('');
        self.domCache.formDom.find('input[name="Shop"]').val(shop);

        //插入新的节点：$formDom  <input name="ABTestkey" type="hidden" value="">
        self.domCache.formDom.append('<input name="ABTestkey" type="hidden" value="" />')
        self.domCache.formDom.find('input[name="ABTestkey"]').val(self.vm.ABTestkey);

        if (dealer.dealerId) {
            //经销商
            self.domCache.formDom.find('input[name="DealerId"]').val(dealer.dealerId);
            self.domCache.formDom.find('input[name="DealerName"]').val(dealer.dealerName);
            if (dealer.dealerTel) {
                self.domCache.formDom.find('input[name="DealerTelphone"]').val(dealer.dealerTel);
            }
        }
        // if (companyID == "78") {
        //     self.domCache.formDom.find('input[name="DownPayment"]').val(self.vm.downPayment2);
        //     self.domCache.formDom.find('input[name="LoanAmount"]').val(self.vm.loanAmount2);
        // }
        self.domCache.formDom.submit();

    }
}


$(function () {
    //走起
    new DetailPage();
    // if(!detail.vm.isLumpPayment){
    //     $('#rate').show();
    // }
});




