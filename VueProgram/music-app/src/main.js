// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';

import fastclick from 'fastclick';
fastclick.attach(document.body);//去掉300ms延迟

import Vue from 'vue';
import App from './App';

import router from './router';
import reset from 'common/less/reset.less';

import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios);

import VueLazyload from 'vue-lazyload';
Vue.use(VueLazyload,{
	loading:require('common/image/loading.gif'),
	listenEvents: ['scroll']
});





/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
