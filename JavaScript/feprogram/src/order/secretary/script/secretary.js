
import check from 'libs/check';
import 'libs/carSelect/selCarThird.pc.js'


var cb = function (obj) {
	var $liCarPrice = $("#liCarPrice");
	$liCarPrice.prev().css("padding", 0);
	$liCarPrice.show().find("span").html("参考成交价：<span style='color:#c00;'>" + obj.data("val") + "</span>万");
}

var ReturnPrevOper = function () {
	var orderId = $("#OrderId").val();
	if (orderId != "") {
		//返回上一步绑定值操作
		var postdata = {
			"OrderId": orderId
		};
		$.ajax({
			url: ReturnIndexPrevOperUrl + "?OrderId=" + orderId,
			type: "Post",
			data: postdata,
			success: function (data, textStatus, jqXHR) {
				if (data != null) {
					$("#userName").val(data.Name);
					$("#userMobile").val(data.Telphone);
					$("#buyCarLimit").val(data.BuyCarLimit);
					//显示邮箱
					$("#userMail").val(data.Mail);
					//显示车名
					$("#CarsA").text(tools.getCookie("userCarFullName"));
					var carId = tools.getCookie("userCarId");
					MortgageView.CarId(carId);
					//返回车价
					var carPrice = tools.getCookie("userCarPrice");
					MortgageView.CarPriceVal(carPrice);
					//显示首付比率和贷款期限
					var userPaymentratio = tools.getCookie("userPaymentratio");
					var userCycle = tools.getCookie("userCycle");
					$("#Paymentratio").val(userPaymentratio);
					$("#Cycle").val(userCycle);
					$("#BuyCarProvinceA").text(tools.getCookie("provinceName"));
					$("#BuyCarCityA").text(tools.getCookie("cityName"));
					$("#BuyCarProvinceInput").val(tools.getCookie("userProvinceId"));
					$("#BuyCarCityInput").val(tools.getCookie("userCityId"));
					$("#Gender").val(tools.getCookie("userGender"));
					//绑定比较对象
					MortgageView.CompareCarId(carId);
					MortgageView.CompareCityId(tools.getCookie("userCityId"));
					MortgageView.CompareIntentTime(data.BuyCarLimit);
					MortgageView.CompareCarRatio(userPaymentratio);
					MortgageView.CompareCarTerm(userCycle);

					MortgageView.CompareUserName(data.Name);
					MortgageView.CompareUserGender(data.Gender);
					MortgageView.CompareUserEmail(data.Mail);
					MortgageView.CompareUserMobile(data.Telphone);
					MortgageView.CompareOrderId(orderId);

					$('.daikuan_pg:lt(2)').hide();
					$('.daikuan_pg:eq(2)').show();
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
			},
			complete: function (jqXHR, textStatus) {
			}
		});
	}
}

var secretaryIndexOper = function () {
	//var carId = $("#carId").val();
	carId = MortgageView.CarId();
	buyCarLimit = $("#buyCarLimit").val();
	provinceId = $("#BuyCarProvinceInput").val();
	cityId = $("#BuyCarCityInput").val();
	userName = $("#userName").val();
	userMobile = $("#userMobile").val();
	userMail = $("#userMail").val();
	paymentratio = $("#Paymentratio").val();
	userGender = $("#Gender").val();
	validatecode = $("#validatecode").val();
	imageValidateCode = $("#imageValidateCode").val();
	cycle = $("#Cycle").val();

	if (userName == "" && userMobile == "") {
		$("#spanUserName").show();
		$("#spanUserMobile").text("手机号不能为空!");
		$("#spanUserMobile").show();
	} else {
		$("#spanUserName").hide();
		$("#spanUserMobile").hide();
	}
	if (!ValidateName(userName)) {
		return;
	}
	if (userMobile == "") {
		$("#spanUserMobile").text("手机号不能为空!");
		$("#spanUserMobile").show();
		return;
	}
	var phoneRexp = new RegExp(/^(13[0-9]|15[0-9]|18[0-9]|170)\d{8}$/);
	//var phoneRexp = /^(13[0-9]|15[0-9]|18[0-9])\d{8}$/;
	if (userMobile != "") {
		if (!$("#userMobile").val().trim().match(phoneRexp)) {
			$("#spanUserMobile").text("手机号格式不正确!");
			$("#spanUserMobile").show();
			return;
		} else {
			$("#spanUserMobile").hide();
		}
	}

	var count = 0;
	$.ajax({
		url: '/LoanApply/MobileRepeatCheck?mobile=' + userMobile,
		success: function (res) {
			if (res.hasOwnProperty("RecordCount"))
				count = res.RecordCount;
		},
		async: false
	});

	if (count > 2) {
		$('.popup_submit').show();
		$('.popup_submit .btn-close').click(function () {
			$('.popup_submit').hide();
		});
		return;
	}
	var retMail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
	if (userMail != "") {
		if (!retMail.test(userMail)) {
			$("#spanUserMail").show();
			return;
		} else {
			$("#spanUserMail").hide();
		}
	}
	if (!$("#validatecode").parents("li").hasClass("hide")) {
		if (validatecode == "") {
			$("#validatecode").parents("li").find(".alert").show();
			return;
		}

		if (imageValidateCode == "") {
			$("#imageValidateCode").parents("li").find(".alert").show();
			return;
		}

		$ajax({
			url: "/user/CheckValidateCode",
			data: { username: userMobile, validatecode: validatecode, imageValidateCode: imageValidateCode },
			success: function (res) {
				if (res.Result) {
					nextFn();
				} else {
					var $dom;
					var message = "";
					if (res.Data == "4")
						$dom = $("#validatecode");
					else if (res.Data == "1")
						$dom = $("#imageValidateCode");
					else if (res.Data == "3")
						$dom = $("#userMobile");
					$dom.next().text(res.Message).show();
				}
			}
		});
		return;
	} else
		nextFn();
}

var nextFn = function () {
	//var carPrice = 112579;
	//获取裸车价格
	var carPrice = MortgageView.CarPriceVal();
	carPrice = carPrice;
	tools.setCookie("userCarPrice", carPrice);
	//省份名称
	var provinceName = $("#BuyCarProvinceA").text();
	//城市名称
	var cityName = $("#BuyCarCityA").text();
	//获取意向接电话时间 
	var intentTimeOfPhone = $("#buyCarIntentTimeOfPhone").val();//2015-06-10 gongzeyu
	//取车的名称
	var carFullName = MortgageView.CarsFullVal();
	//获取渠道和来源
	var channel = $("#Channel").val();
	var source = $("#Source").val();

	//存Cookie
	tools.setCookie("userPaymentratio", paymentratio);
	tools.setCookie("userCycle", cycle);
	tools.setCookie("userCarId", carId);
	tools.setCookie("userCarFullName", carFullName);
	tools.setCookie("userCityId", cityId);
	tools.setCookie("userProvinceId", provinceId);
	tools.setCookie("provinceName", provinceName);
	tools.setCookie("cityName", cityName);
	tools.setCookie("userChannel", channel);
	tools.setCookie("userSource", source);
	tools.setCookie("userGender", userGender);
	//比较是否是新的订单
	var isOldOrder = false;
	var orderId = "";
	if (Compare(carId, cityId, buyCarLimit, paymentratio, cycle, userName, userGender, userMobile)) {
		isOldOrder = true;
		orderId = MortgageView.CompareOrderId();
	}
	var postdata = {
		"CarId": carId, "BuyCarLimit": buyCarLimit, "CityId": cityId, "Name": userName, "IntentTimeOfPhone": intentTimeOfPhone, "Telephone": userMobile, "Mail": userMail, "Gender": userGender, "Channel": channel, "Source": source,
		"OrderId": orderId, "From": GetFromCode(), "DownPaymentRate": paymentratio, "RepaymentPeriod": cycle, "CarPrice": carPrice, "PackageType": 0, "ProductID": "", "IsOldOrder": isOldOrder
	};
	//$("#btn_divstep3").attr("disabled", "disabled").unbind("click");
	$.ajax({
		url: SecretaryIndexUrl,
		type: "Post",
		data: postdata,
		async: false,
		success: function (data, textStatus, jqXHR) {
			if (data.Result == 1) {
				var orderId = data.Data.OrderId;
				//secretaryAddChildOrder(carId, cityId, carPrice, orderId, paymentratio, cycle, isOldOrder);
				window.location.href = FinancialQualificationUrl + "?OrderId=" + orderId;
			} else {
				$('.popup_submit').show();
				$('.popup_submit .btn-close').click(function () {
					$('.popup_submit').hide();
				});
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			$("#btn_divstep3").removeAttr("disabled").bind("click", function () { secretaryIndexClick(this); });
		},
		complete: function (jqXHR, textStatus) {
		}
	});
}

var secretaryAddChildOrder = function (carId, cityId, carPrice, orderId, paymentratio, cycle, isOldOrder) {
	var postdata = {
		"DownPaymentRate": paymentratio, "RepaymentPeriod": cycle, "OrderID": orderId, "CarId": carId, "CityId": cityId, "CarPrice": carPrice, "PackageType": 0, "ProductID": "", "IsOldOrder": isOldOrder
	};
	$.ajax({
		url: "/secretary/SecretaryAddChildOrder",
		type: "Post",
		data: postdata,
		success: function (data, textStatus, jqXHR) {
			if (data.Result == 1) {
				window.location.href = "/secretary/FinancialQualification?OrderId=" + orderId + "&Paymentratio=" + paymentratio + "&Cycle=" + cycle;
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			$("#btn_divstep3").removeAttr("disabled").bind("click", function () { secretaryIndexClick(this); });
		},
		complete: function (jqXHR, textStatus) {
		}
	});
}

var ValidateName = function (name) {
	var isSuccess = true;
	var NameReg = new RegExp(/^[\u4e00-\u9fa5]{2,8}$/);
	if (name == "") {
		isSuccess = false;
		$("#spanUserName").show();
	} else {
		if (!name.match(NameReg)) {
			isSuccess = false;
			$("#spanUserName").text("请输入正确的用户名！");
			$("#spanUserName").show();
		} else {
			$("#spanUserName").hide();
		}
	}
	return isSuccess;
}

var Compare = function (carId, cityId, buyCarLimit, carRatio, carTerm, userName, userGender, userMobile) {
	var isOld = true;
	isOld &= (carId == MortgageView.CompareCarId());
	isOld &= (cityId == MortgageView.CompareCityId());
	isOld &= (buyCarLimit == MortgageView.CompareIntentTime());
	isOld &= (carRatio == MortgageView.CompareCarRatio());
	isOld &= (carTerm == MortgageView.CompareCarTerm());
	isOld &= (userName == MortgageView.CompareUserName());
	isOld &= (userGender == MortgageView.CompareUserGender());
	isOld &= (userMobile == MortgageView.CompareUserMobile());
	return isOld;
}

var secretaryIndexClick = function (obj) {
	$(obj).attr("disabled", "disabled").unbind("click");
	secretaryIndexOper();
}

var GetFromCode = function () {
	var from = tools.getCookie("from");
	return from;
}



var s = {

	init: function () {
		$("#CarsA").selCar2({
			OnlyOnSale: true,
			Callback: cb
		});

		//ko.applyBindings(MortgageView2);

		var city_sel = new CitySel({ ProvinceUlId: "BuyCarProvinceUl", CityUlId: "BuyCarRegisterCityUl" });
		city_sel.GetProvinces();

		$(document).on("click", function (e) {
			e = e || window.event;
			var $target = $(e.target);
			if ($target.is("#BuyCarProvinceA")) {
				$("#spanCityId").hide();
				$("#BuyCarProvinceUl").show()
			} else {
				if ($target.is("#BuyCarProvinceUl li")) {
					$(".BuyCarProvinceA").text($target.text()).attr("data-id", $target.attr("data-id"));
					$(".BuyCarCityA").empty();
					$("#BuyCarCityInput").val("");
					$("#BuyCarProvinceUl").hide();
					$("#BuyCarCityUl").show();
					$("#BuyCarProvinceInput").val($target.attr("data-id"))
				} else {
					if ($target.is(".BuyCarCityA")) {
						$("#spanCityId").hide();
						$("#BuyCarCityUl").show()
					} else {
						if ($target.is("#BuyCarCityUl li")) {
							$(".BuyCarCityA").text($target.text()).attr("data-id", $target.attr("data-id"));
							$("#BuyCarProvinceUl").hide();
							$("#BuyCarCityUl").hide();
							$("#BuyCarCityInput").val($target.attr("data-id"));
						} else {
							$("#BuyCarProvinceUl").hide();
							$("#BuyCarCityUl").hide()
						}
					}
				}
			}
		});

		$('.StepNext').on('click', function () {
			var index = $(this).parents('.daikuan_pg').index();
			index++;
			if (index == 1) {
				//取车的ID
				var carId = MortgageView.CarId();
				//取城市ID
				var cityId = $("#BuyCarCityInput").val();
				if ((carId == "" || carId == undefined) && (cityId == "" || cityId == undefined)) {
					$("#spanCarId").show(); $("#spanCityId").show();
					return;
				}
				if (carId == "" || carId == undefined) {
					$("#spanCarId").show();
					return;
				} else { $("#spanCarId").hide(); }
				if (cityId == "" || cityId == undefined) {
					$("#spanCityId").show();
					return;
				} else { $("#spanCityId").hide(); }
			}
			if (index == 3) {
				secretaryIndexOper();
			}
			$('.daikuan_pg').eq(index).show().siblings().hide();

			//CalculateCarRatio(MortgageView.CarPriceVal());
			$("#Paymentratio option").each(function (index, item) {

				var ratio = $(this).val();

				$(this).html(ratio * 100 + "%" + "  (首付" + Math.round((MortgageView.CarPriceVal() * ratio) * 100) / 100 + "万)");
			});
		});

		$('.StepPrev').on('click', function () {
			$('.alert').hide();
			var index = $(this).parents('.daikuan_pg').index();
			index--;
			$('.daikuan_pg').eq(index).show().siblings().hide();
		});

		$("#userName").blur(function () {
			ValidateName(this.value);
		})

		$("#userMobile").blur(function () {
			if ($("#userMobile").val() == "") {
				$("#spanUserMobile").text("手机号不能为空!");
				$("#spanUserMobile").show();
				return;
			}
			var phoneRexp = new RegExp(/^(13[0-9]|15[0-9]|18[0-9]|170)\d{8}$/);
			//var phoneRexp = /^(13[0-9]|15[0-9]|18[0-9])\d{8}$/;
			if ($("#userMobile").val() != "") {
				if (!$("#userMobile").val().trim().match(phoneRexp)) {
					$("#spanUserMobile").text("手机号格式不正确!");
					$("#spanUserMobile").show();
					return;
				} else {
					$("#spanUserMobile").hide();
				}
			}
		})

		$("#userMail").blur(function () {
			var retMail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
			if ($("#userMail").val() != "") {
				if (!retMail.test($("#userMail").val())) {
					$("#spanUserMail").show();
					return;
				} else {
					$("#spanUserMail").hide();
				}
			}
		})

		ReturnPrevOper();
	}
}

s.init();

module.exports = s;
