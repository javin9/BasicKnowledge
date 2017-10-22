import Vue from 'vue'
import VueResource from 'vue-resource'
import AccountView from './pages/bind-account'

Vue.use(VueResource)

new Vue({
	el: '#main',
	props: {
		thirdmark: String,
		unionid: String,
		openid: String,
		nickname: String,
		headportrait: String,
		redirectUrl: String
	},
	template:`<account-view 
							:thirdmark="thirdmark"
							:unionid="unionid"
							:openid="openid"
							:nickname="nickname"
							:headportrait="headportrait"
							:thirdmark="thirdmark"
							:thirdmark="thirdmark"
							:redirect-url="redirectUrl"
						></account-view>`,
	components: {
		AccountView
	}
})

