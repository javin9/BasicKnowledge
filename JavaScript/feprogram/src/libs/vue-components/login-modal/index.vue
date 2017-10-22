<template>
  <div class="modal" v-show="show" transition="slideup">
    <header>{{title}}</header>
    <div class="content">
      <mobile-verify 
        :mobile="mobile"
        :authcode="authcode"
        :show-icons="true" 
        :show-button="false" 
        :get-authcode-error-callback="getAuthcodeErrorCallback"
        :check-authcode-error-callback="checkAuthcodeErrorCallback"
        @update="sync"
      ></mobile-verify>
    </div>
    <footer>
      <p>{{errorMsg}}</p>
      <a href="javascript:void(0)" @click="submit" :class="{'disabled':disabled}">{{submitText}}</a>
    </footer>

    <a href="javascript:void(0)" class="close" @click="close"></a>
  </div>
  <mask transition="opacity" :click="close"></mask>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .opacity-transition {
    opacity:1;
    transition: all .3s ease;
  }
  .opacity-enter, .opacity-leave {
    opacity:0;
  }
  .slideup-transition {
    transform:translateY(0);
    transition: all .3s ease;
  }
  .slideup-enter, .slideup-leave {
    transform:translateY(100%);
  }

  .close{
    @include size(px2rem(80));
    position: absolute;
    right:px2rem(50);
    top:px2rem(-40);
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAkFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+IiIhtbW3n5+dLS0tgYGBfX1/////////////MeLxVAAAAMHRSTlMAFEVsk7rS3+z5CU2P0f7/AT+d8Qdo3XHlH7EeUu8GkhLFHNUn4nL///////9tlLs1L4gWAAAByklEQVR4AazSBdKjQBiE4Y7iNBp399z/dLu/29TAB8xTGuHFGiVa7U6317dsx7Gtfq/babdQn+v5Qcg/wsD3XNQQxUlKjTSJI1ST5QMWGuQZ5NzhiKVGQxdCnkURy4PEeEKxyRSlZnPKcT5DscWSFS0XKLBas7L1ClqbLWvYbqCx27OW/U5zfUpPXNxAhdWWtW1XUCzWbGCtvuslG1kqe2ZDfxY+nrOh+RQ/TdjYBD94NMDDF9eiAZaLTwcaMcSHbEQjRhne5TQkx5toQEMGEV7FNCbGq4TGJHjhpjQmdYtHfTydqTifjsXj9ql1ulyV4vl2OVHLBxBQ63x9K+q/UgRAK6SwKOgxbKFNCouCHtnGneKioMcOHhQXBT0+8KS0KOnxiT5FRWGPfViUFWU9WrApK95EPdpwKCvKenSMB2W3/HK/V+ktG38pxmdjeNi9/7TYAQEAAATAMNBB/6ZKTAf4r1dvovVx4OeLH1j+AvCT8m/UP3qPIh6WOM5x4PRIHIuh3WsFFx+tZl4evd56AfeJwEcMn1l8CPKpysc0n/t8kPTJ9CHq3oCAS42YYWc1LjoOjFM+dE//yQXE9Ieunj5s+kNfT5fg9AcA4pNLDwGoyUAAAAAASUVORK5CYII=) no-repeat center center;
    background-size: contain;
  }

  .modal{
    background: #fff;
    position: fixed;
    bottom:0;
    left:0;
    width: 100%;
    z-index: 10000;
  }

  header{
    @include fsize(30);
    color:$dark-color;
    text-align: center;
    line-height: px2rem(90);
  }

  .content{
    @include borderTop;
  }

  footer{
    box-sizing:border-box;
    padding:px2rem(30) 0 px2rem(50);
    position: relative;

    p{
      color:$main-color;
      padding:0 px2rem(30) px2rem(15);
      margin-top: px2rem(-15);
      line-height: 1.5;
      height: px2rem(30);
    }

    a{
      @include fsize(32);
      display: block;
      width: px2rem(690);
      background: $main-color;
      color:#fff;
      text-align: center;
      margin:0 auto;
      line-height: px2rem(90);
      border-radius:$main-border-radius;

      &.disabled{
        background: $disabled-color;
      }
    }
  }

</style>

<script>
  import MobileVerify from 'libs/vue-components/mobile-verify'
  import Mask from 'libs/mask'
  import check from 'libs/check/m'

  export default {
    props: {
      title: {
        type: String,
        default: '登录'
      },
      submitText: {
        type: String,
        default: '登录'
      },
      callback: {
        type: Function,
        default: function(){}
      },
      interface: {
        type: String,
        default: window.loginApiUrl || ''
      },
      ortherParams:{
        type:Object,
        default:{}
      },
      jsonp: {
        type: Boolean,
        default: false
      },
      codeParamName: {
        type: String,
        default : 'validateCode'
      },
      mobileParamName: {
        type: String,
        default: 'mobile'
      }
    },

    data () {
      return {
        mobile: '',
        authcode: '',
        errorMsg:'',
        submiting: false,
        show:false
      }
    },

    computed: {
      disabled(){
        return this.submiting || !check.isPhoneNumber(this.mobile) || !check.isAuthCode(this.authcode)
      }
    },

    events:{
      showLoginModal(){
        this.show = true
      }
    },

    watch:{
      show(value){
        const $body = $('body')
        const TOUCH_MOVE_EVENT = 'touchmove'

        if(value){
          this.$broadcast('showMask')
          $body.bind(TOUCH_MOVE_EVENT, e => e.preventDefault())
        }else{
          this.$broadcast('hideMask')
          $body.unbind(TOUCH_MOVE_EVENT)
        }
      }
    },

    methods:{
      getAuthcodeErrorCallback(){
        this.errorMsg = '请输入正确的手机号'
      },

      checkAuthcodeErrorCallback(){
        this.errorMsg = '请输入正确的验证码'
      },

      sync(mobile, authcode){
        this.mobile = mobile
        this.authcode = authcode
      },

      login(valid){
        const params = {}
        params[this.codeParamName] = this.authcode
        params[this.mobileParamName] = this.mobile
        Object.assign(params,this.ortherParams)
        const request = this.jsonp ? this.$http.jsonp.bind(this.$http) : this.$http.post.bind(this.$http);
        request(this.interface, this.jsonp ? {params} : params).then(response => response.json().then(res => {
          if(res.Result){
            this.show = false
            this.callback(res.Data)
          }else{
            this.errorMsg = res.Message
          }
          this.submiting = false
        }))
      },

      submit(){
        if(this.disabled){
          return false
        }

        this.submiting = true

        this.$broadcast('validateAuthcode', valid => {
          if(!valid){
            this.submiting = false
            return false
          }else{
             this.errorMsg = ''
             this.login()
          }
        })
      },

      close(){
        this.show=false
      }
    },

    ready(){
      $('input').focus(()=>this.errorMsg = '')
    },

    components:{
      Mask,
      MobileVerify
    }
  }
</script>