'use strict';
import './activityc.scss'
//声明变量
import 'libs/swiper';
/*import 'libs/tools.m.js';*/

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

    var SwiperTop = Number(topY).toFixed(0) / 75 * 1;
    // console.log(topY, SwiperTop)
    $('.swiper_box').css('top', SwiperTop + 'rem')
    $('h1.font-nav').css('font-size', 34 / 75 * 1 + 'rem!important')
    //banner top
    //alert($('.swiper_box').attr('style')+$('#Content').attr('style'))
    if (setting) {
        var s = '{' + setting + '}';
        var param = JSON.parse(s);
        // console.log(setting)
        if ($(".swiper-container .swiper-slide").length > 1) {
            $('.swiper-container .pagination').show();
            var mySwiper = new Swiper('.swiper-container', param)
        }
    } else {
        if ($(".swiper-container .swiper-slide").length > 1) {
            $('.swiper-container .pagination').show();
            var mySwiper = new Swiper('.swiper-container', {
                autoplay: 5000,//可选选项，自动滑动
                loop: true,
                pagination: '.swiper-container .swiper-pagination',
                //new add
                autoplayDisableOnInteraction: false,
                observer: true,
                observeParents: true,
                onSlideChangeEnd: function (swiper) {
                    swiper.update();
                },
                //setWrapperSize:true,
                onInit: function (swiper) {
                    if (swiper.slides.length - 2 < 2) {
                        swiper.stopAutoplay();
                        $('.swiper-container .swiper-pagination').hide();
                    } else {
                        $('.swiper-container .swiper-pagination').show();
                    }
                }
            })
        }
    }

    if(tools. isWebView()){
        $('header.header-bar').hide();
        tools.jsNativeBridge("getTitle", document.title)

        // 临时解决
        tools.setCookie('hideAppDown', '1', null, '.daikuan.com')
        tools.setCookie('IsHeaderHidden', 'True', null, '.daikuan.com')
        tools.setCookie('IsNavHidden', 'True', null, '.daikuan.com')
    }

    //banner top end
    //map area
    var startX = 0,
        startY = 0,
        endX = 0,
        endY = 0;
    document.addEventListener('touchstart', function (e) {
        var touch = e.targetTouches[0];
        startY = touch.pageY;
        startX = touch.pageX;
        endX = 0;
        endY = 0;
    });
    document.addEventListener('touchmove', function (e) {
        var touch = e.targetTouches[0];
        endY = touch.pageY;
        endX = touch.pageX;
    });
    document.addEventListener('touchend', function (e) {
        var item = e.target;
        if (item.nodeName == "AREA") {
            if (endY == 0) {
                e.preventDefault();
                //添加&hidetype=7 功能 xiaowei
                let httpurl=window.location.href,
                    areahref=item.attributes.href.nodeValue,
                    hidetype=''
                if (httpurl.indexOf('hidetype=7')!==-1){
                    if (areahref.indexOf('?')!==-1){
                        hidetype='&hidetype=7'
                    }else{
                        hidetype='?hidetype=7'
                    }
                }
                console.log('httpurl',httpurl)
                console.log('areahref',areahref)
                console.log('hidetype',hidetype)
                window.location.href = item.attributes.href.nodeValue+hidetype;
            }
        }
    });
})













