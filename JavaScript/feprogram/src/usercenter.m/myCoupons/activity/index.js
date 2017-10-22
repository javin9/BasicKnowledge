import Vue from 'vue'
import VueResource from 'vue-resource'
import Index from './pages/index'
import wxBridge from 'wx-bridge'

Vue.use(VueResource)
//获取登录状态
tools.getLoginStatus(()=>{});
new Vue({
	el: '#main',
	props: {
		shareUrl: {
			type: String,
			default: ''
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
		forceOtherView: {
			type: Boolean,
			default: false
		}
	},
	template:'<Index :share-url="shareUrl" :card-info-name="cardInfoName"  :card-info-value="cardInfoValue" :short-link="shortLink" :login="login" :channel="channel" :login-interface="loginInterface" :force-other-view="forceOtherView"/>',

	created(){
		if(/MicroMessenger/.test(window.navigator.userAgent)){
			wxBridge(Object.assign({}, window.__WX_AUTH__ || {}, {
        debug: false,
        title: this.login ? `【发福利】你贷款购车，我送你${this.cardInfoValue}元${this.cardInfoName}` : '易鑫车贷分享有礼',
        desc: this.login ? '福利来袭，易鑫助您轻松购车' : `邀请好友贷款购车，您和Ta均可获得 ${this.cardInfoValue} 元${this.cardInfoName}`,
        imgUrl: 'http://img4.bitautoimg.com/jinrong/newmweb/images/pic300.jpg'
      }))
		}
	},

	components: {
		Index
	}
})