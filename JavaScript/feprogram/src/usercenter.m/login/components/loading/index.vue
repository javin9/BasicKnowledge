<template>
  <div class="component-loading"></div>
  <div class="component-loading-close" @click="close"></div>
  <mask></mask>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .component-loading{
    width: px2rem(240);
    height: px2rem(240);
    background: url(./loading.gif) no-repeat left top;
    background-size: contain;
    position: fixed;
    left:50%;
    top:50%;
    transform:translate(-50%,-50%);
    z-index: 10000;
  }

  .component-loading-close{
    @include size(px2rem(50));
    background: url(./close.png) no-repeat left top;
    background-size: contain;
    position: fixed;
    z-index: 10000;
    right:px2rem(30);
    top:px2rem(30);
  }
</style>

<script>
  import Mask from 'libs/mask'
  export default {
    data () {
      return {
      }
    },

    computed:{
    },
  
    methods: {
      close(){
        this.$emit('close')
      }
    },

    ready(){
      this.$broadcast('showMask')
    },

    components: {
      Mask
    }
  }
</script>