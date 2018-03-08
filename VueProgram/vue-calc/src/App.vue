<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view></router-view>
    <header-custom></header-custom>
    <p :is="headercustom">
      <h3>我是slot的内容</h3>
    </p>
    <div style="margin:20px;backgroun:red;" v-customdir="{'name':'cupid','css':'margin:50px;background:blue;'}"></div>
  </div>
</template>
<script>
import HeaderCustom from './components/header.vue';


export default {
  name: 'app',
  components: {
    HeaderCustom: HeaderCustom
  },
  data: function(argument) {
    return {
      headercustom: 'header-custom'
    }
  },
  directives: {
    customdir: {
      inserted: function(el, bind) {
        var valueObj = bind.value;
        el.innerText = valueObj.name;
        el.style.cssText = valueObj.css;
      },
      // inserted:function () {
      //   /* body... */
      // }
    }
  }
}

</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
