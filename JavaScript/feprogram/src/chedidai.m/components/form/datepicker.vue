<template>
  <div class="component-datepicker" :class="{border:border,'disabled':disabled}">
    <label><span>{{label}}</span></label>
    <div v-show="disabled">
        <span v-if="value.year && value.month">{{value.year}}年{{value.month}}月</span>
        <em class="holder" v-else>{{placeholder}}</em>
    </div>
    <div  v-show="!disabled" id="select-datepicker">
      <span v-if="value.year && value.month">{{value.year}}年{{value.month}}月</span>
      <em class="holder" v-else>{{placeholder}}</em>
    </div>

  </div>
</template>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';
  @import './mixin';

  .component-datepicker{
    @include form-element(time);
    @include form-select;
    &.disabled{
      @include form-element(time_disabled);
      color:$disabled-color;
      .holder{
        color:$disabled-color;
      }
      &>div:after{
        border-top: 2px solid $disabled-color !important;
        border-right: 2px solid $disabled-color !important;
      }
    }

  }
</style>

<script>
  import DatePicker from 'libs/datePicker'
  export default {
      props: {
          border: {
              type: Boolean,
              default: false
          },
          //组件是否可用
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
              default: 'date'
          },
          event: {
              type: String,
              default: 'updateForm'
          },
          label: {
              type: String,
              default: '首次上牌时间'
          },
          placeholder: {
              type: String,
              default: '请选择上牌时间'
          },
          minYear: {
              type: String,
              default: '1900'
          }
      },
    data () {
      return {
        value: this.initialValue
      }
    },

    events:{
      setDatePicker(minYear){
        if(this.disabled){
            return false;
        }
        minYear = minYear || this.minYear

        this.datePicker.init({
          trigger: '#select-datepicker',
          type: 'ym',
          minDate: `${minYear}-1-1`,
          maxDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
        })

        if(this.value.year && +this.value.year < +minYear){
          this.value = {
            year: '',
            month: ''
          }
        }
      }
    },
    ready(){
        this.datePicker = new DatePicker({
            CallBacks: obj => {
                this.value = {
                    year: obj.year,
                    month: obj.month
                }
            }
        })

        this.$emit('setDatePicker')
    },

    watch:{
      value(value){
        this.$dispatch(this.event, this.name, {
          year: +value.year,
          month: +value.month
        })
      }
    }
  }
</script>