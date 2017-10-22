<template>
  <div class="component-mobile" :class="{'error' : showError, 'border': border}">
    <label><span>{{label}}</span></label>
    <div>
      <input type="tel" :placeholder="placeholder" v-model="value" :id="el" @change="changeHandler" @focus="showError=false" >
    </div>
  </div>
</template>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';
  @import './mixin';

  .component-mobile{
    @include form-element(tel);
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
        default: 'mobile'
      },
      event: {
        type: String,
        default: 'updateForm'
      },
      label: {
        type: String,
        default: '手机号'
      },
      placeholder: {
        type: String,
        default: '请输入手机号'
      },
      el: {
        type: String,
        default: 'mobile'
      },
      hasFeedback: {
        type: Boolean,
        default: false
      }
    },

    data () {
      return {
        value: this.initialValue || '',
        showError:false
      }
    },

    computed:{
      trimValue(){
        return this.value.replace(/\s/g,'')
      }
    },

    watch:{
      value(value, oldValue){
        if(this.trimValue.length > 11){
          this.$nextTick(()=>this.value = oldValue)
        }else{
          this.$dispatch(this.event, this.name, this.trimValue)
        }
      }
    },

    created(){
      this.format()
    },

    events: {
      validateForm(ref){
        if(!ref || ref === this.name){
          if(!check.isPhoneNumber(this.trimValue)){
            this.showError = true
          }
        }
      }
    },

    methods: {
      format(){
        if(check.isPhoneNumber(this.trimValue)){
          this.value = this.trimValue.replace(/^(\d{3})(\d{4})(\d{4})$/,'$1 $2 $3')
        }
      },

      changeHandler(){
        if(this.hasFeedback){
          this.$emit('validateForm')
        }
        this.format()
      }
    }
  }
</script>