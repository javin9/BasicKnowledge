import check from 'libs/check';
var phoneRexp = new RegExp(/^(13[0-9]|15[0-9]|18[0-9]|17[0-9]|14[0-9])\d{8}$/);

var ValidateName = function (name) {
	var isSuccess = true;
	var NameReg = new RegExp(/^[\u4e00-\u9fa5]{2,8}$/);
	if (!name.match(NameReg)) {
		isSuccess = false;
		$("#spanSpouseName").text("请输入正确的姓名！");
		$("#spanSpouseName").show();
	} else {
		$("#spanSpouseName").hide();
	}
	return isSuccess;
}

var ValidateCertificateNumber = function (certificateType, certificateNumber) {
	var isSuccess = true;
	if (certificateType == "105" && !check.isID(certificateNumber)) {
		isSuccess = false;
	} else {
		$("#spanCertificateType").hide();
	}
	return isSuccess;
}

var secretaryFamilyInfo = function () {
	var certificateType = $("#CertificateType").val();
	var certificateNumber = $("#CertificateNumber").val();
	var maritalStatus = $(":radio[name='MaritalStatus']:checked").val();
	var orderId = $("#OrderID").val();
	var isMarried = false;
	var spouseName = $("#SpouseName").val();
	var spouseMobile = $("#SpouseMobile").val();
	var spouseIncome = $("#SpouseIncome").val();
	var loanUserId = $("#loanUserId").val();
	if (maritalStatus == 215 && spouseName == "" && spouseMobile == "" && certificateNumber == "") {
		var str = "请选择证件类型!";
		if (certificateType != "-1") {
			str = "证件号码不为空!";
		}
		$("#spanCertificateType").text(str);
		$("#spanCertificateType").show();
		$("#spanSpouseName").html("姓名不能为空!");
		$("#spanSpouseName").show();
		$("#spanSpouseMobile").show();
		$("#spanSpouseMobile").text("电话不能为空!");
		return;
	}
	if (certificateType == "-1") {
		$("#spanCertificateType").text("请选择证件类型!");
		$("#spanCertificateType").show();
		return;
	} else {
		$("#spanCertificateType").hide();
	}
	if (maritalStatus == undefined) {
		alert("请选择婚姻状态!");
		return;
	}
	if (certificateNumber == "") {
		$("#spanCertificateType").text("证件号码不为空!");
		$("#spanCertificateType").show();
		return;
	} else if (!ValidateCertificateNumber(certificateType, certificateNumber)) {
		$("#spanCertificateType").empty();
		$("#spanCertificateType").text("证件号码格式不正确!");
		$("#spanCertificateType").show();
		return;
	} else {
		$("#spanCertificateType").hide();
	}
	//验证护照
	if (certificateType == "106" && certificateNumber != "" && !certificateNumber.match(/^1[45][0-9]{7}|G[0-9]{8}|P[0-9]{7}|S[0-9]{7,8}|D[0-9]+$/)) {
		$("#spanCertificateType").empty();
		$("#spanCertificateType").text("证件号码格式不正确!");
		$("#spanCertificateType").show();
		return;
	} else {
		$("#spanCertificateType").hide();
	}
	if (maritalStatus == 215) {
		if (spouseName == "") {
			$("#spanSpouseName").html("姓名不能为空!");
			$("#spanSpouseName").show();
			return;
		} else if (!ValidateName(spouseName)) {
			return;
		} else {
			$("#spanSpouseName").hide();
		}
		isMarried = true;
		if (spouseMobile == "") {
			$("#spanSpouseMobile").show();
			$("#spanSpouseMobile").text("电话不能为空!");
			return;
		} else {
			if (!$("#SpouseMobile").val().trim().match(phoneRexp)) {
				$("#spanSpouseMobile").text("电话格式不正确!");
				$("#spanSpouseMobile").show();
				return;
			} else {
				$("#spanSpouseMobile").hide();
			}
		}
	}

	var postdata = {
		"IsMarried": isMarried, "CertificateType": certificateType, "CertificateNumber": certificateNumber, "OrderId": orderId, "MaritalStatus": maritalStatus,
		"Name": spouseName, "Income": spouseIncome, "Mobile": spouseMobile, "LoanUserId": loanUserId
	};
	$.ajax({
		url: AddSpouseInfoUrl,
		type: "Post",
		data: postdata,
		success: function (data, textStatus, jqXHR) {
			if (data.Result == 1) {
				var orderId = data.Data;
				$("#CertificateNumber").val('');
				$("#SpouseMobile").val('');
				$("#SpouseName").val('');
				window.location.href = SuccessUrl + "?OrderId=" + orderId;
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
		},
		complete: function (jqXHR, textStatus) {
		}
	});
}

var s = {

	init: function () {
		$("#FamilyInfoPrev").bind("click", function () {
			var loanUserId = $("#loanUserId").val();
			var orderId = $("#OrderID").val();
			window.location.href = FinancialQualificationUrl + "?loanUserId=" + loanUserId + "&OrderId=" + orderId;
		});

		$(":radio[name='MaritalStatus']").bind("click", function () {
			if ($(this).val() == 216) {
				$(".f-list li.spouse").hide();
			} else {
				$(".f-list li.spouse").show();
			}
		});

		$("#complete").bind("click", function () {
			secretaryFamilyInfo();
		});

		$("#CertificateNumber").blur(function () {
			var certificateType = $("#CertificateType").val();
			var certificateNumber = $("#CertificateNumber").val();

			if (certificateType == "-1") {
				$("#spanCertificateType").text("请选择证件类型!");
				$("#spanCertificateType").show();
				return;
			} else {
				$("#spanCertificateType").hide();
			}

			if (certificateNumber == "") {
				$("#spanCertificateType").text("证件号码不为空!");
				$("#spanCertificateType").show();
				return;
			} else if (!ValidateCertificateNumber(certificateType, certificateNumber)) {
				$("#spanCertificateType").empty();
				$("#spanCertificateType").text("证件号码格式不正确!");
				$("#spanCertificateType").show();
				return;
			} else {
				$("#spanCertificateType").hide();
			}
			//验证护照
			if (certificateType == "106" && certificateNumber != "" && !certificateNumber.match(/^1[45][0-9]{7}|G[0-9]{8}|P[0-9]{7}|S[0-9]{7,8}|D[0-9]+$/)) {
				$("#spanCertificateType").empty();
				$("#spanCertificateType").text("证件号码格式不正确!");
				$("#spanCertificateType").show();
				return;
			} else {
				$("#spanCertificateType").hide();
			}
		})

		$("#SpouseName").blur(function () {
			var maritalStatus = $(":radio[name='MaritalStatus']:checked").val();
			var spouseName = $("#SpouseName").val();
			if (maritalStatus == 215) {
				if (spouseName == "") {
					$("#spanSpouseName").html("姓名不能为空!");
					$("#spanSpouseName").show();
					return;
				} else if (!ValidateName(spouseName)) {
					return;
				} else {
					$("#spanSpouseName").hide();
				}
			}
		})

		$("#SpouseMobile").blur(function () {
			var maritalStatus = $(":radio[name='MaritalStatus']:checked").val();
			var spouseMobile = $("#SpouseMobile").val();
			//var phoneRexp = new RegExp(/^(13[0-9]|15[0-9]|18[0-9]|17[0-9]|14[0-9])\d{8}$/);

			if (maritalStatus == 215) {
				if (spouseMobile == "") {
					$("#spanSpouseMobile").show();
					$("#spanSpouseMobile").text("电话不能为空!");
					return;
				} else {
					if (!$("#SpouseMobile").val().trim().match(phoneRexp)) {
						$("#spanSpouseMobile").text("电话格式不正确!");
						$("#spanSpouseMobile").show();
						return;
					} else {
						$("#spanSpouseMobile").hide();
					}
				}
			}
		})
	}
}

s.init();

module.exports = s;
