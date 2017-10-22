'user strict';
import './index.scss';
import 'libs/jquery.nivo.slider';
import Swiper from 'libs/swiper/2.0.js';
import 'libs/carSelect/selCar.pc.js';
import 'libs/home_page_ad'
$(function(){
  indexObj.init();
});

var indexObj = {
  init : function init() {
    this.headerSlider();
    // this.HoverAnimate($('.qijian'), 'qijianHover');
    this.HoverAnimate($('.huiEvent'), 'btnEvent', 'animate'); 
    this.chaoZhiSwiper();

    //选城市
    window.selCityCallback = function(obj) {
      window.location.href = '/' +obj.citySpell;
    };

    // 合作机构
    if($("#footSwiper .swiper-slide").length>1){
        $('#footSwiper .pagination').show();
        var mySwiper = new Swiper('#footSwiper.swiper-container',{
            pagination: '#footSwiper .pagination',
            paginationClickable: true,
            mode: 'horizontal',
            loop : true,
            autoplay : 5000,
        });
    }
  },
  // 顶部轮播图
  headerSlider () {
    $("#sliderBox .slider").nivoSlider({
      effect:"fade", //slideInLeft,slideInRight,sliceDown,sliceDownLeft,sliceUp,sliceUpLeft,sliceUpDown,sliceUpDownLeft,fold,fade,random,boxRandom,boxRain,boxRainReverse,boxRainGrow,boxRainGrowReverse
      manualAdvance:false,   // 是否手动播放(false为自动播放幻灯片) 
      directionNav:false,  //是否显示图片切换按钮(上/下页) 
      controlNav:true,   // 显示序列导航 
      pauseOnHover: true    // 当鼠标滑向图片时，停止切换
    });
  },
  //hover动画
  HoverAnimate ($parent, child, type) {
    type = type?type:'hover';

    $parent.on('mouseenter', '.'+child, (e) => {
      let $that = $(e.target),
          $thisDom = $that.hasClass(child)? $that:$that.parents('.'+child);
      if(type == 'hover'){
        $thisDom.find('.popupEvent').removeClass('hide');
      }else{
        $thisDom.find('.btn').animate({'bottom': 0}, {queue: false, speed:300});
      }
    }).on('mouseleave', '.'+child, (e) => {
      let $that = $(e.target),
          $thisDom = $that.hasClass(child)? $that:$that.parents('.'+child);
      if(type == 'hover'){
        $thisDom.find('.popupEvent').addClass('hide');
      }else{
        $thisDom.find('.btn').animate({'bottom': '-46px'}, {queue: false, speed:300});
      }
    })
  },//超值钜惠swiper
  chaoZhiSwiper () {
    if($('#swiper .swiper-slide').length > 1) {
      var mySwiper = new Swiper('#swiper',{
        loop:true,
        autoplay : 3000,
        grabCursor: true,
        paginationClickable: true,
        pagination : '#swiper .swiper-pagination'
      });
      $('.arrow-left').on('click', (e) => {
        e.preventDefault();
        mySwiper.swipePrev();
      });
      $('#swiper').parent().hover((e) => {
        $(e.target).parents('.swiperParent').addClass("hover");
      },(e) => {
        $(e.target).parents('.swiperParent').removeClass("hover");
      });
      $('.arrow-right').on('click', (e) => {
        e.preventDefault();
        mySwiper.swipeNext();
      });
    }
  }
}