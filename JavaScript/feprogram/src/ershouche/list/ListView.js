'use strict';

import '../css/ershouche.scss'
import './list.scss'
// import React from 'react';
// import ReactDom from 'react-dom';
// import ReactRouter from 'react-router';
//声明变量
import app from '../script/app';
import XTK from '../script/XTK';
import Store from '../script/Store';
import IScroll from 'iscroll';
import tools from 'libs/tools';
import selCar from 'libs/carSelect/selCar.pc';
import 'libs/jquery.nivo.slider';
import Swiper from 'libs/swiper/2.0.js';

var arry = [];
var indexShouFu;
var indexYuegong;
Store.ershoucheAPI = ershoucheUrl;
Store.xincheAPI = xincheUrl;
var ViewModel = {};
//初始化页面
ViewModel.init = function () {
    ViewModel.headerSlider();
    ViewModel.loadDomVIew();
    ViewModel.gotoPage();
    if(totalCount==0){
        ViewModel.getMoreCarListView();
    }
};
ViewModel.gotoPage = function () {
      totalCount=parseInt(totalCount);
      pageSize=parseInt(pageSize);
    if (totalCount < (pageSize+2)) {
        $('#listPagination').hide();
    } else {
          $('#listPagination').show();
        var pageTotal = Math.ceil(totalCount / pageSize);
        //分页
        tools.listPagination("listPagination", pageTotal, pageindex, callBacks);
        function callBacks(pageIndex) {
            location.href = '/' + cityInfo.citySpell +ucarUrl  +chooserUrl + 'p' + pageIndex+'/?source='+source;
        }
    }
}
 // 顶部轮播图
ViewModel.headerSlider =function() {
    $('.pagination').hide();
       if($(".swiper-slide").length>1){
           $('.pagination').show();
            var mySwiper = new Swiper('.swiper-container',{
                pagination: '.pagination',
                paginationClickable: true,
                mode: 'horizontal',
                loop : true,
                autoplay : 5000,
            });
        }
  },
