<template>
  <div class="component-carno" :class="{border:border}">
    <label><span>{{label}}</span></label>
    <div>
      <em @click="selectProvince">{{province}}</em>
      <input type="text" :placeholder="placeholder" v-model="value">
    </div>
  </div>

  <province-selector></province-selector>
</template>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';
  @import './mixin';

  .component-carno{
    @include form-element(carno);

    >div{
      input{
        width: px2rem(250);
      }

      em{
        font-style:normal;
        position: relative;
        padding-right: px2rem(20);

        &:after{
          content:' ';
          @include arrow(right, px2rem(14));
        }
      }
    }
  }

  .component-province-selector{
    position: fixed;
    bottom:0;
    width: 100%;
    background: #CDCFD3;
    padding:px2rem(20);
  }
</style>

<script>
  import ProvinceSelector from './provinceSelector'

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
        default: 'carno'
      },
      event: {
        type: String,
        default: 'updateForm'
      },
      label: {
        type: String,
        default: '车牌号'
      },
      placeholder: {
        type: String,
        default: '请输入车牌号'
      }
    },

    data () {
      return {
        value: this.initialValue.substring(1,this.initialValue.length) || '',
        province: this.initialValue.substring(0,1) || '京'
      }
    },

    computed: {
      joinValue(){
        return this.province + this.value
      }
    },

    watch:{
      joinValue(value){
        this.$dispatch(this.event, this.name, value)
      },

      value(value, oldValue){
        if(!/^[A-Za-z0-9]{0,6}$/.test(value)){
          this.$nextTick(() => this.value = oldValue)
        }else if(!/^[A-Z0-9]{0,6}$/.test(value)){
          this.$nextTick(() => this.value = this.value.toUpperCase())
        }
      }
    },

    events: {
      changeProvince(value){
        this.province = value
      }
    },

    methods: {
      selectProvince(){
        this.$broadcast('showProvinceSelector')
      }
    },

    created(){
      this.$broadcast('mask')
    },

    components: {
      ProvinceSelector
    }
  }
</script>