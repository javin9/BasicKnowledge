import Vue from 'vue'
import VueResource from 'vue-resource'
import ForgetView from './pages/forget'

Vue.use(VueResource)

new Vue({
	el: '#main',
	props: {
		redirectUrl: {
			type: String,
			required: true
		},
		headerLink: {
			type: String,
			required: true
		}
	},
	template:`<forget-view :redirect-url="redirectUrl" :header-link="headerLink"></forget-view>`,
	components: {
		ForgetView
	}
})

