import './_basic.scss'

	import check from 'libs/check/m'

	/*APP判断*/
    var isApp = tools.getCookie("YiXinAppInfo");
    if(isApp){
        $(".header-bar").addClass('no-after');
    }else{
        $(".header-bar").removeClass('no-after');
    }

	// $(function(){
	// 	//判断弹层
	//     if(isShowCGBAlter == "True"){
	// 		$("#maskLayer").css({
	// 			"display":"block",
	//
	// 		});
	// 		tools.showAlert("<div style='white-space:nowrap'>将由 广发银行 为您进行在线审批！</div><div style='white-space:nowrap'>您的【项目校验码】已通过短信发出</div>请注意查收",10000);
	// 		$("#showAlertBox").css({
	// 			"z-index":99999
	// 		}).find(".layout-text").css({
	// 			"width": "9rem",
	// 			"margin-left": "-4.5rem"
	// 		})
	// 		setTimeout(function(){
	// 			location.href="https://wap.cgbchina.com.cn/wapEasyLoan1.do"
	// 		},5000)
	// 	}
	// })
 	
	
	var OrderHome ={
		nameInput: $(".name-form .font-input"),
		idInput:$(".id-form .font-input"),
		submitBtn: $(".submit-form"),
		serviceProvision: $(".form-box footer i"),
		secviceInsurance: $(".sec_insurance i"),
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
			// $("#upload").on('change', function(e) {
			// 	event.preventDefault();
			// 	tools.showAlert("上传中..",9999999);
			// 	lrz(this.files[0], {width: 1024})
		 //        .then(function (rst) {
		 //            // 这里该上传给后端啦

		 //            /* ==================================================== */
		 //            // 原生ajax上传代码，所以看起来特别多 ╮(╯_╰)╭，但绝对能用
		 //            // 其他框架，例如jQuery处理formData略有不同，请自行google，baidu。
		 //            var xhr = new XMLHttpRequest();
		 //            xhr.open('POST', recognitionUrl);

		 //            xhr.onload = function () {

		 //                if (xhr.status === 200) {
		 //                   	var data = JSON.parse(xhr.response);
		 //                    if(data.Result){
		 //                    	$("#showAlertBox").hide();
		 //                    	OrderHome.nameInput.val(data.Data.Name);
		 //                    	OrderHome.idInput.val(data.Data.IdentityNumber);
		 //                    	// OrderHome.submitBtn.removeClass('disabled').addClass('cur');

		 //                    	//姓名验证
			// 					if(!check.isName(data.Data.Name)){
			// 						OrderHome.nameInput.parent("li.name-form").next("li.warning").show();
			// 						OrderHome.checkName = false;
			// 					}else{
			// 						OrderHome.nameInput.parent("li.name-form").next("li.warning").hide();
			// 						OrderHome.checkName = true;
			// 					}
			// 					//身份证验证
			// 					if(!check.isID(data.Data.IdentityNumber)){
			// 						OrderHome.idInput.parent("li.id-form").next("li.warning").show();
			// 						OrderHome.checkId = false;
			// 					}else{
			// 						OrderHome.idInput.parent("li.id-form").next("li.warning").hide();
			// 						OrderHome.checkId = true;
			// 					}


			// 					if(OrderHome.checkId && OrderHome.checkName){
			// 						OrderHome.submitBtn.removeClass('disabled').addClass('cur');
			// 					}else{
			// 						OrderHome.submitBtn.addClass('disabled').removeClass('cur');
			// 					}
		 //                    }else{
		 //                    	tools.showAlert(data.Message);
		 //                    }
		 //                } else {
		 //                    // 处理其他情况
		 //                }
		 //            };

		 //            xhr.onerror = function () {
		 //                tools.showAlert("请上传正确的图片");
		 //            };

		 //            xhr.upload.onprogress = function (e) {
		 //                var percentComplete = ((e.loaded / e.total) || 0) * 100;
		 //                tools.showAlert(percentComplete);
		 //            };

		 //            // 添加参数
		 //            rst.formData.append('fileLen', rst.fileLen);
		 //            rst.formData.append('xxx', '我是其他参数');

		 //            // 触发上传
		 //            xhr.send(rst.formData);
		 //            /* ==================================================== */

		 //            return rst;
		 //        })

		 //        .catch(function (err) {
		 //            // 万一出错了，这里可以捕捉到错误信息
		 //            // 而且以上的then都不会执行
			// 		tools.showAlert(err);
		 //        })

		 //        .always(function () {
		 //            // 不管是成功失败，这里都会执行
		 //        });

		        
			// 	// console.log(upload.files[0]);

			// });
			// console.log(document.getElementById('upload'));
			// document.getElementById('upload').addEventListener('change', function() {
			//   var file = ;
			//   alert(file.size);
			// }, false);

			// $(".form-box").on("change keyup input paste",".name-form .font-input,.id-form .font-input",function(){
			// 	var parentLi = $(this).parent("li");
			// 	if(parentLi.hasClass('name-form')){//姓名验证
					
			// 	}else if(parentLi.hasClass('id-form')){//身份证验证
					
			// 	}

			// 	if(OrderHome.checkId && OrderHome.checkName){
			// 		OrderHome.submitBtn.removeClass('disabled').addClass('cur');
			// 	}else{
			// 		OrderHome.submitBtn.addClass('disabled').removeClass('cur');
			// 	}
			// });

			$(".form-box").on("click",".sec_insurance i, .sec_insurance span, .authorization03, .submit-form,footer i,footer span,.service-pro",function(){
				if($(this).hasClass("submit-form") && !$(this).hasClass("disable")){//提交按钮
					var $self =$(this);
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
						$self.addClass("disable");
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
								$self.removeClass("disable");
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
				}else if( $(this).is(".sec_insurance i") || $(this).is(".sec_insurance span") ){
					if(OrderHome.secviceInsurance.hasClass('cur')){
						OrderHome.secviceInsurance.removeClass('cur');
						$("input[name='IsSelectedInsurance']").val('false');
					}else{
						OrderHome.secviceInsurance.addClass('cur');
						$("input[name='IsSelectedInsurance']").val('true');
					}
				}else if($(this).is('.service-pro')){
					tools.serviceProvision({
						"url":"/home/InfoUsingAuthorization", 
						"title":"信息使用授权书"
					})
				}else if( $(this).is(".authorization03") ){
					var _insuranceCompanyName = $('input[name="InsuranceCompanyName"]').val();
	                if( _insuranceCompanyName == 'syzx' ){
	                	tools.setCookie('InsComp', '2');
	                } else {
	                	tools.setCookie('InsComp', '1');
	                }
                	tools.serviceProvision({
						"url":"/home/AccidentInsurance", 
						"title":"100万出行意外险说明"
					})
				}
			});
		}
	}

	$(function(){
		OrderHome.init();
	})
