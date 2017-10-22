if (!isChina){
    var _cityId = CityId,
        _citySpell,
        _cityName,
        _selectCityId = null,
        geolocation = new BMap.LocalCity(),
        $masklayer = $("#maskLayer"),
        $localization = $("#localization"),
        citySign = false;
    $(".localCity-close").click(function(){
        $masklayer.hide();
        $localization.addClass("hide");
    });
    geolocation.get(function (r) {
        if (r) {
            //alert('您的位置：' + r.point.lng + ',' + r.point.lat);
            GetLocateCityId(r.center.lng, r.center.lat);
        }else {
            //alert('failed' + this.getStatus());
            console.log("没有正确的城市定位");

        }
    });
    $("#localization a").click(function(){
        if($(this).hasClass("city-btn")){
            citySign = false;
        }else{
            citySign = true;
            _selectCityId = $(this).attr("data-id");
        }
        var cookieString = "selectCityId=" + (citySign?_selectCityId:_cityId) + ";path=/;domain=" + tools.wildcardUrl();
        var cookieOldString = "selectcity=" + (citySign?_selectCityId:_cityId) + ";path=/;domain=" + tools.wildcardUrl();
        // console.log(cookieString, cookieOldString);
        document.cookie = cookieString;
        document.cookie = cookieOldString;
    });

    function GetLocateCityId(nowLongitude, nowLatitude) {
        var newpt = new BMap.Point(nowLongitude, nowLatitude);
        var geoc = new BMap.Geocoder();
        geoc.getLocation(newpt, function (rs) {
            // alert(rs.addressComponents.city); //百度反推的地区
            if (rs.addressComponents.city != "") {
                $.ajax({
                    url: APIURL + 'api/Common/GetCityInfo?locateCityName=' + rs.addressComponents.city,  // APIURL  //http://192.168.15.70:8098/
                    type: 'get',
                    dataType: 'jsonp',
                    success: function (res) {
                        if (res.Result) {
                            // console.log(res); //获取本站对应城市ID
                            // alert(!tools.getCookie("isLayer"));
                            function popLayer(){  // 如果不相同重新加载数据
                                console.log("gps locate diffiencent city with ip.");
                                _cityId = res.Data.CityId;
                                _cityName = res.Data.CityName;
                                _citySpell = res.Data.CitySpell;
                            }

                            if (!tools.getCookie("isLayer") && _cityId != res.Data.CityId){
                                $localization.removeClass("hide");
                                $localization.find(".city-btn").attr("href", "/"+res.Data.CitySpell).find(".ipCity").text(res.Data.CityName);
                                $masklayer.show();
                                popLayer();
                            }
                            var cookieIsLayer = "isLayer=false;path=/;domain=" + tools.wildcardUrl();
                            document.cookie = cookieIsLayer;
                        }
                    }
                });
            } else {
                alert("baidu city is empty.");
            }
        }, { enableHighAccuracy: true });
    }
}
