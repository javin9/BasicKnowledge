<template>
  <component-header :title="title"></component-header>
  <div class="page-index">
    <component-banner></component-banner>
    <div class="page-index-content">
      <component-info></component-info>
      <component-form :interface="interface"></component-form>
    </div>
  </div>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .page-index{
    background: #f28301;
    padding-bottom: px2rem(40);

    &-content{
      padding:0 px2rem(30);
    }
  }
</style>

<script>
import ComponentBanner from '../components/banner'
import ComponentInfo from '../components/info'
import ComponentForm from '../components/form'
import ComponentHeader from 'libs/header'

export default {
  props:['mainLink', 'interface', 'title'],

  data() {
    return {
    }
  },


  methods:{
   
  },

  components: {
    ComponentHeader,
    ComponentBanner,
    ComponentInfo,
    ComponentForm
	}
}
</script>