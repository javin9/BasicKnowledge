import './index.scss';
import selCar from 'libs/carSelect/selCar.pc';
import ko from 'knockout';
import YXSliderClick from 'libs/yxSlider/click.pc';
import 'zrender/lib/vml/vml';
import check from 'libs/check';
import aes from "libs/aes";
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
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
        num.substring(num.length - (4 * i + 3));
    if (_bool) {
        return (((sign) ? '' : '-') + num + '.' + cents);
    } else {
        return (((sign) ? '' : '-') + num);
    }
};

var detailViewModel = {
    quotationType: ko.observable('--'), //报价类型
    quotationAmount: ko.observable('--'), //报价金额
    downPayment: ko.observable('--'), //首付金额
    downPaymentCount: ko.observable('--'),
    downPaymentRate: ko.observable('--'), //首付比例
    downPaymentRateData: ko.observable(0), //首付比例原始数据
    repaymentPeriodData: ko.observable(0), //月供原始数据
    loanAmount: ko.observable('--'), //贷款金额
    totalCost: ko.observable('--'), //贷款成本（利息、手续费之和）
    totalCostCount: ko.observable('--'),
    totalExpenses: ko.observable('--'), //总花费（车价 + 贷款成本 + 税费）
    monthlyPayment: ko.observable('--'), //月供
    monthlyPaymentCount: ko.observable('--'), //月供数据
    oldMonthlyPayment: ko.observable('--'), //
    oldMonthlyPaymentCount: ko.observable('--'),
    finalPaymentAmount: ko.observable('--'), //贷款尾款
    finalPaymentAmountCount: ko.observable('--'), //贷款尾款数值
    isFinalPaymentAmount: ko.observable(false),
    finalPaymentRate: ko.observable('--'), //尾款比例
    rateText: ko.observable('--'), //月费率/月利率文本
    interestRate: ko.observable('--'), //月费率/月利率金额
    oldInterestRate: ko.observable('--'), //原月费率/月利率金额
    totalInterest: ko.observable('--'), //利息
    serviceFee: ko.observable('--'), //手续费
    serviceFeeCout: ko.observable('--'), //手续费数值
    purchaseTax: ko.observable('--'), //购置税
    taxation: ko.observable('--'), //税费=购置税 + 500（上牌） + 950（强险）
    carPrice: ko.observable(car.carPrice), //车价
    productId: ko.observable(product.productID),
    packageId: ko.observable(product.packageID),
    downPaymentHtml: ko.observable(''), //首付文本Html
    repaymentHtml: ko.observable(''), //月供文本Html

    isLumpPayment: ko.observable(false), //是否一次性付息
    isShowFirstPayment: ko.observable(false), //是否显示首次支付
    isSecurityDeposit: ko.observable(false), //是否有保证金
    securityDeposit: ko.observable("--"), //保证金
    securityDepositCount: ko.observable("--"),
    securityDepositHtml: ko.observable(''),
    securityDepositRate: ko.observable("--"), //保证金比例
    securityDepositRateData: ko.observable(0), //原始数据
    firstPayment: ko.observable("--"), //首次支付
    firstPaymentCount: ko.observable("--"), //首次支付数值
    carPriceFormat: ko.observable(tools.addCmma(car.carPrice * 10000)),
    isPromotionExpired: ko.observable(false), //是否促销

    repaymentPeriod: ko.observable('--'), //期限
    isShowDownPayment: ko.observable(isHXM != "True" ? true : false), //isHXM == "True"隐藏首付

    hxmClassName: ko.observable(''),
    subsidiaryClassName: ko.observable(''),
};

var DetailPage = function() {
    //DOM缓存
    this.downPaymentDom = $("#downPayment");
    this.repaymentPeriodDom = $("#repaymentPeriod");
    this.securityDepositDom = $("#securityDeposit");
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
    this.rollingState = true;
    //选车提交按钮DOM
    this.getLoanBtn = $(".details-right-box .sel-car-box .btn");
    //贷款顾问tip
    this.loanTip = $(".loan-adviser-tip");
    //随机贷款顾问ID
    this.adviserId = 0;


    this.productObj = {}; //以产品ID为key查询
    this.downPaymentObj = {}; //以首付为key查询
    this.securityDepositObj = {}; //以保证金为key查询
    this.repaymentObj = {}; //以月供为key查询

    this.isLumpPayment = isLumpPayment.toLowerCase() == 'true' ? true : false;
    this.isPromotionExpired = product.productPromotionId !== '0' && isPromotionExpired === "False" && isTieXi === "False" ? true : false; //是否促销
};

