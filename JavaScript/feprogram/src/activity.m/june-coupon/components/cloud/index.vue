<template>
    <div class="component-cloud-1"></div>
    <div class="component-cloud-2"></div>
</template>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .component-cloud-1{
    width: px2rem(93);
    height:px2rem(73);
    position: absolute;
    background: url(./cloud1.png) no-repeat left top;
    background-size: contain;
    left:px2rem(57);
    top:px2rem(544);
    animation:flutter 8s infinite 4s ease-in-out;
    z-index: 800;
  }
  .component-cloud-2{
    width: px2rem(118);
    height:px2rem(73);
    position: absolute;
    background: url(./cloud2.png) no-repeat left top;
    background-size: contain;
    left:px2rem(479);
    top:px2rem(449);
    animation:flutter 8s infinite ease-in-out;
    z-index: 800;
  }

  @keyframes flutter {
    0%{
        transform:translateX(0);
    }
    50%{
        transform:translateX(50%);
    }
    100%{
        transform:translateX(0%);
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