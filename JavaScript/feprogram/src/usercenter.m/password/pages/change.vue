<template>
  <component-header title="修改密码"></component-header>
  <password-form @callback="submitHandler" v-if="showForm" v-bind:token="token" v-bind:authcode="authcode" :redirect-url="redirectUrl" :encryption="true"></password-form>
  <success-box v-if="showSuccessBox" :redirect-url="redirectUrl" :countdown="countdown"></success-box>
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
  import check from 'libs/check/m'
  import ComponentHeader from 'libs/header'
  import PasswordForm from '../components/password-form'
  import SuccessBox from '../components/success-box'

  const SUCCESS_STATUS = 'success'

  export default {
    props: {
      redirectUrl: {
        type: String,
      },
        authcode: String,
         token: String

    },

    data () {
      return {
        status: '',
        countdown:60,
      }
    },
    ready(){
    },
    computed:{
      showForm(){
        return this.status === ''
      },
      showSuccessBox(){
        return this.status === SUCCESS_STATUS
      }
    },
  
    methods: {
      submitHandler(){
        this.status = SUCCESS_STATUS
      }
    },

    components: {
      ComponentHeader,
      PasswordForm,
      SuccessBox
    }
  }
</script>