<template>
    <span v-if="isShowlayer">
        <span class="share-weixin" v-if="isWeixinrequest">
        </span>
        <span class="share-browser" v-else>
        </span>
        <div class="back-btn" @click="linkToActivity">返回我的加油进度</div>
    </span>
    <span v-else>
        <span v-if="isWeixinrequest">
            <logo></logo>
            <cloud></cloud>
            <tree></tree>
            <login-modal title="登录并分享" :callback="loginCallback" :interface="loginInterface" submitText="登录" :orther-params="loginParams"></login-modal>
            <car-track :power="power"></car-track>
            <div class="block-wrapper">
                <div class="block-button">
                  <a href="javascript:void(0)" @click="cheer" v-if="canCheer">帮他加油</a>
                  <a href="javascript:void(0)" v-else class="disabled">{{cheering ? '加油中...' : '已完成加油'}}</a>
                </div>
                <div class="block-header">
                  <p>{{powerDescription}}</p>
                </div>
                <div class="block-content">
                    <h6></h6>
                    <p>你的小伙伴已经在奔向0息购车的路上，接受邀请即可免费领取{{cardInfoValue}}元{{cardInfoName}}，更有下单即享首付立减6000元，0息优惠等你来拿！</p>
                </div>
                <div class="block-footer">
                    <button @click="getCoupon">免费领取</button>
                    <a href="javascript:void(0)" @click="linkToActivity">查看我的优惠</a>
                </div>
                <rule></rule>
            </div>
            <layer :title="layerTitle" :content="layerContent" @confirm="confirmHandler"></layer>
        </span>
        <div v-else class="weixin-wrapper">
            <div>
                <p>仅支持在微信中帮好友加油哦~</p>
                <p>请将页面分享到微信打开</p>
            </div>
        </div>
    </span>

</template>

<script>
    import layer from '../components/layer'
    import loginModal from 'libs/vue-components/login-modal'
    import Logo from '../components/logo'
    import Cloud from '../components/cloud'
    import Tree from '../components/tree'
    import Rule from '../components/rule'
    import carTrack from '../components/car-track'

    export default{
        props: ['orderApply','receiveCouponcard','helpVote', 'cardInfoName','sign', 'isShowlayer','cardInfoValue', 'loginInterface', 'power', 'weixinId', 'activityUrl', 'canCheer','isWeixinrequest'],
        data(){
            return {
                //用户手机号
                mobile: '',
                layerTitle:`您已获得${this.cardInfoValue}元${this.cardInfoName}`,
                layerContent:`完成下单，分享好友可再得${this.cardInfoValue}元${this.cardInfoName}无限领，更有首付立减6000元，好友助力加油疯抢0息优惠！`,
                loginCallback: function(){},
                loginParams:{
                    'sign': this.sign
                },
                loginState:false,

                // 是否加油中
                cheering:false
            }
        },

        computed: {
            // 展示用户名
            username(){
              return this.weixinId;
            },

            powerDescription(){
                if(this.power < 6){
                    return `再有${6-this.power}人帮忙加油，您的好友${this.username}可多享500元京东E卡`
                }
                if(this.power < 18){
                    return `再有${18-this.power}人帮忙加油，您的好友${this.username}可多享1000元京东E卡`
                }
                if(this.power < 66){
                    return `再有${66-this.power}人帮忙加油，您的好友${this.username}可获得领取0息优惠资格`
                }
                if(this.power >= 66){
                    return `您的好友${this.username}已获得领取0息优惠资格`
                }
            }
        },

        components:{
            layer,
            loginModal,
            Logo,
            Cloud,
            Tree,
            Rule,
            carTrack
        },

        events: {
            // 跑完圈后更改文案
            carTrackAnimateFinished(){
                this.cheering = false
            }
        },

        methods:{
            // 查看我的优惠链接句柄  返回加油进度
            linkToActivity(){
                if(dev){
                    console.log(`跳转活动主页:${this.activityUrl}`)
                }else{
                    window.location.href = this.activityUrl
                }
            },

            // 免费领取句柄
            getCoupon(){
                const cb = () => {
                    // TODO: 可能会传参数
                    // TODO: 回调需要根据返回判断C2是否满足返回条件
                    this.$http.post(this.receiveCouponcard,{sign:this.sign}).then(response => response.json().then(res => {
                        if(res.Result){
                            // this.layerTitle = ''
                            if(res.RowCount === 1){
                                this.layerTitle = `您已获得${this.cardInfoValue}元${this.cardInfoName}`;
                            }else{
                                this.layerTitle = "";
                            }
                            this.loginState = true;
                            this.openLayer();
                        }else{
                            tools.showAlert(res.Message)
                        }
                    }))
                }
                if(this.loginState){
                    cb()
                }else{
                    this.loginCallback = cb
                    this.openLogin()
                }
            },

            // 为他加油句柄
            cheer(){
                this.canCheer = false
                this.cheering = true
                //加油接口
                this.$http.post(this.helpVote,{'sign':this.sign}).then(response => response.json().then(res => {
                    if(res.Result){
                        this.power += 1;
                    }else{
                        tools.showAlert(res.Message);
                        this.canCheer = true;
                    }
                }))
            },

            openLayer(){
                this.$broadcast('openLayer')
            },

            openLogin(){
                // ios下软键盘切出会移动底层，底层滚动到底部减轻跳动现象
                const docH = $(document).height()
                const scrollH = $(window).scrollTop()+$(window).height()
                if(tools.browser.versions.iPhone && docH > scrollH){
                    window.scrollTo(0, docH)
                }
                this.$broadcast('showLoginModal')
            },

            confirmHandler(){
                window.location.href= this.orderApply;
            }
        },

        created(){
            if(dev){
                // this.login = false
            }

            // 浏览器下一步返回，从缓存中取页面，无登录状态，拿不到数据，需要重新刷一下页面
            tools.getLoginStatus(res => {
              this.mobile = res.Telphone;
              this.loginState = res.Islogin;
//              if(res.Islogin && !dev){
//                window.location.reload()
//              }
            })
        },

        ready(){
            // TODO 需要等待图片加载完全后再进行动画
            if(!this.isShowlayer){
                setTimeout(() => this.$broadcast('startCarTrack'), 1000)
            }

        }
    }
