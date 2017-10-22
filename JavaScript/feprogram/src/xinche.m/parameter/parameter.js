import '../main.scss';
import './parameter.scss';
import Vue from 'vue';
import down from '../components/appDown.vue';

tools.appDown(true);

new Vue({
  el: '#param',
  ready () {
    $('.param-nav .left').removeClass('hide');
  },
  data () {
    return {
      isShowClassify:false,
    }
  },
  // components: {
  //   down
  // },
  methods: {
  //分类icon事件
    showClassify (e) {
      e.stopPropagation();
      this.isShowClassify = !this.isShowClassify;
    },//点击除分类icon的事件
    setClassify () {
      this.isShowClassify = false;
    },
    //滚动模拟
    myscrollTop (scrollTo, time) {
      var scrollFrom = parseInt(document.body.scrollTop),
          i = 0,
          runEvery = 5; // run every 5ms

      scrollTo = parseInt(scrollTo);
      time /= runEvery;

      var interval = setInterval(function () {
          i++;

          document.body.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;

          if (i >= time) {
              clearInterval(interval);
          }
      }, runEvery);
    },
    onClickToScroll(id){
      let _top = $('#'+id).offset().top;
      this.myscrollTop(_top, 400);
    }
  }
});