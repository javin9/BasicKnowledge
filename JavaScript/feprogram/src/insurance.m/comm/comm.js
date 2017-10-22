import WeChatShare from '../comm/script/WeChatShare.js';
import '../comm/script/check.js';
window.comm = comm;
var comm = {
    qqOpenUrl:function(url,allUrl){ //qq页面跳转
        if (!url) {
            return;
        }
        if (!mqq.QQVersion) {
            window.location = url;
            return;
        }
        if(url.indexOf("http://")>=0 ||  url.indexOf("https://")>=0){
            url = url;
        }else{
            url = location.protocol+"//"+window.location.host + url;
        }
        mqq.invoke("ui", "openUrl", { url: url, target: 1, style: 1 });
    },
	getCompanyName : function (shorename) {
        switch (shorename) {
            case "CCIC":
                return "大地保险";
            case "YGBX":
                return "阳光保险";
            case "AXATP":
                return "安盛天平";
            case "ZABX":
                return "保骉车险";
            case "AIC":
                return "永诚保险";
            case "CPIC":
                return "太平洋保险";
            case "BOCI":
                return "中银保险";
            case "PICC":
                return "中国人保";
            case "PAIC":
                return "中国平安";
            case "CLIC":
                return "中国人寿";
        }
    },
    companyTel:function(Name){
        switch (Name) {
            case "YGBX":
                return {tel:95510,main:95510};
            case "PICC":
                return {tel:95518,main:95518};
            case "CCIC":
                return {tel:4009666666,main:4009666666};
            case "AXATP":
                return {tel:95550,main:95550};
            case "ZABX":
                return {tel:4009999595,main:4009999595};
            case "AIC":
                return {tel:95552,main:95552};
            case "BOCI":
                return {tel:4006795566,main:4006795566};
            case "CPIC":
                return {tel:'10108888-2',main:'10108888转2'};
            case "CLIC":
                return {tel:95519,main:95519};
            case "CIC":
                return {tel:'4001999999-2',main:'4001999999转2'};
        }
    },
    isContains: function (val, char) {
        if (val != "") {
            var arr = val.split('');
            var count = 0;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == char) {
                    return true;
                }
            }
        }
        return false;
    },
    getLocationCity : function(callback){//获取定位信息
        var obj;
        var $that = this;
        window.addEventListener('message', function(event) {
            console.log(event.data)
            var loc = event.data;
            if(event.data && event.data != null){
                var _data = {
                        Query:loc.city
                    };
                Store.GetQueryCitiesInfo(_data).then(function (res) {
                    if (res.Result) {
                        var ischange = false;
                        if(getCookie("selectCityId")){
                            ischange = (getCookie("selectCityId") == res.Data[0].CityID? false : true);
                        }else if(getCookie("locationCityId")){
                            ischange = (getCookie("locationCityId") == res.Data[0].RegionId? false : true);
                        }else {
                            ischange = (res.Data[0].RegionId == "110100" ? false : true);
                        }
                        obj = {
                            CityID:res.Data[0].CityID,//易车城市标识
                            CityName:res.Data[0].Name,//城市名称
                            RegionId:res.Data[0].RegionId,//城市国标码
                            LicensePlateCode:res.Data[0].LicensePlateCode, //城市对应的车牌号简码
                            ischange: ischange
                        };
                        console.log(obj)
                        callback(obj);
                        setCookie("locationCityId",obj.RegionId,'');
                        setCookie("locationCityName",obj.CityName,'');
                    } else {//GPS定位城市定位信息解析不成功，获取IP定位
                        // callback(false);
                        $that.getIpCityInfo(callback)
                    }
                });
            }else{
                $that.getIpCityInfo(callback)
            }
        });
    },
    getIpCityInfo:function(callback){//获取IP城市定位信息
        var $this = this;
        var obj = {};
        Store.GetIpCityInfo(_data).then(function (rs) {
            if(rs == null){return false}
            if(rs.CityId == null){return false}
            Store.GetIpCityInfo(_data).then(function (res) {
                obj = {
                    CityID:res.Data.CityID,//易车城市标识
                    CityName:res.Data.Name,//城市名称
                    RegionId:res.Data.RegionId,//城市国标码
                    LicensePlateCode:res.Data.LicensePlateCode //城市对应的车牌号简码
                };
                callback(obj);
                $this.setCookie("locationCityId",obj.RegionId,'');
                $this.setCookie("locationCityName",obj.CityName,'');
            });
        });
    },
    setCookie : function (name, value, exp,domain) {//存Cookie
        var Days = 1;
        var expstr = "";
        var _domain = "";
        if (exp == undefined || exp == "") {
            exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            exp = exp.toGMTString();
        }
        if(domain){
           _domain = ";domain=" + domain;
        }
        document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp + _domain;
    },
    getCookie : function (name) {//获取Cookie//读取cookies
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)){
            return unescape(arr[2]);
        }
        else{
            return null;
        }
    },
    getUrlParam : function (name) { //解析地址栏参数
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    },
    setWXShare: function (type,CityId) {
        var $that = this;
        console.log(vue.name)
        type = type == undefined || type == null ? 1 : type;
        var cityId = "";
        if ("undefined" == typeof CityId) {
            cityId = "";
        } else {
            cityId = CityId ? CityId : ""
        }
        var param = {
            channel: $that.getUrlParam('yxms') ? $that.getUrlParam('yxms') : '',
            sharetype: type,
            shortename: $that.getUrlParam('ShortEName') ? $that.getUrlParam('ShortEName') : '',
            cityid: cityId
        }
        wxShare.init(param);
    },
    customWXShare: function (config) {
        wxShare.customConfig(config);
    },
    IsIp:function(value){
        var exp=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        var reg = value.match(exp);
        if(reg==null)
        {
            return false;
        }else{
            return true;
        }
    },
    //泛域名处理
    WildcardUrl:function(){
        var url = "";
        var urlHostName = window.location.hostname;
        if(comm.IsIp(urlHostName) || urlHostName =="localhost"){
            url = urlHostName
        }else{
            var urlArr = urlHostName.split(".");
            url = urlArr[urlArr.length-2] +"." +urlArr[urlArr.length-1];
        }
        return url;
    },
    getSubUrl: function (symbol) {
        var $that = this;
        if (symbol == undefined)
            symbol = "&";
        var str = "";
        if(fromValue && fromValue!=''){
            str += symbol + 'yxms=' + fromValue + '&from=' + fromValue ;
            symbol = "&";
        }
        if ($that.getUrlParam('source') != undefined) {
            str += symbol + "source=" + $that.getUrlParam('source');
            symbol = "&";
        }
        if ($that.getUrlParam('promocode') != undefined) {
            str += symbol + "promocode=" + $that.getUrlParam('promocode');
            symbol = "&";
        }
        if ($that.getUrlParam('share') != undefined) {
            str += symbol + "share=" + $that.getUrlParam('share');
            symbol = "&";
        }
        if ($that.getUrlParam('ZebraUid') != undefined) {
            str += symbol + "ZebraUid=" + $that.getUrlParam('ZebraUid');
            symbol = "&";
        }
        if ($that.getUrlParam('ShopId') != undefined) {
            str += symbol + "ShopId=" + $that.getUrlParam('ShopId');
            symbol = "&";
        }
        if ($that.getUrlParam('didaUserType') != undefined) {
            str += symbol + "&didaUserType=" + $that.getUrlParam('didaUserType');
        }
        if ($that.getUrlParam('didaPhoneNo') != undefined) {
            str += symbol + "didaPhoneNo=" + $that.getUrlParam('didaPhoneNo');
            symbol = "&";
        }
        if ($that.getUrlParam('didaUserName') != undefined) {
            str += symbol + "didaUserName=" + $that.getUrlParam('didaUserName');
            symbol = "&";
        }
        return str;
    },
    showEditAlert:function (obj){// 显示编辑提示框
        if(obj.title){
            $(".alert_box.error_box").addClass("add_title");//显示标题
            $(".alert_box.error_box .alert_title").html(obj.title);
        }else{
            $(".alert_box.error_box").removeClass("add_title");//隐藏标题
        }
        $(".alert_box.error_box .bottom").addClass("edit");
        $(".alert_box.error_box .btn.btn_save").hide();
        $(".alert_box.error_box .box_box .info_main").html(obj.text);
        if (obj.btnCancelText) {
            $(".alert_box.error_box .btn.edit_btn.btn_no").html(obj.btnCancelText);
            if (obj.cancelCallback) {
                $(".alert_box.error_box .btn.edit_btn.btn_no").unbind("click");
                $(".alert_box.error_box .btn.edit_btn.btn_no").click(obj.cancelCallback);
            }
        }
        if (obj.btnOkText) {
            $(".alert_box.error_box .btn.edit_btn.btn_yes").html(obj.btnOkText);
            if (obj.okCallback) {
                $(".alert_box.error_box .btn.edit_btn.btn_yes").unbind("click");
                $(".alert_box.error_box .btn.edit_btn.btn_yes").click(obj.okCallback);
            }
        }
        $(".alert_box.error_box").show();
        var height = $('.alert_box.error_box .alert_info').height();
        $(".alert_box.error_box .alert_info").css({'margin-top':-height/2+'px'});
    },
    nonsupportCity_CCIC: function (_id, _pid) {
        if (_id == "110100") {
            return false;//北京
        }
        return true;
    },
    isFeigaiCity :function (_id, _pid) {//黑龙江、陕西、山东、重庆、广西---是费改地区返回true
        if (_pid == "230000") {
            return true;//黑龙江
        } else if (_pid == "610000") {
            return true;//陕西
        }
        else if (_pid == "370000") {
            return true;//山东
        }
        else if (_id == "500100") {
            return true;//重庆
        }
        else if (_pid == "450000") {
            return true;//广西
        }
        return false;
    },
    getDays: function (dateText) {
        var startText = dateText;
        var startarr = startText.split('-');
        var startdate = new Date(startarr[0], startarr[1] - 1, startarr[2]);
        var enddate = new Date();
        var days = this.getDiffDays(startdate, enddate);
        return days;
    },
    getDiffDays: function (startDate, endDate) {
        var days = parseInt(Math.abs(startDate - endDate) / 1000 / 60 / 60 / 24)//把相差的毫秒数转换为天数
        return days;
    },
    checkPhoneNum: function (val) {
        var phoneRexp = new RegExp(/^1[3|5|7|8][0-9]{9}$/);
        if (!val.match(phoneRexp)) {
            return false;
        }
        return true;
    },
    DateDiff: function (startdatestr, enddatestr) {
        startdatestr = startdatestr.replace(/-/g, "/");
        enddatestr = enddatestr.replace(/-/g, "/");
        var startdate = new Date(startdatestr);
        var enddate = new Date(enddatestr);
        if (startdate > enddate) {
            return false;
        }
        return true;
    },
    showLoadingDiv:function(){
        $("#loadingdiv").find('p').hasClass('fontSize_18') ? '' : $("#loadingdiv").find('p').addClass('fontSize_18');
        $("#loadingdiv").show().removeClass('hide').find('p').text('加载中');
        var index = 0;
        var addText = '';
        setInterval(function(){
            var text = '加载中';
            if(index < 3){
                addText += '.';
               var text = text+addText;
            }else{
                index = 0;
                addText = '';
                return false;
            }
            index ++;
            $("#loadingdiv").find('p').text(text);
        },500);
    },
    closeLoadingDiv:function(){
        $('#loadingdiv').hide();
    },
    ShowLoading:function(){
        $("#whiteLoading").show();
    },
    closeLoadingDiv:function(){
        $("#whiteLoading").hide();
    },
    CloseLoading:function(){
        $("#whiteLoading").hide();
    },
    findChange:function(newData,oldData,changeObj){//查找不同
        var menu = false;
        $.each(newData,function(i, n){
            $.each(oldData,function(x, m){
                if(x != 'FieldOrderId'){
                    if(changeObj){
                        for(var k=0;k++;k<changeObj.length){
                            if(i == changeObj[k] && i != 'FieldOrderId'){
                                if(i == x){
                                    if(n != m){
                                        menu = true;
                                    }
                                }
                            }
                        }
                    }else{
                        if(i == x){
                            if(n != m){
                                menu = true;
                            }
                        }
                    };
                }
            });
        });
        return menu;
    },
    getInputCheck:function(judgeHide){
        var flag = false;
        $("input,textarea").each(function(){
            var condition = $(this).is(':visible');
            if($(this).attr('type') != 'file') {
                if(judgeHide){
                    var isTrue = checkInputVal($(this),false);
                    if(!isTrue){
                        flag = true;
                        return false;
                    }
                }else{
                    if(condition){
                        var isTrue = checkInputVal($(this),false);
                        if(!isTrue){
                            flag = true;
                            return false;
                        }
                    }
                }
            }
        });
        return !flag;
    },
    formatDateTime: function (data) {
        if (data == null)
            return "";
        var date = new Date(parseInt(data.replace("/Date(", "").replace(")/", ""), 10));
        var result = date.getFullYear() + "-" + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
        return result;
    },
    ConvertMileage: function (attr) {//行驶里程
        switch (attr) {
            case 0:
                return "新车";
            case 1:
                return "小于3万里";
            case 30000:
                return "大于3万里";
        }
    },
    ConvertEnergyType: function (attr) {//能源类型
        switch (attr) {
            case "A":
                return "汽油";
            case "B":
                return "柴油";
            case "C":
                return "电";
            case "D":
                return "混合油";
            case "E":
                return "天然气";
            case "F":
                return "液化石油气";
            case "L":
                return "甲醇";
            case "M":
                return "乙醇";
            case "N":
                return "太阳能";
            case "Y":
                return "无";
            case "Z":
                return "其他";
            case "o ":
                return "混合动力";
        }
    },
    DrivingCityType:function(attr){//天津行驶证登记地区
        switch (attr) {
            case "0":
                return "";
            case "10100":
                return "天津和平区";
            case "10200":
                return "天津河东区";
            case "10300":
                return "天津河西区";
            case "10400":
                return "天津南开区";
            case "10500":
                return "天津河北区";
            case "10600":
                return "天津红桥区";
            case "10700":
                return "天津塘沽区";
            case "10800":
                return "天津汉沽区";
            case "10900":
                return "天津大港区";
            case "11000":
                return "天津东丽区";
            case "11100":
                return "天津西青区";
            case "11200":
                return "天津津南区";
            case "11300":
                return "天津北辰区";
            case "11400":
                return "天津直属";
            case "11500":
                return "天津开发区";
            case "11600":
                return "天津保税区";
            case "11700":
                return "天津新技术产业园区";
            case "11900":
                return "天津空港物流区";
            case "22100":
                return "天津宁河县";
            case "22200":
                return "天津武清区";
            case "22300":
                return "天津静海区";
            case "22400":
                return "天津宝坻区";
            case "22500":
                return "天津蓟县";
            case "40100":
                return "非天津";
        }
    },
    showAlert:function (text,obj) {
        $(".alert_box.error_box").removeClass("add_title");//显示标题
        $(".alert_box.error_box .bottom").removeClass("edit");
        $(".alert_box.error_box .btn.btn_save").show();
        $(".alert_box.error_box .box_box .info_main").html(text);
        if(obj){
            if(obj.text){
                $(".alert_box.error_box .btn.btn_save").text(obj.text);
            }
            if(obj.title){
                $(".alert_box.error_box").addClass("add_title");//显示标题
                $(".alert_box.error_box .alert_title").html(obj.title);
            }
            if (obj.btnCallBack) {
                $(".alert_box.error_box .btn.btn_save").unbind("click");
                $(".alert_box.error_box .btn.btn_save").click(obj.btnCallBack);
            }else{
                $(".alert_box.error_box .btn_save").click(function () {
                    $(".alert_box.error_box").hide();
                });
            }
        }else{
            $(".alert_box.error_box .btn.btn_save").text("确认");
            $(".alert_box.error_box .btn_save").click(function () {
                $(".alert_box.error_box").hide();
            });
        }
        $(".alert_box.error_box").show();
        var height = $('.alert_box.error_box .alert_info').height();
        $(".alert_box.error_box .alert_info").css({'margin-top':-height/2+'px'});
    },
    mySetCookie:function (key, value) {
        value = encodeURIComponent(value);
        this.setCookie(key, value);
    },
    myGetCookie:function (key) {
        var value = this.getCookie(key);
        value = decodeURIComponent(value);
        return value;
    },
    getUrlParamStr: function (symbol) {
        //微信分享用的
        if (symbol == undefined)
            symbol = "&";
        var str = "";
        var requestobj = comm.GetRequestParam();
        if (requestobj.yxms) {
            str += symbol + 'yxms=' + requestobj.yxms;
            symbol = "&";
        }
        if (requestobj.source != undefined) {
            str += symbol + "source=" + requestobj.source;
            symbol = "&";
        }
        if (requestobj.promocode != undefined) {
            str += symbol + "promocode=" + requestobj.promocode;
            symbol = "&";
        }
        if (requestobj.share != undefined) {
            str += symbol + "share=" + requestobj.share;
            symbol = "&";
        }
        if (requestobj.ZebraUid != undefined) {
            str += symbol + "ZebraUid=" + requestobj.ZebraUid;
            symbol = "&";
        }
        if (requestobj.ShopId != undefined) {
            str += symbol + "ShopId=" + requestobj.ShopId;
            symbol = "&";
        }
        if (requestobj.didaUserType != undefined) {
            str += symbol + "&didaUserType=" + requestobj.didaUserType;
        }
        if (requestobj.didaPhoneNo != undefined) {
            str += symbol + "didaPhoneNo=" + requestobj.didaPhoneNo;
            symbol = "&";
        }
        if (requestobj.didaUserName != undefined) {
            str += symbol + "didaUserName=" + requestobj.didaUserName;
            symbol = "&";
        }
        if (requestobj.CityID != undefined) {
            str += symbol + "CityID=" + requestobj.CityID;
            symbol = "&";
        }
        if (requestobj.CityName != undefined) {
            str += symbol + "CityName=" + requestobj.CityName;
            symbol = "&";
        }
        if (requestobj.LicensePlateCode != undefined) {
            str += symbol + "LicensePlateCode=" + requestobj.LicensePlateCode;
            symbol = "&";
        }
        if (requestobj.ProvinceId != undefined) {
            str += symbol + "ProvinceId=" + requestobj.ProvinceId;
            symbol = "&";
        }
        if (requestobj.RegionId != undefined) {
            str += symbol + "RegionId=" + requestobj.RegionId;
            symbol = "&";
        }
        if (requestobj.ShortEName != undefined) {
            str += symbol + "ShortEName=" + requestobj.ShortEName;
            symbol = "&";
        }
        return str;
    },
    //是否包含指定字符
    containsChar: function (str, substr) {
        return new RegExp(substr).test(str);
    },
    getNum: function (text){ //字符串中提取数字
        var value = text.replace(/[^0-9]/ig,"");
        return value;
    },
    showGifLoading: function (text) {//显示GIF效果的loading
        $("#loadding").show();
        if(text){
            $("#loadding h3").html(text);
        }
    },
    showGifLoading1: function (text) {//显示GIF效果的loading
        $("#loading").show();
        if(text){
            $("#loading h3").html(text);
        }
    },
    hideGifLoading: function () {//隐藏GIF效果的loading
        $("#loadding").hide();
    },
    hideGifLoading1: function () {//隐藏GIF效果的loading
        $("#loading").hide();
    },
    GetRequestParam:function () {//获取url中"?"符后的字串
        var url = location.search;
        var url_obj = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                url_obj[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
            }
        };
        return url_obj;
    }
};
var fromValue = ( comm.getUrlParam('yxms') && comm.getUrlParam('yxms') != 'undefined' && comm.getUrlParam('yxms') != null && comm.getUrlParam('yxms') != 'null' ) ? comm.getUrlParam('yxms') : ( comm.getUrlParam('from') ? comm.getUrlParam('from') : '' );
module.exports = {
    qqOpenUrl: comm.qqOpenUrl,//获取保险公司中文名称
    getCompanyName: comm.getCompanyName,//获取保险公司中文名称
    getLocationCity: comm.getLocationCity,//获取定位城市
    setCookie: comm.setCookie,//设置cookie
    getCookie: comm.getCookie,//获取cookie
    getUrlParam: comm.getUrlParam,//解析地址蓝参数
    setWXShare: comm.setWXShare,//设置微信分享参数
    customWXShare: comm.customWXShare,//
    WildcardUrl: comm.WildcardUrl,//泛域名处理
    IsIp: comm.IsIp,//是否是IP
    getSubUrl:comm.getSubUrl,//获取跳转的url参数
    showEditAlert:comm.showEditAlert,//显示编辑提示框
    nonsupportCity_CCIC:comm.nonsupportCity_CCIC,//显示编辑提示框
    isFeigaiCity:comm.isFeigaiCity,//黑龙江、陕西、山东、重庆、广西---是费改地区返回true
    getDays:comm.getDays,//
    getDiffDays:comm.getDiffDays,//
    checkPhoneNum:comm.checkPhoneNum,//
    DateDiff:comm.DateDiff,//
    showLoadingDiv:comm.showLoadingDiv,//
    closeLoadingDiv:comm.closeLoadingDiv,//
    ShowLoading:comm.ShowLoading,//
    closeLoadingDiv:comm.closeLoadingDiv,//
    CloseLoading:comm.CloseLoading,//
    findChange:comm.findChange,//查找不同
    getInputCheck:comm.getInputCheck,//验证input
    formatDateTime:comm.formatDateTime,//转换时间
    ConvertMileage:comm.ConvertMileage,//行驶里程
    ConvertEnergyType:comm.ConvertEnergyType,//能源类型
    DrivingCityType:comm.DrivingCityType,//天津行驶证登记地区
    showAlert:comm.showAlert,//天津行驶证登记地区
    isContains:comm.isContains,//江苏
    companyTel:comm.companyTel,//保险公司投保电话
    mySetCookie:comm.mySetCookie,//
    myGetCookie:comm.myGetCookie,//
    getUrlParamStr:comm.getUrlParamStr,//微信分享专用链接
    containsChar:comm.containsChar,//是否包含指定字符
    getNum:comm.getNum,//
    showGifLoading:comm.showGifLoading,//
    showGifLoading1:comm.showGifLoading1,//
    hideGifLoading:comm.hideGifLoading,//
    hideGifLoading1:comm.hideGifLoading1,//
};
// 日期转换
Date.prototype.pattern = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时 (12小时制)
        "H+": this.getHours(), //小时 (24小时制)
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};
//判断:当前元素是否是被筛选元素的子元素
jQuery.fn.isChildOf = function (b) { return (this.parents(b).length > 0); };
//判断:当前元素是否是被筛选元素的子元素或者本身
jQuery.fn.isChildAndSelfOf = function (b) { return (this.closest(b).length > 0); };
//input change事件
$.event.special.inputchange = {
    setup: function () {
        var self = this, val;
        $.data(this, 'timer', window.setInterval(function () {
            val = self.value;
            if ($.data(self, 'cache') != val) {
                $.data(self, 'cache', val);
                $(self).trigger('inputchange');
            }
        }, 20));
    },
    teardown: function () {
        window.clearInterval($.data(this, 'timer'));
    },
    add: function () {
        $.data(this, 'cache', this.value);
    }
};
String.prototype.Trim = function(){ //去空格
    var result;
    result = this.replace(/(^\s+)|(\s+$)/g,"");
    return result.replace(/\s/g,"");
};
(function ($) {//遮盖层封装
    $.fn.showCover = function (options) {
        var defaults = {
            title: "遮层标题",
            content: "遮层内容",
            submit: new Function(),
            callback: new Function()
        };
        var ops = $.extend(defaults, options);
        var _cont = '<div id="modal" class="modal ub ub-ver">' +
                     '    <div class="cor_hd">' +
                     '        <div class="title fontSize_15">' + ops.title + '</div>' +
                     '        <div class="cor_close"></div>' +
                '    </div>' +
                '    <div class="cor_bd ub-f1 fontSize_12 clearfix">' + ops.content + '</div>' +
                '    <div class="cor_ft ub ub-pe">' +
                '        <div class="cor_btn fontSize_16">立即投保</div>' +
                '    </div>' +
                '</div> ';
        if ($("#cover").length == 0)
            $(this).append('<div id="cover">' + _cont + '</div>');
        $(".cor_close").on("click", function () {
            $("#cover").remove();
        });
        $(".cor_btn").on("click", ops.submit);
        ops.callback && ops.callback();
    }
})(jQuery);
$(function(){
    $(".bgEvent").each(function(){
        $(this).height($(this).width()*$(this).data("proportion")+"px");
    });
    mqq.ui.setTitleButtons({
        right: { title: " " }
    });
    var bottomToTop = $("#movetop");
    var windowHeight = $(window).height();
    function scroll(scrollTo, time) {
        var scrollFrom = parseInt(document.body.scrollTop),
            i = 0,
            runEvery = 5; // run every 5ms

        scrollTo = parseInt(scrollTo);
        time /= runEvery;

        var interval = setInterval(function () {
            i++;

            document.body.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;

            if (i >= time) {
                clearInterval(interval);
            }
        }, runEvery);
    }

    bottomToTop.on("click", function () {
        scroll(0, 500);
    })
    $(document).on('scroll', function (event) {
        event.preventDefault();
        if (document.body.scrollTop > windowHeight * 1.5) {
            bottomToTop.show();
        } else {
            bottomToTop.hide();
        }
    });
});
