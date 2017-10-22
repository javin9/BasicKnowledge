<template>
	<section class="component-alert" v-if="show">
    <p>{{{msg}}}</p>
    <footer @click="close">我知道了</footer>
	</section>
  <mask></mask>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .component-alert{
    @include fsize(30);
    position: fixed;
    left:50%;
    top:50%;
    transform:translateX(-50%) translateY(-50%);
    z-index: 99999;
    background: #fff;
    width: px2rem(620);
    color:$dark-color;
    box-sizing:border-box;
    border-radius:px2rem(15);

    p{
      width: px2rem(560);
      text-align: left;
      margin:px2rem(68) auto px2rem(58);
    }

    footer{
      @include borderTop;
      text-align: center;
      color:#5FC3E8;
      line-height: px2rem(98);
    }
  }
</style>

<script>
  import Mask from 'libs/mask'
  export default {
    data () {
      return {
        msg: '',
        show: false
      }
    },

    methods:{
      close(){
        this.$broadcast('hideMask')
        this.show = false
      }
    },

    events: {
      showAlert(msg){
        this.$broadcast('showMask')
        this.msg = msg
        this.show = true
      }
    },

    components: {
      Mask
    }
  }
</script>