<template>
	<component-header title="登录并申请"></component-header>
  <section>
    <mobile-verify :mobile="params.Telephone" @submit="submit" :disabled="submiting"></mobile-verify>
    <div class="InfoUsing" @click="InfoUsing">提交即表示您已同意<span>《信息使用授权书》</span></div>
  </section>
</template>

<style>
  @import 'sassHelper/mixin';
  body{
    background: #fff;
  }
</style>
<style scoped>
  @import 'sassHelper/mixin';

  .sec_insurance { @include fsize(24); display: flex; position:relative; align-items: center;
    margin-bottom: 0.26667rem; padding: 0 0 0 0.32rem; background-color: #fff; }
  .sec_insurance b { color: #5fc3e8; font-weight: normal; }
  .sec_insurance i { display: inline-block; width: 0.613333rem; height: 0.613333rem; background: url(../images/icon.png) -0.546667rem -4.973333rem no-repeat; -webkit-background-size: 6.8rem 8.613333rem; background-size: 6.8rem 8.613333rem; vertical-align: middle; }
  .sec_insurance i.cur { background-position: -0.546667rem -4.28rem; }
  .InfoUsing {
    @include fsize(24);
    color: #999;
    line-height: px2rem(36);
    padding: 0 0 px2rem(30) px2rem(30);
    background: #fff;
    span {
      color: #6D7DBC;
    }
  }
</style>

<script>
import Header from 'libs/header'
import check from 'libs/check/m'
import MobileVerify from 'libs/vue-components/mobile-verify'

export default {
  data () {
    const initParams = {}
    $('input[type="hidden"]').each((index,elem) => {
      initParams[elem.name] = elem.value
    })

    return {
      submiting: false,
      params: Object.assign({}, initParams, {
        Telephone: window.mobile || '',
        code: '',
        isFromShopCGBBank:window.isFromShopCGBBank,
        isFromCITICBank:window.isFromCITICBank
      })
    }
  },

  methods: {

    insurance(){
      this.params.IsSelectedInsurance = !this.params.IsSelectedInsurance
    },

    submit(data){
      if(!data){
        return false
      }
      
      this.params.Telephone = data.mobile
      this.params.code = data.authcode

      this.submiting = true

      this.$http.post(order_creating_url, this.params, {emulateJSON:true}).then((response) => {
        response.json().then((res) => {
          if(res.Result) {
            if(dev){
              console.log('提交成功')
            }else{
              window.location.href = res.Data.RedirectUrl
            }
          } else {
            tools.showAlert(res.Message)
            this.submiting = false
          }
        })
      })
    },

    InfoUsing(e){
        tools.serviceProvision({
            'url':'/home/InfoUsingAuthorization',
            'title':'信息使用授权书',
          })
          e.preventDefault();
          e.stopPropagation()
    }
  },

  compiled(){
    if(dev){
      // this.params.Telephone = "132690317"
    }
  },

  components: {
    'component-header': Header,
    MobileVerify
  }
}
</script>