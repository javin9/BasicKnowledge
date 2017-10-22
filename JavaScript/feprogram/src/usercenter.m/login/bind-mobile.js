import Vue from 'vue'
import VueResource from 'vue-resource'
import MobileView from './pages/bind-mobile'

Vue.use(VueResource)

new Vue({
    el: '#main',
    props: {
        from: String,
        userid: String,
        redirectUrl: String
    },
    template:`<mobile-view 
                :from="from"
                :userid="userid"
                :redirect-url="redirectUrl"
            ></mobile-view>`,
    components: {
        MobileView
    }
})

