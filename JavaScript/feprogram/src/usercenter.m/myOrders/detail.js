import './order.scss'
import events from './libs/orderEvents'
import Vue from 'vue'
import CouponTag from 'libs/vue-components/coupon/tag'

events.init()

new Vue({
  el: document.body,
  components:{
      CouponTag
  }
})