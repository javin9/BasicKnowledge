// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import fastclick from 'fastclick';

import Vue from 'vue';
import App from './App';
import router from './router';
import reset from 'common/less/reset.less';

Vue.config.productionTip = false;

fastclick.attach(document.body);//去掉300ms延迟

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
