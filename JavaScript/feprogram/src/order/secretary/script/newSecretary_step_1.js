import 'libs/carSelect/selCarThird.pc.js';
import 'libs/selCity';

module.exports.init = function() {
    var carType = null;
    var carId = null;
    var carPrice = null;
    var buyCarCityName = null;
    var buyCarCityID = null;
    var cityID = null;
    var citySpell = null;




    //默认城市
    buyCarCityID = city.cityId;
    $("#cityText").html(city.cityName);
    buyCarCityName = city.cityName;
    cityID = city.cityId;
    citySpell = city.citySpell;

    if (carInfo != null) {
        $("#cartypeHiddenText").css("visibility", "hidden");
        $('#cartypeText').css("color", "#000");
        $("#suerBtnp_step_1").attr('data', '1');
        $("#suerBtnp_step_1").css('background', '#e9474d');
        let sName = carInfo.CarSerialName.indexOf(carInfo.CarBrandName) != -1 ? carInfo.CarSerialName.replace(carInfo.CarBrandName, '') : carInfo.CarSerialName
        carType = carInfo.CarBrandName + ' - ' + sName + ' - ' + carInfo.CarName;
        $("#cartypeText").text(carType)
        carId = carInfo.CarId;
        carPrice = carInfo.CarReferPrice + "万";
        setImmediate(() => {
            triggerCarSelectData();
        })
    }
    //车型列表选择
    $("#cartypeText").selCar2({
        OnlyOnSale: true,
        Callback: function(data) {

            $("#cartypeHiddenText").css("visibility", "hidden");
            $('#cartypeText').css("color", "#000");
            $("#suerBtnp_step_1").attr('data', '1');
            $("#suerBtnp_step_1").css('background', '#e9474d');
            carType = $("#cartypeText").text();
            //carId = "112778";
            carId = data.data("id") + "";
            carPrice = data.data("val") + "";
            //console.log(data.data("val"));
            //推荐
            if (carId != null && cityID != null) {
                triggerCarSelectData();
            }
        }
    });
    $('#liveCity').on('click', () => {
        $('#CarSelCon').hide();
    });
    //城市列表选择
    $("#liveCity").selCity({
        isRelationHeader: false,
        isSetCookie: false,
        callBacks: function(obj) {
            //console.log(obj);
            $("#cityText").html(obj.cityName);
            buyCarCityName = $("#cityText").text();
            buyCarCityID = obj.cityId + "";
            cityID = obj.cityId + "";
            citySpell = obj.citySpell + "";
            //推荐
            if (carId != null && cityID != null) {
                triggerCarSelectData();
            }
        }
    });

    $("#suerBtnp_step_1").click(function(e) {
        if ($(this).attr('data') == '0') {
            return;
        }
        if (carId != null && buyCarCityID != null) {
            $(this).trigger("nextStep");
        } else {
            //alert("请选择车型和购买城市!");
            if (carId != null) {
                Tools.showAlert("请选择购买城市！");
            } else if (buyCarCityID != null) {
                Tools.showAlert("请选择车型！");
            }
        }
    });

    function triggerCarSelectData() {
        $("#suerBtnp_step_1").trigger("dataSelect", {
            carId: carId,
            carPrice: carPrice,
            buyCarCityID: buyCarCityID,
            cityID: cityID,
            buyCarCityName: buyCarCityName
        });
    }

    //获得推荐
    var $recommendDown = $(".recommendDown");
    var $recommen_show_1 = $(".recommendDetail .recommen_show_1");
    var $recommen_show_2 = $(".recommendDetail .recommen_show_2");

    $recommen_show_1.click(function(e) {
        //window.open(xincheUrl + citySpell + "/" + $recommen_show_1.attr("nameSpell") + "?source=" + source);
        carId = recommendCarArr.Data[0].CarID;
        var carName = recommendCarArr.Data[0].Name;
        $("#cartypeText").text(carName);

        triggerCarSelectData();
    });

    $recommen_show_2.click(function(e) {
        //window.open(xincheUrl + citySpell + "/" + $recommen_show_2.attr("nameSpell") + "?source=" + source);
        carId = recommendCarArr.Data[1].CarID;
        var carName = recommendCarArr.Data[1].Name;
        $("#cartypeText").text(carName);

        triggerCarSelectData();
    });
    var recommendCarArr = null;
    //控制价格输出格式
    function priceFormat(value) {
        if (value < 1) {
            return Math.floor(value * 10000) + "元";
        } else {
            return value + "万";
        }
    }
}