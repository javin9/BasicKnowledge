<template>
  <component-header title="卡券查询" :show="true" :back="back"></component-header>
  <div class="page-query">
    <p>输入客户手机号，以查询客户的卡券领取、激活等信息</p>
    <div class="query-item">
      <label>客户手机号</label>
      <component-input 
        v-model="mobile" 
        type="mobile" 
        placeholder="请输入客户手机号" 
        :class="{'input-error': dirty && !focus && !mobileVaild && mobile}"
        @focus="dirty=focus=true" 
        @blur="blurHandler"
      ></component-input>
    </div>

    <a href="javascript:void(0)" 
      class="query-submit" 
      :class="{'disabled' : disabled}" 
      @click="submit"
    >查询</a>
  </div>
</template>

<style>
  body{
    background: #F2F2F2;
  }
</style>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .page-query{
    > p{
      @include fsize(26);
      color:$light-color;
      line-height: $main-line-height;
      padding:px2rem(20) px2rem(30);
    }

    .query-item{
      @include fsize(30);
      display:flex;      
      background: #fff;
      height: px2rem(110);
      align-items: center;
      padding:0 px2rem(30);
      color:$dark-color;

      label{
        margin-right: px2rem(50) ;
        display: block;
      }

      input{
        flex:1;
        border:0;
        display: block;
      }
    }

    .query-submit{
      @include fsize(32);
      margin:px2rem(40) px2rem(30);
      background: $main-color;
      color:#fff;
      text-align: center;
      line-height: px2rem(100);
      display: block;
      border-radius:px2rem(5);

      &.disabled{
        opacity: .6;
      }
    }
  }
</style>

<script>
  import ComponentHeader from 'libs/header'
  import ComponentInput from 'libs/vue-components/elements/input'
  import {isPhoneNumber} from 'libs/check/m'

  export default {
    props:['interface'],
    data () {
      return {
       mobile: '',
       dirty:false,
       focus:false,
       submiting:false
      }
    },

    computed:{
      mobileVaild(){
        return isPhoneNumber(this.mobile)
      },
      disabled(){
        return this.submiting || this.mobile === ''
      }
    },

    methods:{
      back(){
        if (tools.browser.versions.ios && window.webkit) {
            window.webkit.messageHandlers.backToHome.postMessage('')
        } else if(window.appInterface){
            window.appInterface.backToHome()
        }
      },
      blurHandler(){
        this.focus=false
        if(!this.mobileVaild && this.mobile){
          tools.showAlert('请输入正确的手机号')
        }
      },
      submit(){
        if(this.disabled){
          return false
        }

        if(!this.mobileVaild){
          tools.showAlert('请输入正确的手机号')
          return false
        }

        this.submiting = true

        this.$http.get(this.interface, {params:{telephone:this.mobile}}).then(response => response.json().then(res=>{
          this.submiting = false
          if(res.Result){
            this.$dispatch('updateInfo', res.Data)
            this.$router.go(`/result/${this.mobile}`)
          }else{
            tools.showAlert(res.Message)
          }
        }))
      }
    },

    components:{
      ComponentHeader,
      ComponentInput
    }
  }
</script>