ViewModel.loadDomVIew = function () {
     $('#listPagination').hide();
     window.selCityCallback = function(obj) {
         if(ucarUrl=='/'&&chooserUrl=='/')
             location.href = '/' + obj.citySpell+'/list'+'/?source='+source;
         else if(ucarUrl=='/')
              location.href = '/' + obj.citySpell  +chooserUrl +'/?source='+source;
         else
              location.href = '/' + obj.citySpell +ucarUrl +chooserUrl +'/?source='+source;
         
        };
    $('#more-listcar').hide();
    $(".serach-text").css("left","241px");
    $(".serach-text").css("background","#fff");
     $(".serach-text").css("padding-right","30px");
    //列表优质车源提示
    $('.tip').hide();
    $('#chexingMore').click(function () {
        if ($(this).find('a').text() == '更多') {
            $(this).html('<a href="javascript:void(0);" data-id="">收起<i class="icon_up"></i></a>');
            var h = $('#chexingDl').find('dd').height() + 13;
            $('#chexingDl').animate({ height: h + 'px' })
        } else {
            $(this).html('<a href="javascript:void(0);" data-id="">更多<i class="icon_down"></i></a>');
            $('#chexingDl').animate({ height: "50px" });
        }
    })
    $('.OrderNum').mouseover(function () {
        $(this).find('.tip').show();
    }).mouseout(function () {
        $(this).find('.tip').hide();
    });
    //filter 下拉框
    $('.select-more>div').mouseover(function () {
        if ($(this).find('.drop-layer').css('display') == 'block') {
           $(this).find('.select-ctrl').removeClass('up');
           $(this).find('.drop-layer').hide();
        } else {
           $('.select-ctrl').removeClass('up');
            $('.drop-layer').hide();
             $(this).find('.select-ctrl').addClass('up');
            $(this).find('.drop-layer').show();
        }
    }).mouseout(function () {
        $('.select-ctrl').removeClass('up');
        $('.drop-layer').hide();
    });
    $(window).click(function(e){
       $('#moreBrandClick').find('i').attr('class', 'icon_down')
         $('#moreBrand').hide('500');
         e.stopPropagation();
    })
    $('#moreBrand').click(function(e){
        e.stopPropagation();
    })
    //出现更多品牌
    $('#moreBrandClick').click(function (e) {
        e.stopPropagation();
        if ($('#moreBrand').css('display') == 'block') {
            $(this).find('i').attr('class', 'icon_down')
            $('#moreBrand').hide('500');
        } else {
            $(this).find('i').attr('class', 'icon_up')
            $('#moreBrand').show('500');
        }
       

    }); 
     // /*********输入框选车初始化********/
         var txt='请输入心仪品牌或车型...'
        $('.search-input').focus(function(){
            if(this.value==txt){
                this.value="";
            }
        })
        $('.search-input').blur(function(){
            if(this.value==''){
                this.value=txt;
            }
        })
            $('.search-input').selCar({
                SerialImgShow: false,
                //IsOpenSearch:false,
                IsBrandsBack: true,
                CallBacks: inputCallBack
            });

            function inputCallBack(obj) {
                if (obj.brandName && obj.carType) {
                     location.href = '/' + cityInfo.citySpell + '/s' + obj.carTypeId+'/?source='+source;
                } else {
                    if(obj.brandId){
                     location.href = '/' + cityInfo.citySpell + '/m' + obj.brandId+'/?source='+source;
                     }
                }
               // $(".brand-name").attr({ "data-brandId": obj.brandId, "data-carTypeId": obj.carTypeId }).text(_brandTxt);
              
            }

             $('.search-input').val(txt);
        /********** 搜索按钮***********/
        $(".search-btn").click(function() {
            if ($('.search-input').val() != "请输入心仪品牌或车型..." && $('.search-input').val() !='') {
                if(!$('.search-input').attr("data-id") && !$('.search-input').attr("data-brandid")){
                    if($(".sel-car-menu li").size()>0){
                        if($(".sel-car-menu li").size()==1 && $(".sel-car-menu li").html()=="未找到符合条件的车型！"){
                            $('.sel-car-menu').css({ 'display': 'block' })
                            setTimeout(function () {
                                $('.sel-car-menu').css({ 'display': 'block' })
                            }, 3);
                        }else{
                            $(".sel-car-menu li").eq(0).mouseover();
                            //setTimeout(function(){
                            $(".sel-car-menu li").eq(0).click();
                            //},800)
                        }
                    }
                }else{
                    if ($('.search-input').attr('data-id')) {
                        location.href='/' + cityInfo.citySpell + '/s' + $('.search-input').attr('data-id')+'/?source='+source;
                    } else {
                        location.href='/' + cityInfo.citySpell + '/m' + $('.search-input').attr('data-brandid')+'/?source='+source;
                }
                }

            } else {
                $('.search-input').val('');
                $(".serach-text").show();
                setTimeout(function() {
                    //$(".serach-text").fadeOut(300);
                    $(".serach-text").animate({opacity:0},300,function(){
                     
                        $(".serach-text").css("display","none");
                        $(".serach-text").css("opacity","1");

                        if($('.search-input').is(":focus")){
                            $('.search-input').val('');
                        }else{
                            $('.search-input').val('请输入心仪品牌或车型...');
                        }


                    })
                }, 1000);
            }


        });
        $('.search_input').keyup(function(e){
            if(e.keyCode!=13){
                $(this).attr("data-id",'');
                $(this).attr("data-brandid",'');
            }
        })

              $(".other-search").hover(function () {
                $(".other-search i").animate({
                    height: "44px"
                }, 200, "linear", function () {
                    $(".other-search a").css({ "color": "#fff" });
                });
            }, function () {
                $(".other-search i").animate({
                    height: 0
                }, 200, "linear", function () {
                    $(".other-search a").css({ "color": "#e9474d" });
                });
            });
}
ViewModel.getMoreCarListView = function () {
    if (!carList) {
        $(".car-part").text("0");
        $(".list_pagination").hide();
        $(".no-product").show();
        //看看更多二手车
        Store.getMoreCarList(cityInfo.cityId).then((res2) => {
            if(res2.Data==null){
                return ;
            }
            var html = '';
            if (res2.Data.UcarList.length != 0) {
                for (var i = 0; i < 4; i++) {
                    var NewCarPrice = res2.Data.UcarList[i].ReferPrice;
                    if (NewCarPrice == null) {
                        NewCarPrice = "";
                    }
                    var csn = "";
                    var csn2 = "";
                    if (res2.Data.UcarList[i].WarrantyTypes.indexOf("1") == 0) {
                        csn = "享厂商免费维修服务";
                        csn2 = '<div class="original-mark">原厂质保</div>';
                    } else if (res2.Data.UcarList[i].WarrantyTypes.indexOf("1") == 1) {
                        csn = "享免费延长质保服务";
                        csn2 = '<div class="lengthen-mark">延长质保</div>';
                    } else if (res2.Data.UcarList[i].WarrantyTypes.indexOf("1") == 2) {
                        csn = "享免费过户外迁服务";
                        csn2 = '<div class="free-mark">免费过户</div>';
                    } else if (res2.Data.UcarList[i].WarrantyTypes.indexOf("1") == 3) {
                        csn = "享品牌厂商售后服务";
                        csn2 = '<div class="brand-mark">品牌认证</div>';
                    }
                    var monthHtml = '', DownPaymentAmountHtml = '', ReferPrice = '';
                 
                    monthHtml=app.show_price_text(res2.Data.UcarList[i].MonthlyPayment);
                    DownPaymentAmountHtml=app.show_price_text(res2.Data.UcarList[i].DownPaymentAmount);
                    
                    if (res2.Data.UcarList[i].ReferPrice > 1) {
                        if (res2.Data.UcarList[i].ReferPrice - res2.Data.UcarList[i].DisplayPrice > 0) {
                            ReferPrice = (Number(res2.Data.UcarList[i].ReferPrice) + Number(res2.Data.UcarList[i].ReferPrice / 1.17 * 0.1) - res2.Data.UcarList[i].DisplayPrice).toFixed(2);
                            if (ReferPrice < 1) {
                                ReferPrice = '<span>省  ' + (ReferPrice * 10000).toFixed(0) + '元</span>'
                            } else {
                                ReferPrice = '<span>省  ' + ReferPrice + '万</span>';
                            }
                        }

                    } else {
                        if (res2.Data.UcarList[i].ReferPrice - res2.Data.UcarList[i].DisplayPrice > 0) {
                            ReferPrice = '<span>省  ' + ((Number(res2.Data.UcarList[i].ReferPrice) + Number(res2.Data.UcarList[i].ReferPrice / 1.17 * 0.1) - res2.Data.UcarList[i].DisplayPrice) * 10000).toFixed(0) + '元</span>'
                        }
                    }
                    html += '<div class="good-car1">' +
                        '<a href="/'+ res2.Data.UcarList[i].CarCityId+'/u'+res2.Data.UcarList[i].UcarID+'/?source='+source+'" target="_blank">' +
                        '<div class="car-img">' +
                        '<img src="' + res2.Data.UcarList[i].FirstPicturePath.split("|")[0] + '">' +
                        '<div class="car_mask"></div>'+
                        '</div>' +
                        '<div class="good-car-info">' +
                        '<div class="car-info-name">' + res2.Data.UcarList[i].CarFullName + '</div>' +
                        '<div class="car-info-loan">首付 <em>' + DownPaymentAmountHtml + '</em>  月供 <em>' + monthHtml + '</em></div>' +
                        '<div class="car-info-save">' + ReferPrice + '</div>' +
                        '</div>' +
                        '<div class="all-mark">' +
                        csn2 +
                        '</div>' +
                        '</a>' +
                        '</div>';
                }
            }
            $("#morelist").html(html);
            
            $(".more-listcar").show();
               //动效
            $("#morelist-swiper").on("mouseover", "a .car-img", function () {
                $(this).find('.car_mask').css({ 'display': 'block' });
            }).on("mouseout", function () {
               $(this).find('.car_mask').css({ 'display': 'none' });
            });
        });
    }
}

$(function () {
    ViewModel.init();
})

