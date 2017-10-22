import '../css/ershouche.scss';
import './index.scss';
import 'libs/swiper';
import citySelect from 'libs/citySelect';
import carSelect from 'libs/carSelect';
import 'libs/tools.m.js';

//声明变量
import app from '../script/app';
import XTK from '../script/XTK';
import Store from '../script/Store';
import loginStore from '../script/LoginStore';
import carch from 'libs/carSelect/ershouche/index.js';
import carsearch from 'libs/carSelect/carSearch';
Store.ershoucheAPI = ershoucheUrl;
Store.xincheAPI = xincheUrl;
/**************************************************************************/
import Vue from 'vue';
import VueResource from 'vue-resource'
import appvue from './list.vue'
import easyask from './easyask.vue'
import selcettemplate from '../components/selcettemplate.vue';
import Navbar from 'libs/vue-components/navbar'

import CitySelect from 'libs/vue-components/city-select'
Vue.use(VueResource)
    /*首页搜索source是1069   最近成交source是1070*/
var templatelist = new Vue({
    el: '#template',
    ready() {
        this.init();
        this.careelectfun();

    },
    data: {
        banner: '1234565432',
        bannername: '00000',
        codehtml: '',
    },
    components: {
        appvue: appvue,
        easyask: easyask,
    },
    template: `<appvue v-bind:list-data="listData"></appvue><easyask v-bind:list-data="listData"></easyask>`,
    methods: {
        swip: function() {
            if ($("#swiperTopBanner .swiper-slide").length > 1) {
                var mySwiper = new Swiper('#swiperTopBanner', {
                    autoplay: 5000, //可选选项，自动滑动
                    loop: true,
                    pagination: '#swiperTopBanner .swiper-pagination',
                    //new add
                    autoplayDisableOnInteraction: false,
                    observer: true,
                    observeParents: true,
                    onSlideChangeEnd: function(swiper) {
                        swiper.update();
                    },
                    //setWrapperSize:true,
                    onInit: function(swiper) {
                        if (swiper.slides.length - 2 < 2) {
                            swiper.stopAutoplay();
                            $('#swiperTopBanner .swiper-pagination').hide();
                        } else {
                            $('#swiperTopBanner .swiper-pagination').show();
                        }
                    }
                })
                $('#swiperTopBanner .swiper-pagination').removeClass('hide')
            }
            //最近申请
            setTimeout(function() {
                var mySwiper = new Swiper('#swiperRecent', {
                    autoplay: 5000, //可选选项，自动滑动
                    loop: true,
                    pagination: '#swiperRecent .swiper-pagination',
                    direction: 'vertical',
                    noSwiping: true,
                    slidesPerView: 1,
                    spaceBetween: 10,
                    simulateTouch: false,
                    observer: true, //修改swiper自己或子元素时，自动初始化swiper
                    observeParents: true, //修改swiper的父元素时，自动初始化swiper
                })
            }, 1000)

        },
        //条件选车
        careelectfun: function() {
            $('#choosecar').on('click', function() {
                carch.carSelect({
                    showSerialImg: false,
                    onlyOnSale: false,
                    showLevel: 2,
                    showAllBrand: true,
                    showSearch: true,
                    hide: false,
                    type: "ershouche"
                }, function(result) {
                    let source = 707
                    if (result.allBrand) {
                        location.href = ershoucheUrl + cityInfo.spell + '/list/?source=' + source
                    } else {
                        if (result.hotCar) {
                            location.href = ershoucheUrl + cityInfo.spell + '/s' + result.hotCar.CarSerialID + '/?source=' + source
                        } else if (result.searchCar) {
                            if (result.searchCar.type == "主品牌") {
                                location.href = ershoucheUrl + cityInfo.spell + '/m' + result.masterBrand.id + '/?source=' + source
                            } else if (result.searchCar.type == "子品牌" || result.searchCar.type == "品牌") {
                                location.href = ershoucheUrl + cityInfo.spell + '/s' + result.searchCar.id + '/?source=' + source
                            }
                        } else if (result.masterBrand) {
                            if (result.brand) {
                                location.href = ershoucheUrl + cityInfo.spell + '/s' + result.brand.id + '/?source=' + source;
                            } else {
                                location.href = ershoucheUrl + cityInfo.spell + '/m' + result.masterBrand.id + '/?source=' + source;
                            }
                        } else {
                            location.href = ershoucheUrl + cityInfo.spell + '/m' + result.masterBrand.id + '/?source=' + source;
                        }
                    }
                    /*location.href =location.href*/
                });
            })
        },
        init: function() {
            let _self = this
            _self.swip();
        },
    }
})


var vmapp = new Vue({
    el: '#app',
    ready() {
        this.locationsel(); //城市-点击-城市定位
        this.loadCityTips();

        $.ajax({
            url: ershoucheUrl + 'Home/UserFavoritePartialView',
            type: 'post',
            data: { citySpell: cityInfo.spell },
            /* dataType:'html',*/
            success: res => {
                this.codehtml = res
            },
        })

    },
    data: {
        codehtml: '',
    },
    methods: {
        ajaxf() {

        },
        selectedHanlder(obj) {
            location.href = '/' + obj.spell + '/'
        },
        loadCityTips: function() {
            var cityTipsCookie = tools.getCookie("cityTips")
            if (cityTipsCookie && cityTipsCookie == 1) {
                $('.tips_text').addClass('hide');
                //已经提示过
            } else {
                $('.tips_text').removeClass('hide');
                setTimeout(() => {
                    $('.tips_text').addClass('hide');
                }, 3000)
                if (document.domain.search(".daikuan.com") != -1)
                    tools.setCookie("cityTips", 1, "", ".daikuan.com");
                else
                    tools.setCookie("cityTips", 1, "", document.domain);
            }
        },
        //定位
        locationsel: function() {
            //标签点击事件
            $('#selectCity').on('click', function() {
                    vmapp.$broadcast('showCitySelect');
                })
                //
                //搜索
            $('#erssearch').on('click', function(e) {
                var source = 1069
                carsearch.search({ hide: true, type: "ershouche" }, function(result) {
                    if (result.hotCar) {
                        setTimeout(function() {
                            location.href = '/' + cityInfo.spell + '/s' + result.hotCar.CarSerialID + '/?source=' + source;
                        }, 100);

                    } else if (result.searchCar) {
                        setTimeout(function() {
                            location.href = '/' + cityInfo.spell + '/s' + result.searchCar.id + '/?source=' + source;
                        }, 100);
                    } else {
                        setTimeout(function() {
                            location.href = '/' + cityInfo.spell + '/s' + result.brand.id + '/?source=' + source;
                        }, 100);

                    }

                });
            })
        },
        init: function() {
            let _self = this
            _self.location();
        },
    },
    components: {
        Navbar,
        CitySelect
    }
})

Echo.init({
    offset: 100,
    throttle: 0
});
//tools.appDown()//app下载