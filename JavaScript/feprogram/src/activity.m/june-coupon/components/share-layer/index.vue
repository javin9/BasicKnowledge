<template>
  <div class="component-share-layer" transition="opacity" v-show="show" @click="hideShareLayer"></div>
  <mask></mask>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .component-share-layer{
    background: url(./share.png) no-repeat px2rem(83) px2rem(93);
    position: fixed;
    left:0;
    top:0;
    bottom:0;
    z-index: 10000;
    width: 100%;
    background-size: px2rem(620);
  }
</style>

<script>
  import mask from 'libs/mask'
  export default {
    props:[],
    data () {
      return {
        show: false
      }
    },

    events:{
      showShareLayer(){
        this.show = true
        this.$broadcast('showMask')
      }
    },

    methods: {
      hideShareLayer(){
        this.show = false
        this.$broadcast('hideMask')
      }
    },

    components: {
      mask
  	}
  }
</script>