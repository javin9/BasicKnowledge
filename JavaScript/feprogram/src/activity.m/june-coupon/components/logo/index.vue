<template>
  <div class="component-logo"></div>
</template>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .component-logo{
    width: px2rem(128);
    height: px2rem(34);
    position: absolute;
    background: url(./logo.png) no-repeat center center;
    background-size: contain;
    left: px2rem(20);
    top: px2rem(10);
  }
</style>

<script>
export default {
  props:[],
  data () {
    return {
    }
  }
}
</script>