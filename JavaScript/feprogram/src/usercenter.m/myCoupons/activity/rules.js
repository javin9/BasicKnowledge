import Vue from 'vue'
import Rule from './pages/rule'

new Vue({
	el: '#main',
	props:['url'],
	template:`<Rule url="{url}"/>`,
	components: {
		Rule
	}
})