<template>
  <h1>输入手机号和兑换码，领取您的易鑫优惠~</h1>
  <section class="form">
    <mobile-verify 
      :authcode-length="6"
      :show-labels="false" 
      :show-button="false" 
      :mobile="params.mobile" 
      :authcode="params.validateCode" 
      @update="updateParams"
    ></mobile-verify>
    <ul>
      <li>
        <component-input placeholder="请输入兑换码"  v-model="params.cardNo"></component-input>
      </li>
    </ul>
  </section>
  <a href="javascript:void(0)" class="submit-button" :class="{'disabled': !formValid || submiting}" @click="submit">立即兑换</a>
</template>

<style>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';
  .component-mobile-verify.component-mobile-verify.component-mobile-verify{
    background: transparent;

    li{
      border:0;
      margin: 0 px2rem(40) px2rem(20);
      box-sizing:border-box;
      padding:0 px2rem(30);
      border-radius:px2rem(5);

      span:before{
        display: none;
      }
    }
  }
</style>
<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';

  h1{
    @include fsize(32);
    text-align: center;
    line-height: $main-line-height;
    color:#fff;
    font-weight: normal;
    padding:px2rem(22) 0 px2rem(42);
  }

  .form{
    li{
      display:flex;
      margin:0 px2rem(40) px2rem(40);
      box-sizing:border-box;
      padding:0 px2rem(30);
      background: #fff;
      height: px2rem(100);
      border-radius:px2rem(5);
      align-items: center;

      input{
        @include fsize(32);
        flex:1;
        display: block;
        border:0;
        padding:0;
        width:0;
      }
    }
  }
</style>

<script>
import MobileVerify from 'libs/vue-components/mobile-verify'
import check from 'libs/check/m'
import ComponentInput from 'libs/vue-components/elements/input'

export default {
  props:['interface'],
  data () {
    return {
      submiting: false,
      params: {
        mobile:'',
        validateCode: '',
        cardNo: ''
      }
    }
  },

  computed:{
    mobileValid(){
      return check.isPhoneNumber(this.params.mobile)
    },
    authcodeValid(){
      return check.isValidateCode(this.params.validateCode)
    },
    formValid(){
      return this.mobileValid && this.authcodeValid && this.params.cardNo
    }
  },

  methods: {
    updateParams(mobile, authcode){
      this.params.mobile = mobile
      this.params.validateCode = authcode
    },
    submit(){
      if(this.submiting || !this.formValid){
        return false
      }

      this.submiting = true
      this.$http.post(this.interface, this.params).then(response => response.json().then(res => {
        this.submiting = false
        if(res.Result){
          this.$router.go('/success')
        }else{
          tools.showAlert(res.Message);
          if(res.Message.indexOf("验证码")>=0){
              this.$broadcast("validateFail");
          }
        }
      }))
    }
  },

  created(){
  },

  components:{
    MobileVerify,
    ComponentInput
  }
}
</script>