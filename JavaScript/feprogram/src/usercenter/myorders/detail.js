import './order.scss'
import './detail.scss'
import ko from 'knockout'


	var Main = {
		isIE8 : navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/8./i) == "8.",
		isIE9 : navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i) == "9."
	};

	var RefundViewModel = {
		OrderId : ko.observable(),
		childOrderId : ko.observable(),
		carName : ko.observable(),
		carPrice : ko.observable(),
		carImageUrl : ko.observable(),
		orderAmount : ko.observable(),
		packageCompanyName : ko.observable(),
		companyName : ko.observable(),
		companyLogoUrl : ko.observable(),
		loanPackageGifts:ko.observableArray()
	};

	$(function () {
		var _visibleLine = 2,
			_totalLine = $('.deta_item_body .flow_td').length,
			_visibleHeight = 0;

		var $flowTrigger = $('#btnShowFlow'),
			$flowTarget = $('#detaFlowBody'),
			$paybtn = $('#btnPayOk'), // 去支付按钮
			$refundBtn = $('#btnRepayOk'), // 去退款按钮
			$refundOkBtn = $('#btnRefundOk'); // 退款确定按钮

		ko.applyBindings(RefundViewModel);

		if (_totalLine <= _visibleLine)
			$flowTrigger.remove();
		for (var i = 0; i < _visibleLine && i < _totalLine; i++) {
			_visibleHeight += $('.deta_item_body .flow_td:nth-child(' + (i + 1) + ')').height();
		}
		$flowTarget.css('height', _visibleHeight + 'px');
		$flowTarget.find('.flow_td:first').addClass('current');
		$flowTarget.find('.flow_td:nth-child(' + _visibleLine + ')').addClass('first');
		$flowTrigger.click(function () {
			if (!$(this).hasClass('arr-up')) {
				$flowTarget.css('height', '');
				$(this).text('收起').addClass('arr-up');
				$flowTarget.find('.flow_td:last').addClass('first').siblings().removeClass('first');
			} else {
				$flowTarget.css('height', _visibleHeight + 'px');
				$(this).text('查看更多').removeClass('arr-up');
				$flowTarget.find('.flow_td:nth-child(' + _visibleLine + ')').addClass('first').siblings().removeClass('first');
			}
		});
		var $fixTrigger = $('#payLayer');
		var $fixTarget = $('#payLayerFix');
		var _winH = $(window).height();
		var _fixTriY = $fixTrigger.length != 0 ? $fixTrigger.offset().top : 0;

		// 底部悬浮栏
		// $(window).on("scroll", function () {
		// 	var footerHeight = $('#Footer').height();
		// 	var pageHei = $('.pagewrap').height();
		// 	var winScrollTop = $(window).scrollTop();
		// 	var abc = $(window).height() - footerHeight;
		// 	if (winScrollTop > abc) {
		// 		$('#payLayerFix').removeClass('fixed').slideDown();
		// 	} else {
		// 		$('#payLayerFix').addClass('fixed').slideDown();
		// 	}
		// });

		if (adviserId == 0) {
			$('#adviser_div').hide();
		} else {
			var url ='http://adviserapi.daikuan.com/getadviser/' + adviserId;
			if(typeof adviserUrl=="string")
			{
				url= adviserUrl+ adviserId;
			}
			$.ajax({
				url : url,
				type : "GET",
				dataType : "Jsonp",
				//data : data,
				success : function (res) {
					if (!res.SkillLevelId){
						$('#adviser_div').hide();
						return false
					}else {
						var SkillLevelTxt;
						if (res.SkillLevelId == 1) {
							SkillLevelTxt = '铜牌顾问';
						} else if (res.SkillLevelId == 2) {
							SkillLevelTxt = '银牌顾问';
						} else if (res.SkillLevelId == 3) {
							SkillLevelTxt = '金牌顾问';
						}
						$('#financialData').html('<div class="financial_l" data-id="' + res.Id + '" data-WorkingYears="' + res.WorkingYears + '" >'
							+ '<div class="financial_img">'
							+ '<div class="photo_bg"></div>'
							+ '<img src="' + res.Photo + '" class="photo" />'
							+ '</div>'
							+ '<dl class="financial_dl">'
							+ '<dt class="dt">我是您的专属' + SkillLevelTxt + '-' + res.Name + '</dt>'
							+ '<dd class="dd">'
							+ '<span class="l">已帮' + res.ServeNumber + '人分期</span>'
							+ '<span class="r">' + res.Rate + '%好评</span>'
							+ '</dd>'
							+ '</dl>'
							+ '</div>'
							+ '<div class="financial_r">'
							+ '<div class="tell highlight"><i class="tel"></i>' + res.Phone + '</div>'
							+ '<div class="col_grey"><span class="highlight">*</span> 扫描底部二维码，关注官方微信号<br/>进度状态随时跟进</div>'
							+ '</div>')
					}
				},
				error: function (xhr, textStatus, errorThrown) {    
					debugger;
					if (xhr.status == 401)
					{
						tools.showAlert("请先登录", 3000);
							setTimeout(function(){
								window.location = USERCENTERURL;
							},3000);
						return;
					}								
					tools.showAlert("服务器异常,请稍后再试");
				}
			});
		}

		//去支付
		$paybtn.on("click", function () {
			var childOrderId = $(this).attr("data-childorderid");
			var payUrl="";
			$.ajax({				
				url: '/MyOrder/CheckPayment?childOrderId=' + childOrderId,
                type: "GET",
				dataType : 'json',
				async:false, 
                success: function (res) {
                    if (res.Result) {
                        window.location.href = res.Data;
                    } else {
						tools.showAlert(res.Message, 3000);
						setTimeout(function(){
							location.reload();
						},3000);
                    }
                },
				error: function (xhr, textStatus, errorThrown) {    
					if (xhr.status == 401)
					{
						tools.showAlert("请先登录", 3000);
							setTimeout(function(){
								window.location = USERCENTERURL;
							},3000);
						return;
					}								
					tools.showAlert("服务器异常,请稍后再试");
				}
            })
		});

		// 去退款
		$('.pop_x, #btnRefundCancle').on('click', function () {				
			$(this).parents('.page_pop').hide();
			$("#refundReason").attr("data-id","-1").html("请选择");
			$("#refundRemark,#refundRemark-lab").hide();
			$(".remind1,.remind2").hide();
			$("#refundRemark").val("");
		});

		$refundOkBtn.on('click', function () {
			if ($(".select .select-ctrl>div").attr("data-id") == "-1") {
				$(".remind1").show();
				$(".remind2").hide();
			} else if ($(".select .select-ctrl>div").attr("data-id") == "0" && $.trim($("#refundRemark").val()) == "") {
				$(".remind2").show();
				$(".remind1").hide();
			} else {
				$(".remind1").hide();
				$(".remind2").hide();

				submitRefund();
			}
		});

		var childOrderId = '';

		$refundBtn.on("click", function(){
			childOrderId = $(this).attr("data-childorderid");
			$.ajax({
					url: '/MyOrder/CheckRefund?childOrderId=' + childOrderId,
					type: 'GET',
					dataTyppe: 'json',
					success: function(res){
						if( res.Result ){
							refundDetail();
						} else {
							tools.showAlert(res.Message, 3000);
							setTimeout(function(){
								location.reload();
							},3000);
						}
					},
					error: function (xhr, textStatus, errorThrown) {    
						if (xhr.status == 401)
						{
							tools.showAlert("请先登录", 3000);
							setTimeout(function(){
								window.location = USERCENTERURL;
							},3000);
							return;
						}								
						tools.showAlert("服务器异常,请稍后再试");
					}
				});
		});

		//退款详情
		function refundDetail() {
			var data = {
				childOrderId : childOrderId
			},
				_url = "/MyOrder/GetRefundDetail";
			sendAjax({
				url : _url,
				dataType : 'json',
				data : data
			}, callback);
			function callback(res) {
				if (res.Result) {
					var cur = res.Data;
					RefundViewModel.carName(cur.CarFullName);
					RefundViewModel.carPrice(cur.CarPriceText);
					RefundViewModel.carImageUrl(cur.CarImageUrl);
					RefundViewModel.orderAmount(cur.OrderAmount);
					if (cur.PackageName) {
						RefundViewModel.packageCompanyName(cur.CompanyShortCName + "--" + cur.PackageName);
					}
					RefundViewModel.companyName(cur.CompanyShortCName);
					RefundViewModel.companyLogoUrl(cur.CompanyLogoImage);

					$('#popRefund').show();

					if (Main.isIE8) {
						var popW = $('.pop_area').outerWidth(true),
						popH = $('.pop_area').outerHeight(true);
						$('.pop_area').css({
							'margin-left' : '-' + (popW / 2) + 'px',
							'margin-top' : '-' + (popH / 2) + 'px'
						});
					}
				}
				else{
					tools.showAlert(res.Message, 3000);
					setTimeout(function(){
						location.reload();
					},3000);
				}
			}
		}

		//确认退款
		function submitRefund() {
			var data = {
				childOrderId : childOrderId,
				refundReason : $("#refundReason").text()
			},
				_url = "/MyOrder/SubmitRefund";
			if ($("#refundReason").attr("data-id") == "0") {
				data.refundReason = $("#refundRemark").val();
			}
			$.ajax({
				url : _url,
				type : "POST",
				dataType : 'json',
				data : data,
				cache : false,
				async : true,
				beforeSend : function () {
					tools.showAlert("提交中", 24 * 60 * 60 * 1000);
					$("#maskLayer").css("z-index", 88890);
				},
				success : function (res) {
					if (res.Result) {
						$('#popRefund').hide();
						$("#showAlertBox").hide();
						$("#maskLayer").css("z-index", 88888).hide();					
						
						location.reload();						
					} else {
						tools.showAlert(res.Message, 3000);
						setTimeout(function(){
							location.reload();
						},3000);
					}
				},
				error: function (xhr, textStatus, errorThrown) {  
					$("#showAlertBox").hide();
					$("#maskLayer").css("z-index", 88888).hide();				
					if (xhr.status == 401)
					{
						tools.showAlert("请先登录", 3000);
						setTimeout(function(){
							window.location = USERCENTERURL;
						},3000);
						return;
					}								
					tools.showAlert("服务器异常,请稍后再试");
				}
			});
		}

		function sendAjax(options, _callback, _errorcallback) {
			var self = this;
			var setting = {
				url : '',
				timeout : 5000,
				type : 'get',
				dataType : 'json',
				cache : false,
				async : true,
				data : {}

			};
			setting = $.extend(setting, options);
			$.ajax({
				url : setting.url,
				type : setting.type,
				dataType : setting.dataType,
				async : setting.async,
				cache : setting.cache,
				data : setting.data,
				beforeSend : function () {},
				success : function (res) {
					_callback(res);
				},
				complete : function (XMLHttpRequest, textStatus) {
					if (textStatus == 'error') {
						if (_errorcallback) {
							_errorcallback(textStatus);
						}
					}
				},
				error: function (xhr, textStatus, errorThrown) {    
					if (xhr.status == 401)
					{
						tools.showAlert("请先登录", 3000);
						setTimeout(function(){
							window.location = USERCENTERURL;
						},3000);
						return;
					}								
					tools.showAlert("服务器异常,请稍后再试");
				}
			});
		}

		$(".select").selectControl(selCallBack, "click", "notRender");
		function selCallBack(res) {
			$(".remind1").hide();
			if (res == "0") {
				$("#refundRemark,#refundRemark-lab").show();
				if (Main.isIE8) {
					var popW = $('.pop_area').outerWidth(),
					popH = $('.pop_area').outerHeight();
					$('.pop_area').css({
						'margin-left' : '-' + (popW / 2) + 'px',
						'margin-top' : '-' + (popH / 2) + 'px'
					});
				}
			} else {
				$("#refundRemark,#refundRemark-lab").hide();
				if (Main.isIE8) {
					var popW = $('.pop_area').outerWidth(),
					popH = $('.pop_area').outerHeight();
					$('.pop_area').css({
						'margin-left' : '-' + (popW / 2) + 'px',
						'margin-top' : '-' + (popH / 2) + 'px'
					});
				}
			}
		}	
		
		//如何领取？
		$(".how-get-gift").hover(function(e){
			$(this).next(".tip").show();
		},function(e){
			$(this).next(".tip").hide();
		});
		
		$('.pop-up-layer .close-layer').on('click', function () {				
			$(this).parents('.pop-up-layer').hide();
			$("#maskLayer").hide();
		});
		
		//领取礼包
		$(".get-gifts").on("click",function(){				
			$.ajax({
				url : "/MyOrder/GetPackageGiftsByChildOrderId?childOrderId="+childOrderId,
				type : "GET",
				dataType : 'json',
				cache : false,
				async : true,
				success : function (res) {
					if(res.Data!=null && res.Data.length > 0)
					{
						var str="<dt>恭喜您贷款成功，您已获得：</dt>";
						for	(var i =0;i < res.Data.length ;i++){
							var item = res.Data[i];
							str += "<dd>" + item.GiftName +"<div>价值"+item.GiftValue+"元</div></dd>";
						}
						$("#popGifts dl").html("").html(str);
						$("#maskLayer").show();
						$('#popGifts').show();
					}
				},
				error: function (xhr, textStatus, errorThrown) {    
						if (xhr.status == 401)
						{
							tools.showAlert("请先登录", 3000);
							setTimeout(function(){
								window.location = USERCENTERURL;
							},3000);
							return;
						}								
						tools.showAlert("服务器异常,请稍后再试");
				}
			});			
		});
		
		//确定领取礼包
		$("#popGifts .confirm-btn").on("click",function(){
			if(!$(this).hasClass("submiting"))
			{			
				$.ajax({
					url : "/MyOrder/UpdateChildOrderPackageGiftReceived?childOrderId="+childOrderId,
					type : "POST",
					dataType : 'json',
					cache : false,
					async : true,
					beforeSend : function () {
						$("#popGifts .confirm-btn").addClass("submiting");
					},
					success : function (res) {						
						if (res.Result) {		
							$("#maskLayer").hide();
							$('#popGifts').hide();
							location.reload();
						} else {
							$('#popGifts').hide();	
							tools.showAlert(res.Message);	
						}
					},
					complete : function (XMLHttpRequest, textStatus) {
						$("#popGifts .confirm-btn").removeClass("submiting");
					},
					error: function (xhr, textStatus, errorThrown) {    
						if (xhr.status == 401)
						{
							tools.showAlert("请先登录", 3000);
							setTimeout(function(){
								window.location = USERCENTERURL;
							},3000);
							return;
						}								
						tools.showAlert("服务器异常,请稍后再试");
					}
				});
			}
		});

		// 赠险弹层			
		$('#popInsuranceTrig').click(function(){
			var _insuranceCompanyName = $(this).parents('.sec_insurance').find('img').data('companyname');
			// if( _insuranceCompanyName == 'syzx' ){
			// 	$('#popInsuranceCont2').removeClass('hide');
			// } else {
				$('#popInsuranceCont1').removeClass('hide');
			// }
			$('#maskLayer').show();
			var pageH = document.documentElement.clientHeight;
			if( $('.popInsuranceCont').height() > pageH -100 ){
				$('.popInsuranceCont').css({'top': '50px'});
				$('.popInsuranceCont .popCont_bd').css({'height': pageH - 154 + 'px', 'overflow-y': 'auto', 'top': '50px'});
			}
		});
		$('.popInsuranceCont .popCont_close').click(function(){
			$('#maskLayer').hide();
			$('.popInsuranceCont').addClass('hide');
		});
		
		//车主晒单-二维码
		$(".show_shareorder_QRCode").click(function(){
			$(".QRCode_box").removeClass("hide");
			$("#maskLayer").show();
		});
		$(".QRCode_box .closeEvent").click(function(){
			$(".QRCode_box").addClass("hide");
			$("#maskLayer").hide();
		});
	});
