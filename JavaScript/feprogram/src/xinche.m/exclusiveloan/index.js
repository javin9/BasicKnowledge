import '../main.scss';
import './index.scss';
import Vue from 'vue';
import CarSelector from 'libs/vue-components/car-selector'
import 'libs/swiper';

const vm = new Vue({
  el: 'body',
  methods:{
    selectCarCallback(data){
      const url = `/www/${data.series.spell}/?source=${window.source}`
      window.location.href = url
    }
  },
  components: {
    CarSelector
  }
})

$(function(){
  var recentSwiper = new Swiper('#recommend', {
    pagination: '#recommendPagination',
    loop:true
  });

  /* ================== 选车控件 start ================== */

  //选车型
  $('#selectCar').on('click', function (e) {
      e.preventDefault()
      vm.$broadcast('showCarSelector')
  });
  /* ================== 选车控件 end ================== */
})