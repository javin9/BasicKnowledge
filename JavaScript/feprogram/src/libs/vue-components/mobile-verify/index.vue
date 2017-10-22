<template>
  <div class="component-mobile-verify">
    <ul>
      <li v-if="readonly || mobileReadonly">
        <b 
          v-if="showIcons" 
          :style="{'backgroundImage': 'url(' + mobileIcon +')'}"
        ></b>
        <label v-if="showLabels">{{mobileLabel}}</label>
        <p>{{mobile}}</p>
      </li>
      <li v-if="!readonly && !mobileReadonly">
        <b 
          v-if="showIcons" 
          :style="{'backgroundImage': 'url(' + mobileIcon +')'}"
        ></b>
        <label v-if="showLabels">{{mobileLabel}}</label>

        <input type="tel" 
          v-model="mobile" 
          maxlength="11"
          :class="{'icon-clear': showMobileClear,'icon-err':isTextErrTip?showMobileErr:false}"
          :placeholder="mobilePlaceholder" 
          @focus="mobileFocusHandler" 
          @blur="mobileBlurHandler" 
          @touchstart="mobileTouchHandler"
        />
        <i v-if="showMobileErr"></i>
      </li>

      <li v-if="showImagecode" class="imagecode-wrapper">
        <label v-if="showLabels">{{imagecodeLabel}}</label>
        <input type="tel"
               v-el:imagecode
               v-model="imagecode"
               :maxlength="imagecodeLength"
               :class="{'icon-clear': showImagecodeClear, 'icon-err':isTextErrTip?showImagecodeErr:false}"
               :placeholder="imagecodePlaceholder"
               @focus="imagecodeFocusHandler"
               @blur="imagecodeBlurHandler"
               @touchstart="imagecodeTouchHandler"
        />
        <i v-if="showImagecodeErr"></i>
        <img :src='imageCodeSrc' src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=="  @click="getImageCode"/>
      </li>

      <li v-if="showAuthcode" v-show="showCodeInput" class="authcode-wrapper">
        <b v-if="showIcons" :style="{'backgroundImage': 'url('+authcodeIcon+')'}"></b>
        <label v-if="showLabels">{{authcodeLabel}}</label>

        <input type="tel" 
          v-el:authcode
          v-model="authcode" 
          :maxlength="authcodeLength" 
          :class="{'icon-clear': showAuthcodeClear, 'icon-err':isTextErrTip?showAuthcodeErr:false}"
          :placeholder="authcodePlaceholder" 
          @focus="authcodeFocusHandler" 
          @blur="authcodeBlurHandler" 
          @touchstart="authcodeTouchHandler"
          />
        <i v-if="showAuthcodeErr"></i>

        <span  id="getVCodeBtn" v-if="inCountdown">{{countdownLeave}}<font v-if="countDownType==='normal'">秒后获取</font><font v-else>s</font></span>

        <span  id="getVCodeBtn" v-if="!inCountdown && !(mobileValid && (showImagecode ? imagecodeValid : true))">{{authcodeButtonText}}</span>

        <a 
          v-if="!inCountdown && mobileValid && (showImagecode ? imagecodeValid : true)" 
          v-el:getcode
          id="getVCodeBtn"
          href="javascript:void(0)" 
          @click="getAuthCode" 
        >{{authcodeButtonText}}</a>
      </li>
    </ul>
    <div class="component-mobile-verify-button" v-if="showButton">
      <a href="javascript:void(0)" 
        :class="{'disabled': disabledButton}"
        @click="submit" 
      >{{buttonText}}</a>
    </div>
  <div class="hide"  v-if="showSlideVerify" id="capFrame"></div>
  </div>
