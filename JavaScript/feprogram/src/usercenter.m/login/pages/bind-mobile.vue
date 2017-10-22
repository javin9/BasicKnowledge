<template>
  <component-header title="绑定手机"></component-header>
  <mobile-verify :disabled="submiting" @submit="submit"></mobile-verify>
  <success-modal v-if="showSuccess">绑定成功!</success-modal>
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
  import SuccessModal from '../components/success-modal'

  export default {
    props: {
      from: String,
      userid: String,
      redirectUrl: String
    },
    data () {
      return {
        submiting: false,
        showSuccess: false
      }
    },
  
    methods: {
      submit(data){
        if(!data){
          return false
        }

        this.submiting = true

        const params = {
          Mobile: data.mobile, 
          ValidateCode: data.authcode, 
          From:this.from, 
          UserId: this.userid
        }

        this.$http.post('/login/BindMobile', params).then(response => response.json().then(res => {
          if(res.Result){
            this.showSuccess = true
            if(dev){
              console.log(this.redirectUrl)
            }else{
              setTimeout(()=>window.location.href=this.redirectUrl,3000)
            }
          }else{
            tools.showAlert(res.Message)
            this.submiting = false
          }
        }))
      }
    },

    components: {
      ComponentHeader,
      MobileVerify,
      SuccessModal
    }
  }
</script>