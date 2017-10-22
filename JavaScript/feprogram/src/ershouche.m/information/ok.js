/**
 * Created by liuhaiwei on 2017/3/23.
 */
import '../css/ershouche.scss';
import './ok.scss';
import Vue from 'vue';
import list from '../components/list.vue';
var wm = new Vue({
    el: '#listbox',
    ready() {
        this.init();

        let appName=tools.isWebView();
        if (appName){
            $('.btn_red_line').attr('href','javascript:;')
            $('.btn_red_line').on('click',function () {
                tools.jsNativeBridge("payResultAction","goHome");
            })
        }


    },
    components: {
        'list': list,
    },
    template: `<list v-bind:car="car" v-bind:sourceidone="sourceidone" v-bind:sourceidtwo="sourceidtwo" v-bind:prosize="prosize" v-bind:cityid="cityid"></list>`,
    data: {
        sourceidone: 1146, //同车系 source id
        sourceidtwo: 1147, //同价位 source id
        prosize: 24,
        cityid: cityInfo.CityId,
        carid: car.carId,
        car: car
    },
    methods: {
        init() {
           /* console.log(cityInfo,cityInfo.CityId)*/
        }

    },

})





//声明变量