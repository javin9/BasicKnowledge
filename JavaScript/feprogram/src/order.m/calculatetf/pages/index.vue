<template>
  <!-- header -->
	<component-header :title="title" type="page"></component-header>

  <!-- 基本信息面板 -->
  <info v-ref:info></info>

  <!-- 输入面板 -->
  <sources v-ref:sources :price="$refs.info.price"></sources>

  <section class="pannel tel-pannel">
    <mobile-verify
      v-ref:verify
      :authcode-length = "4"
      :show-button="false"
      :mobile="params.Telephone" 
      :authcode="params.code" 
      @update="updateParams"
    ></mobile-verify>

    <p>*我们会将计算结果以短信的形式发送到您的手机</p>
    <div class="buttons">
      <a href="javascript:void(0);" id="submit" :class="{'disabled': !formValid || submiting}" @click="submit">开始计算</a>
    </div>
  </section>
  <!-- 跳转按钮 -->

  <!-- 结果面板 -->
  <result v-ref:result v-if="$refs.sources.tab === 1" :taxType="taxType" :price="$refs.info.price" :tax-type="$refs.sources.taxType" :finalrate="$refs.sources.finalrate" :payment="$refs.sources.payment" :first-price="$refs.sources.firstPrice" :must-cost="$refs.sources.mustCost" :payment-price="$refs.sources.paymentPrice" :tax-rate="$refs.sources.taxRate" :term="$refs.sources.term" :insurance-price="$refs.sources.insurancePrice" :open-result="isOpenResult"></result>


</template>

<style scoped>
@import '../vars';
@import '../mixin';
.tel-pannel {
  p {
    @include fsize(22)
    color: #F00;
    letter-spacing: 0;
    padding-top: px2rem(16);
    padding-left: px2rem(28);
    background-color: $background-color;
  }
  .buttons{
    display: block;
    background-color: $background-color;
    padding: px2rem(30);
    a{
      display: block;
      @include fsize(32);
      height: px2rem(104);
      line-height: px2rem(104);
      border-radius:px2rem(8);
      text-align: center;
      border-width:1px;
      border-style:solid;
      background-color: #EC4549;
      color: #fff;
      text-align: center;
      text-decoration: none;
      &.disabled{
        background: $disabled-color;
      }
    }
  }
}
</style>

<script>
import Header from '../components/header.vue'
import Info from '../components/info.vue'
import Sources from '../components/sources.vue'
import Result from '../components/result.vue'
import MobileVerify from 'libs/vue-components/mobile-verify'
import check from 'libs/check/m'

export default {
  data () {
    return {
    	title: '贷款购车计算器',
      isAppHide:Boolean(tools.isWebView() == 'yixinbjapp'),
      linkTarget:tools.getUrlParam("from") == "2158"?"_blank":"_self",
      isOpenResult: false,
      submiting: false,
      interfaceApi: order_creating_url,
      params: {
        Telephone:'',
        code: '',
        CarId: '',
        CityId: '',
        Channel: channel,
        Source: source,
        From:  tools.getCookie('form') || '',
        DownPaymentAmount: 0,//首付 
        FirstPaymentAmount: 0,//首次支付
        LoanAmount: 0,//贷款额度
        TotalInterest: 0,//贷款成本  
        TotalCost: 0,//总花费
        CarPrice: 0,//报价  
        DownPaymentRate: 0,//首付比 
        RepaymentPeriod: 0,//期限
        MonthlyPayment: 0,//月供
        RequiredCost: 0//必要花费 
      }
    }
  },

  computed:{
    mobileValid(){
      return check.isPhoneNumber(this.params.Telephone)
    },
    authcodeValid(){
      return check.isAuthcode(this.params.code)
    },
    formValid(){
      return this.mobileValid && this.authcodeValid
    }
  },


  methods: {
    updateParams(mobile, authcode){
      this.params.Telephone = mobile
      this.params.code = authcode
    },

    successCallback(valid){
      this.params.CarId = this.$refs.info.params.carId
      this.params.CityId = this.$refs.info.params.cityId

      this.params.DownPaymentAmount = this.$refs.sources.paymentPrice//首付 
      this.params.FirstPaymentAmount = this.$refs.sources.firstPrice//首次支付
      this.params.LoanAmount = this.$refs.result.loanAmount//贷款额度
      this.params.TotalInterest = this.$refs.result.loanCost//贷款成本  
      this.params.TotalCost = this.$refs.result.total//总花费
      this.params.CarPrice = this.$refs.info.price//报价  
      this.params.DownPaymentRate = this.$refs.result.payment//首付比 
      this.params.RepaymentPeriod = this.$refs.sources.term//期限
      this.params.MonthlyPayment = this.$refs.result.monthPayments//月供
      this.params.RequiredCost = this.$refs.result.mustCost//必要花费 

      this.$http.post(this.interfaceApi, this.params).then(response => response.json().then((res)=>{
        this.submiting = false
        if(!res.Result){
          tools.showAlert(res.Message);
          if(res.Message.indexOf("验证码")>=0){
              this.$broadcast("validateFail")
          }
        }else{
          // 调用子组件的events事件
          this.$broadcast('showResultFunc')
        }
      }))
    },
    
    submit(){
      if(this.submiting || !this.formValid){
        return false
      }
      this.submiting = true
      this.$broadcast("validateAuthcode", valid => {
        if(!valid){
          this.submiting = false
          return false
        }
        this.successCallback()
      });

    },
  },
  components: {
  	'component-header': Header,
    Info,
    Sources,
    Result,
    MobileVerify
  },
  created(){
    $('body').addClass('theme-' + (tools.getUrlParam('theme') || 'a'))
  }
}
</script>