import './index.scss';

import ko from 'knockout';
import selCity from 'libs/citySelect';
import selCar from 'libs/carSelect';
import 'libs/selectControl';
import check from 'libs/check/m';

var CreditCardLoanViewModel = {
    // 选城市
    ProvinceArr: ko.observableArray(),  // 省份
    CityArr: ko.observableArray(),      // 城市
    CityId: ko.observable(),            // 城市 ID
    CityName: ko.observable(),          // 城市名
    // 选车
    BrandsArr: ko.observableArray(),    // 品牌
    SerialsArr: ko.observableArray(),   // 车系
    CarsArr: ko.observableArray(),      // 车款

    // 表单
    CltName: ko.observable(''),         // 用户姓名
    CltMobile: ko.observable(''),       // 用户手机号
    CarId: ko.observable(''),           // 车 ID
    CarPrice: ko.observable(''),        // 车价格
    CarFullName: ko.observable(''),      // 车全名
    IntentTime: ko.observable(''),      // 意向购车时间

    CarRatio: ko.observable(''),        // 首付比率
    CarRatioValue: ko.observable(''),        // 首付比率

    CarTerm: ko.observable(''),         // 贷款期限
    CarLocation: ko.observable('201'),   // 牌照所在地
    CardPeriod: ko.observable(''),         //持卡年限
    CardType: ko.observable(''),           //持卡类型
    IsHaveCarMasterCard: ko.observable(''),     //是否有车主卡

    CreditCardNumber: ko.observable(''),   //信用卡号码

    CreditCardIntentTimeOfPhoneValue: ko.observable(''),
    CreditCardIntentTimeOfPhone: ko.observable(''),
    CompanyID: ko.observable('')
};


