'use strict';

import './index.scss';
import 'jquery.lazyload'
import check from 'libs/check/index.js';
import tools from 'libs/tools.js';


$(function() {
/*{name:'标致3008 2013款 1.6thp 自动智尚版本',carprice:'14.30',year:'2014',mile:'2.3',cityname:'天津',cityid:'tianjin',downpayment:'121',link:''},*/
var carprice='',cityid='',carinfoso='', cpLock=''
    //图片惰性加载
    $("img.lazy").lazyload({
        placeholder: RESURL + "/images/libs/transparent.gif",
        threshold : 0
    });
    $("div.lazy").lazyload({
        placeholder: RESURL + "/images/libs/transparent.gif",
        threshold : 0
    });
    //手机号
    /*$('input').on('compositionstart',function () {
        cpLock = true;
        window.event.returnValue = false;
    })
    $('input').on('compositionend',function () {
        cpLock = false;
        window.event.returnValue = false;
    })*/
    $('.inputphone').bind({
        'focus': function (e) {
            var _this=$(this),_val=_this.val();
        },
        'blur': function (e) {
            var _this=$(this),_val=_this.val();
            if (_val==''){
                _this.parents('li').find('.del').hide();
            }
            checkblur(_this,_val,'请输入正确手机号')
        },
        /*'keydown':function (e) {
            var _this=$(this);
            checkup(_this,11,'请输入正确手机号',e)
        },*/
        'keyup':function (e) {
            var _this=$(this),_val=_this.val();
            if (_val!=''){
                _this.parents('li').find('.del').show()
            }else {
                _this.parents('li').find('.del').hide()
            }
            checkup(_this,11,'请输入正确手机号',e)
        },
        'onafterpaste':function (e) {
            checkup(_this,11,'请输入正确手机号',e)
        }
    })
    //验证码
    $('.inputcode').bind({
        'focus': function (e) {
            var _this=$(this),_val=_this.val();
        },
        'blur': function (e) {
            var _this=$(this),_val=_this.val();
            if (_val==''){
                _this.parents('li').find('.del').hide();
            }
            checkblur(_this,_val,'请输入正确验证码')
        },
        /*'keydown':function (e) {
            var _this=$(this);
            checkup(_this,6,'请输入正确验证码',e)
        },*/
        'keyup':function (e) {
            var _this=$(this),_val=_this.val();
            checkup(_this,6,'请输入正确验证码',e)
            if (_val!=''){
                _this.parents('li').find('.del').show()
            }else {
                _this.parents('li').find('.del').hide()
            }
        }
    })
    //获取--验证码 code_btn
    $('.code_btn').on('click',function (e) {
        var _this=$(this),_trur=$('.iphone').attr('data-id'),mobile=$('.inputphone').val()
        if (_this.hasClass('disable_a')){
            return false
        }else {
            if (_trur==='true'){
                $.ajax({
                    url:ershoucheUrl+'activity/GetCode',
                    type:'post',
                    data:{mobile:mobile},
                    success: function (res) {
                        if (res){
                            /*$('.inputphone').attr('disabled','true')
                            $('.iphone .del').hide();*/
                            $('.inputcode').focus();
                            var seconds=60;
                            _this.addClass('disable_a').text(seconds+'秒后获取');
                            window.tmo = setInterval(function(){
                                if(--seconds == 0){
                                    if ($('.iphone').attr('data-id')==='true'){
                                        _this.removeClass('disable_a').text('获取验证码')
                                    }else {
                                        _this.text('获取验证码')
                                    }
                                    /*$('.inputphone').removeAttr('disabled','true')
                                    $('.iphone .del').show();*/
                                    clearInterval(tmo);
                                    return;
                                }
                                _this.text(seconds+'秒后获取');
                            }, 1000);

                        }else {
                            return alert(res.Message);
                        }
                    },
                })
            }else {
                $('.iphone .errormsg').text('请输入正确手机号')
                $('.inputphone').focus();
            }
        }

    })
    //提交数据 code_btn
    $('.submit').on('click',function () {
        var mobid=$('.iphone').attr('data-id'),
            cobid=$('.code').attr('data-id'),
            mobnum=$('.inputphone').val(),
            cobnum=$('.inputcode').val();
        if (mobid=='true'&&cobid=='true'){
            $.ajax({
                url:ershoucheUrl+'activity/CheckAndThread',
                type:'post',
                data:{mobile:mobnum,validatecode:cobnum,cityid:cityid,carinfo:carinfoso,from:from},
                success: function (res) {
                    if (res.Result){
                        $('.login_info_box').addClass('hide')
                        $('.rules_win').addClass('hide')
                        $('#maskLayer').hide();
                        $('body').removeClass('overflow')
                        $('input').val('')

                        $('.code_btn').addClass('disable_a').text('获取验证码')
                        $('.iphone').attr('data-id','')
                        $('.code').attr('data-id','')
                        $('.errormsg').text('')
                        $('.del').hide();
                        tools.showAlert('提交成功')
                    }else {
                        tools.showAlert(res.Message)
                    }

                    //console.log(res)
                },
                error: function (req, status, text) {
                    alert(status);//req.responseText;
                }
             })
        }else{
            if (!check.isPhoneNumber(mobnum)){
                $('.iphone').find('.errormsg').text('请输入正确手机号')
                $('.iphone').attr('data-id','')
                $('.code_btn').addClass('disable_a')
            }else {
                $('.code_btn').removeClass('disable_a')
                $('.iphone').find('.errormsg').text('')
                $('.iphone').attr('data-id','true')
            }
            if (!checkcode(cobnum)|| (cobnum.length<6 && cobnum.length!=0)){
                $('.code').find('.errormsg').text('请输入正确验证码')
                $('.code').parents('li').attr('data-id','')
            }else {
                $('.code').find('.errormsg').text('')
                $('.code').attr('data-id','true')
            }
        }
    })
    //清空数据
    $('.del').bind({
        'mousedown':function (e) {
            var _this=$(this);
            _this.parents('li').find('.errormsg').text('')
            /*_this.parents('li').find('input').unbind('blur');*/
            //debugger
        },
        'mouseup':function (e) {
            var _this=$(this);
            /*_this.parents('li').find('input').bind('blur');*/
        },
        'click':function (e) {
            var _this=$(this);
            _this.parents('li').find('.tel').val('')
            _this.parents('li').find('.errormsg').text('')
            _this.parents('li').attr('data-id','')
            _this.hide();
            $('.code_btn').addClass('disable_a')

        }
    })
    $('.cloes,#maskLayer').on('click',function () {
        $('.login_info_box').addClass('hide')
        $('.rules_win').addClass('hide')
        $('#maskLayer').hide();
        $('body').removeClass('overflow')
        $('input').val('')
        clearInterval(window.tmo);
        $('.code_btn').addClass('disable_a').text('获取验证码')
        $('.iphone').attr('data-id','')
        $('.code').attr('data-id','')
        $('.errormsg').text('')
        $('.del').hide();

    })
    $('.yixin').on('click',function () {
        var _this=$(this),id = _this.attr('data-id'),num=id-1
        carprice=carinfo[num].carprice;
        cityid=carinfo[num].cityid
        carinfoso=carinfo[num].carinfoso
        $('.info_txt').find('h6').text(carinfo[num].name)
        $('#maskLayer').show();
        $('.login_info_box').removeClass('hide');
        $('body').addClass('overflow')
    })
    $('#rules').on('click',function () {
        var _this=$(this)
        $('#maskLayer').show();
        $('.rules_win').removeClass('hide');
        $('body').addClass('overflow')
    })
    ////////
    function checkup(_this,num,txt,e) {
        // 8 del, 9 tab, 37 <-, 39 ->  49-57(top 1-0)  96-105(num 1-0)
        /*if (e.keyCode < 48 || e.keyCode > 57) && (e.keyCode !== 8 && e.keyCode !== 9 && e.keyCode !== 37 && e.keyCode !== 39)) {
            e.preventDefault();
        }*/
        if (_this.val().length >= num && (e.keyCode !== 8 && e.keyCode !== 9 && e.keyCode !== 37 && e.keyCode !== 39)) {
            e.preventDefault();
        }
        var _original=_this.val(),
            _val=getNum(_original);
        /*console.log(_val.length,_val)*/
        _this.val(_val)
        if (_val&&_val!=''){
            var _val2=_val.substring(0,num)
            _this.val(_val2)
            if (_val.length>=num){
                if (num==6){
                    if (!checkcode(_val2)){
                        _this.parents('li').find('.errormsg').text(txt)
                    }else  {
                        return _this.parents('li').find('.errormsg').text('')
                    }
                }else if (num==11){
                    if (!check.isPhoneNumber(_val2)){
                        $('.code_btn').addClass('disable_a')
                        _this.parents('li').find('.errormsg').text(txt)
                    }else {
                        $('.code_btn').removeClass('disable_a')
                        return _this.parents('li').find('.errormsg').text('')
                    }
                }
            }else if(_val2==''){
                $('.code_btn').addClass('disable_a')
                return _this.parents('li').find('.errormsg').text('')
            }else{
                $('.code_btn').addClass('disable_a')
                return _this.parents('li').find('.errormsg').text('')

            }
            //debugger
        }
        /*if (event.keyCode>=48&&event.keyCode<=57){}else */

    }
    function checkblur(_this,_val,text) {
        if (_val!=''){
            _this.parents('li').find('.del').show()
            if (text.indexOf('验证码')!=-1){
                if (!checkcode(_val)|| (_val.length<6 && _val.length!=0)){
                    _this.parents('li').find('.errormsg').text(text)
                    _this.parents('li').attr('data-id','')
                }else {
                    _this.parents('li').find('.errormsg').text('')
                    _this.parents('li').attr('data-id','true')
                }
            }else {
                if (!check.isPhoneNumber(_val)){
                    _this.parents('li').find('.errormsg').text(text)
                    _this.parents('li').attr('data-id','')
                    $('.code_btn').addClass('disable_a')
                }else {
                    $('.code_btn').removeClass('disable_a')
                    _this.parents('li').find('.errormsg').text('')
                    _this.parents('li').attr('data-id','true')
                }
            }
        }else {
            _this.parents('li').find('.del').hide()
            _this.parents('li').find('.errormsg').text('')
            _this.parents('li').attr('data-id','')
        }
        //debugger
    }
    function getNum(text) {
        if (text) {
            var value = text.replace(/[^\d]/g,'');
           // debugger
            return value
        }
        return
    }
    function checkcode(number){
        var six = new RegExp(/^[0-9]{0,6}$/);
        /*onkeyup="this.value=this.value.replace(/[^\d]/g,'') " onafterpaste="this.value=this.value.replace(/[^\d]/g,'') "*/
        if(number == ""){
            return "";
        }else{
            return six.test(number);
        }
    }
});
//二期--地址栏
$(function () {
    var chongqing='',chuangchun='',changsha='',chengdu='',dalian='',hefei='',nanjing='',ningbo='',shijiazhuang='',suzhou='',taiyuan='',wulumuqi='',tianjing='',wuxi='',xian=''
    setTimeout(function () {
        chongqing=$('#chongqing').offset().top,
            chuangchun=$('#chuangchun').offset().top,
            changsha=$('#changsha').offset().top,
            chengdu=$('#chengdu').offset().top,
            dalian=$('#dalian').offset().top,
            hefei=$('#hefei').offset().top,
            nanjing=$('#nanjing').offset().top,
            ningbo=$('#ningbo').offset().top,
            shijiazhuang=$('#shijiazhuang').offset().top,
            suzhou=$('#suzhou').offset().top,
            taiyuan=$('#taiyuan').offset().top,
            wulumuqi=$('#wulumuqi').offset().top,
            tianjing=$('#tianjing').offset().top,
            wuxi=$('#wuxi').offset().top,
            xian=$('#xian').offset().top
    },10)

    $(window).on('scroll',function (e) {
        chongqing=$('#chongqing').offset().top,
            chuangchun=$('#chuangchun').offset().top,
            changsha=$('#changsha').offset().top,
            chengdu=$('#chengdu').offset().top,
            dalian=$('#dalian').offset().top,
            hefei=$('#hefei').offset().top,
            nanjing=$('#nanjing').offset().top,
            ningbo=$('#ningbo').offset().top,
            shijiazhuang=$('#shijiazhuang').offset().top,
            suzhou=$('#suzhou').offset().top,
            taiyuan=$('#taiyuan').offset().top,
            wulumuqi=$('#wulumuqi').offset().top,
            tianjing=$('#tianjing').offset().top,
            wuxi=$('#wuxi').offset().top,
            xian=$('#xian').offset().top
        var _top = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        $('#activecity a').removeClass('cur');
        if (_top<chuangchun){//0-1522(1-2)
            $('#activecity a').eq(0).addClass('cur')
        }else if (_top>chuangchun&&_top<changsha){//1552(2) 2078(3)
            $('#activecity a').eq(1).addClass('cur')
        }else if (_top>changsha&&_top<chengdu){//1552(3) 2078(4)
            $('#activecity a').eq(2).addClass('cur')
        }else if (_top>chengdu&&_top<dalian){//1552(2) 2078(3)
            $('#activecity a').eq(3).addClass('cur')
        }else if (_top>dalian&&_top<hefei){//1552(2) 2078(3)
            $('#activecity a').eq(4).addClass('cur')
        }else if (_top>hefei&&_top<nanjing){//1552(2) 2078(3)
            $('#activecity a').eq(5).addClass('cur')
        }else if (_top>nanjing&&_top<ningbo){//1552(2) 2078(3)
            $('#activecity a').eq(6).addClass('cur')
        }else if (_top>ningbo&&_top<shijiazhuang){//1552(2) 2078(3)
            $('#activecity a').eq(7).addClass('cur')
        }else if (_top>shijiazhuang&&_top<suzhou){//1552(2) 2078(3)
            $('#activecity a').eq(8).addClass('cur')
        }else if (_top>suzhou&&_top<taiyuan){//1552(2) 2078(3)
            $('#activecity a').eq(9).addClass('cur')
        }else if (_top>taiyuan&&_top<wulumuqi){//1552(2) 2078(3)
            $('#activecity a').eq(10).addClass('cur')
        }else if (_top>wulumuqi&&_top<tianjing){//1552(2) 2078(3)
            $('#activecity a').eq(11).addClass('cur')
        }else if (_top>tianjing&&_top<wuxi){//1552(2) 2078(3)
            $('#activecity a').eq(12).addClass('cur')
        }else if (_top>wuxi&&_top<(xian-100)){//1552(2) 2078(3)
            $('#activecity a').eq(13).addClass('cur')
        }else if (_top>(xian-100)&&_top<300000){//1552(2) 2078(3)
            $('#activecity a').eq(14).addClass('cur')
        }
        //console.log(_top,chongqing, chuangchun,changsha,chengdu,dalian,hefei,nanjing,ningbo,shijiazhuang,suzhou,taiyuan,wulumuqi,tianjing,wuxi,xian)
        //debugger
        /* 1026 1552 2078 2604 3130 3656 4182 4708 5234 5760 6286 6812 7338 7864 8390
         * 1588 2114 2640 3166 3692 4218 4744 5270 5796 6322 6848 7374 7900 8426 8952*/
    })
    $('#activecity').on('click','a',function () {
        var _this=$(this)
        $('#activecity a').removeClass('cur');
        _this.addClass('cur')
        setTimeout(function () {
            _this.addClass('cur')
        },100)
    })


})
