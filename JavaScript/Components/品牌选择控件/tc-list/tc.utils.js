/*public js*/
var utilityJs = {
    that: this,
    isMobile: function () {
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"),
        userAgentInfo = navigator.userAgent, con = false;
        for (var v = 0; v < Agents.length; v++) { if (userAgentInfo.indexOf(Agents[v]) > 0) { con = true; break; } }
        return con;
    },
    getSingle: function (fn, callback) {
        var result = null;
        return function () {
            if (!result) {
                result = fn.apply(this, arguments);
            }
            typeof callback == "function" && callback.apply(null, Array.prototype.slice.call(arguments, 1));
            return result;
        }
    }
};
/*动态判断点击的类型*/
var clickEventName = {
    touchstart: (utilityJs.isMobile() && ('ontouchstart' in document)) ? 'touchstart' : 'click',
    touchend: (utilityJs.isMobile() && ('ontouchstart' in document)) ? 'touchend' : 'click'
};
//没有使用主站下面的cookie
/*用于Cookie读取的功能类*/
var Cookie = {
    getExpDate: function (days, hours, minutes) {
        var expDate = new Date();
        if (typeof days == "number" && typeof hours == "number" &&
	        typeof hours == "number") {
            expDate.setDate(expDate.getDate() + parseInt(days));
            expDate.setHours(expDate.getHours() + parseInt(hours));
            expDate.setMinutes(expDate.getMinutes() + parseInt(minutes));
            return expDate.toGMTString();
        }
    },
    getCookieVal: function (offset) {
        var endstr = document.cookie.indexOf(";", offset);
        if (endstr == -1) {
            endstr = document.cookie.length;
        }
        // return unescape(decodeURI(document.cookie.substring(offset, endstr)));
        return unescape(document.cookie.substring(offset, endstr));
    },
    getCookieValDecode: function (offset) {
        var endstr = document.cookie.indexOf(";", offset);
        if (endstr == -1) {
            endstr = document.cookie.length;
        }
        return unescape(decodeURI(document.cookie.substring(offset, endstr)));
    },
    getCookie: function (name) {
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        while (i < clen) {
            var j = i + alen;
            if (document.cookie.substring(i, j) == arg) {
                return this.getCookieVal(j);
            }
            i = document.cookie.indexOf(" ", i) + 1;
            if (i == 0) break;
        }
        return "";
    },
    getCookieDecode: function (name) {
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        while (i < clen) {
            var j = i + alen;
            if (document.cookie.substring(i, j) == arg) {
                return this.getCookieValDecode(j);
            }
            i = document.cookie.indexOf(" ", i) + 1;
            if (i == 0) break;
        }
        return "";
    },
    getCookies: function () {
        var _Cookie = new Array();
        var _sp, _name, _value, _tp, _tars, _tarslength, _coo;

        if (document.cookie.indexOf(";") != -1) {
            var _item = document.cookie.split("; ");
            var _itemlength = _item.length;
            for (i = 0; i < _itemlength; i++) {
                _sp = _item[i].split("=");
                _name = _sp[0];
                _value = _sp[1];
                _coo = new Array();
                _coo['name'] = _name;
                _coo['value'] = _value;
                _Cookie.push(_coo);
            }
        }
        else if (document.cookie.indexOf("=") != -1) {
            _sp = document.cookie.split("=");
            _name = _sp[0];
            _value = _sp[1];
            _coo = new Array();
            _coo['name'] = _name;
            _coo['value'] = _value;
            _Cookie.push(_coo);
        }
        return _Cookie;
    },
    setCookie: function (name, value, expires, path, domain, secure) {
        document.cookie = name + "=" + escape(value) +
	        ((expires) ? "; expires=" + expires : "") +
	        ((path) ? "; path=" + path : "") +
	        ((domain) ? "; domain=" + domain : "") +
	        ((secure) ? "; secure" : "");

    },
    deleteCookie: function (name, path, domain) {
        if (this.getCookie(name)) {
            document.cookie = name + "=" +
	            ((path) ? "; path=" + path : "") +
	            ((domain) ? "; domain=" + domain : "") +
	            "; expires=Thu, 01-Jan-70 00:00:01 GMT";
        }
    },
    clearCookie: function () {
        cookies = this.getCookies();
        for (i = 0; i < cookies.length; i++) {
            this.deleteCookie(cookies[i]['name']);
        }
    },
    getCookieString: function () {
        return document.cookie;
    }
};

