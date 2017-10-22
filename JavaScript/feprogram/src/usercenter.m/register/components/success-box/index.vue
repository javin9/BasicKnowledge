<template>
  <div class="component-success-box">
    <label class="component-success-box-icon"></label>
    <div class="component-success-box-title">注册成功</div>
    <div class="component-success-box-about">注册账号：<em>{{tel}}</em></div>
    <div class="component-success-box-des">恭喜您成为易鑫V1会员，去个人中心补充个人资料信息，获得更多功能权限吧！！</div>
    <div class="component-success-box-countdown"><i>{{countdown}}</i>s后自动回到首页，<a :href="redirectUrl">立即前往</a></div>
  </div>
</template>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .component-success-box{
    padding: 1.333333rem 0.933333rem;

    &-icon{
      display: block;
      width: 1.333333rem;
      height: 1.346667rem;
      background: url(icon.png) no-repeat;
      background-size: 100%;
      margin: 0 auto;
      margin-bottom: 0.533333rem;
    }

    &-title{
      @include fsize(30);
      text-align: center;
      padding:px2rem(20) 0;
      color:$normal-color;
    }

    &-about{
      @include fsize(26);
      text-align: center;
      padding-bottom: px2rem(20);
      color:$normal-color;

    }

    &-des{
      @include fsize(26);
      text-align: center;
      padding:px2rem(20) 0;
      color:$normal-color;
    }

    &-countdown{
      @include fsize(24);
      text-align: center;
      padding-top: px2rem(65);
      color:$light-color;

      i{
        font-style:normal;
      }

      a{
        color:#5fc3e8;
        text-decoration: none;
      }
    }
  }
</style>

<script>
  export default {
    props: {
      tel: {
        type: String,
        default : ''
      },
      countdown: {
        type: Number,
        default: dev ? 100000 : 13
      },
      redirectUrl: {
        type: String,
        default: window.xinche
      }
    },
    
    data () {
      return {
      }
    },

    ready(){
      setInterval(()=>{
        if(!this.countdown){
          if(dev){
            console.log(this.redirectUrl)
          }else{
            window.location.href = this.redirectUrl
          }
        }else{
          --this.countdown
        }
      },1000)
    },

    components: {
    }
  }
</script>