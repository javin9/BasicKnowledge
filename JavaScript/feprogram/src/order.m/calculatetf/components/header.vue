<template>
  <header class="header-bar" v-if="!bar">
      <a href="javascript:history.back();" class="nav-back" v-if="type === 'page'"></a>
      <a href="javascript:void(0)" class="nav-back" v-if="type === 'modal'" @click="modal=false"></a>
      <h1 class="font-nav">{{title}}</h1>
      <span></span>
  </header>
</template>

<style>
</style>

<script>
import hideType from 'libs/hideType';

export default {
	props: ['title', 'type', 'modal'],
  data () {
    return {
      bar: hideType.header
    }
  },
    created(){
        var _isWebView = tools.isWebView();
        this.isApp = Boolean(_isWebView == 'yixinapp' || _isWebView == 'yixinbjapp');
        if(this.isApp){
            tools.jsNativeBridge('getTitle',this.title);
        }
    },
}
</script>
