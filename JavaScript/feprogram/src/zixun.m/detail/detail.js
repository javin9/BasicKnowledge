import './detail.scss';
import Vue from 'vue';
import Share from 'libs/share/index';

new Vue({
  el: '#detail',
  created (){
    this.isShowNav = false;
  },
  ready (){
    this.plugInit();
  },
  components: {
    Share
  },
  data () {
    var _imgUrl = $('#wx_pic img').attr('src');
    return{
      //分享数据
      shareOptions: {
        desc: '易鑫车贷，一站式互联网汽车金融平台，尽享优惠快捷！（分享来自@易鑫车贷平台）',
        image: _imgUrl
      },
      isCurrent1: tab_1 == 1?true:false,
      isCurrent2: tab_1 == 1 || tab_2 == 0 ?false:true,

      isShowNav: false,
    }
  },
  methods: {
    goBack () {
      history.go(-1);
      return false;
    },
    plugInit () {
      let self = this;
       // 手机号通道
      tools.telChannel({
          'CityId': CityId,
          'CityText': CityName,
          'id': 'userTel',//初始化DOM结构id
          'telId': 'indexTel',//手机号输入框id
          'PageType': 10,
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
    },
    tabChange(id) {
      switch (id) {
        case 1:
          this.isCurrent1 = true;
          this.isCurrent2 = false;
          break;
        case 2: 
          this.isCurrent1 = false;
          this.isCurrent2 = true;
          break;
      }
    }
  }
})