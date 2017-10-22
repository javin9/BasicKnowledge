import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import PageIndex from './pages/index'
import PageSuccess from './pages/success'
import wxBridge from 'wx-bridge'

Vue.use(VueResource)
Vue.use(VueRouter)

const router = new VueRouter()

const app = {
	props: {
		mainLink: {
			type: String,
			required: true
		},
		interface: {
			type: String,
			required:true
		}
	},
	template:`
		<router-view :main-link="mainLink" :interface="interface" title="中信易鑫联名卡 | 开走吧"></router-view>
	`,
	created(){
		wxBridge()
	}
}

router.map({
	'/' : {
		component: PageIndex
	},
	'success' : {
		component: PageSuccess
	}
})

router.start(app, '#main')