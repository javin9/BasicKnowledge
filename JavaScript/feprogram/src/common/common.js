require('./common.scss')
var $ = require('jquery')
// require('jquery-json')
var tools = require('libs/tools')
require('libs/selCity')
require('libs/carSelect/selCar.pc')

if(dev){
	require('./dev')
}

// for old code
window.$ = window.jQuery = $
window.Tools = window.tools = tools

// 旧统计代码兼容方法
// toJSON方法直接用stringify，不再依赖jquery-json
// 目前只有tracking_plain.js用到toJSON方法
$.toJSON = typeof JSON === 'object' && JSON.stringify ? JSON.stringify : function(){}

var domain = tools.wildcardUrl();
// console.log(domain);
//获取url中的from值并存入cookie
//种一个fpath的cookie，类似from
var fromVal = tools.getUrlParam("from"),
    semcodeVal = tools.getUrlParam("semcode"),
    fpath = tools.getUrlParam("fpath");
if(fromVal){
    tools.setCookie("from",fromVal,"",domain);
}
if(semcodeVal){
    // tools.setCookie("semcode",semcodeVal,"",domain);
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

window.selCityHeader = function(obj){
    $(".sel-city .city-con").attr("data-id",obj.cityId).text(obj.cityName);
}

window.selCityCallback = function(obj) {
    location.reload();
};
//登录状态
if(window.USERCENTERURL){
    $.ajax({
        url: USERCENTERURL + '/User/GetCurrentUserIdentity',

        dataType: "jsonp",
        
        beforeSend: function(){
            
        },
        success: function(res){
            // 注册事件，提供获取状态公共接口, 使用triggerHandler获取
            $(window).data('userStatusReady', true).on('getUserStatus', () => {
                return {
                    login: res.Islogin,
                    id: res.LoanUserID,
                    mobile: res.Telphone,
                    hashMobile:res.HashTelphone,
                    token: res.Token,
                    name: res.UserName
                }
            })
             if(res.Islogin){
                $("#loginLi").html('<a class="user_name" href="'+ USERCENTERURL +'" target="_blank">'+ res.UserName+'</a>　<a id="header_user_logout" href="'+USERCENTERURL+'/User/Logout">退出</a>')
             }else{                      
                    var loginUrl=USERCENTERURL +'/Login',
                            curPageUrl = window.location.pathname.toLowerCase();
                        // console.log(curPageUrl)
                    if(curPageUrl.indexOf("login") >=0 && curPageUrl.indexOf("login/bindaccount") < 0)
                    {
                        loginUrl=window.location.href;
                    }                       
                    else
                    {
                        loginUrl+='?returnurl='+encodeURIComponent(window.location.href);
                    }
                    $("#loginLi").html('<a href="'+ loginUrl+'" >登录</a>');                   
                }
        },
        complete: function(XMLHttpRequest, textStatus){    
            
        }
    })  
}    
$(function() {



    // function footerChange(){
    //     if($(window).height() > $("body").height()){
    //         $("#Footer").css({
    //             'position': 'absolute',
    //             'bottom':0
    //         })
    //     }
    // }
    // footerChange();//页脚变化
    var _isMobile = false;
    var sUserAgent = navigator.userAgent,
        mobileAgents = ['Windows CE', 'iPod', 'Symbian', 'iPhone', 'BlackBerry', 'Android', 'Windows Phone'];
    for (var i = 0, len = mobileAgents.length; i < len; i++) {
        if (sUserAgent.indexOf(mobileAgents[i]) !== -1) {
            _isMobile = true;
        }
    }


    var rdmHLabel = parseInt(Math.random()*4);

    $("#HeaderNav li").eq(rdmHLabel).find("span").show();
    var maskLeft = $("nav#HeaderNav li.current").position().left,
        maskWidth = $("nav#HeaderNav li.current").width();
    $(".nav-mask").css({"left":maskLeft,"width":maskWidth});
    $(".nav-mask").show().delay(500);
    var isLeave = false;

    if(fromVal){
        $("#HeaderNav li a").each(function(index, el) {
            var _hrefForm = $(this).attr("href") + "?from=" + fromVal;
            $(this).attr("href",_hrefForm);
        });
    };
    //选择城市
    $(".sel-city-box").selCity({
        isRelationHeader:true
    });
    
    // 新的页眉// 是否引用新的顶通
    if(typeof isNewHeader !== 'undefined'){
      let xinCheCar = true,
          $inputDom = $('#searchCar');

      function selctCarcallback (obj) {
        let hrefStr = "javascript:void(0);",
            targetStr="",
            inputText = "";
     
        if (obj.returnType == "carType") {
          let carName = obj.carType,
             carId = obj.carTypeId,
             brandName = obj.brandName,
             spell = obj.spell;
             inputText = brandName + " " + carName;

          if(xinCheCar){//新车
            hrefStr = "/"+ citySpell +"/" + spell+"/?source=606";
          }else{//二手车
            if(carName.indexOf(brandName)>=0){
              inputText = carName;
            }
            hrefStr = 'http://ershouche.daikuan.com/'+ citySpell + '/s' + carId + '?source=968';
          }
          $inputDom.val(inputText).attr("data-spell", spell);
          window.open(hrefStr);
          targetStr = "_blank"; 
        }else if(obj.returnType == "brands"){
            inputText = obj.brandName;
            if(xinCheCar){
                if(obj.spell){
                    if(obj.categoryId){
                        //hrefStr = "/china/brand/" + obj.spell + "/?source=987#" + obj.categoryId;
                        hrefStr = "/"+ citySpell +"/brand/" + obj.spell + "/?source=987#" + obj.categoryId;
                    }else{
                        //hrefStr = "/china/brand/" + obj.spell + "/?source=987";
                        hrefStr = "/"+ citySpell +"/brand/" + obj.spell + "/?source=987";
                    }
                    $inputDom.val(inputText).attr("data-spell", obj.spell);
                    window.open(hrefStr);
                    targetStr = "_blank";

                }
            }else{//二手车
                inputText = obj.brandName;
                hrefStr = 'http://ershouche.daikuan.com/'+ citySpell + '/m' + obj.brandId + '?source=968'
                $inputDom.val(inputText).attr("data-spell", obj.spell);
                window.open(hrefStr);
                targetStr = "_blank"; 
            }
          
        }else if(obj.returnType =="clear"){//清空
          hrefStr = "javascript:void(0);"
          targetStr = "_self";
        }
        $(".search .search-btn").attr({"href":hrefStr,"target":targetStr});
      }
          
      $inputDom.selCar({
        IsBrandsBack:true,
        CallBacks:selctCarcallback
      });
      
      // 下拉选择新车&二手车
      $('#seacrchCtrl').selectControl(function(selDataId,selText){
        $(".search .search-btn").attr({"href":'javascript:void(0);',"target":'_self'});
        $("#searchCar").val('').attr("data-spell", '');
        $('.empty-search').hide();

        if(selDataId == 'new'){
          xinCheCar = true;
          $("#searchCar").selCar({
            IsBrandsBack:true,
            CallBacks: selctCarcallback
          }); 
        }else if(selDataId == 'old') {
          xinCheCar = false;
          $("#searchCar").selCar({
            SerialImgShow:false,
            IsBrandsBack:true,
            CallBacks: selctCarcallback
          }); 
        }
      },"click","notRender");

      function enterUpOrDown () {
        let value = $.trim($inputDom.val()),
            $visibleMenu = $('#Header .sel-car-menu'),
            $visibleLi = $visibleMenu.find('li');

        if(value != '' && $visibleMenu){
          if($visibleLi.html()!="未找到符合条件的车型！"){
            let hrefList = 'javascript:void(0);';

            $visibleLi.each(function(e){
              if(!$(this).hasClass('sel-car-brand')){
                if(xinCheCar){//新车
                  hrefList = "/"+ citySpell + "/" + $(this).attr('data-spell') +"/?source=606";
                }else{//二手车
                  hrefList = 'http://ershouche.daikuan.com/'+ citySpell + '/s' + $(this).attr('data-id') + '?source=968';
                }

                $inputDom.val($(this).text());
                $(".search .search-btn").attr({"href":hrefList,"target":"_blank"}); 
                window.open(hrefList);
                return false;
              }
            });
          }
        }
      }
      // 点击搜索按钮
      $('.newHeader .search-btn').click(function(){
        let val = $.trim($inputDom.val()),
            $visibleMenu = $('#Header .sel-car-menu'),
            $visibleMenuLi = $visibleMenu.find('li');
        if($visibleMenuLi.length == 1 && $visibleMenuLi.html()=="未找到符合条件的车型！"){
          setTimeout(function(){
            $('#Header .sel-car-menu').show();
          }, 0.00001);
        }else{
            enterUpOrDown()
        }
        if(val === ""){
          $('#carTip').fadeIn('slow');
          setTimeout(function(){
            $('#carTip').fadeOut('slow');
          }, 2000);
        }
      });

      // 放开回车键
      $inputDom.keyup(function(e){
        if($.trim($inputDom.val()) == ""){
          $(".search .search-btn").attr({"href":"javascript:void(0)","target":"_self"}); 
          $('.search .empty-search').hide();
        }
        if(e.keyCode == "13"){
          enterUpOrDown();
        }
      });
      // 按下回车键
      $inputDom.keydown(function(e){
        if($.trim($inputDom.val()) == ""){
          $(".search .search-btn").attr({"href":"javascript:void(0)","target":"_self"}); 
          $('.search .empty-search').hide();
        }
        if(e.keyCode == "13"){
          enterUpOrDown();
        }
      });
    }

    // 页面滚动到面包屑导航位置
    if(typeof isHeaderBottom !== 'undefined'){
      $('body, html').animate({'scrollTop':$('#Header').height()+'px' });
    }

    //微信
    $('.ui-sidebar .weixin').click(function () {
        // window.open('http://b.qq.com/webc.htm?new=0&sid=800034370&o=daikuan.com&q=7', '_blank', 'height=502, width=644,toolbar=no,scrollbars=no,menubar=no,status=no');
        $('#consultGuide').show();

        // ------------------ 正式调用 --------------------
        tabSlider('.cg_cont');
    });

    //右侧浮动层
    var backTopSidebar = $("#backTop"),
        windowHeight = $(window).height();

    //
    // $(window).on("resize",function(){
    //     footerChange();
    // })
    $(window).on("scroll",function(){
        //console.log($(this).scrollTop() +"___"+windowHeight);
        if($(this).scrollTop()>windowHeight){
            backTopSidebar.fadeIn(400);
        }else{
            backTopSidebar.fadeOut(400);
        }
    })
    backTopSidebar.on("click",function(){
        $('html,body').animate({
            "scrollTop":"0px"
        },500);
    });


    
    /*----------右侧浮动App下载-----------*/
    /*初次进入默认显示，其他时候不显示*/
    var $appdownLayout = $('.ui-sidebar a.app');
    $appdownLayout.hover(function(){
        $(this).addClass('hoverstatus');
    },function(){
        $(this).removeClass('hoverstatus');
    });
    $('.ui-sidebar a:not(.app)').hover(function(){
        $appdownLayout.removeClass('hoverstatus');
    });
    if( !tools.getCookie('hasVisit') ){
        $appdownLayout.trigger('mouseenter');
        tools.setCookie("hasVisit", true, "", domain);
    }
    $(document).on('click', function(e){
        var $curTarget = $(e.target);
        if( ( $curTarget.parents('article').attr('id')!='localization' ) && ( $curTarget.attr('id')!='localization' ) && ( $curTarget.attr('id')!='maskLayer' ) && ( !$curTarget.parents('section').hasClass('pop-up-layer') ) && ( $appdownLayout.hasClass('hoverstatus') ) ){
            $appdownLayout.removeClass('hoverstatus');
        }
    });


    if(!_isMobile){
        $("nav#HeaderNav li").hover(function() {
             isLeave = false;
            $(".nav-mask").stop().animate({
                "left": $(this).position().left,
                "width": $(this).width()
            },
            200);
            $("header#Header .qr-code-mweb").hide();
            $("header#Header .qr-code-weixin").hide();
        }, function() {
            isLeave = true;
            setTimeout(function() {
                if (isLeave) {
                    $(".nav-mask").stop().animate({
                        "left": $("nav#HeaderNav li.current").position().left,
                        "width": $("nav#HeaderNav li.current").width()
                    },
                    200);
                }
            },
            300)
        });
    }
    //微信和手机版的鼠标滑过效果
    $("header#Header").on("mouseover", ".xc-phone,.xc-pub",function(e) {
        e.stopPropagation();
        e.preventDefault();
        var curItem = $(e.currentTarget);
        if (curItem.is(".xc-phone")) {
            $(this).addClass("cur").find("span").addClass("hover");
            $(this).siblings().find(".qr-code-weixin").hide();
            $(this).find(".qr-code-mweb").show();
        } else if (curItem.is(".xc-pub")) {
            $(this).addClass("cur").find("span").addClass("hover");
            $(this).siblings().find(".qr-code-mweb").hide();
            $(this).find(".qr-code-weixin").show();
        }

    });
    $("header#Header").on("mouseout", " .xc-phone,.xc-pub",function(e) {
        e.stopPropagation();
        e.preventDefault();
        var curItem = $(e.currentTarget);
        if (curItem.is(".xc-phone")) {
            $(this).find(".qr-code-mweb").hide();
            $(this).removeClass("cur").find("span").removeClass("hover");
        } else if (curItem.is(".xc-pub")) {
            $(this).removeClass("cur").find("span").removeClass("hover");
            $(this).find(".qr-code-weixin").hide();
        }
    });

    /*页脚SEO切换*/
    var $footerSeoDiv = $("#Footer .footer-middle dd>div");
    $("#Footer").on('mouseover', ' .footer-middle dt div', function(event) {
        event.preventDefault();
        var _index = $(this).index();
        $(this).addClass('cur').siblings('div').removeClass('cur');
        $footerSeoDiv.eq(_index).removeClass('hide').siblings('div').addClass('hide');
    });
    // ------------------ 在线咨询引导层 --------------------

    // ---------- 扫描效果 --------
    var objLine = {};
    objLine.speed = 2000, //速度
    objLine.move = 0; //初始化动作

    objLine.fx = function(){
        var moveTop = {};
        if( objLine.move == 0 ){ //判断动作
            objLine.move = 1; //改变动作
            moveTop = { offset_top: "264px" }; //移动像素
        } else {
            objLine.move = 0;
            moveTop = { offset_top: "48px" }; //移动像素
        }

        scanCode(moveTop);//执行
    }

    function scanCode(_top){
        $('#consultGuide .cg_slide li.slide_1 i').animate({ top: _top.offset_top }, objLine.speed, objLine.fx);
    }

    function scaleFadeIn(_obj){
        $(_obj).css({height: 0, width: 0, opacity: 0});
        $(_obj).animate({ height: '240px', width: '240px', opacity: '1' }, 500);
    }

    // ------------------ tab特效 --------------------
    function tabSlider(obj){
        var _this = tabSlider;
            _this.obj = obj;
            _this.n = 0; // 初始记录第几个li
            _this.canmove = true,
            _this.time = 5000, // 自动切换停留时间
            _this.clock;

        $(_this.obj + " .cg_bar li").mouseenter(function(){
            _this.canmove = false;
            clearInterval(li_timer);
            _this.n = $(this).index();
            li_active();
        });

        $(_this.obj).mouseenter(function(){ // 鼠标在区域内就停止自动切换
            _this.canmove = false;
        }).mouseleave(function(){
            clearInterval(li_timer);
            setTimeout(function(){_this.canmove=true;}, _this.time);//两秒后自动切换
        });

        function li_timer(){
            if(_this.canmove){
                _this.n++;
                if(_this.n == $('.cg_bar li').length){
                    _this.n=0;
                }
                li_active();
            }         
        }

        function li_active(){
            var $this = $(_this.obj + " .cg_bar li").eq(_this.n),
                $objB = $this.find('b'),
                $objO = $this.siblings().find('b');

            // 浏览器判断
            var DEFAULT_VERSION = "9.0";
            var ua = navigator.userAgent.toLowerCase();
            var isIE = ua.indexOf("msie")>-1;
            var safariVersion;
            if(isIE){
                safariVersion =  ua.match(/msie ([\d.]+)/)[1];
            }
            if(safariVersion <= DEFAULT_VERSION ){
                if( _this.n == 0 ){
                    // scane效果
                    objLine.fx();
                } else if ( _this.n == 1 ){
                    // scaleFadeIn效果
                    scaleFadeIn('.cg_slide li.slide_2 i');
                } else if ( _this.n == 2 ){
                    // scaleFadeIn效果
                    scaleFadeIn('.cg_slide li.slide_3 i');
                    $('.cg_slide li.slide_3 b').remove();
                }
            }
            
            $this.addClass("active").siblings().removeClass("active");

            // 线条动画
            $objO.animate({width: '0', opacity: '0'}, 300);
            $objB.animate({width: $objB.data('width') + 'px', opacity: '1'}, 300);

            $(_this.obj + " .content_main li").eq(_this.n).addClass('active').show().siblings().removeClass('active').hide();
        }

        // 执行
        setTimeout(function(){
            li_active();
            _this.clock = setInterval(li_timer, _this.time);
        }, 0);

        // 关闭弹层
        $('#consultGuideClose').on('click', function(){
            clearInterval(_this.clock);
            $('#consultGuide').hide();
        });
    }


})