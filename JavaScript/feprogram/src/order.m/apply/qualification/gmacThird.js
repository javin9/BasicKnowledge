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
                if( _itemId == "MaritalStatus" && obj.id == "18" ){
                    $("#Income").find('s').text('家庭');
                } else {
                    $("#Income").find('s').text('个人');
                }

                // self.chkFull();
            }
        });
        // 输入
        $('#Income .iptbox').focus(function(){
            var _itemId = $(this).parents('li').attr('id');

            $(this).parents('li').next('.warning').hide();
            
            self.allSel[_itemId] = 1;
            // self.chkFull();
        }).blur(function(){
            var _itemTxt = $(this).val(),
                _itemId = $(this).parents('li').attr('id');

            if( _itemTxt >= 0 && _itemTxt != "" ){
                self.allSel[_itemId] = 1;
                self.selObj[_itemId] = _itemTxt;
            } else {
                self.allSel[_itemId] = 0;
                self.selObj[_itemId] = "-1";
            }               
        });
        $('#CertificateNumber .font-input').focus(function () {
            var _itemId = $(this).parents('li').attr('id');
            $(this).parents('li').next('.warning').hide();
            self.allSel[_itemId] = 1;              
        }).blur(function () {
            var _itemId = $(this).parents('li').attr('id');
            var idno = $(this).val().trim();
            if (idno.length > 0 && check.isID(idno)) {
                $(this).parents('li').next('.warning').hide();
                self.allSel[_itemId] = 1;
                self.selObj[_itemId] = idno;
            } else {
                self.allSel[_itemId] = 0;
                self.selObj[_itemId] = "-1";
            }               
        });

        $(".form-box").on("click", ".submit-form", function (e) {
            if ($(this).is(".submit-form.cur") && self.chkFull() ) {
                self.jumpJudgment();
            }
        })

        // self.chkFull();

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

        if ( self.allSel.Career != 1 ){
            $('#Career').next('.warning').show();
        }
        if ( self.allSel.Education != 1 ){
            $('#Education').next('.warning').show();
        }
        if ( self.allSel.Credit != 1 ){
            $('#Credit').next('.warning').show();
        }
        if ( self.allSel.MaritalStatus != 1 ){
            $('#MaritalStatus').next('.warning').show();
        }
        if ( self.allSel.Income != 1 ){
            $('#Income').next('.warning').show();
        }
        //处理带过来的身份证号
        var idno = $('#CertificateNumber .font-input').val();
        if (idno.length > 0 && check.isID(idno)) {
            $('#CertificateNumber .font-input').parents('li').next('.warning').hide();
            self.allSel["CertificateNumber"] = 1;
            self.selObj["CertificateNumber"] = idno;
        }
        else {
            self.allSel["CertificateNumber"] = 0;
            self.selObj["CertificateNumber"] = "-1";
        }
        if (self.allSel.CertificateNumber != 1) {
            $('#CertificateNumber').next('.warning').show();
        }
        if (self.allSel.Career == 1 && self.allSel.Education == 1 && self.allSel.Credit == 1 && self.allSel.MaritalStatus == 1 && self.allSel.Income == 1 && self.allSel.CertificateNumber==1) {
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
        $("#tipBox").fadeIn();           
        $('body').bind('touchmove', function (e) {
            e.preventDefault();
        });

        var Money = new RegExp(/^\d+(\.\d{0})?$/);
        var income = $("#txtIncome").val();
        if(!income.match(Money)) {
            $('#Income').next('.warning').text("月收入格式不正确").show();
            return;
        }
        $.ajax({
            url: "/OrderApplyGmac/GetOrderApplyResult",
            dataType: "json",
            type: "post",
            data: {
                "CertificateNumber":self.selObj.CertificateNumber,
                "Career": self.selObj.Career,
                "Education": self.selObj.Education,
                "Credit": self.selObj.Credit,
                "MaritalStatus": self.selObj.MaritalStatus,
                "MonthlyWages": income,
                "HouseState": $("#hidHouseState").val(),
                "ProductIds": $("input[name=ProductIds]").val(),
                "OrderID": $("input[name=OrderID]").val(),
                "CarId": $("input[name=CarId]").val(),
                "CityId": $("input[name=CityId]").val(),
                "CarPrice": $("input[name=CarPrice]").val()
            },
		    success: function (res) {
		        if (res.Result == 1) {
		            setTimeout(function () {
		                $('body').unbind('touchmove');
		                $("#tipBox").fadeOut(300);
		                if (res.Data.IsHighQulification) {
		                    if (res.Data.ApproveQuota > 0) {
		                        $("#hidLoanAmount").val(res.Data.ApproveQuota);
		                        self.dataApproveQuota = res.Data.ApproveQuota * 10000;
		                        self.dataIsHavingDeposit = res.Data.IsHavingDeposit;
		                        self.animationCanvas();

		                    } else {
		                        $("#formQ").submit();
		                    }
		                } else {
		                    $("#formQ").submit();
		                }

		            }, 1000);
		        }
            }
        })
    },
    animationCanvas: function () {
        var self = this;
		// console.log(Qualification.dataApproveQuota)
		if(self.dataApproveQuota != ""){            
				self.assessmentBox.show();

				//有审批额度
				var opts = {
			     	angle: 0, 
			    	lineWidth: 0.02,
					changeDomId:"#priceChange"
			    };
			    gauge = null
			    var target = document.getElementById('canvas-preview'); 
			    var gauge = new Gauge(target).setOptions(opts); 
			    gauge.maxValue = self.dataApproveQuota; 
			    gauge.animationSpeed = 55; 
			    gauge.set(self.dataApproveQuota);
			    window.gaugeCallBacks = function(){
			    	$(".ass-btn.font-nav").html('<a id="continueBtn" href="javascript:void(0);">继续</a>');
                    $("#continueBtn").off("click").on("click",function(){
				    		$("#formQ").submit();
				    	})					    	
			    }

		}
		
	}
}

$(function () {
    Qualification.init();
})