</template>
<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';

  .component-mobile-verify{
    width: 100%;
    background: #fff;

    &-button{
      padding:px2rem(40) px2rem(30) px2rem(20);
      position: relative;

      a{
        &.disabled{
          background: $disabled-color;
        }

        @include fsize(32);
        display: block;
        text-decoration: none;
        text-align: center;
        line-height: px2rem(100);
        border-radius:px2rem(5);
        color:#fff;
        background: $main-color;
      }
    }

    li{
      @include borderBottom();
      background: #fff;
      margin:0 px2rem(30);
      display: flex;
      align-items: center;
      height: px2rem(100);
      position: relative;

      b{
        @include size(px2rem(36));
        display: block;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
        margin-right: px2rem(16);
      }

      label{
        @include fsize(32);
        color:$dark-color;
        display: block;
        width: px2rem(130);
        box-sizing:border-box;
      }
  input::-webkit-input-placeholder { 
    line-height:94%;
  }
      input, p{
        @include fsize(32);
        display: block;
        flex:1;
        border:0;
        padding:0;
        width:0;
      }

      input{
        height: 100%;
      }

      .icon-err{
        color:$main-color;
      }
      .icon-clear{
        @include icons(clear, false);
        background-position: right center;
      }

      i{
        @include icons(error);
        display: block;
      }

      a,span{
        @include fsize(24);
        @include border($main-color);
        border-radius:px2rem(3);
        color:$main-color;
        border-radius:px2rem(3);
        line-height:px2rem(48);
        width:px2rem(168);
        text-align:center;
        position: relative;
        margin-left: px2rem(40);

        &:before{
          content: ' ';
          @include borderLeft();
          height: px2rem(48);
          width: 0;
          position: absolute;
          left:px2rem(-30);
        }
      }

      span{
         @include border($disabled-color);
        color:#b2b2b2;
      }
    }
  }
</style>
<style>
  body iframe:last-child{
    position: fixed !important;
    top:50% !important;
    left:50% !important;
    transform:translate3d(-50%,-50%,0) !important;
  }
