import Vue from 'vue'
import VueResource from 'vue-resource'
import LoginView from './pages/login'

Vue.use(VueResource)

new Vue({
	el: '#main',
	props: {
		headerLink: String,
		forgetPasswordLink: String,
		tpSina: String,
		tpQq: String,
		tpJd: String,
		tpYiche:String,
		redirectUrl: String
	},
	template:`<login-view
						:header-link="headerLink"
						:forget-password-link="forgetPasswordLink"
						:tp-sina="tpSina"
						:tp-qq="tpQq"
						:tp-jd="tpJd"
						:tp-yiche="tpYiche"
						:redirect-url="redirectUrl"
						></login-view>`,
	components: {
		LoginView
	}
})

