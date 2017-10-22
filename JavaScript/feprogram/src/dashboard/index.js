import './index.scss'
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import PageUsage from './pages/usage'
import PageIcons from './pages/icons'
import PageVars from './pages/vars'
import PagePlacehold from './pages/placehold'
import PageHosts from './pages/hosts'

Vue.use(VueResource)
Vue.use(VueRouter)

const router = new VueRouter()

const app = {
	data(){
    return {
    	tab: window.location.hash.replace(/#!\//g, '') || 'usage'
    }
  },
	template:`
		<header>
      <div class="container">
        <h1>易鑫前端dashboard</h1>
      </div>
	  </header>
	  <nav>
	    <div class="container">
	      <ul class="nav nav-tabs nav-justified">
	        <li :class="{'active': tab === 'usage'}"><a href="javascript:void(0)" v-link="'usage'" @click="tab='usage'">资源占用</a></li>
	        <li><a href="http://wiki.dev.daikuan.com/" target="_blank">wiki</a></li>
	        <li :class="{'active': tab === 'icons'}"><a href="javascript:void(0)" v-link="'icons'" @click="tab='icons'">icons</a></li>
	        <li :class="{'active': tab === 'vars'}"><a href="javascript:void(0)" v-link="'vars'" @click="tab='vars'">css变量</a></li>
	        <li :class="{'active': tab === 'hosts'}"><a href="javascript:void(0)" v-link="'hosts'" @click="tab='hosts'">hosts</a></li>
	        <li :class="{'active': tab === 'placehold'}"><a href="javascript:void(0)" v-link="'placehold'" @click="tab='placehold'">占位图</a></li>
	        <li><a href="http://gitlab.dev.daikuan.com/" target="_blank">gitlab</a></li>
	      </ul>
	    </div>
	  </nav>
		<section>
			<router-view></router-view>
		</section>
	`
}

router.map({
	'/' : {
		component: PageUsage
	},
	'/usage' : {
		component: PageUsage
	},
	'/icons' : {
		component: PageIcons
	},
	'/vars' : {
		component: PageVars
	},
	'/placehold' : {
		component: PagePlacehold
	},
	'/hosts' : {
		component: PageHosts
	}
})

router.start(app, '#app')