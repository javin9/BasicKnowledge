<template>
  <div class="tip">已抵押车辆仅可评估车辆价格，不可贷款</div>
  <header>
    <h2>补充以下车辆信息可快速贷款：</h2>
    <ul>
      <li>提高审批速度</li>
      <li>提高成功率</li>
      <li>免费获取评估报告</li>
    </ul>
  </header>
</template>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';
  .tip{
    background: #FFF4EA;
    line-height:px2rem(66);
    padding:0 px2rem(30);
    @include fsize(26);
    color: #FF8C39;
    text-align:left;
  }
  header{
    background: #fff;
    padding:px2rem(30);
    h2{
      @include fsize(26);
      font-weight: normal;
      color:$dark-color;
    }

    ul{
      display:flex;
      margin-top: px2rem(10);
    }

    li{
      display: block;
      background: url(./icon.png) no-repeat left center;
      background-size: px2rem(26);
      padding-left: px2rem(36);
      color:$normal-color;
      margin-right: px2rem(30);
      white-space: nowrap;
    }
  }
</style>

<script>
  export default {
    data () {
      return {
      }
    },

    methods: {
    }
  }
</script>