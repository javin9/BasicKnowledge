<template>
  <component-header title="活动规则"></component-header>

  <article v-if="isCouponCard">
  	<section>
		  <h2>玩法介绍：</h2>
		  <p>分享“优惠卡”（价值1000元的京东E卡）给您的好友（好友须在易鑫车贷30天内未下过订单），好友领取“优惠卡”并在易鑫车贷网站或App下单后，您会得到1张“同享卡”（价值1000元京东E卡），同享卡可叠加。</p>
  	</section>

  	<section>
		  <h2>详细规则：</h2>
		  <h3>适用对象：</h3>
		  <p>在易鑫车贷网站或App成功贷款购买新车的用户。</p>
		  <h3>产品范围：</h3>
		  <p>易鑫自营金融产品。即：金融产品标题后缀有“易鑫集团”字样的产品。例如：一证贷 (易鑫集团) 、两证通 (易鑫集团)。</p>
      <h3>发放激活机制：</h3>
      <p><strong>优惠卡</strong>：您将“优惠卡”分享给好友，TA点击领取后，TA的账户可获得价值为1000元京东E卡，在易鑫集团个人中心查看。成功放款后可激活使用（激活后会正常显示账号和密码）；</p>
      <p><strong>同享卡</strong>：好友下单后，您的账号中会自动收到1张“同享卡”（价值1000元的京东E卡），在易鑫集团个人中心查看。在好友贷款成功的前提下，您下一次对您的贷款订单进行还款操作，即可激活使用。若累计得到多张“同享卡”，每次还款仅可激活1张。</p>
		  <h3>获取奖励数量：</h3>
		  <p>每个账户可获得1张优惠卡，多张同享卡。</p>
  	</section>

		<section>
		  <h2>注意事项：</h2>
		  <ol>
		  	<li>优惠卡仅能分享给好友，不能自己领取；</li>
		  	<li>获得同享卡的用户不能再领取优惠卡；获得优惠卡的用户可继续领取同享卡；</li>
		  	<li>成功提车手机号与下单贷款手机号一致，方可激活卡券；</li>
		  	<li>拥有相同账户、手机号、微信号、支付账号、设备、银行卡的用户视为同一用户（适用于您及您的朋友）；</li>
        <li>本活动中，未贷款成功前用户收到的卡券，处于未激活状态，仅作为提示，不进行兑换；</li>
        <li>当用户按要求完成邀请好友、贷款购车、还款行为后，会得到易鑫积分奖励，该积分会被自动消耗，以用于激活前期发放的未激活状态的卡券，用户可使用该卡券获取京东E卡；</li>
		  	<li>本次发放的优惠卡、同享卡均为价值1000元的京东E卡（电子形式京东礼品卡）。使用说明见京东官网 https://o.jd.com/market/index.action ；</li>
        <li>任何违规套取奖品的行为，易鑫车贷平台拥有追回奖品、封停账号、以及追究法律责任的权利；</li>
        <li>最终解释权归易鑫车贷所有，相关咨询电话：4000-598-598。</li>
		  </ol>
		</section>
  </article>
	<article v-else>
		<section>
			<h2>玩法介绍：</h2>
			<p>分享链接邀请您的好友在易鑫车贷或者淘车平台下单并成交后，您可得到1张“同享卡”（价值100元京东E卡），您的好友将得到“优惠卡”（价值500元的京东E卡）。</p>
		</section>
		<section>
			<h2>详细规则：</h2>
			<h3>适用对象：</h3>
			<p>邀请人：易鑫车贷或淘车平台的注册用户（易鑫内部员工除外）。</p>
			<p>被邀请人：在淘车平台（或易鑫车贷）上30天内未下过订单的用户。</p>
			<h3>产品范围：</h3>
			<p>易鑫自营金融产品。即：金融产品标题后缀有“易鑫集团”字样的产品。例如：一证贷 (易鑫集团) 、两证通 (易鑫集团)、易鑫租赁出品的“开走吧”等。</p>
			<h3>发放激活机制：</h3>
			<p><strong>同享卡</strong>：经您分享的好友在下单之后，您的账号中会自动收到1张“同享卡”（价值100元的京东E卡），在个人中心查看。在好友贷款成功后，即可激活使用。同享卡不限制激活张数；</p>
			<p><strong>优惠卡</strong>：您的好友点击领取后（领券时间早于下单时间），TA的账户可获得价值为500元京东E卡，在个人中心查看。成功放款后可激活使用（激活后会正常显示账号和密码）。</p>
			<h3>获取奖励数量：</h3>
			<p>每个账户可获得1张优惠卡，多张同享卡。</p>
		</section>

		<section>
			<h2>注意事项：</h2>
			<ol>
				<li>优惠卡仅能分享给好友，不能自己领取；</li>
				<li>获得同享卡的用户不能再领取优惠卡；获得优惠卡的用户可继续领取同享卡；</li>
				<li>成功提车用户的手机号与下单贷款手机号必须一致，方可激活卡券；</li>
				<li>拥有相同账户、手机号、微信号、支付账号、设备、银行卡的用户视为同一用户（适用于您及您的朋友）；</li>
				<li>本活动中，未贷款成功前用户收到的卡券，处于未激活状态，仅作为提示，不进行兑换；</li>
				<li>本次发放的优惠卡价值为500元京东E卡，同享卡为价值100元的京东E卡（电子形式京东礼品卡）。使用说明见京东官网 https://o.jd.com/market/index.action ；</li>
				<li>任何违规套取奖品的行为，易鑫车贷平台拥有追回奖品、封停账号、以及追究法律责任的权利；</li>
				<li>最终解释权归易鑫车贷所有，相关咨询电话：4000-598-598。</li>
			</ol>
		</section>
	</article>
  <a :href="url" class="button">返回</a>
</template>

<style scoped>
  @import 'sassHelper/mixin';

  article{
  	@include fsize(28);
  	background: #fff;
  	color:#333;
  	padding: px2rem(30) px2rem(30) px2rem(100);
  	line-height: 1.5;

  	section{
  		margin-bottom: px2rem(30);
  	}

  	h2{
  		@include fsize(30);
  		font-weight: bold;
  		margin-bottom: px2rem(10);
      line-height: 1.5;
  	}

  	h3{
  		@include fsize(28);
  		font-weight: bold;
  		margin-bottom: px2rem(10);
      line-height: 1.5;
  	}

		p{
			margin-bottom: px2rem(20);
      line-height: 1.5;
		}

		ol{
			padding-left: px2rem(30);
			li{
				list-style-type:decimal;
				margin-bottom: px2rem(20);
			}
		}
  }
  
  .button{
  	@include fsize(32);
  	color:#fff;
  	background: #E9474D;
  	display: block;
  	width: 100%;
  	text-align: center;
  	padding:px2rem(26) 0;
  	position: fixed;
  	bottom:0;
  	left:0;
  }
  strong{
    font-weight: bold;
  }
</style>

<script>
import Header from 'libs/header'

export default {
  props:['url'],
  data () {
    return {
        isCouponCard:window.location.href.toLocaleLowerCase().indexOf('couponcard')>=0
    }
  },

  created(){
    this.url = this.$root.url
  },

  components:{
    'component-header': Header
  }
}
</script>