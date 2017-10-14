
$(function () {

    var t = getCookie("templotwt");
    if (t) {
        clickact(t);
        delCookie("templotwt");
       
    }
    //添加点击事件
    btnclickbind();
    window.setInterval("btnclickbind()", 1000);
});

 
function btnclickbind() {
    $("[LOGWT]").each(function () {
        if ($(this).attr("_islog")) {
            return true;
        }
        else {
            $(this).attr("_islog", "1");
        }
        var v = $(this).attr("LOGWT");
        if (v) {
            $(this).click(function (e) {
                var target = $(this).attr("target");
                if (target == undefined || target == "" || target.toLowerCase() != "_blank") {
                    if (e.target.tagName.toLowerCase() == "a" && ($(this).attr("href") != undefined && $(this).attr("href").indexOf("javascript") == -1 && $(this).attr("href").indexOf("#") != 0) && $(this).attr("href").indexOf("sms:") != 0 && $(this).attr("href").indexOf("tel:") != 0 && $(this).attr("href") != "") {
                        setCookie("templotwt", v);
                        return true;
                    }
                }

                var mReferrer = document.referrer;
                var vipwts = $(this).attr("LOGWT");
                vipwts = vipwts.toLowerCase();
                var TCID = getCookie("TCID");
                if (TCID == null) {
                    var guid2 = guidGenerator();
                    setCookie("TCID", guid2);
                    TCID = getCookie("TCID");
                }
                var d = new Date();
                if (vipwts != "") {
                    CreateScript("//log.taoche.cn/Log.ashx?mReferrer=" + encodeURIComponent(mReferrer) + "&logwt=" + encodeURIComponent(vipwts) + "&TCID=" + TCID + "&note=&v=" + d.getMilliseconds());
                }
            });
        }

    })
   
}
function clickact(txt) {

    if (txt) {
        txt = txt.toLowerCase();   
            var mReferrer = document.referrer;
            var TCID = getCookie("TCID");
            if (TCID == null) {
                var guid2 = guidGenerator();
                setCookie("TCID", guid2);
                TCID = getCookie("TCID");
            }
            var d = new Date();
            if (txt != "") {
                CreateScript("//log.taoche.cn/Log.ashx?mReferrer=" + encodeURIComponent(mReferrer) + "&logwt=" + encodeURIComponent(txt) + "&TCID=" + TCID + "&note=&v=" + d.getMilliseconds());
            } 
    }
}
function behaveact(txt) {
    if (txt) {
        txt = txt.toLowerCase();
        var mReferrer = document.referrer;
        var TCID = getCookie("TCID");
        if (TCID == null) {
            var guid2 = guidGenerator();
            setCookie("TCID", guid2);
            TCID = getCookie("TCID");
        }
        var CIGDCID = getCookie("CIGDCID");
        if (CIGDCID == null)
        {
            CIGDCID = ""
        }
        var d = new Date();
        if (txt != "") {
            CreateScript("//log.taoche.cn/UserBehavior.ashx?mReferrer=" + encodeURIComponent(mReferrer)
                + "&behavewt=" + encodeURIComponent(txt)
                + "&TCID=" + TCID
                + "&CIGDCID=" + CIGDCID
                + "&v=" + d.getMilliseconds());
        }
    }
}
function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";path=/;domain=taoche.com;expires=" + exp.toGMTString();
} 
 
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
}
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 30);
    var cval = getCookie(name);    
    if (cval != null)
        document.cookie = name + "=" + cval + ";path=/;domain=taoche.com;expires=" + exp.toGMTString();
} 
//表示全局唯一标识符 (GUID)。 
function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function CreateScript(src) {
    $("<img style='display:none'><//img>").attr("src", src).appendTo("body");
}