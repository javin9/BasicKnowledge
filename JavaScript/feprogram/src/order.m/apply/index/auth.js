import Vue from 'vue'
import VueResource from 'vue-resource'
import Auth from './pages/auth.vue'
import showCGBAlter from '../libs/showCGBAlter'

//判断广发银行
// showCGBAlter(orderId);

new Vue({
    el: '#main',
    data() {

    },
    components: {
        Auth
    },
})

Vue.use(VueResource)