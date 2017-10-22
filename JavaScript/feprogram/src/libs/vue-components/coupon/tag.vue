<!-- 
  分享弹层组件
  @example: 
    <coupon-tag href="xxx"></coupon-tag>

  @param {String} href 链接
-->

<template>
  <a :href="href" class="share-card"></a>
</template>

<style scoped>
  @import 'sassHelper/mixin';

  .share-card{
    width:px2rem(135);
    height:px2rem(149);
    background:url(./images/share.png) no-repeat center center;
    background-size: contain;
    position: fixed;
    right:px2rem(20);
    bottom:px2rem(100);
  }
</style>

<script>
export default {
  props:['href'],
  data () {
    return {
    }
  }
}
</script>