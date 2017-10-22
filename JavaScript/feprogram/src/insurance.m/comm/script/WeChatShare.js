var WeiXin = {
    isReadySuccess: false,   //微信注册是否成功   
    config: wx.config,       //微信wx.config 具体参照微信官方文档
    load: function (config, shareconfig) {
        wx.ready(function () {
            //检测微信是否注册成功
            wx.checkJsApi({
                jsApiList: [
                  'checkJsApi',
                  'onMenuShareTimeline',
                  'onMenuShareAppMessage',
                  'onMenuShareQQ',
                  'onMenuShareWeibo'
                ],
                success: function (res) {
                    //alert("检测");
                    //alert(res);
                    isReadySuccess = true;
                },
                failure: function (res) {
                    //alert("wx.ready返回错误" + res);
                }
            });
            //分享给朋友
            wx.onMenuShareAppMessage({
                title: shareconfig.title,
                desc: shareconfig.desc,
                link: shareconfig.url,
                imgUrl: shareconfig.img,
                trigger: function (res) {
                    //alert('用户点击分享到朋友圈');
                    WeiXin.trigger(res);
                },
                success: function (res) {
                    window.location.href = href;
                    //alert('已分享');
                    WeiXin.success(res);
                },
                cancel: function (res) {
                    //alert('已取消');
                    WeiXin.cancel(res);
                },
                fail: function (res) {
                    //alert(JSON.stringify(res));
                    WeiXin.fail(res);
                }
            });
            //分享至朋友圈
            wx.onMenuShareTimeline({
                title: shareconfig.title,
                //desc: Shareconfig.desc,
                link: shareconfig.url,
                imgUrl: shareconfig.img,
                trigger: function (res) {
                    //alert('用户点击分享到朋友圈');
                    WeiXin.trigger(res);
                },
                success: function (res) {
                    window.location.href = href;
                    //alert('已分享');
                    WeiXin.success(res);
                },
                cancel: function (res) {
                    //alert('已取消');
                    WeiXin.cancel(res);
                },
                fail: function (res) {
                    //alert(JSON.stringify(res));
                    WeiXin.fail(res);
                }
            });
            //QQ分享
            wx.onMenuShareQQ({
                title: shareconfig.title,
                desc: shareconfig.desc,
                link: shareconfig.url,
                imgUrl: shareconfig.img,
                trigger: function (res) {
                    //alert('用户点击分享到QQ');
                    WeiXin.trigger(res);
                },
                complete: function (res) {
                    //alert(JSON.stringify(res));
                },
                success: function (res) {
                    window.location.href = href;
                    //alert('已分享');
                    WeiXin.success(res);
                },
                cancel: function (res) {
                    //alert('已取消');
                    WeiXin.cancel(res);
                },
                fail: function (res) {
                    //alert(JSON.stringify(res));
                    WeiXin.fail(res);
                }
            });
            //微博分享
            wx.onMenuShareWeibo({
                title: shareconfig.title,
                desc: shareconfig.desc,
                link: shareconfig.url,
                imgUrl: shareconfig.img,
                trigger: function (res) {
                    //alert('用户点击分享到微博');  
                    WeiXin.trigger(res);
                },
                complete: function (res) {
                    //alert(JSON.stringify(res));
                },
                success: function (res) {
                    window.location.href = href;
                    //alert('已分享');
                    WeiXin.success(res);
                },
                cancel: function (res) {
                    //alert('已取消');
                    WeiXin.cancel(res);
                },
                fail: function (res) {
                    //alert(JSON.stringify(res));      
                    WeiXin.fail(res);
                }
            });
        });
        wx.error(function (res) {
            //alert(res.errMsg);
        });
    },
    trigger: function (res) { },
    success: function (res) { },
    cancel: function (res) { },
    fail: function (res) { },
};
window.WeiXin = WeiXin;