</style>
<script>
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import check from 'libs/check/m'
  import aes from "libs/aes" 	// 加密

  Vue.use(VueResource)

  export default {
    props:{
      countDownType:{
        type:String,
        default:'normal'
      },
      mobile: {
        type: String,
        default: ''
      },
      isTextErrTip:{
        type: Boolean,
        default: true
      },
      authcode: {
        type: String,
        default: ''
      },
      imagecode: {
        type: String,
        default: ''
      },
      imagecodeLength: {
        type: Number,
        default: 4
      },
      authcodeLength: {
        type: Number,
        default: 4
      },
      getcodeApi: {
        type: String,
        default: window.CODE_GETTING_URL || ''
      },
      checkcodeApi: {
        type: String,
        default: window.CODE_VALIDATING_URL || ''
      },
      imagecodeApi: {
        type: String,
        default: ''
      },
      showLabels: {
        type: Boolean,
        default: true
      },
      showButton:{
        type: Boolean,
        default: true
      },
      showImagecode:{
        type: Boolean,
        default: false
      },
      showSlideVerify:{
          type: Boolean,
          default: false
      },
      getSlideVerifyApi:{
          type:String,
          default: ''
      },
      checkSlideVerifyApi:{
          type:String,
          default: ''
      },
      businessId:{
          type:Number
      },
      buttonText: {
        type: String,
        default: '提交'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      showIcons: {
        type: Boolean,
        default:false
      },
      showCodeInput:{
        type: Boolean,
        default:true
      },
      mobileIcon: {
        type: String,
        default: require('./mobile.png')
      },
      authcodeIcon: {
        type: String,
        default: require('./authcode.png')
      },
      readonly: {
        type: Boolean,
        default: false
      },
      mobileReadonly:{
        type: Boolean,
        default: false
      },
      countdown:{
        type: Number,
        default: 60
      },
      line: {
        type: Number,
        default: 550
      },
      token: {
        type: String,
        default: $('input[name=__RequestVerificationToken]').val() || $('input[name=__RequestVerificationToken]').data('id') || ''
      },
      mobileLabel: {
        type: String,
        default: '手机号'
      },
      imagecodeLabel: {
        type: String,
        default: '图片验证码'
      },
      authcodeAutoHide: {
        type: Boolean,
        default: true
      },
      authcodeLabel: {
        type: String,
        default: '验证码'
      },
      authcodeButtonText: {
        type: String,
        default: '获取验证码'
      },
      mobilePlaceholder: {
        type: String,
        default: '请输入手机号'
      },
      imagecodePlaceholder: {
        type: String,
        default: '请输入图形验证码'
      },
      authcodePlaceholder: {
        type: String,
        default: '请输入验证码'
      },
      mobileErrorMsg: {
        type: String,
        default: '请输入正确的手机号'
      },
      authcodeErrorMsg: {
        type: String,
        default: '请输入正确的验证码'
      },
      imagecodeErrorMsg: {
        type: String,
        default: '请输入正确的图形验证码'
      },
      getAuthcodeErrorCallback: {
        type: Function,
        default: function(msg, mobile){
          tools.showAlert(msg)
        }
      },
      checkAuthcodeErrorCallback: {
        type: Function,
        default: function(msg, mobile){
          tools.showAlert(msg)
        }
      },
      encryption:{  // 是否加密
        type: Boolean,
        default: false
      }
    },

    data () {
      return {
        // 已登录手机号，默认传手机号参数，则该参数就为已登录手机号
        loginMobile: this.mobile || '',

        // 是否正在获取验证码倒计时
        inCountdown: false,

        // 验证码倒计时剩余秒数
        countdownLeave:this.countdown,

        // 验证码倒计时setInterval标识 
        INT_COUNT: '',

        // 是否显示图片验证码错误icon
        showImagecodeErr: false,

        // 是否显示验证码错误icon
        showAuthcodeErr: false,

        // 是否显示手机号错误icon
        showMobileErr: false,

        // 正在校验验证码
        validatingAuthcode: false,

        // focused
        mobileFocus: false,
        authcodeFocus: false,
        imagecodeFocus: false,

        // 图片验证码路径
        imageCodeSrc: '',
        //滑动验证码类型
        captype:1
      }
    },

    computed:{
      // authcodeAutoHide为false时永远显示验证码
      // 是否显示验证码， 满足以下条件
      // 1. 不能是只读模式
      // 2. 如果已登录情况，手机号输入不能与已登录手机号相同
      // 3. 手机号只读模式
      showAuthcode(){
        return !this.authcodeAutoHide || !this.readonly && (!this.loginMobile || this.loginMobile !== this.mobile) || this.mobileReadonly
      },
      // 手机号是否合法
      mobileValid(){
        return check.isPhoneNumber(this.mobile)
      },

      // 图形验证码是否合法
      imagecodeValid(){
        return (this.imagecode && this.imagecode.length === this.imagecodeLength)
      },

      // 验证码是否合法
      authcodeValid(){
        if(this.authcodeLength === 4){
          return check.isAuthcode(this.authcode)
        }else{
          return check.isValidateCode(this.authcode)
        }
      },

      // 是否显示清除图形验证码icon
      showImagecodeClear(){
        //return this.imagecode !== '' && !this.showImagecodeErr && this.imagecodeFocus
        return false;
      },

      // 是否显示清除验证码icon
      showAuthcodeClear(){
        return this.authcode !== '' && !this.showAuthcodeErr && this.authcodeFocus
      },

      // 是否显示清除手机号icon
      showMobileClear(){
        return this.mobile !== '' && !this.showMobileErr && this.mobileFocus
      },

      // 提交按钮是否禁用
      // 1. 父组件传值禁止
      // 2. 正在校验验证码
      // 3. 手机号不合法
      // 4. 需输入验证码情况下，验证码不合法
      disabledButton(){
        return this.disabled || this.validatingAuthcode || !this.mobileValid || this.showAuthcode && !this.authcodeValid
      }
    },

    watch:{
      mobile(value, prevalue){
        this.stopCountdown()
          if(this.showImagecode){
              this.$emit('update', value, this.authcode,this.imagecode)
          }else{
              this.$emit('update', value, this.authcode)
          }

      },
      authcode(value){
          if(this.showImagecode){
              this.$emit('update', this.mobile, value,this.imagecode)
          }else{
              this.$emit('update', this.mobile, value)
          }

      },
      imagecode(value){
        this.$emit('update', this.mobile,this.authcode,value)
        this.stopCountdown()
      }
    },

    events:{
      restoreDefault(){
          //恢复默认数据
          this.authcode=""
          this.mobile=""
          this.imagecode=""
          this.showIcons = false
          this.showMobileErr = false
          this.showImagecodeErr = false
          this.showAuthcodeErr = false
          this.stopCountdown();
      },
      validateFail(){
          this.showAuthcodeErr = true
      },
      // 校验验证码事件
      validateAuthcode(cb){
        const params = {
          mobile: this.encryption ? aes.encrypt(this.mobile) : this.mobile,
          validatecode: this.authcode,
          line: this.line,
          __RequestVerificationToken: this.token
        }

        this.validatingAuthcode = true

        this.track('codeclk', this.mobile)
        this.$http.post(this.checkcodeApi, params, {emulateJSON: true}).then(response => response.json().then(res => {
            if(!res.Result){
                this.showAuthcodeErr = true
                this.checkAuthcodeErrorCallback(res.Message, this.mobile)
            }
            this.validatingAuthcode = false
            typeof cb === 'function' && cb(res.Result)
        }))


      },
      // 提交成功统计
      trackSubmitSuccess(...args){
        this.track('sbtclk', this.mobile, '1', ...args)
      },

      // 提交失败统计
      trackSubmitFail(...args){
        this.track('sbtclk', this.mobile, '0', ...args)
      }
    },

    methods:{
      submit(){
        if(this.disabledButton){
          return false
        }

        const params = {
          mobile: this.encryption ? aes.encrypt(this.mobile) : this.mobile,
          authcode: this.showAuthcode ? this.authcode : '',
          loginMobile: this.encryption ? aes.encrypt(this.loginMobile) : this.loginMobile
        }

        // 没有验证码情况，无需校验验证码，只提交手机号参数
        if(!this.showAuthcode){
          this.$emit('submit', params)
        }else{
          // 正常模式需校验验证码
          this.$emit('validateAuthcode', valid => this.$emit('submit', valid && params))
        }
      },

      clearAuthcodeErr(){
        this.showAuthcodeErr = false
      },

      clearImagecodeErr(){
        this.showImagecodeErr = false
      },

      clearMobileErr(){
        this.showMobileErr = false
      },

      mobileFocusHandler(){
        this.mobileFocus = true
        this.clearMobileErr()
      },

      mobileBlurHandler(){
        this.mobileFocus = false
        if(!this.mobileValid && this.mobile){
          tools.showAlert(this.mobileErrorMsg)
          this.showMobileErr = true
        }
        this.track('mobblur', this.mobile)
      },

      authcodeFocusHandler(){
        this.authcodeFocus = true
        this.clearAuthcodeErr()
      },

      authcodeBlurHandler(){
        this.authcodeFocus = false
        if(!this.authcodeValid && this.authcode){
          tools.showAlert(this.authcodeErrorMsg)
          this.showAuthcodeErr = true
        }
      },

      imagecodeFocusHandler(){
        this.imagecodeFocus = true
        this.clearImagecodeErr()
      },

      imagecodeBlurHandler(){
        this.imagecodeFocus = false
        if(!this.imagecodeValid && this.imagecode){
          tools.showAlert(this.imagecodeErrorMsg)
          this.showImagecodeErr = true
        }
      },

      mobileTouchHandler(e){
        if(this.showMobileClear){
          const target = $(e.target)
          const offset = target.offset()
          const left = offset.left + offset.width - $(window).width() * 0.15
          const pageX = e.touches[0].pageX
          if(pageX >= left){
            this.mobile = ''
            e.preventDefault()
            return false
          }
        }
      },

      authcodeTouchHandler(e){
        if(this.showAuthcodeClear){
          const target = $(e.target)
          const offset = target.offset()
          const left = offset.left + offset.width - $(window).width() * 0.1
          const pageX = e.touches[0].pageX
          if(pageX >= left){
            this.authcode = ''
            e.preventDefault()
            return false
          }
        }
      },
      imagecodeTouchHandler(e){
        /* if(this.showImagecodeClear){
          const target = $(e.target)
          const offset = target.offset()
          const left = offset.left + offset.width - $(window).width() * 0.1
          const pageX = e.touches[0].pageX
          if(pageX >= left){
            this.imagecode = ''
            e.preventDefault()
            return false
          }
        } */
      },
      startCountdown(){
        this.inCountdown = true
        this.INT_COUNT = setInterval(() => {
          if(this.countdownLeave > 1){
            this.countdownLeave -= 1
          }else{
            this.stopCountdown()
          }
        },1000)
      },

      stopCountdown(){
        clearInterval(this.INT_COUNT)
        this.inCountdown = false
        this.countdownLeave = this.countdown
      },
      modifyDpr(){
          //修改Dpr
          var userAgent = window.navigator.userAgent;
          if (userAgent.match(/iphone/gi) || userAgent.match(/android/gi) || userAgent.match(/OS 9_3/)) {
              var doc = window.document,
                  docEle = doc.documentElement;
              docEle.setAttribute("data-dpr", "1");
              doc.body.style.fontSize = "12px"
              docEle.style.fontSize = docEle.getBoundingClientRect().width / 10 + "px";
              docEle.querySelector('meta[name="viewport"]').setAttribute("content", "initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no")
          }
      },
      getSlideVerifyUrl(tip){
          const params = {
              businessid:this.businessId
          }
          this.$http.post(this.getSlideVerifyApi,params).then(response => response.json().then(res => {
              if(res.Result && res.Data){
                  this.captype = res.Data.captype;
                  window.tencentCaptype = res.Data.captype;
                  window.businessId = this.businessId;
                  let dc = document.createElement("script");
                  dc.type = "text/javascript";
                  dc.async = true;
                  dc.src = res.Data.url;
                  let s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(dc, s);
              } else {
                if (tip) {
                  tools.showAlert(res.Message);
                }
              }
          }))
      },
      checkSildeVerifyUrl(){
          const params = {
              ticket:this.tencentTicket,
              mobile:this.mobile,
              line:this.line,
              captype:this.captype,
              businessid:this.businessId
          }
          this.$http.post(this.checkSlideVerifyApi,params).then(response => response.json().then(res => {
              if(!res.Result){
                tools.showAlert(res.Message);
                this.stopCountdown()
              }
          }))
      },
      getAuthCode(){
        if(this.mobileValid && this.showSlideVerify){
           $('#maskLayer').css({ display: 'block' })
            //显示腾讯验证码
            var capOption = {
                type: "popup",
                disturbLevel: 1,
                themeColor: "f1004d",
                showHeader:true,
                callback: (retJson)=>{
                    if (retJson.ret == 0) {
                         $('#maskLayer').css({ display: 'none' })
                        // 用户验证成功
                        this.tencentTicket = retJson.ticket;
                        this.checkSildeVerifyUrl()
                    } else {
                       $('#maskLayer').css({ display: 'none' })
                        //用户关闭验证码页面，去掉遮罩
                        this.stopCountdown()
                    }
                }
            };
            if(typeof(capInit) != "undefined"){
                capDestroy();
                capInit(document.getElementById("capFrame"), capOption);
            }else{
                this.getSlideVerifyUrl(true);
                setTimeout(()=>{
                    this.stopCountdown();
                },500)
            }
            this.startCountdown()
        }
        if(this.mobileValid && (this.showImagecode ? this.imagecodeValid : true) && !this.showSlideVerify){

          this.$els.authcode.focus()

          let params = {
            mobile: this.encryption ? aes.encrypt(this.mobile) : this.mobile,
            line: this.line,
            __RequestVerificationToken: this.token,
            codelen: this.authcodeLength
          }

          if (this.showImagecode) {
            params = {
              ...params,
              imageValidateCode: this.imagecode
            }
          }

          this.track('codeclk', this.mobile)
          this.startCountdown()
          this.$http.post(this.getcodeApi, params, {emulateJSON: true}).then(response => response.json().then(res => {
            if(!res.Result){
              this.getAuthcodeErrorCallback(res.Message, this.mobile)
              this.stopCountdown()
              if (this.showImagecode) {
                  this.getImageCode()
              }
            }
            this.$emit('getcodecomplete', res)
          }))

          if(tools.browser.versions.android){
            setTimeout(()=>{
              $(this.$els.authcode).focus()
            }, 100)
          }else{
            $(this.$els.authcode).focus()
          }
        }
      },
      
      getImageCode() {
        this.imageCodeSrc = `${this.imagecodeApi}?${(new Date()).getTime()}`;
      },

      track(...args){
        try {
          bc.evt.send('mobile', ...args)
        }catch(e){}
      }
    },
    
    ready() {
      if(this.showSlideVerify){
          //需要修改dpr
          this.modifyDpr();
          this.getSlideVerifyUrl();
      }
      if (this.showImagecode) {
        this.getImageCode()
      }
    }
  }
</script>