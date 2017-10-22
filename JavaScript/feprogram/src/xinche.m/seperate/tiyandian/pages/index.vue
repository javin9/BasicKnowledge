<template>
  <component-header title="易鑫体验店"></component-header>
  <div class="tiyandian-list">
    <banner></banner>
    <div class="joinus" v-show="joinusBtnShow"><a :href="joinusHref">易鑫体验店合作商招募</a></div>
    <component-nav :count="count" :local-city-id="localCityId" :local-city-name="localCityName"></component-nav>
    <list :city-id="cityId" :local-city-id="localCityId"></list>
  </div>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  $main: map-get($colors, red);

  .tiyandian-list{
    /*
    left:0;
    top:px2rem(90);
    position: absolute;
    bottom:0;*/
    width: 100%;
  }

  .joinus {
    padding: px2rem(40) px2rem(30) px2rem(30);

    a {
      display: block;
      box-sizing: content-box;
      height: px2rem(78);
      line-height: px2rem(78);
      border: 1px solid $main;
      border-radius: px2rem(5);
      text-align: center;
      @include fsize(30);
      text-decoration: none;
      color: $main;
    }
  }
</style>

<script>
import ComponentHeader from 'libs/header'
import ComponentNav from '../components/nav'
import List from '../components/list'
import Banner from '../components/banner'

export default {
  props: {
    localCityId: Number,
    localCityName: String,
    joinusHref: String
  },

  data () {
    return {
      joinusBtnShow:true,
      count: 0,
      cityId: 0
    }
  },

  events:{
    updateCount(count){
      this.count = count

      // setTimeout(()=>{
      //   this.scroll = new iScroll('.tiyandian-list', {
      //     mouseWheel: true,
      //     useTransition: false,
      //     checkDOMChanges: true,
      //     scrollbars:true,
      //     fadeScrollbars:true,
      //     freeScroll: false,
      //     click:true
      //   })
      // },500)
    },

    changeCity(cityId){
      this.cityId = cityId
    }
  },

  components: {
  	ComponentHeader,
    ComponentNav,
    List,
    Banner
  },
  created(){
      if(tools.isWebView()){
          this.joinusBtnShow =false;
      }
  }
}
</script>