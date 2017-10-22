import './index.scss'
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import BindView from './pages/bind'
import SuccessView from './pages/success'
import ComponentHeader from 'libs/header'

Vue.use(VueResource)
Vue.use(VueRouter)

const App = {
	props: {
		interface: {
			type: String,
			required: true
		},
		successLink: {
			type: String,
		},
		successLinkText: {
			type: String,
			default: '下单立享优惠'
		},
		successMoreLink: {
			type: String
		},
		successMoreLinkText: {
			type: String,
			default: '查看我的优惠'
		}
	},
	template: `
		<component-header title="兑换卡券"></component-header>
		<article>
			<router-view
				:interface="interface"
				:success-link="successLink"
				:success-link-text="successLinkText"
				:success-more-link="successMoreLink"
				:success-more-link-text="successMoreLinkText"
			></router-view>
		</article>
	`,
	components: {
		ComponentHeader,
		SuccessView
	}
}

const router = new VueRouter()

router.map({
  '/': {
    component: BindView
  },
  '/success': {
    component: SuccessView
  }
})

router.start(App, '#main')