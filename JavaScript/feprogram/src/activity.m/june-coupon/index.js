import './index.scss'
import Vue from 'vue'
import VueResource from 'vue-resource'
import Index from './pages/index'
import wxBridge from 'wx-bridge'

Vue.use(VueResource)

new Vue({
	el: '#main',
	props: {
		shareUrl: {
			type: String,
			default: ''
		},
		grabCardUrl: {
			type: String,
			default:''
		},
		cardInfoName: {
			type: String,
			default: '京东E卡'
		},
		cardInfoValue: {
			type: String,
			default: '1000'
		},
		shortLink:{
			type: String,
			default: ''
		},
		login: {
			type:Boolean,
			default:false
		},
		loginInterface: {
			type: String,
			default: ''
		},
		channel: {
			type:Boolean,
			default: false
		},
		power: {
			type: Number,
			default: 0
		},
		username: {
			type: String,
			default: ''
		},
		forceOtherView: {
			type: Boolean,
			default: false
		},
		alreadyReceived: {
			type: Boolean,
			default: false
		},
		myCouponUrl: {
			type: String,
			default: ''
		},
		serverTime: {
			type:String,
			default: '00:00:00'
		},
		isRemain: {
			type: Boolean,
			default: false
		},
		timeStart: {
			type: String,
			default: '9:00'
		},
		timeEnd: {
			type: String,
			default: '11:00'
		}
	},
	template:`<Index 
		:share-url="shareUrl" 
		:card-info-name="cardInfoName"  
		:card-info-value="cardInfoValue" 
		:short-link="shortLink" 
		:login="login" 
		:channel="channel" 
		:login-interface="loginInterface" 
		:power="power" 
		:force-other-view="forceOtherView" 
		:username="username" 
		:already-received="alreadyReceived" 
		:my-coupon-url="myCouponUrl" 
		:server-time="serverTime" 
		:is-remain="isRemain" 
		:grab-card-url="grabCardUrl" 
		:time-start="timeStart" 
		:time-end="timeEnd"/>`,

	events: {
		weixinShareUpdate(shareUrl){
			const options = Object.assign({}, window.__WX_AUTH__ || {}, {
        debug: false,
        title: this.login ? '【易鑫6月购车节】我买车你加油！0息购车不用愁！' : '',
        desc: this.login ? '点击进入帮助好友完成加油任务，贷款购车更有首付立减、千元京东E卡壕礼相送！' : '',
        imgUrl: 'http://img1.yixinfinance.com/jinrong/assets/66.jpg',
        shareUrl: shareUrl || this.shareUrl || document.location.href
      })
			wxBridge(options)
		}
	},

	created(){
		// uc浏览器后退会从缓存中取内容，而且不是bfCache, 此处用serverTime作为唯一时间校准，存入sessionStorage,
		// 如果载入页面时与上次sessionStorage内容完全一样，判断是从缓存中取的页面，进行刷新操作
		if(!dev){
			window.addEventListener('pagehide', () => {
				sessionStorage.activityServerTime = `${new Date().getDate()} ${this.serverTime}`
			})

			window.addEventListener('pageshow', () => {
				const serverTime = sessionStorage.activityServerTime
				if(serverTime === `${new Date().getDate()} ${this.serverTime}`){
					window.location.reload()
				}else{
					sessionStorage.removeItem('activityServerTime')
				}
			})
		}

		if(/MicroMessenger/.test(window.navigator.userAgent) || dev){
			this.$emit('weixinShareUpdate')
		}
	},

	components: {
		Index
	}
})