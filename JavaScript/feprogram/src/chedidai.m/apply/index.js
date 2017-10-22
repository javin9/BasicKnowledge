import Vue from 'vue'
import VueResource from 'vue-resource'
import Header from 'libs/header'
import ApplyForm from './pages/index'

Vue.use(VueResource)

new Vue({
    el: '#app',
    data: {
        isProduct: window.ApplyAmount === '0' ? false : true,
        initialCar: {
            id: window.CarID || '',
            name: window.CarName || '',
            year: window.carYear || ''
        },
        initialCity: {
          id: window.cityId || '',
          name: window.cityName || ''
        },
        realName: window.RealName,
        orderId: window.orderId
    },
    template: `
        <component-header title="补充信息" back="/"></component-header>
        <apply-form :is-product="isProduct" :real-name="realName" :order-id="orderId" :initial-city="initialCity" :initial-car="initialCar"></apply-form>
    `,
    events:{
    },
    components: {
        'component-header': Header,
        'apply-form' : ApplyForm
    }
})