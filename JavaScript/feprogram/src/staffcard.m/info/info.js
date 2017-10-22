import './info.scss'
import Vue from 'vue'
import Newslist from '../components/newsList.vue'

new Vue({
    el: '#yxWrapper',
    data(){
    	return {
	    	employeeName : UserName,
	    	emplyeeNum: EmployeeNumber
    	}
    },
    components: {
        Newslist
    },
})
