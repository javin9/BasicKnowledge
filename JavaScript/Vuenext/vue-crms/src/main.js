// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/app.css'


import VueBus from 'vue-bus';
Vue.use(VueBus);

Vue.config.productionTip = false;
import Utils from './lib/utils.js';

Vue.use(Utils);
console.log(Utils);
console.log(this);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
