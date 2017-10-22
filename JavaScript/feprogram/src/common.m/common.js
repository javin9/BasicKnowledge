require('./common.scss')
require('zepto')
var tools = require('libs/tools.m.js')

//临时解决iscroll5 在chrome 55 以上版本的问题
window.PointerEvent = undefined;

if(dev){
	require('./dev')
}

window.tools = window.Tools = tools

var domain = tools.wildcardUrl(); 
// console.log(domain);
//获取url中的from值并存入cookie
//种一个fpath的cookie，类似from
var fromVal = tools.getUrlParam("from"),
    semcodeVal = tools.getUrlParam("semcode"),
    fpath = tools.getUrlParam("fpath");
if(fromVal){
    if(tools.browser.versions.android && fromVal == "yca7"){
        tools.setCookie("from","yca8","",domain);
    }else{
        tools.setCookie("from",fromVal,"",domain);
    } 
    if(tools.browser.versions.android && fromVal == "870"){
        tools.setCookie("from","871","",domain);
    }
}
if(semcodeVal) {
    var cookieSemcode = 'semcode='+semcodeVal+';path=/;domain=' + domain;
    document.cookie = cookieSemcode;
}
if (fpath){
    tools.setCookie("fpath",fpath,"",domain);
}


// 来自百度等搜索引擎的来源，记特殊from
var referer = document.referrer
if(!fromVal && !semcodeVal && referer){
    if(/baidu\.com/.test(referer)){
        tools.setCookie('from','seo_baidu','',domain)
    }else if(/sm\.cn/.test(referer)){
        tools.setCookie('from','seo_sm','',domain)
    }else if(/so\.com/.test(referer)){
        tools.setCookie('from','seo_so','',domain)
    }
}

var _isWebView = tools.isWebView(),
    isApp = Boolean(_isWebView == 'yixinapp' || _isWebView == 'yixinbjapp');
$(function(){
    if(isApp){
        if($(".header-bar").length && $(".header-bar").attr("id")!="cheliang"){
            var appTitle = $(".header-bar>a").next().text();
            appTitle = appTitle.replace("·","");
            tools.jsNativeBridge("getTitle",appTitle);
        }

        //增加修改form
        var inputChannel = $('form input[name="Channel"]');
        if(inputChannel.length>0){
            inputChannel.val(Boolean(_isWebView == 'yixinapp')?"87":"1063");
        }
    } 
})


//登录状态
var _currentUserIdentityUrl="",
    _logintype = tools.getCookie("logintype");
if(typeof(USERCENTERURL)=="undefined"){
    _currentUserIdentityUrl = "//i.m.daikuan.com/User/GetCurrentUserIdentity";
}else{
    _currentUserIdentityUrl = USERCENTERURL + '/User/GetCurrentUserIdentity';
}

if(_isWebView){
    $.ajax({
        url: _currentUserIdentityUrl,
        dataType: "jsonp",
        beforeSend: function(){
        },
        success: function(res){
            //17-06-21删除$('body').data('userStatusReady', true)，放入tools的GetLoginStatus方法中
            //此方法只会在APP中调用（由于访问量过大，删除M站全局调用）
            if(isApp && res.Islogin && res.Token && !_logintype){
                tools.jsNativeBridge("pushUser",{
                    tel:res.Telphone,
                    token:res.Token
                });
            }
        },
        error: function(err){
            console.log(err);
        }
    })
}



var bottomToTopClass = ".bottom-to-top";
var windowHeight =  $(window).height();

// $.zepto.scrollTop = function (pixels) {
//     this[0].scrollTop = pixels;
// };
function scroll(scrollTo, time) {
    var scrollFrom = parseInt(document.documentElement.scrollTop || document.body.scrollTop),
        i = 0,
        runEvery = 5; // run every 5ms

    scrollTo = parseInt(scrollTo);
    time /= runEvery;

    var interval = setInterval(function () {
        i++;

        document.documentElement.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;
        document.body.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;

        if (i >= time) {
            clearInterval(interval);
        }
    }, runEvery);
}

$(document).on("click", bottomToTopClass, function(){
    scroll(0,500);
});

var bottomToTopTimeout;

$(document).on('scroll', function(event) {
    event.preventDefault();
    if(document.documentElement.scrollTop || document.body.scrollTop > windowHeight*1.5){
       $(bottomToTopClass).show();
    }else{
        $(bottomToTopClass).hide();
    }

    if($(window).height() + $(window).scrollTop() >=$(document).height()){
        if(bottomToTopTimeout){
            clearTimeout(bottomToTopTimeout);
        }
        bottomToTopTimeout = setTimeout(function(){
                                $(bottomToTopClass).hide();
                            },1000)
    }
})




//延迟加载
window.Echo = (function(window, document, undefined) {
    'use strict';
    var store = [],
    offset,
    throttle,
    poll,
    src;
    var _inView = function(el) {
        var coords = el.getBoundingClientRect();
        return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight) + parseInt(offset));
    };
    var _pollImages = function() {
        for (var i = store.length; i--;) {
            var self = store[i];
            if (_inView(self)) {

                if (self.getAttribute('data-echo-background') !== null) {
                  self.style.backgroundImage = 'url(' + self.getAttribute('data-echo-background') + ')';
                }
                else if (self.src !== (src = self.getAttribute('data-echo'))) {
                  self.src = src;
                }

                // self.src = self.getAttribute('data-echo');
                store.splice(i, 1);
            }
        }
    };
    var _throttle = function() {
        clearTimeout(poll);
        poll = setTimeout(_pollImages, throttle);
    };
    var init = function(obj) {
        var nodes = document.querySelectorAll('[data-echo],[data-echo-background]');
        var opts = obj || {};
        offset = opts.offset || 0;
        throttle = opts.throttle || 250;
        for (var i = 0; i < nodes.length; i++) {
            store.push(nodes[i]);
        }
        _throttle();
        if (document.addEventListener) {
            window.addEventListener('scroll', _throttle, false);
        } else {
            window.attachEvent('onscroll', _throttle);
        }
    };
    return {
        init: init,
        render: _throttle
    };
})(window, document);
