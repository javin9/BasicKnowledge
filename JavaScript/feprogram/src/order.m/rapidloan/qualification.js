	require('./qualification.css');
	require('./gauge.js');
	
	var selectControl =  require("libs/selectControl");

	var Qualification ={
		fontBtn:$(".submit-form"),
		serviceProvision: $(".form-box footer i"),
		formQ:$("#formQ"),
		assessmentBox:$(".assessment-box"),
		dataApproveQuota:"",
		dataIsHavingDeposit:false,
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
			/* $(".header-bar>a").on("click",function(){
				if(document.referrer.indexOf("/login/index")>=0){
					window.history.go(-2);
					return false;
				}else{
					window.history.go(-1);
					return false;
				}
			}) */

			$(".form-box").on("click","footer i,footer span,.authorization01,.authorization02,.submit-form",function(e){
				if($(this).is("footer span") || $(this).is("footer i")){
					if(Qualification.serviceProvision.hasClass('cur')){
						Qualification.serviceProvision.removeClass('cur');
					}else{
						Qualification.serviceProvision.addClass('cur');
					}
				// }else if($(this).is(".authorization01")){
				// 	tools.serviceProvision({
				// 		"url":"/home/PersonalCreditAuthorization", 
				// 		"title":"个人征信授权书"
				// 	})
				}else if($(this).is(".authorization02")){
					tools.serviceProvision({
						"url":"/home/InfoUsingAuthorization", 
						"title":"信息使用授权书"
					})
				}else if($(this).is(".submit-form.cur")){
					if(Qualification.serviceProvision.hasClass('cur') && !Qualification.serviceProvision.hasClass('disable')){
						Qualification.jumpJudgment();
						$(this).addClass('disable');
					}else{
						tools.showAlert("请阅读同意服务条款");
					}
				}
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
            document.body.scrollTop = 0;
           
			$.ajax({
				url:AddQuaUrl,
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
					"ProductIds":$("input[name=ProductIds]").val(),
					"OrderID":$("input[name=OrderID]").val(),
					"CarId":$("input[name=CarId]").val(),
					"CityId":$("input[name=CityId]").val(),
					"CarPrice":$("input[name=CarPrice]").val(),
					"CertificateNumber":$("input[name=CertificateNumber]").val()	
				},
				success:function(res){

					if(res.Result){
						setTimeout(function(){
							$('body').unbind('touchmove');
                			$("#tipBox").fadeOut(300);
							if(res.Data.IsHighQulification){
								if(res.Data.ApproveQuota>0){
									
								    Qualification.dataApproveQuota = res.Data.ApproveQuota;
								    Qualification.dataIsHavingDeposit = res.Data.IsHavingDeposit;
									Qualification.animationCanvas();
					
								}else{
									$("#formQ").attr("action",applySuccessUrl).submit();
								}		
							}else{
								$("#formQ").submit();
							}

						},1000);
					}else{
						$("#formQ").submit();
					}
					Qualification.serviceProvision.removeClass('disable');
				}
			})
		},
		animationCanvas:function(){
			// console.log(Qualification.dataApproveQuota)
			if(Qualification.dataApproveQuota != ""){
 				Qualification.assessmentBox.show();

					//有审批额度
					var opts = {
				     	angle: 0, 
				    	lineWidth: 0.02,
						changeDomId:"#priceChange"
				    };
				    delete window.gauge;
				    var target = document.getElementById('canvas-preview'); 
				    var gauge = new Gauge(target).setOptions(opts); 
				    gauge.maxValue = Qualification.dataApproveQuota; 
				    gauge.animationSpeed = 55; 
				    gauge.set(Qualification.dataApproveQuota);
				    window.gaugeCallBacks = function(){
				    	$(".ass-btn.font-nav").html('<a id="continueBtn" href="javascript:void(0);">继续</a>');
						$("#continueBtn").off("click").on("click",function(){
				    		$("#formQ").attr("action",applySuccessUrl).submit();
				    	})	
				    }
			}
		}
	}

	$(function(){
		Qualification.init();
	})
	
