<template>
  <div class="component-mileage" :class="{'error' : showError && !focused, 'border': border,'disabled':disabled}">
    <label><span>{{label}}</span></label>
    <div><input type="number" v-model="value" @change="change" @keypress="inputHandler" @focus="focused=true" @blur="focused=false" :disabled="disabled"><em>{{unit}}</em></div>
  </div>
</template>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';
  @import './mixin';

  .component-mileage{
    @include form-element(distance);
    &.disabled{
      @include form-element(distance_disabled);
      color:$disabled-color;
      &>div:after{
        border-top: 2px solid $disabled-color !important;
        border-right: 2px solid $disabled-color !important;
      }
      input::placeholder{
        color:$disabled-color !important;
      }
      >div em{
         color: $disabled-color;
      }
    }
    input{
      width:px2rem(180);
    }
    >div em{
      color: $normal-color;
    }
  }
</style>

<script>
  export default {
    props:{
      border: {
        type: Boolean,
        default: false
      },
      disabled: {
          type: Boolean,
          default: false
      },
      initialValue: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: 'mileage'
      },
      event: {
        type: String,
        default: 'updateForm'
      },
      label: {
        type: String,
        default: '行驶里程'
      },
      unit: {
        type: String,
        default: '万公里'
      },
      max: {
        type: Number,
        default: 99.99
      },
      min: {
        type:Number,
        default: 0.01
      },
      hasFeedback: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        value: this.initialValue,
        showError: false,
        focused: false
      }
    },

    events: {
      validateForm(ref){
        if(!ref || ref === this.name){
          if(+this.value > this.max || +this.value < this.min){
            this.showError = true
          }else{
            this.showError = false
          }
        }
      }
    },

    methods:{
      change(){
        if(+this.value > this.max){
          this.value = this.max
        }
        if(this.hasFeedback){
          this.$emit('validateForm')
        }
      },

      inputHandler(e){
        const isFloat = /\./.test(this.value)
        // 小数部分满位
        const isFloatMax = /\.\d{2}/.test(this.value)
        // 整数部分满位
        // const isIntegerMax = /\d{2}/.test(this.value)
        
        if (e.which < 48 && e.which !== 46 || e.which > 57 || e.which === 46 && isFloat){
            e.preventDefault()
        }

        if(isFloat && isFloatMax){
          e.preventDefault()
        }

        // if(!isFloat && isIntegerMax && e.which !== 46 ){
        //   e.preventDefault()
        // }
      }
    },

    watch:{
      value(value, oldValue){
        this.$dispatch(this.event, this.name, +value)
      }
    }
  }
</script>