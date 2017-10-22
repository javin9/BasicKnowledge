<template>
  <component-header :title="headerTitle" :hide-back="true" :more-link="headerLink" more-link-text="注册"></component-header>

  <mobile-verify 
    v-show="isAuthcodeView"
    :disabled="submiting" 
    :button-text="buttonText"
    :encryption="true"
    @submit="submitWithAuthcode" 
    :show-slide-verify="true"
    :get-slide-verify-api="getSlideVerifyApi"
    :check-slide-verify-api="checkSlideVerifyApi"
    :business-id="businessId"
  ></mobile-verify>
  <account-form 
    v-show="isPasswordView"
    :disabled="submiting" 
    :button-text="buttonText"
    :encryption="true"
    @submit="submitWithPassword" 
  ></account-form>

  <p v-if="isAuthcodeView" class="toggle-bar">
    <a href="javascript:void(0)" @click="showPasswordView">账号密码登录</a>
  </p>
  <p v-if="isPasswordView" class="toggle-bar">
    <a href="javascript:void(0)" @click="showAuthcodeView">手机号快捷登录</a>
    <a href="javascript:void(0)" :href="forgetPasswordLink">忘记密码?</a>
  </p>

  <third-login 
    :tp-sina="tpSina"
    :tp-qq="tpQq"
    :tp-jd="tpJd"
    :tp-yiche="tpYiche"
    ></third-login>

    <loading @close="closeLoading" v-if="loading"></loading>
</template>

<style>
  body{
    background: #fff;
  }
</style>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .toggle-bar{
    padding:px2rem(20) px2rem(30);
    overflow: hidden;

    a{
      @include fsize(28);
      text-decoration: none;
      color:$normal-color;
      float: left;

      &:nth-child(2){
        float:right;
      }
    }
  }
</style>

<script>
  import ComponentHeader from 'libs/header'
  import MobileVerify from 'libs/vue-components/mobile-verify'
  import ThirdLogin from '../components/third-login'
  import Loading from '../components/loading'
  import AccountForm from '../components/account-form'

  const VIEW_AUTHCODE = 'authcode'
  const VIEW_PASSWORD = 'password'

  export default {
    props: {
      headerLink: String,
      forgetPasswordLink: String,
      tpSina: String,
      tpQq: String,
      tpJd: String,
      tpYiche:String,
      redirectUrl: String
    },
    data () {
      return {
        buttonText: '登录',
        view: VIEW_AUTHCODE,
        submiting: false,
        loading: false,
        interface: '/Login/Login',
        getSlideVerifyApi:getSlideVerifyApi,
        checkSlideVerifyApi:CheckSign,
        businessId:businessid
      }
    },

    computed:{
      isAuthcodeView(){
        return this.view === VIEW_AUTHCODE
      },

      isPasswordView(){
        return this.view === VIEW_PASSWORD
      },

      headerTitle(){
        return this.isAuthcodeView ? '手机快捷登录' : '账号密码登录'
      }
    },
  
    methods: {
      showAuthcodeView(){
        this.view = VIEW_AUTHCODE
      },

      showPasswordView(){
        this.view = VIEW_PASSWORD
      },

      closeLoading(){
        this.loading = false
      },

      sendData(url){
        this.$http.jsonp(url)
      },

      submitWithAuthcode(data){
        if(!data){
          return false
        }

        this.submiting = true

        const params = {
          mobile: data.mobile,
          mobileValidateCode: data.authcode
        }

        this.$http.post(this.interface, params, {emulateJSON: true}).then(response => response.json().then(this.successCallback))
      },

      submitWithPassword(data){
        this.submiting = true

        const params = {
          mobile: data.mobile,
          password: data.password
        }

        this.$http.post(this.interface, params, {emulateJSON: true}).then(response => response.json().then(this.successCallback))
      },

      successCallback(res){
          this.submiting = false
          if(res.Result){
            this.loading = true
            this.sendData(res.Data)
            if(dev){
              console.log(this.redirectUrl)
            }else{
              setTimeout(()=>window.location.href = this.redirectUrl, 200)
            }
          }else{
            tools.showAlert(res.Message)
          }
      }
    },

    components: {
      ComponentHeader,
      MobileVerify,
      ThirdLogin,
      Loading,
      AccountForm
    }
  }
</script>