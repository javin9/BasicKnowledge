<template>
  <div class="component-success-modal">
    <i></i>
    <p><slot></slot></p>
  </div>
</template>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';
  .component-success-modal { position: fixed; top: 50%; left: 50%; min-width: 4.266667rem; min-height: 1.6rem; padding: 0.533333rem; text-align: center; background-color: rgba(0, 0, 0, .5); border-radius: 0.266667rem; -webkit-box-sizing: border-box; box-sizing: border-box; -webkit-transform: translate3d(-50%, -50%, 0); transform: translate3d(-50%, -50%, 0); }
  .component-success-modal p { @include fsize(30);color: #fff; }
  .component-success-modal i { margin: 0 auto 0.213333rem; display: block; width: 0.8rem; height: 0.8rem;  background: transparent url(./icon.png) center center; -webkit-background-size: 0.8rem 0.8rem; background-size: 0.8rem 0.8rem; }
</style>

<script>

  export default {
    props: {
    },
    data () {
      return {
      }
    },
  
    methods: {
    },

    components: {
    }
  }
</script>