/*判断终端设备类型的方法*/
var BrowserInfo = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
            //移动终端浏览器版本信息                 
            trident: u.indexOf('Trident') > -1, //IE内核               
            presto: u.indexOf('Presto') > -1, //opera内核                
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核                
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核                
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端                
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端                
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器               
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器                
            iPad: u.indexOf('iPad') > -1, //是否iPad               
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部  
            safari: u.indexOf('Safari') > 0, //是否web应该程序，没有头部与底部       
            weixin: u.match(/MicroMessenger/ig),
            Aphone360: u.indexOf('Aphone') > -1,//是否是360手机自带浏览器
            EUI: u.indexOf("EUI") > -1,//是否是乐视手机自带浏览器
            Vivo: u.indexOf("vivo") > -1//是否是vivo手机自带浏览器
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase(),
    userAgent: navigator.userAgent,
    isIosVersionLessThanSeven: function () {
        if (this.versions.iPhone || this.versions.iPad) {
            return Boolean(this.userAgent.match(/os [1-6]_\d[_\d]* like mac/ig));
        }
        return false;
    },
    isPc: (function () {
        return window.screen.width >= 699;
    })()
};
//禁止toucheMove滚动
function moveEnd() {//
    return !1;
};

/*touch辅助方法*/
var touchHelper = {
    startX: 0,
    startY: 0,
    tap: "",
    getCoord: function (e, c) {
        return /touch/.test(e.type) ? (e.originalEvent || e).changedTouches[0]['page' + c] : e['page' + c];
    },
    setTap: function () {
        j_xuanObj.tap = true;
        setTimeout(function () {
            j_xuanObj.tap = false;
        }, 500);
    },
    init: function () {
        this.startX = 0;
        this.startY = 0;
        this.tap = "";
    }
};

/*字符串处理拓展原生方法*/

String.prototype.format = function (obj) {
    var that = this;
    if (typeof obj == "object") {
        for (var attr in obj) {
            var regAttr = eval("/\\{" + attr + "\\}/ig");
            that = that.replace(regAttr, obj[attr]);
        }
    } else {
        //把参数放到数组里面 slice() 方法可从已有的数组中返回选定的元素。
        var arr = [].slice.call(arguments, 1);
        //调用自己
        return format(that, arr);
    }
    return that;
};
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};
String.prototype.ltrim = function () {
    return this.replace(/(^\s*)/g, "");
};
String.prototype.rtrim = function () {
    return this.replace(/(\s*$)/g, "");
};
String.prototype.Dbc2Sbc = function () {
    var result = "";
    for (var i = 0; i < this.length; i++) {
        code = this.charCodeAt(i); //获取当前字符的unicode编码
        if (code >= 65281 && code <= 65373) { //在这个unicode编码范围中的是所有的英文字母已经各种字符
            var d = this.charCodeAt(i) - 65248;
            result += String.fromCharCode(d); //把全角字符的unicode编码转换为对应半角字符的unicode码
        }
        else if (code == 12288) { //空格
            var d = this.charCodeAt(i) - 12288 + 32;
            result += String.fromCharCode(d);
        }
        else {
            result += this.charAt(i);
        }
    }
    return result;
};
String.prototype.len = function () {
    return this.Dbc2Sbc().replace(/[^\x00-\xff]/g, "**").length;
};
String.prototype.trimEnd = function (trimStr) {
    if (!trimStr) { return this; }
    var temp = this;
    while (true) {
        if (temp.substr(temp.length - trimStr.length, trimStr.length) != trimStr) {
            break;
        }
        temp = temp.substr(0, temp.length - trimStr.length);
    }
    return temp;
}

//回到顶部
function GetScreenHeight() {
    var windowHeight;
    //取出当前可视窗口高度
    if (self.innerHeight) {
        windowHeight = self.innerHeight
    } else {
        if (document.documentElement && document.documentElement.clientHeight) {
            windowHeight = document.documentElement.clientHeight
        } else {
            if (document.body) {
                windowHeight = document.body.clientHeight
            }
        }
    }
    return windowHeight
}
//滚动到顶部
$(function () {
    //
    //动态获取当前滚动条位置，判断是否到底部或顶部
    //
    $.isScrollTo = function (args) {
        var retval = false;
        if (args.length) {
            var curPos = $(document).scrollTop();
            var yScroll, windowHeight;

            //取出document总高度
            if (window.innerHeight && window.scrollMaxY) {
                yScroll = window.innerHeight + window.scrollMaxY;
            } else {
                if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac    
                    yScroll = document.body.scrollHeight;
                } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari    
                    yScroll = document.body.offsetHeight;
                }
            }

            windowHeight = GetScreenHeight();

            //取出当前可视窗口高度
            if (self.innerHeight) { // all except Explorer    
                windowHeight = self.innerHeight;
            } else {
                if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode    
                    windowHeight = document.documentElement.clientHeight;
                } else {
                    if (document.body) { // other Explorers    
                        windowHeight = document.body.clientHeight;
                    }
                }
            }

            if (args == "bottom" || args == "100%") {
                retval = (yScroll - $("#objFooter").height() <= (windowHeight + curPos));
            }
            if (args == "top" || args == "0%") {
                retval = (curPos == 0);
            }
        }
        return retval;
    };
    $(window).scroll(function () {
        var backtop = $("#backtop");
        $.isScrollTo("top") ? backtop.hide() : backtop.show();
    });
});

