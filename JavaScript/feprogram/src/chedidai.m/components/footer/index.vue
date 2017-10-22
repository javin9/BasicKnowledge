<template>
  <footer :class="{'position-bottom': position === 'bottom'}">{{text}}</footer>
</template>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  footer{
    @include fsize(24);
    color:$normal-color;
    margin-top: px2rem(67);
    text-align: center;
    margin-bottom: px2rem(60);
    width: 100%;

    &.position-bottom{
      position: absolute;
      bottom:0;
    }
  }
</style>

<script>
  export default {
    props:  {
      text: {
        type: String,
        default: '易鑫车贷'
      },
      position: String
    },
    data () {
      return {
      }
    }
  }
</script>