import Vue from 'vue'
import VueResource from 'vue-resource'
import Result from './pages/result'

Vue.use(VueResource)

new Vue({
    el: '#app',
    props: {
    	linkHome: String,
    	linkApply: String
    },
    data: {
    },
    template: '<Result :link-home="linkHome" :link-apply="linkApply"></Result>',
    components: {
        Result
    }
})