//yidaid cookie
(function () {
    var __referrer = document.referrer;
    if (typeof (__referrer) != "undefined" && __referrer != null && __referrer != "" && (__referrer.indexOf("yiche") != -1 || __referrer.indexOf("taoche") != -1)) {
        var ckey = "YIDAID";
        var yida = Cookie.getCookie(ckey);
        if (!yida) {
            $.getScript("http://www.taoche.com/ajax/yida.ashx?v=20141231", function (res) { })
        }
    }
})();

var Referrer = {
    //根据reffer种访前域名cookie
    urlReferrer: function (domain) {
        if (this.IsReferrer(domain)) {
            Cookie.setCookie("mtaochereff", domain, Cookie.getExpDate(1, 0, 0), "/", "m.taoche.com", "");
        }
    },
    IsReferrer: function (domain) {
        var _referrer = document.referrer;
        if (typeof (_referrer) != 'undefined' && _referrer != null && _referrer != '' && _referrer.indexOf(domain) > -1) {
            return true;
        }
        return false;
    },
    //返回cookie域名
    cooikeReffer: function () {
        return Cookie.getCookie("mtaochereff");
    }
}

//兼容老页面方法
function getargv(url, name) {
    return Taoche.getQuery(name, url);
}


/*用于页面弹出层的功能类  兼容老页面浮层*/
var backgroundC = {
    $: function (id) { return document.getElementById(id); }
	, dElement: function () {
	    return (document.compatMode && document.compatMode != "BackCompact") ? document.documentElement : document.body;
	}
	, style: function (o) {	//获取全局样式表、内嵌样式（不能设置）
	    return o.currentStyle || document.defaultView.getComputedStyle(o, null);
	}
	, alpha: function (o, num) {//设置透明度	
	    o.style.filter = 'alpha(opacity=' + num + ')';
	    o.style.backgroundColor = '#000';
	    o.style.opacity = num / 100;
	}
	, load: function (showId, bgId) {
	    var obj = this.$(bgId);
	    /*2011年改版的页面宽度是950，如果当前浏览器窗口宽度小于950，会强行把背景宽度设为950，以避免拖动水平滚动条时出现未被背景覆盖的区域*/
	    // obj.style.width = this.dElement().clientWidth < 950 ? '950px' : this.dElement().clientWidth + 'px';
	    obj.style.width = this.dElement().clientWidth + 'px';
	    obj.style.height = (this.dElement().scrollHeight > this.dElement().clientHeight ? this.dElement().scrollHeight : this.dElement().clientHeight) + 'px';
	    obj.style.display = 'block';
	    this.alpha(obj, 50);
	    var showObj = this.$(showId);
	    showObj.style.display = 'block';
	    // showObj.style.left = (this.dElement().clientWidth - parseInt(this.style(showObj).width)) / 2 + 'px';
	    showObj.style.left = ((this.dElement().clientWidth - parseInt(this.style(showObj).width)) / 2) - 10 + 'px';
	    var scrolt = document.documentElement.scrollTop || document.body.scrollTop
	    showObj.style.top = ((this.dElement().clientHeight - showObj.clientHeight) / 2 + scrolt) + 'px';
	    /*在浏览器窗口大小发生变化时重新加载背景和浮层，以适应新的窗口尺寸*/
	    window.onresize = function () {
	        if (backgroundC.$(showId).style.display != "none") {
	            backgroundC.load(showId, bgId);
	        }
	    }
	    //document.body.style.overflow = "hidden";
	}
	, close: function (showId, bgId) {
	    jQuery("#" + showId).fadeOut('slow');
	    jQuery("#" + bgId).fadeOut('slow');
	}
}


var query = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
};






