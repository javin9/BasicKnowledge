<template>
  <component-header title="手机号绑定" :hide-back="true"></component-header>
  <mobile-verify :disabled="submiting" @submit="submit"></mobile-verify>
  <p>温馨提醒：手机号将作为易鑫统一登录账号，成功绑定后下次可通过手机号进行登录。</p>

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

  p{
    @include fsize(24);
    color:$light-color;
    padding:px2rem(20) px2rem(30);
  }
</style>

<script>
  import ComponentHeader from 'libs/header'
  import MobileVerify from 'libs/vue-components/mobile-verify'
  import SuccessModal from '../components/success-modal'

  export default {
    props: {
      thirdmark: String,
      unionid: String,
      openid: String,
      nickname: String,
      headportrait: String,
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
          CellPhone: data.mobile, 
          ValidateCode: data.authcode, 
          ThirdMark:this.thirdmark, 
          UnionID: this.unionid,
          OpenID: this.openid,
          NickName: this.nickname,
          HeadPortrait: this.headportrait
        }

        this.$http.post('/login/BindAccount', params).then(response => response.json().then(res => {
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