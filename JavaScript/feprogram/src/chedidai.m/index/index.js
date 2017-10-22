import './index.scss'
import Vue from 'vue'
import VueResource from 'vue-resource'
import Header from 'libs/header'
import Banner from './components/banner'
import Condition from './components/condition'
import Flow from './components/flow'
import Product from './components/product'
import Evaluate from './components/evaluate'
import VerifyModal from './components/verifyModal'
import Selector from './components/selector'
import Alert from './components/alert'
import Footer from './components/footer'

Vue.use(VueResource)

Vue.filter('format', value => {
  return Math.round(value).toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
})
//获取登录信息
tools.getLoginStatus(()=>{});

new Vue({
    el: '#app',
    template: `
        <div class="page-container">
            <component-header title="车抵贷" :back="backHome" :logo="true"></component-header>
            <banner><slot name="banner"></slot></banner>
            <evaluate></evaluate>
            <product></product>
            <condition></condition>
            <flow></flow>
            <component-footer text="评估结果由精真估提供"></component-footer>
        </div>
        <verify-modal></verify-modal>
        <selector></selector>
        <alert></alert>
    `,
    events:{
        showSelector(data){
            this.$broadcast('showSelector', data)
        },

        updateSelector(data){
            this.$broadcast('updateSelector', data)
        },

        changeSelector(value){
            this.$broadcast('changeSelector', value)
        },

        showAuthCode(data){
            this.$broadcast('showAuthCode', data)
        },

        alert(msg){
            this.$broadcast('showAlert', msg)
        },

        disabledSubmit(){
            this.$broadcast('disabledSubmit')
        },

        enabledSubmit(){
            this.$broadcast('enabledSubmit')
        }
    },

    methods:{
        backHome(){
            // const from = tools.getUrlParam('from')
            // window.location.href = `${window.location.protocol + '//m.daikuan.com'}/${from ? '?from='+from : ''}`
            window.location.href = window.xincheUrl || `${window.location.protocol + '//m.daikuan.com'}`
        }
    },
    ready(){

        if(dev){
            // this.$emit('updateTel', '18575832500')
            // this.$emit('showAuthCode')
        }
        
    },
    components: {
        'component-header': Header,
        'component-footer': Footer,
        Banner,
        Condition,
        Flow,
        Product,
        Evaluate,
        VerifyModal,
        Selector,
        Alert
    }
})