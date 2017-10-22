<template>
  <blockquote class="components-third-login">
      <header>
        <i></i>
        <span>使用其他账号登录</span>
      </header>
      <article>
        <div>
          <a title="sina" :href="tpSina"></a>
        </div>
        <div>
          <a title="qq" :href="tpQq"></a>
        </div>
        <div>
          <a title="jd" :href="tpJd"></a>
        </div>
        <div>
          <a title="yiche" :href="tpYiche"></a>
        </div>
      </article>
    </blockquote>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';
  
  .components-third-login{
    padding: 1.333333rem 0.44rem;

    header{
      @include fsize(28);
      position: relative;

      i{
        display: block;
        @include borderBottom(#d2d2d2);
      }

      span{
        position: absolute;
        top: -0.266667rem;
        left: 2.866667rem;
        padding: 0 0.266667rem;
        background-color: #fff;
      }
    }

    article{
      position: relative;
      display: flex;
      padding: 1.666667rem 0;

      >div{
        flex:1;

        a{
          display: block;
          width: 1.12rem;
          height: 1.12rem;
          background-repeat: no-repeat;
          background-size: 100%;
          margin: 0 auto;
        }

        &:nth-child(1) a{
          background-image: url(./sina.png);
        }
        &:nth-child(2) a{
          background-image: url(./qq.png);
        }
        &:nth-child(3) a{
          background-image: url(./jd.png);
        }
        &:nth-child(4) a{
          background-image: url(./yiche.png);
        }
      }
    }
  }
</style>

<script>
  export default {
    props: {
      tpSina: String,
      tpQq: String,
      tpJd: String,
      tpYiche:String
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