</script>

<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    .back-btn{
        color:#e9474d;
        @include fsize(32);
        width:px2rem(560);
        border:1px solid #e9474d;
        line-height:px2rem(100);
        position:absolute;
        top:px2rem(845);
        left:50%;
        text-align:center;
        transform: translate3d(-50%,0,0);
    }
    .share-browser,
    .share-weixin{
        background:#f5f5f5 url(images/share-weixin.png) no-repeat center px2rem(28);
        background-size:px2rem(611) px2rem(375);
        width:100%;
        height:100%;
        position:absolute;
        left:0;
        top:0;
    }
    .share-browser{
        background:#f5f5f5 url(images/share-browser.png) no-repeat center px2rem(28);
        background-size:px2rem(646) px2rem(262);
    }
    .weixin-wrapper{
        background:#fff;
        position:absolute;
        width:100%;
        height:100%;
        div{
            background:url(images/weixin.png) no-repeat center top;
            background-size:px2rem(168) auto;
            padding-top:px2rem(160);
            @include fsize(32);
            text-align:center;
            position:absolute;
            left:50%;
            top:50%;
            transform: translate3d(-50%,-50%,0);
            width:100%;
            color:#333;

            p{
                line-height: 1.5;
            }
        }
    }

    %button{
        @include fsize(32);
        display: inline-block;
        background: url(./images/button.png) no-repeat left top;
        width: 100%;
        height: px2rem(152);
        background-size: contain;
        line-height: px2rem(135);
        text-align: center;
        color:#fff;
    }

    .block-wrapper{
    background: #fff;
    margin: px2rem(1080) px2rem(40) px2rem(23);
    padding:0 px2rem(22) px2rem(40);
    border-radius:0 0 px2rem(14) px2rem(14);
    position: relative;

    .block-button{
      a{
        @extend %button;

        &.disabled{
            opacity: .6;
            color:rgba(255,255,255,.8);
        }
      }
    }

    .block-header{
      @include borderBottom;
      @include fsize(26);
      color:$normal-color;
      text-align: center;
      padding:0 px2rem(27) px2rem(27);
      line-height: $main-line-height;
    }

    .block-content{
        h6{
          background: url(./images/title2.png) no-repeat center center;
          background-size: px2rem(314);
          height: px2rem(100);
        }
        p{
            @include fsize(26);
            color:$dark-color;
            line-height: $main-line-height;
            padding:0 px2rem(16);
        }
    }

    .block-footer{
      text-align: center;

      button{
        @include fsize(32);
        border:0;
        @include border(#fc6950);
        padding:0;
        display: block;
        line-height: px2rem(100);
        border-radius:px2rem(100);
        color:#f84372;
        width: 100%;
        background: #fff;
        margin:px2rem(27) 0;
      }

      a{
        @include fsize(28);
        text-align: center;
        color:#f84372;
      }
    }
  }
</style>
