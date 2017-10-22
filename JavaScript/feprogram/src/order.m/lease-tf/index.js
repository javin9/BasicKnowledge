import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './pages/index'

Vue.use(VueResource)

new Vue({
  el: 'body',
  components: {
  	App
  }
})