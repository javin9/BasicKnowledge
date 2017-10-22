/**
 * Created by liuhaiwei on 2017/3/23.
 */
import '../css/ershouche.scss';
import './index.scss';
import Vue from 'vue';
import carinfobox from './components/carbox.vue';
import login from './components/login.vue';
import information from './components/info.vue';
import check from 'libs/check/m.js';

let valid=[
    {data:[{text: '上班族',value: 76},{text: '事业单位',value: 73},{text: '企业主',value: 74},{text: '个体户',value: 75},{text: '自由职业',value: 77}],title:'职业身份',txt:'<span>请选择</span>',icon:'icon_1',defaultIndex:'-1'},
    {data:[{text: '3000以下',value:66 },{text: '3000-5000',value:67 },{text: '5000-8000',value:68 },{text: '8000-12000',value:69 },{text: '12000-20000',value:108 },{text: '20000以上',value:109 }],title:'收入情况',txt:'<span>请选择</span>',icon:'icon_2',defaultIndex:'-1'},
    {data:[{text: '信用良好',value:71 },{text: '无信用记录',value:256 },{text: '少数逾期',value:72 }],title:'社保情况',txt:'<span>请选择</span>',icon:'icon_3',defaultIndex:'-1'},
    {data:[{text: '租房',value:81 },{text: '有房有贷',value:80 },{text: '有房无贷',value:79 }],title:'住房情况',txt:'<span>请选择</span>',icon:'icon_4',defaultIndex:'-1'},
]
/*console.log(valid)*/
var wm = new Vue({
    el:'#infopage',
    ready(){
        this.init();
    },
    components: {
        'carinfobox': carinfobox,
        'login': login,
        'information': information,
    },
    template:`<carinfobox></carinfobox>
    <login v-bind:getdata="getdata" v-if="loginshow"></login>
    <div class="tip_txt">以下信息有助于顾问为您定制方案（选填）</div>
    <information v-bind:valid="valid" v-bind:getdata="getdata"></information>`,
    data:{
        valid:valid,
        loginshow:false,
        getdata:{//传送数据
            professional:'',//职业身份
            monthlyincome:'',//每月收入
            social:'',//社保情况
            house:'',//住房情况
            professionalid:professionalid||-1,//职业身份 id
            monthlyincomeid:monthlyincomeid||-1,//每月收入 id
            socialid:socialid||-1,//社保情况 id
            houseid:houseid||-1,//住房情况 id
            mobile:tools.getCookie('mobile')||'',
            code:'',
        },
    },
    methods: {
        init(){
            let _self=this;
            if (_self.getdata.professionalid!== -1){
                _self.valid[0].data.forEach((val,i)=>{
                    if (val.value==this.getdata.professionalid){
                        _self.valid[0].txt = this.getdata.professional=val.text
                        this.getdata.professionalid=val.value
                        _self.valid[0].defaultIndex=i
                    }
                })
            }
            if (_self.getdata.monthlyincomeid!==-1){
                _self.valid[1].data.forEach((val,i)=>{
                    if (val.value==this.getdata.monthlyincomeid){
                        _self.valid[1].txt=this.getdata.monthlyincome=val.text
                        this.getdata.monthlyincomeid=val.value
                        _self.valid[1].defaultIndex=i
                    }
                })
            }
            if (_self.getdata.socialid!==-1){
                _self.valid[2].data.forEach((val,i)=>{
                    if (val.value==this.getdata.social){
                        _self.valid[2].txt=this.getdata.social=val.text
                        this.getdata.socialid=val.value
                        _self.valid[2].defaultIndex=i
                    }
                })
            }
            if (_self.getdata.houseid!==-1){
                _self.valid[3].data.forEach((val,i)=>{
                    if (val.value==this.getdata.houseid){
                        _self.valid[3].txt=this.getdata.house=val.text
                        this.getdata.houseid=val.value
                        _self.valid[3].defaultIndex=i
                    }
                })
            }
            /**/
            //验证手机号是否是登陆用户
            if (check.isPhoneNumber(_self.getdata.mobile)) {
                _self.loginshow = false;
                _self.getdata.code= '000000';
            } else {
                _self.loginshow = true;
            }

        }

    },

})





//声明变量





