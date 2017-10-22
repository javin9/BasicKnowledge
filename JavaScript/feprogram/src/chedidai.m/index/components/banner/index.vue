<template>
  <div class="swiper-container" slot="banner">
    <slot v-ref:child></slot>
    <div class="swiper-pagination"></div>
  </div>
</template>

<style>
  @import 'sassHelper/mixin';
  .swiper-pagination-bullet{
    [data-dpr="1"] & {
      width: 6px !important;
      height: 6px !important;
    }
    [data-dpr="2"] & {
      width: 10px !important;
      height: 10px !important;
    }
    [data-dpr="3"] & {
      width: 15px !important;
      height: 15px !important;
    }
  }
  .swiper-slide{
    display: block;

    img{
      width: px2rem(750);
      display: block;
    }
  }
  .swiper-pagination-bullet-active{
    background: red !important;
  }
</style>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  img{
    width:px2rem(750);
    height:px2rem(320);
  }
</style>

<script>
  import 'libs/swiper'
  export default {
    data () {
      return {
        bannerCount: 0
      }
    },

    ready(){
      this.bannerCount = this.$el.querySelectorAll('.swiper-slide').length
      if(this.bannerCount > 1){
        new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            loop : true,
            autoplay : 5000,
        })
      }
    }
  }
</script>