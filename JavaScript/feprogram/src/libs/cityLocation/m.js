    //需要在头部引入 <script type="text/javascript" src='http://api.map.baidu.com/api?v=2.0&ak=o1uOc1CSQIzYBs9fwdNFi7MRNQKo9cAA'></script>
    // alert(tools.getCookie("selectCityId"))
    var _cityId = ipLocationInfo.CityId,
        _cityName = ipLocationInfo.CityName,
        _citySpell = ipLocationInfo.CitySpell,
        $locationChangeTips;
    var cityChangeDom = '<section id="locationChangeTips">'
                        +    '<div class="locationChangeTips-content">'
                        +        '<div class="tipsView">'
                        +            '<div class="tipsView-title"></div>'
                        +            '<div class="tipsView-btn">'
                        +                '<div class="tipsView-btn-cancel">取消</div>'
                        +                '<div class="tipsView-btn-sure">确认</div>'
                        +            '</div>'
                        +        '</div>'
                        +    '</div>'
                        +'</section>';
    if($("#locationChangeTips").length==0){
       $("body").append(cityChangeDom);
    }

    $locationChangeTips = $("#locationChangeTips");//弹层
    //添加事件
    $locationChangeTips.on("click",".tipsView-btn-cancel,.tipsView-btn-sure",function(e){
       

        if($(this).hasClass('tipsView-btn-cancel')){//取消
            $(window).off('touchmove');
            var cookieString = "locateCityId=0;path=/;domain=" + tools.wildcardUrl();
            document.cookie = cookieString;
            $locationChangeTips.hide();
        }else if($(this).hasClass('tipsView-btn-sure')){//确认
             $(window).off('touchmove');
            $locationChangeTips.hide();
            tools.setCookie("selectCityId",_cityId, "", tools.wildcardUrl());
            tools.setCookie("selectcity",_cityId, "", tools.wildcardUrl());
            setTimeout(function(){
                document.location.href = "/" + _citySpell;
            },100) 
        }
    })
    // alert(navigator.userAgent.indexOf("MicroMessenger") >=0 ||tools.getCookie("locateCityId") == null || tools.getCookie("locateCityId") == "")
    if (navigator.userAgent.indexOf("MicroMessenger") >=0 ||tools.getCookie("locateCityId") == null || tools.getCookie("locateCityId") == "") {
        //if (navigator.geolocation) {
        //    navigator.geolocation.getCurrentPosition(function (position) {
        //            console.log(position);  //
        //            var nowLatitude = position.coords.latitude;
        //            var nowLongitude = position.coords.longitude;

        //            GetLocateCityId(nowLongitude, nowLatitude);
        //        },
        //        function(error) {
        //            console.log(error);
        //            list_obj.Init();
        //        },
        //        {
        //            //timeout: 10000,
        //            enableHighAccuracy: true
        //        }
        //    );
        //}

        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
            //关于状态码
            //BMAP_STATUS_SUCCESS   检索成功。对应数值“0”。
            //BMAP_STATUS_CITY_LIST 城市列表。对应数值“1”。
            //BMAP_STATUS_UNKNOWN_LOCATION  位置结果未知。对应数值“2”。
            //BMAP_STATUS_UNKNOWN_ROUTE 导航结果未知。对应数值“3”。
            //BMAP_STATUS_INVALID_KEY   非法密钥。对应数值“4”。
            //BMAP_STATUS_INVALID_REQUEST   非法请求。对应数值“5”。
            //BMAP_STATUS_PERMISSION_DENIED 没有权限。对应数值“6”。(自 1.1 新增)
            //BMAP_STATUS_SERVICE_UNAVAILABLE   服务不可用。对应数值“7”。(自 1.1 新增)
            //BMAP_STATUS_TIMEOUT   超时。对应数值“8”。(自 1.1 新增)
            // console.log(r);
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                //alert('您的位置：' + r.point.lng + ',' + r.point.lat);
                GetLocateCityId(r.point.lng, r.point.lat);
            }
            else {
                //alert('failed' + this.getStatus());
                console.log(this.getStatus());
                
            }
        }, { enableHighAccuracy: true });

    } else {
        
    }

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
                            console.log(res); //获取本站对应城市ID
                            // alert(!tools.getCookie("isLayer"));
                            function popLayer(){  // 如果不相同重新加载数据
                                console.log("gps locate diffiencent city with ip.");
                                _cityId = res.Data.CityId;
                                _cityName = res.Data.CityName;
                                _citySpell = res.Data.CitySpell;
                                $(window).on('touchmove', function (e) {
                                    e.preventDefault();
                                });

                                $locationChangeTips.width($(window).width());
                                $locationChangeTips.height($(window).height());
                                $locationChangeTips.show();
                                var $tipsView = $('#locationChangeTips .tipsView');
                                var $tipsViewTitle = $('#locationChangeTips .tipsView-title');
                                $tipsViewTitle.html("系统定位到您在" + _cityName + "，需要切换至" + _cityName + "么？");
                                if(($locationChangeTips.height() - $tipsView.height()) !=0 &&($locationChangeTips.width() - $tipsView.width())!=0){
                                    $tipsView.css({
                                        top: ($locationChangeTips.height() - $tipsView.height()) / 2
                                    });
                                }
                                

                                var cookieIsLayer = "isLayer=false;path=/;domain=" + tools.wildcardUrl();
                                document.cookie = cookieIsLayer;
                            }

                            if (_cityId != res.Data.CityId){
                                if(navigator.userAgent.indexOf("MicroMessenger") >=0 && (!document.referrer||tools.getUrlParam("from") == "newpcweb")){
                                    popLayer();
                                }else if(navigator.userAgent.indexOf("MicroMessenger") <0 && !tools.getCookie("isLayer")){
                                    popLayer();
                                }

                            }
                                
                            var _locationCityObj ="{\"cityId\":" + res.Data.CityId+",\"cityName\":\""+res.Data.CityName+"\",\"citySpell\":\""+res.Data.CitySpell+"\"}";
                            var cookieString2 = "locationCity=" + escape(_locationCityObj) + ";path=/;domain=" + tools.wildcardUrl();
                            document.cookie = cookieString2;

                            var cookieString = "locateCityId=" + _cityId + ";path=/;domain=" + tools.wildcardUrl();
                            document.cookie = cookieString;
                        }
                    }
                });
            } else {
                // alert("baidu city is empty.");
                // list_obj.Init();
            }
        }, { enableHighAccuracy: true });
    }


    /////////定位结束///////////////