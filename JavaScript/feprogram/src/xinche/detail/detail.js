import './detail.scss';
import '../components/question/index.scss';
import '../components/question/index.js';
import Swiper from 'libs/swiper/2.0';
import 'jquery.lazyload';
import selCar from 'libs/carSelect/selCar.pc.js';
import ko from 'knockout';
import '../components/question/question.js';
// import YXSlider from 'libs/yxSlider/YXSlider.pc.js';
import YXSliderClick from 'libs/yxSlider/click.pc';
// import echarts from 'echarts/lib/echarts';
// import 'echarts/lib/chart/pie';
import 'zrender/lib/vml/vml';
import check from 'libs/check';
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

var detailViewModel = {
    commonQuestions: ko.observableArray(), //常见问题
    recommendProducts: ko.observableArray(), //推荐金融产品
    latestLoanOrders: ko.observableArray(), //最近申请订单
    loanAdviserOrders: ko.observableArray(), //贷款顾问
    isLoanAdviser:ko.observable(),//是否显示贷款顾问
    isGetRecentApplyTime:ko.observable(),//是否显示最近申请时间
    getRecentApplyTime:ko.observable(),//最近申请时间
    userInformation:ko.observableArray(),//最近申请人信息
    firstAdviserOrder: ko.observableArray(),//第一贷款顾问
    adviserPhones: ko.observableArray(),
    adviserPhoneShort: ko.observable(),
    adviserPhonesStr: ko.observable(),
    isShowAdviserPhonesStr: ko.observable(false),
    userEvaluationlist: ko.observableArray(),//用户评价
    userEvaNum: ko.observable(),//评价条数
    pageIndex: ko.observable(),//当前页码数

    quotationType: ko.observable('--'),//报价类型
    quotationAmount:ko.observable('--'),//报价金额
    downPayment:ko.observable('--'),//首付金额
    downPaymentCount:ko.observable('--'),
    downPaymentRate:ko.observable('--'),//首付比例
    downPaymentRateData:ko.observable(0),//首付比例原始数据
    repaymentPeriodData:ko.observable(0),//月供原始数据
    loanAmount:ko.observable('--'),//贷款金额
    totalCost:ko.observable('--'),//贷款成本（利息、手续费之和）
    totalCostCount:ko.observable('--'),
    totalExpenses:ko.observable('--'),//总花费（车价 + 贷款成本 + 税费）
    monthlyPayment:ko.observable('--'),//月供
    monthlyPaymentCount:ko.observable('--'),//月供数据
    oldMonthlyPayment:ko.observable('--'),//
    oldMonthlyPaymentCount:ko.observable('--'),
    finalPaymentAmount:ko.observable('--'),//贷款尾款
    finalPaymentAmountCount:ko.observable('--'),//贷款尾款数值
    isFinalPaymentAmount:ko.observable(false),
    finalPaymentRate:ko.observable('--'),//尾款比例
    rateText:ko.observable('--'),//月费率/月利率文本
    interestRate:ko.observable('--'),//月费率/月利率金额
    oldInterestRate: ko.observable('--'),//原月费率/月利率金额
    totalInterest:ko.observable('--'),//利息
    serviceFee:ko.observable('--'),//手续费
    serviceFeeCout:ko.observable('--'),//手续费数值
    purchaseTax:ko.observable('--'),//购置税
    taxation:ko.observable('--'),//税费=购置税 + 500（上牌） + 950（强险）
    carPrice:ko.observable(car.carPrice),//车价
    productId:ko.observable(product.productID),
    packageId:ko.observable(product.packageID),
    downPaymentHtml:ko.observable(''),//首付文本Html
    repaymentHtml:ko.observable(''),//月供文本Html
    isLoanAdviser:ko.observable(false),//贷款顾问是否显示
    loanAdviserCount:ko.observable(0),//贷款顾问数量

    isLumpPayment:ko.observable(false),//是否一次性付息
    isShowFirstPayment:ko.observable(false),//是否显示首次支付
    isSecurityDeposit:ko.observable(false),//是否有保证金
    securityDeposit:ko.observable("--"),//保证金
    securityDepositCount:ko.observable("--"),
    securityDepositHtml:ko.observable(''),
    securityDepositRate:ko.observable("--"),//保证金比例
    securityDepositRateData:ko.observable(0),//原始数据
    firstPayment:ko.observable("--"),//首次支付
    firstPaymentCount:ko.observable("--"),//首次支付数值
    carPriceFormat:ko.observable(tools.addCmma(car.carPrice*10000)),
    isPromotionExpired:ko.observable(false),//是否促销

    repaymentPeriod: ko.observable('--'),//期限
    isShowDownPayment: ko.observable(isHXM != "True"?true:false),//isHXM == "True"隐藏首付

    hxmClassName: ko.observable(''),
    subsidiaryClassName: ko.observable(''),

    otherProduct: ko.observableArray(),//其他金融产品
    usedCarRecommend: ko.observableArray()//超值二手车
};

var DetailPage = function () {
    //吸顶以及右侧吸底特效DOM缓存
    this.ceilingBox = $("#ceilingBox");
    this.floorBox = $("#floorBox");
    this.ceilingBoxPos = this.ceilingBox.offset().top;
    this.detailsLeftTop = $(".details-left-box").offset().top;
    this.floorBoxPos = this.floorBox.offset().top;
    this.userEvaluate = $("#userEvaluate");
    this.commonProblem = $("#commonProblem");
    this.shareOrder = $("#shareOrder");
    this.appRecord = $("#appRecord");
    this.listPagination = $("#listPagination");

    this.downPaymentDom = $("#downPayment");
    this.repaymentPeriodDom = $("#repaymentPeriod");
    this.securityDepositDom =  $("#securityDeposit");
    this.selCarHrefDom = $(".switching-models .drop-layer a");
    this.selCityHrefDom = $(".sel-city-wrapper .drop-layer a");
    this.selDealerHrefDom = $(".select-offer-box .drop-layer a");
    this.downPaymentSlider = null;
    this.repaymentPeriodSlider = null;
    this.securityDepositSlider = null;

    this.totalCostLayer = $(".total-cost-layer");
    this.maskLayer = $("#maskLayer");
    this.QRCodeBox = $(".QRCode_box");

    // this.myChart = echarts.init(document.getElementById('myChart'));

    this.isDownPaymentPeriodAjax = true;
    //source
    this.source = tools.getUrlParam("source");
    //滚动状态
    this.rollingState= true;
    //选车提交按钮DOM
    this.getLoanBtn = $(".details-right-box .sel-car-box .btn");
    //贷款顾问tip
    this.loanTip = $(".loan-adviser-tip");
    //随机贷款顾问ID
    this.adviserId = 0;
    this.pageSize = 10;


    this.productObj={};//以产品ID为key查询
    this.downPaymentObj ={};//以首付为key查询
    this.securityDepositObj ={};//以保证金为key查询
    this.repaymentObj ={};//以月供为key查询

    this.isLumpPayment = isLumpPayment.toLowerCase() == 'true'?true:false;
    this.isPromotionExpired = product.productPromotionId !== '0' && isPromotionExpired === "False" && isTieXi === "False"?true:false;//是否促销
};

