<template>
  <div class="component-top-promotion" v-show="show">
    <a :href="link"><img :src="img" /></a>
    <a href="javascript:void(0)" class="close" @click="close"></a>
  </div>
  <mask @click="close"></mask>
</template>

<style scoped>
  @import 'sassHelper/mixin';

  .component-top-promotion{
    position: fixed;
    left:50%;
    top:50%;
    transform:translateX(-50%) translateY(-50%);
    margin-top: px2rem(-70);
    width:px2rem(590);
    height:px2rem(790);
    z-index: 99999;

    img{
      width:px2rem(590);
      height:px2rem(790);
    }

    /*background: url(./placeholder.png) no-repeat center center;*/
    /*background-size: px2rem(239) px2rem(65);*/

    .close{
      background: url(./close.png) no-repeat center center;
      display: block;
      width: px2rem(72);
      height:px2rem(72);
      position: absolute;
      bottom:px2rem(-150);
      left:50%;
      transform:translateX(-50%);
      background-size: contain;
    }
  }
</style>

<script>
import Mask from 'libs/mask'

export default {
  props:{
    link: {
      type: String,
      default: 'javascript:void(0)'
    },
    img: {
      type: String,
      default: ''
    },
    cookie: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      show: false
    }
  },

  events:{
    showTopPromotion(){
      const showMask = () => {
        this.$broadcast('showMask')
        this.show = true
      }
      if(this.img){
        if(!this.cookie){
          showMask()
        }else if(!tools.getCookie(this.cookie)){
          tools.setCookie(this.cookie, true)
          showMask()
        }
      }
    },

    hideTopPromotion(){
      this.$broadcast('hideMask')
      this.show = false
    }
  },

  methods:{
    close(){
      this.$dispatch('hideTopPromotion')
    }
  },

  created(){
  },

  components: {
    Mask
  }
}
</script>