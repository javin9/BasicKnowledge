import Vue from 'vue'
import VueResource from 'vue-resource'
import mobileView from './pages/mobile'


Vue.use(VueResource)
new Vue({
	el: '#main',
	data: {
		mobileshow:true,
		authcode:''
	},
	ready(){
		//console.log('aaa00',this.redirectUrl)
		//console.log('aaa',this.redirectUrl)
	},
	props: {
		redirectUrl: {
			type: String,
			required: true
		}
	},
	template:`<mobile-view v-bind:authcode="authcode" v-bind:mobileshow="mobileshow" v-bind:redirect-url="redirectUrl"></mobile-view>`,
	components: {
		mobileView
	}
})

