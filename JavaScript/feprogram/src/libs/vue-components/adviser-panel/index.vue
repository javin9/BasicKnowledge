<template>
  <div class="component-adviser-entry" @click="showPanel"></div>
  <div class="component-adviser-panel" v-show="show" transition="slideup">
    <div class="content-area">
      <p>贷款咨询，获得1对1服务</p>
      <a href="javascript:void(0)" @click="telHandler">电话咨询 {{formatedAdviserPhone}}</a>
    </div>
    <div class="form-area">
      <p>免费打电话，获得专业的贷款建议</p>
      <div class="input-item">
        <input type="tel" placeholder="请输入手机号码" v-model="phone" @focus="clearError" maxlength="11">
        <a href="javascript:void(0)" class="button" @click="submit">免费咨询</a>
      </div>
      <div class="error">{{error}}</div>
    </div>
    <a href="javascript:void(0)" class="close" @click="hidePanel"></a>
  </div>
  <mask></mask>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';

  .component-adviser-entry{
    width: px2rem(118);
    height: px2rem(120);
    background-image: url(./icon.png);
    background-repeat: no-repeat;
    background-size: contain;
    position: fixed;
    z-index: 99;
    right:px2rem(5);
    bottom:px2rem(300);
  }

  .component-adviser-panel{
    position:fixed;
    bottom:0;
    left:0;
    width: 100%;
    z-index: 99999;
    background: #fff;
    padding-bottom: px2rem(45);

    .content-area{
      @include borderBottom;
      padding:px2rem(40) px2rem(30);

      p{
        @include fsize(28);
        color:$normal-color;
      }

      a{
        @include fsize(30);
        @include border($main-color);
        text-decoration: none;
        font-weight: normal;
        text-align: center;
        color:$main-color;
        display: block;
        background: #FEF6F6;
        padding:px2rem(21) 0;
        margin-top: px2rem(30);
        border-radius:px2rem(5);
      }
    }

    .form-area{
      padding:px2rem(40) px2rem(30);

      p{
        @include fsize(28);
        color:$normal-color;
      }

      .error{
        @include fsize(26);
        color:$main-color;
        padding-top: px2rem(10);
        height: px2rem(40);
      }

      .input-item{
        display:flex;
        align-items:center;
        margin-top: px2rem(30);

        input{
          border:0;
          @include borderBottom;
          @include fsize(30);
          color:$dark-color;
          height:px2rem(70);
          flex:1;
          padding:0;
          margin:0 px2rem(20) 0 0;
          display: block;
        }

        a.button{
          @include fsize(30);
          display: block;
          color:#fff;
          padding:0 px2rem(29);
          background: $main-color;
          height:px2rem(70);
          line-height: px2rem(70);
          text-decoration: none;
          border-radius:px2rem(5);
        }
      }
    }

    .close{
      @include size(px2rem(80));
      right:px2rem(50);
      top:px2rem(-40);
      position: absolute;
      background: url(./close.png) no-repeat center center;
      background-size: contain;
    }
  }
</style>

<script>
import Mask from 'libs/mask'
import check from 'libs/check/m'
export default {
  props:{
    base: {
      type: String,
      default: window.ADVISERAPIURL
    },
    cityId: {
      type: Number,
      default: window.localCity ? window.localCity.CityId : ''
    },
    pageType: {
      type: Number,
      default: 8
    }
  },

  data () {
    return {
      show:false,
      adviserPhone: '4000169169',
      phone: '',
      error: ''
    }
  },

  computed: {
    apiGetCallByCityId(){
      return `${this.base}group/getcallphone`
    },

    apiValidatePhone(){
      return `${this.base}user/validatephone`
    },

    formatedAdviserPhone(){
      return (this.adviserPhone +'').replace(/^(\d{4})(\d{3})(\d{3})$/, '$1-$2-$3')
    },

    formatedPhone(){
      return (this.phone+'').replace(/(\d{3})\d{4}(\d{4})/, '$1 **** $2')
    }
  },

  events:{
  },

  methods:{
    showPanel(){
      this.show = true
      this.phone = ''
      this.$broadcast('showMask')
      // ios qq会有遮挡情况，其它浏览器也会有部分跳动问题, 故此干掉底部body的定位
      $('body').css({position:'fixed', left:'0',top:'0'})
    },

    hidePanel(){
      this.show = false
      this.clearError()
      this.$broadcast('hideMask')
      $('body').css({position:'static'})
    },

    telHandler(){
      this.hidePanel()
      this.$nextTick(() => window.location.href = `tel:${this.adviserPhone}`)
    },

    setError(msg = '请输入正确的手机号'){
      this.error = msg
    },

    clearError(){
      this.error = ''
    },

    submit(){
      // TODO: 取消依赖，将弹层内置到模块里
      if(check.isPhoneNumber(this.phone)){
        this.$http.jsonp(this.apiValidatePhone, {params: {Phone: this.phone}}).then(response => response.json().then(res => {
          if(res.Result){
            this.hidePanel()

            $('#TelNum').text(this.formatedPhone)
            $('#Phone').val(this.phone)

            check.getCode({
                tel_id: 'Phone',
                codelen: 4
            },()=>{})

            $('body').css({
                'position': 'fixed',
                'top':0,
                'left': 0
            }).bind('touchmove', e=> e.preventDefault())

            setTimeout(function(){
                $('#TelPopUp').removeClass('hide')
            }, 300)

            $('#TelPopUpMask').removeClass('hide')
            $('#TelPopUp').removeClass('hide').data('page-type', this.pageType)
          }else{
            this.setError(res.Message)
          }
        }))
      }else{
        this.setError()
      }
    }
  },

  created(){
    this.$http.jsonp(this.apiGetCallByCityId, {params: {CityId: this.cityId}}).then(response => response.json().then(res => {
      if(res.Result){
        this.adviserPhone = res.Data.CN400
      }
    }))
  },

  components:{
    Mask
  }
}
</script>