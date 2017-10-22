<template>
	<section class="component-rule" transition="slideup" v-if="show">
		<h1></h1>
    <article>
      <ul>
        <li>本活动推荐人仅限同时办理中信易鑫联名信用卡及“万元开走，月付低至666元”产品的合约期内客户</li>
        <li>本活动所赠月付抵用奖励为月付抵用券, 2017年8月始根据推荐关系成立时间先后顺序陆续发放至推荐双方易鑫账户</li>
        <li>推荐人填写推荐信息后易鑫客服将于3个工作日内联系推荐人核实，被推荐人成功办理“万元开走，月付低至666元”产品且完成首月正常还款，即视为推荐关系成立</li>
        <li>本活动所赠月付抵用不与易鑫集团其他任何推荐类活动共享</li>
        <li>推荐人与被推荐人最多可获6张月付抵用券，月付抵用仅限本活动产品使用</li>
        <li>本活动有效期为2017年7月10日-2017年9月30日，被推荐人超过有效期签约视为无效</li>
        <li>本活动产品仅限首付为1万元的开走吧产品，包括大众polo、大众捷达、大众朗逸、起亚K3，具体车型以开走吧官网介绍为准</li>
        <li>此活动最终解释权归易鑫集团所有</li>  
      </ul>
    </article>
    <a href="javascript:void(0)" @click="close">关闭</a>
	</section>
  <mask @click="close" :touchmove="true"></mask>
</template>

<style>
  .modal-open{
    position: fixed;
    width: 100%;
  }
</style>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

	.component-rule{
    position: fixed;
    bottom:0;
    left:0;
    width: 100%;
    background: #fff;
    z-index: 10000;

    h1{
      background: url(./title.png) no-repeat left top / contain;
      height: px2rem(109);
    }

    article{
      padding:px2rem(20) px2rem(30);
      max-height:px2rem(800);
      overflow-y:auto;
    }

    ul{
      @include fsize(28);
      color:$normal-color;
      line-height: 1.8;
      padding-left: px2rem(35);

      li{
        list-style-type: decimal;
      }
    }

    >a{
      @include fsize(32);
      @include borderTop;
      display: block;
      color: #f5a100;
      line-height: px2rem(100);
      text-align: center;
    }
	}
</style>

<script>
import Mask from 'libs/mask'

export default {
  props:[],

  data() {
    return {
      show: false
    }
  },

  events: {
    showRule(){
      $('body').addClass('modal-open')
      this.show = true
      this.$broadcast('showMask')
    },
    closeRule(){
      $('body').removeClass('modal-open')
      this.show = false
      this.$broadcast('hideMask')
    }
  },

  methods: {
    close(){
      this.$emit('closeRule')
    }
  },


  components:{
   Mask
  }
}
</script>