import Vue from 'vue'
import VueResource from 'vue-resource'
import Index from './pages/index'

Vue.use(VueResource)

new Vue({
    el: '#app',
    props: {
        carName: {
            type: String,
            default: ''
        },
        carId: {
            type: String,
            default: ''
        },
        cityId: {
            type:String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        mobile: {
            type: String,
            default: ''
        },
        source: {
            type: Number,
            default: +tools.getUrlParam('source') || 764
        },
        from: {
            type: String,
            default: tools.getUrlParam('from') || tools.getCookie('from') || ''
        },
        channel: {
            type: String,
            default: tools.getUrlParam('channel') || ''
        }
    },
    data: {
    },
    template: '<Index :name="name" :car-name="carName" :car-id="carId" :mobile="mobile" :source="source" :from="from" :channel="channel" :city-id="cityId"></Index>',
    components: {
        Index
    }
})
