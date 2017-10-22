import './success.scss'
import Vue from 'vue'
import vueResource from 'vue-resource'
import success from './pages/success'

Vue.use(vueResource)

new Vue({
    el: '#main',
    props:['source','channel','from','isonlineapproval','onlineapprovalurl','onlineapprovalurl','orderdetailurl','getrecproductinfourl'],
    template: `<success 
                    :source="source"
                    :channel="channel"
                    :from="from"
                    :isonlineapproval="isonlineapproval"
                    :onlineapprovalurl="onlineapprovalurl"
                    :orderdetailurl="orderdetailurl"
                    :getrecproductinfourl="getrecproductinfourl">
                </success>`,
    components: {
        success
    },
    data(){
        return{
            from:tools.getUrlParam('from'),
        }
    },
    ready(){
        console.log('sss',this)
    },
})
