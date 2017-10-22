import './brand.scss'
import Vue from 'vue'
import vueResource from 'vue-resource'
import CarSelector from 'libs/vue-components/car-selector'

Vue.use(vueResource)

$(function(){
    var vm = new Vue({
        el: '#yxWrapper',
        components: {
            CarSelector
        },
        data() {
            return {
                cityid: tools.getUrlParam('cityid'),
                from: tools.getUrlParam('from'),
                source: tools.getUrlParam('source')
            }
        },
        methods: {
            selectCarCallback(data){
                const href = `${window.baseRoutes || ''}${detailurl}?carid=${data.car.id}&cityid=${this.cityid}&source=${this.source}&from=${this.from}`
                window.location.href = href
            }
        },
        ready(){
        }
    })
})