<template>
    <component-header title="在线审批" :back="userCenterUrl"></component-header>
    <div class="tip">您的资料已加密处理，仅用于申请分期</div>
    <div class="loan-limit">完成以下3步，立即获得<span>{{loanLimit}}</span>额度</div>
    <div class="item-list">
        <item v-for="item in listData" :title="item.title" :to-login-url="toLoginUrl" :sp-checking-url="spCheckingUrl" :describe="item.describe" :state="item.state" :item-id="item.id" :link="item.link"></item>
    </div>
    <!--分享有礼-->
    <div class="sharing-courtesy" @click="shareJump" v-if="shareData.isShareBox">
        <div v-if="isShare" class="share-btn">
            <div class="icon icon-share"></div>
            <div class="text">
                <div class="intro" v-text="shareData.shareLinkTxt"></div>
            </div>
            <div class="btn">去分享</div>
        </div>
        <div v-else class="no-share-btn">
            <div class="tit">分享有礼</div>
            <div class="intro">上传资料后<span v-text="shareData.shareLinkTxt"></span></div>
        </div>
    </div>
    <div class="contact-info">如有疑问或贷款咨询，点击拨打电话<a href="tel:4000169169">4000-169-169</a></div>
    <mask></mask>
    <vue-alert :content="alertParam.content" :btns="alertParam.btns" :after-close="alertParam.afterClose" :loading="alertParam.loading" :show="alertParam.show"></vue-alert>
</template>

