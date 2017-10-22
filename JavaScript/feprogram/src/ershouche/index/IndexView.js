'use strict';

import 'jquery.lazyload'
import '../css/ershouche.scss';
import './index.scss';
//import './jquery1.42.min'
// import React from 'react';
// import ReactDom from 'react-dom';
// import ReactRouter from 'react-router';
import 'libs/home_page_ad'
import Swiper from 'libs/swiper/2.0';
import selCar from 'libs/carSelect/selCar.pc';
import app from '../script/app';
import XTK from '../script/XTK';
import Store from '../script/Store';


$(document).ready(function () {
    XTK.Action.bind();
    index.init();
    window.selCityCallback = function (obj) {
        window.location.href = "/" + obj.citySpell + '/';
    };

})
Store.ershoucheAPI = ershoucheUrl;
Store.xincheAPI = xincheUrl;
var index = {
    init: function () {
        var self = this;
        self.swiperFun();
        self.carSelectFun();
        self.recentDeal();
        self.goodCar();
        self.selCity()


        //图片惰性加载
        $("img.lazy").lazyload({
            effect: "fadeIn",//淡入效果
            placeholder: RESURL + "/images/libs/transparent.gif",
            threshold: 200//设置 threshold 为 200 令图片在距离屏幕 200 像素时提前加载.
        });
        //品牌动效
        $('.brand_ul').on('mouseover', 'li', function () {
            $(this).find('.hover').stop().animate({ 'top': 0 }, 200, 'swing');
        }).on('mouseout', 'li', function () {
            $(this).find('.hover').stop().animate({ 'top': '100%' }, 200, 'swing');
        });
        $('.brand_ul li:last').hover(function () {
            $(this).find('.car_more').addClass('cur')
            $(this).find('.car_name').css({ 'color': '#e9474d' })
        }, function () {
            $(this).find('.car_more').removeClass('cur')
            $(this).find('.car_name').css({ 'color': '#000' })
        })
        $('.hot_models_ul').on('mouseover', 'li', function () {
            $(this).addClass('red')
            $(this).find('.hover').stop().animate({ 'bottom': 0 }, 200, 'swing');
        }).on('mouseout', 'li', function () {
            $(this).removeClass('red');
            $(this).find('.hover').stop().animate({ 'bottom': '-30%' }, 200, 'swing');
        });
        $('.cheap_cars_ul').on('mouseover', 'li', function () {
            $(this).find('.btn_red').stop().animate({ 'bottom': 0 }, 100, 'swing');
        }).on('mouseout', 'li', function () {
            $(this).find('.btn_red').stop().animate({ 'bottom': '-30%' }, 100, 'swing');
        });
        $('.other_search').hover(function () {
            $(this).find('i').stop().animate({ 'bottom': 0 }, 100, 'swing');
        }, function () {
            $(this).find('i').stop().animate({ 'bottom': '-100%' }, 100, 'swing');
        })
        window.selCityCallback = function (obj) {
            window.location.reload();
        };

    },
    //切换城市
    selCity: function () {
        //window.selCityCallback = function(obj) {

    },
    price: function (priceNum) {
        var newNum = '';
        if (priceNum > 1) {
            return newNum = (priceNum).toFixed(2) + '万'
        } else {
            return newNum = (priceNum * 10000).toFixed(0) + '元'
        }
    },
    swiperFun: function () {

        //banner
        /*var mySwiper = new Swiper('.swiper-container',{
            pagination: '.pagination',
            paginationClickable: true,
            moveStartThreshold: 100
        })*/
        //console.log($("#erBanner .swiper-slide").length);
        $('#erBanner .pagination').hide();
        setTimeout(function () {
            if ($("#erBanner .swiper-slide").length > 1) {
                $('#erBanner .pagination').show();
                var erBanner = new Swiper('#erBanner .swiper-container', {
                    pagination: '#erBanner .pagination',
                    paginationClickable: true,
                    mode: 'horizontal',
                    loop: true,
                    autoplay: 5000,
                });
            }
        }, 1000)


        //最近申请：
        setTimeout(function () {
            var swiperRecent = new Swiper('#swiperRecent .swiper-container', {
                paginationClickable: true,
                mode: 'vertical',
                autoplay: 5000,//可选选项，自动滑动
                loop: true,//可选选项，开启循环
            });
        }, 1000)

        //爆款车型
        $('#hotbannner .pagination').hide();
        setTimeout(function () {
            if ($('#hotbannner .swiper-slide').length > 1) {
                $('#hotbannner .pagination').show();
                var hotSwiper = new Swiper('#hotbannner .swiper-container', {
                    speed: 500,
                    pagination: '#hotbannner .pagination',
                    paginationClickable: true,
                    mode: 'horizontal',
                    loop: true,
                    autoplay: 3000,
                });
                $('#hotbannner').hover(function () {
                    $('#hotbannner .arrow-left,#hotbannner .arrow-right').show();
                }, function () {
                    $('#hotbannner .arrow-left,#hotbannner .arrow-right').hide();
                })

                $('#hotbannner .arrow-left').click(function () {
                    hotSwiper.swipePrev();
                })
                $('#hotbannner .arrow-right').click(function () {
                    hotSwiper.swipeNext();
                })
            }
        }, 1000)

        //中通广告
        setTimeout(function () {
            if ($('#middleswiper .swiper-slide').length > 1) {
                var middleswiper = new Swiper('#middleswiper .swiper-container', {
                    pagination: '#middleswiper .pagination',
                    paginationClickable: true,
                    mode: 'horizontal',
                    loop: true,
                    autoplay: 5000,
                });
            }
        }, 1000)
        //低通广告
        setTimeout(function () {
            if ($('#bottomswiper .swiper-slide').length > 1) {
                var bottomswiper = new Swiper('#bottomswiper .swiper-container', {
                    pagination: '#bottomswiper .pagination',
                    paginationClickable: true,
                    mode: 'horizontal',
                    loop: true,
                    autoplay: 5000,
                });
            }
        }, 1000)
        //合作机构
        setTimeout(function () {
            if ($("#footSwiper .swiper-slide").length > 1) {
                $('#footSwiper .pagination').show();
                var footSwiper = new Swiper('#footSwiper.swiper-container', {
                    pagination: '#footSwiper .pagination',
                    paginationClickable: true,
                    mode: 'horizontal',
                    loop: true,
                    autoplay: 5000,
                });
            }
        }, 1000)
    },
    //搜索车
    carSelectFun: function () {
        var source = 632;
        var txt = '请输入心仪品牌或车型...'
        $('.search_input').focus(function () {
             $(this).removeClass('col_grey9');
            if (this.value == txt) {
                this.value = "";
            }
        })
        $('.search_input').blur(function () {
            $(this).removeClass('col_grey9');
            if (this.value == '') {
                this.value = txt;
            } else {
                //$(this).removeClass('col_grey9');
            }
        })
        $('.search_input').selCar({
            SerialImgShow: false,
            //IsOpenSearch:false,
            IsBrandsBack: true,
            CallBacks: inputCallBack
        });
        function inputCallBack(obj) {
            if (obj.brandName && obj.carType) {
                window.open('/' + cityInfo.citySpell + '/s' + obj.carTypeId + '/?source=' + source, "_blank");
            } else {
                if (obj.brandId) {
                    window.open('/' + cityInfo.citySpell + '/m' + obj.brandId + '/?source=' + source, "_blank");
                }
            }
        }
        $('.search_input').val(txt).addClass('col_grey9');
        /********** 搜索按钮***********/
        function clickkey() {
            if ($('.search_input').val() != txt && $('.search_input').val() != '') {
                if (!$('.search_input').attr("data-id") && !$('.search_input').attr("data-brandid")) {
                    if ($(".sel-car-menu li").size() > 0) {
                        if ($(".sel-car-menu li").size() == 1 && $(".sel-car-menu li").html() == "未找到符合条件的车型！") {
                            $('.sel-car-menu').css({ 'display': 'block' })
                            console.log('0',$('.sel-car-menu').attr('style'))
                            setTimeout(function () {
                                $('.sel-car-menu').css({ 'display': 'block' })
                                console.log('100',$('.sel-car-menu').attr('style'))
                            }, 3);
                        } else {
                            $(".sel-car-menu li").eq(0).mouseover();
                            //setTimeout(function(){
                            $(".sel-car-menu li").eq(0).click();
                            //},800)
                            //console.log(1,txt)
                        }
                        //console.log(2,txt)
                    }
                    //console.log(3,txt)
                } else {
                    if ($('.search_input').attr('data-id')) {
                        window.open('/' + cityInfo.citySpell + '/s' + $('.search_input').attr('data-id') + '/?source=' + source, "_blank");
                    } else {
                        window.open('/' + cityInfo.citySpell + '/m' + $('.search_input').attr('data-brandid') + '/?source=' + source, "_blank");
                    }
                }
            } else {
                $(".search_input").addClass('col_red').css({ 'color': '#e9474d' });
                setTimeout(function () {
                    $(".search_input").animate(300, function () {
                        $(".search_input").removeClass('col_red').css({ 'color': '' });
                        if ($('.search_input').is(":focus")) {
                            $('.search_input').val('');
                        } else {
                            $('.search_input').val(txt);
                        }
                    })
                    //console.log(8,txt)
                }, 1000);
                //console.log(9,txt)
            }
        }
        $(".search_btn").click(function () {
            clickkey()
        });
        $('.search_input').keydown(function (e) {
            if (e.keyCode == 13) {
                clickkey()
                //console.log(10,txt)
            }
        })
        $('.search_input').keyup(function (e) {
            // if(e.keyCode!=13){
            //     $(this).attr("data-id",'');
            //     $(this).attr("data-brandid",'');
            // }
            if (e.keyCode == 13) {
                clickkey()
                //console.log(11,txt)
            }

        })
    },
    //最近成交:
    recentDeal: function () {
        var AllCount = 0;
        var _data = {
            cid: cityInfo.cityId,//0
            Pindex: 0,
            Psize: 3,
            SoldOrUnSold: 1
        }
        Store.getIndexCarList(_data).then(function (result) {
            if (result) {
                var res = result;
                var Data = res.Data.UcarList
                AllCount = res.Data.AllCount;
                if (AllCount >= 3) {
                    successData(Data)
                } else {
                    _data.cid = '0';
                    Store.getIndexCarList(_data).then(function (result) {
                        if (result) {
                            var Data = result.Data.UcarList;
                            successData(Data)
                        }
                    })
                }

            }
        })
        function successData(Data) {
            $('.recent_Deal_ul').html('');
            var tuiHtml = '';

            for (var i = 0; i < Data.length; i++) {
                var province = ''; var source = 890;
                if (Data[i].ReferPrice - Data[i].DisplayPrice > 0) {
                    var sheng = (Number(Data[i].ReferPrice) + Number(Data[i].ReferPrice) / 1.17 * 0.1) - Number(Data[i].DisplayPrice)
                    if (sheng > 0) {
                        province = '<span class="txt_s"><em class="sheng">省</em><em class="price">' + app.show_price_text(sheng) + '</em></span>'
                    }

                }
                tuiHtml += '<li class="item">' +
                    '<a target="_blank" href="/' + cityInfo.citySpell + '/u' + Data[i].UcarID + '/?source=' + source + '">' +
                    '<div class="product_img"><span class="deal_img"></span><img src="' + Data[i].FirstPicturePath + '" class="picImg"></div>' +
                    '<div class="Deal_car_info">' +
                    '<div class="car_Deal_name">' + Data[i].CarFullName + '</div>' +
                    '<div class="car_Deal_loan">首付 <em>' + app.show_price_text(Data[i].DownPaymentAmount) + '</em>  月供 <em>' + app.show_price_text(Data[i].MonthlyPayment) + '</em></div>' +
                    '<div class="car_Deal_save">' + province + '</div>' +
                    '</div>' +
                    '</a>' +
                    '</li>'
            }
            $('.recent_Deal_ul').append(tuiHtml)
        }
    },
    //<!--花小钱开好车  -->
    goodCar: function () {
        var indexNumber = 0, source = 635;
        function goodCarInfo(data, eqNumber) {
            var html = '';
            var dataLength = data.length;
            for (var i = 0; i <= 4; i++) {
                var csn = '';
                if (data[i]) {
                    //1:原厂质保;2:延长质保;5:原厂质保+免费过户;6:延长质保+免费过户);
                    if (data[i].WarrantyTypes == 1) {
                        csn = '<span class="icon_txt green"><em>原厂<br/>质保</em></span>';
                    } else if (data[i].WarrantyTypes == 2) {
                        csn = '<span class="icon_txt blue"><em>延长<br/>质保</em></span>';
                    } else if (data[i].WarrantyTypes == 5) {
                        csn = '<span class="icon_txt green"><em>原厂<br/>质保</em></span><span class="icon_txt yellow"><em>免费<br/>过户</em></span>';
                    } else if (data[i].WarrantyTypes == 6) {
                        csn = '<span class="icon_txt blue"><em>延长<br/>质保</em></span><span class="icon_txt yellow"><em>免费<br/>过户</em></span>';
                    } else {
                        csn = '';
                    }
                    var SavePrice = '';
                    if (data[i].SavePrice < 1 && data[i].SavePrice > 0) {
                        SavePrice = '<span class="txt_s"><em class="sheng">省</em><em class="price">' + Number(data[i].SavePrice * 10000).toFixed(0) + '元</em></span>';
                    } else if (data[i].SavePrice > 1) {
                        SavePrice = '<span class="txt_s"><em class="sheng">省</em><em class="price">' + Number(data[i].SavePrice).toFixed(2) + '万</em></span>';
                    } else if (data[i].SavePrice == 0) {
                        var sheng = (Number(data[i].ReferPrice) + Number(data[i].ReferPrice) / 1.17 * 0.1) - Number(data[i].DisplayPrice);
                        if (sheng > 0) {
                            SavePrice = '<span class="txt_s"><em class="sheng">省</em><em class="price">' + app.show_price_text(sheng) + '</em></span>';
                        }
                    } else {
                        SavePrice = '';
                    }
                    ////console.log(data[i].SavePrice)
                    html += '<li>' +
                        '<a target="_blank" href="/' + cityInfo.citySpell + '/u' + data[i].UcarID + '/?source=' + source + '">' +
                        '<div class="product_img"><div class="all_mark">' + csn + '</div>' +
                        '<div class="img_box"><img src="' + data[i].FirstPicturePath.split("|")[0] + '" class="picImg"></div>' +
                        '<div class="bg_red">' +
                        '<span class="txt_info">查看详情</span>' +
                        '</div>' +
                        '</div>' +
                        '<div class="good_car_info">' +
                        '<div class="good_car_name">' + data[i].CarFullName + '</div>' +
                        '<div class="good_car_loan">首付 <em>' + app.show_price_text(data[i].DownPaymentAmount) + '</em>  月供 <em>' + app.show_price_text(data[i].MonthlyPayment) + '</em></div>' +
                        '<div class="good_car_save">' + SavePrice + '</div>' +
                        '</div>' +
                        '</a>' +
                        '</li>'
                }
            }
            if (dataLength == 1) {
                html += '<li class="item no_car_good" style="width:784px"></li>'
            } else if (dataLength == 2) {
                html += '<li class="item no_car_good" style="width:520px;"></li>'
            } else if (dataLength == 3) {
                html += '<li class="item no_car_good" style="width:256px"></li>'
            }
            $('#goodcar .swiper-wrapper .swiper-slide').eq(eqNumber).append('<ul class="good_car_ul">' + html + '</ul>')
            //动效
            $('.product_img').on('mouseover', function () {
                $(this).find('.bg_red').stop().animate({ 'top': 0 }, 400, 'swing');
            }).on('mouseout', function () {
                $(this).find('.bg_red').stop().animate({ 'top': '100%' }, 400, 'swing');
            });
        }
        Store.GetSmallUcarlist(cityInfo.cityId).then(function (result) {
            if (result) {
                if (result.Data['0|2'].length != 0) {
                    goodCarInfo(result.Data['0|2'], 0);
                } else {
                    $('#goodcar .swiper-wrapper .swiper-slide').eq(0).append('<div class="nocarimg"><div class="nocarimg_info"><p>当前城市:<span>' + cityInfo.cityName + '</span></p><p class="padt10">此条件下没有棒棒的二手车源</p><p>主人去<a href="/' + cityInfo.citySpell + '/list/?source=' + source + '"><span>逛逛更多二手好车</span></a>吧></p><p></div> </div>');
                }

                if (result.Data['2|3'].length != 0) {
                    goodCarInfo(result.Data['2|3'], 1);
                } else {
                    $('#goodcar .swiper-wrapper .swiper-slide').eq(1).append('<div class="nocarimg"><div class="nocarimg_info"><p>当前城市:<span>' + cityInfo.cityName + '</span></p><p class="padt10">此条件下没有棒棒的二手车源</p><p>主人去<a href="/' + cityInfo.citySpell + '/list/?source=' + source + '"><span>逛逛更多二手好车</span></a>吧></p><p></div> </div>');
                }

                if (result.Data['3|5'].length != 0) {
                    goodCarInfo(result.Data['3|5'], 2);
                } else {
                    $('#goodcar .swiper-wrapper .swiper-slide').eq(2).append('<div class="nocarimg"><div class="nocarimg_info"><p>当前城市:<span>' + cityInfo.cityName + '</span></p><p class="padt10">此条件下没有棒棒的二手车源</p><p>主人去<a href="/' + cityInfo.citySpell + '/list/?source=' + source + '"><span>逛逛更多二手好车</span></a>吧></p><p></div> </div>');
                }

                if (result.Data['5|10'].length != 0) {
                    goodCarInfo(result.Data['5|10'], 3);
                } else {
                    $('#goodcar .swiper-wrapper .swiper-slide').eq(3).append('<div class="nocarimg"><div class="nocarimg_info"><p>当前城市:<span>' + cityInfo.cityName + '</span></p><p class="padt10">此条件下没有棒棒的二手车源</p><p>主人去<a href="/' + cityInfo.citySpell + '/list/?source=' + source + '"><span>逛逛更多二手好车</span></a>吧></p><p></div> </div>');
                }

                if (result.Data['10|99999'].length != 0) {
                    goodCarInfo(result.Data['10|99999'], 4);
                } else {
                    $('#goodcar .swiper-wrapper .swiper-slide').eq(4).append('<div class="nocarimg"><div class="nocarimg_info"><p>当前城市:<span>' + cityInfo.cityName + '</span></p><p class="padt10">此条件下没有棒棒的二手车源</p><p>主人去<a href="/' + cityInfo.citySpell + '/list/?source=' + source + '"><span>逛逛更多二手好车</span></a>吧></p><p></div> </div>');
                }
                if (result.Data['0|2'].length != 0) {
                    indexNumber = 0;
                } else if (result.Data['2|3'].length != 0) {
                    indexNumber = 1;
                } else if (result.Data['3|5'].length != 0) {
                    indexNumber = 2;
                } else if (result.Data['5|10'].length != 0) {
                    indexNumber = 3;
                } else if (result.Data['10|99999'].length != 0) {
                    indexNumber = 4;
                }
                //花小钱开好车：
                setTimeout(function () {
                    $(".tabs .active").removeClass('active')
                    $(".tabs a").eq(indexNumber).addClass('active')
                    var tabsSwiper = new Swiper('#goodcar .swiper-container', {
                        speed: 500,
                        initialSlide: indexNumber,
                        onSlideChangeStart: function () {
                            $(".tabs .active").removeClass('active')
                            $(".tabs a").eq(tabsSwiper.activeIndex).addClass('active')
                        }
                    })
                    $(".tabs a").on('mousemove', function (e) {
                        e.preventDefault()
                        $(".tabs .active").removeClass('active')
                        $(this).addClass('active')
                        tabsSwiper.swipeTo($(this).index())
                    })
                }, 1000)


                // $(".tabs a").click(function(e){
                //     e.preventDefault()
                // })
                // var mySwiper = new Swiper('#swiperGoodCar', {
                //     pagination : '#swiperGoodCar .swiper-pagination',
                //     paginationClickable: true,
                //     initialSlide:indexNumber,
                //     autoHeight: true,
                //     paginationBulletRender: function (index, className) {
                //         if(index==0){
                //             return '<span class="' + className + '">' + '2万以下</span>';
                //         }else if(index==1){
                //             return '<span class="' + className + '">' + '2-3万</span>';
                //         }else if(index==2){
                //             return '<span class="' + className + '">' + '3-5万</span>';
                //         }else if(index==3){
                //             return '<span class="' + className + '">' + '5-10万</span>';
                //         }else if(index==4){
                //             return '<span class="' + className + '">' + '10万以上</span>';
                //         }
                //     }
                // });
                //var touchsrartX='',touchendX='';
                // $('.swiper-pagination_box .swiper-pagination').on('touchstart',function(event){
                //     //console.log(event.originalEvent.changedTouches[0].clientX)
                //     console.log('touchstart',event.changedTouches[0].clientX)
                //     touchsrartX=event.changedTouches[0].clientX;
                // })
                // $('.swiper-pagination_box .swiper-pagination').on('touchend',function(event){
                //     //console.log(event.originalEvent.changedTouches[0].clientX)
                //     console.log('touchend',event.changedTouches[0].clientX)
                //     touchendX = event.changedTouches[0].clientX;
                // })
                // $('.swiper-pagination_box .swiper-pagination').on('touchmove',function(event){
                //     console.log('touchmove',event.changedTouches[0].clientX)
                //     if (touchsrartX-touchendX>10){
                //         console.log('ss')
                //         $('.swiper-pagination_box .swiper-pagination').css({'transform': 'translate3d(-40px, 0px, 0px)'})
                //     }else {
                //         $('.swiper-pagination_box .swiper-pagination').css({'transform': 'translate3d(0px, 0px, 0px)'})
                //     }
                // })
            }

        })

    },
}