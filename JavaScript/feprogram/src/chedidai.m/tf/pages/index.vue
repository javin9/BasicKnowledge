<template>
    <component-header title="易鑫车抵贷" back="/"></component-header>
    <banner :amount="amount"  :name="carSerialname"></banner>
    <form>
      <car name="CarID" :initial-value="initialCar" :border="true"></car>
      <name name="Name" label="车主姓名" :initial-value="name" :border="true"></name>
      <tel name="Mobile" :initial-value="mobile" :border="needValidateCode"></tel>
      <validate-code name="authCode" v-if="needValidateCode" mobile-ref="Mobile"></validate-code>
    </form>
    <component-button text="先评估 后贷款" description="声明：易鑫承诺用户信息绝不会以任何形式泄露给其他人员或机构，仅用于申请抵押贷款。" description-position="bottom"></component-button>
    <component-footer text="本服务由易鑫车贷提供"></component-footer>
</template>


<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  form{
    margin:px2rem(20) 0 px2rem(30);
  }
</style>

<script>
  import Header from 'libs/header'
  import Banner from '../components/banner'
  import Car from '../../components/form/car'
  import Name from '../../components/form/name'
  import Tel from '../../components/form/mobile'
  import ValidateCode from '../../components/form/validatecode'
  import Button from '../../components/form/button'
  import Footer from '../../components/footer'
  import check from 'libs/check/m'
  
  export default {
    props:{
      amount: String,
      carName: String,
      carId: String,
      cityId: String,
      name: String,
      mobile:String,
      source:Number,
      from: String,
      channel: String,
      carSerialname: String
    },
    data () {
      return {
        initialCar:{
          name: this.carName,
          id: this.carId
        },

        authCode: '',

        params:{
          Name: this.name,
          CarID: this.carId,
          Mobile: this.mobile,
          Channel: this.channel,
          From: this.from,
          Source: this.source
        }
      }
    },

    computed: {
      needValidateCode(){
        // 车轮手机号与用户填写手机号相同
        return this.params.Mobile !== this.mobile || !check.isPhoneNumber(this.mobile)
      }
    },

    events: {
      updateForm(name, value){
        if(name === 'authCode'){
          this.authCode = value
          return false
        }

        // car 返回对象，取其id
        if(name === 'CarID'){
          value = value.id
          this.$broadcast('getAmount',value, this.cityId)
        }

        this.params[name] = value
      },

      submitForm(){
          new Promise(this.validateForm)
            .then(this.checkValidateCode)
            .then(this.generateOrder)
            .then(this.submitSuccess)
            .catch(this.submitFail)
      },

      validateForm(ref=''){
        // 来自获取验证码按钮的通知
        if(ref === 'Mobile' && !check.isPhoneNumber(this.params.Mobile)){
          tools.showAlert('请输入正确的手机号')
        }
        this.$broadcast('validateForm', ref)
      }
    },

    methods: {
      checkValidateCode(){
        if(!this.needValidateCode){
          return true
        }
        return new Promise((resolve, reject) => {
          check.checkCode({
            number: this.authCode
          }, res => res.Result ? resolve() : reject(res.Message))
        })
      },

      generateOrder(){
        return this.$http.post('/MortgageApply/AddTfMortOrder', this.params).then(response => response.json().then(res => {
          if(res.Result){
            return res.Data
          }else{
            return Promise.reject(res.Message)
          }
        }))
      },

      submitSuccess(orderId){
        if(dev){
          console.log(Object.assign({},this.params))
          console.log('提交成功')
        }else{
          document.location.href = `/PubPromotion/Apply/${orderId}${document.location.search}`
        }
      },

      submitFail(msg){
        tools.showAlert(msg)
      },

      validateForm(resolve, reject){
        this.$emit('validateForm')

        if(!this.params.CarID){
          return reject('请选择品牌车型')
        }

        if(!check.isName(this.params.Name)){
          return reject('请输入真实车主姓名')
        }

        if(!check.isPhoneNumber(this.params.Mobile)){
          return reject('请输入正确的手机号')
        }

        if(!this.authCode && this.needValidateCode){
          return reject('请输入验证码')
        }

        return resolve()
      }
    },
    compiled(){
      if(this.initialCar.id){
        this.$broadcast('getAmount',this.initialCar.id, this.cityId)
      }
    },

    components: {
      'component-header': Header,
      'component-button': Button,
      'component-footer': Footer,
      Banner,
      Car,
      Name,
      Tel,
      ValidateCode
    }
  }
</script>