DetailPage.prototype = {
    init: function() {
        var self = this;
        ko.applyBindings(detailViewModel);
        //增加判断如果是在线审批的单子跳转到orderapplyyx
        // if(packageProcess.toLocaleLowerCase().indexOf("/onlineapproval")>=0){
        //     packageProcess = packageProcess.toLocaleLowerCase().replace("/onlineapproval", "/orderapplyyx");
        // }
        // $("#orderInfoForm").attr("action",packageProcess);
        //获取首付月供
        self.downPaymentPeriod();

        self.formFunction();
        //form表单
        this.formDom = $("#orderInfoForm");
        self.renderDom();
    },

    //获取首付、期限
    downPaymentPeriod: function() {
        var self = this,
            _url = getByIdUrl + '?id=' + detailViewModel.productId() + '&carPrice=' + car.carPrice;

        self.sendAjax({
            url: _url
        }, success, sendAgain);

        function success(res) {
            self.loanInfo();
            self.slideBlock(res);
        }

        // 出错后重新加载
        function sendAgain(info) {
            //console.log(info);
            self.sendAjax({
                url: _url,
            }, success, sendAgain);
        };
    },
    getIndex(arr, data, callback) {
        let contrastArr = arr,
            index = 0;
        for (let i = 0; i < contrastArr.length; ++i) {
            if (data == contrastArr[i]) {
                index = i;
                callback(index)
            }
        }
    },
    //滑块
    slideBlock: function(res) {
        var self = this,
            _data = res,
            _downPaymentRange = {},
            _downPaymentArr = [],
            _downPaymentLength = _data.ProductDownpaymentrates.length,
            _sliderPCT = 100 / (_downPaymentLength - 1),
            _downPaymentHtml = "", //首付下标
            _downPaymentDefault = "",
            _downPaymentDisableArr = [],
            _downPaymentDefaultArr = [], //默认首付数组
            _downPaymentDefault = "",

            _repaymentRange = {},
            _repaymentArr = [],
            _repaymentLength = _data.ProductRepaymentperiods.length,
            _sliderPCT2 = (_repaymentLength > 1) ? 100 / (_repaymentLength - 1) : 0,
            _repaymentHtml = "", //月供下标
            _repaymentInitArr = [], //初始化月供数组
            _repaymentDefaultArr = [], //默认月供数组
            _repaymentDefault = "",

            _securityDepositRange = {},
            _securityDepositArr = [],
            _securityDepositLength = _data.ProductSecurityDepositRates ? _data.ProductSecurityDepositRates.length : 0,
            _sliderPCT3 = (_securityDepositLength > 1) ? 100 / (_securityDepositLength - 1) : 0,
            _securityDepositHtml = "", //保证金下标
            _securityDepositInitArr = [], //初始化保证金数组
            _securityDepositDefaultArr = [], //默认保证金数组
            _securityDepositDefault = "",
            _securityDepositHtmlIE8,

            shoufuEvent = false,
            yuegongEvent = false;

        self.productObj = {}; //以产品ID为key查询
        self.downPaymentObj = {}; //以首付为key查询
        self.securityDepositObj = {}; //以保证金为key查询
        self.repaymentObj = {}; //以月供为key查询
        //首付数据
        _downPaymentRange.min = 0;
        _downPaymentRange.max = 100;

        var _sliderCurPCT = "0%",
            _specialClassName = "";
        $.each(_data.ProductDownpaymentrates, function(index, val) {

            var sliderPCT = _sliderPCT * index + '%', //滑块百分比
                curClass = "";
            _downPaymentRange[sliderPCT] = val.DownPaymentRate * 100;
            _downPaymentDefaultArr.push(val.DownPaymentRate * 100);
            _downPaymentDisableArr.push(val.IsFitForFinance);

            if (detailViewModel.productId() == val.ProductID) {
                curClass = "cur";
                _sliderCurPCT = sliderPCT;
                _downPaymentDefault = val.DownPaymentRate * 100;
            }

            var downPaymentTxt = val.DownPaymentRate * 100 + "%"; //首付内容
            _downPaymentArr.push(val.DownPaymentRate * 100);

            self.productObj[val.ProductID] = {
                "RepaymentPeriod": val.RepaymentPeriod,
                "DownPaymentRate": val.DownPaymentRate,
                "SecurityDepositRate": val.SecurityDepositRate,
                "HasProduct": val.HasProduct,
                "HasOtherProduct": val.HasOtherProduct,
                "IsFitForFinance": val.IsFitForFinance
            }

            self.downPaymentObj[val.DownPaymentRate] = {
                "RepaymentPeriod": val.RepaymentPeriod,
                "DownPaymentRate": val.DownPaymentRate,
                "ProductID": val.ProductID,
                "SecurityDepositRate": val.SecurityDepositRate,
                "HasProduct": val.HasProduct,
                "HasOtherProduct": val.HasOtherProduct,
                "IsFitForFinance": val.IsFitForFinance
            }
        });



        //期限
        _repaymentRange.min = 0;
        _repaymentRange.max = 100;

        //默认月供
        _repaymentDefault = self.productObj[detailViewModel.productId()]["RepaymentPeriod"];

        detailViewModel.repaymentPeriod(_repaymentDefault);
        var _sliderCurPCT = "0%",
            _specialClassName = "";
        $.each(_data.ProductRepaymentperiods, function(index, val) {
            var sliderPCT = _sliderPCT2 * index + '%', //滑块百分比
                repaymentTxt = val.RepaymentPeriod + "期", //月供
                curClass = "";
            _repaymentArr.push(val.RepaymentPeriod);

            if (val.RepaymentPeriod == _repaymentDefault) {
                curClass = "cur";
                _sliderCurPCT = sliderPCT;
                detailViewModel.repaymentPeriod(_repaymentDefault);
            }

            if (index == 0) {
                _specialClassName = "first-child";
            } else if (index == _repaymentLength - 1) {
                _specialClassName = "last-child";
            } else {
                _specialClassName = "";
            }

            if (val.HasProduct) { //是否支持当前月供
                _repaymentRange[sliderPCT] = val.RepaymentPeriod;
                _repaymentDefaultArr.push(val.RepaymentPeriod);
                detailViewModel.repaymentPeriod(val.RepaymentPeriod);
            } else {
                curClass = "disabled";
            }

            self.productObj[val.ProductID] = {
                "RepaymentPeriod": val.RepaymentPeriod,
                "DownPaymentRate": val.DownPaymentRate,
                "SecurityDepositRate": val.SecurityDepositRate,
                "HasProduct": val.HasProduct,
                "HasOtherProduct": val.HasOtherProduct,
            }

            self.repaymentObj[val.RepaymentPeriod.toString()] = {
                "RepaymentPeriod": val.RepaymentPeriod,
                "DownPaymentRate": val.DownPaymentRate,
                "ProductID": val.ProductID,
                "SecurityDepositRate": val.SecurityDepositRate,
                "HasProduct": val.HasProduct,
                "HasOtherProduct": val.HasOtherProduct,
            }
        })


        $.each(_repaymentDefaultArr, function(index, val) {
            // console.log(_repaymentArr)
            if (index == 0 && val == _repaymentArr[0]) {
                _repaymentRange.min = val;
            } else if (index == _repaymentDefaultArr.length - 1 && val == _repaymentArr[_repaymentArr.length - 1]) {
                _repaymentRange.max = val;
            }
        });

        _repaymentDefault = self.productObj[detailViewModel.productId()]["RepaymentPeriod"];

        detailViewModel.repaymentPeriod(_repaymentDefault);

        //首付滑块
        if (detailViewModel.isShowDownPayment()) {
            var downPaymentArr = []; // 数据数组
            // 提取数据
            for (var i in _downPaymentRange) {
                if (downPaymentArr.indexOf(_downPaymentRange[i]) < 0 && i !== 'min' && i !== 'max') {
                    downPaymentArr.push(_downPaymentRange[i]);
                }
            }
            // 排序
            downPaymentArr.sort(function(a, b) {
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
                if (downPaymentArr[i].text === _downPaymentDefault) {
                    if (!_downPaymentDisableArr[i]) {
                        $('.apply-btn').addClass('disabled');
                        $('#submit-btn').text('立即申请');
                    }else{
                        $('.apply-btn').removeClass('disabled');
                        $('#submit-btn').text('立即申请');
                    }
                }
            }

            // self.downPaymentObj = _downPaymentObj;
            if (self.downPaymentSlider) {
                self.downPaymentSlider.update(downPaymentArr);
            } else {
                let oldDownPaymentRate = 0;
                self.downPaymentSlider = new YXSliderClick($(self.downPaymentDom).attr('id'), downPaymentArr, function(value) {
                    if (self.isDownPaymentPeriodAjax) {
                        self.isDownPaymentPeriodAjax = false;
                        oldDownPaymentRate = self.downPaymentObj[parseInt(value.text) / 100].DownPaymentRate * 100;
                        detailViewModel.productId(self.downPaymentObj[parseInt(value.text) / 100].ProductID);
                        $('#orders').val(detailViewModel.packageId() + '_' + detailViewModel.productId() + '_0');
                        //选城市
                        // $.each(self.selCityHrefDom,function(idx,val){
                        //     let _href = $(this).attr("href");
                        //     let _hrefArr =  _href.split('/');
                        //     _hrefArr[5]='p'+ detailViewModel.productId();
                        //     $(this).attr("href",_hrefArr.join('/'));
                        // })
                        //车款
                        // $.each(self.selCarHrefDom,function(idx,val){
                        //     let _href = $(this).attr("href");
                        //     let _hrefArr =  _href.split('/');
                        //     _hrefArr[3]='p'+ detailViewModel.productId();
                        //     $(this).attr("href",_hrefArr.join('/'));
                        // })
                        //经销商
                        // $.each(self.selDealerHrefDom,function(idx,val){
                        //     let _href = $(this).attr("href");
                        //     let _hrefArr =  _href.split('/');
                        //     _hrefArr[3]='p'+  detailViewModel.productId();
                        //     $(this).attr("href",_hrefArr.join('/'));
                        // })
                        self.downPaymentPeriod();
                    } else {
                        self.getIndex(_downPaymentArr, oldDownPaymentRate, (i) => {
                            for (let j = 0; j < downPaymentArr.length; ++j) {
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
        var repaymentPeriodArr = []; // 数据数组
        // 提取数据
        for (var i in _repaymentRange) {
            if (repaymentPeriodArr.indexOf(_repaymentRange[i]) < 0 && i !== 'min' && i !== 'max') {
                repaymentPeriodArr.push(_repaymentRange[i]);
            }
        }
        // 排序
        repaymentPeriodArr.sort(function(a, b) {
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
        // console.log(_repaymentArr)
        if (self.repaymentPeriodSlider) {
            self.repaymentPeriodSlider.update(repaymentPeriodArr);
        } else {
            self.repaymentPeriodSlider = new YXSliderClick($(self.repaymentPeriodDom).attr('id'), repaymentPeriodArr, function(value) {
                let oldRepaymentPeriod = detailViewModel.repaymentPeriod();
                if (self.isDownPaymentPeriodAjax) {
                    self.isDownPaymentPeriodAjax = false;
                    oldRepaymentPeriod = self.repaymentObj[parseInt(value.text)].RepaymentPeriod;
                    // console.log(oldRepaymentPeriod)
                    detailViewModel.productId(self.repaymentObj[parseInt(value.text)].ProductID);
                    $('#orders').val(detailViewModel.packageId() + '_' + detailViewModel.productId() + '_0');
                    //选城市
                    // $.each(self.selCityHrefDom,function(idx,val){
                    //     let _href = $(this).attr("href");
                    //     let _hrefArr =  _href.split('/');
                    //     _hrefArr[5]='p'+ detailViewModel.productId();
                    //     $(this).attr("href",_hrefArr.join('/'));
                    // })
                    //车款
                    // $.each(self.selCarHrefDom,function(idx,val){
                    //     let _href = $(this).attr("href");
                    //     let _hrefArr =  _href.split('/');
                    //     _hrefArr[3]='p'+ detailViewModel.productId();
                    //     $(this).attr("href",_hrefArr.join('/'));
                    // })
                    //经销商
                    // $.each(self.selDealerHrefDom,function(idx,val){
                    //     let _href = $(this).attr("href");
                    //     let _hrefArr =  _href.split('/');
                    //     _hrefArr[3]='p'+  detailViewModel.productId();
                    //     $(this).attr("href",_hrefArr.join('/'));
                    // })
                    self.downPaymentPeriod();
                } else {
                    self.getIndex(_repaymentArr, oldRepaymentPeriod, (i) => {
                        for (let j = 0; j < repaymentPeriodArr.length; ++j) {
                            repaymentPeriodArr[j].isDefault = false;
                        }
                        repaymentPeriodArr[i].isDefault = true;
                        self.repaymentPeriodSlider.update(repaymentPeriodArr);
                    });
                    // console.log(oldRepaymentPeriod)
                    tools.showAlert("大侠手太快啦，等下再试试！");
                }
            });
        }

        // 保证金滑块
        if (_data.ProductSecurityDepositRates) {
            // todo :
            // console.log(_data.ProductSecurityDepositRates)
            //保证金数据
            _securityDepositRange.min = 0;
            _securityDepositRange.max = 100;
            if (_securityDepositLength == 1) {
                var _securityDepositTxt = _data.ProductSecurityDepositRates[0].SecurityDepositRate * 100; //保证金内容
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
                var _strHtmlIe8 = "",
                    _sliderCurPCT = "0%";

                var frontData = _data.ProductSecurityDepositRates[0].SecurityDepositRate * 100,
                    backData = _data.ProductSecurityDepositRates[1].SecurityDepositRate * 100,
                    sliderPCT = ['30%', '70%'];
                // _securityDepositRange['30%'] =frontData;
                // _securityDepositRange['70%'] =backData;

                $.each(_data.ProductSecurityDepositRates, function(index, val) {
                    var securityDepositTxt = val.SecurityDepositRate * 100 + "%", //首付内容
                        curClass = "";
                    if (detailViewModel.productId() == val.ProductID) {
                        curClass = "cur";
                        _securityDepositDefault = val.SecurityDepositRate * 100;
                        _sliderCurPCT = sliderPCT[index];
                    }

                    if (val.HasProduct) { //是否支持当前保证金
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
                var _strHtmlIe8 = "",
                    _sliderCurPCT = "0%",
                    _specialClassName = "";

                $.each(_data.ProductSecurityDepositRates, function(index, val) {

                    var sliderPCT = _sliderPCT3 * index + '%', //滑块百分比
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

                    if (val.HasProduct) { //是否支持当前保证金
                        _securityDepositRange[sliderPCT] = val.SecurityDepositRate * 100;
                        _securityDepositDefaultArr.push(val.SecurityDepositRate * 100);
                    } else {
                        curClass = "disabled";
                    }

                    var securityDepositTxt = val.SecurityDepositRate * 100 + "%"; //首付内容
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

            var securityDepositArr = []; // 数据数组
            // 提取数据
            for (var i in _securityDepositRange) {
                if (securityDepositArr.indexOf(_securityDepositRange[i]) < 0 && i !== 'min' && i !== 'max') {
                    securityDepositArr.push(_securityDepositRange[i]);
                }
            }
            // 排序
            securityDepositArr.sort(function(a, b) {
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
                self.securityDepositSlider = new YXSliderClick($(self.securityDepositDom).attr('id'), securityDepositArr, function(value) {
                    if (self.isDownPaymentPeriodAjax) {
                        self.isDownPaymentPeriodAjax = false;
                        oldSecurityDepositRate = self.securityDepositObj[parseInt(value.text) / 100].SecurityDepositRate * 100;
                        detailViewModel.productId(self.securityDepositObj[parseInt(value.text) / 100].ProductID);
                        $('#orders').val(detailViewModel.packageId() + '_' + detailViewModel.productId() + '_0');
                        //选城市
                        // $.each(self.selCityHrefDom,function(idx,val){
                        //     let _href = $(this).attr("href");
                        //     let _hrefArr =  _href.split('/');
                        //     _hrefArr[5]='p'+ detailViewModel.productId();
                        //     $(this).attr("href",_hrefArr.join('/'));
                        // })
                        //车款
                        // $.each(self.selCarHrefDom,function(idx,val){
                        //     let _href = $(this).attr("href");
                        //     let _hrefArr =  _href.split('/');
                        //     _hrefArr[3]='p'+ detailViewModel.productId();
                        //     $(this).attr("href",_hrefArr.join('/'));
                        // })
                        //经销商
                        // $.each(self.selDealerHrefDom,function(idx,val){
                        //     let _href = $(this).attr("href");
                        //     let _hrefArr =  _href.split('/');
                        //     _hrefArr[3]='p'+  detailViewModel.productId();
                        //     $(this).attr("href",_hrefArr.join('/'));
                        // })

                        self.downPaymentPeriod();
                    } else {
                        self.getIndex(_securityDepositArr, oldSecurityDepositRate, (i) => {
                            for (let j = 0; j < securityDepositArr.length; ++j) {
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
    },
    //IE8月供首付滑动条
    /*
     *html:滚轴html
     *id：id容器名
     *callbacks： 返回函数，返回值为停止位置数值
     */
    IE8Slider: function(html, id, callbacks) {
        var _domIE8 = $("#" + id);
        _domIE8.addClass('noUi-target noUi-ltr noUi-horizontal noUi-connect').html(html);

        _domIE8.off('click').on('click', '.noUi-event', function(e) {
            if (!$(this).hasClass('disabled')) {
                var idEvent = $(this).attr("data-id");
                var leftPos = $(this).css("left");
                _domIE8.next("ul").find("[data-id='" + idEvent + "']").addClass("cur").siblings("li").removeClass("cur");
                _domIE8.find(".noUi-origin").css('left', leftPos);
                callbacks(idEvent);
            }

        });
    },
    //通过车价和产品计算贷款信息
    loanInfo: function() {
        var self = this,
            _url = getCalculationInfoUrl + '?carPrice=' + car.carPrice + '&productId=' + detailViewModel.productId() + '&carId=' + car.carId;

        self.sendAjax({
            url: _url
        }, success, sendAgain);

        function success(res) {
            self.isDownPaymentPeriodAjax = true;
            if (res.Result) {
                let data = res.Data;
                var _downPayment = data.downPayment * 10000, // 首付
                    _loanAmount = data.loanAmount * 10000,
                    // _totalCost = data.totalCost * 10000,
                    _totalCost = Math.round((self.isPromotionExpired ? res.Data.promotionTotalCost : res.Data.totalCost) * 10000),
                    _monthlyPayment = data.monthlyPayment * 10000,
                    _promotionMonthlyPayment = res.Data.promotionMonthlyPayment * 10000,
                    _finalPaymentAmount = data.finalPaymentAmount * 10000,
                    _totalInterest = data.totalInterest * 10000,
                    _interestRate = res.Data.interestRate * 100,
                    _promotionInterestRate = res.Data.promotionInterestRate * 100,
                    _serviceFee = data.serviceFee * 10000,
                    _purchaseTax = data.purchaseTax * 10000,
                    _totalExpenses = detailViewModel.carPrice() * 10000 + _totalCost, // + _purchaseTax + 1450,
                    _isSecurityDeposit = (isDeposit === 'True') ? true : false,
                    _isFinalPaymentAmount = _finalPaymentAmount > 0 ? true : false,
                    _securityDeposit = _isSecurityDeposit ? data.securityDeposit * 10000 : 0, // 保证金
                    _LumpPayment = (isLumpPayment === 'True') ? _totalCost : 0, // 一次性付息
                    // _firstPayment = Math.round(_downPayment + _securityDeposit + _LumpPayment), // 首次支付 = 首付+保证金+一次性付息
                    _firstPayment = Math.round((res.Data.firstPayment + (self.isPromotionExpired ? res.Data.promotionTotalCost : res.Data.totalCost)) * 10000),
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
                detailViewModel.securityDepositRate((res.Data.securityDepositRate * 100).toString() + '%');
                //首次支付
                detailViewModel.firstPayment(tools.addCmma(_firstPayment));
                // detailViewModel.firstPayment(tools.addCmma(Math.round(res.Data.firstPayment * 10000)+Math.round(_totalCost)))
                detailViewModel.firstPaymentCount(self.changeNumber(_firstPayment / 10000));
                //首付金额
                detailViewModel.downPayment(tools.addCmma(_downPayment));
                detailViewModel.downPaymentCount(self.changeNumber(res.Data.downPayment));
                //首付比例
                detailViewModel.downPaymentRate((res.Data.downPaymentRate * 100).toString() + '%');
                //贷款金额
                detailViewModel.loanAmount(tools.addCmma(_loanAmount));
                //贷款成本
                detailViewModel.totalCost(tools.addCmma(_totalCost));
                detailViewModel.totalCostCount(self.changeNumber(self.isPromotionExpired ? res.Data.promotionTotalCost : res.Data.totalCost));
                //月供
                detailViewModel.monthlyPayment(self.isPromotionExpired ? tools.addCmma(_promotionMonthlyPayment) : tools.addCmma(_monthlyPayment));
                detailViewModel.monthlyPaymentCount(self.isPromotionExpired ? self.changeNumber(res.Data.promotionMonthlyPayment) : self.changeNumber(res.Data.monthlyPayment));
                detailViewModel.oldMonthlyPayment(tools.addCmma(_monthlyPayment));
                detailViewModel.oldMonthlyPaymentCount(self.changeNumber(res.Data.monthlyPayment));

                //贷款尾款
                detailViewModel.finalPaymentAmount(tools.addCmma(_finalPaymentAmount));
                detailViewModel.finalPaymentAmountCount(self.changeNumber(_finalPaymentAmount / 10000));
                detailViewModel.isFinalPaymentAmount(_isFinalPaymentAmount);
                //尾款比例
                detailViewModel.finalPaymentRate((res.Data.finalPaymentRate * 100).toString() + '%');
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
                if (self.isLumpPayment && _isSecurityDeposit) {
                    $('#DepositAndLump ul').addClass('all');
                }

                detailViewModel.hxmClassName(detailViewModel.isShowDownPayment() ? 'payment' : 'payment hxm');
                detailViewModel.subsidiaryClassName(_isShowFirstPayment && self.isPromotionExpired ? 'subsidiary mag0' : 'subsidiary')

                //首付，期限改变后修改 表格选中值
                $('.details-table-s').removeClass('details-table-s');
                $('[data-productid="' + detailViewModel.productId() + '"]').addClass('details-table-s');

                $('.confluence-right').show();
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
    changeNumber: function(numberName) {
        return numberName < 1 ? Math.round(numberName * 10000) + '元' : numberName.toFixed(2) + '万';
    },
    //渲染DOM及特效
    renderDom: function() {
        var self = this;

        //选择、资质下拉菜单事件
        $.each($("#Content .select-ctrl"), function(index, item) {
            $(item).selectControl(selCallBack, "click", "notRender");
        });
        //下拉菜单的返回方法
        function selCallBack(selDataId, selText, item) {
            // $(item).find('div').text(selText.split('|')[0]);
            let _href = window.location.search,
                _newhref = ''
            if (_href.indexOf('source') >= 0 || _href.indexOf('source') >= 0) {
                _newhref = '/sem/productdetail?carid=' + selDataId + '&cityid=' + city.cityId + '&serialid=' + tools.getUrlParam('serialid') + '&source=' + tools.getUrlParam('source') + '&from=' + tools.getUrlParam('from');
            } else {
                _newhref = '/sem/productdetail?carid=' + selDataId + '&cityid=' + city.cityId + '&serialid=' + tools.getUrlParam('serialid') + '&from=' + tools.getUrlParam('from');
            }
            window.location.href = _newhref
        }


        $(".scroll-photos .label p").each(function(index, item) {
            var rdm = index % 4;
            switch (rdm) {
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

        //选择城市
        $(".area-city-box").selCity({
            // loadCityUrl:APIURL +"/api/Common/GetSupportGroupingCityList?packageId="+product.packageID +"&carId="+car.carId,
            isRelationHeader: true
        });
        window.selCityCallback = function(obj) {
            $(".area-city-box .area-city-con").attr("data-id", obj.cityId).text(obj.cityName);
            $('#CityId').val(obj.cityId);
            let _href = window.location.search,
                _newhref = ''
            if (_href.indexOf('source') >= 0 || _href.indexOf('source') >= 0) {
                _newhref = '/sem/productdetail?carid=' + car.carId + '&cityid=' + obj.cityId + '&serialid=' + tools.getUrlParam('serialid') + '&source=' + tools.getUrlParam('source') + '&from=' + tools.getUrlParam('from');
            } else {
                _newhref = '/sem/productdetail?carid=' + car.carId + '&cityid=' + obj.cityId + '&serialid=' + tools.getUrlParam('serialid') + '&from=' + tools.getUrlParam('from');
            }
            window.location.href = _newhref
        };

        // 选择车款
        setTimeout(function() {
            $('#changeCar').selCar({
                IsOpenSearch: false,
                CallBacks: function(obj) {
                    // console.log(obj)
                    if (obj.returnType == "carType") {
                        let carName = obj.carType,
                            serialid = obj.carTypeId,
                            _newhref = '';
                        // $(".car-series font").text(carName);
                        let _href = window.location.search;
                        if (_href.indexOf('source') >= 0 || _href.indexOf('source') >= 0) {
                            _newhref = '/sem/productdetail?cityid=' + tools.getUrlParam('cityId') + '&serialid=' + serialid + '&source=' + tools.getUrlParam('source') + '&from=' + tools.getUrlParam('from');
                        } else {
                            _newhref = '/sem/productdetail?cityid=' + city.cityId + '&serialid=' + serialid + '&from=' + tools.getUrlParam('from');
                        }
                        // console.log(_newhref)
                        window.location.href = _newhref
                    }
                },
            });
        }, 1000)

        self.bindEvent();

    },

    //绑定事件
    bindEvent: function() {
        var self = this;

        //价格明细弹层
        $(".car-info").on('click', '.subsidiary', function(event) {
            event.preventDefault();
            self.maskLayer.show();
            self.totalCostLayer.removeClass('hide');
            self.totalCostLayer.css('margin-top', -self.totalCostLayer.height() / 2)
        });
        self.totalCostLayer.find(".close-layer").on('click', function(event) {
            event.preventDefault();
            self.maskLayer.hide();
            self.totalCostLayer.addClass('hide');
        });

        //保证金等鼠标滑过特效
        $(".car-info .bond-box font,.gift-group .tip-box").hover(
            function() {
                $(this).siblings(".tipText").stop().fadeIn();
            },
            function() {
                $(this).siblings(".tipText").stop().fadeOut();
            }
        );
        $(".ut-d").hover(function() {
            $(this).parent(".apply-det").prev(".CommonRequirementType-tip").stop().fadeIn();
        }, function() {
            $(this).parent(".apply-det").prev(".CommonRequirementType-tip").stop().fadeOut();
        });
    },
    add0: function(m) {
        return m < 10 ? '0' + m : m
    },
    formatTime: function(shijianchuo) {
        var self = this;
        //time是整数，否则要parseInt转换
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        return y + '-' + self.add0(m) + '-' + self.add0(d);
    },
    formFunction: function() {
        let self = this;
        let u_name = $('#Name'),
            u_id = $('#CertificateNumber'),
            tel = $('#Telephone'),
            code = $('#ValidateCode'),
            yycode = $('.yy-box'),
            getcode = $('#GetValidateCodeBtn'),
            codebox = $('.row-code'),
            codeIsTrue = false;

        if (isAuthenticated == 'true') {
            u_name.val(showUserName);
            self.hideErrorMsg(u_name);
            u_id.val(idNumber);
            self.hideErrorMsg(u_id);

        }
        if (isLogined == 'true') {
            tel.val(showMobile);
            getcode.hide();
            yycode.hide();
            codebox.hide();
            code.parent().hide();
            codebox.next('.yzts').hide();
            code.val('****');
            self.hideErrorMsg(tel);
            self.hideErrorMsg(code);
        }
        tel.on('change', () => {
            if (isLogined == 'true') {
                if (isAuthenticated == 'true') {
                    u_name.val('');
                    u_id.val('');
                    isAuthenticated = 'false';
                }
                changeValueEvent();
            }
        })
        u_name.on('change', () => {
            if (isAuthenticated == 'true') {
                u_id.val('');
                isAuthenticated = 'false';
            }
            if (isLogined == 'true') {
                tel.val('');
                changeValueEvent();
            }
        })
        u_id.on('change', () => {
            if (isAuthenticated == 'true') {
                u_name.val('');
                isAuthenticated = 'false';
            }
            if (isLogined == 'true') {
                tel.val('');
                changeValueEvent();
            }

        })
        var changeValueEvent = function() {
            code.val('');
            yycode.show();
            codebox.show();
            codebox.next('.yzts').show();
            getcode.css('display', 'inline-block');
            code.parent().css('display', 'inline-block');
            isLogined = 'false';

        };

        // 获取验证码
        var telElem = $('#Telephone');
        var vcElem = $('#ValidateCode');
        var isClick = false;
        $('#GetValidateCodeBtn').on('click', function(e) {
            e.preventDefault();
            var telval = $.trim(telElem.val());
            if (!telval || !check.isPhoneNumber(telval)) {
                self.showErrorMsg(telElem);
            } else {
                // self.hideErrorMsg(telElem);
                check.getCode(60, 'Telephone', 'GetValidateCodeBtn', '', false, false);
                $('#ValidateCode').focus();
            }
        });

        $('#GetValidateCodeLink').on('click', function(e) {
            if (isClick) {
                tools.showAlert('请60S后在尝试。');
                return;
            }

            e.preventDefault();
            var telval = $.trim(telElem.val());
            if (!telval || !check.isPhoneNumber(telval)) {
                self.showErrorMsg(telElem);
            } else {
                // self.hideErrorMsg(telElem);
                var params = { mobile: telval, line: '550', codelen: 4 }
                var token = $('input[name=__RequestVerificationToken]').val() || $('input[name=__RequestVerificationToken]').data('id')
                if (token) {
                    params.__RequestVerificationToken = token
                }
                $.ajax({
                    url: VOICE_CODE_GETTING_URL,
                    type: 'POST',
                    data: params,
                    success: (res) => {
                        if (res.Result) {
                            isClick = true;
                            $('#GetValidateCodeLink').css({ 'color': '#999', 'cursor': 'Auto' })
                            setTimeout(() => {
                                isClick = false;
                                $('#GetValidateCodeLink').css({ 'color': '#5a67ae', 'cursor': 'pointer' })
                            }, 60000)
                        } else {
                            tools.showAlert(res.Message);
                        }

                    }
                });
                $('#ValidateCode').focus();
            }
        });
        $('input').focus(function() {
                self.hideErrorMsg($(this));
            })
            // input失去焦点校验
        $('input.checked').blur(function() {
            let val = $.trim($(this).val()),
                _id = $(this).attr('id');
            if (val === "") {
                if (!$('#' + _id).is(":hidden")) {
                    self.showErrorMsg($('#' + _id));
                }
            } else {
                switch (_id) {
                    case 'Telephone':
                        if (showMobile != '' && val == showMobile) {
                            self.hideErrorMsg(telElem);
                            return;
                        }
                        if (!check.isPhoneNumber(val)) {
                            self.showErrorMsg(telElem);
                        } else {
                            //添加埋点
                            // try {
                            //     bc.evt.send('mobile', 'mobblur', val);
                            // } catch (err) {}

                            self.hideErrorMsg(telElem);
                        }
                        break;
                    case 'Name':
                        if (showUserName != '' && val == showUserName) {
                            self.hideErrorMsg(telElem);
                            return;
                        }
                        if (!check.isName($.trim(val))) {
                            self.showErrorMsg($(this));
                        } else {
                            self.hideErrorMsg($(this));
                        }
                        break;
                    case 'CertificateNumber':
                        if (idNumber != '' && val == idNumber) {
                            self.hideErrorMsg(telElem);
                            return;
                        }
                        if (!check.isID(val)) {
                            self.showErrorMsg($(this));
                        } else {
                            self.hideErrorMsg($(this));
                        }
                        break;
                    case 'ValidateCode':
                        if (showMobile != '' && $('#Telephone').val() == showMobile) {
                            self.hideErrorMsg(telElem);
                            codeIsTrue = false;
                            return;
                        } else {
                            codeIsTrue = true;
                            self.hideErrorMsg(vcElem);
                        }
                        // check.checkCode($.trim($('#ValidateCode').val()), 'Telephone', '', function(data) {
                        //     if (!data.Result) {
                        //         codeIsTrue = false;
                        //         self.showErrorMsg(vcElem);
                        //     } else {
                        //         codeIsTrue = true;
                        //         self.hideErrorMsg(vcElem);
                        //     }
                        // });
                        break;
                }
            }
        });

        // 提交表单
        $('#submit-btn').click(function(e) {
            e.preventDefault();
            if ($('#submit-btn').hasClass('disabled')) {
                return;
            }
            $('input.checked').trigger('blur');

            $('.selected').each(function() {
                    let _val = $(this).text(),
                        _id = $(this).attr('id');
                    _val.indexOf('请选择') >= 0 ? self.showErrorMsg($('#' + _id)) : self.hideErrorMsg($('#' + _id))

                })
                //提交
            let _data = {},
                userName = $('#Name'),
                userID = $('#CertificateNumber');
            if (userName[0] && userName.val() != showUserName) {
                if (!check.isName($.trim(userName.val()))) {
                    self.showErrorMsg(userName);
                    return;
                } else {
                    self.hideErrorMsg(userName);
                }
            }
            if (userID[0] && userID.val() != idNumber) {
                if (!check.isID(userID.val())) {
                    self.showErrorMsg(userID);
                    return;
                } else {
                    self.hideErrorMsg(userID);
                }
            }
            // setTimeout(function(){
            if ($('.row-code').css('display') === 'none') {
                codeIsTrue = true
            }
            if (codeIsTrue && $('.yzts.show').length <= 0) {
                $('#form input').each(function() {
                        if ($(this).val().indexOf('*') == -1)
                            $(this).attr('name') == 'CertificateNumber' ? _data[$(this).attr('name')] = aes.encrypt($(this).val()) : _data[$(this).attr('name')] = $(this).val()
                    })
                    // console.log(_data)
                $('#submit-btn').addClass('disabled');
                tools.$ajax({
                    type: 'POST',
                    url: AddOrder,
                    data: _data,
                    success: function(res) {
                        if (res.Result) {
                            // try {
                            //     //添加埋点
                            //     bc.evt.send('mobile', 'sbtclk', $("#Telephone").val(), '1', '极速贷款PC订单提交成功')
                            // } catch (err) {}
                            location.href = res.Data;
                        } else {
                            // try {
                            //     //添加埋点
                            //     bc.evt.send('mobile', 'sbtclk', $('#Telephone').val(), '0', '极速贷款PC订单提交失败 原因' + res.Message)
                            // } catch (err) {}

                            tools.showAlert(res.Message);
                            $('#submit-btn').removeClass('disabled');
                        }
                    }
                });
            }
            // }, 300)
        });
    },
    showErrorMsg: function(elem) {
        elem.parents('.input-box').addClass('show').parents('.row').next('.yzts').addClass('show');
    },

    hideErrorMsg: function(elem) {
        elem.parents('.input-box').removeClass('show').parents('.row').next('.yzts').removeClass('show');
    },

    //ajax
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
            beforeSend: function() {},
            success: function(res) {
                _callback(res);
            },
            complete: function(XMLHttpRequest, textStatus) {
                if (status == 'timeout') { //超时,status还有success,error等值的情况
                    _errorcallback(textStatus);
                }
            }
        })
    }
};

$(function() {
    var scrollTop = $('#Content').offset().top;
    $(window).scrollTop(scrollTop);

    var detailPage = new DetailPage();
    detailPage.init();
});