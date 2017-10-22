<template>
  <logo></logo>
  <cloud></cloud>
  <tree></tree>
  <car-track :power="power"></car-track>

  <div class="block-wrapper">
    <div class="block-button" v-if="!login">
      <a href="javascript:void(0)" @click="openLogin">登录查看我的加油进度</a>
    </div>
    <div class="block-button" v-if="login && powerFull">
      <a :href="myCouponUrl" v-if="alreadyReceived">查看我的优惠券</a>
      <a href="javascript:void(0)" v-if="showGrabButton" @click="grabCard">立即抢券</a>
      <button v-if="showEmptyButton">已抢光</button>
      <a href="javascript:void(0)" v-if="showCountDownButton" class="disabled">距离下次开抢还有{{countDownTime.hour}}:{{countDownTime.minute}}:{{countDownTime.second}}</a>
    </div>
    <div class="block-header" v-if="login">
      <p>{{username}}，{{powerText}}</p>
    </div>
    <div class="block-content">
      <p>邀请好友贷款购车，再送{{cardInfoValue}}元{{cardInfoName}}</p>
      <p>（邀请越多，优惠可叠加）</p>
    </div>
    <div class="block-footer" v-if="showShareButton">
      <a href="javascript:void(0)" @click="dispatchGoShare()">召唤小伙伴来加油</a>
    </div>
    <rule></rule>
  </div>

  <div class="share-wrapper" v-if="supportNativeShare && login">
    <h6></h6>
    <share-panel :options="shareOptions" :filter="shareFilter"></share-panel>
  </div>

  <div class="share-wrapper" v-if="showCopy">
    <h6></h6>
    <p>复制下方口令，粘贴发送给好友，好友点击链接，帮忙加油（如果复制失败，可长按文字，选择复制）</p>
    <div class="copy-text">【发福利】6月购车不用愁！我买车你加油！爱我你就多踩油儿，拜托了，朋友！点击链接： {{shortLink}} 立刻加油！</div>
    <a id="copy-target" data-clipboard-text="【发福利】6月购车不用愁！我买车你加油！爱我你就多踩油儿，拜托了，朋友！点击链接： {{shortLink}} 立刻加油！" @click="copy">复制口令</a>
  </div>

  <share :options="shareOptions" :qrcode-title="qtitle"></share>

  <login-modal title="登录并分享" :callback="loginCallback" :interface="loginInterface"></login-modal>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

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
    left:px2rem(1);

    .block-button{
      a{
        @extend %button;

        &.disabled{
          opacity: .6;
            color:rgba(255,255,255,.8);
        }
      }
      button{
        @include fsize(32);
        color:#fff;
        background: $disabled-color;
        border:0;
        padding:0;
        margin:0 auto px2rem(20);
        text-align: center;
        display: block;
        width: px2rem(600);
        height: px2rem(100);
        border-radius:px2rem(100);
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
      margin-top: px2rem(30);
      background: url(./images/content.png) no-repeat center top;
      background-size: contain;
      padding-bottom: px2rem(20);

      p{
        @include fsize(26);
        color:#f84372;
        text-align: center;
        line-height: 1.5;

        &:first-child{
          padding-top:px2rem(315);
        }
      }
    }

    .block-footer{
      text-align: center;
      a{
        @extend %button;
      }
    }
  }

  .share-wrapper{
    margin:0 px2rem(40);
    margin-bottom: px2rem(40);
    border-radius:px2rem(14);
    background: #fff;
    padding:0 px2rem(40) 0;
    text-align: center;

    h6{
      background: url(./images/title.png) no-repeat center center;
      background-size: px2rem(395);
      height: px2rem(100);
    }

    .share-panel-list{
      padding-bottom: px2rem(30) !important;
      margin-top: px2rem(10);
    }

    a{
      @extend %button;
    }

    p{
      @include fsize(26);
      color:$dark-color;
      text-align: left;
      line-height: $main-line-height;
    }

    .copy-text{
      @include fsize(26);
      @include border(#ffd2c5);
      color:#f84372;
      background: #fff2ef;
      text-align: left;
      line-height: $main-line-height;
      margin:px2rem(16) 0 px2rem(38);
      padding:px2rem(25) px2rem(10);
      border-radius:px2rem(10);
    }

    img{
      width: px2rem(162);
      height: px2rem(162);
      display: inline-block;
      margin:px2rem(18) auto px2rem(26);
    }
  }
</style>

<script>
import Share from 'libs/share'
import SharePanel from 'libs/share/panel'
import LoginModal from 'libs/vue-components/login-modal'
import browser from 'libs/share/util/browser'
import Clipboard from 'clipboard'
import Rule from '../components/rule'
import Cloud from '../components/cloud'
import Tree from '../components/tree'
import Logo from '../components/logo'
import carTrack from '../components/car-track'
import moment from 'moment'

export default {
  props:['shareUrl', 'cardInfoName', 'cardInfoValue', 'login', 'channel', 'shortLink' ,'loginInterface', 'power', 'username', 'forceOtherView', 'alreadyReceived', 'myCouponUrl', 'serverTime', 'isRemain', 'grabCardUrl', 'timeStart', 'timeEnd'],

  data () {
    const splitDate = date => date.split(':')
    const parseDateByArr = (arr) => moment().hour(+arr[0]).minute(+arr[1]).second(+(arr[2] || 0))

    // 服务器时间
    const timeArr = splitDate(this.serverTime)
    const currentDate = parseDateByArr(timeArr)

    // 活动开始时间
    const actTimeStartArr = splitDate(this.timeStart)
    const actTimeStartDate = parseDateByArr(actTimeStartArr)

    // 活动结束时间
    const actTimeEndArr = splitDate(this.timeEnd)
    const actTimeEndDate = parseDateByArr(actTimeEndArr)

    // 校验开始结束时间
    const isExpired = +currentDate >= +actTimeEndDate
    actTimeStartDate.add(isExpired ? 1 : 0, 'd')
    actTimeEndDate.add(isExpired ? 1 : 0, 'd')

    // 当前时间距离开始时间的时间差(秒)
    const difftime = actTimeStartDate.diff(currentDate, 'second')
    const diffFromStartToEnd = actTimeEndDate.diff(actTimeStartDate, 'second')

    return {
      shareFilter: ['wechat', 'timeline', 'qrcode'],
      ruleUrl: `/CouponCard/ActivityRule${document.location.search || ''}`,
      shareOptions: {
        title: '【易鑫6月购车节】我买车你加油！0息购车不用愁！',
        url: this.shareUrl || '',
        desc: '点击进入帮助好友完成加油任务，贷款购车更有首付立减、千元京东E卡壕礼相送！',
        image: 'http://img1.yixinfinance.com/jinrong/assets/66.jpg',
        beforeShare: function(cb){
          if(!this.login){
            this.loginShareCallback = () => cb(this.shareOptions)
            this.openLogin()
          }else{
            cb()
          }
        }.bind(this)
      },

      supportNativeShare: browser.isucBrowser() || browser.isqqBrowser(),

      isWeixin: browser.isWeixin(),

      isApp: tools.getCookie('YiXinAppInfo'),

      qtitle: `请朋友扫码，贷款后各得${this.cardInfoValue}元${this.cardInfoName}`,

      loginShareCallback: '',

      mobile: '',

      actTimeStartDate,
      currentDate,
      difftime,
      diffFromStartToEnd
    }
  },

  computed: {
    countDownTime(){
      const time = moment.duration(this.difftime, 's')
      const format = data => data < 10 ? `0${data}` : data
      return {
        hour: format(time.get('h') + time.get('d')*24),
        minute:format(time.get('m')),
        second: format(time.get('s'))
      }
    },

    timeValid(){
      // 在时间段内，定义为：
      // 服务器时间大于活动开始时间且服务器时间小于活动结束时间
      // difftime = 开始时间 - 服务器时间
      return this.difftime <= 0 && -this.difftime < this.diffFromStartToEnd
    },

    // 限时抢券按钮
    showGrabButton(){
      return this.powerFull && !this.alreadyReceived && this.timeValid && this.isRemain
    },

    // 已抢光按钮
    showEmptyButton(){
      return this.powerFull && !this.alreadyReceived && this.timeValid && !this.isRemain
    },

    // 倒计时按钮
    showCountDownButton(){
      return this.powerFull && !this.alreadyReceived && !this.timeValid
    },

    // 加油加满
    powerFull(){
      return this.power >= 66
    },

    // 展示进度描述
    powerText(){
      if(this.power <= 1){
        return `易鑫帮您加个油，您距离500元京东E卡优惠还差${6-this.power}人加油哦！`
      }
      if(this.power < 6 && this.power>1){
          return `您距离500元京东E卡优惠还差${6-this.power}人加油哦！`
      }
      if(this.power < 18){
        return `您已获得500元京东E卡优惠，距离1000元优惠还差${18-this.power}个人加油哦！`
      }
      if(this.power < 66){
        return `您已获得1000元京东E卡优惠，距离0息优惠还差${66-this.power}人加油哦！`
      }

      if(this.powerFull){
        return this.alreadyReceived ? `恭喜您已抢到0息优惠券！` : `您已获得领取0息优惠资格，每天早9点开抢~`
      }
    },

    // 默认视图
    isDefault(){
      return (this.isWeixin || this.isApp || this.channel) && !this.forceOtherView
    },

    // 显示分享按钮
    showShareButton(){
      return !this.supportNativeShare && !this.showCopy || !this.login
    },

    // 显示复制视图
    showCopy(){
      return !this.supportNativeShare && this.login && !this.isDefault
    }
  },

  watch:{
    timeValid(value ,preValue){
      if(!value && preValue){
        this.actTimeStartDate.add(1, 'd')

        this.difftime = this.actTimeStartDate.diff(this.currentDate, 'second')
      }
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
        // this.$broadcast('showShareLayer')
          window.location.href = this.shareUrl;
      }else{
        this.openLogin()
      }
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
      // 登录后直接刷新页面来更新状态
      window.location.reload()
      // this.login = true
      // this.shareOptions.url = data.ShareUrl
      // this.shortLink = data.ShortUrl
      
      // this.$broadcast('updateShare', this.shareOptions)
      // if(this.isWeixin){
      //   this.$dispatch('weixinShareUpdate', data.ShareUrl)
      // }

      // this.copyBind()

      // if(this.supportNativeShare){
      //   typeof this.loginShareCallback === 'function' ? this.loginShareCallback() : this.$broadcast('showShare', 'share')
      //   this.loginShareCallback = ''
      // }

      // if(this.forceOtherView){
      //   // 报价app符合isApp, 但是不跳走，需传入forceOtherView参数，强制走兜底方案
      //   tools.getLoginStatus()
      // }else if(this.isApp){
      //   tools.getLoginStatus(this.dispatchGoShare.bind(this))
      // }else if(this.isWeixin || this.channel){
      //   this.dispatchGoShare()
      // }
    },

    // 抢券
    grabCard(){
      this.$http.post(this.grabCardUrl).then(response => response.json().then(res => {
        if(res.Result){
          this.alreadyReceived = true
          tools.showAlert('恭喜您，成功抢到免息券')
        }else{
          tools.showAlert('抱歉，今天的券已被抢光')
          this.isRemain = false
        }
      }))
    }
  },

  created(){
   if(dev){
     // this.isWeixin = true
     this.login = true
     // this.supportNativeShare = true
   }

    setInterval(()=>{
      this.difftime -= 1
      this.currentDate.add(1, 's')
    }, 1000)

    // 浏览器下一步返回，从缓存中取页面，无登录状态，拿不到数据，需要重新刷一下页面
    tools.getLoginStatus(res => {
      this.mobile = res.Telphone
      if(!this.login && res.Islogin && !dev){
        window.location.reload()
      }
    })
  },

  compiled(){
    this.copyBind()
  },

  ready(){
    if(this.login){
      // TODO 需要等待图片加载完全后再进行动画
      setTimeout(() => this.$broadcast('startCarTrack'), 1000)
    }
  },

  components: {
		Share,
    SharePanel,
    LoginModal,
    Rule,
    Cloud,
    Tree,
    Logo,
    carTrack
	}
}
</script>