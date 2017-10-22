<template>
	<header class="header-bar" :class="{'no-after': isApp}" v-if="!hide">
    <a href="javascript:void(0);" @click="back()"></a>
    <h1 class="font-nav">{{title}}</h1>
    <span></span>
	</header>
</template>

<style scoped>
@import 'sassHelper/mixin';
</style>

<script>
import hideType from 'libs/hideType'

export default {
	props: ['title'],
  data () {
    return {
      hide: hideType.header
    }
  },

  created(){
  	this.isApp = tools.getCookie('YiXinAppInfo')

    if(this.isApp){
      tools.jsNativeBridge('getTitle',this.title);
    }
  },

  methods: {
    back(){
      const index = document.referrer.indexOf('/login/index') >= 0 ? -2 : -1
      document.title = "登录并申请";
      window.history.go(index)
    }
  }
}
</script>