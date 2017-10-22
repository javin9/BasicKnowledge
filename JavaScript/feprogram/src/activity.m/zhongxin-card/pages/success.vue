<template>
    <component-header :title="title" :hide-back="true"></component-header>
		<div class="page-success">
      <h1>恭喜您！</h1>
      <h3>您已成功提交申请资料！</h3>
      <p>工作人员将在2-3个工作日内与您联系</p>
      <div class="page-success-buttons">
        <a :href="mainLink">开走吧</a>
        <a href="javascript:void(0)" @click="back">返回</a>
      </div>
    </div>
</template>

<style>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  body{
    background: #fff;
  }

  .page-success{
    width: 100%;
    background: url(./succ.png) no-repeat center px2rem(80);
    background-size: px2rem(140) px2rem(140);
    padding-top: px2rem(250);
    text-align: center;

    h1{
      @include fsize(32);
      color:$dark-color;
      line-height: $main-line-height;
      font-weight: normal;
    }

    h3{
      @include fsize(28);
      color:$dark-color;
      line-height: $main-line-height;
      font-weight: normal;
    }

    p{
      @include fsize(28);
      color:$normal-color;
      padding:px2rem(30) 0 px2rem(50);
    }

    &-buttons{
      text-align: center;
      font-size:0;

      a{
        @include border(#c4c4c4);
        @include fsize(32);
        display: inline-block;
        width: px2rem(300);
        line-height: px2rem(90);
        border-radius:px2rem(5);

        &:nth-child(1){
          color:#fff !important;
          border-color: #E9474D;
          background: #E9474D;
          margin-right: px2rem(30);
        }

        &:nth-child(2){
          background: #fff;
          color: $normal-color !important;
        }
      }
    }
  }
</style>

<script>
import ComponentHeader from 'libs/header'
export default {
  props:['mainLink', 'title'],

  data() {
    return {
    }
  },


  methods:{
    back(){
      history.back()
    }
  },

  components:{
    ComponentHeader
  }
}
</script>