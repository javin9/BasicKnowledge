import './index.scss'
import Vue from 'vue'
import Header from './components/header'
import Success from '../components/result/success'
import Result from './components/result'
import Chart from './components/chart'

new Vue({
    el: '#app',
    props: {
        successTitle: {
            type: String,
            default: '线上申请成功'
        },
        successDescription:String,
        successAlign: String,
        close: {
            type: Boolean,
            default: true
        }
    },
    data : {
        type: window.ApplyAmount !== '0' || typeof window.ApplyAmount === undefined,
        isTF: window.IsTF,
        isApp: tools.getCookie('YiXinAppInfo')
    },
    template: `
        <component-header v-if="!isTF" :close="close"></component-header>
        <component-header v-else title="易鑫车抵贷" :close="close"></component-header>
        <success v-if="type || isTF" class="result-top" :title="successTitle" :description="successDescription" :align="successAlign"></success>
        <result><slot name="result"></slot></result>
        <chart></chart>
    `,
    created(){
        if(this.isApp){
            tools.jsNativeBridge("showShare",{
                pageId:102
            });
        }
    },
    components: {
        'component-header' : Header,
        Success,
        Result,
        Chart
    }
})