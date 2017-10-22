<template>
  <div class="component-password-form">
    <ul>
      <li>
        <!--<input type="password" :placeholder="passwordPlaceholder" v-model="password" @blur="checkValid"/>-->
        <component-input v-model="password" type="password" placeholder="请输入新密码" :class="{'input-error': inputpassword}" @blur="checkValid('password')" @focus="checkInput('inputpassword')"></component-input>
        <!--<em v-if="password !== ''" @click="password=''"></em>-->
      </li>
      <li>
        <!--<input type="password" :placeholder="passwordConfirmPlaceholder" v-model="confirmPassword" @blur="checkValid"/>
          <em v-if="confirmPassword !== ''" @click="confirmPassword=''"></em>-->
        <component-input v-model="confirmPassword" type="password" placeholder="请确认新密码" :class="{'input-error': inputconfirmPassword}" @blur="checkValid('confirmPassword')" @focus="checkInput('inputconfirmPassword')"></component-input>
      </li>
    </ul>
    <p>密码不能为纯数字，8-20位</p>
    <div class="component-password-form-button">
      <a href="javascript:void(0)" @click="submit" :class="{'disabled': disabledButton}">{{buttonText}}</a>
    </div>
  </div>
</template>

<style scoped>
@import 'sassHelper/vars';
@import 'sassHelper/mixin';

.component-password-form {
  width: 100%!important;
  background: #fff;

  >p {
    @include fsize(24);
    color: $normal-color;
    padding: px2rem(30);
  }

  &-button {
    padding: px2rem(0) px2rem(30) px2rem(20);
    position: relative;

    a {
      &.disabled {
        background: $disabled-color;
      }

      @include fsize(32);
      display: block;
      text-decoration: none;
      text-align: center;
      line-height: px2rem(100);
      border-radius:px2rem(5);
      color:#fff!important;
      background: $main-color;
    }
  }

  li {
    @include borderBottom();
    background: #fff;
    margin: 0 px2rem(30);
    display: flex;
    align-items: center;
    height: px2rem(100);

    input {
      @include fsize(32);
      display: block;
      flex: 1;
      border: 0;
      padding: 0;
      width: 0;
      &.input-error {
        color: $main-color;
      }
    }

    em {
      display: block;
      width: px2rem(34);
      height: px2rem(30);
      background: url(./del.png) no-repeat center center;
      background-size: contain;
    }
  }
}
</style>

<script>
import check from 'libs/check/m'
import Vue from 'vue'
import VueResource from 'vue-resource'

import ComponentInput from 'libs/vue-components/elements/input.vue'
import aes from "libs/aes" 	// 加密


Vue.use(VueResource)
/*const dev=false*/
export default {

  props: {
    passwordPlaceholder: {
      type: String,
      default: '请输入新密码'
    },
    passwordConfirmPlaceholder: {
      type: String,
      default: '请确认新密码'
    },
    buttonText: {
      type: String,
      default: '提交'
    },
    mobile: {
      type: String,
      default: ''
    },
    token: {
      type: String,
      default: ''
    },
    authcode: {
      type: String,
      default: ''
    },
    redirectUrl: {
      type: String,
      required: true
    },
    // 找回密码， 调用接口不同
    isFindBack: {
      type: Boolean,
      default: false
    },
    encryption: {  // 是否加密
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      password: '',
      confirmPassword: '',
      submiting: false,
      inputpassword: false,
      inputconfirmPassword: false,
    }
  },
  ready() {
  },
  computed: {
    passwordValid() {
      let length = this.password.length;
      if (!isNaN(this.password)) {
        return false;
      } else if (length > 0 && length < 8) {
        return false;
      } else if (length > 20) {
        return false;
      } else {
        return true;
      }
    },
    confirmValid() {
      return dev || this.confirmPassword === this.password
    },
    disabledButton() {
      return this.submiting || this.password === '' || this.confirmPassword === ''
    },
    interface() {
      return this.isFindBack ? '/ForgetPwd/FindPasswordSetpThree?token='+this.token : '/User/ChangePassword'
    }
  },

  methods: {
    checkValid(txt) {
      if (txt === 'password') {
        if (!this.passwordValid && this.password !== '') {
          this.inputpassword = true;
          tools.showAlert('密码不能为纯数字，8-20位')
          return false
        } else {
          this.inputpassword = false;
        }
      }
      if (txt === 'confirmPassword') {
        if (!this.confirmValid && this.confirmPassword !== '') {
          this.inputconfirmPassword = true;
          tools.showAlert('两次输入密码不一致')
          return false
        } else {
          this.inputconfirmPassword = false;
        }
      }

      return true
    },
    checkInput(input) {
      if (input === 'inputpassword') {
        this.inputpassword = false;
        return false
      }
      if (input === 'inputconfirmPassword') {
        this.inputconfirmPassword = false;
        return false
      }
      return true
    },

    submit() {
      if (this.disabledButton || !this.passwordValid || !this.confirmValid) {
        return false
      }

      this.submiting = true

      const params = {}

      if (this.isFindBack) {
        params.password = this.encryption ? aes.encrypt(this.password) : this.password
        params.mobile = this.encryption ? aes.encrypt(this.mobile) : this.mobile
        params.authcode = this.authcode
        params.token=this.token
      } else {
        params.newPassword = this.encryption ? aes.encrypt(this.password) : this.password
        params.confimPassword = this.encryption ? aes.encrypt(this.confirmPassword) : this.confirmPassword
        params.authcode = this.authcode
        params.token=this.token
      }

      this.$http.post(this.interface, params, { emulateJSON: true }).then(response => response.json().then(res => {
        if (res.Result) {
          this.$emit('callback')
        } else {
          tools.showAlert(res.Message)
        }
        this.submiting = false
      }))
    }
  },

  components: {
    ComponentInput
  }
}
</script>