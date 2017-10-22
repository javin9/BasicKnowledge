import Vue from 'vue'
import VueResource from 'vue-resource'
import RegisterView from './pages/register'

Vue.use(VueResource)

new Vue({
	el: '#main',
	props: {},
	template:`<register-view></register-view>`,
	components: {
		RegisterView
	}
})

