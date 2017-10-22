<template>
  <div class="component-success-box">
    <label class="component-success-box-icon"></label>
    <div class="component-success-box-title">{{title}}</div>
    <div class="component-success-box-countdown" v-if="autoCountdown"><i>{{countdown}}</i>s后自动回到登录首页，<a :href="redirectUrl">立即前往</a></div>
    <div class="component-success-box-countdown" v-else>密码修改成功，请重新登录！</div>
    <a :href="redirectUrl" class="component-success-box-button">重新登录</a>
  </div>
</template>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .component-success-box{
    padding: 1.333333rem 0.933333rem;

    &-button{
      @include fsize(32);
      display: block;
      text-decoration: none;
      text-align: center;
      line-height: px2rem(100);
      border-radius:px2rem(5);
      color:#fff;
      background: $main-color;
      margin-top: px2rem(20);
    }

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
    
    &-countdown{
      @include fsize(24);
      text-align: center;
      padding: px2rem(35) 0;
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
      title: {
        type: String,
        default: '修改密码成功'
      },
      autoCountdown:{
        type: Boolean,
        default: true
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
      if(this.autoCountdown){
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
      }
    },

    components: {
    }
  }
</script>