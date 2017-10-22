import './list.scss';
import Vue from 'vue';
import 'libs/swiper';
import Share from 'libs/share/index';

new Vue({
  el: '#list',
  ready (){
    this.plugInit();
  },
  components: {
    Share
  },
  data () {
    var _imgUrl = $('#wx_pic img').attr('src');
    return {
      //分享数据
      shareOptions: {
        desc: '易鑫车贷，一站式互联网汽车金融平台，尽享优惠快捷！（分享来自@易鑫车贷平台）',
        image: _imgUrl
      },
      swiperItems:[
        {id:0, name:'推荐'},
        {id:1, name:'汽车贷款'},
        {id:2, name:'二手车贷款'},
        {id:3, name:'车险资讯'},
        {id:4, name:'其他'},
      ],
      isShowNav: false,
    }
  },
  methods: {
    goBack (){
      history.go(-1);
      return false;
    },
    // 插件初始化
    plugInit (){
      let self = this;
      let selSwiper = new Swiper('#selSwiper', {
          initialSlide: sliderId == 4?sliderId:0,
          slidesPerView: 4.5,
          observer: true,
          observeParents: true,
          // offsetPxAfter: 30
      });

      // 手机号通道
      tools.telChannel({
          'CityId': CityId,
          'CityText': CityName,
          'id': 'userTel',//初始化DOM结构id
          'telId': 'indexTel',//手机号输入框id
          'PageType': 9,
          'isShowP1': false,
      });

      //分享按钮
      $("#shareNavTip").on('click', function (e) {
          self.$nextTick(() => self.$broadcast('showShare'));
      });

      // 导航menu
      var $navMenu = $('#navTips');
      $('#tools-nav').on('click',function (e) {
        $navMenu.toggleClass('hide');
      });

      $navMenu.on('click', function(e) {
        $navMenu.addClass('hide');
      });
      $navMenu.on('touchmove', function(e) {
        $navMenu.bind('touchend', function() {
          $navMenu.addClass('hide');
          $navMenu.unbind('touchend');
        });
      });
    }
  }
})