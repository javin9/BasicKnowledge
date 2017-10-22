
import './ActivityC.scss';
//声明变量
/*import swiper from 'libs/swiper/2.0';*/
import 'libs/jquery.nivo.slider'
$(function () {
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    function setQueryString(url,name,value){
        var pattern = name+'=([^&]*)',
            replaceText = name + '=' + value,
            url = url;
        if(url.match(pattern)){
            var tmp='/('+ name+'=)([^&]*)/gi';
            tmp=url.replace(eval(tmp),replaceText);
            return tmp;
        }else{
            if(url.match('[\?]')){
                return url+'&'+replaceText;
            }else{
                return url+'?'+replaceText;
            }
        }
        return url+'\n'+name+'\n'+ value;
    }
    /* */
    if (getQueryString('source')) {
        var sc = getQueryString('source');
        $('map area').each(function () {
            let original=$(this).attr('href'),
                sohref='';
            if(original.indexOf("source")>=0){
                sohref = setQueryString(original,"source",sc);
            }else{
                sohref = original + '?source=' + sc;
            }
            $(this).attr('href', sohref);
        })
    }


    if(window.location.href.indexOf('66gcjpc') >=0){
        $('.ui-sidebar').hide();
        var rightNavHtml = `<div class="right-nav">
                                <ul>
                                    <li><a href="http://shop.daikuan.com" target="_blank">品牌推荐</a></li>
                                    <li><a href="http://sq.daikuan.com/Secretary/Index?source=609" target="_blank">小鑫帮您贷</a></li>
                                    <li><a href="http://www.daikuan.com/lease" target="_blank">开走吧</a></li>
                                    <li><a href="http://www.daikuan.com/activity/0XGBG" target="_blank">0息购车</a></li>
                                    <li><a href="http://mai.bitauto.com/" target="_blank">返回主会场</a>　&nbsp;</li>
                                    <li><a href="http://hd.huimaiche.com/hd/201705?tracker_u=1186_gcj&ccode=201" target="_blank">惠买车会场</a>　&nbsp;</li>
                                    <li><a href="http://zt.taoche.com/zt/20170606/?ref=zt_pc_yxjr_syfc" target="_blank">二手车会场</a>　&nbsp;</li>
                                    <li><a href="http://www.bitauto.com/topics/adtopic/vrShijia/" target="_blank">VR试驾</a>　　　</li>
                                </ul>
                            </div>`
        $('body').append(rightNavHtml);
    }
})
window.onload=function () {
    $(".slider").nivoSlider({
        effect:"fade", //slideInLeft,slideInRight,sliceDown,sliceDownLeft,sliceUp,sliceUpLeft,sliceUpDown,sliceUpDownLeft,fold,fade,random,boxRandom,boxRain,boxRainReverse,boxRainGrow,boxRainGrowReverse
        manualAdvance:false,   // 是否手动播放(false为自动播放幻灯片)
        directionNav:false,  //是否显示图片切换按钮(上/下页)
        controlNav:true,  // 显示序列导航
        directionNav:true,	//是否使用左右按钮导航	true
    });
    if (setting) {
        var s='{'+setting+'}';
        var param= JSON.parse(s);
        $(".slider").nivoSlider(param);
    }
}