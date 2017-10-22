<template>
  <!-- 底部链接 -->
  <p>*我们会将计算结果以短信的形式发送到您的手机</p>
  <div class="buttons-wrapper">
    <a href="javascript:void(0);" @click="submit" :class="{'disabled': this.disabledButton}" @click="">开始计算</a>
  </div>
</template>

<style scoped>
@import '../vars';
@import '../mixin';
p {
  @include fsize(22)
  color: #F00;
  letter-spacing: 0;
  padding-top: px2rem(16);
  padding-left: px2rem(28);
  background-color: $background-color;
}
.buttons-wrapper{
  @include equal-parts(flex,a);
  background-color: $background-color;
  a{
    &.disabled{
      background: $disabled-color;
    }

    @include fsize(32);
    line-height: 1;
    padding:px2rem(33) px2rem(40);
    border-radius:px2rem(8);
    text-align: center;
    border-width:1px;
    border-style:solid;
    @include theme(background-color, main);
    /*@include theme(color, white);*/
    color: #fff;
    /*width: 40%;*/
    text-align: center;
    margin: px2rem(30);
    text-decoration: none;
  }
}
</style>

<script>
import Header from '../components/header.vue'
import citySelect from 'libs/citySelect'
import carSelect from 'libs/carSelect'
import carThirdLevel from 'libs/carSelect/carThirdLevel'

export default {
  props: {
    disabledButton: {
      type: Boolean,
      default: false
    },
    CarId: {
      type: String,
      default: initData.carId
    },
    CityId: {
      type: String,
      default: initData.cityId
    }
  },

  data () {
    return {
      
    }
  },

  medths: {
    submit(){
      if(this.disabledButton){
        return false
      }
    }
  }
}
</script>