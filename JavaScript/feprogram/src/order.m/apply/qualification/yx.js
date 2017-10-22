import './index.scss'
import check from 'libs/check'	
import '../libs/gauge'
import Vue from 'vue'
import applyEntrance from '../components/applyEntrance/applyEntrance.vue'

/*APP判断*/
var isApp = tools.getCookie("YiXinAppInfo");
if(isApp){
	$(".header-bar").addClass('no-after');
}else{
	$(".header-bar").removeClass('no-after');
}

let isNeedPay = false

var Qualification ={
	fontBtn:$(".submit-form"),
	assessmentBox:$(".assessment-box"),
	creditInput:$(".credit-item .font-input"),
	quotaLayer:$("#quotaLayer"), //有额度弹层
	noResultLayer:$("#noResultLayer"), //无结果弹层
	dataCreditLine:"",
	init:function(){
		Qualification.bindEvent();
	},
	bindEvent:function(){
		$('.sec_insurance').on('click',function(){
			var $tag = $(this).find('i')
			var CLASS_CURRENT = 'cur'
			$tag.toggleClass(CLASS_CURRENT)
			$('input[name=IsSelectedInsurance]').val($tag.hasClass(CLASS_CURRENT))
		})

		$('.authorization03').on('click', function(){
            tools.serviceProvision({
                'url':'/home/AccidentInsurance',
                'title':$(this).text() + '说明',
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
		$(".form-box").on("click",".submit-form",function(e){
				if(check.isCreditCard($(".credit-item .font-input").val().replace(/\s/g,'')) || dev){
					$(".warning").hide();
					Qualification.jumpJudgment();
				}else{
					$(".warning").show();
				}
		})

			this.creditInput.on('input', () => {
				setTimeout(()=>{
					const element = this.creditInput[0]
					const valOrigin = this.creditInput.val()
					const valOriginTrim = valOrigin.trim()
					const valNewTrim = valOriginTrim.replace(/[^\d]/g,'')
					const valNew = valNewTrim.replace(/(\d{4})(?=\d)/g,'$1 ')

					// 当前输入位置
					let pos = 0

					// 计算光标位置
					if(element.selectionStart){
						pos = (Math.max(element.selectionStart,1) % 5 === 0 && /[\d]/.test(valOrigin.charAt(element.selectionStart-1))) ? element.selectionStart + 1 : element.selectionStart
					}

					// android部分浏览器改变value后光标位置不跟随变动,处理为移动到最后
					this.creditInput.val('')
					this.creditInput.val(valNew)
					if(element.setSelectionRange && element.selectionStart){
						element.setSelectionRange(pos,pos)
					}
				},0)
			})

		$(".assessment-box .ass-btn").click(function(){
				if(isNeedPay){
					 window.location.href=pay_url+"?orderId="+$("input[name=OrderID]").val();
				}
				else{
					skipSuccess()
				}
			})

		$('.skip').on('click', function(){
				tools.$ajax({
					url:result_getting_url,
					dataType:"json",
					type:"post",
					data: {
						"Career":$("input[name=Career]").val(),
						"Credit":$("input[name=Credit]").val(),
						"Income":$("input[name=Income]").val(),
						"HouseState":$("input[name=HouseState]").val(),
						"Funds":$("input[name=Funds]").val(),
						"Insurance":$("input[name=Insurance]").val(),
						"OrderID":$("input[name=OrderID]").val(),
						"MaritalStatus":$("input[name=MaritalStatus]").val(),
						"CreditCardNumber":'',
						"CertificateNumber":$("input[name=CertificateNumber]").val(),
						"Education": $("input[name=Education]").val()
					}
				})
				setTimeout(skipSuccess,500)
				return false
			})

		function skipSuccess(){
			window.location.href=apply_success_url+"?orderId="+$("input[name=OrderID]").val()
		}

		function hengshuping(){
			// alert(1);
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

		tools.$ajax({
			url:result_getting_url,
			dataType:"json",
			type:"post",
			data: {
				"Career":$("input[name=Career]").val(),
				"Credit":$("input[name=Credit]").val(),
				"Income":$("input[name=Income]").val(),
				"HouseState":$("input[name=HouseState]").val(),
				"Funds":$("input[name=Funds]").val(),
				"Insurance":$("input[name=Insurance]").val(),
				"OrderID":$("input[name=OrderID]").val(),
				"MaritalStatus":$("input[name=MaritalStatus]").val(),
				"CreditCardNumber":Qualification.creditInput.val().replace(/\s/g,''),
				"CertificateNumber":$("input[name=CertificateNumber]").val(),
				"Education": $("input[name=Education]").val(),
				"IsSelectedInsurance" : $("input[name=IsSelectedInsurance]").val(),
				"InsuranceCompanyName" : $("input[name=InsuranceCompanyName]").val()
			},
			success:function(res){
				if(res.Result){
					isNeedPay = res.Data.IsGoingToPay
					setTimeout(Qualification.queryResult,3000);
				}else{
					$("#tipBox").fadeOut(300);
					$('body').unbind('touchmove');
					tools.showAlert(res.Message);
				}
			}
		})
	},
	queryResult:function(){
		tools.$ajax({
			url:query_result_url,
			type:"get",
			dataType:"jsonp",
			success:function(res){
				$('body').unbind('touchmove');
				$("#tipBox").fadeOut(300);
				if(res.Result){
					if(res.Data.IsUpdateByYxQuery){
						//接口查询无结果
						if(res.Data.creditLine>0){
							//Qualification.assessmentBox.show();
							Qualification.dataCreditLine = res.Data.creditLine;
							Qualification.animationCanvas()
						}else{
							//没有审批额度,跳转失败页面
							window.location.href=apply_fail_url+"?orderId="+$("input[name=OrderID]").val()
						}
					}else{
						//接口查询无结果, 弹出等待页面
						Qualification.noResultLayer.show();
					}

				}
				else{
					tools.showAlert(res.Message);
				}

			}
		});
	},
	animationCanvas:function(){
		if(Qualification.dataCreditLine != ""){
			Qualification.quotaLayer.show();

			//有审批额度
			var opts = {
				angle: 0,
				lineWidth: 0.02,
				changeDomId:"#priceChange"
			};
			var target = document.getElementById('canvas-preview');
			var gauge = new Gauge(target).setOptions(opts);
			gauge.maxValue = Qualification.dataCreditLine;
			gauge.animationSpeed = 55;
			gauge.set(Qualification.dataCreditLine);
			window.gaugeCallBacks = function(){
				// console.log(1);
				$(".assessment-box .ass-btn").text('继续');
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
})