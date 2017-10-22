<template>
  <div class="mask" v-if="show" @click="hideCouponModal" transition="opacity" ></div>
  <div class="coupon-modal" v-if="show" transition="opacity" >
    <div class="value">{{options.cardValue}}</div>
    <div class="name">{{options.cardName}}</div>
    <p class="text">邀请好友下单，你和TA均可获得{{options.cardValue}}元{{options.cardName}}</p>
    <a href="javascript:void(0)" class="close" @click="hideCouponModal"></a>
    <a :href="options.url" class="share"></a>
    <a :href="options.rule" class="rule"></a>
  </div>
</template>

<style scoped>
  @import 'sassHelper/mixin';

  .opacity-transition {
    opacity:1;
    transition: opacity .3s ease;
  }
  .opacity-enter, .opacity-leave {
    opacity:0;
  }

  .mask{
    position: fixed;
    background: rgba(0,0,0,.4);
    left:0;
    top:0;
    width: 100%;
    height:100%;
  }

  .coupon-modal{
    width: px2rem(640);
    height:px2rem(790);
    background: url(./images/modal.png) no-repeat left top;
    background-size: contain;
    transform:translate(-50%,-50%);
    position: fixed;
    left:50%;
    top:50%;

    .value{
      font-size:px2rem(50);
      color:#fff;
      position: absolute;
      width: px2rem(160);
      text-align: center;
      top:px2rem(205);
      left:px2rem(75);
    }

    .name{
      font-size:px2rem(20);
      color:#fff;
      width: px2rem(180);
      text-align: center;
      position: absolute;
      left:px2rem(60);
      top:px2rem(265);
    }

    .text{
      @include fsize(30);
      color:#666;
      position: absolute;
      width: px2rem(540);
      padding:0 px2rem(40);
      top: px2rem(390);
      left:px2rem(20);
      line-height: 1.5;
    }

    .close{
      display: block;
      position: absolute;
      width: px2rem(30);
      height:px2rem(30);
      right:px2rem(26);
      top:px2rem(40);
    }

    .share{
      display: block;
      position: absolute;
      left:50%;
      top:px2rem(530);
      width: px2rem(500);
      height:px2rem(100);
      transform:translateX(-50%);
    }

    .rule{
      display: block;
      position: absolute;
      width: px2rem(140);
      height:px2rem(45);
      left:50%;
      bottom:px2rem(90);
      transform:translateX(-50%);
    }
  }
</style>

<script>
export default {
  props:['options'],
  data () {
    return {
      show: false
    }
  },

  events:{
    showCouponModal(){
      $('body').bind('touchmove', e => e.preventDefault())
      this.show = true
    },
    hideCouponModal(){
      $('body').unbind('touchmove')
      this.show = false
    }
  },

  methods:{
    hideCouponModal(){
      this.$emit('hideCouponModal')
    }
  }
}
</script>