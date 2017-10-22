import './gmac.scss'
import check from 'libs/check'  
import 'libs/selectControl' 
import '../libs/gauge'


/*APP判断*/
var isApp = tools.getCookie("YiXinAppInfo");
if(isApp){
    $(".header-bar").addClass('no-after');
}else{
    $(".header-bar").removeClass('no-after');
}

var Qualification = {
    fontBtn: $(".submit-form"),
    checkName:false,
    serviceProvision: $(".form-box footer i"),
    secviceInsurance: $(".sec_insurance i"),
    formQ: $("#formQ"),
    assessmentBox: $(".assessment-box"),
    dataApproveQuota: "",
    dataIsHavingDeposit: false,
    allSel: {},
    selObj: {},
    init: function () {
        var self = this;

        // 初始化默认数据和控件
        $(".sel-control-box").find("li:first-child").addClass('cur').siblings('li').removeClass('cur');

        // self.chkFull();
        self.bindEvent();
    },
    bindEvent: function () {
        var self = this;

        $(".header-bar>a").on("click", function () {
            if (document.referrer.indexOf("/login/index") >= 0) {
                window.history.go(-2);
                return false;
            } else {
                window.history.go(-1);
                return false;
            }
        });

        //选择
        $(".select-con").selectControl({
            CallBacks: function (obj) {
                var _itemId = $(obj.item).attr("id");

                $(obj.item).next('.warning').hide();
                $(obj.item).find("span").data("id", obj.id).text(obj.txt);
                self.allSel[_itemId] = 1;
                self.selObj[_itemId] = obj.id;

                // self.chkFull();
            }
        });
        $(".form-box").on("click", ".sec_insurance i, .sec_insurance span, .authorization03, footer i,footer span, .authorization01,.authorization02,.submit-form", function (e) {              
            if ($(this).is("footer span") || $(this).is("footer i")) {
                if (self.serviceProvision.hasClass('cur')) {
                    self.serviceProvision.removeClass('cur');
                } else {
                    self.serviceProvision.addClass('cur');
                }
            } else if ($(this).is(".authorization01")) {
                tools.serviceProvision({
                    "url": "/home/PersonalCreditAuthorization",
                    "title": "个人征信授权书"
                });
            } else if ($(this).is(".authorization02")) {
                tools.serviceProvision({
                    "url": "/home/InfoUsingAuthorization",
                    "title": "信息使用授权书"
                });
            } else if ($(this).is(".submit-form.cur") && self.chkFull() ) {
                if ( self.serviceProvision.hasClass('cur')&& !self.serviceProvision.hasClass('disabled')) {
                    self.serviceProvision.addClass('disabled');
                    self.jumpJudgment();
                } else {
                    tools.showAlert("请阅读同意服务条款");
                }
            } else if( $(this).is(".sec_insurance i") || $(this).is(".sec_insurance span") ){
                if(Qualification.secviceInsurance.hasClass('cur')){
                    Qualification.secviceInsurance.removeClass('cur');
                    $("input[name='IsSelectedInsurance']").val('false');
                }else{
                    Qualification.secviceInsurance.addClass('cur');
                    $("input[name='IsSelectedInsurance']").val('true');
                }
            } else if( $(this).is(".authorization03") ){
                var _insuranceCompanyName = $('input[name="InsuranceCompanyName"]').val();
                if( _insuranceCompanyName == 'syzx' ){
                    tools.setCookie('InsComp', '2');
                } else {
                    tools.setCookie('InsComp', '1');
                }
                tools.serviceProvision({
                    "url":"/home/AccidentInsurance", 
                    "title":"100万出行意外险说明"
                });
            }
        });

        function hengshuping() {
            self.location.reload();
            //   if(window.orientation==180||window.orientation==0){ 
            //         alert("竖屏状态！")        
            //    } 
            // if(window.orientation==90||window.orientation==-90){ 
            //         alert("横屏状态！")         
            //     } 
        }
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", hengshuping, false);
    },
    chkFull: function(){
        var self = this;
        var username=$("#UserName input").val();
        if(!check.isName(username)){
            $(".name-form").next("li.warning").show();
            Qualification.checkName = false;
        }else{
            $(".name-form").next("li.warning").hide();
            Qualification.checkName = true;
        }
        if ( self.allSel.HouseState != 1 ){
            $('#HouseState').next('.warning').show();
        }
        if ( self.allSel.PurchaseTime != 1 ){
            $('#PurchaseTime').next('.warning').show();
        }
        if (self.allSel.HouseState == 1 && self.allSel.PurchaseTime == 1 && Qualification.checkName) {                
            return true;
        } else {               
            return false;
        }           

    },
    //跳转判断
    jumpJudgment: function () {
        var self = this;

        $(".loadmask").show();
        $('body').bind('touchmove', function (e) {
            e.preventDefault();
        });
        
        $("#hidHouseState").val(self.selObj.HouseState);
        $("#hidPurchaseTime").val(self.selObj.PurchaseTime);
        tools.$ajax({
            url: "/orderApplyGmac/AddLoanOrder",
            type: "POST",
            dataType: "json",
            data: {
                "ProductIds": $("input[name='ProductIds']").val(),
                "OrderID": $("input[name='OrderID']").val(),
                "CarId": $("input[name='CarId']").val(),
                "CityId": $("input[name='CityId']").val(),
                "CarPrice": $("input[name='CarPrice']").val(),
                "HouseState": $("input[name='HouseState']").val(),
                "PurchaseTime": $("input[name='PurchaseTime']").val(),
                "Name": $("#UserName input").val(),
                "IsSelectedInsurance": $("input[name=IsSelectedInsurance]").val(),
                "InsuranceCompanyName": $("input[name=InsuranceCompanyName]").val()
            },
            beforeSend: function () {
                $(".loadmask").show();
            },
            success: function (res) {
                self.serviceProvision.removeClass('disabled');                    
                if (res.Result) {
                    $("#formQ").submit();
                } else {
                    location.href = "/orderapplygmac/resultfail?orderid=" + $("input[name='OrderID']").val();                       
                }
            }
        });
    }
};

$(function () {
    Qualification.init();
});

