import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import PageQuery from './pages/query'
import PageResult from './pages/result'

Vue.use(VueResource)
Vue.use(VueRouter)

const router = new VueRouter()

const app = {
	props: {
		interface: {
			type: String,
			required: true
		}
	},
	data:{
		info: []
	},
	template:`
		<router-view :interface="interface" :info="info"></router-view>
	`,

	events:{
		updateInfo(info){
			this.info = info
		}
	},

	created(){
	}
}

router.map({
	'/' : {
		component: PageQuery
	},
	'result/:mobile' : {
		component: PageResult
	}
})

router.start(app, '#main')