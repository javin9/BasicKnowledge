import Vue from 'vue'
import VueResource from 'vue-resource'
import Header from 'libs/header'
import ApplyForm from './pages/apply'

Vue.use(VueResource)

new Vue({
    el: '#app',
    props: {
        skip: {
            type: String,
            default: ''
        },
        orderId: {
            type: String,
            default: ''
        },
        carName: {
            type:String,
            default:''
        },
        carId: {
            type:String,
            default: ''
        },
        carYear: {
            type: String,
            default: ''
        },
        cityName: {
            type: String,
            default: ''
        },
        cityId: {
            type: String,
            default: ''
        }
    },
    template: `
        <component-header title="易鑫车抵贷"></component-header>
        <apply-form :skip="skip" :order-id="orderId" :city-id="cityId" :city-name="cityName" :car-id="carId"  :car-name="carName" :car-year="carYear"></apply-form>
    `,
    events:{
    },
    components: {
        'component-header': Header,
        'apply-form' : ApplyForm
    }
})