<template>
  <div class="component-city" :class="{border:border,'disabled':disabled}">
    <label><span>{{label}}</span></label>
    <div @click="selectCity">
      <span v-if="value.id">{{value.name}}</span>
      <em class="holder" v-else>{{placeholder}}</em>
    </div>
  </div>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';
  @import './mixin';

  .component-city{
    @include form-element(location);
    @include form-select;
    &.disabled{
      @include form-element(location_disabled);
      color:$disabled-color;
      &>div:after{
        border-top: 2px solid $disabled-color !important;
        border-right: 2px solid $disabled-color !important;
      }
    }
    >div >span{
      display: inline-block;
      max-width:px2rem(360);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>

<script>
  import city from 'libs/citySelect'
  export default {
    props: {
      border: {
        type: Boolean,
        default: false
      },
      disabled:{
        type: Boolean,
        default: false
      },
      initialValue: Object,
      name: {
        type: String,
        default: 'city'
      },
      event: {
        type: String,
        default: 'updateForm'
      },
      label: {
        type: String,
        default: '城市'
      },
      placeholder: {
        type: String,
        default: '请选择城市'
      }
    },
    data () {
      return {
        value: this.initialValue || {},
      }
    },

    watch: {
      value(value){
        this.$dispatch(this.event, this.name, value)
      }
    },

    methods: {
      selectCity(){
        if(!this.disabled){
          city.citySelect({
              isSaveCookie:false
          }, res =>{
              this.value = {
                  id: res.CityId,
                  name: res.CityName
              }
          })
        }
      }
    }
  }
</script>