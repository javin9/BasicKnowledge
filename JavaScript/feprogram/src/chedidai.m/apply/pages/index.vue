<template>
  <section>
    <div class="tip">{{isProduct?'申请车辆必须为无抵押状态，已抵押车辆不可贷款':'已抵押车辆仅可评估车辆价格，不可贷款'}}</div>
    <Name :initial-value="params.Name" name="Name" class="top-header" :has-feedback="true"></Name>
    <div class="form">
      <mortgage :initial-value="params.HasMortgage" name="HasMortgage" :border="true"></mortgage>
      <car :initial-value="initialCar" name="CarID" :readonly="!isProduct" :border="true" :disabled="componentsDisabled"></car>
      <vin name="Vin" :car="initialCar.name" replace="CarID" :border="true" :disabled="componentsDisabled"></vin>
      <datepicker name="date" :border="true" :min-year="initialCar.year" :disabled="componentsDisabled"></datepicker>
      <city :initial-value="initialCity" name="LicenseCityID" label="车辆所在地" placeholder="请选择车辆所在地" :border="true" :disabled="componentsDisabled"></city>
      <mileage name="TenThousandKilometres" :border="true" :has-feedback="true" :disabled="componentsDisabled"></mileage>
    </div>
    <component-button :description="description" :text="submitText" :disabled="!valid || componentsDisabled" :text-disabled="componentsDisabled"></component-button>
    <component-footer text="评估结果由精真估提供"></component-footer>
  </section>
</template>


<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .top-header{
    margin-bottom: px2rem(20);
    background: #fff;
  }

  .form{
    margin-bottom:px2rem(30);
  }
  .tip{
    background: #FFF4EA;
    line-height:px2rem(66);
    padding:0 px2rem(30);
    @include fsize(26);
    color: #FF8C39;
    text-align:left;
  }
</style>

<script>
  import Name from '../../components/form/name'
  import Car from '../../components/form/car'
  import Vin from '../../components/form/vin'
  import Mileage from '../../components/form/mileage'
  import Datepicker from '../../components/form/datepicker'
  import City from '../../components/form/city'
  import Mortgage from '../../components/form/mortgage'
  import Button from '../../components/form/button'
  import Footer from '../../components/footer'
  import check from 'libs/check/m'

  export default {
    props: {
      // isProduct === 0 先评后贷
      // isProduct === 1 放鑫融
      isProduct: Boolean,
      initialCar: Object,
      initialCity: Object,
      realName: {
        type: String,
        default: ''
      },
      orderId: {
        type:String,
        default: ''
      }
    },
    data () {
      return {
        componentsDisabled:false,
        description: this.isProduct ? '申请结果我们会以短信形式发送给您' : '评估结果我们会以短信形式发送给您',
        submitText: this.isProduct ? '获取贷款额度' : '查看评估报告',
        vinValid: true,

        params: {
          HasMortgage: false,
          CarID: this.initialCar.id,
          LicenseCityID: this.initialCity.id,
          LicenseYear: '',
          LicenseMonth: '',
          TenThousandKilometres: '',
          Name: this.realName,
          ID: this.orderId,
          Vin: ''
        }
      }
    },

    computed: {
      valid(){
        const valid = this.vinValid && check.isName(this.params.Name) && this.params.CarID && this.params.LicenseCityID && this.params.LicenseYear && this.params.LicenseMonth && this.params.Name && this.params.Vin && (this.params.TenThousandKilometres > 0 && this.params.TenThousandKilometres < 100)
        // if(dev){
        //   return true
        // }
        return valid
      }
    },

    events:{
      isComponentsDisabled(val){
        if(this.isProduct && val){
            this.submitText ='已抵押车辆不可贷款';
            this.componentsDisabled = true;
        }else{
            this.componentsDisabled = false;
            this.submitText =this.isProduct ? '获取贷款额度' : '查看评估报告';
        }
      },
      updateForm(name, value){
        // 日期取年月两值
        if(name === 'date'){
          this.params['LicenseYear'] = value.year
          this.params['LicenseMonth'] = value.month
          return false
        }

        // city返回的对象，取其id
        if(name === 'LicenseCityID'){
          value = value.id
        }

        // vin替换层需要carName, 通过initialCar来获取同步
        // car 返回对象，取其id
        if(name === 'CarID'){
          this.initialCar = value
          value = value.id
        }

        this.params[name] = value
      },

      submitForm(){
        if(this.valid || dev){
          this.$http.post('/MortgageApply/UpdateOrder', this.params).then(response => response.json().then(res => {
            if(res.Result){
              if(dev){
                console.log(Object.assign({},this.params))
                console.log('提交成功')
              }else{
                document.location.href = `/Mortgage/EvaluationReport/${res.Data}`
              }
            }else{
              tools.showAlert(res.Message)
            }
          }))
        }
      },

      // 更改car时需要重设DatePicker组件的最小年份
      setDatePicker(year){
        this.$broadcast('setDatePicker', year)
      },

      setVinValid(valid){
        this.vinValid = valid
      },

    },

    methods: {
    },

    components: {
      Name,
      Car,
      Vin,
      Datepicker,
      City,
      Mileage,
      Mortgage,
      'component-button': Button,
      'component-footer': Footer
    }
  }
</script>