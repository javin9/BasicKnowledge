<template>
  <component-header title="易鑫车抵贷"></component-header>
  <success title="信息提交成功 !" description="我们已经收到您的申请信息，稍后贷款顾问将与您联系" align="left"></success>
  <div class="button-wrapper">
    <a :href="linkHome">返回首页</a>
    <a href="javascript:void(0)" @click="goback">免费获取精准报价</a>
  </div>
  <p class="desc">声明：易鑫承诺用户信息绝不会以任何形式泄露给其他人员或机构，仅用于申请抵押贷款。</p>
  <component-footer text="本服务由易鑫车贷提供" position="bottom"></component-footer>
</template>


<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .button-wrapper{
    text-align: center;
    background: #fff;
    padding-bottom: px2rem(40);
    font-size:0;

    a{
      @include fsize(28);
      @include border($main-color);
      display: inline-block;
      color:$main-color;
      border-radius:px2rem(5);
      line-height: $main-line-height;
      padding:px2rem(10) 0;
      width: px2rem(300);
      text-align: center;

      &:last-child{
        color:#fff;
        background: $main-color;
        margin-left: px2rem(20);
      }
    }
  }

  .desc{
    @include fsize(24);
    margin:px2rem(20) px2rem(47);
    color:$normal-color;
  }
</style>

<script>
  import ComponentHeader from 'libs/header'
  import ComponentFooter from '../../components/footer'
  import Success from '../../components/result/success'
  
  export default {
    props: {
      linkHome: String
    },
    data () {
      return {
      }
    },

    methods: {
      goback(){
        history.go(-1)
      }
    },

    components: {
      ComponentHeader,
      ComponentFooter,
      Success
    }
  }
</script>