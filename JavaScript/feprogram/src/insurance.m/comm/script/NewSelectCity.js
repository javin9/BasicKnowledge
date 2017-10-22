// 新版城市控件 - 谢美娜
import iScroll from 'iScroll';
// import './iscroll.js';
// window.iScroll = iScroll.iScroll;
var NewSelectCity = function(opts){
    this.Trigger = opts.Trigger; //触发控件的dom元素
    this.CallBack = opts.CallBack; //回调函数
    this.main_box = this.main_box = opts.main_box == undefined ? false : opts.main_box; //要隐藏的box
    this.hot = this.hot = opts.hot == undefined ? false : opts.hot; //是否需要展示热门城市，如果不是选择城市那么这个属性失效
    this.islocation = this.islocation = opts.islocation == undefined ? false : opts.islocation; //是否需要展示定位城市，如果不是选择城市那么这个属性失效
    this.isCity = this.isCity = opts.isCity == undefined ? true : opts.isCity;//选择城市还是区县
    // this.curCity = "城市国标码";
    this.curCity = this.curCity = opts.curCity == undefined ? false : opts.curCity; //选择区县，传该城市的国标码
    this.shortEName = this.shortEName = opts.shortEName == undefined ? false : opts.shortEName;
    this.args = {}; //控件返回的json数据（省的ID,城市ID,城市Name，区域ID，区域Name）
    this.index_arr = new Array(); //字母索引
    this.Init(); //初始化
};
NewSelectCity.prototype = {
    unique: function(arr){ //数组去重
        var result = [], hash = {};
        for (var i = 0, elem; (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result.sort();
    },
    getAjax: function(_url, _data, _callback){ //封装ajax
        var $this = this;
        $.ajax({
            url: _url,
            type: 'GET',
            data: _data,
            cache: true,
            // error:function(){},//请求出错
            beforeSend: function () { //发送请求
                //showLoadingDiv();
            },
            // complete:function(){},//请求完成
            success: function (data) {
                _callback(data);
                //$("#loadingdiv").hide();
            }

        });
    },
    // 数据初始化 热门城市
    Init: function () {
        var $this = this;
        var location_city_res = false;
        var parent_html = '<div id="NewSelectCity_wrapper">'+
                            '<div id="NewSelectCity_box">'+
                                '<div class="NewSelectCity_main">'+
                                    '<div class="chooseCity fontSize_13" cityid="201" licenseplatecode="京" regionid="110100" provinceid="110000">当前选择城市：<span>北京</span></div>'+
                                    '<div class="prestrain_city_list">'+
                                        '<div class="location_city">'+
                                            '<h3 class="city_title fontSize_13">定位城市</h3>'+
                                            '<p class="location_error fontSize_10">未能获取到您的城市，请轻轻动下手指选择城市</p>'+
                                            '<ul class="city_list clearfix">'+
                                                '<li><a href="javascript:void(0);"><span class="icon"></span><em class="fontSize_15"></em></a></li>'+
                                            '</ul>'+
                                        '</div>'+
                                        '<div class="hot_city">'+
                                            '<h3 class="city_title fontSize_13">热门城市</h3>'+
                                            '<ul class="city_list clearfix">'+
                                                '<li><a href="javascript:void(0);">北京</a></li>'+
                                            '</ul>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="choose_city_list">'+
                                    '</div>'+
                                '</div>'+
                                '<div class="NewSelectCity_search_main">'+
                                    '<ul class="city_list"></ul>'
                                '</div>'+
                            '</div>'+
                         '</div>';
        $this.Trigger.unbind('click').click(function(e){
            e.preventDefault();
            $this.windowScrollTop = $(window).scrollTop();
            if($("#NewSelectCity_box").length == 0){
                $(parent_html).appendTo($("body"));
            };
            $("#NewSelectCity_wrapper").hide(); //显示城市控件
            Store.GetCityInfoList().then(function (data) {
                if(data.Result){
                    var obj = data.Data;
                    var arr = [];
                    if($this.shortEName == "ZABX"){
                        for(var i = 0;i<obj.length;i++){
                            if(obj[i].ZABX || obj[i].Name == "重庆"){
                                arr.push(obj[i])
                           }
                        }
                        obj = arr;
                    }
                    if($this.shortEName == "AXATP"){
                        for(var i = 0;i<obj.length;i++){
                            if(obj[i].AXATP || obj[i].Name == "重庆" || obj[i].Name == "北京" || obj[i].Name == "天津" || obj[i].Name == "上海"){
                                arr.push(obj[i])
                           }
                        }
                        obj = arr;
                    }
                    $this.initHtml(obj);
                }else{
                    alert(data.Message)
                }
            });
        });
    },
    initHtml:function (obj) {//初始化结构
        var $this = this;
        // 获取字母索引
        for(var i = 0;i<obj.length;i++){
           $this.index_arr.push(obj[i].Spell.replace(/(^\s*)|(\s*$)/g, "").substr(0,1).toUpperCase());
        }
        $this.addCity_tit();    //添加头部
        $this.addIndexNUm($this.index_arr); //添加字母索引
        if($this.isCity){ //是否是选择城市
            $("#NewSelectCity_box .prestrain_city_list").show();
            // if(storage.getItem('chooseCityName') && storage.getItem('chooseCityName')!='null'){
            //     $('#NewSelectCity_wrapper .chooseCity span').text(storage.getItem('chooseCityName'));
            //     $('#NewSelectCity_wrapper .chooseCity').show();
            // }
            if(comm.getCookie('chooseCityName') && comm.getCookie('chooseCityName')!='null'){
                $('#NewSelectCity_wrapper .chooseCity span').text(comm.getCookie('chooseCityName'));
                $('#NewSelectCity_wrapper .chooseCity').show();
            }
            if ($this.hot) { //是否需要展示热门城市
                $this.ByHot();  //初始化热门城市
                $("#NewSelectCity_box .hot_city").show();
            }else{
                $("#NewSelectCity_box .hot_city").hide();
            }
            // 是否需要显示定位城市
            if($this.shortEName == "ZABX" || $this.shortEName == "AXATP"){
                $("#NewSelectCity_box .location_city").hide();
            }else{
                if($this.islocation){
                    var callback = function(res){
                        if(res){
                            $(".prestrain_city_list .location_city ul li a").attr({'CityID':res.CityID}).find('em').text(res.CityName);
                            $(".prestrain_city_list .location_city ul li a").attr({ LicensePlateCode: res.LicensePlateCode, 'RegionId': res.RegionId, 'ProvinceId': res.RegionId.toString().substr(0, 2) + '0000' });
                            $(".location_city .city_list").show();
                            $(".location_error").hide();
                        }else{
                            $(".location_city .city_list").hide();
                            $(".location_error").show();
                        }
                        $("#NewSelectCity_box .location_city").show();
                    };
                    if(comm.getCookie("locationCityId") && comm.getCookie("locationCityId").length>0){
                        Store.GetRegionByRegionid({ "regionid": comm.getCookie("locationCityId") }).then(function (res) {
                            if(res.Result){
                                var loacCityInfo = {
                                    CityID:res.Data.CityID,//易车城市标识
                                    CityName:res.Data.Name,//城市名称
                                    RegionId:res.Data.RegionId,//城市国标码
                                    LicensePlateCode:res.Data.LicensePlateCode //城市对应的车牌号简码
                                };
                                callback(loacCityInfo);
                            }else{
                                callback(false);
                            }
                        });
                    }else{
                        comm.getLocationCity(callback);
                    }
                }else{
                    $("#NewSelectCity_box .location_city").hide();
                }
            }
            $this.addCityList(obj); //初始化城市列表
            $this.seacrhCity(); //搜索城市
        }else{ //选择区县
            $("#NewSelectCity_box .prestrain_city_list").hide();
            $(".NewSelectCity_title span.text").text("选择区县");
            if($this.curCity){//是否城市的国标码
                $(".NewSelectCity_search_box").hide();
                $(".city_index").hide();
                $this.locationCity(); //初始化区县列表
            }else{
                $this.addCityList(obj); //初始化城市列表
                $this.seacrhCity(); //搜索城市
            }
        }
        if($this.main_box){ //页面中是否有需要隐藏的结构
            $this.main_box.hide();
        }
    },
    addCity_tit:function(){
        var $this = this;
        var html = '<div class="NewSelectCity_title clearfix" id="top">'+
                        '<a href="javascript:void(0);" class="return fontSize_15"></a>'+
                        '<a href="javascript:void(0);" class="close fontSize_15"></a>'+ //onclick=javascript:$("#NewSelectCity_wrapper").hide().remove();
                        '<span class="text fontSize_17">选择城市</span>'+
                    '</div>'+
                    '<div class="NewSelectCity_search_box">'+
                        '<div class="NewSelectCity_search_mian">'+
                            '<span class="icon fontSize_12"></span>'+
                            '<input type="text" name="search_city" class="search_inp fontSize_13" value="" placeholder="请输入城市名称或者首字母查询" />'+
                        '</div>'+
                    '</div>';

        $(html).appendTo($("#NewSelectCity_wrapper"));
        $(".NewSelectCity_title").delegate(".close","click",function(){
            $("#NewSelectCity_wrapper").hide().remove();
            $(window).scrollTop($this.windowScrollTop);
            if($this.main_box){
                $this.main_box.show();
                $(window).scrollTop($this.windowScrollTop);
            }
        });
    },
    addIndexNUm:function(arr){  // 添加字母索引
        var $this = this;
        $this.index_arr = $this.unique(arr); //去重得到字母索引
        $this.IndexNum_html = '<div class="city_index">'+
                                    '<ul>'+
                                        '<li><a href="#top">#</a></li>'+
                                        '<li><a href="#A">A</a></li>'+
                                        '<li><a href="#B">B</a></li>'+
                                        '<li><a href="#C">C</a></li>'+
                                        '<li><a href="#D">D</a></li>'+
                                        '<li><a href="#E">E</a></li>'+
                                        '<li><a href="#F">F</a></li>'+
                                        '<li><a href="#G">G</a></li>'+
                                        '<li><a href="#H">H</a></li>'+
                                        '<li><a href="#I">I</a></li>'+
                                        '<li><a href="#J">J</a></li>'+
                                        '<li><a href="#k">k</a></li>'+
                                        '<li><a href="#L">L</a></li>'+
                                        '<li><a href="#M">M</a></li>'+
                                        '<li><a href="#N">N</a></li>'+
                                        '<li><a href="#O">O</a></li>'+
                                        '<li><a href="#P">P</a></li>'+
                                        '<li><a href="#Q">Q</a></li>'+
                                        '<li><a href="#R">R</a></li>'+
                                        '<li><a href="#S">S</a></li>'+
                                        '<li><a href="#T">T</a></li>'+
                                        '<li><a href="#U">U</a></li>'+
                                        '<li><a href="#V">V</a></li>'+
                                        '<li><a href="#W">W</a></li>'+
                                        '<li><a href="#X">X</a></li>'+
                                        '<li><a href="#Y">Y</a></li>'+
                                        '<li><a href="#Z">Z</a></li>'+
                                    '</ul>'+
                                '</div>'+
                                '<div class="alert_pop fontSize_14"><p class="fontSize_14">A</p></div>';
        $($this.IndexNum_html).appendTo($("#NewSelectCity_wrapper"));
        var city_index_li_h = ($(window).height() - $('.NewSelectCity_title').height() - 40) / ($this.index_arr.length+1);//40----底部40的边距
        // #NewSelectCity_wrapper .city_index
        var html = '<li class="fontSize_11" style="height:'+city_index_li_h+'px;line-height:'+city_index_li_h+'px;"><a class="fontSize_11" href="javascript:void(0);">#</a></li>';
        for(var i = 0; i < $this.index_arr.length;i++){
            var dom = $this.index_arr[i].toUpperCase();
            html += '<li class="fontSize_11" style="height:'+city_index_li_h+'px;line-height:'+city_index_li_h+'px;"><a class="fontSize_11" href="javascript:void(0);">'+$this.index_arr[i]+'</a></li>'; // href="#'+$this.index_arr[i]+'"
        }

        $(".city_index ul").html(html);
        //字母导航滚动
        function letterScoll(_target,_fls){
            //字母导航
            var _letter = _target.text();
            var heardeH = $(".NewSelectCity_search_box").height() + $(".NewSelectCity_title").height();
            if(_letter == "#"){
                $this.myScroll.scrollTo(0,  $('#top').offset().top, 200, iScroll.utils.ease.elastic);
            }else{
                $this.myScroll.scrollTo(0, -($('#'+_letter).offset().top - heardeH) , 200,  iScroll.utils.ease.elastic);
                $(".alert_pop").find("p").text(_letter).end().stop().show(0,function(){
                    if(_fls){
                        setTimeout(function(){
                            $(".alert_pop").fadeOut();
                        },1000);
                    }
               });
            }
        };
        //字母导航触摸事件
        $(".city_index").get(0).addEventListener('touchstart', fnMove, false);
        $(".city_index").get(0).addEventListener('touchmove', fnMove, false);
        $(".city_index").get(0).addEventListener('touchend', fnEnd, false);
        function fnMove(e){
            e.preventDefault();
            var touch = e.touches[0];
            var eqIndex = parseInt((touch.clientY -$(".NewSelectCity_title").height())/city_index_li_h)
            if(eqIndex > ($this.index_arr.length+1) - 1){
                eqIndex = ($this.index_arr.length+1) - 1;
            }else if(eqIndex<0){
                eqIndex = 0;
            }
            var _target = $(this).find("li").eq(eqIndex);
            letterScoll(_target,false);
        };
        function fnEnd(e){
            setTimeout(function(){
                $(".alert_pop").fadeOut();
            },1000);
        };
    },
    addCityList:function(arr){ //添加城市列表
        var $this = this;
        var html ="";
        for(var m = 0; m < $this.index_arr.length; m ++){
            html += '<h3 class="city_title fontSize_13" id="'+$this.index_arr[m]+'" name="'+$this.index_arr[m]+'">'+$this.index_arr[m]+'</h3><ul class="city_list">';
            for(var i = 0;i<arr.length;i++){
               var key = arr[i].Spell.substr(0,1).toUpperCase();
                if(key == $this.index_arr[m]){
                    html += '<li class="li fontSize_14"><a class="fontSize_14" href="javascript:void(0);" LicensePlateCode="' + arr[i].LicensePlateCode + '" CityID="' + arr[i].CityID + '" RegionId = "' + arr[i].RegionId + '" ProvinceId = "' + arr[i].RegionId.toString().substr(0, 2) + '0000">' + arr[i].Name + '</a></li>'; //RegionId = "'+arr[i]RegionId+'"
                }else{
                    continue;
                }
            }
            html += "</ul>";
        }
        $(".choose_city_list").html(html);
        $("#NewSelectCity_wrapper").show(); //显示城市控件
        $this.SetCallBack();//设置回调事件
        $this.boxHeight = $(".NewSelectCity_main").height()+420;
        $("#NewSelectCity_box").height($this.boxHeight)
        $this.myScroll = new iScroll('#NewSelectCity_wrapper', { mouseWheel: true, click: true });
    },
    seacrhCity:function(){ //搜索城市
        var $this = this;
        $(".NewSelectCity_search_box").show();
        $(".search_inp").on('keyup',function(e){
            var val = $(this).val();
            $this.myScroll.scrollTo(0,  -($('#top').offset().top), 200,  iScroll.utils.ease.elastic);
            $("#NewSelectCity_box").height($(window).height())
            if(val.length == 0){
                $(".NewSelectCity_main").show();
                $(".NewSelectCity_search_main").hide();
                $(".city_index").show();
                $(".NewSelectCity_search_main .city_list").html("");
                $this.myScroll.scrollTo(0,  -($('#top').offset().top), 200,  iScroll.utils.ease.elastic);
                $("#NewSelectCity_box").height($this.boxHeight)
                $this.myScroll.refresh(); //刷新
            }else{
                var search_html = "";
                var val= $(this).val().replace(/\s/g,"");
                Store.GetQueryCitiesInfo({Query:val}).then(function (data) {
                    if(data.Result){
                        var obj = data.Data;
                        var arr = [];
                        if($this.shortEName == "ZABX"){
                            for(var i = 0;i<obj.length;i++){
                                if(obj[i].ZABX || obj[i].Name == "重庆"){
                                    arr.push(obj[i])
                               }
                            }
                            obj = arr;
                        }
                        if($this.shortEName == "AXATP"){
                            for(var i = 0;i<obj.length;i++){
                                if(obj[i].AXATP || obj[i].Name == "重庆" || obj[i].Name == "北京" || obj[i].Name == "天津" || obj[i].Name == "上海"){
                                    arr.push(obj[i])
                               }
                            }
                            obj = arr;
                        }
                        if(obj.length > 0){
                            for(var i = 0; i < obj.length;i++){
                                search_html += '<li class="li fontSize_14"><a href="javascript:void(0);" LicensePlateCode="' + obj[i].LicensePlateCode + '" CityID="' + obj[i].CityID + '" RegionId = "' + obj[i].RegionId + '" ProvinceId = "' + obj[i].RegionId.toString().substr(0, 2) + '0000" class="fontSize_14">' + obj[i].Name + '</a></li>';
                            }
                        }else{
                            search_html += '<p style="color:#666;line-height: 1.12rem;" class="fontSize_14">对不起没有找到'+val;
                        }
                        $(".NewSelectCity_search_main .city_list").html('');
                        $(".NewSelectCity_search_main .city_list").html(search_html);
                        var height = $(".NewSelectCity_search_main .city_list li:first()").height()*$(".NewSelectCity_search_main .city_list li").length;
                        $("#NewSelectCity_box").height(height+100)
                        $(".NewSelectCity_search_main").height(height);
                        $(".NewSelectCity_main").hide();
                        $(".city_index").hide();
                        $this.myScroll.scrollTo(0,  -($('#top').offset().top), 200,  iScroll.utils.ease.elastic);
                        $this.myScroll.refresh(); //刷新
                        $(".NewSelectCity_search_main").show();
                    }else{
                        alert(data.Message)
                    }
                });
            }

        });
    },
    ByHot: function () {// 选择热门城市
        var $this = this;
        if($this.shortEName){
            Store.GetMHotCitiesInfo({shortEName:$this.shortEName}).then(function (res) {$this.HotInit(res)});
        }else{
            Store.GetHotCitiesInfo({}).then(function (res) {$this.HotInit(res)});
        }
    },
    HotInit:function(data){
        var $this = this;
        $this.hot_html = "";
        if(data.Result){
            var obj = data.Data;
            var arr = [];
            if($this.shortEName == "ZABX"){
                for(var i = 0;i<obj.length;i++){
                    if(obj[i].ZABX){
                        arr.push(obj[i])
                   }
                   // if(obj[i].Name == "重庆"){
                   //      arr.push(obj[i])
                   // }
                }
                obj = arr;
            }
            if($this.shortEName == "AXATP"){
                for(var i = 0;i<obj.length;i++){
                    if(obj[i].AXATP){
                        arr.push(obj[i])
                   }
                   // if(obj[i].Name == "重庆" || obj[i].Name == "北京" || obj[i].Name == "天津" || obj[i].Name == "上海"){
                   //      arr.push(obj[i])
                   // }
                }
                obj = arr;
            }
            $this.hot_html = "";
            for(var i = 0; i < obj.length;i++){
                $this.hot_html += '<li class="fontSize_14"><a class="fontSize_14" href="javascript:void(0);" LicensePlateCode="' + obj[i].LicensePlateCode + '" CityID="' + obj[i].CityID + '" RegionId = "' + obj[i].RegionId + '" ProvinceId = "' + obj[i].RegionId.toString().substr(0, 2) + '0000">' + obj[i].Name + '</a></li>';
            }

            $(".hot_city .city_list").html($this.hot_html);
        }else{
            alert(data.Message)
        }
    },
    locationCity:function(){//选择某个城市下的区县
        var $this = this;
        $this.myScroll = new iScroll('#NewSelectCity_wrapper', { mouseWheel: true, click: true });
        var len = $(".choose_city_list li").length;
        Store.GetCityAllInfo({regionId:$this.curCity}).then(function (res ) {
            var obj = data.Data;
            var ul_html = "<div class='area_city_box'><ul class='city_list'>";
            var area_html = '<ul class="area_list" style="padding-left:0.4rem;">';
            for(var i  = 0; i < obj.length; i++){
                if(obj[i].Level == 2){
                    ul_html += '<li class="li fontSize_14"><a class="fontSize_14" href="javascript:void(0);" LicensePlateCode="' + obj[i].LicensePlateCode + '" CityID="' + obj[i].CityID + '" RegionId = "' + obj[i].RegionId + '" ProvinceId = "' + obj[i].RegionId.toString().substr(0, 2) + '0000">' + obj[i].Name + '</a></li></ul></div>';
                }else if(obj[i].Level == 3){
                    area_html  += '<li><a href="javascript:void(0);" areaID="'+obj[i].CityID+'" RegionId = "'+obj[i].RegionId+'" ProvinceId = "'+obj[i].RegionId.toString().substr(0,2)+'0000">'+obj[i].Name+'</a></li>';
                }
            }
            area_html+="</ul>";
            $(ul_html).appendTo($(".NewSelectCity_main"));
            $(area_html).appendTo($(".NewSelectCity_main .area_city_box ul"));
            $("#NewSelectCity_wrapper").show();
            var height = $(".NewSelectCity_main .area_city_box ul li").height()*$(".NewSelectCity_main .area_city_box ul li").length;
            $(".NewSelectCity_main").height(height);
            $(".NewSelectCity_search_main").height(100);
            $("#NewSelectCity_box").css("margin-top","1.173333rem");
            $this.SetCallBack();//设置回调事件
            $this.myScroll = new iScroll('#NewSelectCity_wrapper', { mouseWheel: true, click: true });
        });
    },
    SetCallBack:function(){// 设置回调函数
        // 需要返回的可能性数据：省的ID,省的Name,城市ID,城市Name，区域ID，区域Name
        var $this = this;
        if($this.isCity){
            $(".city_list").delegate("li","click",function(){
                $this.args.CityID = $(this).find("a").attr("CityID"); //城市ID
                $this.args.CityName = $(this).find("a").text(); //城市名称
                $this.args.RegionId = $(this).find("a").attr("RegionId");   //城市国标码
                $this.args.ProvinceId = $(this).find("a").attr("ProvinceId");   //城市国标码
                $this.args.LicensePlateCode = $(this).find("a").attr("LicensePlateCode");   //车牌简码
                $this.CallBack($this.args);
                $("#NewSelectCity_wrapper").hide().remove(); //隐藏城市控件
                $(window).scrollTop($this.windowScrollTop);
                if($this.main_box){
                    $this.main_box.show();
                    $(window).scrollTop($this.windowScrollTop);
                }
                // storage.setItem('chooseCityName',$this.args.CityName);
                comm.setCookie('chooseCityName',$this.args.CityName);
            });
        }else{
            $(".city_list").delegate(".li","click",function(){
                var $that = $(this);
                if($(".area_list").length != 0){
                    $(".area_list").remove();
                }
                if(!$(this).parent("ul").hasClass('area_list')){
                    $this.args.CityID = $that.find("a").attr("CityID"); //城市ID
                    $this.args.CityName = $that.find("a").text(); //城市名称
                    $this.args.C_RegionId = $that.find("a").attr("RegionId");   //城市国标码
                    $this.args.ProvinceId = $that.find("a").attr("ProvinceId");   //省国标码
                    $this.args.LicensePlateCode = $(this).find("a").attr("LicensePlateCode");   //车牌简码
                    Store.GetCountries({cityId:$this.args.CityID}).then(function (data) {
                        if(data.Result){
                            var list_html = '<ul class="area_list" style="padding-left:0.4rem;">';
                            var obj = data.Data;
                            if(obj.length > 0){
                                for(var i = 0; i < obj.length;i++){
                                    list_html += '<li><a href="javascript:void(0);" areaID="'+obj[i].CityID+'" RegionId = "'+obj[i].RegionId+'" ProvinceId = "'+obj[i].RegionId.toString().substr(0,2)+'0000">'+obj[i].Name+'</a></li>';
                                }
                                list_html += '</ul>';
                                $that.after($(list_html));
                                // $(".NewSelectCity_search_main").css({'height':$(".NewSelectCity_search_main ul").height()});
                                $this.myScroll.refresh(); //刷新
                                $this.myScroll.scrollTo(0, -($that.offset().top), 200, iScroll.utils.ease.elastic);
                                $(".area_list").delegate("li","click",function(){
                                    var area_li = $(this);
                                    $this.args.areaID = area_li.find("a").attr("areaID");
                                    $this.args.areaName = area_li.find("a").text();
                                    $this.args.A_RegionId = area_li.find("a").attr("RegionId");
                                    $this.CallBack($this.args);
                                    $("#NewSelectCity_wrapper").hide().remove(); //隐藏城市控件
                                    $(window).scrollTop($this.windowScrollTop);
                                    if($this.main_box){
                                        $this.main_box.show();
                                    }
                                });
                            }else{
                                $this.args.areaID = $that.find("a").attr("CityID");
                                $this.args.areaName = $that.find("a").text();
                                $this.args.A_RegionId = $that.find("a").attr("RegionId");
                                $this.CallBack($this.args);
                                $("#NewSelectCity_wrapper").hide().remove(); //隐藏城市控件
                                $(window).scrollTop($this.windowScrollTop);
                                if($this.main_box){
                                    $this.main_box.show();
                                    $(window).scrollTop($this.windowScrollTop);
                                }
                            }
                        }else{
                            alert(data.Message)
                        }
                    });
                }else{
                    $this.args.CityID = $that.find("a").attr("CityID"); //城市ID
                    $this.args.CityName = $that.find("a").text(); //城市名称
                    $this.args.C_RegionId = $that.find("a").attr("RegionId");   //城市国标码
                    $this.args.ProvinceId = $that.find("a").attr("ProvinceId");   //城市国标码
                    $this.args.LicensePlateCode = $(this).find("a").attr("LicensePlateCode");   //车牌简码
                    $this.CallBack($this.args);
                    $("#NewSelectCity_wrapper").hide().remove(); //隐藏城市控件
                    $(window).scrollTop($this.windowScrollTop);
                    if($this.main_box){
                        $this.main_box.show();
                        $(window).scrollTop($this.windowScrollTop);
                    }
                }
            });
            $(".area_list").delegate("li","click",function(){
                var area_li = $(this);
                $this.args.CityID = area_li.parent("ul").prev("li").find("a").attr("CityID"); //城市ID
                $this.args.CityName = area_li.parent("ul").prev("li").find("a").text(); //城市名称
                $this.args.C_RegionId = area_li.parent("ul").prev("li").find("a").attr("RegionId");   //城市国标码
                $this.args.ProvinceId = area_li.parent("ul").prev("li").find("a").attr("ProvinceId");   //城市国标码
                $this.args.LicensePlateCode = area_li.parent("ul").prev("li").find("a").attr("LicensePlateCode");   //车牌简码
                $this.args.areaID = area_li.find("a").attr("areaID");
                $this.args.areaName = area_li.find("a").text();
                $this.args.A_RegionId = area_li.find("a").attr("RegionId");
                $this.CallBack($this.args);
                $("#NewSelectCity_wrapper").hide().remove(); //隐藏城市控件
                $(window).scrollTop($this.windowScrollTop);
                if($this.main_box){
                    $this.main_box.show();
                    $(window).scrollTop($this.windowScrollTop);
                }
            });
        }
    }
};
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
window.NewSelectCity = NewSelectCity;