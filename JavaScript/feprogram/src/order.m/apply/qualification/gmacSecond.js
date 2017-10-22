import './gmac.scss'
import check from 'libs/check'  
import 'libs/selectControl' 
import '../libs/gauge'
import 'zepto/src/touch'

var Qualification = {
    fontBtn: $(".submit-form"),
    formQ: $("#formQ"),
    assessmentBox:$(".assessment-box"),
    dataApproveQuota:"",
    dataIsHavingDeposit:false,
    allSel: {},
    selObj: {},
    init: function () {
        //alert(111);
        var self = this;

        if( $('#Telphone').val() != "" ){
            self.allSel.Mobile = 1;
            self.selObj.Mobile = $('#Telphone').val();
        }
        if( $('#ValidateCode').val() != "" ){
            self.allSel.Code = 1;
            self.selObj.Code = $('#ValidateCode').val();
        }
        // self.chkFull();
        //获取经销商          
        self.GetDearList();
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

                // 炫酷
                $('#popCool').addClass('hide');

                // self.chkFull();
            }
        });

        // 炫酷
        $('body').on('tap', '#closeDealerCode', function(){
            $('#popCool').addClass('hide');
        }).on('tap', '#DealerCode', function(){
            setTimeout(function(){
                $('#popCool').text( $('[data-aslider=dealerCode]').find('li.cur').text() ).removeClass('hide');
            }, 600);
        }).on('touchend', function(event){
            if( $('[data-aslider=dealerCode]').css('display') == 'block' && event.target.id != 'closeDealerCode' ){
                var _popCoolTxt = $("[data-aslider=dealerCode]").find('li.cur').text();
                $('#popCool').text(_popCoolTxt).show();
            }
        });
        // 输入
        $('.iptbox').focus(function(){
            $(this).parents('li').next('.warning').hide();
        }).blur(function(){
            var _itemTxt = $(this).val(),
                _itemId = $(this).parents('li').attr('id');

            if( _itemTxt != "" ){
                switch ( _itemId ) {
                    case 'Mobile':
                        if ( !check.isPhoneNumber(_itemTxt) ) {
                            $(this).parents('li').next('.warning').show();
                            return;
                        }
                        break;
                    case 'Code':
                        if ( _itemTxt.length !=4 ) {
                            $(this).parents('li').next('.warning').show();
                            return;
                        }
                        break;
                }
                self.allSel[_itemId] = 1;
                self.selObj[_itemId] = _itemTxt;
            } else {
                self.allSel[_itemId] = 0;
                self.selObj[_itemId] = "";
            }
            // self.chkFull();
        });

        $(".form-box").on("click", ".submit-form", function (e) {                
            if ($(this).is(".submit-form.cur") && self.chkFull()) {
                // 成功提交
                self.jumpJudgment();
            }
        });

        function hengshuping() {
            self.location.reload();              
        }
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", hengshuping, false);
        //注册获取验证码事件
        self.GetValidateCode();
    },
    GetDearList: function() {
        var self = this;

        var cityId = $("#hidCityId").val(), carId = $("#hidCarId").val();
        if (cityId != undefined && carId != undefined) {
            tools.$ajax({
                url: "/orderApplyGmac/GetDears",
                type: "get",
                dataType: "json",
                data: {
                    "cityId": $("#hidCityId").val(), "carId": $("#hidCarId").val()
                },
                beforeSend: function () {
                    //tools.showAlert("提交中..", 999999);
                },
                success: function (res) {
                    $("#ulDealerList").html("");
                    if (res.Result) {
                        for (var i = 0; i < res.Data.Data.length; i++) {
                            $("#ulDealerList").append("<li data-id=" + res.Data.Data[i].Code + ">" + res.Data.Data[i].Name + "</li>");
                        }
                    }
                    $('[data-aslider=dealerCode]').find("li").eq(0).addClass('cur').siblings('li').removeClass('cur');
                }
            });
        }
    },
    GetValidateCode: function () {
        // 验证码
        $("#GetValidateCodeBtn").tap(function () {
            var $mobileObj = $("#GetValidateCodeBtn"),
				_mobileVal = $('#Telphone').val();

            if ($(this).hasClass("disable"))
                return;
            if (check.isPhoneNumber(_mobileVal)) {
                $.ajax({
                    type: 'POST',
                    url: "/Base/GetCode",
                    data: {
                        "codelen": 4,
                        "mobile": _mobileVal
                    },
                    dataType: "json",
                    success: function () {

                    }
                })
                var n = 59;
                if ($mobileObj.attr("data-Seconds")) {

                    n = parseInt($mobileObj.data("seconds"));
                    var detail = $mobileObj.data("detail");

                    $mobileObj.addClass("disable").text(n + detail);
                    var tmo = setInterval(function () {
                        if (--n == 0) {
                            clearInterval(tmo);
                            $mobileObj.removeClass("disable").text("获取验证码");
                            return;
                        }
                        $mobileObj.text(n + detail);
                    }, 1000);
                } else {
                    $mobileObj.addClass("disable").text(n + "秒后获取");
                    var tmo = setInterval(function () {
                        if (--n == 0) {
                            clearInterval(tmo);
                            $mobileObj.removeClass("disable").text("获取验证码");
                            return;
                        }
                        $mobileObj.text(n + "秒后获取");
                    }, 1000);
                }
            } else {
                $('#Mobile').next('.warning').show();
            }
        });

    },
    chkFull: function(){
        var self = this;
        
        if ( self.allSel.Mobile != 1 ){
            $('#Mobile').next('.warning').show();
        }
        if ( self.allSel.Code != 1 ){
            $('#Code').next('.warning').show();
        }
        if ( self.allSel.Mobile == 1 && self.allSel.Code == 1 ) {
            // self.fontBtn.addClass('cur').removeClass('disabled');
            return true;
        } else {
            // self.fontBtn.removeClass('cur').addClass('disabled');
            return false;
        }
    },
    //跳转判断
    jumpJudgment: function () {
        var self = this;

        $(".loadmask").fadeIn();
        $('body').bind('touchmove', function (e) {
            e.preventDefault();
        });
        var phoneRexp = new RegExp(/^1[3|4|5|7|8][0-9]{9}$/);
        var mobile = $('#Telphone').val();
        var validateCode = $("#ValidateCode").val();

        $("#hidDealerCode").val(self.selObj["dealerCode"]);
        $.ajax({
            type: 'POST',
            url: "/Base/CheckCode",
            data: {
                "mobile": mobile,
                "validatecode": validateCode
            },
            dataType: "json",
            success: function (data) {
                if (data.Result) {
                    $("#formQ").submit();
                } else {
                    $(".loadmask").hide();
                    $('#Code').next('.warning').show();
                }
            }
        });
       
    }
}

$(function () {
    Qualification.init();
})