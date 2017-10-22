import './index.scss'
import 'libs/selectControl'	
import '../libs/gauge'
import Vue from 'vue'
import applyEntrance from '../components/applyEntrance/applyEntrance.vue'
import showCGBAlter from '../libs/showCGBAlter'
import showCITICAlter from '../libs/showCITICAlter'
//判断是否广发银行
if(typeof(orderId) != "undefined"){
    showCGBAlter(orderId);
    showCITICAlter(orderId);
}

/*APP判断*/
var isApp = tools.getCookie("YiXinAppInfo");
if(isApp){
	$(".header-bar").addClass('no-after');
}else{
	$(".header-bar").removeClass('no-after');
}

var Qualification ={
	fontBtn:$(".submit-form"),
	formQ:$("#formQ"),
	assessmentBox:$(".assessment-box"),
	dataApproveQuota:"",
	dataIsGoingToPay:false,
	allSel:{
		occupation:0,
		income:0,
		socialSecurity:0,
		creditRecord:0,
		accumulationFund:0,
		housingSituation:0
	},
	selObj:{},
	init:function(){
		var _initNum = 0;
		//三星s8+
        if(window.navigator.userAgent.indexOf("SM-G9550")>=0 && tools.isWebView()){
            $(".ass-bg").css({
                backgroundPosition:'center 1.2rem'
            })
        }

		if(defaultQualification.Career == -1){
			$('[data-aslider=occupation]').find("li").eq(0).addClass('cur').siblings('li').removeClass('cur');
		}else{
			$('[data-aslider=occupation] li').each(function(index, el) {
				if($(el).data("id") == defaultQualification.Career){
					$(this).addClass('cur').siblings('li').removeClass('cur');
					var _itemId = $(this).attr("data-id");
					var _itemTxt = $(this).text();
					$("#occupation>span").attr("dada-id",_itemId).text(_itemTxt);

					Qualification.allSel["occupation"] = 1;
					Qualification.selObj["Career"] = defaultQualification.Career;
					_initNum+=1;
				}
			});

		}

		if(defaultQualification.Income == -1){
			$('[data-aslider=income]').find("li").eq(0).addClass('cur').siblings('li').removeClass('cur');
		}else{
			$('[data-aslider=income] li').each(function(index, el) {
				if($(el).data("id") == defaultQualification.Income){
					$(this).addClass('cur').siblings('li').removeClass('cur');
					var _itemId = $(this).attr("data-id");
					var _itemTxt = $(this).text();
					$("#income>span").attr("dada-id",_itemId).text(_itemTxt);
					Qualification.allSel["income"] = 1;
					Qualification.selObj["Income"] = defaultQualification.Income;
					_initNum+=1;
				}
			});

		}
		if(defaultQualification.Insurance == -1){
			$('[data-aslider=socialSecurity]').find("li").eq(0).addClass('cur').siblings('li').removeClass('cur');
		}else{
			$('[data-aslider=socialSecurity] li').each(function(index, el) {
				if($(el).data("id") == defaultQualification.Insurance){
					$(this).addClass('cur').siblings('li').removeClass('cur');
					var _itemId = $(this).attr("data-id");
					var _itemTxt = $(this).text();
					$("#socialSecurity>span").attr("dada-id",_itemId).text(_itemTxt);
					Qualification.selObj["Insurance"] = defaultQualification.Insurance;
					Qualification.allSel["socialSecurity"] = 1;
					_initNum+=1;
				}
			});
		}
		if(defaultQualification.Funds == -1){
			$('[data-aslider=accumulationFund]').find("li").eq(0).addClass('cur').siblings('li').removeClass('cur');
		}else{
			$('[data-aslider=accumulationFund] li').each(function(index, el) {
				if($(el).data("id") == defaultQualification.Funds){
					$(this).addClass('cur').siblings('li').removeClass('cur');
					var _itemId = $(this).attr("data-id");
					var _itemTxt = $(this).text();
					$("#accumulationFund>span").attr("dada-id",_itemId).text(_itemTxt);
					Qualification.selObj["Funds"] = defaultQualification.Funds;
					Qualification.allSel["accumulationFund"] = 1;
					_initNum+=1;
				}
			});
		}
		if(defaultQualification.Credit == -1){
			$('[data-aslider=creditRecord]').find("li").eq(0).addClass('cur').siblings('li').removeClass('cur');
		}else{
			$('[data-aslider=creditRecord] li').each(function(index, el) {
				if($(el).data("id") == defaultQualification.Credit){
					$(this).addClass('cur').siblings('li').removeClass('cur');
					var _itemId = $(this).attr("data-id");
					var _itemTxt = $(this).text();
					$("#creditRecord>span").attr("dada-id",_itemId).text(_itemTxt);
					Qualification.selObj["Credit"] = defaultQualification.Credit;
					Qualification.allSel["creditRecord"] = 1;
					_initNum+=1;
				}
			});
		}
		if(defaultQualification.HouseState == -1){
			$('[data-aslider=housingSituation]').find("li").eq(0).addClass('cur').siblings('li').removeClass('cur');
		}else{
			$('[data-aslider=housingSituation] li').each(function(index, el) {
				if($(el).data("id") == defaultQualification.HouseState){
					$(this).addClass('cur').siblings('li').removeClass('cur');
					var _itemId = $(this).attr("data-id");
					var _itemTxt = $(this).text();
					$("#housingSituation>span").attr("dada-id",_itemId).text(_itemTxt);
					Qualification.selObj["HouseState"] = defaultQualification.HouseState;
					Qualification.allSel["housingSituation"] = 1;
					_initNum+=1;
				}
			});
		}

		if(_initNum == 6 ){
			Qualification.fontBtn.addClass('cur').removeClass('disabled');
		}else{
			Qualification.fontBtn.removeClass('cur').addClass('disabled');
		}
		//选择
		$(".select-con").selectControl({
			CallBacks:function(obj){
				$(obj.item).find("span").data("id",obj.id).text(obj.txt);

				Qualification.allSel[$(obj.item).attr("id")] = 1;

				switch($(obj.item).attr("id")){
					case "occupation":
						Qualification.selObj["Career"] = obj.id;
						break;
					case "housingSituation":
						Qualification.selObj["HouseState"] = obj.id;
						break;
					case "income":
						Qualification.selObj["Income"] = obj.id;
						break;
					case "creditRecord":
						Qualification.selObj["Credit"]= obj.id;
						break;
					case "accumulationFund":
						Qualification.selObj["Funds"]= obj.id;
						break;
					case "socialSecurity":
						Qualification.selObj["Insurance"]= obj.id;
						break;
				}
				var _num = 0;

				for( var key in Qualification.allSel){
				   _num += Qualification.allSel[key];
				}

				if(_num == 6 ){
					Qualification.fontBtn.addClass('cur').removeClass('disabled');
				}else{
					Qualification.fontBtn.removeClass('cur').addClass('disabled');
				}
			}
		});

		Qualification.bindEvent();
	},
	bindEvent:function(){

		$('.sec_insurance').on('click',function(){
			var $tag = $(this).find('i')
			var CLASS_CURRENT = 'cur'
			$tag.toggleClass(CLASS_CURRENT)
			$('input[name=IsSelectedInsurance]').val($tag.hasClass(CLASS_CURRENT))
		})

		$('.authorization03').on('click', function(e){
            tools.serviceProvision({
                'url':'/home/AccidentInsurance',
                'title':$(this).text() +'说明',
                'params': {insuranceCompany: $('input[name="InsuranceCompanyName"]').val()}
            })
			return false
		})

		$(".header-bar>a").on("click",function(){
			if(document.referrer.indexOf("/login/index")>=0){
				window.history.go(-2);
				return false;
			}else{
				window.history.go(-1);
				return false;
			}
		})

		$(".form-box").on("click",".submit-form.cur",function(e){
				Qualification.jumpJudgment();
		})

		function hengshuping(){
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
	//跳转判断
	jumpJudgment:function(){
		$("#tipBox").fadeIn();
		$('body').bind('touchmove',function(e){
			e.preventDefault();
		});

		$.ajax({
			url:result_getting_url,
			dataType:"json",
			type:"post",
			data: {
				"Career":Qualification.selObj.Career,
				"Credit":Qualification.selObj.Credit,
				"Income":Qualification.selObj.Income,
				"HouseState":Qualification.selObj.HouseState,
				"Funds":Qualification.selObj.Funds,
				"Insurance":Qualification.selObj.Insurance,
				"MaritalStatus":$("input[name=MaritalStatus]").val(),
				"Education":$("input[name=Education]").val(),
				"OrderID":$("input[name=OrderID]").val(),
				"CertificateNumber":$("input[name=CertificateNumber]").val(),
				"IsSelectedInsurance" : $("input[name=IsSelectedInsurance]").val(),
				"InsuranceCompanyName" : $("input[name=InsuranceCompanyName]").val()
			},
			success:function(res){
				if(res.Result){
					setTimeout(function(){
						$('body').unbind('touchmove');
						$("#tipBox").fadeOut(300);
						if(res.Data.IsHighQulification){
							if(res.Data.ApproveQuota>0){

								Qualification.dataApproveQuota = res.Data.ApproveQuota;
								Qualification.dataIsGoingToPay = res.Data.IsGoingToPay;
								Qualification.animationCanvas();

							}else{
								if(res.Data.IsGoingToPay){
									window.location.href= pay_url +'?orderId='+ $("input[name=OrderID]").val();
								}else{
									$("#formQ").attr("action",apply_success_url).submit();
								}
							}
						}else{
							$("#formQ").submit();
						}

					},1000);
				}
			}
		})
	},
	animationCanvas:function(){
		if(Qualification.dataApproveQuota != ""){
			Qualification.assessmentBox.show();

				//有审批额度
				var opts = {
					angle: 0,
					lineWidth: 0.02,
					changeDomId:"#priceChange"
				};
				gauge = null
				var target = document.getElementById('canvas-preview');
				var gauge = new Gauge(target).setOptions(opts);
				gauge.maxValue = Qualification.dataApproveQuota;
				gauge.animationSpeed = 55;
				gauge.set(Qualification.dataApproveQuota);
				window.gaugeCallBacks = function(){
					$(".ass-btn.font-nav").html('<a id="continueBtn" href="javascript:void(0);">继续</a>');
					if(Qualification.dataIsGoingToPay){
						$("#continueBtn").off("click").on("click",function(){
							window.location.href= pay_url +'?orderId='+ $("input[name=OrderID]").val();
						})
					}else{
						$("#continueBtn").off("click").on("click",function(){
							$("#formQ").attr("action",apply_success_url).submit();
						})
					}
				}
		}
	}
}

$(function(){
	Qualification.init();

	// 在线进件入口
	/* var vm = new Vue({
		el: '#main',
		data: {
			applyLink: snap_index_url,
			showApply: isRequiringSnap
		},
		computed: {
		},
		components: {
			'apply-entrance': applyEntrance
		},
		methods: {
			applyEntranceClose: function() {
				if(isApp){
                    tools.jsNativeBridge("payResultAction","goOrder");
				}else{
                    location.href = user_center_url;
				}				
			}
		}
	}); */
});
