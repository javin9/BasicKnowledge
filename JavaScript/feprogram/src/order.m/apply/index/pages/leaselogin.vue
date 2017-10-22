<template>
    <mobile-verify @submit="submit" @update="mobliecode" :authcode="authcode"  :mobile="mobile"
                   :disabled="submiting" authcode-auto-hide="authcodeAutoHide"
                   :button-text="buttonText" :disabled="disabled"></mobile-verify>
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
    ready(){
       /* if (mobile!==''){
            $("#step1 input[type='tel']").eq(0).val(mobile)
            $("#step1 input").eq(0).blur();
        }*/

    },
  data () {

    return {
      submiting: false,
        buttonText:'下一步',
        disabled:false,
        mobile:mobile,
        authcodeAutoHide:true,
    }
  },

  methods: {
      mobliecode(mobile, authcode){
          //console.log(mobile, authcode)
      },
    submit(data){
          var _self=this
      if(!data){
        return false
      }
        _self.buttonText='提交中';
        _self.disabled=false;
        $('#Telephone').val(data.mobile)
        $('#code').val(data.authcode)
        var orderForm = $('#formQ');
        $.post(
                orderForm.attr('action'),
                orderForm.serialize(),
                function (result) {

                    if (result.Result) {
                        try {
                            _agtjs('loadEvent', { atsev: 101, 'atsusr': result.Data.OrderId });
                        } catch (err) {

                        }
                        // add by shangbinjie，2016/11/30
                        //登录状态
                        tools.getLoginStatus();
                        window.location.href = result.Data.RedirectUrl;

                    } else {
                        _self.buttonText='下一步';
                        _self.disabled=false;
                        tools.showAlert(result.Message);
                    }

                }
        )

        /*this.$http.post(orderForm, $('#formQ').serialize()).then(response => response.json().then((result) => {
            if (result.Result) {
                try {
                    _agtjs('loadEvent', { atsev: 101, 'atsusr': result.Data.OrderId });
                } catch (err) {

                }
                // add by shangbinjie，2016/11/30
                //登录状态
                tools.getLoginStatus();
                //window.location.href = result.Data.RedirectUrl;

            } else {
                this.buttonText='下一步';
                this.disabled=true;
                tools.showAlert(result.Message);
            }
        }))*/




    },


  },

  compiled(){

  },

  components: {
    MobileVerify
  }
}
</script>