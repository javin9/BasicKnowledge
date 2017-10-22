import './index.scss';
import Vue from 'vue'
import VueResource from 'vue-resource'
import Share from './pages/share'
import wxBridge from 'wx-bridge'

Vue.use(VueResource)

new Vue({
	el: '#main',
	props: {
        receiveCouponcard:{
			type:String,
			default:''
		},
        isWeixinrequest:{
            type:Boolean,
			default:false
		},
        helpVote: {
			type: String,
			default: ''
		},
        orderApply: {
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
		loginInterface: {
			type: String,
			default: ''
		},
		power: {
			type: Number,
			default: 0
		},
		// 能否能够加油
		canCheer: {
			type:Boolean,
			default:true
		},
		weixinId: {
			type: String,
			default: ''
		},
		activityUrl: {
			type: String,
			default: ''
		},
        sign:{
            type: String,
            default: ''
		},
		isShowlayer:{
            type:Boolean,
            default:false
		}
	},
	template:'<Share :is-weixinrequest="isWeixinrequest" :is-showlayer="isShowlayer" :sign="sign" :receive-couponcard="receiveCouponcard" :help-vote="helpVote" :order-apply="orderApply" :card-info-name="cardInfoName" :card-info-value="cardInfoValue" :login-interface="loginInterface" :power="power" :weixin-id="weixinId" :activity-url="activityUrl" :can-cheer="canCheer"/>',

	created(){
		const [title, desc, imgUrl, shareUrl] = [
			'【易鑫6月购车节】我买车你加油！0息购车不用愁！',
			'点击进入帮助好友完成加油任务，贷款购车更有首付立减、千元京东E卡壕礼相送！',
			'http://img1.yixinfinance.com/jinrong/assets/66.jpg',
			window.location.href
		]
		if(/MicroMessenger/.test(window.navigator.userAgent)){
			wxBridge(Object.assign({}, window.__WX_AUTH__ || {}, {
        debug: false,
        title,
        desc,
        imgUrl,
        shareUrl,
      }))
		}

		if(tools.isWebView() && this.isShowlayer){
      tools.jsNativeBridge('showShare',{     
          title,     
          img:imgUrl,     
          url: shareUrl,     
          des:desc
        }
      )
	  }
	},

	components: {
		Share
	}
})