import Vue from 'vue'
import VueResource from 'vue-resource'
import Index from './pages/index.vue'

Vue.use(VueResource)

new Vue({
	el: '#main',
	props: ['cityId', 'cityName', 'joinusHref'],
	template: `<index :local-city-id="cityId" :local-city-name="cityName" :joinus-href="joinusHref"></index>`,
	created(){
		$('body').css('background', '#fff');
	},
	components: {
		Index
	}
})