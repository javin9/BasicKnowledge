APIURL = APIURL || "http://api.chedai.bitauto.com/";

var userInfo = {};
userInfo.DownPaymentRate = "0.3";
userInfo.RepaymentPeriod = "36";
var $carDetail = $(".guidance_process_right .car_detail");
var $carImg = $(".guidance_process_right .car_img img");
var $carName = $(".guidance_process_right .car_name");
var $carType = $(".guidance_process_right .car_type");
var $buyCity = $(".guidance_process_right .car_local");

var $workUnit = $(".guidance_process_right .person_info").eq(0).find(".person_info_text");
var $credit = $(".guidance_process_right .person_info").eq(1).find(".person_info_text");
var $houseState = $(".guidance_process_right .person_info").eq(2).find(".person_info_text");
var $insurance = $(".guidance_process_right .person_info").eq(3).find(".person_info_text");
var $funds = $(".guidance_process_right .person_info").eq(4).find(".person_info_text");
var $income = $(".guidance_process_right .person_info").eq(5).find(".person_info_text");

var $person_info_detail = $(".person_info_detail");
var $personName = $(".guidance_process_right .person_name_text");
var $personID = $(".guidance_process_right .person_id_text");
var $personPhone = $(".guidance_process_right .person_person_phone_text");

var GetCarInfo = function(carId, callBack) {
    var url = APIURL + "api/Common/GetCarBaseInfo?callback=?";
    /*$.getJSON(url, {carId: carId, imgSizeType: 1}, function (data) {
        console.log(data)
        callBack(data);
    });*/

    $.ajax({
        dataType: "jsonp",
        url: APIURL + "api/Common/GetCarBaseInfo",
        type: "get",
        data: { carId: carId, imgSizeType: 1 },
        success: function(data) {
            callBack(data);
        },
        error: function() {
            console.log("error");
        }
    })
}

module.exports.setStepInfo = function(stepIndex, data) {
    userInfo.lc = false;
    switch (stepIndex) {
        case 0:
            GetCarInfo(data.carId, function(json) {
                let sName = json.Data.CarSerialName.indexOf(json.Data.CarBrandName) != -1 ? json.Data.CarSerialName.replace(json.Data.CarBrandName, '') : json.Data.CarSerialName
                $carImg.attr("src", json.Data.CarSerialImgUrl);
                $carName.html(json.Data.CarBrandName + ' - ' + sName + ' - ' + json.Data.CarName);
                $carType.html('');
            });
            $buyCity.html("参考价：<span style='color:#E9474D'>" + data.carPrice + '万</span>');
            setTimeout(() => {
                $carDetail.show();
            }, 500)

            $('.guidance_step_state').show();
            //写入等提交的对象中
            userInfo.CarId = data.carId;
            userInfo.CarPrice = data.carPrice;
            userInfo.BuyCarCityID = data.buyCarCityID;
            userInfo.CityId = data.cityID;
            break;
        case 1:
            if (data.career != null) {

                $workUnit.html(data.career_text);
                $(".guidance_process_right .person_info").eq(0).show(300);
                //userInfo.WorkUnit = data.workUnit;
                userInfo.Career = data.career;
            }
            if (data.credit != null) {
                $credit.html(data.credit_text);
                $(".guidance_process_right .person_info").eq(1).show(300);
                userInfo.Credit = data.credit;
            }
            break;
        case 2:
            if (data.houseState != null) {
                $houseState.html(data.houseState_text);
                $(".guidance_process_right .person_info").eq(2).show(300);
                userInfo.HouseState = data.houseState;
            }
            if (data.insurance != null) {
                // console.log(data.funds_text)
                if (!data.funds_text) {
                    $insurance.html(data.insurance_text);
                } else {
                    $insurance.html(data.insurance_text);
                }

                $(".guidance_process_right .person_info").eq(3).show(300);
                userInfo.Insurance = data.insurance;

            }
            if (data.insurance != null && data.funds != null) {
                $funds.html(data.funds_text);
                $(".guidance_process_right .person_info").eq(4).show(300);
                userInfo.Funds = data.funds;
            }
            break;
        case 3:
            $income.html("月收入" + data.income_text);
            $(".guidance_process_right .person_info").eq(5).show(300);
            //写入等提交的对象中
            userInfo.Income = data.income;

            userInfo.lc = true;
            if (isAuthenticated) {
                // $personName.html("姓名：" + userName);
                // $personID.html("身份证号：" + IdentityNumber);
                // $personPhone.html("手机号：" + mobile);
                // $person_info_detail.show();
                $("#suerBtn_step_5").css('background', '#e9474d');
            }
            break;
        case 4:

            $personName.html("姓名：" + data.userName);
            $personID.html("身份证号：" + data.certificateNumber);
            if (data.userMobile) {
                $personPhone.html("手机号：" + data.userMobile);
            } else {
                $personPhone.html("手机号：" + mobile);
            }


            $person_info_detail.show();
            //写入等提交的对象中
            userInfo.Name = data.userName;
            userInfo.isOK = data.isOK;
            userInfo.CertificateType = data.certificateType;
            userInfo.CertificateNumber = data.certificateNumber;
            userInfo.Telephone = data.userMobile;
            userInfo.IntentTimeOfPhone = data.intentTimeOfPhone;
            break;
    }
}

module.exports.getJsonUserInfo = function() {

    userInfo.DownPaymentRate = "0.3";
    userInfo.RepaymentPeriod = "36";
    userInfo.Channel = "605";
    userInfo.Source = source;
    userInfo.From = from;

    return userInfo;
}