DetailPage.prototype = {
    init: function () {
        var self = this;
        ko.applyBindings(detailViewModel);
        detailViewModel.pageIndex(1);
        //增加判断如果是在线审批的单子跳转到orderapplyyx
        if(packageProcess.toLocaleLowerCase().indexOf("/onlineapproval")>=0){
            packageProcess = packageProcess.toLocaleLowerCase().replace("/onlineapproval", "/orderapplyyx");
        }
        $("#orderInfoForm").attr("action",packageProcess);
        //获取首付月供
        self.downPaymentPeriod();

        //form表单
        this.formDom = $("#orderInfoForm");
        self.renderDom();
        self.dynamicLayout();
        //贷款顾问
        self.loanAdviser();
        //超值二手车
        self.usedCarBudget();
        //初始滚动位置
        if(tools.getUrlParam("scroll") == "advisor"){
            $('html,body').stop().animate({
                "scrollTop": (self.floorBoxPos + 40)  +"px"
            },500);
        }else if(tools.getUrlParam("CommentCount")){
            $('html,body').stop().animate({
                "scrollTop": $("#userEvaluate").offset().top+40
            },500);
        }

        //数据由ajax变页面输出，滚动效果保留
        self.getCommonQuestions();

        tools.listPagination("listPagination", 1, 1);
        //用户评价

        self.bindCommentsPagedEvent();

    },

    //获取首付、期限
    downPaymentPeriod:function(){
        var self = this,
            _url = '/Product/GetById/' + detailViewModel.productId()+'?carPrice=' + car.carPrice;

        self.sendAjax({
            url: _url
        }, success, sendAgain);

        function success(res){
            console.log(res)
            self.loanInfo();
            self.slideBlock(res);

            self.correctPosition();
        }

        // 出错后重新加载
        function sendAgain(info) {
            //console.log(info);
            self.sendAjax({
                url: _url,
            }, success, sendAgain);
        };
    },
    getIndex (arr, data, callback) {
        let contrastArr = arr,
            index = 0;
        for(let i = 0; i < contrastArr.length; ++i){
          if(data == contrastArr[i]){
            index = i;
            callback(index)
          }
        }
    },
    //滑块
    slideBlock:function(res){
        var self = this,
            _data = res,
            _downPaymentRange={},
            _downPaymentArr=[],
            _downPaymentLength = _data.ProductDownpaymentrates.length,
            _sliderPCT = 100 / (_downPaymentLength - 1),
            _downPaymentHtml = "",//首付下标
            _downPaymentDefault="",
            _downPaymentDisableArr = [],
            _downPaymentDefaultArr =[],//默认首付数组

            _repaymentRange={},
            _repaymentArr=[],
            _repaymentLength = _data.ProductRepaymentperiods.length,
            _sliderPCT2 = (_repaymentLength>1)?100 / (_repaymentLength - 1):0,
            _repaymentHtml = "",//月供下标
            _repaymentInitArr=[],//初始化月供数组
            _repaymentDefaultArr =[],//默认月供数组
            _repaymentDefault="",

            _securityDepositRange={},
            _securityDepositArr=[],
            _securityDepositLength = _data.ProductSecurityDepositRates?_data.ProductSecurityDepositRates.length:0,
            _sliderPCT3 = (_securityDepositLength>1)?100 / (_securityDepositLength - 1):0,
            _securityDepositHtml = "",//保证金下标
            _securityDepositInitArr=[],//初始化保证金数组
            _securityDepositDefaultArr =[],//默认保证金数组
            _securityDepositDefault="",
            _securityDepositHtmlIE8,

            shoufuEvent = false,
            yuegongEvent = false;

        self.productObj={};//以产品ID为key查询
        self.downPaymentObj ={};//以首付为key查询
        self.securityDepositObj ={};//以保证金为key查询
        self.repaymentObj ={};//以月供为key查询
        //首付数据
        _downPaymentRange.min = 0;
        _downPaymentRange.max = 100;

        var _sliderCurPCT="0%",_specialClassName="";
        $.each(_data.ProductDownpaymentrates, function(index, val) {

            var sliderPCT = _sliderPCT * index + '%',//滑块百分比
                curClass="";
            _downPaymentRange[sliderPCT] = val.DownPaymentRate * 100;
            _downPaymentDefaultArr.push(val.DownPaymentRate * 100);
            _downPaymentDisableArr.push(val.IsFitForFinance);

            if(detailViewModel.productId() == val.ProductID){
                curClass = "cur";
                _sliderCurPCT = sliderPCT;
                _downPaymentDefault = val.DownPaymentRate* 100;
            }

            var downPaymentTxt = val.DownPaymentRate * 100 + "%";//首付内容
            _downPaymentArr.push(val.DownPaymentRate* 100);

            self.productObj[val.ProductID] = {
                "RepaymentPeriod":val.RepaymentPeriod,
                "DownPaymentRate":val.DownPaymentRate,
                "SecurityDepositRate":val.SecurityDepositRate,
                "HasProduct":val.HasProduct,
                "HasOtherProduct":val.HasOtherProduct,
                "IsFitForFinance":val.IsFitForFinance
            }

            self.downPaymentObj[val.DownPaymentRate] = {
                "RepaymentPeriod":val.RepaymentPeriod,
                "DownPaymentRate":val.DownPaymentRate,
                "ProductID":val.ProductID,
                "SecurityDepositRate":val.SecurityDepositRate,
                "HasProduct":val.HasProduct,
                "HasOtherProduct":val.HasOtherProduct,
                "IsFitForFinance":val.IsFitForFinance
            }
        });



        //期限
        _repaymentRange.min = 0;
        _repaymentRange.max = 100;

        //默认月供
        _repaymentDefault = self.productObj[detailViewModel.productId()]["RepaymentPeriod"];

        detailViewModel.repaymentPeriod(_repaymentDefault);
        var _sliderCurPCT="0%",_specialClassName="";
        $.each(_data.ProductRepaymentperiods, function(index, val) {
            var sliderPCT = _sliderPCT2 * index + '%',//滑块百分比
                repaymentTxt = val.RepaymentPeriod + "期",//月供
                curClass="";
            _repaymentArr.push(val.RepaymentPeriod);

            if(val.RepaymentPeriod == _repaymentDefault){
                curClass = "cur";
                _sliderCurPCT = sliderPCT;
                detailViewModel.repaymentPeriod(_repaymentDefault);
            }

            if(index == 0 ){
                _specialClassName = "first-child";
            }else if(index == _repaymentLength-1){
                _specialClassName = "last-child";
            }else{
                _specialClassName = "";
            }

            if(val.HasProduct){//是否支持当前月供
                _repaymentRange[sliderPCT] = val.RepaymentPeriod;
                _repaymentDefaultArr.push(val.RepaymentPeriod);
                detailViewModel.repaymentPeriod(val.RepaymentPeriod);
            }else{
                curClass="disabled";
            }

            self.productObj[val.ProductID] = {
                "RepaymentPeriod":val.RepaymentPeriod,
                "DownPaymentRate":val.DownPaymentRate,
                "SecurityDepositRate":val.SecurityDepositRate,
                "HasProduct":val.HasProduct,
                "HasOtherProduct":val.HasOtherProduct,
            }

            self.repaymentObj[val.RepaymentPeriod.toString()] = {
                "RepaymentPeriod":val.RepaymentPeriod,
                "DownPaymentRate":val.DownPaymentRate,
                "ProductID":val.ProductID,
                "SecurityDepositRate":val.SecurityDepositRate,
                "HasProduct":val.HasProduct,
                "HasOtherProduct":val.HasOtherProduct,
            }
        })


        $.each(_repaymentDefaultArr, function(index, val) {
            // console.log(_repaymentArr)
            if(index == 0 && val == _repaymentArr[0]){
                _repaymentRange.min = val;
            }else if(index == _repaymentDefaultArr.length-1 && val == _repaymentArr[_repaymentArr.length-1]){
                _repaymentRange.max = val;
            }
        });

        _repaymentDefault = self.productObj[detailViewModel.productId()]["RepaymentPeriod"];

        detailViewModel.repaymentPeriod(_repaymentDefault);

        //首付滑块
        if(detailViewModel.isShowDownPayment()){
            var downPaymentArr = [];   // 数据数组
            // 提取数据
            for (var i in _downPaymentRange) {
                if (downPaymentArr.indexOf(_downPaymentRange[i]) < 0 && i !== 'min' && i !== 'max') {
                    downPaymentArr.push(_downPaymentRange[i]);
                }
            }
            // 排序
            downPaymentArr.sort(function (a, b) {
                return a - b;
            });
            // 将数据转换为参数格式
            for (var i = 0; i < downPaymentArr.length; i++) {
                downPaymentArr[i] = {
                    'text': downPaymentArr[i],
                    'isDisable': !_downPaymentDisableArr[i],
                    'isDefault': (downPaymentArr[i] === _downPaymentDefault),
                    'unit': '%'
                };
                if(downPaymentArr[i].text === _downPaymentDefault && $('.apply-btn.fl').text()!="暂不支持该城市"){
                    if(!_downPaymentDisableArr[i]){
                        $('.apply-btn').addClass('disabled').text('已超出贷款额范围');
                    }else{
                        $('.apply-btn').removeClass('disabled').text('立即申请');
                    }
                }
            }
            // self.downPaymentObj = _downPaymentObj;
            if (self.downPaymentSlider) {
                self.downPaymentSlider.update(downPaymentArr);
            } else {
                let oldDownPaymentRate = 0;
                self.downPaymentSlider = new YXSliderClick($(self.downPaymentDom).attr('id'), downPaymentArr, function (value) {
                    if (self.isDownPaymentPeriodAjax) {
                        self.isDownPaymentPeriodAjax = false;
                        oldDownPaymentRate = self.downPaymentObj[parseInt(value.text) / 100].DownPaymentRate * 100;
                        detailViewModel.productId(self.downPaymentObj[parseInt(value.text) / 100].ProductID);

                        //选城市
                        $.each(self.selCityHrefDom,function(idx,val){
                            let _href = $(this).attr("href");
                            let _hrefArr =  _href.split('/');
                            _hrefArr[5]='p'+ detailViewModel.productId();
                            $(this).attr("href",_hrefArr.join('/'));
                        })
                        //车款
                        $.each(self.selCarHrefDom,function(idx,val){
                            let _href = $(this).attr("href");
                            let _hrefArr =  _href.split('/');
                            _hrefArr[3]='p'+ detailViewModel.productId();
                            $(this).attr("href",_hrefArr.join('/'));
                        })
                        //经销商
                        $.each(self.selDealerHrefDom,function(idx,val){
                            let _href = $(this).attr("href");
                            let _hrefArr =  _href.split('/');
                            _hrefArr[3]='p'+  detailViewModel.productId();
                            $(this).attr("href",_hrefArr.join('/'));
                        })
                        self.downPaymentPeriod();
                    } else {
                        self.getIndex(_downPaymentArr, oldDownPaymentRate, (i)=>{
                          for(let j =0 ; j< downPaymentArr.length; ++j){
                            downPaymentArr[j].isDefault = false;
                          }
                          downPaymentArr[i].isDefault = true;
                          self.downPaymentSlider.update(downPaymentArr);
                        });
                        tools.showAlert("大侠手太快啦，等下再试试！");
                    }
                });
            }
        }

        //月供滑块
        var repaymentPeriodArr = [];   // 数据数组
        // 提取数据
        for (var i in _repaymentRange) {
            if (repaymentPeriodArr.indexOf(_repaymentRange[i]) < 0 && i !== 'min' && i !== 'max') {
                repaymentPeriodArr.push(_repaymentRange[i]);
            }
        }
        // 排序
        repaymentPeriodArr.sort(function (a, b) {
            return a - b;
        });
        // 将数据转换为参数格式
        for (var i = 0; i < repaymentPeriodArr.length; i++) {
            repaymentPeriodArr[i] = {
                'text': repaymentPeriodArr[i],
                'isDisable': false,
                'isDefault': (repaymentPeriodArr[i] === _repaymentDefault),
                'unit': '期'
            };
        }

        if (self.repaymentPeriodSlider) {
            self.repaymentPeriodSlider.update(repaymentPeriodArr);
        } else {
            self.repaymentPeriodSlider = new YXSliderClick($(self.repaymentPeriodDom).attr('id'), repaymentPeriodArr, function (value) {
                let oldRepaymentPeriod = detailViewModel.repaymentPeriod();
                if (self.isDownPaymentPeriodAjax) {
                    self.isDownPaymentPeriodAjax = false;
                    oldRepaymentPeriod = self.repaymentObj[parseInt(value.text)].RepaymentPeriod;
                    detailViewModel.productId(self.repaymentObj[parseInt(value.text)].ProductID);
                    //选城市
                    $.each(self.selCityHrefDom,function(idx,val){
                        let _href = $(this).attr("href");
                        let _hrefArr =  _href.split('/');
                        _hrefArr[5]='p'+ detailViewModel.productId();
                        $(this).attr("href",_hrefArr.join('/'));
                    })
                    //车款
                    $.each(self.selCarHrefDom,function(idx,val){
                        let _href = $(this).attr("href");
                        let _hrefArr =  _href.split('/');
                        _hrefArr[3]='p'+ detailViewModel.productId();
                        $(this).attr("href",_hrefArr.join('/'));
                    })
                    //经销商
                    $.each(self.selDealerHrefDom,function(idx,val){
                        let _href = $(this).attr("href");
                        let _hrefArr =  _href.split('/');
                        _hrefArr[3]='p'+  detailViewModel.productId();
                        $(this).attr("href",_hrefArr.join('/'));
                    })
                    self.downPaymentPeriod();
                } else {
                    self.getIndex(_repaymentArr, oldRepaymentPeriod, (i)=>{
                      for(let j =0 ; j< repaymentPeriodArr.length; ++j){
                        repaymentPeriodArr[j].isDefault = false;
                      }
                      repaymentPeriodArr[i].isDefault = true;
                      self.repaymentPeriodSlider.update(repaymentPeriodArr);
                    });
                    tools.showAlert("大侠手太快啦，等下再试试！");
                }
            });
        }

        // 保证金滑块
        if(_data.ProductSecurityDepositRates) {
            // todo :
            // console.log(_data.ProductSecurityDepositRates)
            //保证金数据
            _securityDepositRange.min = 0;
            _securityDepositRange.max = 100;
            if (_securityDepositLength == 1) {
                var _securityDepositTxt = _data.ProductSecurityDepositRates[0].SecurityDepositRate * 100;//保证金内容
                _securityDepositRange["50%"] = _securityDepositTxt;
                _securityDepositDefault = _securityDepositTxt;
                _securityDepositDefaultArr.push(_securityDepositTxt);

                self.productObj[_data.ProductSecurityDepositRates[0].ProductID] = {
                    "RepaymentPeriod": _data.ProductSecurityDepositRates[0].RepaymentPeriod,
                    "DownPaymentRate": _data.ProductSecurityDepositRates[0].DownPaymentRate,
                    "SecurityDepositRate": _data.ProductSecurityDepositRates[0].SecurityDepositRate,
                    "HasProduct": _data.ProductSecurityDepositRates[0].HasProduct,
                    "HasOtherProduct": _data.ProductSecurityDepositRates[0].HasOtherProduct,
                    "SecurityDepositRate": _data.ProductSecurityDepositRates[0].SecurityDepositRate
                }
                self.securityDepositObj[_data.ProductSecurityDepositRates[0].SecurityDepositRate] = {
                    "RepaymentPeriod": _data.ProductSecurityDepositRates[0].RepaymentPeriod,
                    "ProductID": _data.ProductSecurityDepositRates[0].ProductID,
                    "SecurityDepositRate": _data.ProductSecurityDepositRates[0].SecurityDepositRate,
                    "HasProduct": _data.ProductSecurityDepositRates[0].HasProduct,
                    "HasOtherProduct": _data.ProductSecurityDepositRates[0].HasOtherProduct,
                    "DownPaymentRate": _data.ProductSecurityDepositRates[0].DownPaymentRate
                }
                _securityDepositHtmlIE8 = '<div class="noUi-base"><div class="noUi-origin noUi-background" style="left: 50%;"><div class="noUi-handle noUi-handle-lower"></div></div><div data-id="' + _securityDepositTxt + '" class="noUi-event" style="left:50%"></div></div>';

                _downPaymentHtml += '<li data-id="' + _securityDepositTxt + '" style="left:50%" class="cur">' + _securityDepositTxt + '%</li>';

            } else if (_securityDepositLength == 2) {
                var _strHtmlIe8 = "", _sliderCurPCT = "0%";

                var frontData = _data.ProductSecurityDepositRates[0].SecurityDepositRate * 100,
                    backData = _data.ProductSecurityDepositRates[1].SecurityDepositRate * 100,
                    sliderPCT = ['30%', '70%'];
                // _securityDepositRange['30%'] =frontData;
                // _securityDepositRange['70%'] =backData;

                $.each(_data.ProductSecurityDepositRates, function (index, val) {
                    var securityDepositTxt = val.SecurityDepositRate * 100 + "%",//首付内容
                        curClass = "";
                    if (detailViewModel.productId() == val.ProductID) {
                        curClass = "cur";
                        _securityDepositDefault = val.SecurityDepositRate * 100;
                        _sliderCurPCT = sliderPCT[index];
                    }

                    if (val.HasProduct) {//是否支持当前保证金
                        _securityDepositRange[sliderPCT[index]] = val.SecurityDepositRate * 100;
                        _securityDepositDefaultArr.push(val.SecurityDepositRate * 100);
                    } else {
                        curClass = "disabled";
                    }

                    _downPaymentDefaultArr.push(val.SecurityDepositRate * 100);
                    self.productObj[val.ProductID] = {
                        "RepaymentPeriod": val.RepaymentPeriod,
                        "DownPaymentRate": val.DownPaymentRate,
                        "SecurityDepositRate": val.SecurityDepositRate,
                        "HasProduct": val.HasProduct,
                        "HasOtherProduct": val.HasOtherProduct,
                    }
                    self.securityDepositObj[val.SecurityDepositRate] = {
                        "RepaymentPeriod": val.RepaymentPeriod,
                        "ProductID": val.ProductID,
                        "SecurityDepositRate": val.SecurityDepositRate,
                        "HasProduct": val.HasProduct,
                        "HasOtherProduct": val.HasOtherProduct,
                    }

                    _strHtmlIe8 += '<div data-id="' + val.SecurityDepositRate + '" class="noUi-event ' + curClass + '" style="left:' + sliderPCT[index] + '"></div>'

                    _securityDepositHtml += '<li data-id="' + val.SecurityDepositRate + '" style="left:' + sliderPCT[index] + '" class="' + curClass + '">' + securityDepositTxt + '</li>';
                });
                _securityDepositHtmlIE8 = '<div class="noUi-base"><div class="noUi-origin noUi-background" style="left: ' + _sliderCurPCT + ';"><div class="noUi-handle noUi-handle-lower"></div></div>' + _strHtmlIe8 + '</div>';

            } else if (_securityDepositLength > 2) {
                var _strHtmlIe8 = "", _sliderCurPCT = "0%", _specialClassName = "";

                $.each(_data.ProductSecurityDepositRates, function (index, val) {

                    var sliderPCT = _sliderPCT3 * index + '%',//滑块百分比
                        curClass = "";
                    if (detailViewModel.productId() == val.ProductID) {
                        curClass = "cur";
                        _securityDepositDefault = val.SecurityDepositRate * 100;
                        _sliderCurPCT = sliderPCT;
                    }

                    if (index == 0) {
                        _specialClassName = "first-child";
                    } else if (index == _repaymentLength - 1) {
                        _specialClassName = "last-child";
                    } else {
                        _specialClassName = "";
                    }

                    if (val.HasProduct) {//是否支持当前保证金
                        _securityDepositRange[sliderPCT] = val.SecurityDepositRate * 100;
                        _securityDepositDefaultArr.push(val.SecurityDepositRate * 100);
                    } else {
                        curClass = "disabled";
                    }

                    var securityDepositTxt = val.SecurityDepositRate * 100 + "%";//首付内容
                    _securityDepositArr.push(val.SecurityDepositRate * 100);

                    self.productObj[val.ProductID] = {
                        "RepaymentPeriod": val.RepaymentPeriod,
                        "DownPaymentRate": val.DownPaymentRate,
                        "SecurityDepositRate": val.SecurityDepositRate,
                        "HasProduct": val.HasProduct,
                        "HasOtherProduct": val.HasOtherProduct,
                    }

                    self.securityDepositObj[val.SecurityDepositRate] = {
                        "RepaymentPeriod": val.RepaymentPeriod,
                        "ProductID": val.ProductID,
                        "SecurityDepositRate": val.SecurityDepositRate,
                        "HasProduct": val.HasProduct,
                        "HasOtherProduct": val.HasOtherProduct,
                    }
                    _strHtmlIe8 += '<div data-id="' + val.SecurityDepositRate + '" class="noUi-event ' + curClass + '" style="left:' + sliderPCT + '"></div>'

                    _securityDepositHtml += '<li data-id="' + val.SecurityDepositRate + '" style="left:' + sliderPCT + '" class="' + curClass + ' ' + _specialClassName + '">' + securityDepositTxt + '</li>';
                });
                _securityDepositHtmlIE8 = '<div class="noUi-base"><div class="noUi-origin noUi-background" style="left: ' + _sliderCurPCT + ';"><div class="noUi-handle noUi-handle-lower"></div></div>' + _strHtmlIe8 + '</div>';

            }

            var securityDepositArr = [];   // 数据数组
            // 提取数据
            for (var i in _securityDepositRange) {
                if (securityDepositArr.indexOf(_securityDepositRange[i]) < 0 && i !== 'min' && i !== 'max') {
                    securityDepositArr.push(_securityDepositRange[i]);
                }
            }
            // 排序
            securityDepositArr.sort(function (a, b) {
                return a - b;
            });
            // 将数据转换为参数格式
            for (var i = 0; i < securityDepositArr.length; i++) {
                securityDepositArr[i] = {
                    'text': securityDepositArr[i],
                    'isDisable': false,
                    'isDefault': (securityDepositArr[i] === _securityDepositDefault),
                    'unit': '%'
                };
            }
            if (self.securityDepositSlider) {
                self.securityDepositSlider.update(securityDepositArr);
            } else {
                let oldSecurityDepositRate = 0;
                self.securityDepositSlider = new YXSliderClick($(self.securityDepositDom).attr('id'), securityDepositArr, function (value) {
                    if (self.isDownPaymentPeriodAjax) {
                        self.isDownPaymentPeriodAjax = false;
                        oldSecurityDepositRate = self.securityDepositObj[parseInt(value.text) / 100].SecurityDepositRate * 100;
                        detailViewModel.productId(self.securityDepositObj[parseInt(value.text) / 100].ProductID);
                        //选城市
                        $.each(self.selCityHrefDom,function(idx,val){
                            let _href = $(this).attr("href");
                            let _hrefArr =  _href.split('/');
                            _hrefArr[5]='p'+ detailViewModel.productId();
                            $(this).attr("href",_hrefArr.join('/'));
                        })
                        //车款
                        $.each(self.selCarHrefDom,function(idx,val){
                            let _href = $(this).attr("href");
                            let _hrefArr =  _href.split('/');
                            _hrefArr[3]='p'+ detailViewModel.productId();
                            $(this).attr("href",_hrefArr.join('/'));
                        })
                        //经销商
                        $.each(self.selDealerHrefDom,function(idx,val){
                            let _href = $(this).attr("href");
                            let _hrefArr =  _href.split('/');
                            _hrefArr[3]='p'+  detailViewModel.productId();
                            $(this).attr("href",_hrefArr.join('/'));
                        })

                        self.downPaymentPeriod();
                    } else {
                        self.getIndex(_securityDepositArr, oldSecurityDepositRate, (i)=>{
                          for(let j =0 ; j< securityDepositArr.length; ++j){
                            securityDepositArr[j].isDefault = false;
                          }
                          securityDepositArr[i].isDefault = true;
                          self.securityDepositSlider.update(securityDepositArr);
                        });
                        tools.showAlert("大侠手太快啦，等下再试试！");
                    }
                });
            }
        }
        self.correctPosition();
    },
    //修正位置
    correctPosition:function(){
        var self = this;
        setTimeout(function(){
            //重新获取定位(修正位置)
            self.ceilingBoxPos = self.ceilingBox.offset().top;
            self.detailsLeftTop = $(".details-left-box").offset().top;
            self.floorBoxPos = self.floorBox.offset().top;
        },300)
    },
    //IE8月供首付滑动条
    /*
     *html:滚轴html
     *id：id容器名
     *callbacks： 返回函数，返回值为停止位置数值
     */
    IE8Slider: function(html, id, callbacks){
        var _domIE8 = $("#"+id);
        _domIE8.addClass('noUi-target noUi-ltr noUi-horizontal noUi-connect').html(html);

        _domIE8.off('click').on('click', '.noUi-event', function(e){
            if(!$(this).hasClass('disabled')){
                var idEvent = $(this).attr("data-id");
                var leftPos = $(this).css("left");
                _domIE8.next("ul").find("[data-id='"+ idEvent +"']").addClass("cur").siblings("li").removeClass("cur");
                _domIE8.find(".noUi-origin").css('left', leftPos);
                callbacks(idEvent);
            }

        });
    },
    //通过车价和产品计算贷款信息
    loanInfo:function(){
        var self = this,
            _url = '/Product/Calculation?carPrice=' +car.carPrice + '&productId='+ detailViewModel.productId() +'&carId=' +car.carId;

        self.sendAjax({
            url: _url
        }, success, sendAgain);

        function success(res){
            self.isDownPaymentPeriodAjax = true;
            if(res.Result){
                let data = res.Data;
                var _downPayment = data.downPayment * 10000,    // 首付
                    _loanAmount = data.loanAmount * 10000,
                    // _totalCost = data.totalCost * 10000,
                    _totalCost = Math.round((self.isPromotionExpired?res.Data.promotionTotalCost:res.Data.totalCost) * 10000),
                    _monthlyPayment = data.monthlyPayment * 10000,
                    _promotionMonthlyPayment = res.Data.promotionMonthlyPayment * 10000,
                    _finalPaymentAmount = data.finalPaymentAmount *10000,
                    _totalInterest = data.totalInterest *10000,
                    _interestRate = res.Data.interestRate * 100,
                    _promotionInterestRate = res.Data.promotionInterestRate * 100,
                    _serviceFee = data.serviceFee *10000,
                    _purchaseTax = data.purchaseTax *10000,
                    _totalExpenses = detailViewModel.carPrice()*10000 + _totalCost, // + _purchaseTax + 1450,
                    _isSecurityDeposit = (isDeposit === 'True') ? true : false,
                    _isFinalPaymentAmount = _finalPaymentAmount>0?true:false,
                    _securityDeposit = _isSecurityDeposit ? data.securityDeposit*10000 : 0, // 保证金
                    _LumpPayment = (isLumpPayment === 'True') ? _totalCost : 0,     // 一次性付息
                    // _firstPayment = Math.round(_downPayment + _securityDeposit + _LumpPayment), // 首次支付 = 首付+保证金+一次性付息
                    _firstPayment = Math.round((res.Data.firstPayment + (self.isPromotionExpired?res.Data.promotionTotalCost:res.Data.totalCost)) * 10000),
                    _isShowFirstPayment = self.isLumpPayment || _isSecurityDeposit ? true : false; // 有一次性付息或保证金时候，显示首次支付


                //是否促销
                detailViewModel.isPromotionExpired(self.isPromotionExpired);
                // 显示首次支付
                detailViewModel.isShowFirstPayment(_isShowFirstPayment);
                // 是否有一次性付息
                detailViewModel.isLumpPayment(self.isLumpPayment);
                //是否有保证金
                detailViewModel.isSecurityDeposit(_isSecurityDeposit);
                //保证金
                detailViewModel.securityDeposit(tools.addCmma(_securityDeposit));
                detailViewModel.securityDepositCount(self.changeNumber(data.securityDeposit));
                //保证金比例
                detailViewModel.securityDepositRate((res.Data.securityDepositRate * 100).toString() +'%');
                //首次支付
                detailViewModel.firstPayment(tools.addCmma(_firstPayment));
                // detailViewModel.firstPayment(tools.addCmma(Math.round(res.Data.firstPayment * 10000)+Math.round(_totalCost)))
                detailViewModel.firstPaymentCount(self.changeNumber(_firstPayment/10000));
                //首付金额
                detailViewModel.downPayment(tools.addCmma(_downPayment));
                detailViewModel.downPaymentCount(self.changeNumber(res.Data.downPayment));
                //首付比例
                detailViewModel.downPaymentRate((res.Data.downPaymentRate * 100).toString() +'%');
                //贷款金额
                detailViewModel.loanAmount(tools.addCmma(_loanAmount));
                //贷款成本
                detailViewModel.totalCost(tools.addCmma(_totalCost));
                detailViewModel.totalCostCount(self.changeNumber(self.isPromotionExpired?res.Data.promotionTotalCost:res.Data.totalCost));
                //月供
                detailViewModel.monthlyPayment(self.isPromotionExpired ? tools.addCmma(_promotionMonthlyPayment):tools.addCmma(_monthlyPayment));
                detailViewModel.monthlyPaymentCount(self.isPromotionExpired ? self.changeNumber(res.Data.promotionMonthlyPayment) :self.changeNumber(res.Data.monthlyPayment));
                detailViewModel.oldMonthlyPayment(tools.addCmma(_monthlyPayment));
                detailViewModel.oldMonthlyPaymentCount(self.changeNumber(res.Data.monthlyPayment));

                //贷款尾款
                detailViewModel.finalPaymentAmount(tools.addCmma(_finalPaymentAmount));
                detailViewModel.finalPaymentAmountCount(self.changeNumber(_finalPaymentAmount/10000));
                detailViewModel.isFinalPaymentAmount(_isFinalPaymentAmount);
                //尾款比例
                detailViewModel.finalPaymentRate((res.Data.finalPaymentRate * 100).toString() +'%');
                //月费率/月利率文本
                detailViewModel.rateText(res.Data.rateText);
                //月费率/月利率金额
                detailViewModel.interestRate(self.isPromotionExpired ? _promotionInterestRate.toFixed(2) + "%" : _interestRate.toFixed(2) + "%");
                detailViewModel.oldInterestRate(_interestRate.toFixed(2) + "%");
                //利息
                detailViewModel.totalInterest(tools.addCmma(_totalInterest));
                //手续费
                detailViewModel.serviceFee(tools.addCmma(_serviceFee));
                detailViewModel.serviceFeeCout(_serviceFee);
                //购置税
                detailViewModel.purchaseTax(tools.addCmma(_purchaseTax));
                //税费=购置税 + 500（上牌） + 950（强险）
                detailViewModel.taxation(tools.addCmma(_purchaseTax + 1450));
                //总花费
                detailViewModel.totalExpenses(tools.addCmma(_totalExpenses));
                // 保证金和一次性付息都有
                if(self.isLumpPayment && _isSecurityDeposit){
                    $('#DepositAndLump ul').addClass('all');
                }

                detailViewModel.hxmClassName(detailViewModel.isShowDownPayment()?'payment':'payment hxm');
                detailViewModel.subsidiaryClassName(_isShowFirstPayment&&self.isPromotionExpired?'subsidiary mag0':'subsidiary')

                //首付，期限改变后修改 表格选中值
                $('.details-table-s').removeClass('details-table-s');
                $('[data-productid="'+detailViewModel.productId()+'"]').addClass('details-table-s');
               
                $('.confluence-right').show();
            }

            self.correctPosition();
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
    //渲染DOM及特效
    renderDom: function () {
        var self = this;

        //设置导航位置

        if(self.source == "616" || isFromZT == "True"){
            $("#HeaderNav li").removeClass("current").siblings("#qijiandian_index").addClass('current');
            var maskLeft = $("nav#HeaderNav li.current").position().left,
                maskWidth = $("nav#HeaderNav li.current").width();
            $(".nav-mask").css({"left":maskLeft,"width":maskWidth});
        }

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

        //最近申请人数
        var _getRecentApplyUrl = APIURL + "/api/LoanOrder/GetRecentApplyTimeByPackageId?packageId="+ product.packageID
        self.sendAjax({
            url: _getRecentApplyUrl,
            dataType: 'jsonp',
        }, getRecentApply, getRApplySendAgain);

        function getRecentApply(res){
            if(res.Result && res.Data>0){
                detailViewModel.isGetRecentApplyTime("inline");
                detailViewModel.getRecentApplyTime(res.Data +"分钟前");
            }else{
                detailViewModel.isGetRecentApplyTime("none");
                detailViewModel.getRecentApplyTime(res.Data +"分钟前");
            }
        }
        // 出错后重新加载
        function getRApplySendAgain(info) {
            //console.log(info);
            self.sendAjax({
                url: _getRecentApplyUrl,
                dataType: 'text'
            }, getRecentApply, getRApplySendAgain);
        };

        // 最近申请信息
        var _approvalInfoUrl = APIURL + '/api/LoanOrder/GetNewestLoanOrderApprovalInfo?top=10&companyId='+companyID;
        self.sendAjax({
            url: _approvalInfoUrl,
            dataType: 'jsonp',
        }, getApprovalInfo, getApprovalInfoAgain);
        function getApprovalInfo(res){
            if(!res.Result){
                return false;
            }

            if(res.RowCount>0){
                for(let i = 0; i < res.Data.length; ++ i){
                    let _data = res.Data[i],
                        userObj = {};
                    userObj = {
                        Name:_data.UserCallName+ ' ' + _data.Mobile,
                        information: _data.CarSerialName+' '+_data.LoanCompanyName+' '+(_data.ApproveQuota>10000?(_data.ApproveQuota/10000).toFixed(2):_data.ApproveQuota+'元')+'额度'
                    }    
                    detailViewModel.userInformation.push(userObj);   
                }
                $('.recent-applied').removeClass('hide');

                //最近申请特效
                if (res.RowCount > 1) {
                    var appRecordSwiper = new Swiper('#appRecord', {
                        // slidesPerView: 2,
                        // slidesPerGroup: 2,
                        speed: 700,
                        mode: 'vertical',
                        autoplay: 5000,
                        autoplayDisableOnInteraction: false,
                        loop: true
                    });
                }
            }
        }
        // 出错后重新加载
        function getApprovalInfoAgain (res){
            self.sendAjax({
                url: _approvalInfoUrl,
                dataType: 'text'
            }, getApprovalInfo, getApprovalInfoAgain);
        }

        // 其他金融产品otherProduct
        let _otherProductUrl =  otherProductsApiUrl+'?productId='+product.productID+'&cityId='+city.cityId+'&carId='+car.carId+'&carPrice='+car.carPrice;
        self.sendAjax({
            url: _otherProductUrl,
            dataType: 'json',
            type: 'get'
        }, getOtherProduct, getOtherProductAgain);
        function getOtherProduct(res){
            if(!res.Result){
                return false;
            }
            if(res.RowCount>0){
                for(let i = 0; i < res.RowCount; ++i){
                    let _data = res.Data[i],
                        _product = {};
                    let _packageFeatureList = _data.PackageFeatureList,
                        _leg = _packageFeatureList?0:_packageFeatureList.length,
                        PackageHtml = '';
                    if(_leg > 0){
                        for(let j = 0; j < _leg; ++j){
                            let _packagef = _packageFeatureList[j];
                            PackageHtml+='<span class="icon-'+_packagef.ID+'">'+_packagef.Name+'</span>'
                        }
                    }
                    _product = {
                        detailUrl: "/" + city.citySpell + "/m" + car.carId + "/p" + _data.ProductId + "/?source=" + source,
                        logoUrl: _data.CompanyLogoUrl,
                        proName: _data.CompanyName+' '+_data.PackageName,
                        monthlyPaymentText: _data.LoanCalculationInfo.MonthlyPaymentText,
                        totalCostText: _data.LoanCalculationInfo.TotalCostText,
                        packageHtml:PackageHtml
                    }

                    detailViewModel.otherProduct.push(_product);
                }
                $('.other-products').show();
            }
        }
        function getOtherProductAgain(res){
            self.sendAjax({
                url: _otherProductUrl,
                dataType: 'text',
            }, getOtherProduct, getOtherProductAgain);
        }

        $(".scroll-photos .label p").each(function(index,item){
            var rdm = index%4;
            switch(rdm){
                case 0:
                    $(this).addClass("red");
                    break;
                case 1:
                    $(this).addClass("green");
                    break;
                case 2:
                    $(this).addClass("blue");
                    break;
                case 3:
                    $(this).addClass("orange");
                    break;
            }
        })

        //选车
        $("#selCar").selCar({
            IsOpenSearch: false,
            CallBacks: selCarCallBack
        });

        function selCarCallBack(obj) {
            if (obj.returnType == "carType") {
                var carName = obj.carType,
                    carId = obj.carTypeId,
                    brandName = obj.brandName,
                    spell = obj.spell;
                $(".sel-car-box .text-box").text(brandName + " " + carName).attr("data-spell", spell);
                window.open("/www/"+spell+"?source=627");
            }
        };

        //选择城市
        $(".area-city-box").selCity({
            loadCityUrl:APIURL +"/api/Common/GetSupportGroupingCityList?packageId="+product.packageID +"&carId="+car.carId,
            isRelationHeader: true
        });

        window.selCityCallback = function(obj) {
            $(".area-city-box .area-city-con").attr("data-id",obj.cityId).text(obj.cityName);
            let _hrefArr =  obj.url.split('/');
            if(_hrefArr[5].indexOf("p")>=0){
                _hrefArr[5]='p'+ detailViewModel.productId();
            }
            window.location.href = _hrefArr.join('/');
        };

        //开启惰性加载
        $("img.lazy").lazyload({
            effect: "fadeIn"
        });

        //我要提问
        $("#commonProblem .question-btn").questions({
            packageId:product.packageID
        });



        check.telChannel('detailTel', 'feedMobile', BusinessLine, {
           'CityId': city.cityId,
           'CityText': city.cityName,
           'PageType': 6,//入口页类型 1-首页 2-列表页结果区 3-列表页无结果 4-按预算列表无结果 5-列表页底部 6-详情页
           'CarId': car.carId,
           'PackageId': '',
           'CarText': car.carSerialShowName+car.carName,
           'CompanyId': dealer.dealerId,
           'PackageText': product.packageName,
           'statisticalMarker': 'pc-xinche-detail-btn-tel-channel'
        });
        
        self.bindEvent();

    },


    //贷款顾问（新接口）
    loanAdviser:function() {
        var self = this;
        var _url = adviserApi + "v2/group/getextenlist?CityId=" + city.cityId + "&CompanyIds=" + companyID;

        self.sendAjax({
            url: _url,
            dataType: 'jsonp',
        }, adviserList, sendAgain);

        // 出错后重新加载
        function sendAgain(info) {
            self.sendAjax({
                url: _url,
                dataType: 'jsonp'
            }, adviserList, sendAgain);
        };

        // 处理顾问电话
        function adviserList(result) {
            var adviserPhones = [];
            var adviserPhonesStr = {cN400: '4000-169-169', exTen: ''};
            var adviserPhoneShort = {cN400: '4000-169-169', exTen: ''};
            var fomatPhone = function(phone) {
                // return phone.slice(0,4) + '-' + phone.slice(4,7)  + '-' + phone.slice(7,phone.length);
                return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1-$2-$3');
            }
            if (result.Data!=null) {
                    var data = result.Data[0];
                adviserPhonesStr.cN400 = fomatPhone(data.CallGroup[0].CN400);
                for (var i = 0; i < data.CallGroup.length; i++) {
                    adviserPhones.push({
                        cN400: fomatPhone(data.CallGroup[i].CN400),
                        exTen: ''
                    });
                    adviserPhonesStr.exTen += ' <font class="black">/</font> ';
                }

                // 电话号缩写
                adviserPhoneShort.cN400 = fomatPhone(data.CallGroup[0].CN400);
                // temp 顾问电话数量小于2时，不显示电话列表
                if (adviserPhones.length < 2) {
                    adviserPhones = [];
                    $('.adv-box .adviser-tip').addClass('bg-white');
                } else {
                    $('.adv-box .adviser-tip').removeClass('bg-white');
                }
                detailViewModel.adviserPhones(adviserPhones);
                detailViewModel.adviserPhoneShort(adviserPhoneShort);
                detailViewModel.adviserPhonesStr(adviserPhonesStr);
                detailViewModel.isShowAdviserPhonesStr(adviserPhones.length>1?true:false);

            } else {
                $('.adv-box .adviser-tip').addClass('bg-white');
                detailViewModel.adviserPhones(adviserPhones);
                detailViewModel.adviserPhoneShort(adviserPhoneShort);
                detailViewModel.adviserPhonesStr(adviserPhonesStr);
                detailViewModel.isShowAdviserPhonesStr(adviserPhones.length>1?true:false);
            }

            // hover 事件
            var adviserPhonesElem = $('.apply-req .adviser-box');
            if (!adviserPhonesElem.hasClass('ready')) {
                adviserPhonesElem.bind({
                    'mouseenter': function() {
                        $(this).find('.adv-list').fadeIn('fast');
                    },
                    'mouseleave': function() {
                        $(this).find('.adv-list').fadeOut('fast');
                    }
                }).addClass('ready');
            }
        }
    },

    //吸顶吸底的动态布局
    dynamicLayout:function(){
        var self = this;
        var _leftPos = $(".details-left-box").offset().left + 944 - $(window).scrollLeft();

        //吸顶判断
        if ($(window).scrollTop() > self.ceilingBoxPos && $(window).scrollTop() < $("#shareOrder").offset().top + 200) {
            self.ceilingBox.css({
                "position": "fixed",
                "top": 0,
                "width": "1200px",
                "left": "50%",
                "margin-left": "-600px",
                "z-index": "100"
            })

        } else {
            self.ceilingBox.css({
                "position": "relative",
                "left": "0",
                "margin-left": "0",
                "z-index": "1"
            })
        }

        //贷款详情等按钮
        if(self.rollingState){
            if($(window).scrollTop() >= self.userEvaluate.offset().top && $(window).scrollTop() < self.commonProblem.offset().top){
                self.ceilingBox.find("[data-name = 'userEvaluate']").addClass("cur").siblings("a").removeClass("cur");
            }else if ($(window).scrollTop() >= self.commonProblem.offset().top && $(window).scrollTop() < self.shareOrder.offset().top) {
                self.ceilingBox.find("[data-name = 'commonProblem']").addClass("cur").siblings("a").removeClass("cur");
            } else if ($(window).scrollTop() >= self.shareOrder.offset().top && $(window).scrollTop() < self.shareOrder.offset().top) {
                self.ceilingBox.find("[data-name = 'shareOrder']").addClass("cur").siblings("a").removeClass("cur");
            }else if($(window).scrollTop() >= self.shareOrder.offset().top){
                self.ceilingBox.find("[data-name = 'shareOrder']").addClass("cur").siblings("a").removeClass("cur");
            } else {
                self.ceilingBox.find("[data-name = 'loanDetails']").addClass("cur").siblings("a").removeClass("cur");
            }
        }


        //吸底判断
        if(self.source != "616"){
            if ($(window).scrollTop() + $(window).height() >= self.floorBoxPos + $("#floorBox").height() &&
                $(window).scrollTop() + $(window).height() < self.detailsLeftTop + $(".details-left-box").height()) {
                // var _posTop = ($(window).scrollTop() - self.floorBoxPos - $("#floorBox").height() + $(window).height() + 40) + "px";
                //console.log(self.floorBoxHeight +"_" +$(window).height() +"__" +self.floorBoxPos)

                self.floorBox.css({
                    "bottom":"15px",
                    "left":_leftPos+"px",
                    "top":"auto",
                    "position":"fixed"
                });


            } else if ($(window).scrollTop() + $(window).height() >= self.detailsLeftTop + $(".details-left-box").height()) {
                self.floorBox.css({
                    "bottom":0,
                    "top":"auto",
                    "left":"auto",
                    "marginLeft":0,
                    "position":"absolute"
                });
            } else {
                self.floorBox.css({
                    "bottom":"auto",
                    "top":"90px",
                    "left":"auto",
                    "marginLeft":0,
                    "position":"absolute"
                });
            }
        }else{
            if ($(window).scrollTop() > self.ceilingBoxPos && $(window).scrollTop() < $("#shareOrder").offset().top + 200 &&
                $(window).scrollTop() + $(window).height() < self.detailsLeftTop + $(".details-left-box").height()) {
                self.floorBox.css({
                    "top":"50px",
                    "left":_leftPos+"px",
                    "bottom":"auto",
                    "position":"fixed"
                });
            }else if ($(window).scrollTop() + $(window).height() >= self.detailsLeftTop + $(".details-left-box").height()) {
                self.floorBox.css({
                    "bottom":0,
                    "top":"auto",
                    "left":"auto",
                    "marginLeft":0,
                    "position":"absolute"
                });
            } else {
                self.floorBox.css({
                    "bottom":"auto",
                    "top":"70px",
                    "left":"auto",
                    "marginLeft":0,
                    "position":"absolute"
                });
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

        //获取贷款按钮
        self.getLoanBtn.on("click",function(){
            var pathname =  window.location.pathname;
            pathname = (pathname.split("/"))[1];
            var carSpell = $(this).siblings(".sel-car-wrapper").find("#selCar").attr("data-spell");
            if(carSpell){
                window.location.href = window.location.origin +"/"+ pathname +"/" + carSpell+"?source=627";
            }else{
                tools.showAlert("请选择车型");
            }

        });

        //第一屏分享、加价购等点击事件
        $(".new-car-wrapper").on("click",".product-package-list li,.apply-btn",function(e){
            var curItem = $(e.currentTarget);
            if (curItem.is(".product-package-list li")) {
                $(this).addClass('cur').siblings().removeClass("cur")
            }else if(curItem.is(".apply-btn")){
                if(!$(this).hasClass("disabled")){
                    tools.isApply(function(bln){
                        if(bln){
                            self.applyNow();
                        }
                    });
                }
            }
        })

        //评论个数点击
        $("#numComments").on("click",function(){
            $('html,body').stop().animate({
                "scrollTop": $("#userEvaluate").offset().top -50
            },500);
        });

        //价格明细弹层
        $(".car-info").on('click','.subsidiary',function(event) {
            event.preventDefault();
            self.maskLayer.show();
            self.totalCostLayer.removeClass('hide');
            self.totalCostLayer.css('margin-top', -self.totalCostLayer.height()/2)
        });
        self.totalCostLayer .find(".close-layer").on('click',function(event) {
            event.preventDefault();
            self.maskLayer.hide();
            self.totalCostLayer.addClass('hide');
        });
        //贷款详情等按钮的点击事件
        $(".product-intro").on("click",".product-intro-title a,.apply-btn",function (e) {
            var curItem = $(e.currentTarget);
            if(curItem.is(".product-intro-title a")){
                $(this).addClass("cur").siblings('a').removeClass("cur");

                self.rollingState = false;
                var _idName = "#" + $(this).attr("data-name"),
                    _itemTop;
                if (self.ceilingBox.css("position") == "fixed") {
                    _itemTop = $(_idName).offset().top + "px";
                } else {
                    _itemTop = ($(_idName).offset().top - 50) + "px";
                }

                $('html,body').animate({
                    "scrollTop": _itemTop
                }, 500);
                setTimeout(function(){
                    self.rollingState  = true;
                },600);
            }else if(curItem.is(".apply-btn")){
                //console.log(!$(this).hasClass("disabled"));
                if(!$(this).hasClass("disabled")){
                    tools.isApply(function(bln){
                        if(bln){
                            self.applyNow();
                        }
                    });
                }
            }

        });

        //怎么评价、市场月供和费税鼠标滑过特效
        $(".car-info .car-info-other li i,.financial-href a").hover(
            function () {
                $(this).siblings("font").stop().fadeIn();
            },
            function () {
                $(this).siblings("font").stop().fadeOut();
            }
        );

        //保证金等鼠标滑过特效
        $(".car-info .bond-box font,.gift-group .tip-box").hover(
            function () {
                $(this).siblings(".tipText").stop().fadeIn();
            },
            function () {
                $(this).siblings(".tipText").stop().fadeOut();
            }
        );
        $(".ut-d").hover(function() {
            $(this).parent(".apply-det").prev(".CommonRequirementType-tip").stop().fadeIn();
        }, function() {
            $(this).parent(".apply-det").prev(".CommonRequirementType-tip").stop().fadeOut();
        });

        $(".yxHxm-btn").hover(function() {
            $(".yxHxm-tip").stop().fadeIn();
        }, function() {
            $(".yxHxm-tip").stop().fadeOut();
        });

        $(".financial-inst .string-ctn").hover(
            function () {
                $(this).parent(".staring").next(".tipText").stop().fadeIn();
            },
            function () {
                $(this).parent(".staring").next(".tipText").stop().fadeOut();
            }
        );

        //评价列表
        $("#userEvaluate").on("mouseover",".staring-ctn-hover",function(){
            $(this).prev(".tipText").stop().fadeIn();
        }).on("mouseout",".staring-ctn-hover",function(){
            $(this).prev(".tipText").stop().fadeOut();
        });


        //空心按钮特效
        $(".city-other-products").on("mouseover",".effect-btn",function(){
            $(this).find("i").stop().animate({
                height:"100%"
            },200)
        }).on("mouseout",".effect-btn",function(){
            $(this).find("i").stop().animate({
                height:"0"
            },200)
        });

        //贷款顾问
        $(".loan-adviser").on("mouseover","li.swiper-slide",function(){
            var _txt = $(this).find("font").text(),
                _posTop = $(this).position().top + $(this).parent("ul").position().top + 8;
            if(_txt !=""){
                self.loanTip.text(_txt).css({"top":_posTop}).stop().fadeIn();
            }

        }).on("mouseout","li.swiper-slide",function(){
            self.loanTip.stop().fadeOut();
        });

        $(".adviser-nav-box").on("mouseover","li.adviser-group01",function(){
            var _txt = $(this).find("font").text(),
                _posTop = $(this).position().top + $(this).height() + 8;
            if(_txt !=""){
                $(this).find(".loan-adviser-tip").text(_txt).css({"bottom":_posTop}).stop().fadeIn();
            }

        }).on("mouseout","li.adviser-group01",function(){
            $(this).find(".loan-adviser-tip").stop().fadeOut();
        });

        $(".adviser-nav-box").on('click','.more-adviser',function(){

            $('html,body').stop().animate({
                "scrollTop": (self.floorBoxPos + 40)  +"px"
            },500);
        })

        $(".shareEvent").click(function(){
            self.QRCodeBox.removeClass("hide");
            self.maskLayer.show();
        });
        $(".closeEvent").click(function(){
            self.QRCodeBox.addClass("hide");
            self.maskLayer.hide();
        });

    },
    //立即申请
    applyNow: function(){

        var self = this;

        self.formDom.find('input[name="Orders"]').val(product.packageID +"_"+ detailViewModel.productId() +"_0");
        self.formDom.find('input[name="CarId"]').val(car.carId);
        self.formDom.find('input[name="CityId"]').val(city.cityId);
        self.formDom.find('input[name="CarPrice"]').val(car.carPrice);
        self.formDom.find('input[name="Source"]').val(source?source:0);
        self.formDom.find('input[name="Line"]').val(BusinessLine);
        self.formDom.find('input[name="AdviserId"]').val(self.adviserId);
        self.formDom.find('input[name="From"]').val('');

        self.formDom.find('input[name="Shop"]').val(shop);

        self.formDom.submit();

    },//评价列表
    getUserEvaluate: function(){
        var self = this;
        this.sendAjax({
                url: '/PackageComment/Get?packageId='+product.packageID+'&pageIndex='+ detailViewModel.pageIndex() +'&pageSize=' + this.pageSize,
                type: 'Get',
                dataType:"html"
            },
            function (res) {
                $("#pagedCommentDiv").html(res);
            },
            function (textStatus) { });
    },
    bindCommentsPagedEvent:function(){
        var self = this;
        detailViewModel.userEvaNum(totalComments)
        if(totalComments>self.pageSize){
            $("#listPagination").show();
        }else{
            $("#listPagination").hide()
        }
        var pageCount = Math.ceil(totalComments/self.pageSize);
        tools.listPagination("listPagination", pageCount, detailViewModel.pageIndex(), callBacks);

        function callBacks(pageindex) {
            detailViewModel.pageIndex(pageindex);
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
    },//常见问题
    getCommonQuestions: function () {
        //常见问题滚动特效
        var commonProblemSwiper = new Swiper('#commonSwiper', {
            slidesPerView : 3,
            slidesPerGroup : 3,
            speed: 1000,
            mode: 'vertical',
            autoplay: 5000,
            loop: true
        });
        $("#commonSwiper").on('mouseover',function(){
            commonProblemSwiper.stopAutoplay();
        }).on('mouseout',function(){
            commonProblemSwiper.startAutoplay();
        })
    },
    //超值二手车
    usedCarBudget (){
      let self = this,
          _userUrl = samePriceUsedCarApiUrl+'?carPrice='+car.carPrice+'&cityID='+city.cityId;
      self.sendAjax({
        url: _userUrl,
        type: 'Get',
        dataType:'json'
      }, usedCarBudgetSuc, usedCarBudgetAgain);

      function usedCarBudgetSuc(res){
        if(!res.Result){
          return false;
        }
        if(res.RowCount >0){
          for(let i = 0; i < 3; ++i){
            let _data = res.Data[i],
                _obj = {};
                _obj = {
                  uCarDetailUrl: ERSHOUCHEURL+'/'+_data.CarCity+'/'+_data.UCarId+'/?source=639',
                  imgUrl: _data.CarPicPath,
                  carFullName: _data.CarFullName,
                  monthPay: _data.MonthPay,
                  spareCount: _data.SpareMoney,
                  spareText: '省'+(_data.SpareMoney>=1?(_data.SpareMoney).toFixed(2)+'万': Math.round(_data.SpareMoney*10000)+'元'),
                }
              detailViewModel.usedCarRecommend.push(_obj);
          }
          $('.used-car').removeClass('hide');
        }
      }
      function usedCarBudgetAgain(info){
        self.sendAjax({
              url: _userUrl,
              type: 'Get',
              dataType: 'json'
          }, usedCarBudgetSuc, usedCarBudgetAgain);
      } 
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
    var scrollTop = $('#Content').offset().top;
    $(window).scrollTop(scrollTop);

    var detailPage = new DetailPage();
    detailPage.init();
});