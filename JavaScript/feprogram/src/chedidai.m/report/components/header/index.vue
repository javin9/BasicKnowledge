<template>
  <header class="header-bar" v-if="!hide">
    <a v-if="title == '易鑫车抵贷'" href="javascript:history.back();" class="nav-back"></a>
    <span v-else></span>
    <h1 class="font-nav">{{title}}</h1>
    <a href="javascript:void(0)" @click="goHome" class="nav-close" v-if="close"></a>
    <span v-else></span>
  </header>
</template>

<style scoped>
@import 'sassHelper/mixin';

a.nav-close:after{
  display: none;
}

a.nav-close{
  background: url(./close.png) no-repeat center center;
  background-size: px2rem(24) px2rem(24);
  text-align: center;
  line-height: 1.2rem;
}

</style>

<script>
import hideType from 'libs/hideType';

export default {
  props:{
    close: {
      type: Boolean,
      default: true
    },
    title:{
        type: String,
        default: '评估报告'
    }
  },
  data () {
    return {
      isApp: tools.getCookie('YiXinAppInfo'),
      homelink: window.HomePageUrl,
        hide: hideType.header
    }
  },

  methods:{
    goHome(){
      if(this.isApp){
        tools.jsNativeBridge('backCZDHome','goHome')
      }else{
        window.location.href = this.homelink
      }
    }
  },

  created(){
  }
}
</script>