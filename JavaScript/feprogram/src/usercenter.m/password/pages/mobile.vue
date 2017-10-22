<template>
  <component-header title="手机验证" v-if="mobileshow">
  </component-header>
  <mobile-verify v-if="mobileshow" :mobile-readonly="mobileReadonly" :redirect-url="redirectUrl" :mobile="mobile" :showLabels="showLabels" :line="line" :validateFail="" :encryption="true" @blur="tetst" @submit="submit">
  </mobile-verify>
  <change-view v-if="!mobileshow" :token="token" :redirect-url="redirectUrl" :authcode="authcode">
  </change-view>
</template>

<style>
body {
  background: #fff;
}
</style>
<style scoped>
@import 'sassHelper/vars';
@import 'sassHelper/mixin';
</style>

<script>

import Vue from 'vue'
import VueResource from 'vue-resource'
import ChangeView from './change'
import ComponentHeader from 'libs/header'
import MobileVerify from 'libs/vue-components/mobile-verify'


Vue.use(VueResource)



export default {
  props: ['mobileshow', 'authcode', 'redirectUrl'],
  ready() {
    console.log(this)
  },
  data() {
    return {
      mobileReadonly: true,
      mobile: telephone,
      submiting: false,
      showLabels: false,
      line: 550,
      token:''
    }
  },
  computed: {},

  methods: {
    submit(data) {
      if (!data) {
        return false
      }
      this.authcode = data.authcode
      this.submiting = true
      this.$broadcast('validateAuthcode', valid => {
        if (valid) {
          const params = {
            mobile: this.mobile,
            mobileValidateCode: this.authcode
          }
          $.post('/ForgetPwd/FindPasswordSetpTwo', params, (res) => {
            if (res.Result) {
              this.token = res.Data;
            }
          })
          tools.showAlert('手机验证成功')
          this.mobileshow = false
        } else {
          tools.showAlert('请输入正确的验证码')
          this.mobileshow = true
        }
      })
      debugger
    },

  },

  components: {
    ComponentHeader,
    ChangeView,
    MobileVerify
  }
}
</script>
