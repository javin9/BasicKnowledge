import '../list/list.scss';
import 'zepto/src/touch'
import ko from 'knockout';
import 'chart.js';

import selectControl from 'libs/selectControl';


    var ctx = document.getElementById("myChart").getContext("2d");

    var config = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [
                    totalCost,//总成本
                    loanMoney * 10000,//贷款
                ],
                backgroundColor: [
                    "#dbb76c",//总成本
                    "#516393",//贷款
                ],
                label: 'Dataset 1'
            }],
            labels: []
        },
        options: {
            responsive: true,
            cutoutPercentage: 40,
            //Function - Will fire on animation completion.
            onAnimationComplete: function () { },
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
            tooltips:{
                enabled: false
            }

        }
    };

  var myDoughnut = new Chart(ctx, config);

    var ApplyViewModel = {
        // 产品信息
        ProductCount: ko.observableArray()//所选产品
    }
    var LoginBox = $(".login-box"),//加载中
        ListPBox = $(".com-ctn"); //列表内容
var detail={
        init: function () {
            ko.applyBindings(ApplyViewModel);
            this.domInit();
        },
        domInit: function () {
            var self = this;
            if (urlParams.orderId != null && urlParams.orderId != 0)
            {
                $('#backA').attr("href", document.referrer.indexOf('&backofDetail')>0 ? document.referrer : document.referrer+ '&backofDetail=true');
            }
            //下拉
            $(".select-con").selectControl({
                CallBacks: function (obj) {
                    $(".select-con").text(obj.txt).data('id', obj.id);
                    if (obj.id == '0') {
                        $(".refund-area").removeClass("hide");
                    } else {
                        $(".refund-area").addClass("hide");
                    }

                    var relJson = eval(loanRelJson);
                    for (var item in relJson) {
                        if (relJson[item].LoanPeriod == obj.id) {
                            var promotionHtml = (relJson[item].Discount != 0 ? '<span class="label dail-label font-22">折扣</span>' : '') + (relJson[item].IsPromotion ? '<span class="label dail-label font-22">' + relJson[item].PromotionTitle + '</span>' : '');
                            var $spanPro = $('#promotionHtml');
                            $spanPro.empty();
                            $spanPro.append(promotionHtml);
                            $('#monthPay').text((relJson[item].MonthPayment < 10000) ? relJson[item].MonthPayment.toFixed(0) + ' 元' : (relJson[item].MonthPayment/10000).toFixed(2) + ' 万');
                            //$('#monthRate').text(relJson[item].MonthRate.toFixed(2) + ' %');
                            $('#totalCost').text((relJson[item].TotalMoney / 10000).toFixed(2) + ' 万');
                            //刷新饼图 总成本  贷款金额不会变化

                            var config2 =
                                {
                                    type: 'doughnut',
                                    data: {
                                        datasets: [{
                                            data: [
                                                relJson[item].TotalMoney,//总成本
                                                loanMoney * 10000,//贷款
                                            ],
                                            backgroundColor: [
                                                "#dbb76c",//总成本
                                                "#516393",//贷款
                                            ],
                                            label: 'Dataset 1'
                                        }],
                                        labels: []
                                    },
                                    options: {
                                        responsive: true,
                                        cutoutPercentage: 40,
                                        animation: {
                                            animateScale: true,
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
                                        tooltips:{
                                            enabled: false
                                        }
                                    }
                                };

                            myDoughnut.config = config2;
                            myDoughnut.update();
                        }
                    }
                }
            });

            //立即申请
            $('#rplay').tap(function () {

                var orderId = urlParams.orderId;
                var data = new Object();
                data['Source'] = parseInt(urlParams.source);
                var relJson = eval(loanRelJson);
                var recommendProductID,loanperiod, loanrate, discountrate, monthpay, totalmoney;
                for (var item in relJson) {
                    if (relJson[item].LoanPeriod == $(".select-con").attr('data-id')) {
                        recommendProductID = relJson[item].RecommendProductID;
                        loanperiod = relJson[item].LoanPeriod;
                        loanrate = relJson[item].LoanRate;
                        discountrate = relJson[item].TotalDiscount;
                        monthpay = relJson[item].MonthPayment;
                        totalmoney = relJson[item].TotalMoney;
                        break;
                    }
                }
                var from = "";
                if (tools.getCookie('from')) {
                    from = tools.getCookie('from')
                }else if(tools.getUrlParam('from')){
                    from = tools.getUrlParam('from')
                }

                data['Extensions[0]'] = {
                    'RecommendProductID':recommendProductID,
                    'ProductId': parseInt(urlParams.pid),
                    'LoanPeriod': loanperiod,
                    'LoanRate': loanrate,
                    'DiscountRate': discountrate,
                    'MonthPay': monthpay,
                    'TotalMoney': totalmoney,
                    'CompanyID': $('.car-name').attr('data-id')
                };
                data['From'] = from;//外部渠道 从cookie取找前端要
                data['CarID'] = urlParams.carId;
                data['LicenseCityID'] = urlParams.licenseCityID;
                data['LicenseYear'] = urlParams.licenseYear;
                data['LicenseMonth'] = urlParams.licenseMonth;
                data['TenThousandKilometres'] = urlParams.mileage;

                if (orderId == 0) {
                    var json_data = JSON.stringify(data);
                    tools.setCookie("OrderData", json_data + '|');
                    window.location.href = "/Mortgage/Register";
                    return;
                } else {
                    data['OrderID'] = orderId;
                    tools.$ajax({
                        url: '/Mortgage/ApplyAgain',
                        data: { 'order': data },
                        success: function (res) {
                            if (!res.Result) {
                                if (res.RowCount == -1 || res.RowCount == -2 || res.RowCount == 0) {
                                    return tools.showAlert(res.Message);
                                }
                            } else {
                                $(".detail-ctn").addClass("hide");
                                $(".result-ctn").removeClass("hide");
                                $(".msg_form, .h-btn, .com-ctn, .res_txt").addClass("hide");
                                $(".u_wrap").removeClass("hide");
                                var addOrderId = res.Data.OrderID;
                                $(".res_tit span").html(res.Data.LoanAmount.toFixed(2) + '万');
                                if (urlParams.pid) {
                                    //已选择过金融产品
                                    tools.$ajax({
                                        url: '/Mortgage/SelectSingleViewProduct?orderId=' + addOrderId,
                                        type: 'Get',
                                        success: function (res1) {
                                            if (!res1.Result) {
                                                return tools.showAlert(res1.Message);
                                            }

                                            //数据处理
                                            var rdata1 = res1.Data;
                                            var proData = {
                                                Logo: CDNFileURL + rdata1.Logo,
                                                ProductName: rdata1.ProductName,
                                                promotionHtml: (rdata1.Discount != 0 ? '<span class="label font-22">折扣</span>' : '') + (rdata1.IsPromotion ? '<span class="label font-22">' + rdata1.PromotionTitle + '</span>' : ''),
                                                MonthPayment: rdata1.MonthPayment < 10000 ? Math.round(rdata1.MonthPayment) + '元' : (rdata1.MonthPayment / 10000.00).toFixed(2) + "万",
                                                MonthRate: rdata1.MonthRate ? rdata1.MonthRate.toFixed(2) + "%" : '0%',
                                                TotalMoney: rdata1.TotalMoney ? (rdata1.TotalMoney / 10000.00).toFixed(2) + "万" : '0元'
                                            }
                                            ApplyViewModel.ProductCount.push(proData);

                                            $(".success_box, .u_wrap").removeClass("hide");

                                            // 出applyBoxFour
                                            $('#applyBoxThree').addClass('hide');
                                            $('#applyBoxFour').removeClass('hide');
                                            $('.header-bar .font-nav').text('审核结果');
                                        }
                                    })

                                }
                            }

                        }
                    })
                }
            })

            $("#backToMain").tap(function () {
                if(tools.getCookie("YiXinAppInfo")){
                    tools.jsNativeBridge("backCZDHome","goHome");
                }else{
                    location.href = '/' + city.CitySpell;
                }
            })
        }

    }
detail.init();