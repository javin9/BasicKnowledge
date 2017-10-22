<template>
  <div class="component-validatecode" :class="{border:border}">
    <label><span>{{label}}</span></label>
    <div>
      <input type="tel" :placeholder="placeholder" v-model="value" :maxlength="maxlength">
    </div>
    <p class="component-validatecode-button">
      <a :id="el" @click="getCode" href="javascript:void(0)">获取验证码</a>
    </p>
  </div>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';
  @import './mixin';

  .component-validatecode{
    @include form-element(verify);

    input{
      margin-right: px2rem(20) !important;
      max-width: px2rem(240);
    }

    &-button{
      font-size:0;
      display: block;

      &:before{
        content:'';
        @include borderRight;
        height:px2rem(50);
        display: inline-block;
        font-size:px2rem(26);
        background:#E5E5E5;
        vertical-align: middle;
        margin-right: px2rem(27);
      }

      a{
        @include border($main-color);
        font-size:px2rem(26);
        color:$main-color;
        margin:0;
        width: px2rem(170);
        text-align: center;
        background: transparent;
        border-radius:px2rem(5);
        line-height: px2rem(50);
        display: inline-block;
        vertical-align: middle;

        &.disable{
          @include border($disabled-color);
          color:$disabled-color;
        }
      }
    }
  }
</style>

<script>
  import check from 'libs/check/m'

  export default {
    props: {
      border: {
        type: Boolean,
        default: false
      },
      initialValue: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: 'validatecode'
      },
      event: {
        type: String,
        default: 'updateForm'
      },
      label: {
        type: String,
        default: '验证码'
      },
      placeholder: {
        type: String,
        default: '请输入验证码'
      },
      el: {
        type: String,
        default: 'GetValidateCode'
      },
      mobileEl: {
        type: String,
        default: 'mobile'
      },
      mobileRef: {
        type: String,
        default: 'mobile'
      },
      maxlength: {
        type: Number,
        default: 6
      }
    },

    data () {
      return {
        value: this.initialValue || ''
      }
    },

    watch:{
      value(value){
        this.$dispatch(this.event, this.name, value)
      }
    },

    methods: {
      getCode(){
        this.$dispatch('validateForm', this.mobileRef)

        check.getCode({}, res =>{})
      }
    }
  }
</script>