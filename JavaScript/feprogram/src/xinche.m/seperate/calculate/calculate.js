import './main.scss'
import Vue from 'vue'
import VueResource from 'vue-resource'
import Index from './pages/index.vue'

Vue.use(VueResource)

// 格式化金钱
// 去除小数点 => 千分位 => 增加钱币符
Vue.filter('format', value => {
  return '&yen;' + Math.round(value).toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
})

new Vue({
	el: '#app',
	components: {
		Index
	}
})