//页面加载执行
$(function () {
    // 绑定视图
    ko.applyBindings(CreditCardLoanViewModel);
    //城市 默认值
    CreditCardLoanViewModel.CityId(localCity.CityId);
    CreditCardLoanViewModel.CityName(localCity.CityName);

    CreditCardLoanViewModel.CarRatio("30%");
    CreditCardLoanViewModel.CarRatioValue("0.3");

    CreditCardLoanViewModel.CreditCardIntentTimeOfPhone("任意时间");
    CreditCardLoanViewModel.CreditCardIntentTimeOfPhoneValue("345");


    $("#form").prepend('<input type="hidden" name="From" value="' + (tools.getCookie("from") ? tools.getCookie("from") : "") + '" />');

    var creditCardLoan = new CreditCardLoan();

    /* ================== 选车控件 start ================== */

    $('#SelCarTrigger').on('click', function (e) {
        e.preventDefault();
        var self = this;
        selCar.carSelect({
            onlyOnSale: true,
            showLevel: 3,
            showAllBrand: false,
            showSearch: false,
            hide: true
            // showHotCar:true
        }, function (result) {
            var fullName;
            if (result.brand.name.indexOf(result.brand.masterBrandName) < 0) {
                fullName = result.brand.masterBrandName + " " + result.brand.name + " -" + result.carType.name;
            } else {
                fullName = result.brand.name + " -" + result.carType.name;
            }
            CreditCardLoanViewModel.CarId(result.carType.id);
            CreditCardLoanViewModel.CarPrice(result.carType.price);
            CreditCardLoanViewModel.CarFullName(fullName);
            $('#SelCarTrigger span').text(fullName).addClass('active').attr({ 'data-id': result.carType.id, 'data-year': result.year });
            $('#SelCarTrigger').parents('li').next('.xqtis').hide();
            creditCardLoan.CalculateCarRatio(CreditCardLoanViewModel.CarPrice());
        });
    });

    //选城市
    $('#CityTrigger').on('click', function (e) {
        e.preventDefault();
        var self = this;
        selCity.citySelect({

        }, function (result) {
            // $('#CityValidata').hide();
            // $(self).find('span').text(result.CityName);
            // $('#dataCity').text(result.CityName); // 对话框赋值
            // data.BuyCarCityID = result.CityId;
            // data.CityId = result.CityId;
            // console.log(result);
            CreditCardLoanViewModel.CityId(result.CityId);
            CreditCardLoanViewModel.CityName(result.CityName);
            CreditCardLoanViewModel.CarLocation(result.CityId);
        });
    });

    $(".triggerEvent").selectControl({
        CallBacks: function (result) {
            $('#' + $(result.item).data('inputid')).val(result.id);
            var txt;
            if ($(result.item).attr('id') == "RatioTrigger") {
                txt = (result.id * 100) + "%" + " (首付<span style='color:#c00!important;float:none;width:auto;display:inline;margin:0'>" + Math.round((CreditCardLoanViewModel.CarPrice() * result.id) * 100) / 100 + "</span>万)";
            } else {
                txt = result.txt;
            }
            $(result.item).find('span').addClass('active').data("id", result.id).html(txt).parents('li').next('.xqtis').hide();
        }
    });

    var $creditCardNumber = $('#CreditCardNumber'), _creditCardNumber = $creditCardNumber.val().trim();
    $creditCardNumber.on('change keyup blur', function () {

        if (!check.isCreditCard($('#CreditCardNumber').val())) {

            $("#liCreditCardNumber").text("请输入正确信用卡号");
            $("#liCreditCardNumber").show();
            return;
        } else {

            $("#liCreditCardNumber").hide();
        }
    });

    $("#returnPrev").on("click", function () {

        var array = ["#step1", "#step2", "#step3"];

        for (var i = 0; i < array.length; i++) {

            if ($(array[i]).parents(".divStep").css("display") == "block") {

                if (i == 1) {

                    $("#step1").parents('.divStep').show();
                    $("#step2").parents('.divStep').hide();
                    $("#step3").parents('.divStep').hide();

                } else if (i == 2) {

                    $("#step2").parents('.divStep').show();
                    $("#step3").parents('.divStep').hide();
                    $("#step1").parents('.divStep').hide();

                } else {
                    window.history.back();
                }
            }
        }

    });

    //点击第一步操作
    $('#step1').on('click', function () {

        if (creditCardLoan.ValidateStepOne()) {

            $(this).parents('.divStep').hide().next('.divStep').show();

            $.ajax({
                url: GetCompanybyCardNumber,
                type: 'POST',
                data: { cardNumber: $("#CreditCardNumber").val() },
                success: function (res) {

                    if (res.target) {

                        var num = $("#CreditCardNumber").val();

                        if (num.length > 4) {
                            num = num.substr(num.length - 4, 4);
                        }

                        $(".logo img").attr("src", res.LogoImage).attr("title", res.ShortCName);
                        $(".title1").html(res.ShortCName);
                        $(".title2").html("尾号：" + num);
                        CreditCardLoanViewModel.CompanyID(res.companyID);
                        $("#creditcard").show();

                    } else {

                        $("#creditcard").hide();
                    }

                }
            });
        }
    });

    //点击第二步操作
    $('#step2').on('click', function () {

        if (creditCardLoan.ValidateStepTwo()) {

            $(this).parents('.divStep').hide().next('.divStep').show();
        }
    });


    $("#Telphone").on('blur', function () {
        try {
            if (check.isPhoneNumber($("#Telphone").val())) {
                //添加埋点
                bc.evt.send('mobile', 'mobblur', $("#Telphone").val())
            }
        }
        catch (err) { }

    })
    $("#GetValidateCodeBtn").click(function () {
        if ($(this).hasClass("disable"))
            return;
        if (check.isPhoneNumber($("#Telphone").val())) {
            //添加埋点
            try {
                bc.evt.send('mobile', 'codeclk', $("#Telphone").val())
            }
            catch (err) { }
            $('#liTelphone').hide();
            $.ajax({
                url: CODE_GETTING_URL,
                type: 'POST',
                data: { codelen:4, mobile: ($("#Telphone").text() == "" ? $("#Telphone").val() : $("#Telphone").text()), __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val() }
            });
            var n = 50;
            if ($("#GetValidateCodeBtn").attr("data-Seconds")) {

                n = parseInt($("#GetValidateCodeBtn").data("seconds"));
                var detail = $("#GetValidateCodeBtn").data("detail");

                $("#GetValidateCodeBtn").addClass("disable").text(n + detail);
                var tmo = setInterval(function () {
                    if (--n == 0) {
                        clearInterval(tmo);
                        $("#GetValidateCodeBtn").removeClass("disable").text("获取校验码");
                        return;
                    }
                    $("#GetValidateCodeBtn").text(n + detail);
                }, 1000);
            } else {
                $("#GetValidateCodeBtn").addClass("disable").text(n + "秒后获取");
                var tmo = setInterval(function () {
                    if (--n == 0) {
                        clearInterval(tmo);
                        $("#GetValidateCodeBtn").removeClass("disable").text("获取校验码");
                        return;
                    }
                    $("#GetValidateCodeBtn").text(n + "秒后获取");
                }, 1000);
            }
        } else {
            $('#liTelphone').show();
        }
    });

    //点击第三步操作
    $('#step3').on('click', function () {
        // $("#form").submit();
        if (SubmitCheck() && creditCardLoan.ValidateStepThree()) {
            $.ajax({
                url: CODE_VALIDATING_URL,
                type: 'POST',
                data: { mobile: $("#Telphone").val(), validatecode: $("#ValidateCode").val() },
                success: function (res) {
                    if (res.Result) {
                        $(".loadingCtn").removeClass("hide");
                        $("#form").submit();
                        try {
                            //添加埋点
                            bc.evt.send('mobile', 'sbtclk', $("#Telphone").val(), '1', '信用卡直通M订单提交成功')
                        } catch (err) { }

                    } else {
                        $("#ValidateCode").parents("li").next(".xqtis").text(res.Message).show();
                        try {
                            //添加埋点
                            bc.evt.send('mobile', 'sbtclk', $("#Telphone").val(), '0', '信用卡直通M订单提交失败 原因' + result.Message)
                        }catch (err) { }



                    }
                }
            });
        }
    });

});


