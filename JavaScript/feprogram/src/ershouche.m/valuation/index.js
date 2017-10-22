/**
 * Created by liuhaiwei on 2017/3/23.
 */
import '../css/ershouche.scss';
import './index.scss';
import Vue from 'vue';
import VueResource from 'vue-resource'
import car from 'libs/carSelect';
import login from './components/login.vue';
import info from './components/info.vue';
import list from './components/list.vue';
import check from 'libs/check/m.js';
Vue.use(VueResource)
var wm = new Vue({
    el:'#infopage',
    ready(){
        this.init();
    },
    components: {
        'login': login,
        'info': info,
        'list': list,
    },
    template:`<info v-bind:valid="valid" v-bind:getdata="getdata" v-bind:other="other()"></info>
    <login v-bind:getdata="getdata" v-if="loginshow"></login>
    <div class="btn_box"><div class="red_btn" v-on:click="submit" v-bind:class="getdata.submitcla ? '' : 'disabled'" >快速估值</div></div>
    <list v-bind:getdata="getdata" v-if="listshow"></list>
    `,
    data:{
        loginshow:true,
        listshow:false,
        getdata:{//传送数据
            carmodels:'<span class="col_grey">选择车型</span>',//选择车型
            carmodelsid:'',//选择车型
            timebrand:'<span class="col_grey">选择上牌时间</span>',//首次上牌
            timemin:'',//首次上牌-开始
            timemax:'',//首次上牌-结束
            mileage:'',//表显里程
            city:cityInfo.cityName,//上牌城市
            cityid:cityInfo.cityId,//上牌城市
            mobile:tools.getCookie('mobile')||'',//手机号
            code:'',
            mobilefa:false,
            codefa:false,
            other:false,
            submitcla:false,
        },
    },
    methods: {
        init(){
            let _self=this;
            //判断手机是否登陆
            if (check.isPhoneNumber(_self.getdata.mobile)) {
                _self.getdata.mobilefa = true;
                _self.getdata.codefa = true;
                _self.listshow = true;
                _self.loginshow = false;
            }
        },
        other(){
            let _self=this,a = _self.getdata
            if((a.carmodels!==''&& a.carmodels.indexOf('选择')===-1)&&(a.timebrand!==''&& a.timebrand.indexOf('选择')===-1)&&a.mileage!==''){
                a.other=true
            }else {
                a.other=false
            }
            if(a.other&&a.mobilefa&& a.codefa){
                a.submitcla=true;
            }else {
                a.submitcla=false;
            }
        },
        submit(){
            let _self=this
            _self.other()
            if (_self.getdata.submitcla){
                $.ajax({
                    url: ershoucheUrl + InterfaceUrl.CheckAndThread,
                    type: 'post',
                    data: {
                        carmodelsid:_self.getdata.carmodelsid,
                        timebrand:_self.getdata.timebrand,
                        mileage:_self.getdata.mileage,
                        cityid:_self.getdata.cityid,
                        mobile:_self.getdata.mobile,
                        code:_self.getdata.code,
                    },
                    success: function (res) {
                        if (res.Result){
                            location.href= ershoucheUrl +'valuation/detail?valid='+res.Data
                        }else {
                            tools.showAlert(res.Message);
                        }
                    }
                })
            }
            /*_self.getdata.other=true*/

        },

    },

})





//声明变量





