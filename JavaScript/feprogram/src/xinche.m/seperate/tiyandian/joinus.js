import Vue from 'vue'
import VueResource from 'vue-resource'
import Joinus from './pages/joinus.vue'

Vue.use(VueResource)

new Vue({
	el: '#main',
	props: ['downloadHref'],
	template: `<joinus :download-href="downloadHref"></joinus>`,
	created(){
	},
	components: {
		Joinus
	}
})