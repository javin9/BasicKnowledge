<template>
	<header class="header-bar" :class="{'header-bar-has-logo': logo, 'header-bar-hide-back': hideBack || isApp && !show}" v-if="!hide">
    <a href="javascript:void(0);" @click="goBack()" v-if="!hideBack || logo"></a>
    <span v-else></span>
    <h1 v-if="logo" class="header-bar-subtitle"><em>·</em>{{title}}</h1>
    <h1 class="font-nav" v-else>{{title}}</h1>
    <span></span>
    <a :href="moreLink" v-if="showMoreLink" class="header-bar-more-link">{{moreLinkText}}</a>
	</header>
</template>

<style scoped>
@import 'sassHelper/mixin';
@import 'sassHelper/vars';

.font-nav{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-bar-more-link{
  @include fsize(30);
  width: auto;
  line-height: px2rem(90);
  padding-right: px2rem(30);
  white-space: nowrap;
  position: absolute;
  right:0;
  top:0;

  color:#5fc3e8;
  &:after,&:before{
    display:none;
  }
}
</style>

<script>
import hideType from 'libs/hideType'

export default {
	props: ['title', 'back', 'logo', 'hideBack', 'moreLink', 'moreLinkText', 'show'],

  data () {
    return {
      hide: this.show ? false : hideType.header
    }
  },

  computed:{
    showMoreLink(){
      return this.moreLink && this.moreLinkText
    }
  },

  created(){
  	this.isApp = tools.getCookie('YiXinAppInfo')

    if(this.isApp){
      tools.jsNativeBridge('getTitle',this.title);
    }
  },

  methods: {
    goBack(){
      if(this.hideBack){
        return false
      }
      if(!this.back){
        const index = document.referrer.indexOf('/login/index') >= 0 ? -2 : -1
        window.history.go(index)
      }else if(typeof this.back === 'function'){
        this.back()
      }else if(typeof this.back === 'string'){
        window.location.href = this.back
      }
    }
  }
}
</script>