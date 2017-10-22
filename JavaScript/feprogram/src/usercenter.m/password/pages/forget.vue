<template>
  <component-header 
    title="找回密码" 
    more-link-text="登录"
    :hide-back="true" 
    :more-link="headerLink" 
  ></component-header>

  <mobile-verify 
    v-if="showVerifyForm" 
    button-text="账户验证" 
    :disabled="submiting"
    @submit="verifyHandler"
  ></mobile-verify>

  <password-form 
    v-if="showPasswordForm"
    button-text="确认修改"
    :mobile="mobile"
    :token="token"
    :authcode="authcode"
    :is-find-back="true"
    :encryption="true"
    @callback="updatePwdHandler" 
  ></password-form>
  
  <success-box 
    v-if="showSuccessBox" 
    :title="successTitle"
    :auto-countdown="false"
    :redirect-url="redirectUrl"
  ></success-box>
</template>

<style>
  body{
    background: #fff;
  }
</style>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';
</style>

<script>
  import ComponentHeader from 'libs/header'
  import MobileVerify from 'libs/vue-components/mobile-verify'
  import PasswordForm from '../components/password-form'
  import SuccessBox from '../components/success-box'
  import aes from "libs/aes"

  const VERIFY_STATUS = 'verify'
  const PASSWORD_STATUS = 'password'
  const SUCCESS_STATUS = 'success'

  export default {
    props: {
      redirectUrl: String,
      headerLink: String
    },

    data () {
      return {
        status: VERIFY_STATUS,
        submiting: false,
        mobile: '',
        authcode: '',
        token:''
      }
    },

    computed:{
      showPasswordForm(){
        return this.status === PASSWORD_STATUS
      },
      showVerifyForm(){
        return this.status === VERIFY_STATUS
      },
      showSuccessBox(){
        return this.status === SUCCESS_STATUS
      },
      successTitle(){
        return `账号: ${this.mobile}`
      }
    },
  
    methods: {
      verifyHandler(data){
        if(!data){
          return false
        }
        this.submiting = true

        const params = {
          mobile: aes.encrypt(data.mobile),
          mobileValidateCode: data.authcode
        }

        this.$http.post('/ForgetPwd/FindPasswordSetpTwo', params, {emulateJSON: true}).then(response => response.json().then(res => {
          if(res.Result){
            this.token=res.Data;
            this.mobile = data.mobile
            this.authcode = params.mobileValidateCode
            this.status = PASSWORD_STATUS
          }else{
            tools.showAlert(res.Message)
          }
          this.submiting = false
        }))
      },
      updatePwdHandler(){
        this.status = SUCCESS_STATUS
      }
    },

    components: {
      ComponentHeader,
      MobileVerify,
      PasswordForm,
      SuccessBox
    }
  }
</script>