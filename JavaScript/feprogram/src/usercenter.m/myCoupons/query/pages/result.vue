<template>
  <component-header title="卡券查询" :show="true"></component-header>
  <div class="page-result">
    <article>
      <h3>手机用户{{$route.params.mobile}}，<span v-if="name">姓名{{name}}，</span>共领取卡券<em>{{info.length}}</em>张，明细如下：</h3>
      <ul>
        <li>C2券目前仅限于新车、开走吧的自营业务，每个用户仅可领取且使用一张，需要用户领券时间&lt;线上下单时间&lt;线下提报时间&lt;成交时间，才可激活；</li>
        <li>渠道券目前仅限于新车、开走吧自营业务，需要用户领券时间&lt;线下提报时间，线上下单时间&lt;线下提报时间，线下提报时间&lt;成交时间；</li>
        <li>一个用户同时拥有C2券或渠道券，则仅可激活其中面值最大的一张</li>
      </ul>
      <section class="panel-1" v-for="one in c2list">
        <h6>{{one.ShareType === 1064 ? '渠道券' : one.ShareTypeDes}} - {{one.CouponCardTitle}}</h6>
        <div class="panel-content">
          <p>
            <label>卡券状态：</label>
            <span>{{one.StateDes}}</span>
          </p>
          <p v-if="one.ActivateTime">
            <label>激活时间：</label>
            <span>{{one.ActivateTime}}</span>
          </p>
          <p>
            <label>领券时间：</label>
            <span>{{one.CreateTime}}</span>
          </p>
          <p>
            <label>下单时间：</label>
            <span>{{one.OrderTime || '暂无下单信息'}}</span>
          </p>
          <p v-if="one.EntryTime">
            <label>进件时间：</label>
            <span>{{one.EntryTime}}</span>
          </p>
          <p>
            <label>成交时间：</label>
            <span>{{one.AlixTime || '暂无成交信息'}}</span>
          </p>
          <p v-if="one.BusinessFlag">
            <label>成交业务：</label>
            <span>{{one.BusinessFlag}}</span>
          </p>
        </div>
      </section>
      <ul>
        <li>C1券需要在对应C2券激活后，C1用户下一次还款则可激活</li>
      </ul>
      <section class="panel-2" v-for="one in c1list">
        <h6>{{one.ShareTypeDes}} - {{one.CouponCardTitle}}</h6>
        <div class="panel-content">
          <p>
            <label>卡券状态：</label>
            <span>{{one.StateDes}}</span>
          </p>
          <p v-if="one.HalfActiveTime">
            <label>半激活时间：</label>
            <span>{{one.HalfActiveTime}}</span>
          </p>
          <p v-if="one.ActivateTime">
            <label>激活时间：</label>
            <span>{{one.ActivateTime}}</span>
          </p>
          <p>
            <label>领券时间：</label>
            <span>{{one.CreateTime}}</span>
          </p>
          <p>
            <label>C2手机号：</label>
            <span>{{one.C2Telphone}}</span>
          </p>
          <p v-if="one.C2Name">
            <label>C2姓名：</label>
            <span>{{one.C2Name}}</span>
          </p>
          <p>
            <label>C2券状态：</label>
            <span>{{one.C2StateDes}}</span>
          </p>
          <p v-if="one.C2ActivateTime">
            <label>C2激活时间：</label>
            <span>{{one.C2ActivateTime}}</span>
          </p>
          <p>
            <label>C1上次还款时间：</label>
            <span>{{one.LastPaymentTime || '暂无还款信息'}}</span>
          </p>
        </div>
      </section>
    </article>
    <a href="javascript:void(0)" @click="back">返回</a>
  </div>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .page-result{
    background: #fff;
    padding-bottom: px2rem(120);

    h3{
      @include fsize(32);
      @include borderBottom;
      font-weight: normal;
      color:$dark-color;
      line-height: $main-line-height;
      padding:px2rem(28) px2rem(40);

      em{
        font-style: normal;
        color:$main-color;
        margin:0 px2rem(12);
      }
    }

    ul{
      @include fsize(28);
      color:#888;
      padding:px2rem(30) px2rem(40);

      li{
        list-style-type:disc;
        list-style-position:inside;
        line-height: 1.8;
      }
    }

    >a{
      @include fsize(32);
      position: fixed;
      background: $main-color;
      color:#fff;
      bottom:0;
      left:0;
      right:0;
      line-height: px2rem(100);
      text-align: center;
    }

    section{
      padding:0 px2rem(48);
      box-sizing: border-box;

      h6{
        @include borderBottom(#d6d6d6);
        @include fsize(32);
        font-weight: normal;
        line-height: px2rem(108);
        padding-left: px2rem(32);
      }

      .panel-content{
        padding:px2rem(30) px2rem(32);
      }

      p{
        font-size:px2rem(28);
        color:$normal-color;
        display: flex;
        line-height: $main-line-height;
        margin-bottom: px2rem(23);

        label{
          width: px2rem(248);
          display: block;
          white-space: nowrap;
        }

        span{
          display: block;
          white-space: nowrap;
        }
      }
    }

    .panel-1{
      width: 100%;
      background: url(./bg1.png) no-repeat left top;
      background-size: px2rem(750) 100%;
      padding-top: px2rem(20);
      padding-bottom: px2rem(20);
    }

    .panel-2{
      width: 100%;
      background: url(./bg1.png) no-repeat left top;
      background-size: px2rem(750) 100%;
      padding-top: px2rem(13);
      padding-bottom: px2rem(20);
    }
  }

</style>

<script>
import ComponentHeader from 'libs/header'

export default {
  props:['info'],
  data () {
    return {
     name: ''
    }
  },

  computed:{
    c1list(){
      return this.info.filter(item=>{
        if(item.Name){
          this.name = item.Name
        }
        return item.ShareType === 1003 || item.ShareType === 1151
      })
    },
    c2list(){
      return this.info.filter(item=> {
        if(item.Name){
          this.name = item.Name
        }
        return item.ShareType === 1002 || item.ShareType === 1064
      })
    }
  },

  methods:{
    back(){
      history.go(-1)
    }
  },

  created(){
    if(!this.info){
      this.$router.go('/')
    }
  },

  components: {
    ComponentHeader,
  }
}
</script>