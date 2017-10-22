<template>
  <section v-if="list.length">
    <header>我的分享记录</header>
    <ul>
      <li v-for="one in list">
        <a href="/CouponCard/MyCouponCard"  v-if="one.ShowLink">
          <p>{{one.CreateTime}}</p>
          <h6>{{one.Title}}</h6>
          <p class="desc">{{one.Content}}</p>
          <aside><span>查看</span></aside>
        </a>
        <span v-else="!one.ShowLink">
          <p>{{one.CreateTime}}</p>
          <h6>{{one.Title}}</h6>
          <p class="desc">{{one.Content}}</p>
        </span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
  @import 'sassHelper/mixin';

  $border: #e5e5e5;

  section{
    background: #fff;
  }

  header{
    @include fsize(30);
    padding:0 px2rem(30);
    color:#333;
    line-height: px2rem(90);
    border-bottom:1px solid $border;
  }

  ul{
    padding-left:px2rem(30);

    li{
      border-bottom:1px solid $border;
      padding:px2rem(10) 0;
      position: relative;

      &:last-child{
        border-bottom:0;
      }

      p, h6{
        margin:px2rem(10) px2rem(10) px2rem(10) 0;
        line-height: 1.5;
      }

      p{
        @include fsize(24);
        color:#999;
      }

      h6{
        @include fsize(28);
        color:#333;
      }

      .desc{
        color:#666;
      }

      aside{
        position: absolute;
        right:px2rem(30);
        top:50%;
        transform:translateY(-50%);
        color:#333;
        font-size:0;

        span{
          font-size:px2rem(27);
          display: inline-block;
          vertical-align: middle;
          height: px2rem(40);
          line-height: px2rem(40);
        }

        &:after{
          content:' ';
          display: inline-block;
          background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAeCAQAAACP8FaaAAABOUlEQVQoU3XSPSiFcRiG8dfxGYmiJBkYZFBKFlmURRkMFoPBYrAoWQw2kZSy6Xrec4iyHGVRBgOllFBKKRlEOkVRROTzNpx3/D/P+ru2546YsJzNqyDyznII2bIfzCOEbNEJlGIjSWacZL/ItvIJU06SLbGdJBl3ktUy9hCyPxt1kvUKO0SI33jYSaiyU4TsxwadZK2Gc4T4ot9J4jouEbKPdK+TrDXYNUL2lu52krjJ7hDiJdPpJNZi9wjZU6bdSdJtPCLEiRPQygNCdhzkleb8CHimI8SNdoMQr5muAFPPFUK8xz0hruUCIftM9wV4tdrOEOI7HghwppKj/D9tKMCU20GyiJEA75TabrKpsQBTbNsJTwY4W2ibebbpACtl6wnPBTiKmE14KchRxC1C4HAUMW45FpTy/B8XH9zQoVZpPgAAAABJRU5ErkJggg==) no-repeat center center;
          width: px2rem(16);
          height:px2rem(40);
          background-size: contain;
          display: inline-block;
          vertical-align: middle;
          margin-left: px2rem(20);
        }
      }
    }
  }
</style>

<script>
export default {
  props:['interface'],

  data () {
    return {
      list: []
    }
  },

  created(){
    this.$http.post(this.interface, {}).then(response => response.json().then(res => {
      if(res.Result){
        this.list = res.Data
      }
    }))
  }
}
</script>