<script type="text/ecmascript-6">
    import ComponentHeader from 'libs/header/index.vue';
    import {stateConfig} from '../stateConfig';
    import Item from '../components/item.vue';
    import VueAlert from '../components/vueAlert.vue'
    import Mask from 'libs/mask'

    export default{
        props: {
            //获取卡卷接口
            cardInterface:{
                type:String,
                default:''
            },
            userCenterUrl:{
                type:String
            },
            cityId:{
                type:Number,
                default:0
            },
            packageId:{
                type:Number,
                default:0
            },
            cardfrom:{
                type:Number,
                default:0
            },
            step:{
                type:Number,
                default:0
            },
            loanLimit:{
                type:String,
                default:'0万'
            },
            //基本信息页面
            basicInfoLink:{
                type:String,
                default:''
            },
            //上船身份证页面
            identityAuthLink:{
                type:String,
                default:''
            },
            //运营商验证接口
            spCheckingUrl:{
                type:String,
                default:''
            },
            docType:{
                type:String,
                default:''
            },
            //为登录跳转
            toLoginUrl:{
                type:String,
                default:''
            }
        },
        data(){
            return {
                alertParam: {
                    content: '<h3>提交成功！</h3><p style="position:relative;white-space:nowrap;" class="font-title">请保持手机畅通，等候贷款顾问联系<br/>下载易鑫集团App查看申请进度</p>',
                    btns: [{
                        text: '完成',
                        todo: ()=>{
                            var cookieString = "onlineApprovalLayerClose=" + tools.getUrlParam("orderId") + ";path=/;domain=" + tools.wildcardUrl();
                            document.cookie = cookieString;
                            this.alertParam.show = false;
                            window.location.href = user_center_url + '/CouponCard/Index?cardfrom=' + this.cardfrom;
                        }
                    },{
                        text: '立即下载',
                        todo: ()=>{
                            this.alertParam.show = false;
                            window.location.href = xin_che_url+'/app/down/?from=1172'
                        },
                        className: ['active']
                    }],
                    afterClose: function() {},
                    show: false,
                    loading: false
                },
                shareData:{
                    isShareLink:false,
                    shareLinkTxt:'上传资料后邀请好友可得1000元京东E卡',
                    shareLink:'',
                    isShareBox:false,
                },
                basicInfoState:stateConfig.notAuthentication,
                identityAuthState:stateConfig.notAuthentication,
                operatorState:stateConfig.notAuthentication,
                isShare:false
            }
        },
        components: {
            ComponentHeader,
            Item,
            VueAlert,
            Mask
        },
        methods: {
            elasticLayer(){
                if(tools.isWebView()){
                    this.alertParam.content = '<h3>提交成功！</h3><p style="position:relative;white-space:nowrap;" class="font-title">请保持手机畅通，等候贷款顾问联系</p>'
                    this.alertParam.btns = [{
                        text: '完成',
                        todo: ()=>{
                            var cookieString = "onlineApprovalLayerClose=" + tools.getUrlParam("orderId") + ";path=/;domain=" + tools.wildcardUrl();
                            document.cookie = cookieString;
                            this.alertParam.show = false;
                            window.location.href = user_center_url + '/CouponCard/Index?cardfrom=' + this.cardfrom;
                        }
                    }];
                }
            },
            shareJump(){
                //分享跳转
                if(this.isShare){
                    location.href = this.shareData.shareLink;
                }
            },
            changeState(basicInfoState,identityAuthState,operatorState){
                this.basicInfoState = basicInfoState;
                this.identityAuthState = identityAuthState;
                this.operatorState = operatorState;
            },
            initState(){
                //0：一步都未完成，1：完成填写常住地址，2：完成工作单位，3：完成联系人，20：完成上传身份证，30：完成运营商验证
                switch(this.step)
                {
                    case 0:
                    case 1:
                    case 2:
                        this.changeState(stateConfig.authentication,stateConfig.notAuthentication,stateConfig.notAuthentication)
                        break;
                    case 3:
                        this.changeState(stateConfig.authenticated,stateConfig.authentication,stateConfig.notAuthentication)
                        break;
                    case 20:
                        this.changeState(stateConfig.authenticated,stateConfig.authenticated,stateConfig.authentication)
                        break;
                    default:
                        this.changeState(stateConfig.authenticated,stateConfig.authenticated,stateConfig.authenticated)
                        break;
                }
            },
            getCarVolume(){
                this.$http.post(this.cardInterface,{
                    'cardfrom':this.cardfrom,
                    'cityId':this.cityId,
                    'packageId':this.packageId
                }).then(response=>response.json().then(res=>{
                    if(res.Result){
                        this.shareData.isShareLink = true;
                        this.shareData.shareLink = res.Data.ActivityLink;
                        this.shareData.shareLinkTxt = '邀请好友可得'+res.Data.CardValue +'元'+res.Data.CardName;
                        this.shareData.isShareBox = true;
                    }
                }))
            }
        },
        computed: {
            listData(){
                return [
                    {
                        title:'基本信息',
                        describe:'填写申请人基本信息',
                        state:this.basicInfoState,
                        link:this.basicInfoLink,
                        id:0
                    },
                    {
                        title:'身份认证',
                        describe:'上传身份证正反面，信息加密传输',
                        state:this.identityAuthState,
                        link:`${this.identityAuthLink}?docType=${this.docType}`,
                        id:1
                    },
                    {
                        title:'运营商认证',
                        describe:'发送验证码，认证手机号真实性',
                        state:this.operatorState,
                        link:'',
                        id:2
                    }
                ];
            }
        },
        ready(){
            if(this.step===30){
                if(tools.isWebView() === "yixinapp"){
                    tools.jsNativeBridge("showSpecialBtn",{"status" : "yes"});
                }
                this.isShare = true;
            }else{
                this.isShare = false;
            }
            //判断弹层是否显示
            if(tools.getUrlParam('popup') === "1" && tools.getCookie("onlineApprovalLayerClose") !== tools.getUrlParam("orderId")){
                this.alertParam.show = true;
            }
            this.elasticLayer();

            this.initState();
            //获取卡卷
            this.getCarVolume();
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    .tip{
        @include fsize(26);
        color: #FF8C39;
        background: #FFF4EA;
        line-height:150%;
        padding:px2rem(13) px2rem(30);
    }
    .loan-limit{
        @include fsize(36);
        color: #333333;
        line-height:150%;
        padding:px2rem(46) px2rem(30);
        background:#fff;
        span{
            color:#E9474D;
        }
    }
    .item-list{
        background:#fff;
        padding-left:px2rem(30);
    }
    .contact-info{
        @include fsize(26);
        color: #686868;
        padding:px2rem(20) px2rem(30);
        a{
            color: #5A67AE;
            margin-left:px2rem(10);
            text-decoration: underline;
        }
    }
    /*分享样式*/
    .sharing-courtesy {
        position: relative;
        padding:px2rem(30);
        background: #FFFFFF;
        margin-bottom: 1px;
        overflow: hidden;
        margin-top:px2rem(20);
        line-height:150%;
        &>div{
            display:flex;
            align-items: center;
        }
        .no-share-btn{
            .tit{
                @include fsize(30);
                color: #333;
                white-space:nowrap;
            }
            .intro{
                flex:1;
                color:#999;
                @include fsize(28);
                margin-left:px2rem(20);
            }
        }
        .btn{
            position:absolute;
            right:px2rem(30);
            padding-right: px2rem(30);
            top:50%;
            transform: translate3d(0,-50%,0);
            color:#E9474D;
            @include fsize(30);
            &:after{
                 content: '';
                 box-sizing: border-box;
                 position: absolute;
                 top: 50%;
                 right: 0;
                 width: px2rem(16);
                 height: px2rem(16);
                 border-top: 1px solid #666666;
                 border-right: 1px solid #666666;
                 margin-top: px2rem(-8);
                 transform-origin: 50% 50%;
                 transform: rotate(45deg);
                 margin-right: px2rem(4);
             }
        }

        .icon {
            background-image: url(../images/share_icon.png);
            width: px2rem(60);
            height: px2rem(60);
            background-repeat: no-repeat;
            background-position: center center;
            background-size: cover;
            margin: px2rem(15) 0;
        }
        .icon-share {
            background-image: url(../images/share_icon.png);
            background-size: px2rem(35) px2rem(46);
            margin: px2rem(15) 0;
        }
        .text {
            margin-left: px2rem(20);
            margin-right: px2rem(152);
            .tit {
                @include fsize(30);
                line-height: px2rem(46);
                margin-bottom: px2rem(4);
                color: #000000;
            }
            .intro {
                @include fsize(30);
                color: #333;
            }
        }
    }
</style>
