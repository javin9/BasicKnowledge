<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    
  <keep-alive>
    <router-view/>
  </keep-alive>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header.vue';
import Tab from 'components/tab/tab.vue';
export default {
  name: 'app',
  components:{
    MHeader,
    Tab
  }
}
</script>

<style>

</style>
