<template>
  <div class="mask" v-if="show" @click="callback" transition="opacity" @touchmove.prevent></div>
</template>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .mask{
    position: fixed;
    background: $mask-background-color;
    left:0;
    top:0;
    width: 100%;
    min-height:px2rem(9999);
    min-height:200vh;
    height:200%;
    transform:translateY(-30%);
    z-index: 9999;
  }
</style>

<script>
  export default {
    props: {
      // 不建议使用click属性，建议使用click event
      click: {
        type: Function
      },
      touchmove: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        show: false
      }
    },

    events: {
      showMask(){
        this.show = true
        !this.touchmove && document.addEventListener('touchmove', this.preventEvent)
      },
      hideMask(){
        this.show = false
        !this.touchmove && document.removeEventListener('touchmove', this.preventEvent)
      }
    },

    methods: {
      preventEvent(e){
        e.preventDefault()
      },
      callback(){
        if(typeof this.click === 'function'){
          // 不应该有此特性，因此回调建议使用event触发
          this.show = false
          this.click()
        }else{
          this.$emit('click')
        }
      }
    }
  }
</script>