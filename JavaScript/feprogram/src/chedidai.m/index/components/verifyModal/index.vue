<template>
  <div class="modal" v-show="show">
    <input type="hidden" :value="params.Mobile" id="mobile">
    <header>
      <span>短信验证码已发送至您的手机</span>
      <em>{{tel}}</em>
    </header>
    <div class="content">
      <label>
        <span>验证码</span>
        <input type="tel" :class="{'error': errorMsg !== ''}" placeholder="请输入验证码" v-model="authCode" @focus="this.errorMsg=''" maxlength="6">
      </label>
      <a href="javascript:void(0)" @click="getCode" id="GetValidateCode">获取验证码</a>
    </div>
    <footer>
      <p>{{errorMsg}}</p>
      <a href="javascript:void(0)" @click="submit" :class="{'disabled':disabled}">确定</a>
    </footer>
    <a href="javascript:void(0)" class="close" @click="show=false"></a>
  </div>
  <mask></mask>
</template>

<style>
  .mask{
    height:9999px !important;
  }
  .position{
    position: fixed;
    left:0;
    top:0;
    width: 100%;
  }
</style>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .close{
    @include size(px2rem(80));
    position: absolute;
    right:px2rem(50);
    top:px2rem(-40);
    background: url(./close.png) no-repeat center center;
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
    @include fsize(26);
    font-style:normal;
    padding:px2rem(40) px2rem(30) px2rem(20);

    span{
      color: $light-color;
    }

    em{
      color:$normal-color;
    }
  }

  footer{
    box-sizing:border-box;
    height:px2rem(178);
    padding:px2rem(68) 0 0;
    position: relative;

    p{
      color:$main-color;
      padding:px2rem(15) px2rem(30);
      position: absolute;
      left:0;
      top:0;
      line-height: 1.5;
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

  .content{
    @include borderTop;
    @include borderBottom;
    padding:px2rem(24) 0;
    display:flex;

    label{
      @include borderRight;
      @include fsize(30);
      flex:1;
      display: flex;
      align-items:center;
      overflow: hidden;


      span{
        color:$dark-color;
        padding:0 px2rem(50) 0 px2rem(30);
        display: block;
        white-space: nowrap;
      } 

      input{
        flex:1;
        border:0;
        background: #fff;
        display: block;

        &.error{
          color:$main-color;
        }
      }
    }

    a{
      @include fsize(26);
      @include border($main-color);
      padding:px2rem(8) 0;
      width:px2rem(170);
      text-align: center;
      line-height: $main-line-height;
      color:$main-color;
      margin:0 px2rem(27);
      display: inline-block;
      vertical-align: middle;
      white-space: nowrap;
      border-radius:px2rem(35);

      &.disable{
        color:$disabled-color;
        border-color:$disabled-color;
      }
    }
  }
</style>

<script>
  import Mask from 'libs/mask'
  import check from 'libs/check/m'
  import md5 from 'blueimp-md5'

  export default {
    data () {
      return {
        // 禁止提交(防止重复点击)
        disabled: false,

        show:false,
        tel: '',
        authCode:'',
        errorMsg: '',
        params:{},
        userStatus: {}
      }
    },

    events:{
      showAuthCode(data){
        this.userStatus = $(window).triggerHandler('getUserStatus')
        this.params = data
        this.params.Mobile = data.Mobile.replace(/\s/g,'')
        this.tel = data.Mobile.replace(/\s/g,'').replace(/^(\d{3})(\d{4})(\d{4})$/,'$1****$3')

        // 已登录状态且填写手机号与登录手机号相同，不需要获取验证码步骤，绕过组件主逻辑，直接生成订单
        if(this.userStatus.login && md5(this.params.Mobile) === this.userStatus.hashMobile){
          this.generateOrder()
        }else{
          this.show=true
          this.$nextTick(()=>{
            this.getCode()
          })
        }
      },

      disabledSubmit(){
        this.disabled = true
      },

      enabledSubmit(){
        this.disabled = false
      }
    },

    watch:{
      show(value){
        const CONTAINER_POS_CLASS = 'position'
        const $container = $('.page-container')
        const $body = $('body')
        const TOUCH_MOVE_EVENT = 'touchmove'

        if(value){
          this.reset()
          this.$broadcast('showMask')
          $body.bind(TOUCH_MOVE_EVENT, e => e.preventDefault())
          $container.addClass(CONTAINER_POS_CLASS)
        }else{
          this.$broadcast('hideMask')
          $body.unbind(TOUCH_MOVE_EVENT)
          $container.removeClass(CONTAINER_POS_CLASS)
        }
      }
    },

    methods:{
      reset(){
          this.errorMsg = ''
          this.authCode = ''
      },
      submit(){
        const msg = '请输入正确的验证码'

        if(this.disabled){
          return false
        }

        if(!this.authCode){
          this.errorMsg = msg
          return false
        }

        this.$dispatch('disabledSubmit')

        check.checkCode({
          number: this.authCode
        }, res =>{
          if(res.Result){
            this.errorMsg = ''

            // 已登录状态不需要登录动作，直接生成订单
            this.userStatus.login ? this.generateOrder() : this.login()
          }else{
            this.$dispatch('enabledSubmit')
            this.errorMsg = msg
          }
        })
      },

      login(){
          const params = {mobile: this.params.Mobile, line:550, mobileValidateCode: this.authCode}
          this.$http.jsonp(window.loginApiUrl, {params}).then(response => response.json().then(res => {
            if(res.Result){
              this.generateOrder()
            }else{
              this.$dispatch('enabledSubmit')
              tools.showAlert(res.Message)
            }
          }))
      },

      getCode(){
        check.getCode({}, res => {
          if(!res.Result){
            tools.showAlert(res.Message)
          }
        })
      },

      generateOrder(){
        this.$dispatch('disabledSubmit')
        this.$http.post('/MortgageApply/GenerateOrder', Object.assign({}, {Channel:tools.getUrlParam('channel') || '', From:tools.getUrlParam('from') || tools.getCookie('from') || ''}, this.params)).then(response => response.json().then(res => {
            this.$dispatch('enabledSubmit')
            if(res.Result){
              if(dev){
                console.log('生成订单成功' + `/Mortgage/AdditionalInfo/${res.Data}`)
              }else{
                this.show = false
                window.location.href = `/Mortgage/AdditionalInfo/${res.Data}`
              }
            }else{
              tools.showAlert(res.Message)
            }
          }))
      }
    },

    components:{
      Mask
    }
  }
</script>