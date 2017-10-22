import '../comm.scss';
import './index.scss';
import Vue from 'vue';
import $ from 'jquery'
import Store from  '../Store.js';
import Index from './pages/index.vue';
import 'swiper';
import '../comm/script/NewSelectCity.js';
window.Store = Store;
import comm from '../comm/comm.js';
window.comm = comm;
var APIURL = Store.insuranceAPI;
var indexInfo = function(){
};
indexInfo.prototype = {
	init:function(){
        var $that = this;
        this.from = (( comm.getUrlParam('yxms') && comm.getUrlParam('yxms') != undefined && comm.getUrlParam('yxms') != 'undefined' && comm.getUrlParam('yxms') != null && comm.getUrlParam('yxms') != 'null') ? comm.getUrlParam('yxms') : (comm.getUrlParam('from') ? comm.getUrlParam('from') : ''));
        this.NewCity();
        this.BannerEvent();
        this.evaluateList();
		this.LatestOffer();
		this.getCityInfo();
		this.initHtml();
		this.addEvent();
        this.SetMenu();//选择套餐
	},
    addEvent:function(){
        var $that = this;
        this.addACtive($('.business_box .titList li').eq(0),$('.business_box .titList li').eq(0).index());//初始化tab上标位置和文案
        $('.business_box .titList li').click(function(){ $that.addACtive($(this),$(this).index()); });//点击tab切换
        $(".business_box .listInfo li").click(function () { $that.Goinsurance($(this))});//获取报价
        $(".smallInsuranceList dl").click(function () {$that.chooseSmallInsuracne($(this))});//选择小险种
        $(".index_tit .details.moreEvaluate,.evaluateListBox li").click(function () {$that.CommentList();});// 更多评论
        $('.toolList div').click(function(){$that.toolList($(this))});//首屏小工具选择
        $('.insurance_tool li').click(function(){$that.insurance_tool($(this))});//车险小工具(险种如何选、续保提醒)
    },
    SetMenu:function(){//选择套餐
        var typeArr = {//cover配置文件
            "public": {
                "id": "pub",
                "name": "大众型",
                "arr": ["车损", "三者50万", "车上人员1万", "玻璃", "不计免赔(车损)", "不计免赔(三者)", "不计免赔(车上人员)"]
            },
            "econ": {
                "id": "econ",
                "name": "经济型",
                "arr": ["车损", "三者20万", "不计免赔(车损)", "不计免赔(三者)"]
            },
            "lux": {
                "id": "lux",
                "name": "豪华型",
                "arr": ["车损", "三者50万", "车上人员2万", "盗抢", "玻璃", "划痕", "自燃", "发动机涉水", "车损无法找到第三方", "不计免赔(车损)", "不计免赔(三者)", "不计免赔(盗抢)", "不计免赔(车上人员)"]
            }
        };
        $(".Package_box .small_list").on("click", function () {
            var content = '';
            var obj = typeArr[$(this).data("id")];
            $.each(obj.arr, function (i, text) {
                content += '<div class="li fontSize_12"><a class="fontSize_12" href="javascript:void(0);">' + text + '</a></div>';
            });
            $("body").showCover({
                title: obj.name,
                content: content,
                submit: function () {
                    var cityid = $("#CityId").attr("value");
                    var cityName = $("#CityName").attr("value");
                    var suburl = comm.getSubUrl('&');
                    var provinceId = document.getElementById("ProvinceId").value;
                    var regionId = $("#RegionId").attr("value");
                    var licensePlateCode = $("#LicensePlateCode").attr("value");
                    window.open('/InsureApi/UserBasicInfo?ShortEName=YGBX&CityID=' + cityid + '&CityName=' + cityName + '&ProvinceId=' + provinceId  + '&LicensePlateCode=' + licensePlateCode + '&RegionId=' + regionId + suburl, "_self");
                    return $("#cover").remove();
                    //window.location.href = "?id=" + obj.id;
                },
                callback: function () {
                    // alert("初始化完成啦");
                }
            });
        });
    },
    insurance_tool:function(dom){
        var $that = this;
        if(dom.attr('id') == 'remindSubmit'){
            window.location.href = APIURL + '/home/ExpirRemind'+comm.getSubUrl("?");
        }else if(dom.attr('id') == 'InsuranceTypeChoose'){
            window.location.href = APIURL + '/home/InsuranceTypeChoose' + comm.getSubUrl("?");
        }
    },
    toolList:function(dom){
        var $that = this;
        $that.getChooseCItyInfo();//获取城市信息
        if(dom.hasClass('claimGuide')){//理赔指引
            window.location.href = APIURL + '/home/claimGuide' + comm.getSubUrl('?');
        }else if(dom.hasClass('mine')){//我的
            window.location.href = APIURL + '/usercenter/' + comm.getSubUrl('?');
        }else if(dom.hasClass('juejin')){//推广
            window.location.href = APIURL + '/promotion/master/MyStore' + comm.getSubUrl('?');//加yxms
        }else if(dom.hasClass('comparablePriceSubmit')){//帮你比价
            window.location.href = APIURL + '/InsuranceParity/index?RegionId=' + $that.regionId + comm.getSubUrl('&'); //新版比价
        }else if(dom.hasClass('mianfeiling')){//帮你比价
            window.location.href = APIURL + '/InsuranceFree/PAICFreeInsure/' + comm.getSubUrl('?'); //免费领
        }
    },
    CommentList:function(){
        var $that = this;
        $that.getChooseCItyInfo();//获取城市信息
        window.location.href = APIURL + '/home/CommentList' + comm.getSubUrl('?');
    },
    chooseSmallInsuracne:function(dom){
        if(dom.hasClass('zijiayou')){
            window.location = APIURL + "/InsuranceTravel/InsurancePolicyInfo?type=driving" + comm.getSubUrl('&');
        }else if(dom.hasClass('changxian')){
            window.location = APIURL + "/InsuranceTravel/InsurancePolicyInfo?type=long" + comm.getSubUrl('&');
        }
        else if(dom.hasClass('duanxian')){
            window.location = APIURL + "/InsuranceTravel/InsurancePolicyInfo?type=short" + comm.getSubUrl('&');
        }
        else if(dom.hasClass('gaoyuanyou')){
            window.location = APIURL + "/InsuranceTravel/InsurancePolicyInfo?type=high" + comm.getSubUrl('&');
        }
    },
    Goinsurance:function(dom) {
        var $that = this;
        var shortEName = dom.attr("id");
        var type = 267;
        //获取是否是from  + didaUserType + didaPhoneNo + didaUserName
        var suburl = comm.getSubUrl('&');
        $that.getChooseCItyInfo();//获取城市信息
        if (shortEName == "PICC") {//人保
            window.open(APIURL+'/InsureApi/PiccUserInfo?ShortEName=PICC&CityID=' + $that.cityid + '&CityName=' + $that.cityName + '&ProvinceId=' + $that.provinceId + '&LicensePlateCode=' + $that.licensePlateCode + '&RegionId=' + $that.regionId + comm.getSubUrl('&'), "_self");
        } else if (shortEName == "PAIC") {//平安
            // window.open('http://u.pingan.com/upingan/insure/bdwx/bdwx.html?mediasource=sc03-waimei-clcwz-01', "_self");
        } else {
            window.open(APIURL+'/InsureApi/UserBasicInfo?ShortEName=' + shortEName + '&CityID=' + $that.cityid + '&CityName=' + $that.cityName + '&ProvinceId=' + $that.provinceId + '&LicensePlateCode=' + $that.licensePlateCode + '&RegionId=' + $that.regionId + comm.getSubUrl('&'), "_self")
        }
    },
    addACtive:function(dom,index,w){//点击切换保险公司列表
        var Superscript = $('.business_box .Superscript').width()-10;
        var liW= $('.business_box .titList li').eq(0).width();
        var AW= $('.business_box .titList li').eq(0).find('a').width();
        console.log(AW)
        if(index == 0){
            $('.business_box .Superscript').text('放心').animate({'left':AW+Superscript});//性价比高
        }else if(index == 1){
            $('.business_box .Superscript').text('超值').animate({'left':liW+AW+Superscript});//免息分期
        }else{
            $('.business_box .Superscript').text('免息').animate({'left':liW*2+AW-6+Superscript});//热门品牌
        }
        dom.addClass('active').siblings().removeClass('active');
        $('.business_box .box ul').eq(index).show().siblings().hide();
    },
    NewCity: function () {//选择城市
        var $that = this;
        var NewCity = new NewSelectCity({
            Trigger: $("#TopCityTrigger2"), //触发事件的dom
            hot: true,//是否显示热门城市，如果不是选择城市那么这个属性失效
            isCity: true, //选择城市还是区县
            islocation: true,//是否需要定位城市 ，如果不是选择城市那么这个属性失效
            main_box: $("#mWeb"), //要隐藏的box
            CallBack: function (obj) { //回调事件
                $("#CityId").attr("value", obj.CityID);
                $("#CityName").attr("value", obj.CityName);
                $("#ProvinceId").attr("value", obj.ProvinceId);
                $("#LicensePlateCode").attr("value", obj.LicensePlateCode);
                $("#RegionId").attr("value", obj.RegionId);
                index.$children[0].CityName = obj.CityName;
                index.$children[0].CityId = obj.RegionId;
                $("#newSelectCity span").text(obj.areaName).attr("CityID", obj.areaID);
                comm.setCookie("selectCityId",obj.CityID,'',comm.WildcardUrl());
                comm.setCookie("selectcity", obj.CityID, '', comm.WildcardUrl());
                comm.setWXShare(3);//微信分享
                $that.LatestOffer();
            }
        });
    },
	BannerEvent:function(){//banner
        var mySwiper = $('#bannerCtn.swiper-container').swiper({
            loop: true,
            pagination: '.swiper-pagination',
            autoplay: 3000,
            autoplayDisableOnInteraction: false
        });
        $("#bannerCtn img").click(function () {
            var id = $(this).parent().attr("class");
            var type = 267;
            //获取是否是from
            var suburl = comm.getSubUrl('&');
            var cityid = $("#CityId").attr("value");
            var cityName = $("#CityName").attr("value");
            var provinceId = document.getElementById("ProvinceId").value;
            var regionId = document.getElementById("RegionId").value;
            var licensePlateCode = document.getElementById("LicensePlateCode").value;
            var isYXFrom = $('#bannerCtn').data('from');
            if (id == "PICC1") {//人保
                window.open(APIURL+'/InsuranceActivities/PiccActivity?ShortEName=PICC&goback=active&share=true' + suburl, "_self");
                return false;
            } else if (id == "AXATP1") {//安盛
                window.open(APIURL+'/InsureApi/UserBasicInfo?ShortEName=AXATP&CityID=' + cityid + '&CityName=' + cityName + '&ProvinceId=' + provinceId + '&LicensePlateCode=' + licensePlateCode + '&RegionId=' + regionId + suburl, "_self");
            } else if (id == "YGBX1") {//阳光
                window.open(APIURL+'/InsureApi/UserBasicInfo?ShortEName=YGBX&CityID=' + cityid + '&CityName=' + cityName + '&ProvinceId=' + provinceId + '&LicensePlateCode=' + licensePlateCode + '&RegionId=' + regionId + suburl, "_self")
            } else if (id == "AIC1") {//永诚
                if(isYXFrom == 'True'){
                    window.open(APIURL+'/InsureApi/UserBasicInfo?ShortEName=AIC&CityID=' + cityid + '&CityName=' + cityName + '&ProvinceId=' + provinceId + '&LicensePlateCode=' + licensePlateCode + '&RegionId=' + regionId + suburl, "_self")
                }else{
                    window.open(APIURL+'/InsuranceActivities/AicActivity?ShortEName=AIC&goback=index&share=true' + comm.getFrom('&'), "_self");
                }
            } else if (id == "AICACtive") {//众安
                window.open(APIURL+'/InsuranceActivities/SelfDrivingTravel' + comm.getFrom(), "_self");
            } else if (id == "CGB") {//广发
                if(isYXFrom == 'True') {return false}else{window.open('/InsureRedirect/GuangfaRedirect?shortEName=GFXYK' + comm.getFrom('&'), "_self");}
            } else if (id == "ZABX1") {//保骉
                window.open(APIURL+'/InsureApi/UserBasicInfo?ShortEName=ZABX&CityID=' + cityid + '&CityName=' + cityName + '&ProvinceId=' + provinceId + '&LicensePlateCode=' + licensePlateCode + '&RegionId=' + regionId + suburl, "_self");
            } else if (id == "DOUBLE11") {//双十二
                window.open(APIURL+'/InsuranceActivities/DOUBLE11?' + comm.getFrom()+'&goback=index&CityID='+regionId, "_self");
            }
        });
    },
    evaluateList : function(){
        var evaluate_list = new Swiper('#smallInsure', {
            loop: true,
            pagination: '#smallInsurePagination',
            slidesPerView: 2,
            slidesPerGroup : 2,
            autoplay: 2500,//自动切换的时间间隔（单位ms）
            speed: 1000 //滑动速度
        });
    },
    LatestOffer:function(){//最新优惠
        var $that = this;
        $that.getChooseCItyInfo();//获取城市信息
        var _data = {
            channel:$that.from,regionId:$that.regionId,companys:'PICC,CPIC,PAIC,AXATP,CCIC,YGBX,BOCI,CIC'
        };
        Store.GetPreferentialPolicy(_data).then(function (res ) {
            if(res.Result){
                var JSON_html='';
                for(var i = 0; i < res.Data.length;i++){
                    JSON_html+='<div class="swiper-slide fontSize_12"><a href="javascript:void(0);" class="'+res.Data[i].Id+'">'+res.Data[i].Info+'</a></div>';
                }
                $("#recentCtn .swiper-wrapper").html(JSON_html);
                $('.LatestOffer').removeClass('hide');
                //最近投保 滚动
                var recentSwiper = new Swiper('#recentCtn', {
                    paginationClickable: false,
                    direction: 'vertical',
                    loop: true,
                    slidesPerView: 1,
                    autoplay: 2500,
                    autoplayDisableOnInteraction: true
                });
            }else{
                $('.LatestOffer').addClass('hide');
            }
        });
    },
    getCityInfo: function () {//通过城市ID获取详细信息
        var $that = this;
        var callback = function (res) {
            var oldCityName = comm.getCookie("locationCityId")?comm.getCookie("locationCityName"):index.$children[0].CityName;//存储原城市名称
            var CityInfo = {};
            if(res){//返回定位城市信息
                CityInfo = {
                    "CityID":res.CityID,//易车城市标识
                    "CityName":res.CityName,//城市名称
                    "RegionId":res.RegionId,//城市国标码
                    "LicensePlateCode":res.LicensePlateCode //城市对应的车牌号简码
                };
                if (comm.getCookie("changeCity") == "no") {
                    console.log("noi")
                }else{
                    console.log(res.ischange)
                    if(res.ischange){
                        $that.ShowCItyBox(CityInfo);//弹出提示框
                    }else{
                        $that.setLocationCity(CityInfo);
                        $that.getChooseCItyInfo();//刷新城市信息
                    }
                }
            }else{//定位失败
                CityInfo = {
                    "CityID":'201',//易车城市标识
                    "CityName": '北京',//城市名称
                    "RegionId":'110100',//城市国标码
                    "LicensePlateCode":'京' //城市对应的车牌号简码
                };
                $that.setLocationCity(CityInfo);
                $that.getChooseCItyInfo();//刷新城市信息
            }
        };
        comm.getLocationCity(callback);//获取城市信息
    },
    getChooseCItyInfo:function(){//设置城市信息
        var $that = this;
        $that.cityid = $("#CityId").attr("value");
        $that.cityName = $("#CityName").attr("value");
        $that.provinceId = document.getElementById("ProvinceId").value;
        $that.regionId = document.getElementById("RegionId").value;
        $that.licensePlateCode = document.getElementById("LicensePlateCode").value;
        $that.suburl = comm.getSubUrl('&');//获取是否是from
    },
    ShowCItyBox:function(obj,callbackFun){
        var $that = this;
        var showObj = {
                title:"",
                text:"系统识别到您的城市在"+obj.CityName+'',
                btnCancelText:"取消",
                btnOkText:"确认",
                cancelCallback:function(){
                    $(".alert_box").hide();
                    comm.setCookie("changeCity",'no','');
                },
                okCallback:function(){
                    $(".alert_box").hide();
                    $that.setLocationCity(obj);
                    $that.getChooseCItyInfo();//刷新城市信息
                    $that.LatestOffer();
                },
            };
        comm.showEditAlert(showObj);
    },
    setLocationCity: function (CityInfo) {//设置城市信息
        var $that = this;
        comm.setCookie("selectCityId",CityInfo.CityID,'',comm.WildcardUrl());
        comm.setCookie("selectcity",CityInfo.CityID,'',comm.WildcardUrl());
        index.$children[0].CityName = CityInfo.CityName;
        index.$children[0].CityId = CityInfo.RegionId;
        comm.setCookie('chooseCityName',CityInfo.CityName);
        $("#CityName").attr("value", CityInfo.CityName);//隐藏域城市名称
        if(CityInfo.RegionId){
            $("#CityId").attr("value",CityInfo.RegionId);//隐藏域城市id
            $("#ProvinceId").attr("value", CityInfo.RegionId.toString().substr(0, 2) + '0000');//省份ID
            $("#LicensePlateCode").attr("value", CityInfo.LicensePlateCode);//城市简码
            $("#RegionId").attr("value", CityInfo.RegionId);//国标码
        }else{
            $that.GetRegion(CityInfo.RegionId)
        }
        comm.setWXShare(3,CityInfo.RegionId);//微信分享
    },
    GetRegion:function(id){
        $.ajax({
            type: "get",
            url: "/baoxian/InsuranceCity/GetRegion",
            data: { "cityid": bit_locationInfo.cityId },
            success: function (res) {
                index.$children[0].CityId = res.RegionId;
                $("#ProvinceId").attr("value", res.ProvinceId);//省份ID
                $("#LicensePlateCode").attr("value", res.LicensePlateCode);//城市简码
                $("#RegionId").attr("value", res.RegionId);//国标码
            }
        });
    },
    initHtml:function(){
        var first_h = $("#questions_list .swiper-slide").eq(0).height();
        var two_h = $("#questions_list .swiper-slide").eq(1).height();
        var all_h = first_h + two_h;
        var ques_hei = $("#questions_list .swiper-slide").eq(0).height() + $("#questions_list .swiper-slide").eq(0).height();
        $("#questions_list").height(all_h);
        $(".slide_btn").click(function(){
            if($(".slide_btn .icon").hasClass("i13")){
                $(".slide_btn .icon").removeClass("i13").addClass("i12");
                $(".slide_btn span").text("收起");
                $("#questions_list").css({"height":"auto"});
            }else{
                $(".slide_btn .icon").removeClass("i12").addClass("i13");
                $(".slide_btn span").text("展开");
                $("#questions_list").css({"height":all_h});
            }
        });
    },

};
$(function(){
	var indexFun = new indexInfo();
		indexFun.init();
});
var index = new Vue({
	el: '#app',
	data:{
        CityName:'北京',
        questionsObj : [
            {'questionsName':"车险为什么在网上买？",'name':"李*林",'tel':"135****6753","dateVal":(new Date((new Date().getTime()) - 24 * 60 * 60 * 1000)).pattern("yyyy-MM-dd"),'main':'1、送高额投保礼，部分公司总保费满1000送200；<br/>2、不用跑去4s店，保单送到家，节约时间；<br/>3、出险后的理赔服务同样便利，拨打保险公司电话即可。',"answer_name":'易鑫车险顾问','answer_date':(new Date((new Date().getTime()) - 24 * 60 * 60 * 1000)).pattern("yyyy-MM-dd")},
            {'questionsName':"哪些险种是必须的？",'name':"谢*美",'tel':"153****7075","dateVal":(new Date((new Date().getTime()) - 24 * 60 * 60 * 1000)).pattern("yyyy-MM-dd"),'main':'建议全险组合：车损+三者(50万)+盗抢+车上人员(1万)+玻璃+不计免赔。',"answer_name":'易鑫车险顾问','answer_date':(new Date((new Date().getTime()) - 24 * 60 * 60 * 1000)).pattern("yyyy-MM-dd")},
            {'questionsName':"投保成功后，礼品什么时候发放？",'name':"周*沙",'tel':"183****5648","dateVal":(new Date((new Date().getTime()) - 24 * 60 * 60 * 1000)).pattern("yyyy-MM-dd"),'main':'20个工作日内，礼品会发放给你。',"answer_name":'易鑫车险顾问','answer_date':(new Date((new Date().getTime()) - 24 * 60 * 60 * 1000)).pattern("yyyy-MM-dd")},
            {'questionsName':"什么样的车什么地区可以投保？",'name':"朱*飞",'tel':"189****7382","dateVal":(new Date((new Date().getTime()) - 24 * 60 * 60 * 1000*2)).pattern("yyyy-MM-dd"),'main':'我们平台支持全国范围的家用车辆投保，限9座及以下，包含新车、过户车。',"answer_name":'易鑫车险顾问','answer_date':(new Date((new Date().getTime()) - 24 * 60 * 60 * 1000*2)).pattern("yyyy-MM-dd")},
            {'questionsName':"网络买车险选哪家公司好？",'name':"刘*文",'tel':"186****0934","dateVal":(new Date((new Date().getTime()) - 24 * 60 * 60 * 1000*2)).pattern("yyyy-MM-dd"),'main':'我们已经为您选好了国内网销排名前八位的保险公司，任何一家都值得信赖，您可以按照个人喜好自由选择。',"answer_name":'易鑫车险顾问','answer_date':(new Date((new Date().getTime()) - 24 * 60 * 60 * 1000*2)).pattern("yyyy-MM-dd")},
            {'questionsName':"我的个人信息安全吗，有没有被泄露的风险？",'name':"屈*小",'tel':"153****8952","dateVal":(new Date((new Date().getTime()) - 24 * 60 * 60 * 1000*2)).pattern("yyyy-MM-dd"),'main':'易鑫车险拥有强大的技术团队，您的所有隐私信息绝对不会被泄露。我们也与保险公司合作，共同打造您的账户安全。',"answer_name":'易鑫车险顾问','answer_date':(new Date((new Date().getTime()) - 24 * 60 * 60 * 1000*2)).pattern("yyyy-MM-dd")},
            {'questionsName':"网上支付保费安全吗？",'name':"网友",'tel':"135****7851","dateVal":(new Date((new Date().getTime()) - 24 * 60 * 60 * 1000*3)).pattern("yyyy-MM-dd"),'main':'您的保费直接支付到保险公司的帐户，非常安全。',"answer_name":'易鑫车险顾问','answer_date':(new Date((new Date().getTime()) - 24 * 60 * 60 * 1000*3)).pattern("yyyy-MM-dd")},
            {'questionsName':"我有问题可以咨询谁？",'name':"王*鹏",'tel':"134****0922","dateVal":(new Date((new Date().getTime()) - 24 * 60 * 60 * 1000*3)).pattern("yyyy-MM-dd"),'main':'可以拨打我们的免费服务电话：4000-169-169或者关注我们的微信公众账号：“易鑫车险”获取相关服务。',"answer_name":'易鑫车险顾问','answer_date':(new Date((new Date().getTime()) - 24 * 60 * 60 * 1000*3)).pattern("yyyy-MM-dd")}
        ],
    },
	components: {
		Index
	},
	created:function(){
		
	}
});