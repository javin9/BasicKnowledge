<template>
  <div class="component-name" :class="{'error' : showError && !focused, 'border': border}">
    <label><span>{{label}}</span></label>
    <div>
      <input type="text" :placeholder="placeholder" v-model="value" @focus="focused=true" @change="changeHandler" @blur="focused=false">
    </div>
  </div>
</template>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';
  @import './mixin';

  .component-name{
    @include form-element(name);
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
        default: 'name'
      },
      event: {
        type: String,
        default: 'updateForm'
      },
      label: {
        type: String,
        default: '姓名'
      },
      placeholder: {
        type: String,
        default: '请输入真实姓名'
      },
      hasFeedback: {
        type: Boolean,
        default: false
      }
    },

    data () {
      return {
        value: this.initialValue || '',
        showError: false,
        focused:false
      }
    },

    watch:{
      value(value){
        this.$dispatch(this.event, this.name, value)
      }
    },

    events: {
      validateForm(ref){
        if(!ref || ref === this.name){
          if(!check.isName(this.value)){
            this.showError = true
          }else{
            this.showError = false
            console.log(312)
          }
        }
      }
    },

    methods: {
      changeHandler(){
        if(this.hasFeedback){
          this.$emit('validateForm')
        }
      }
    }
  }
</script>