<template>
  <section class="wrapper">
    <additional-tip></additional-tip>
    <div class="form">
      <mortgage :initial-value="params.HasMortgage" :border="true" name="HasMortgage"></mortgage>
      <car :initial-value="initialCar" name="CarID" :border="true"></car>
      <carno name="LicensePlateNo" :border="true"></carno>
      <vin name="Vin" :car="initialCar.name" replace="CarID" :border="true" placeholder="请输入VIN码(非必需)"></vin>
      <datepicker name="date" :border="true" :min-year="carYear"></datepicker>
      <city :initial-value="initialCity" name="LicenseCityID" label="车辆所在地" placeholder="请选择车辆所在地" :border="true"></city>
      <mileage name="TenThousandKilometres" :has-feedback="true"></mileage>
    </div>
    <component-button text="查看评估报告" :disabled="!valid"></component-button>
    <p class="skip" v-if="skip">
      <a :href="skip">跳过</a>
    </p>
    <component-footer text="本服务由易鑫车贷提供"></component-footer>
  </section>
</template>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .wrapper{
    padding-bottom: px2rem(160);
    position: relative;
  }

  .form{
    margin:px2rem(20) 0 px2rem(32);
  }

  .skip{
    text-align: center;
    margin:px2rem(20) 0;

    a{
      @include fsize(24);
      color: $dark-color;
      position: relative;
      padding-right: px2rem(16);

      &:after{
        @include arrow(right, px2rem(12));
        content:' ';
      }
    }
  }
</style>

<script>
  import Car from '../../components/form/car'
  import Vin from '../../components/form/vin'
  import Mileage from '../../components/form/mileage'
  import Datepicker from '../../components/form/datepicker'
  import City from '../../components/form/city'
  import Carno from '../../components/form/carno'
  import Button from '../../components/form/button'
  import Footer from '../../components/footer'
  import additionalTip from '../components/additionalTip'
  import Mortgage from '../../components/form/mortgage';

  export default {
    props: {
      skip: {
        type: String,
        default: ''
      },
      orderId: {
        type: String,
        default: ''
      },
      carName: {
        type:String,
        default:''
      },
      carYear: {
        type: String,
        default: ''
      },
      carId: {
        type:String,
        default: ''
      },
      cityName: {
        type: String,
        default: ''
      },
      cityId: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        vinValid: true,

        initialCity: {
          id: this.cityId,
          name: this.cityName
        },

        initialCar: {
          id: this.carId,
          name: this.carName
        },

        params: {
          HasMortgage: false,
          CarID: this.carId,
          LicenseCityID: this.cityId,
          LicenseYear: '',
          LicenseMonth: '',
          TenThousandKilometres: '',
          ID: this.orderId,
          Vin: '',
          LicensePlateNo: ''
        }
      }
    },

    computed: {
      valid(){
        const valid = this.params.CarID && this.params.LicenseCityID && this.params.LicenseYear && this.params.LicenseMonth && (this.params.TenThousandKilometres > 0 && this.params.TenThousandKilometres < 100)

        // 输入vin则验证vin是否正确，未输入则非必填
        return !!this.params.Vin ? valid && this.vinValid : valid
      }
    },

    events:{
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
        if(this.valid){
          this.$http.post('/MortgageApply/UpdateTfOrder', this.params).then(response => response.json().then(res => {
            if(res.Result){
              if(dev){
                console.log(Object.assign({},this.params))
                console.log('提交成功')
              }else{
                document.location.href = `/PubPromotion/EvaluationReport/${res.Data}${document.location.search}`
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
      }
    },

    methods: {
    },

    components: {
      additionalTip,
      Car,
      Mortgage,
      Carno,
      Vin,
      Datepicker,
      City,
      Mileage,
      'component-button': Button,
      'component-footer': Footer
    }
  }
</script>