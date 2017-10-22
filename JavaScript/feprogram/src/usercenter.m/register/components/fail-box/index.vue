<template>
    <div class="component-fail-box">
        <label class="component-fail-box-icon" :style="{'backgroundImage': `url(${portrait})`}"></label>
        <div class="component-fail-box-title">昵称：<em>{{name}}</em></div>
        <p>手机号{{tel}}已被以上账户使用</p>
        <p>请确认该账户是否为你本人所有</p>
        <a href="/login/index">是我的，去登录</a>
        <a href="/Register/index" class="component-fail-retry">换个手机号重新注册</a>
    </div>
</template>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';
  .component-fail-box{
    padding: 1.333333rem 0.266667rem 0;

    &-icon{
      display: block;
      width: 1.466667rem;
      height: 1.466667rem;
      background-repeat: no-repeat;
      background-size: cover;
      margin: 0 auto;
    }

    &-title{
      @include fsize(32);
      color: $dark-color;
      text-align: center;
      padding:0.8rem 0 0.533333rem;
    }

    p{
      @include fsize(30);
      color: $dark-color;
      margin-bottom: px2rem(30);
      text-align: center;
    }

    > a{
      @include fsize(30);
      @include border(#dbb76c);
      display: block;
      padding:0.48rem 0;
      border-radius:px2rem(5);
      background: #dbb76c;
      color:#fff;
      text-align: center;
      margin-top: px2rem(60);
      text-decoration: none;

      &.component-fail-retry{
        @include border($light-color);
        background: #fff;
        color:$normal-color;
        margin-top: px2rem(30);
      }
    }
  }
</style>

<script>
  export default {
    props: {
      portrait: {
        type: String,
        default: require('./icon.png')
      },
      name: {
        type: String,
        default: ''
      },
      tel: {
        type: String,
        default : ''
      }
    },
    data () {
      return {
      }
    },
  
    methods: {
    },

    components: {
    }
  }
</script>