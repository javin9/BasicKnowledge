<template>
  <div class="component-loading loading-white"></div>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';

  .component-loading{
    position: absolute;
    z-index: 400;
    top:px2rem(88);
    left:0;
    bottom:0;
    width: 100%;
    height:auto;
    background-color: #fff;
    background-position: center center;
  }  
</style>

<script>
export default {
  props:{
  },
  data () {
    return {
    }
  },

  methods:{
  },

  components:{
  }
}
</script>