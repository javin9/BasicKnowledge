<template>
  <component-header title="分享有礼"></component-header>

  <section :class="{banner:true,banner2:isCouponCard}">
    <i v-if="isCouponCard" class="logo"></i>
    <p v-if="isCouponCard">邀请未下单好友，当TA成功放款提车，您和TA分别可得{{cardInfoValue}}元{{cardInfoName}}</p>
    <p v-else>邀请未下单好友，当TA成功放款提车，您和TA分别可得{{b1CardInfoValue + cardInfoValue}}元{{cardInfoName}}</p>
    <a :href="ruleUrl">查看活动规则</a>
  </section>

  <article v-if="supportNativeShare">
    <section class="share" v-if="supportNativeShare">
      <h6>请选择分享方式</h6>
      <share-panel :options="shareOptions" limit="3"></share-panel>
      <button @click="dispatchShare">更多分享方式</button>
    </section>
  </article>

  <article v-else>
    <section v-if="!forceOtherView && (isWeixin || isApp || channel)" class="share-wrapper">
      <div class="share-step">
        <div :class="{'share-step-pic':true,'share-step-pic2':isCouponCard}"></div>
        <footer>
          <button @click="dispatchGoShare()">立即分享</button>
        </footer>
      </div>
    </section>

    <section v-else class="share-wrapper">
      <div v-if="login">
        <div class="share-qrcode">
          <h6 class="share-way-title">
            <strong>分享方式一：</strong>
            <span>将二维码截屏保存，再发送给好友， 好友在微信中长按截图识别二维码，领取{{cardInfoName}}</span>
          </h6>
          <img :src="qrcode" v-if="qrcode">
        </div>

        <div class="share-copy">
          <h6 class="share-way-title">
            <strong>分享方式二：</strong>
            <span>复制下方口令，粘贴发送给好友，好友点击链接，领取{{cardInfoName}}（如果复制失败，可长按文字，选择复制）</span>
          </h6>
          <p>【发福利】贷款购车，易鑫车贷送您{{cardInfoValue}}元{{cardInfoName}}，点击链接： {{shortLink}} 立即领取！</p>
          <button id="copy-target" data-clipboard-text="【发福利】贷款购车，易鑫车贷送您{{cardInfoValue}}元{{cardInfoName}}，点击链接： {{shortLink}} 立即领取！" @click="copy">复制口令</button>
        </div>
      </div>

      <div v-else>
        <div class="share-step">
          <div :class="{'share-step-pic':true,'share-step-pic2':isCouponCard}"></div>
          <footer>
            <button @click="openLogin">立即分享</button>
          </footer>
        </div>
      </div>
    </section>
  </article>

  <share-list interface="/CouponCard/GetMyShareRecord" v-if="login"></share-list>

  <div class="placeholder" v-if="hasFixedFooter"></div>

  <share :options="shareOptions" :qrcode-title="qtitle"></share>

  <login-modal title="登录并分享" :callback="loginCallback" :interface="loginInterface"></login-modal>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  $main: #FBE74C;

  %button{
    @include fsize(32);
    text-align: center;
    background: #000;
    color:#fff;
    border-radius:px2rem(5);
    line-height: px2rem(100);
    background: #E9474D;
    border:0;
    display: block;
    width: 100%;
  }

  .placeholder{
    width: 100%;
    height:px2rem(140);
  }


  .logo{
    position: absolute;
    background: url(./images/logo.png) no-repeat left top;
    width: px2rem(165);
    height: px2rem(45);
    background-size: contain;
    left:px2rem(40);
    top:px2rem(30);
  }

  .banner{
    width: 100%;
    height:px2rem(620);
    background: url(./images/banner.jpg) no-repeat left top;
    background-size: contain !important;
    position: relative;
    &.banner2{
       background: url(./images/banner2.jpg) no-repeat left top;
    }
    p{
      font-size:px2rem(26);
      color:#fff;
      padding: px2rem(321) px2rem(100) 0;
      text-align: center;
      line-height: 1.5;
    }

    a{
      @include fsize(28);
      @include border($main, 2);
      position: absolute;
      width: px2rem(300);
      height:px2rem(70);
      line-height: px2rem(70);
      color:$main;
      border-radius:px2rem(5);
      left:50%;
      bottom:px2rem(90);
      transform:translateX(-50%);
      text-align: center;
    }
  }

  .share-wrapper{
    background: #fff;
    margin-bottom: px2rem(20);
  }

  .share{
    background: #fff;
    margin-bottom: px2rem(20);
    padding:px2rem(40) px2rem(30) px2rem(50);

    h6{
      @include fsize(30);
      text-align: center;
      color:$dark-color;
      font-weight: normal;
      padding:px2rem(20) 0 px2rem(50);
      line-height: 1.5;
    }

    button{
      @extend %button;
    }
  }

  .share-step{
    background: #fff;

    &-pic{
      padding:0;
      height:px2rem(618);
      background: url(./images/step.png) no-repeat center top;
      background-size:auto px2rem(618);
    }
    &-pic2{
      padding:px2rem(80) 0 px2rem(100);
      height:px2rem(657);
      background: url(./images/step2.png) no-repeat center px2rem(80);
      background-size: px2rem(636);
    }
    footer{
      @include borderTop;
      padding:px2rem(20) px2rem(30);
      position:fixed;
      left:0;
      bottom:0;
      width: 100%;
      background: #fff;
      z-index: 100;
      box-sizing:border-box;
    }

    button{
      @extend %button;
    }
  }

  .share-qrcode{
    text-align: center;
    background: #fff;
    padding:px2rem(60) px2rem(45) px2rem(50);

    img{
     @include size(px2rem(300)); 
     display: inline-block;
     padding:0;
     margin-top: px2rem(40);
    }

    p{
      color:#333;
      line-height: 1.5;
      display: inline-block;
    }
  }

  .share-copy{
    background: #fff;
    padding:0 px2rem(45) px2rem(78);

    p{
      @include fsize(26);
      @include border(#E9474D);
      background: #FEF6F6;
      color:#E9474D;
      line-height: 1.5;
      padding:px2rem(15);
      font-weight: normal;
      border-radius:px2rem(8);
      margin:px2rem(30) 0 px2rem(40);
    }

    button{
      @extend %button;
    }
  }

  .share-way-title{
    @include fsize(30);
    text-align: left;
    font-weight: normal;

    strong{
      font-weight: normal;
      color:#000;
    }

    span{
      color:$normal-color;
    }
  }
</style>

<script>
import Header from 'libs/header'
import Share from 'libs/share'
import SharePanel from 'libs/share/panel'
import ShareList from '../components/shareList'
import LoginModal from 'libs/vue-components/login-modal'
import QRCode from 'libs/qrcode'
import browser from 'libs/share/util/browser'
import Clipboard from 'clipboard'

export default {
  props:['shareUrl', 'cardInfoName', 'cardInfoValue', 'login', 'channel', 'shortLink' ,'loginInterface', 'forceOtherView'],
  data () {
    return {
      isCouponCard:window.location.href.toLocaleLowerCase().indexOf('couponcard')>=0,
      b1CardInfoValue:window.couponCard.B1CardInfoValue?window.couponCard.B1CardInfoValue + "元和":"",
      ruleUrl: (window.couponCard.RuleUrl?window.couponCard.RuleUrl:'/CouponCard/ActivityRule') + (document.location.search || ''),
      shareOptions: {
        title: `【发福利】你贷款购车，我送你${this.cardInfoValue}元${this.cardInfoName}`,
        url: this.shareUrl || '',
        desc: '福利来袭，易鑫助您轻松购车',
        image: 'http://img4.bitautoimg.com/jinrong/newmweb/images/pic300.jpg',
        beforeShare: function(cb){
          if(!this.login){
            this.loginShareCallback = () => cb(this.shareOptions)
            this.openLogin()
          }else{
            cb()
          }
        }.bind(this)
      },

      supportNativeShare: browser.isqqBrowser(),

      isWeixin: browser.isWeixin(),

      isApp: tools.getCookie('YiXinAppInfo'),

      qtitle: `请朋友扫码，贷款后各得${this.cardInfoValue}元${this.cardInfoName}`,

      qrcode: '',

      loginShareCallback: ''
    }
  },

  computed:{
    hasFixedFooter(){
      return !this.supportNativeShare && (this.isWeixin || this.isApp || this.channel || !this.login)
    }
  },

  events:{
    onPanelQrcode(){
      this.$nextTick(() => this.$broadcast('showShare', 'qrcode'))
    }
  },

  methods:{
    dispatchGoShare(){
      if(this.login){
        window.location.href = this.shareOptions.url
      }else{
        this.openLogin()
      }
    },

    dispatchShare(){
      if(this.login){
        this.openShare()
      }else{
        this.loginShareCallback = ''
        this.openLogin()
      }
    },

    openShare(){
      this.$nextTick(() => this.$broadcast('showShare', 'share'))
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

    copy(){
      if(!Clipboard.isSupported()){
        tools.showAlert('您的浏览器不支持一键复制，可长按红框文字选择复制!', 2800)
      }
    },

    copyBind(){
      if(Clipboard.isSupported()){
        const clipboard = new Clipboard('#copy-target')

        clipboard.on('success', function(e) {
          tools.showAlert('已复制（若复制失败，请尝试长按文字，选择复制）', 2800)
        })
      }
    },

    loginCallback(data){
      this.login = true
      this.shareOptions.url = data.ShareUrl
      this.shortLink = data.ShortUrl
      
      this.$broadcast('updateShare', this.shareOptions)

      this.buildQrcode()
      this.copyBind()

      if(this.supportNativeShare){
        typeof this.loginShareCallback === 'function' ? this.loginShareCallback() : this.$broadcast('showShare', 'share')
        this.loginShareCallback = ''
      }

      if(this.forceOtherView){
        // 报价app符合isApp, 但是不跳走，需传入forceOtherView参数，强制走兜底方案
        tools.getLoginStatus()
      }else if(this.isApp){
        tools.getLoginStatus(this.dispatchGoShare.bind(this))
      }else if(this.isWeixin || this.channel){
        this.dispatchGoShare()
      }
    },

    buildQrcode(){
      const qrcodeElement = new QRCode(document.createElement('div'), {
        text: `${this.shareOptions.url}`,
        width: 1000,
        height: 1000,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
      })

      this.$nextTick(()=>{
        this.qrcode = qrcodeElement._el.querySelector('canvas').toDataURL('image/png')
      })
    },

    // 浏览器下一步返回，从缓存中取页面，无登录状态，拿不到数据，需要重新刷一下页面
    refreshLoginStatus(){
     if($('body').data('userStatusReady')){
        if(!this.login && $(window).triggerHandler('getUserStatus').login){
          window.location.reload()
        }
      }else{
        setTimeout(this.refreshLoginStatus.bind(this),100)
      }
    }
  },

  created(){
    if(dev){
      // this.supportNativeShare = true
      // this.login=true
    }else{
      this.refreshLoginStatus()
    }
  },

  compiled(){
    this.buildQrcode()
    this.copyBind()

    if(dev){
      this.supportNativeShare = false
      this.$broadcast('showLoginModal')
      // this.login = true
      // this.isWeixin = true
      this.isApp = true
    }
  },


  components: {
    'component-header': Header,
		Share,
    SharePanel,
    ShareList,
    LoginModal
	}
}
</script>