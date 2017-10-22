<template>
    <header class="component-car-selector-header">
      <div class="component-car-selector-header-close" @click="back"></div>
      <div class="component-car-selector-header-title"><slot></slot></div>
    </header>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';

.component-car-selector-header{
  @include borderBottom;
  @include fsize(32);
  background: #fff;
  height: px2rem(88);
  position: relative;
  z-index: 1;
  color: $dark-color;

  &-close{
    width: px2rem(40);
    height: px2rem(40);
    display: block;
    position: relative;
    position: absolute;
    left:px2rem(20);
    bottom:0;
    top:0;
    margin: auto;
    background: url(./arrow.png) no-repeat center center;
    background-size: px2rem(16) px2rem(30);
  }

  &-title{
    height: px2rem(88);
    line-height: px2rem(88);
    position: absolute;
    left:px2rem(80);
    right:px2rem(80);
    text-align: center;
    color:#000;
  }
}
</style>

<script>
export default {
  props:{},
  data () {
    return {
    }
  },

  methods:{
    back(){
      this.$emit('back')
    }
  },

  components:{
  }
}
</script>