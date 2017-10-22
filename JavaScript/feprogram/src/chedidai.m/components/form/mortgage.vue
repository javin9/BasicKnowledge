<template>
  <div class="component-mortgage" :class="{border:border}">
    <label><span>抵押状态</span></label>
    <div>
      <span :class="{current: !value}" @click="change(false)"><i>无抵押</i></span>
      <span :class="{current: value}" @click="change(true)"><i>有抵押</i></span>
    </div>
  </div>

  <div class="component-mortgage-alert" v-if="alert">
    <p>已抵押车辆<br/>仅可评估车辆价格，不可贷款</p>
    <a href="javascript:void(0)" @click="alert=false">我知道了</a>
  </div>

  <mask></mask>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';
  @import './mixin';

  .component-mortgage{
    @include form-element(status);
    @include form-checkbox;
  }
  .component-mortgage-alert{
    @include modal;

    p{
      @include fsize(34);
      padding:px2rem(90) 0 px2rem(80);
      text-align: center;
      color:$dark-color;
    }

    a{
      @include fsize(32);
      @include borderTop;
      padding:px2rem(26) 0;
      display: block;
      text-align: center;
      color:#E9474D;
    }
  }
</style>

<script>
  import Mask from 'libs/mask'
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
        default: 'mortgage'
      },
      event: {
        type: String,
        default: 'updateForm'
      }
    },
    data () {
      return {
        value: this.initialValue,
        alert: false
      }
    },

    methods:{
      change(value){
        if(value && !this.value){
          this.alert = true
          this.$dispatch('isComponentsDisabled',value);
        }
        this.value = value;
        this.$dispatch('isComponentsDisabled',value);
      }
    },

    watch:{
      value(value){
        this.$dispatch(this.event, this.name, value)
      },

      alert(value){
        if(!value){
          this.$broadcast('hideMask')
        }else{
          this.$broadcast('showMask')
        }
      }
    },

    components: {
      Mask
    }
  }
</script>