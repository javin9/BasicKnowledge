var $ = require('zepto')
require('zepto/src/fx');
require('zepto/src/fx_methods');
var IScroll = require('iscroll');
var check = require('./check/m.js');
//Return the module value
var applyTimer = null,
    applyBln = true;
var Tools = {
    /**
     *全局处理ajax
     *@param Object opt  传入ajax对象参数
     */
    ajaxUrl: {},
    provisionUrl: "",
    $ajax: function(opt) {
        if (Tools.ajaxUrl[opt.url]) {
            return false;
        }
        Tools.ajaxUrl[opt.url] = true;
        opt.cache = true;
        opt.dataType = opt.dataType ? opt.dataType : "json";
        opt.type = opt.type ? opt.type : "POST";
        opt.error = function(XMLHttpRequest, textStatus) {
            var status = XMLHttpRequest.status;
            if (status == 0)
                return;
            else if (status == 500)
                alert("服务器错误");
            else if (status == 404)
                alert("请求没有找到");
        };
        opt.goSuccess = opt.success;
        opt.success = function(res) {
            if (opt.goSuccess)
                opt.goSuccess(res);
        }
        opt.complete = function() {
            delete Tools.ajaxUrl[opt.url];
        }
        $.ajax(opt);
    },
    //写cookies
    SetCookie: function(name, value, exp, domain) {
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
    //读取cookies 
    GetCookie: function(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },
    //判断是不是IP
    IsIp: function(value) {
        var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        var reg = value.match(exp);
        if (reg == null) {
            return false;
        } else {
            return true;
        }
    },
    //泛域名处理
    WildcardUrl: function() {
        var url = "";
        var urlHostName = window.location.hostname;
        if (Tools.IsIp(urlHostName) || urlHostName == "localhost") {
            url = urlHostName
        } else {
            var urlArr = urlHostName.split(".");
            url = urlArr[urlArr.length - 2] + "." + urlArr[urlArr.length - 1];
        }
        return url;
    },
    //获取URL中的参数
    GetUrlParam: function(name) {
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
    //修改URL参数
    SetUrlParam: function(name, value, urlStr) {
        var pattern = name + '=([^&]*)',
            replaceText = name + '=' + value,
            url = urlStr || window.location.href;
        if (url.match(pattern)) {
            var tmp = '/(' + name + '=)([^&]*)/gi';
            tmp = url.replace(eval(tmp), replaceText);
            return tmp;
        } else {
            if (url.match('[\?]')) {
                return url + '&' + replaceText;
            } else {
                return url + '?' + replaceText;
            }
        }
        return url + '\n' + name + '\n' + value;
    },
    //提示
    ShowAlert: function(txt, time = 3000) {
        var showAlertBox,
            _txt = txt;
        if ($("#showAlertBox").length > 0) {
            showAlertBox = $("#showAlertBox");
        } else {
            showAlertBox = $('<div id="showAlertBox"><div class="layout-text font-title"><div></div>');
            $("body").append(showAlertBox);
        }
        $("#showAlertBox .layout-text").html(_txt);
        $("#showAlertBox").fadeIn();

        $('body').bind('touchmove', function(e) {
            e.preventDefault();
        });

        setTimeout(function() {
            $('body').unbind('touchmove');
            $("#showAlertBox").fadeOut(300);
        }, time);
    },
    /*服务条款提示
        /home/InfoUsingAuthorization  信息使用授权书
        /home/PersonalCreditAuthorization 个人征信授权书
        /home/Provision 车贷服务条款
    */
    ServiceProvision: function(options) {
        var opts = {
            url: "", //服务条款页面网址
            txt: "",
            title: "",
            params: {}
        };
        var servicePsionBox;
        opts = $.extend(opts, options);


        if ($("#servicePsionBox").length > 0) {
            servicePsionBox = $("#servicePsionBox");
            servicePsionBox.find(".layout-title").html('<div class="layout-close"></div>' + opts.title);
        } else {
            servicePsionBox = $('<div id="servicePsionBox"><div class="layout-text"><div class="layout-title font-title"><div class="layout-close"></div>' + opts.title + '</div><div class="layout-con" id="serviceLayoutCon"><div></div></div></div></div>');
            $("body").append(servicePsionBox);
        }

        servicePsionBox.show();

        var myScroll = new IScroll('#serviceLayoutCon');
        $('body').bind('touchmove', function(e) {
            e.preventDefault();
        });
        servicePsionBox.on("click", ".layout-close", function() {
            servicePsionBox.hide();
            $('body').unbind('touchmove');
        })

        if (opts.url != "" && Tools.provisionUrl != opts.url) {
            Tools.$ajax({
                url: opts.url,
                dataType: "text",
                data: opts.params,
                success: function(data) {
                    servicePsionBox.find("#serviceLayoutCon>div").html(data + "<br/><br/>");
                    myScroll.refresh();
                    Tools.provisionUrl = opts.url;
                }
            })
        } else if (opts.url == "" && opts.txt != "") {
            servicePsionBox.find("#serviceLayoutCon>div").html(opts.txt);
            myScroll.refresh();
        }
    }, //金额加逗号
    AddCmma: function(str) {
        var _unit = String(str).substring(str.length, str.length - 1),
            _str = String(Math.round(str));

        if (_unit == "元") {
            _str = String(Math.round(str.substring(0, str.length - 1)));
        } else if (_unit == "万") {
            _str = String(Math.round(Number(str.substring(0, str.length - 1)) * 10000));
        }
        return _str.replace(/\B(?=(?:\d{3})+\b)/g, ',')
    },
    //提交触发规则
    IsApply: function(callBacks) {
        if (!applyTimer) {
            callBacks(applyBln);
            applyBln = false;
            applyTimer = setTimeout(function() {
                applyBln = true;
                clearTimeout(applyTimer);
                applyTimer = null;
            }, 1000);
        } else {
            callBacks(applyBln);
        }
    },
    Browser: {
        versions: function() {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return { //移动终端浏览器版本信息 
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    },
    //js native桥
    JsNativeBridge: function(funName, arg) {

        if (Tools.Browser.versions.ios || Tools.Browser.versions.iPhone || Tools.Browser.versions.iPad) {
            // console.log("ios");
            //ios桥
            function setupWebViewJavascriptBridge(callback) {
                if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
                if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
                window.WVJBCallbacks = [callback];
                var WVJBIframe = document.createElement('iframe');
                WVJBIframe.style.display = 'none';
                WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
                document.documentElement.appendChild(WVJBIframe);
                setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
            }

            setupWebViewJavascriptBridge(function(bridge) {
                var uniqueId = 1;

                // bridge.registerHandler('testJavascriptHandler', function(data, responseCallback) {
                //     var responseData = { 'Javascript Says':'Right back atcha!' }
                //     responseCallback(responseData)
                // })
                bridge.callHandler(funName, arg, function(response) {})
            })
        } else if (Tools.Browser.versions.android) {
            // console.log("ahdriod");
            var callNative = function() {
                window.WebViewJavascriptBridge.callHandler(
                    funName, arg,
                    function(responseData) {
                        // alert(responseData);
                    }
                );

            };
            if (window.WebViewJavascriptBridge) {
                callNative();
            } else {
                document.addEventListener('WebViewJavascriptBridgeReady', callNative, false);
            }
        }
    },

    /*分机号弹层
     逻辑：排除可直接拨打分机号的浏览器，只在安卓的非正常浏览器中弹出;点击弹层中的按钮关闭弹层，继续跳转拨号
     参数：val 电话号码字符串，以"tel:"开头，以",分机号"结尾，如"tel:40012345,1234"*/
    // author: 陈济
    IfPopExtnum: function(val) {
        //判断访问终端
        var browser = {
            versions: function() {
                var u = navigator.userAgent,
                    app = navigator.appVersion,
                    ul = u.toLowerCase();
                return {
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    weixin: u.indexOf('MicroMessenger') > -1 //是否微信
                };
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        }

        var popExtHtml = '';

        if (browser.versions.android) {
            // alert("安卓端");
            // 弹出分机
            var telNums = val.split(','),
                extNum = telNums[telNums.length - 1];

            var popExtHtml = '<section id="popExt" class="tools_pop_ext">' +
                '<div class="pop_ext_cont">' +
                '<p class="ext_num">' + extNum + '</p>' +
                '<p class="ext_msg">请您牢记分机号</p>' +
                '<a href="javascript:void(0);" class="ext_btn">我记住了</a>' +
                '</div>' +
                '</section>' +
                '<div id="maskLayerExt" style="display:block;"></div>';
            $('#yxWrapper').append(popExtHtml);
            // $('#maskLayer').show();
            $('body').bind('touchmove', function(e) {
                e.preventDefault();
            });

            // 点击分机层按钮
            $('#popExt .ext_btn').click(function() {
                $('#popExt, #maskLayerExt').remove();
                // $('#maskLayer').hide();
                $('body').unbind('touchmove');
                // 微信或qq需要加后缀
                if (browser.versions.weixin || browser.versions.qq) {
                    location.href = val + '#http://mp.weixin.qq.com';
                    event.stopPropagation();
                } else {
                    location.href = val;
                    event.stopPropagation();
                }
            });
            // 点击分机号蒙层
            $('#maskLayerExt').click(function() {
                $('#popExt, #maskLayerExt').remove();
                $('body').unbind('touchmove');
            });
        } else {
            // 非安卓，直接拨
            location.href = val;
        }
    },
    //获取登录状态给app add by shangbinjie，2016/12/1
    GetLoginStatus: function(callback) {
        //登录状态
        var _isWebView = Tools.IsWebView(),
            isApp = Boolean(_isWebView == 'yixinapp' || _isWebView == 'yixinbjapp'),
            // _logintype = Tools.GetCookie("logintype"),
            _currentUserIdentityUrl = "";
        if (typeof(USERCENTERURL) == "undefined") {
            _currentUserIdentityUrl = "//i.m.daikuan.com/User/GetCurrentUserIdentity";
        } else {
            _currentUserIdentityUrl = USERCENTERURL + '/User/GetCurrentUserIdentity';
        }
        $.ajax({
            url: _currentUserIdentityUrl,
            dataType: "jsonp",
            beforeSend: function() {},
            success: function(res) {
                // 注册事件，提供获取状态公共接口, 使用triggerHandler获取
                // zepto无法写入widnow data
                $('body').data('userStatusReady', true)
                $(window).data('userStatusReady', true).on('getUserStatus', () => {
                    return {
                        login: res.Islogin,
                        id: res.LoanUserID,
                        mobile: res.Telphone,
                        hashMobile: res.HashTelphone,
                        token: res.Token,
                        name: res.UserName
                    }
                })

                typeof callback == "function" && callback(res);

                if (isApp) {
                    Tools.JsNativeBridge("pushUser", {
                        tel: res.Telphone,
                        token: res.Token
                    });
                }
            },
            error: function(err) {
                console.log(err);
                typeof callback == "function" && callback(err);
            }
        });
    },

    // app下载
    AppDown: function(isFlex = false) {
        var _isWebView = Tools.IsWebView(),
            isApp = Boolean(_isWebView == 'yixinapp' || _isWebView == 'yixinbjapp'),
            curPageFrom = Tools.GetUrlParam("from") ? Tools.GetUrlParam("from") : Tools.GetCookie("from"),
            isCurFrom;
        if (typeof(noAppDown) != "undefined") {
            var noAppDownArr = noAppDown.split(",");
            if (noAppDownArr.indexOf(curPageFrom) >= 0) {
                isCurFrom = true;
            }
        }
        var $loadAppButton = $('#loadAppButton');
        var firstDiv = $('body').children("div").get(0);
        //行内css
        var appDownCSS = 'style="height: 1.44rem;"';
        if (isFlex) {
            var appdown_area = 'position: fixed; top: 0; left: 0; z-index: 8888; width: 100%; max-width:10rem; height: 1.44rem; left: 50%; -webkit-transform: translate3d(-50%, 0, 0); transform: translate3d(-50%, 0, 0); background: rgba(0, 0, 0, .8); ';
        } else {
            var appdown_area = 'position: relative; top: 0; left: 0; z-index: 8888; width: 100%; max-width:10rem; height: 1.44rem; left: 50%; -webkit-transform: translate3d(-50%, 0, 0); transform: translate3d(-50%, 0, 0); background: rgba(0, 0, 0, .8); ';
        }
        var uf = 'display: -webkit-box; display: -webkit-flex; display: flex;';
        var uf_ac = '-webkit-align-items: center; align-items: center; -webkit-box-align: center;';
        var uf_f1 = 'position:relative; -webkit-box-flex: 1; box-flex: 1; -webkit-flex: 1; flex: 1;';
        var appdown_close = 'display: block; width: 1.2rem; height: 100%; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjlDRDkwMURFODE1QjExRTZCNTE5RDFBREFBNEZBMjBCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjlDRDkwMURGODE1QjExRTZCNTE5RDFBREFBNEZBMjBCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OUNEOTAxREM4MTVCMTFFNkI1MTlEMUFEQUE0RkEyMEIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OUNEOTAxREQ4MTVCMTFFNkI1MTlEMUFEQUE0RkEyMEIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6x1rmxAAADUElEQVR42syY3UsUURjGp3G7KAmkws/AO9foLiqWKMu66MMLa+syDQyTEqGuTLpv+wuKEipybyIyQ1aWyHIrUim6dfOqcNUskq7ywph6XniOTMPszDm7U3Tg5+zMnPd9H8/He86Z2FxhwTIsMdAEDoB9YDeo47tF8Ba8BjkwC36aOF9nIKgRDIBuYGvaOGAQpMAnHQMdx5tBBnwEPeAruAx2gE2gQv4xUsFn8u4S6/bQNkNfZbXQGTDE39IFF0Ae/NLtAXbvLXaxlA6QNm0heX6PYr6DBDgIZgzEWKz7gbYJ+hqib1tXkM3mPctWqQfTVvllmr5y9J3xi+8nSAbhUTACDoEVK7qyQp8jjDEYJqgTdIFxcIqzJOri0Pc4Y3UWG9QyA76xn+sjbhm/sgFI8CqwBSyrJKfKfV6PecVsa6iLREFhftHbfRJrkgO9zd1ljXzwAkwF+KzmVLYMpn11wPspxjxODWuCrvB6MUTMEhjWTKhS5zFtagLq9fI6oIyk287TMB9gKFn3CTgBHoWIsim8nTZfAurOMLYsSevFME4HKY0kl9QQ5RWT1EimKdo1yZ8WPnyqOWXdorzd5ydGJ3Wo2C22a42ZM8gjSlS7S1SpYtyx98v42cmbH4bJLekSMMznpYhxx94Tc22unBIyrluUVaIYd+wa2/rPis1tp+5mLWg2eceUqS8pS/LjPW82liEmWWSg6xYV+50YvVJLVhlinIDZp1NU7JwYTPDmSBliwlJCWFGxX9o8qoijfo2FUifP+IkKW5D7aTcrglbBbU7/5pDFVTfPeEUFrfhxxpbd46pqzuu83ggwlAWwFpzUzDMO69bStli56VrP1vpXDnFjoJWngyBRpqeOIDEJxhxTB0m/LewyR/2/2MIWGHcrY/8xA0TIOVYYLSG5mSbCUcbqUmL8svMdchg8/EuixOcDxpBYd8POZbJzy3KWPGfTRtlNz8BpxujWOSg63PCnuVdaCBnouiVBX6303eY3W+2AKdtBqnhUmWDOMC1xtvQkfSm/TimfY9KcAVm2lhwCPoM+sB1U+mxhK/muj3XzbJUsfaWj/GB1lTPRZLBLBr7Gb0SRfkFzf9Jr5ieWvWAXaOC7edlCgDfs4rzpJ73fAgwANLH2bePw7RUAAAAASUVORK5CYII=); background-position: 0.4rem center; background-repeat: no-repeat; -webkit-background-size: 0.48rem 0.48rem; background-size: 0.48rem 0.48rem; ';
        var appdown_logo = 'display: block; width: 1.066667rem; height: 1.066667rem; background-image: url(data:image/png;base64,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); background-repeat: no-repeat; -webkit-background-size: 100% 100%; background-size: 100% 100%;';
        var appdown_txt = 'padding-left: 0.186667rem; line-height: 1.5;';
        var appdown_btn = 'display: block; width: 3.333333rem; height: 100%; line-height: 1.44rem; text-align: center; background-color: #e9474d;';
        if (!isApp && !isCurFrom && Tools.GetUrlParam('track') != 'tf') {
            $(firstDiv).before('<section ' + appDownCSS + ' id="appDown"><a href="yxcarloan://www.daikuan.com" id="loadAppButton" class=""></a><div style="' + appdown_area + uf + uf_ac + '" ><a href="javascript:;" id="app_colse"  style="' + appdown_close + '" class="click_close" ><span class="hide">x</span></a><span alt="" style="' + appdown_logo + '"></span><div style="' + appdown_txt + uf_f1 + '"><p style="color:#fff!important;" class="font-size-26">App专享0息</p><p style="color:#999!important;" class="font-size-24">登录即可领取3万额度</p></div><a href="http://m.daikuan.com/app/down/" class="font-size-32" style=" ' + appdown_btn + '       color:#fff!important;">下载领取</a></div></section>')
            var $appDown = $('#appDown');
            if (Tools.GetCookie('hideAppDown') == '1') {
                $appDown.addClass('hide').css({
                    "display": "none !important"
                });
            } else {
                $appDown.removeClass('hide').css({
                    "display": "block !important"
                });
                var ev = new Event(
                    'appDownShow', {
                        'bubbles': true, //是否冒泡
                        'cancelable': false //是否可以被取消
                    }
                )
                document.dispatchEvent(ev);
                var ua = navigator.userAgent;
                var platform = /MicroMessenger/i.test(ua) ? "weixin" : /Android/i.test(ua) ? "android" : /iPhone|iPad|iPod/i.test(ua) ? "ios" : "pc";
                if (platform != "pc" && platform != "android" && Tools.GetCookie('hasOpen') != '1') {
                    // 记录第一次打开
                    var cookieHasOpen = 'hasOpen=1;path=/;domain=' + Tools.WildcardUrl();
                    document.cookie = cookieHasOpen;
                    $loadAppButton.trigger('click');
                }
            }
            $(document).on('click', '.click_close', function(e) {
                e.preventDefault();
                // 关闭浮层，记录cookie
                $('#appDown').addClass('hide').css({
                    "display": "none !important"
                });
                $('body').animate({
                    'padding-top': 0
                });
                var cookieString = 'hideAppDown=1;path=/;domain=' + Tools.WildcardUrl();
                document.cookie = cookieString;

            });
        }
    },

    // 手机号通道
    TelChannel: function(data) {
        let self = this;
        let defaultData = {
                'CarId': '',
                'PackageId': '',
                'CarText': '',
                'CompanyId': '',
                'PackageText': '',
                'CityId': '',
                'CityText': '',
                'DeviceType': 2, //设备类型 1-pc  2-m  3-ios  4-android
                'PageType': 1, //入口页类型 1-首页 2-列表页结果区 3-列表页无结果 4-按预算列表无结果 5-列表页底部 6-详情页 9-资讯列表页 10-资讯详情页
                'statisticalMarker': '', //统计标记点

                'isDefault': true, //是否是在默认正常的 true是 false是无结果
                'id': '', //初始化DOM结构id
                'telId': 'mobile', //手机号输入框id
                'isShowP1': true,
            },
            _data = $.extend(defaultData, data);

        let firstHtml = `<div class="channel-box">
                <p style="${_data.isShowP1?'display:block;':'display:none;'}">没找到合适的？眼花缭乱？</p>
                <p>免费打电话，获得专业的贷款建议</p>
                <div class="uf">
                    <div class="input-box">
                        <input id="${_data.telId}" type="tel" value="" name="Phone" placeholder="请输入手机号码" maxlength="11">
                    </div>
                    <div id="${_data.telId}Recommend" class="btn">为我推荐</div>
                </div>
            </div>`,
            secondHtml = `<div class="channel-default">
              <h3>小鑫建议您：</h3>
              <p>1、调整首付或减少筛选条件</p>
              <p>2、免费打电话，免费获得专业的贷款建议</p>
              <div class="uf">
                  <div class="input-box">
                      <input id="${_data.telId}" type="tel" value="" name="Phone" placeholder="请输入手机号码" maxlength="13">
                  </div>
                  <div id="${_data.telId}Recommend" class="btn">为我推荐</div>
              </div>
            </div>`;

        // let inputSetInterval = null;

        let addSpace = true,
            $maskLayer = $('#TelPopUpMask'),
            $TelPopUpMask = $('#TelPopUp'),
            $applyBtn = $('#TelPopUp .apply-btn'),
            $codeTip = $('#TelPopUp .tips p');

        let __RequestVerificationToken = $('#__RequestVerificationToken').val();

        if (_data.isDefault)
            $('#' + _data.id).html(firstHtml);
        else
            $('#' + _data.id).html(secondHtml);

        document.onkeydown = function(e) {
            addSpace = e.keyCode != 8 ? true : false;
        }
        $('#' + _data.telId).on('focus', function(e) {
            // console.log(_data.statisticalMarker +'1')
            try {
                _hmt.push(['_trackEvent', _data.statisticalMarker + '1', 'click', '', '']);
            } catch (e) {

            }
        })

        $('#' + _data.id).off('click').on('click', '#' + _data.telId + 'Recommend', function() {
            let tel = $.trim($('#' + _data.telId).val());
            if (tel.length > 0) {
                tel = tel.replace(/\s/g, "");
            }
            $('#Phone').val(tel);
            if (check.isPhoneNumber(tel)) {
                // console.log( _data.statisticalMarker +'2');
                try {
                    _hmt.push(['_trackEvent', _data.statisticalMarker + '2', 'click', '', '']);
                } catch (e) {

                }
                self.$ajax({
                    url: ADVISERAPIURL + 'user/validatephone?Phone=' + tel,
                    type: 'Get',
                    success: function(res) {
                        if (res.Result) {
                            $('#TelNum').text(tel.replace(/(\d{3})\d{4}(\d{4})/, '$1 **** $2'));
                            check.getCode({
                                tel_id: 'Phone',
                                gvc_id: 'GetValidateCode',
                                line: BusinessLine,
                                url: CODE_GETTING_URL,
                                __RequestVerificationToken: __RequestVerificationToken,
                                codelen: 4,
                            }, function() {});

                            $('body').css({
                                'position': 'fixed',
                                'top': 0,
                                'left': 0
                            }).bind('touchmove', function(e) {
                                e.preventDefault();
                            });

                            setTimeout(function() {
                                $('#TelPopUp').removeClass('hide');
                            }, 300);
                            $maskLayer.removeClass('hide');
                            $TelPopUpMask.removeClass('hide');
                        } else {
                            Tools.ShowAlert(res.Message, 2000);
                        }
                    }
                });
            } else {
                Tools.ShowAlert('请输入正确手机号', 2000);
            }

        });

        $('#GetValidateCode').on('click', function() {
            check.getCode({
                tel_id: 'Phone',
                gvc_id: 'GetValidateCode',
                line: BusinessLine,
                __RequestVerificationToken: __RequestVerificationToken,
                codelen: 4,
            }, function() {});
        });

        $('#TelPopUp .validateCode').bind({
            'blur': function() {
                let leg = $.trim($(this).val()).length;
                if (leg == 4) {
                    $applyBtn.addClass('cur');
                    // $codeTip.fadeOut();
                } else if (leg == 0) {
                    $applyBtn.removeClass('cur');
                    $codeTip.fadeOut().text('请输入验证码');
                } else {
                    $codeTip.fadeIn().text('请输入验证码');
                    $('#TelPopUp .validateCode').addClass('red');
                }

            },
            'focus': function() {
                let leg = $.trim($(this).val()).length;
                if ((leg != 0 && leg != 4) || $('#TelPopUp .validateCode').hasClass('red')) {
                    $('#TelPopUp .validateCode').val('').removeClass('red');
                    $applyBtn.removeClass('cur');
                    $codeTip.fadeOut();
                } else if (leg == 4) {
                    $codeTip.fadeOut();
                }
                // console.log(_data.statisticalMarker +'3')
                try {
                    _hmt.push(['_trackEvent', _data.statisticalMarker + '3', 'click', '', '']);
                } catch (e) {

                }
            },
            'input propertychange': function() {
                let inputValLeg = $.trim($(this).val()).length;
                if (inputValLeg == 4) {
                    $applyBtn.addClass('cur');
                    $codeTip.fadeOut();
                }
            }
        });

        $applyBtn.off("click").on('click', function(e) {
            // e.stopPropagation();
            if ($('#TelPopUp .validateCode').val() == "") {
                $codeTip.fadeIn().text('请输入验证码');
            } else {
                check.checkCode({
                    number: $.trim($('#TelPopUp .validateCode').val()),
                    tel_id: 'Phone',
                    gvc_id: 'GetValidateCode',
                    line: BusinessLine,
                }, function(res) {
                    if (!res.Result) {
                        $codeTip.fadeIn().text('验证码错误');
                        $('#TelPopUp .validateCode').addClass('red');
                    } else {
                        // console.log( _data.statisticalMarker +'4');
                        try {
                            _hmt.push(['_trackEvent', _data.statisticalMarker + '4', 'click', '', '']);
                        } catch (e) {

                        }
                        $codeTip.fadeOut();
                        // 提交申请
                        self.$ajax({
                            url: ADVISERAPIURL + 'user/postuserphone?Phone=' + $('#Phone').val() + '&DeviceType=' + _data.DeviceType + '&CityId=' + _data.CityId + '&CarId=' + _data.CarId + '&PackageId=' + _data.PackageId + '&PageType=' + ($TelPopUpMask.data('page-type') || _data.PageType) + '&CarText=' + _data.CarText + '&CityText=' + _data.CityText + '&PackageText=' + _data.PackageText + '&CompanyId=' + _data.CompanyId,
                            type: 'Get',
                            success: function(res) {
                                // 为同页面不同模块调用提供临时替换pagetype的方案
                                $TelPopUpMask.data('page-type', '')
                                if (res.Result) {
                                    //成功
                                    $('#TelPopUp').addClass('hide');
                                    $('#telSuccess').removeClass('hide');
                                    $TelPopUpMask.css({
                                        'bottom': 'auto',
                                        'top': '50%'
                                    })
                                } else {
                                    Tools.ShowAlert(res.Message, 2000);
                                }
                            }
                        })

                    }
                });

            }
        });

        function setPupBox() {
            $('#telSuccess').addClass('hide');
            $TelPopUpMask.css({
                'bottom': 0,
                'top': 'auto',
            }).addClass('hide');
            $maskLayer.addClass('hide');
            $codeTip.fadeOut();
            $applyBtn.removeClass('cur');
            $('#TelPopUp .validateCode').val('');
            $('#' + _data.id + ' #' + _data.telId).val('');
            $('#GetValidateCode').removeClass("disable").text("获取验证码");
            clearInterval(window.tmo);
            $('body').css({
                'position': 'static'
            }).unbind('touchmove');
        }
        // $('#TelPopUpMask').click(function(e){
        //     e.stopPropagation();
        //     if($(e.target).attr('id') == 'TelPopUpMask'){
        //         setPupBox();
        //     }
        //
        // });

        $('#telSuccess .ok-btn,  #TelPopUp .close').on('click', function() {
            setPupBox();
        });
    },
    //APP判断（易鑫App返回 yixinapp， 报价App返回 yixinbjapp）
     IsWebView: function() { 
        // console.log(yiXinAppInfoCookie)
         
        if (yiXinAppInfoCookie) { 
            let appName = JSON.parse(yiXinAppInfoCookie).SOURCE; 
            return appName; 
        } else { 
            return false; 
        }
    },
    //滚动
    Scroll:function(scrollTo, time) {
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
    },
    //顶通广告位
    AdvHeader: function(obj) {
        let defaultObj = {
                isFlex: false, //是否flex 默认不是flexd
                headerAdvUrl: 'javascript:void(0);', //广告位链接
                advImgBase64: '' //广告位背景图base64数据
            },
            dataObj = $.extend(defaultObj, obj);

        var isApp = Tools.GetCookie("YiXinAppInfo"),
            curPageFrom = Tools.GetUrlParam("from") ? Tools.GetUrlParam("from") : Tools.GetCookie("from"),
            isCurFrom;
        if (typeof(noAppDown) != "undefined") {
            var noAppDownArr = noAppDown.split(",");
            if (noAppDownArr.indexOf(curPageFrom) >= 0) {
                isCurFrom = true;
            }
        }
        var $loadAppButton = $('#loadAppButton');
        var firstDiv = $('body').children("div").get(0);
        //行内css
        var appDownCSS = 'style="height: 1.44rem;"';
        if (dataObj.isFlex) {
            var appdown_area = 'position: fixed; top: 0; left: 0; z-index: 8888; width: 100%; max-width:10rem; height: 1.44rem; left: 50%; -webkit-transform: translate3d(-50%, 0, 0); transform: translate3d(-50%, 0, 0);';
        } else {
            var appdown_area = 'position: relative; top: 0; left: 0; z-index: 8888; width: 100%; max-width:10rem; height: 1.44rem; left: 50%; -webkit-transform: translate3d(-50%, 0, 0); transform: translate3d(-50%, 0, 0);';
        }
        var uf = 'display: -webkit-box; display: -webkit-flex; display: flex;';
        var uf_f1 = 'position:relative; -webkit-box-flex: 1; box-flex: 1; -webkit-flex: 1; flex: 1;';
        var uf_ac = '-webkit-align-items: center; align-items: center; -webkit-box-align: center;';
        var appdown_close = 'display: block; width: 1.2rem; height: 100%; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjlDRDkwMURFODE1QjExRTZCNTE5RDFBREFBNEZBMjBCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjlDRDkwMURGODE1QjExRTZCNTE5RDFBREFBNEZBMjBCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OUNEOTAxREM4MTVCMTFFNkI1MTlEMUFEQUE0RkEyMEIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OUNEOTAxREQ4MTVCMTFFNkI1MTlEMUFEQUE0RkEyMEIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6x1rmxAAADUElEQVR42syY3UsUURjGp3G7KAmkws/AO9foLiqWKMu66MMLa+syDQyTEqGuTLpv+wuKEipybyIyQ1aWyHIrUim6dfOqcNUskq7ywph6XniOTMPszDm7U3Tg5+zMnPd9H8/He86Z2FxhwTIsMdAEDoB9YDeo47tF8Ba8BjkwC36aOF9nIKgRDIBuYGvaOGAQpMAnHQMdx5tBBnwEPeAruAx2gE2gQv4xUsFn8u4S6/bQNkNfZbXQGTDE39IFF0Ae/NLtAXbvLXaxlA6QNm0heX6PYr6DBDgIZgzEWKz7gbYJ+hqib1tXkM3mPctWqQfTVvllmr5y9J3xi+8nSAbhUTACDoEVK7qyQp8jjDEYJqgTdIFxcIqzJOri0Pc4Y3UWG9QyA76xn+sjbhm/sgFI8CqwBSyrJKfKfV6PecVsa6iLREFhftHbfRJrkgO9zd1ljXzwAkwF+KzmVLYMpn11wPspxjxODWuCrvB6MUTMEhjWTKhS5zFtagLq9fI6oIyk287TMB9gKFn3CTgBHoWIsim8nTZfAurOMLYsSevFME4HKY0kl9QQ5RWT1EimKdo1yZ8WPnyqOWXdorzd5ydGJ3Wo2C22a42ZM8gjSlS7S1SpYtyx98v42cmbH4bJLekSMMznpYhxx94Tc22unBIyrluUVaIYd+wa2/rPis1tp+5mLWg2eceUqS8pS/LjPW82liEmWWSg6xYV+50YvVJLVhlinIDZp1NU7JwYTPDmSBliwlJCWFGxX9o8qoijfo2FUifP+IkKW5D7aTcrglbBbU7/5pDFVTfPeEUFrfhxxpbd46pqzuu83ggwlAWwFpzUzDMO69bStli56VrP1vpXDnFjoJWngyBRpqeOIDEJxhxTB0m/LewyR/2/2MIWGHcrY/8xA0TIOVYYLSG5mSbCUcbqUmL8svMdchg8/EuixOcDxpBYd8POZbJzy3KWPGfTRtlNz8BpxujWOSg63PCnuVdaCBnouiVBX6303eY3W+2AKdtBqnhUmWDOMC1xtvQkfSm/TimfY9KcAVm2lhwCPoM+sB1U+mxhK/muj3XzbJUsfaWj/GB1lTPRZLBLBr7Gb0SRfkFzf9Jr5ieWvWAXaOC7edlCgDfs4rzpJ73fAgwANLH2bePw7RUAAAAASUVORK5CYII=); background-position: 0.4rem center; background-repeat: no-repeat; -webkit-background-size: 0.48rem 0.48rem; background-size: 0.48rem 0.48rem; ';
        var advHeader_btn = 'display: block; height: 100%; ';
        var adv_img = 'background-image: url(' + dataObj.advImgBase64 + ');background-repeat: no-repeat; background-size: contain;'
        if (!isApp && !isCurFrom && Tools.GetUrlParam('track') != 'tf') {
            $(firstDiv).before('<section ' + appDownCSS + ' id="appDown">' +
                '<div id="adv_img" style="' + appdown_area + adv_img + uf + uf_ac + '" >' +
                '<a href="javascript:;" id="app_colse"  style="' + appdown_close + '" class="click_close" ><span class="hide">x</span></a>' +
                '<a href=' + dataObj.headerAdvUrl + ' style="' + advHeader_btn + uf_f1 + '"></a>' +
                '</div>' +
                '</section>');

            var $appDown = $('#appDown');
            if (Tools.GetCookie('hideAppDown') == '1') {
                $appDown.addClass('hide').css({
                    "display": "none !important"
                });
            } else {
                $appDown.removeClass('hide').css({
                    "display": "block !important"
                });
            }

            $(document).on('click', '#app_colse', function(e) {
                // 关闭浮层，记录cookie
                $('#appDown').addClass('hide').css({
                    "display": "none !important"
                });
                $('body').animate({
                    'padding-top': 0
                });
                var cookieString = 'hideAppDown=1;path=/;domain=' + Tools.WildcardUrl();
                document.cookie = cookieString;
            });
        }

    },

    // ab测试
    Abtest(fn, limit){
        const REQ_INT = 1000
        const LIMIT_RETRY = limit || 10
        let retryCount = 0

        // 根据uuid的到ABTestKey
        const getKeyValue = (value) => {
            value = (value || '1') + ''
            return parseInt(value.substring(0,1), 16) % 2 ? 1 : 2
        }

        // 轮询uuid
        const getAbStatus = cb => {
            const uuid = this.getCookie('_utrace')
            const async = typeof cb === 'function'

            if(uuid || retryCount > LIMIT_RETRY || !async ){
                return async ? cb(getKeyValue(uuid)) : getKeyValue(uuid)
            }else{
                retryCount++
                setTimeout(getAbStatus.bind(this, cb), REQ_INT)
            }
        }

        return getAbStatus(fn)
    }
};
var yiXinAppInfoCookie = Tools.GetCookie('YiXinAppInfo');
//--------------------------------------------------------//
module.exports = {
    $ajax: Tools.$ajax,
    setCookie: Tools.SetCookie,
    getCookie: Tools.GetCookie,
    getUrlParam: Tools.GetUrlParam, //获取URL中的参数
    setUrlParam: Tools.SetUrlParam, //修改URL参数
    showAlert: Tools.ShowAlert,
    alert: Tools.ShowAlert,
    serviceProvision: Tools.ServiceProvision, //服务条款
    wildcardUrl: Tools.WildcardUrl,
    isIP: Tools.IsIP, //获取IP
    addCmma: Tools.AddCmma, //金额加逗号
    isApply: Tools.IsApply,
    jsNativeBridge: Tools.JsNativeBridge, //native桥
    browser: Tools.Browser,
    ifPopExtnum: Tools.IfPopExtnum, // 电话链接，分机号弹层
    getLoginStatus: Tools.GetLoginStatus, //获取登录状态并传给app
    appDown: Tools.AppDown, //app下载框
    telChannel: Tools.TelChannel,
    isWebView: Tools.IsWebView,
    advHeader: Tools.AdvHeader, //顶通广告位
    scroll:Tools.Scroll, //滚动
    abtest: Tools.Abtest
}