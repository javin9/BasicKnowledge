import './_basic.scss'

	import check from 'libs/check/m'
	
	/*APP判断*/
    var isApp = tools.getCookie("YiXinAppInfo");
    if(isApp){
        $(".header-bar").addClass('no-after');
    }else{
        $(".header-bar").removeClass('no-after');
    }
    
	var OrderHome ={
		nameInput: $(".name-form .font-input"),
		idInput:$(".id-form .font-input"),
		submitBtn: $(".submit-form"),
		serviceProvision: $(".form-box footer i"),
		idPhoto: $(".name-form a"),
		checkName: false,
		checkId: false,
		checkNameId: true,
		init: function(){
			this.bindEvent();
		},
		bindEvent: function(){
			$(".header-bar>a").on("click",function(){
				if(document.referrer.indexOf("/login/index")>=0){
					window.history.go(-2);
					return false;
				}else{
					window.history.go(-1);
					return false;
				}
			})
			
			$(".form-box").on("click",".submit-form,footer i,footer span,.service-pro",function(){
				if($(this).hasClass("submit-form")){//提交按钮

					if(!check.isName($(".name-form .font-input").val())){
						$(".name-form").next("li.warning").show();
						OrderHome.checkName = false;
					}else{
						$(".name-form").next("li.warning").hide();
						OrderHome.checkName = true;
					}
					if(!check.isID($(".id-form .font-input").val())){
						$(".id-form").next("li.warning").show();
						OrderHome.checkId = false;
					}else{
						$(".id-form").next("li.warning").hide();
						OrderHome.checkId = true;
					}

					if(!OrderHome.serviceProvision.hasClass('cur')){
						tools.showAlert("请阅读同意服务条款");
					}else if(!OrderHome.checkNameId){
						tools.showAlert("身份证号与姓名不符");
					}else if(OrderHome.checkName && OrderHome.checkId){
						tools.$ajax({
							url:authUrl,
							type:"get",
							dataType:"jsonp",
							data: {
								"realName":OrderHome.nameInput.val(),"IdNo":OrderHome.idInput.val(),"userId":uid,"phone":mobile	
							},
							beforeSend: function () {
								tools.showAlert("提交中..",999999);
							},
							success: function (res) {
								if(res.Result){
									OrderHome.checkNameId = true;
									$("#formQ").submit();
								}else{
								    tools.showAlert("验证不通过");
								}		
							}
						});
					}
				}else if($(this).is("footer i")|| $(this).is("footer span")){
					if(OrderHome.serviceProvision.hasClass('cur')){
						OrderHome.serviceProvision.removeClass('cur');
					}else{
						OrderHome.serviceProvision.addClass('cur');
					}
				}else if($(this).is('.service-pro')){
					tools.serviceProvision({
						"url":"/home/Provision", 
						"title":"车贷服务条款"
					})
				}
			});
		}
	}

	$(function(){
		OrderHome.init();
	})