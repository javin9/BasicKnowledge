/*使用方法，页面需要增加2个监听
第一个是 定位失败的选择城市操作
document.addEventListener("selectCity",function(e){
 console.log('选择城市')
})
第二个是定位成功后与当前城市不符 弹层的确定按钮操作
document.addEventListener("pageJump",function(e){
 console.log(e.city)
})
* */

(function(){
    //腾讯代码
    try
    {
        window.qq=window.qq||{},qq.maps=qq.maps||{},window.soso||(window.soso=qq),soso.maps||(soso.maps=qq.maps),qq.maps.Geolocation=function(){"use strict";var t=null,e=null,o=null,n=null,l=null,i="_geoIframe_"+Math.ceil(1e7*Math.random()),a=document.createElement("iframe"),u=null,s=null,c=null,r=null,d=function(d,m){if(!d)return void alert("请输入key！");if(!m)return void alert("请输入referer！");var p=document.getElementById(i);if(!p){a.setAttribute("id",i);var g="https:";navigator.userAgent.match(/jdapp;iphone;/i)&&(g="http:"),a.setAttribute("src",g+"//apis.map.qq.com/tools/geolocation?key="+d+"&referer="+m),a.setAttribute("style","display: none; width: 100%; height: 30%"),document.body?document.body.appendChild(a):document.write(a.outerHTML),window.addEventListener("message",function(i){var a=i.data;if(a&&"geolocation"==a.module)clearTimeout(r),t&&t(a),t=null,e=null,o&&o(a),o=null,n=null,l&&l(a);else{s=(new Date).getTime();var d=s-u;d>=c&&(e&&e(),e=null,t=null,clearTimeout(r)),n&&n(),n=null,o=null}},!1)}};return d.prototype.getLocation=function(o,n,l){t=o,e=n,u=(new Date).getTime(),c=l&&l.timeout?+l.timeout:1e4,clearTimeout(r),r=setTimeout(function(){e&&e(),e=null},c),document.getElementById(i).contentWindow.postMessage("getLocation","*")},d.prototype.getIpLocation=function(t,e){o=t,n=e,document.getElementById(i).contentWindow.postMessage("getLocation.robust","*")},d.prototype.watchPosition=function(t){l=t,document.getElementById(i).contentWindow.postMessage("watchPosition","*")},d.prototype.clearWatch=function(){l=null,document.getElementById(i).contentWindow.postMessage("clearWatch","*")},d}();
        function bodyHandler(event) {
            event.preventDefault();
        }
        var TencentLocation = function(){
            //定位判断
            this.geolocation = new qq.maps.Geolocation("2NXBZ-ZOERW-I4LRW-R6RQZ-5RIC6-RQFTD", "daikuan");
            this.options = {timeout: 5000};
            this.locationChangeTips;//切换城市弹层
            this.locationCity;
            this.winHeigth;
            this.winWidth;
            this.init();
        }

        TencentLocation.prototype ={
        init:function(){
            var that = this;
            this.renderLayer();
            //获取精准定位
            this.geolocation.getLocation(
                function(position){
                    //定位成功
                    that.jsonp(APIURL + 'api/Common/GetCityInfo?locateCityName=' + position.city +'&callback=JSONP_CALLBACK',function(res){
                        // that.updateDom("fail");
                        if(res.Result){
                            that.locationCity = res.Data;
                            that.updateDom();
                        }else{
                            that.updateDom("fail");
                        }
                    });

                },function(){
                    // console.log(err);
                    //定位失败
                    // that.updateDom("fail");
                }, that.options);
        },
        jsonp:function(url,callback) {
            var scriptElem = document.createElement('script');
            var callbackName = '__callback__' ;
            window[callbackName] = function (data){
                callback(data);
                document.body.removeChild(scriptElem);
            };
            scriptElem.src = url.replace('JSONP_CALLBACK',callbackName);
            document.body.appendChild(scriptElem);
        },
        //读取cookies
        getCookie: function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) {
                return unescape(arr[2]);
            }
            else {
                return null;
            }
        },
        //获取URL中的参数
        getUrlParam: function (name) {
            // 转换为小写
            var lowerName = name.toLowerCase(),
                lowerSearch = window.location.search.substr(1).toLowerCase();
            //构造一个含有目标参数的正则表达式对象
            var reg = new RegExp("(^|&)" + lowerName + "=([^&]*)(&|$)");
            //匹配目标参数
            var r = lowerSearch.match(reg);
            //返回参数值
            if (r != null) return unescape(r[2]);
            return null;
        },
        //渲染弹层
        renderLayer:function(){
            if(document.getElementById("#locationChangeTips")){
                this.locationChangeTips = document.getElementById("locationChangeTips");
            }else{
                this.locationChangeTips = document.createElement("section");
                this.locationChangeTips.id="locationChangeTips";
                document.body.appendChild(this.locationChangeTips);

            }
            this.bindEvents();
        },
        updateDom:function(type){
            if(type =="fail"){
                this.locationChangeTips.innerHTML = '<div class="locationChangeTips-content">'
                    +                               '<div class="locationInvalidTips">'
                    +                                   '<header>未检测到您的城市<br/>请您手动选择</header>'
                    +                                   '<footer class="footer-sel-btn">马上选择</footer>'
                    +                               '</div>'
                    +                           '</div>';
                this.locatefailed();
            }else{
                this.locationChangeTips.innerHTML = '<div class="locationChangeTips-content">'
                    +                               '<div class="tipsView">'
                    +                                   '<div class="tipsView-title">系统定位到您在北京，需要切换至北京么？</div>'
                    +                                   '<div class="tipsView-btn">'
                    +                                       '<div class="tipsView-btn-cancel">取消</div>'
                    +                                       '<div class="tipsView-btn-sure">确认</div>'
                    +                                   '</div>'
                    +                               '</div>'
                    +                           '</div>';
                this.locateSuccess();
            }

        },
        locateSuccess:function(){
            this.winHeigth = window.innerHeight;
            this.winWidth = window.innerWidth;
            var tipsViewTitle = this.locationChangeTips.getElementsByClassName("tipsView-title"),
                tipsView = this.locationChangeTips.getElementsByClassName("tipsView");
            tipsViewTitle[0].innerHTML = "系统定位到您在" + this.locationCity.CityName + "，需要切换至" + this.locationCity.CityName + "么？";

            if(typeof(ipLocationInfo) != "undefined" && ipLocationInfo.CityId){
                if (ipLocationInfo.CityId != this.locationCity.CityId && !sessionStorage.getItem('isLocationCity')){
                    if((navigator.userAgent.indexOf("MicroMessenger") >=0 && (!document.referrer||this.getUrlParam("from") == "newpcweb"))||
                        (navigator.userAgent.indexOf("MicroMessenger") <0 && !this.getCookie("isLayer"))){
                        document.body.addEventListener('touchmove', bodyHandler)

                        this.locationChangeTips.style.cssText="display:block;width:" + this.winWidth + "px; height:" + this.winHeigth + "px;transform-origin: 0px 0px 0px; opacity: 1; transform: scale(1, 1)";
                    }
                }else{
                    if(sessionStorage){
                        sessionStorage.setItem('isLocationCity',"yes");
                    }

                }
            }else{
                console.warn("获取不到ipLocationInfo")
            }
        },
        locatefailed:function(){
            if(!this.getCookie("isLayer")){
                document.body.addEventListener('touchmove', bodyHandler)
                this.locationChangeTips.style.cssText="display:block;width:" + this.winWidth + "px; height:" + this.winHeigth + "px;transform-origin: 0px 0px 0px; opacity: 1; transform: scale(1, 1)";
            }
        },
        isIp:function(value) {
            var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
            var reg = value.match(exp);
            if (reg == null) {
                return false;
            } else {
                return true;
            }
        },
        wildcardUrl:function() {
            var url = "";
            var urlHostName = window.location.hostname;
            if (this.isIp(urlHostName) || urlHostName == "localhost") {
                url = urlHostName
            } else {
                var urlArr = urlHostName.split(".");
                url = urlArr[urlArr.length - 2] + "." + urlArr[urlArr.length - 1];
            }
            return url;
        },
        setCookie:function(name, value, exp, domain) {
            var Days = 1;
            var expstr = "";
            var _domain = "";
            if (exp == undefined || exp == "") {
                exp = new Date();
                exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
                exp = exp.toGMTString();
            }
            if (domain) {
                _domain = ";domain=" + domain;
            }
            document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp + _domain;
        },
        //存入数据
        storageOperation:function(){
            var cookieIsLayer = "isLayer=false;path=/;domain=" + this.wildcardUrl();
            document.cookie = cookieIsLayer;

            var _locationCityObj ="{\"cityId\":" + this.locationCity.CityId+",\"cityName\":\""+this.locationCity.CityName+"\",\"citySpell\":\""+this.locationCity.CitySpell+"\"}";
            var cookieString2 = "locationCity=" + escape(_locationCityObj) + ";path=/;domain=" + this.wildcardUrl();
            document.cookie = cookieString2;

            var cookieString = "locateCityId=" + ipLocationInfo.CityId + ";path=/;domain=" + this.wildcardUrl();
            document.cookie = cookieString;
        },
        bindEvents:function(){
            var that = this;
            this.locationChangeTips.addEventListener('click',function(e){
                e.preventDefault();
                if(e.target.className == 'footer-sel-btn'){
                    that.locationChangeTips.style.display="none";
                    var ev = new Event(
                        'selectCity',
                        {
                            'bubbles': true,//是否冒泡
                            'cancelable': false//是否可以被取消
                        }
                    )
                    document.body.removeEventListener('touchmove',bodyHandler)
                    document.dispatchEvent(ev);
                }else if(e.target.className == 'tipsView-btn-cancel'){
                    // console.log('取消')
                    document.body.removeEventListener('touchmove',bodyHandler)
                    that.storageOperation();
                    var cookieString = "locateCityId=0;path=/;domain=" + that.wildcardUrl();
                    document.cookie = cookieString;
                    that.locationChangeTips.style.display="none";

                }else if(e.target.className == 'tipsView-btn-sure'){
                    // console.log('确定')
                    ipLocationInfo = that.locationCity;
                    that.storageOperation();
                    that.locationChangeTips.style.display="none";
                    that.setCookie("selectCityId",ipLocationInfo.CityId, "", that.wildcardUrl());
                    that.setCookie("selectcity",ipLocationInfo.CityId, "", that.wildcardUrl());

                    // Event.prototype.city = ipLocationInfo;
                    var ev = new Event(
                        'pageJump',
                        {
                            'bubbles': true,//是否冒泡
                            'cancelable': false,//是否可以被取消
                        },

                    )
                    document.body.removeEventListener('touchmove',bodyHandler)

                    ev.city = ipLocationInfo;
                    document.dispatchEvent(ev);
                    // setTimeout(function(){
                    //     document.location.href = "/" + ipLocationInfo.CitySpell;
                    // },100)
                }
            })
        }
    }
        new TencentLocation();
    }catch (e) {
    }

})()
