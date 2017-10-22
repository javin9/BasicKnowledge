import './index.scss';
import './indexnew.scss'
import Vue from 'vue'
import vueResource from 'vue-resource'
import CarSelector from 'libs/vue-components/car-selector'
import MobileVerify from 'libs/vue-components/mobile-verify'
import citySelect from 'libs/citySelect';
import YXSlider from 'libs/yxSlider';
import iScroll from 'iscroll';
import HomeView from './pages/home'
import 'swiper';
import 'chart.js';
Vue.use(vueResource)
var DetailPage = function () {
    var self = this
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
        priceLayer: $("#priceListLayer"),//价格弹层
        maskLayer: $("#maskLayer"),//灰色蒙层
        downPaymentDom: $("#downPayment"),//首付
        repaymentPeriodDom: $("#repaymentPeriod"),//月供
        // carPriceLayer: $("#carPriceLayer"),//经销商报价
        isBorder: $("#carWrapper .car-price .no-border").length,//厂家指导价的下划线
        featuresMoreBox: $(".detail-features-more"),
        formDom: $("#orderInfoForm"),//form
        adviserStatus: $(".adviser-status"),//判断贷款顾问显示隐藏状态的class
        hxmPayment: $(".hxm-payment-wrapper"),

        loanCondPopup: $('#loanCondPopup'),//首付&期限弹层
        // infoScroll: $('#infoScroll'),//优惠信息滚动

        toolsNav: $('#tools-nav'),//导航tips触发
        navTips: $('#navTips'),//导航tips
    }

    this.downPaymentNoUnitArr  = []; //首付比数组
    this.downPaymentNoUnitNumArr = [];
    this.downPaymentPIdArr = [];//首付比产品ID数组
    this.repaymentNoUnitArr  = [];//期限数组
    this.repaymentNoUnitNumArr = [];
    this.repaymentPIdArr = [];//期限产品ID数组

    //数据绑定
    this.vm = new Vue({
        el: '#viewsWrapper',
        components: {
            CarSelector,
            HomeView
        },
        data() {
            var _imgUrl = $('#wx_pic img').attr('src');
            var _desc = $(".package-wrapper h1").text() + '贷车，还款灵活哦！易鑫车贷，一站式互联网汽车金融平台，尽享优惠快捷！（分享来自@易鑫车贷平台）';
            // alert(_desc);
            return {
                cityId:+city.CityId,
                interfaceCar: carlisturl,
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
                carPriceFormat: tools.addCmma(car.carPrice * 10000),

                isShowLoanCost : true,//是否隐藏贷款成本true
                ABTestkey : 1,//是否隐藏贷款成本传递参数
                firstPayment : "--",//首次支付
                firstPaymentMoney : "--",//首次支付元
                isLumpPayment: isLumpPayment.toLowerCase()=='true'?true:false, //是否支持一次性支付
                isDeposit: isDeposit.toLowerCase()=='true'?true:false, //是否支持保证金
                isPromotionExpired: product.productPromotionId !== '0' && isPromotionExpired === "False" && isTieXi === "False"?true:false,//是否促销

                repaymentPeriod: "--",//期限

                // 申请表单组件
                source: source,
                channel: channel,
                from: from || tools.getUrlParam('from'),
                focusbannerurl: '',
                createorderurl: createorderurl,
                checkcodeurl: checkcodeurl,
                getcodeurl: getcodeurl,
                cityname: city.CityName,
                cityid: city.CityId,
                carid: car.carId,
                carname: carname,
                isshowbottom: isshowbottom,
                quafields: quafields,
                islogined: islogined,
                isauthenticated: isauthenticated,
                showidnumber: showidnumber,
                showusername: showusername,
                showmobile: showmobile,
                applyOrders: orders,
                // 全部车型跳转链接
                allbrandHref: `${window.baseRoutes || ''}${brandurl}?cityid=${city.CityId}&source=${source}&from=${from}`
            }
        },
        
        methods: {
            selectCarCallback(data){
                console.log(11,data)
                const href = `${window.baseRoutes || ''}/sem/productdetail?carid=${data.car.id}&cityid=${city.CityId}&source=${source}&from=${from}`
                // if(dev){
                //     console.log(href)
                // }else{
                    if(data.car.id != car.carId){
                        window.location.href = href
                    }
                // }
            },
            selectPayment: function (id) {
                $('.cur').removeClass('cur');
                this.productId = id
                $('span[data-id="' + id + '"]').addClass('cur')
                self.loanInfo()
            },

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

        //首付期限
        this.downPaymentPeriod();
        this.bindEvents();
        if(this.vm.finalPaymentAmountNum > 0){
            $('#loanCond .weikuan').show();
        }

        //经销商报价
        // if (document.getElementById('carPriceLayerCon')) {
        //     self.carPriceScroll = new iScroll("#carPriceLayerCon", {
        //         'click': true,
        //     });
        // }


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

        this.selectActivity()
    },

    //获取首付、期限
    downPaymentPeriod: function () {
        var self = this,
            _url = getByIdUrl +'?id='+ self.vm.productId +'&carPrice=' + car.carPrice;

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
                    // 首付比
                    self.setYXSlider({
                        'id': 'downPayment',
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
            _url = getCalculationInfoUrl+'/?carPrice=' + car.carPrice + '&productId=' + self.vm.productId + '&carId=' + car.carId;

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

                //刷新环形图
                $('#priceBox').removeClass('hide');
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
                    if(_isDefaultBooln && !dpayment.IsFitForFinance && $('.applyBtnEvent').text().indexOf("确认")>=0){
                        $('.applyBtnEvent').addClass('disabled').text('确认');
                    }else if($('.applyBtnEvent').text().indexOf("已超出贷款额范围") >=0){
                        $('.applyBtnEvent').removeClass('disabled').text('确认');
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
                self.vm.applyOrders = self.vm.packageId + '_' +self.vm.productId + '_0';
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
                        // console.log(2,self.vm.repaymentPeriod)
                        break;
                }
                tools.$ajax({
                    url: getByIdUrl +'?id='+ self.vm.productId +'&carPrice=' + car.carPrice,
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
                                    if(isDefaultBloon && !changes.IsFitForFinance && $('.applyBtnEvent').text().indexOf("确认")>=0){
                                        $('.applyBtnEvent').addClass('disabled').text('确认');
                                    }else if($('.applyBtnEvent').text().indexOf("已超出贷款额范围") >=0){
                                        $('.applyBtnEvent').removeClass('disabled').text('确认');
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
                    return self.PopShowAlert("大侠手太快啦<br/>等下再试试！");
                }, 300);
            }
        });

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
                    },
                    car: {
                        selected: +car.carId
                    }
                })
            }
        });

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
            // city.loadCityUrl = APIURL + "api/Common/GetSupportGroupingCityList/?packageId=" + self.vm.packageId + "&carId=" + car.carId;
            // city.NoHotCity = true;

            citySelect.citySelect(city, function (result) {
                setTimeout(function () {
                    location.href = '/sem/productdetail?carid='+ car.carId +'&serialid='+ car.serialId + '&cityid='+ result.CityId + '&carprice='+ car.carPrice + '&from='+ from +'&source=' + source;
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

        // 立即申请
        $('.applyBtnEvent').click(function(){
            if ($(this).hasClass('btn')) {
                $('html').css('overflow-y', 'auto');
                $('body').unbind('touchmove');
                self.domCache.maskLayer.hide();
                self.domCache.loanCondPopup.addClass('sliderDownInfo').removeClass('sliderUpInfo');
                self.domCache.priceLayer.addClass('sliderDownInfo').removeClass('sliderUpInfo');
            }
        });

        //蒙层事件
        self.domCache.maskLayer.on("click", function (e) {
            e.stopPropagation();
            $('html').css('overflow-y', 'auto');
            $('body').unbind('touchmove');
            $(this).hide();
            self.domCache.priceLayer.addClass('sliderDownInfo').removeClass('sliderUpInfo');
            // self.domCache.carPriceLayer.addClass('sliderDownInfo').removeClass('sliderUpInfo');
            self.domCache.loanCondPopup.addClass('sliderDownInfo').removeClass('sliderUpInfo');
        });

        //返回上一步
        $(".backGoPage").off("click").on("click", function () {
            history.go(-1);
            return false;
        })

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
    // 爆点区域：仅展示1个活动，优先级 惠>礼>专享>付
    selectActivity(){
        let $activity = $('.activity'),
            $subtitle = $activity.find('.subtitle'),
            $info = $activity.find('.activity-info'),
            $info_item = $activity.find('.ut-s')
        let $prio_1 = $('.activity').find('.hui').parent('.ut-s'),
            $prio_2 = $('.activity').find('.li').parent('.ut-s'),
            $prio_3 = $('.activity').find('.subtitle'),
            $prio_4 = $('.activity').find('.fu').parent('.ut-s')
        $subtitle.hide()
        $info_item.hide()
        if( $prio_1.length > 0 ){
            $prio_1.show()
        } else if ( $prio_2.length > 0 ){
            $prio_2.show()
        } else if ($prio_3.length > 0 ){
            $prio_3.show()
        } else if ($prio_4.length > 0 ){
            $prio_4.show()
        } else {

        }
        if( !( $prio_1.length || $prio_2.length || $prio_4.length ) ){
            $info.hide()
        }
    },
    PopShowAlert: function(txt, time = 3000) {
        var showAlertBox,
          _txt = txt;
        if ($("#showAlertBox").length > 0) {
          showAlertBox = $("#showAlertBox");
        } else {
          showAlertBox = $('<div id="showAlertBox"><div class="layout-text font-title"><div></div>');
          $("body").append(showAlertBox);
        }
        $("#showAlertBox .layout-text").html(_txt);
        $("#showAlertBox").fadeIn();

        $('body').bind('touchmove', function(e) {
          e.preventDefault();
        });
        setTimeout(function() {
          // $('body').unbind('touchmove'); // 弹层之上不能解绑
          $("#showAlertBox").fadeOut(300);
        }, time);
    },
}

$(function () {
    //走起
    new DetailPage();
});




