'use strict';

import './index.scss';

import Swiper from 'libs/swiper/2.0';
import selCar from 'libs/fullPage/index';

import './jquery.featureCarousel';

/**/
$('#Header,.footer-bottom').hide();
$('.creadit-warp #Header,.creadit-warp .footer-bottom').show()


var cardhref=[
    'https://creditcard.ecitic.com/citiccard/cardshop-web/apply/toPageIndex.do?pid=CS0233&sid=ECCYXCD',/*经典版金卡*/
    'https://creditcard.ecitic.com/citiccard/cardshop-web/apply/toPageIndex.do?pid=CS0231&sid=ECCYXCD',/*经典版白金卡*/
    'https://creditcard.ecitic.com/citiccard/cardshop-web/apply/toPageIndex.do?pid=CS0233&sid=ECCYXCD',/*青春版金卡*/
    'https://creditcard.ecitic.com/citiccard/cardshop-web/apply/toPageIndex.do?pid=CS0231&sid=ECCYXCD',/*青春版白金卡*/
]
var showbox={
    0:{
        title:'基础服务',
        infoTip:`<h6>（一）年费</h6><div class="sped_info">
1、金卡：200元/年，刚性收取；新户首刷减免首年年费；<br/>2、白金精英卡：480元/年，刚性收取；<br/>3、白金尊贵卡：2000元/年，刚性收取<br/>
<h6>（二）保险</h6>1、航班延误险：<br/>使用中信易鑫联名卡通过指定渠道购票，金卡延误4小时/白金卡延误2小时最高可赔付人民币1000元。<br/>
2、航空意外伤害险：<br/>使用中信易鑫联名卡白金卡客户刷卡支付飞机票款或旅游团费，本人保险金额高达1500万元，同行配偶及子女可享750万及10万高额保障。<br/>
3、盗刷保障险：<br/>卡片遗失、被盗、被抢后所发生的费用损失，金卡最高可赔付5000元，白金卡最高可赔付30000元。<br/><h6>（三）汽车道路救援</h6>
中信易鑫联名卡白金尊贵卡客户可享受不限次数的道路救援，包括搭电、换胎、紧急拖车等。</div>`,
    },
    1:{
        title:'专享租车',
        infoTip:'<h6>活动内容</h6><div class="itmes_sped_info">办理易鑫“开走吧”产品的中信易鑫联名卡持卡客户推荐好友办理“万元开走,月付低至666元”产品，本人获得2张月付抵用券,每张价值666元；被推荐人获得1张月付抵用券,每张价值666元。</div>',
        infoTxt:{
            tit:'活动规则',
            itmes:[
                '通过指定页面<a href="http://www.daikuan.com/activity/zxcobrandcard">http://www.daikuan.com/activity/zxcobrandcard</a>办理才可享受该权益。',
                '本活动推荐人仅限同时办理中信易鑫联名信用卡及“万元开走，月付低至666元”产品的合约期内客户。',
                '本活动所赠月付抵用奖励为月付抵用券, 2017年8月始根据推荐关系成立时间先后顺序陆续发放至推荐双方易鑫账户。',
                '本活动产品仅限首付为1万元的开走吧产品，包括大众polo、大众捷达、大众朗逸、起亚K3，具体车型以开走吧官网介绍为准。',
                '推荐人填写推荐信息后易鑫客服将于3个工作日内联系推荐人核实，被推荐人成功办理” 万元开走，月付低至666元”产品且完成首月正常还款，即视为推荐关系成立。',
                '本活动所赠月付抵用不与易鑫集团其他任何推荐类活动共享。',
                '推荐人与被推荐人最多可获6张月付抵用券，月付抵用仅限本活动产品使用。',
                '易鑫客服电话：4000-169-169（9：00至21：00）。',
            ]
        }
    },
    2:{
        title:'投保有礼',
        infoTip:'<h6>活动内容</h6><div class="itmes_sped_info">活动时间：即日起至2017年12月31日<br/>通过指定页面链接地址<a href="http://baoxian.daikuan.com/?yxms=WMH0043">http://baoxian.daikuan.com/?yxms=WMH0043</a>成功购买易鑫车险，除享受易鑫车险提供的保费打折（最低4折）以及投保礼外（例：京东购物卡、加油卡等，具体以易鑫对外公示为准），联名卡用户额外再加送50元京东购物卡或加油卡（具体以易鑫对外公示为准），投保平安车险除外。</div>',
        infoTxt:{
            tit:'活动细则',
            itmes:['本权益由易鑫提供，如需进一步了解整体活动详情或办理流程，可致电易鑫客服电话咨询，易鑫客服电话：4000-169-169（9：00至21：00）。']
        }
    },
    3:{
        title:'加油返现',
        infoTip:`<h6>活动内容</h6><div class="itmes_sped_info">活动时间:即日起至2017年12月31日</div>
            <div class="itmes_sped_info">活动时间内，自然月交易满足条件后，当月加油类交易可领取加油鼓励金，先到先得，具体规则如下：<br/>
（1）金卡：当月交易3笔399元且交易满3999元（计积分交易），可享加油类交易8%的加油鼓励金奖励。单月最高赠送80鼓励金。<br/>
（2）白金精英卡：当月交易3笔399元且交易满5999元（计积分交易），可享加油类交易10%的加油鼓励金奖励。单月最高赠送100鼓励金。<br/>
（3）白金尊贵卡：当月交易3笔399元且交易满5999元（计积分交易），可享加油类交易15%的加油鼓励金奖励。单月最高赠送150鼓励金。</div>
`,
        infoTxt:{
            tit:'活动规则',
            itmes:[
                '以上交易均为计积分交易，单日加油类交易超过500元部分不再奖励加油鼓励金。加油鼓励金累计部分取整数（不四舍五入）。',
                '当月交易满足条件后，需在次月底之前领取加油鼓励金，未领取的权益将自动过期。',
                '请登录http://dwz.cn/64W5oG进行领取，数量有限，先到先得。',
                '领取加油鼓励金成功后，加油鼓励金将在领取成功后的次月底之前入到您的信用卡账户。',
                '如您名下有多张车主类联名卡（中信标准车主卡或中信易鑫联名卡），且均符合赠送加油鼓励金条件，则按赠送加油鼓励金金额最高的卡片进行赠送，其他卡片不再赠送加油鼓励金。',
                '如您名下有多张车主类联名卡（中信标准车主卡或中信易鑫联名卡），且赠送加油鼓励金的金额相同，则按核卡时间最早的卡片进行赠送。',
                '加油类交易的规则：仅为刷卡交易描述中含有中国石化、中石化、中国石油、中石油、中国海油、中海油、加油站、加油中心的交易。',
                '如当月交易包含消费取消或退货，则取消该笔消费交易参与当月活动的资格。',
                '境外交易按交易当天汇率折算。',
            ]
        }
    },
    4:{
        title:'优惠洗车',
        infoTip:'<h6>活动时间</h6><div class="itmes_sped_info">即日起至2017年12月31日,中信易鑫卡每自然月满足3笔399计积分交易，即可获得兑换0元洗车服务权益，洗车券兑完即止。其中当月交易满足交易条件，金卡每月送1次权益；精英白金卡每月送2次权益；尊贵白金卡每月送4次。</div>',
        infoTxt:{
            tit:'活动细则',
            itmes:[
                '活动期内，按交易达标先后顺序进行赠送，洗车服务赠送总量为6000次/月，送完即止。',
                '若客户名下办理多张车主卡且满足交易条件，仅取最先达标对应卡片及次数为有效参与，其它卡片不再重复享受。',
                '活动期间，金卡最多可获得6次权益，精英白金卡最多可获得12次权益，尊贵白金卡最多可获24次权益。',
                '洗车服务将在达标后次月15日前以短信形式发送服务验证码及洗车网点链接，凭服务验证码直接到店使用即可。',
                '洗车服务验证码有效期以短信下发月次月底前有效，未使用将自动过期。',
                '仅限5座及以下非营运小型轿车普洗服务。',
                'SUV/MPV车主需向商户另外支付额外差价，具体详询商户。',
                '如当月交易包含消费取消或退货，则取消该笔消费交易参与当月活动的资格。',
                '境外交易按交易当天汇率折算。',
                '如您在使用洗车券时遇到疑问，请致电车点点客服4006935000进行咨询。',]
        }
    },
    5:{
        title:'0元帮买',
        infoTip:'',
        infoTxt:{
            tit:'活动细则',
            itmes:[
                '中信易鑫联名信用卡用户，通过指定页面链接地址 <a href="http://zt.taoche.com/zt/20170626/">http://zt.taoche.com/zt/20170626/</a> 预留中信系统手机号后，会有易鑫专职人员联系您办理。',
                '易鑫客服电话：4000-169-169（9：00至21：00）。',]
        }
    },
    6:{
        title:'延保5折',
        infoTip:'',
        infoTxt:{
            tit:'活动细则',
            itmes:[
                '中信易鑫联名信用卡用户，通过指定页面链接地址<a href="http://zt.taoche.com/zt/20170627/">http://zt.taoche.com/zt/20170627/</a> ，购买延保套餐可享受5折优惠。',
                '如您需进一步了解整体活动详情或办理流程，可致电易鑫客服电话咨询，易鑫客服电话：4000-169-169（9：00至21：00）。'
            ]
        }
    },
    7:{
        title:'加油最高返还15%',
        infoTip:`<h6>加油鼓励金细则</h6>
                <div class="tit">1、活动时间：即日起至2017年12月31日</div>
                <div class="tit">2、活动内容：活动时间内，自然月交易满足条件后，当月加油类交易可领取加油鼓励金，先到先得，具体规则如下：</div>
                （1）金卡：当月交易3笔399元且交易满3999元（计积分交易），可享加油类交易8%的加油鼓励金奖励。单月最高赠送80鼓励金。<br/>
                （2）白金精英卡：当月交易3笔399元且交易满5999元（计积分交易），可享加油类交易10%的加油鼓励金奖励。单月最高赠送100鼓励金。<br/>
                （3）白金尊贵卡：当月交易3笔399元且交易满5999元（计积分交易），可享加油类交易15%的加油鼓励金奖励。单月最高赠送150鼓励金。<br/>
                <div class="tit">3、活动规则：</div>
                （1）以上交易均为计积分交易，单日加油类交易超过500元部分不再奖励加油鼓励金。加油鼓励金累计部分取整数（不四舍五入）。<br/>
                （2）当月交易满足条件后，需在次月底之前领取加油鼓励金，未领取的权益将自动过期。<br/>
                （3）请登录http://dwz.cn/64W5oG进行领取，数量有限，先到先得。<br/>
                （4）领取加油鼓励金成功后，加油鼓励金将在领取成功后的次月底之前入到您的信用卡账户。<br/>
                （5）如您名下有多张车主类联名卡（中信标准车主卡或中信易鑫联名卡），且均符合赠送加油鼓励金条件，则按赠送加油鼓励金金额最高的卡片进行赠送，其他卡片不再赠送加油鼓励金。<br/>
                （6）如您名下有多张车主类联名卡（中信标准车主卡或中信易鑫联名卡），且赠送加油鼓励金的金额相同，则按核卡时间最早的卡片进行赠送。<br/>
                （7）加油类交易的规则：仅为刷卡交易描述中含有中国石化、中石化、中国石油、中石油、中国海油、中海油、加油站、加油中心的交易。<br/>
                （8）如当月交易包含消费取消或退货，则取消该笔消费交易参与当月活动的资格。<br/>
                （9）境外交易按交易当天汇率折算。`,
        infoTxt:{
            tit:'',
            itmes:[
            ]
        }
    },
    8:{
        title:'全年最高24次0元洗车',
        infoTip:`<h6>0元洗车规则</h6>
                <div class="tit">活动时间：即日起至2017年12月31日</div>
                <div class="tit">活动内容：</div>
                中信易鑫卡每自然月满足3笔399计积分交易，即可获得兑换0元洗车服务权益，洗车券兑完即止。其中当月交易满足交易条件，金卡每月送1次权益；精英白金卡每月送2次权益；尊贵白金卡每月送4次。<br/>
                <div class="tit">活动细则：</div>
                1、活动期内，按交易达标先后顺序进行赠送，洗车服务赠送总量为6000次/月，送完即止。<br/>
                2、若客户名下办理多张车主卡且满足交易条件，仅取最先达标对应卡片及次数为有效参与，其它卡片不再重复享受。<br/>
                3、活动期间，金卡最多可获得6次权益，精英白金卡最多可获得12次权益，尊贵白金卡最多可获24次权益。<br/>
                4、洗车服务将在达标后次月15日前以短信形式发送服务验证码及洗车网点链接，凭服务验证码直接到店使用即可。<br/>
                5、洗车服务验证码有效期以短信下发月次月底前有效，未使用将自动过期。<br/>
                6、仅限5座及以下非营运小型轿车普洗服务。<br/>
                7、SUV/MPV车主需向商户另外支付额外差价，具体详询商户。<br/>
                8、如当月交易包含消费取消或退货，则取消该笔消费交易参与当月活动的资格。<br/>
                9、境外交易按交易当天汇率折算。<br/>
                10、如您在使用洗车券时遇到疑问，请致电车点点客服4006935000进行咨询。`,
        infoTxt:{
            tit:'',
            itmes:[
            ]
        }
    }
}
var showinfo={
    title:'',
    tiph6:'',
    tipinfo:'',
    itmestit:'',
    itmesarr:[],
}
var index = {
    init: function () {
        var self = this;
        self.clickFun();
        self.hoverfun();
    },
    swiperFun: function () {
        /*var erBanner = new Swiper('#erBanner .swiper-container', {
            pagination: '#erBanner .pagination',
            paginationClickable: true,
            mode: 'horizontal',
            loop: true,
            autoplay: 5000,
        });*/
        setTimeout(function () {
            var mySwiper = new Swiper('.swiper-container',{
                pagination: '.pagination',
                paginationClickable: true,
                centeredSlides: true,/*默认状态下活动块居左，设定为true时，活动块会居中。*/
                slidesPerView: 3,
                /*watchActiveIndex: true,*/
                /**/
                /*offsetSlidesAfter :3,右边框的偏移个数*/
                loop : true,/*无限循环切换*/
                grabCursor : true,/*指针会变成抓手形状*/
                onInit: function(swiper){
                    console.log(swiper)
                },
                onSlideChangeStart: function(swiper){
                    console.log(swiper)
                    if (swiper.activeIndex==1){

                    }
                }
            })
            $('.arrow-left').on('click', function(e){
                e.preventDefault()
                mySwiper.swipePrev()
            })
            $('.arrow-right').on('click', function(e){
                e.preventDefault()
                mySwiper.swipeNext()
            })
        },1000)
    },

    clickFun:function () {
        var _self=this,
            $span=$('#showalertbox h5.top span'),
            $tit=$('#showalertbox .itmes-tip'),
            $ultit=$('#showalertbox .show-box-info .tit'),
            $ulhtml=$('#showalertbox .show-box-ul')

        function itmeinfo(len,htmlinfo) {
            for (var j=0;j<len.length;j++){
                htmlinfo=htmlinfo+'<li>'+len[j]+'</li>'
            }
            $ulhtml.html('<ul class="circle">'+htmlinfo+'</ul>')
        }

        $('.eventip').on('click',function (e) {
            e.preventDefault();
            var _this=$(this),id=_this.attr('data-id')
            $('#showalertbox').show();
            $('body').addClass('overflow')
            var ulhtml=''
            $.each(showbox,function (i,e) {
                if(id===e.title&&id.indexOf('基础服务')!==-1){
                    $span.text(e.title)
                    $tit.html(e.infoTip)
                }else if((id===e.title&&id.indexOf('专享租车')!==-1)||
                    (id===e.title&&id.indexOf('投保有礼')!==-1)||
                    (id===e.title&&id.indexOf('加油返现')!==-1)||
                    (id===e.title&&id.indexOf('优惠洗车')!==-1)||
                    (id===e.title&&id.indexOf('加油最高返还15%')!==-1)||
                    (id===e.title&&id.indexOf('全年最高24次0元洗车')!==-1)){
                    $span.text(e.title)
                    $tit.html(e.infoTip)
                    $ultit.html(e.infoTxt.tit)
                    itmeinfo(e.infoTxt.itmes,ulhtml)
                }else if((id===e.title&&id.indexOf('0元帮买')!==-1)||
                    (id===e.title&&id.indexOf('延保5折')!==-1) ){

                    $span.text(e.title)
                    $ultit.html(e.infoTxt.tit)
                    itmeinfo(e.infoTxt.itmes,ulhtml)
                }
            })
        })
        $('.close').on('click',function () {
            $('#showalertbox').hide();
            $('body').removeClass('overflow')
            $('#showalertbox h5.top span').text('')
            $('#showalertbox .itmes-tip').html('')
            $('#showalertbox .show-box-info .tit').html('')
            $('#showalertbox .show-box-ul').html('')
        })
        /*我要办卡*/
        $('.pageone-btn').on('click',function (e) {
            e.preventDefault();
            let card = $('.blipsContainer .blipSelected').text()
            if (card==='1'){
                window.location.href=cardhref[0]
            }else if (card==='2'){
                window.location.href=cardhref[1]
            }else if (card==='3'){
                window.location.href=cardhref[2]
            }else if (card==='4'){
                window.location.href=cardhref[3]
            }
        })
    },
    hoverfun:function () {
        $('.pagetwo-ul .img img').hover(function () {
            $(this).animate({left:"-15px",top:"-15px",height:'187px',position:'absolute'});
        },function () {
            $(this).animate({left:"0px",top:"0px",height:'157px',position:'absolute'});
        })
    },

    bannerxie:function () {
        let _self=$(this),$li=$('show_images_list')
        $li.on('click',function (e) {
            e.preventDefault();

        })
    },
}

$(function(){
    index.init();
    $('#creaditcard').fullpage({        normalScrollElements:'.showalert-box',
    });
    setTimeout(function () {
        $("#featureCarousel").featureCarousel({
         // include options like this:
         // (use quotes only for string values, and no trailing comma after last option)
         containerWidth:         874,
         containerHeight:        300,
         largeFeatureWidth:      321,
         largeFeatureHeight:     197,
         smallFeatureWidth:      246,
         smallFeatureHeight:     156,
         carouselSpeed:1000,
         autoPlay:               1000,
         pauseOnHove:false,
         OnHover:false,
         /* totalFeatureCount:      $(this).children("div").length,
         currentlyMoving:        false,
         featuresContainer:      $(this),
         featuresArray:          [],
         containerIDTag:         "#"+$(this).attr("id"),
         timeoutVar:             null,
         rotationsRemaining:     0,
         itemsToAnimate:         0,
         borderWidth:			0*/
         });

        /*var carousel = $("#featureCarousel").featureCarousel({
            // include options like this:
            // (use quotes only for string values, and no trailing comma after last option)
            // option: value,
            // option: value
        });*/
    },1000)

let $bodyheight=$('.pageone').height();

    if ($bodyheight<800){
        $('body').attr('id','media');
    }

});