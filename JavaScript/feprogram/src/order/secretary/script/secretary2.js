import check from 'libs/check';

var inputFnA = function (obj, spanid) {
	obj.on('focus', function () {
		$("#" + spanid).hide();
	});
	obj.on('blur', function () {
		if ($(this).val().trim() === '') {
			$("#" + spanid).show();
		}
	});
};

var secretaryQualification = function () {
	inputFnA($('#WorkUnit'), 'spanWorkUnit');
	var orderId = $("#orderId").val();
	var income = $("#Income").val();
	var credit = $("#Credit").val();
	var insurance = $("#Insurance").val();
	var funds = $("#Funds").val();
	var houseState = $("#HouseState").val();
	var career = $("#Career").val();
	var workUnit = $("#WorkUnit").val();
	var industryNature = $("#IndustryNature").val();
	if (career == "") {
		alert("请选择您的职业!");
		return;
	}
	if (workUnit == "" && industryNature == "-1") {
		$("#spanWorkUnit").show();
		$("#spanIndustryNature").show();
		return;
	} else {
		$("#spanWorkUnit").hide();
		$("#spanIndustryNature").hide();
	}
	if (workUnit == "") {
		$("#spanWorkUnit").show();
		return;
	} else {
		$("#spanWorkUnit").hide();
	}

	if (industryNature == "-1") {
		//alert("请选择行业性质!");
		$("#spanIndustryNature").show();
		return;
	} else {
		$("#spanIndustryNature").hide();
	}
	var cityId = tools.getCookie("userCityId");
	var provinceId = tools.getCookie("userProvinceId");
	//首付比和期限
	var paymentratio = tools.getCookie("userPaymentratio");
	var cycle = tools.getCookie("userCycle");
	var postdata = {
		"OrderId": orderId, "Income": income, "Credit": credit, "Insurance": insurance, "Funds": funds, "HouseState": houseState, "Career": career,
		"WorkUnit": workUnit, "IndustryNature": industryNature, "RegisteredResidence": "", "BuyCarCityID": cityId, "BuyCarProvinceID": provinceId,
		"Paymentratio": paymentratio, "Cycle": cycle
	};
	//return;
	$.ajax({
		url: SecretaryQualificationUrl,
		type: "Post",
		data: postdata,
		success: function (data, textStatus, jqXHR) {
			if (data.Result == 1) {
				var orderId = data.Data;
				window.location.href = FamilyInfoUrl + "?OrderId=" + orderId;
				//secretaryAddChildOrder(carId, cityId, orderId);
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
		},
		complete: function (jqXHR, textStatus) {
		}
	});
}

var ClickLi = function () {
	$(this).addClass('current').siblings().removeClass('current');          // 添加蓝色边框
	var _val = $(this).find('span').attr('value');
	$(this).parents('.pg_box').find('input[type="hidden"]').val(_val);      // 给隐藏的 input 赋值
	// 判断是否是最后一步
	if ($(this).parents('.pg_box').index() < $('.pg_box').length - 1) {
		$(this).parents('.pg_box').hide().next('.pg_box').show().find('li').removeClass('current');
	}
	$('.pg_box li.stepLi').off('click');
	setTimeout(function () {
		$('.pg_box li.stepLi').on('click', ClickLi);
	}, 500); // 500 ms
}


var s = {

	init: function () {
		$('.pg_box').on('click', 'a.Ql_last', function () {
			if ($(this).parents('.pg_box').is('.pg_box_fst')) {
				// 这里需要返回到 index 页面
				var orderId = $("#orderId").val();
				var channel = tools.getCookie("userChannel");
				var source = tools.getCookie("userSource");
				window.location.href = IndexUrl + "?OrderId=" + orderId + "&cha=" + channel + "&ref=" + source;
			} else {
				$(this).parents('.pg_box').hide().prev('.pg_box').show().find('li').removeClass('current');
			}
		});

		$('.pg_box li.stepLi').click(ClickLi);

		$("#lastPrev").bind("click", function () {
			$("#Career").val("");
		});

		$('#nextstep').click(function () {
			secretaryQualification();
		});
	}
}

s.init();

module.exports = s;
