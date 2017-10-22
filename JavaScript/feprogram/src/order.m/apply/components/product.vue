<template>
  <section class="product-block" :class="{'product-simple': type === 'simple'}">
    <dl>
        <dt><img :src="data.img"></dt>
        <dd>
            <h3>{{data.name}}</h3>
            <p v-if="type !== 'simple'"><span>{{data.priceType}}：</span><em>{{data.price}}</em></p>
        </dd>
    </dl>
  </section>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  .product-block{
    @include clearfix;
    background:#fff;
    padding:px2rem(30);

    dt{
      @include size(px2rem(120));
      float: left;
      margin-right: 20px;
      border-radius:px2rem(15);
      border:1px solid #eee;

      img{
        width: px2rem(120);
        margin-top: px2rem(20);
      }
    }
    dd{
      overflow: hidden;

      h3{
        @include fsize(28);
        color:#000;
        margin-top: px2rem(10);
        margin-bottom: px2rem(30);
      }

      p{
        @include fsize(26);
        color:#999;
        margin-bottom: px2rem(20);

        &:last-child{
          margin-bottom: 0;
        }
        
        span{
          color:#000;
        }
        em{
          color:#E9474D;
        }
      }
    }
  }
  .product-simple{
      dd{
        height:px2rem(120);
        h3{
          @include fsize(28);
          color:#000;
          line-height: 1.5;
          display: table-cell;
          height:px2rem(120);
          vertical-align: middle;
        }
      }
  }
</style>

<script>
export default {
  props:['data','type'],
  data () {
    return {
    }
  }
}
</script>