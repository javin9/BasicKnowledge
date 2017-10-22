<template>
  <div class="component-province-selector" v-show="show" transition="slide">
    <a href="javascript:void(0)" v-for="one in list" @click="select(one)">{{one}}</a>
  </div>

  <mask :click="close"></mask>
</template>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .slide-transition{
    transition: all .3s ease;
    transform:translateY(0);
  }

  .slide-enter{
    transform: translateY(100%);
  }

  .slide-leave{
    transform: translateY(100%);
  }

  .component-province-selector{
    position: fixed;
    bottom:0;
    width: 100%;
    background: #CDCFD3;
    font-size:0;
    padding:px2rem(20) 0 px2rem(20) px2rem(6);
    z-index: 10000;

    a{
      font-size:px2rem(30);
      background: #fff;
      border-radius:px2rem(8);
      margin:px2rem(6);
      display: inline-block;
      line-height: 1;
      padding:px2rem(20);
      box-shadow:0 px2rem(4) px2rem(5) rgba(0,0,0,.4);
    }
  }
</style>

<script>
  import Mask from 'libs/mask'

  export default {

    data () {
      return {
        show:false,
        list: ['京', '沪', '浙', '苏', '粤', '鲁', '晋', '冀', '豫', '川', '渝', '辽', '吉', '黑', '皖', '鄂', '湘', '赣', '闽', '陕', '甘', '宁', '蒙', '津', '贵', '云', '桂', '琼', '青', '新', '藏']
      }
    },

    events: {
      showProvinceSelector(){
        this.show = true
      }
    },

    methods:{
      select(value){
        this.$dispatch('changeProvince', value)
        this.show = false
      },

      close(){
        this.show=false
      }
    },

    watch: {
      show(value){
        if(value){
          this.$broadcast('showMask')
        }else{
          this.$broadcast('hideMask')
        }
      }
    },

    components: {
      Mask
    }
  }
</script>