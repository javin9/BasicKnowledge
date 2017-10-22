<template>
    <div class="component-tree-1"></div>
    <div class="component-tree-2"></div>
</template>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .component-tree-1{
    width: px2rem(102);
    height:px2rem(149);
    position: absolute;
    background: url(./tree1.png) no-repeat left top;
    background-size: contain;
    left:px2rem(626);
    top:px2rem(776);
    animation:float 4s infinite 1s linear;
    z-index: 800;
  }
  .component-tree-2{
    width: px2rem(94);
    height:px2rem(91);
    position: absolute;
    background: url(./tree2.png) no-repeat left top;
    background-size: contain;
    left:px2rem(11);
    top:px2rem(792);
    animation:float 4s infinite linear;
    z-index: 800;
  }

  @keyframes float {
    0%{
        transform:translateY(0);
    }
    50%{
        transform:translateY(40%);
    }
    100%{
        transform:translateY(0%);
    }
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