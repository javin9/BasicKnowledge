/*
 使用方法
 */




//获取URL中的参数
function getUrlParam(name) {
    //构造一个含有目标参数的正则表达式对象
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    //console.log(reg)
    //匹配目标参数
    var r = window.location.search.substr(1).match(reg);
    //console.log(r)
    //返回参数值
    if (r != null) return unescape(r[2]);
    return null;
}
var isMobile = false;
var sUserAgent = navigator.userAgent,
    mobileAgents = ['Windows CE', 'iPod', 'Symbian', 'iPhone', 'BlackBerry', 'Android', 'Windows Phone'];
// if ((sUserAgent.match(/iPad/i))) {
// }
for (var i = 0, len = mobileAgents.length; i < len; i++) {
    if (sUserAgent.indexOf(mobileAgents[i]) !== -1) {
        isMobile = true;
        if (getUrlParam("from") != "newmweb") {
            /*var _href = window.location.href,_leng=_href.split('/').length;
             if(_leng>5 ){
             var _r='';
             if (_href.indexOf('huidu')> -1){
             _r = _href.replace('huidu','m')
             }else {
             _r = _href.replace('www','m')
             }
             location.href =_r
             }else {
             location.href = 'http://m.daikuan.com/?from=newpcweb';
             }*/
            var _alternatehref='',links = document.getElementsByTagName("link");
            for (var j=0;j<links.length;j++){
                if (links[j].rel=='alternate'){
                    _alternatehref=links[j].href;
                }
            }
            var _href = _alternatehref,_leng=_href.split('/').length;
            if(_leng>5 ){
                location.href =_alternatehref
            }else {
                location.href =_alternatehref+'?from=newpcweb'
            }
        }
        break;
    }
}

// index   http://www.daikuan.com/beijing/?from=newpcweb 
// list    http://www.daikuan.com/beijing/beiqihuansus3/?source=969 
// detail  http://www.daikuan.com/beijing/m118859/p121040/?source=969