function CreditCardLoan() {

    this.ValidateStepOne = function () {

        var isSuccess = true;

        var creditCardNumber = $("#CreditCardNumber").val();

        var carId = CreditCardLoanViewModel.CarId();

        var buyCarLimit = $("#IntentTime").val();   // CreditCardLoanViewModel.IntentTime();
        var carRatio = $("#Ratio").val();           //CreditCardLoanViewModel.CarRatio();
        var carPeriod = $("#Period").val();         //CreditCardLoanViewModel.CarTerm();


        if (!$("#liCreditCardNumber").css("display") == "none") {
            isSuccess = false;
            $("#liCreditCardNumber").show();
        }

        if (carId == "") {
            $("#liCar").show();
            isSuccess = false;
        } else {
            $("#liCar").hide();
        }

        //购车时间
        if (buyCarLimit == "") {
            $("#liTime").show();
            isSuccess = false;
        } else {
            $("#liTime").hide();
        }

        //首付比例
        if (carRatio == "") {
            $("#liRatio").show();
            isSuccess = false;
        } else {
            $("#liRatio").hide();
        }

        //贷款期限
        if (carPeriod == "") {
            $("#liPeriod").show();
            isSuccess = false;
        } else {
            $("#liPeriod").hide();
        }

        if (!check.isCreditCard($('#CreditCardNumber').val())) {
            $("#liCreditCardNumber").show();
            isSuccess = false;
        } else {
            $("#liCreditCardNumber").hide();
        }

        return isSuccess;
    };

    this.ValidateStepTwo = function () {

        var isSuccess = true;

        var cardPeriod = $("#CardPeriod").val();   // CreditCardLoanViewModel.IntentTime();
        var cardType = $("#CardType").val();           //CreditCardLoanViewModel.CarRatio();
        var isHaveCarMasterCard = $("#IsHaveCarOwnerCard").val();         //CreditCardLoanViewModel.CarTerm();

        //持卡年限
        if (cardPeriod == "") {
            $("#liCardPeriod").show();
            isSuccess = false;
        } else {
            $("#liCardPeriod").hide();
        }

        if (cardType == "") {
            $("#liCardType").show();
            isSuccess = false;
        } else {
            $("#liCardType").hide();
        }

        //console.log(isHaveCarMasterCard);

        //是否有车主卡
        if (isHaveCarMasterCard == "") {
            $("#liIsHaveCarOwnerCard").show();
            isSuccess = false;
        } else {
            $("#liIsHaveCarOwnerCard").hide();
        }

        return isSuccess;
    };



    //检查性别
    this.ValidateStepThree = function () {

        var gender = $("#Gender").val();

        var isSuccess = true;

        //首付比例
        if (gender == "") {
            $("#liGender").show();
            isSuccess = false;
        } else {
            $("#liGender").hide();
        }

        return isSuccess;
    };

    //计算首付价格
    this.CalculateCarRatio = function (price) {

        $("#RatioCtn ul li").each(function (index, item) {

            var $ratio = $(item).find("a"),
                ratio = $ratio.data("id");

            $ratio.find("span").html("(首付<span style='color:#c00!important;'>" + Math.round((price * ratio) * 100) / 100 + "</span>万)");
        });

        //如果已经选择了首付比例。
        var r = CreditCardLoanViewModel.CarRatioValue();
        CreditCardLoanViewModel.CarRatio((r * 100) + "%" + " (首付<span style='color:#c00!important;float:none;width:auto;display:inline;margin:0'>" + Math.round((price * r) * 100) / 100 + "</span>万)");


        //显示参考价格
        var $liCarPrice = $("#divCarPrice");
        $liCarPrice.show().html("参考成交价：<span style='color:#c00!important;'>" + price + "</span>万").prev().css("border", 0);
    }
}

function SubmitCheck() {
    var flag = false;
    $(".checkApp input,textarea").blur();
    $(".checkApp .checkChose").each(function () {
        var $li = $(this).parents('li');
        if (!$(this).hasClass("active") && $li.css("display") != "none") {
            flag = true;
            $li.next('.xqtis').show().removeClass("hide");
            return;
        }
    });
    $(".xqtis").each(function () {
        if (!($(this).css("display") == "none")) {
            flag = true;
            return;
        }
    });
    return !flag;
}