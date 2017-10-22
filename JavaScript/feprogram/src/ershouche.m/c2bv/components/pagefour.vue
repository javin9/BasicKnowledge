<template>
    <div>
        <div class="share_box">
            <div class="share_btn_wrap">
                <span class="seting-btn" @click="setingbtn">重新评估</span>
                <span class="share-btn" id="copy-target" data-clipboard-text="我在易鑫的贷款评估为{{sodata.if.easingnumtxt}}元，一起比比！{{shortLink}}" @click="copy">分享好友</span>
            </div>
            <!--<div id="biao1">我在易鑫车贷的信用评估额度<span>{{easingnum}}</span>万元，一起比比！+短链接</div>-->
            <p class="info">*车贷额度是根据您提交的资质进行测算的结果，仅供参考。<br><span>*重新评估可重新提交您的资质信息进行评估。</span> </p>
            <list v-bind:sodata="sodata" v-bind:channelurl="channelurl"></list>
        </div>
    </div>
</template>

<script>
  import check from 'libs/check/m.js';
  import list from './list.vue';
  import easing from './easing.vue';
  import Clipboard from 'clipboard'
  export default{
        name: 'house',
        props: ['sodata','channelurl'],
        data(){
            return {
                // 提交订单弹层
                carLayerVisible: false,
                mobileNumber:tools.getCookie('mobile')||'',
                mobileValidateCode: '',
                mobileNumberRight: false,
                getValidateCodeDisabled: false,
                getValidateCodeText: '获取验证码',
                getValidateCodeGap: 60,
                intervalValidateCode: null,
                submitBtnDisabled: false,
                //显示隐藏
                fourinfo:true,
                sharebox:true,
                 easingnumtxt:'',
                shortLink:'http://t.cn/RaTrELn',
                //channel==87添加?hidetype=7
                channelurl:tools.getUrlParam('channel'),
            }

        },
        components:{
            'easing':easing,
            'list':list,
        },
        questions:[],
        ready(){
            let _self=this
            ///*_self.easingnumtxt=_self.sodata.if.easingnumtxt*/

        },
        methods:{
            //重新评估
            setingbtn(){
                let _self=this,profes=this.$options.parent.$parent.professional,
                        monty=this.$options.parent.$parent.monthlyincome,
                        social=this.$options.parent.$parent.social,
                        credit=this.$options.parent.$parent.credit,
                        house=this.$options.parent.$parent.house,
                        carpri=this.$options.parent.$parent.carprice,
                        downpay=this.$options.parent.$parent.downpayment
                profes.forEach((val,i)=>{
                    profes[i].classname=''
                })
                monty.forEach((val,i)=>{
                    monty[i].classname=''
                })
                social.forEach((val,i)=>{
                    social[i].classname=''
                })
                credit.forEach((valCodePosition,i)=>{
                    credit[i].classname=''
                })
                house.forEach((valCodePosition,i)=>{
                    house[i].classname=''
                })
                carpri.forEach((valCodePosition,i)=>{
                    carpri[i].classname=''
                })
                downpay.forEach((valCodePosition,i)=>{
                    downpay[i].classname=''
                })
                $('.carprice div').attr('class','')
                this.sodata.if={
                    /**/
                    professional:false,//职业身份
                    monthlyincome:false,//每月收入(元)
                    social:false,//社保情况
                    credit:false,//信用记录
                    house:false,//住房情况
                    carprice:false,//车价对应值
                    downpayment:false,//首付系数
                    txt:'10秒极速评估',
                    easing:false,
                    login:false,
                    pageone:true,//第一页
                    pagetwo:false,//第二页
                    pagethree:false,//第三页
                    pagebefore:true,//前三页
                    pagefour:false,//第四页
                    fade:'conterbox',//动画
                    fadeone:true,//动画
                    fadetwo:true,//动画
                    fadethree:true,//动画
                    fadecarprice:false,//动画
                    listcarprice:'',//list-carprice
                    morehreflink:'',
                    //贷款额度:
                    easingNumber:'',
                    easingnumtxt:'',
                    //是否登陆
                    userlogin:this.sodata.if.userlogin||'',
                    loanuserid:'',
                }
                this.sodata.getdata = {
                    professional:'',
                    monthlyincome:'',
                    social:'',
                    credit:'',
                    house:'',
                    carprice:'',
                    downpayment:''
                }
                this.sodata.imgclass={
                    professional:'',
                    monthlyincome:'',
                    social:'',
                    credit:'',
                    house:'',
                    carprice:'',
                    downpayment:''
                }
                setTimeout(function () {
                    $('.carprice div').addClass('hook2 p_1')
                    _self.sodata.if.fadecarprice=false
                },500)
            },
            copy(){
                if(!Clipboard.isSupported()){
                    tools.showAlert('您的浏览器不支持一键复制', 3000)
                }else {
                    if (this.channelurl==='87'||this.channelurl===87){
                        this.shortLink='http://t.cn/RKBjp3q'
                    }
                    let clipboard = new Clipboard('#copy-target')
                    clipboard.on('success', function(e) {
                        tools.showAlert('链接复制成功', 3000)
                    })
                   setTimeout(function () {
                        clipboard.destroy();
                    },3100)
                }

            },


        },
    }
</script>
