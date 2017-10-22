<template>
  <!-- 底部链接 -->
  <div class="buttons-wrapper">
    <a :href="link1" :target="linkTarget" class="button">优惠购买商业险</a>
    <a :href="link2" :target="linkTarget" class="button button-active">查看贷款产品</a>
  </div>
</template>

<style scoped>
@import '../vars';
@import '../mixin';

.buttons-wrapper{
  @include equal-parts(flex,a);
  padding:px2rem(30) 0;
  margin-bottom: px2rem(40);

  a{
    @include fsize(30);
    line-height: 1;
    padding:px2rem(28) px2rem(40);
    border-radius:px2rem(8);
    text-align: center;
    border-width:1px;
    border-style:solid;
    @include theme(border-color, main);
    @include theme(color, main);
    /*width: 40%;*/
    text-align: center;
    margin-left: px2rem(30);

    &.button-active{
      @include theme(background-color, main);
      color: map-get($mfont, white);
      margin-right: px2rem(30);
    }
  }
}
</style>

<script>
import Header from '../components/header.vue'
import citySelect from 'libs/citySelect'
import carSelect from 'libs/carSelect'
import carThirdLevel from 'libs/carSelect/carThirdLevel'

export default {
  props:{
      linkTarget:{
          type:String,
          default:'_self'
      }
  },
  data () {
    return {
      link1: initData.link1,
      link2:tools.getCookie('YiXinAppInfo')?"javascript:tools.jsNativeBridge('goList');":initData.link2
    }
  }
}
</script>