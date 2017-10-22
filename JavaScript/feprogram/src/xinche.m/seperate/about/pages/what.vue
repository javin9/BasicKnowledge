<template>
	<component-header :title="title"></component-header>

	<article>
		<p>易鑫车贷主要提供新车贷款、二手车贷款、车抵贷、汽车租赁、汽车保险、车主信用卡等产品服务，除了与多家金融机构合作外，还拥有易鑫集团自营业务，提供丰富的汽车金融产品与服务，帮您轻松解决资金问题！</p>

		<h6>新车贷款</h6>
		<p>易鑫车贷与汽车金融公司、银行等主流金融机构合作，集合了220+金融机构的数万种金融产品，业务覆盖全国，确保每款新车都有丰富的车贷方案可供选择，并为用户提供<span>一证贷、极速贷、低息贷、两证通、付一半、0首付、0利息</span>等多元化金融产品和服务。现已帮助上千万购车用户成功提到新车，放款金额已超过百亿。</p>

		<h6>二手车贷款</h6>
		<p>易鑫车贷精选百万二手车车源、有保障车源信息，购车用户可直接线上选车、选贷款，每天为超过5000用户提供二手车贷款服务；<span>申请时门槛低、放款快，最快10秒审批、并当天可放款，1对1专家级线下顾问陪同</span>，全程为易鑫车贷的二手车贷款用户提供贴心服务。</p>

		<h6>车抵贷</h6>
		<p>车抵贷是易鑫车贷面向全国车主提供的车辆抵押贷款服务，有车就能贷，<span>抵押后，车辆可以正常使用</span>。易鑫车贷拥有国内专业的二手车评估技术支持，评估精准、真实、快速。因放贷快、额度高、费率低、分期易、可选抵押、机构丰富，车抵贷业务深受全国车主欢迎，累计放款金融已经数十亿。</p>

		<h6>汽车租赁</h6>
		<p>易鑫车贷集采主流车型，全新车辆，<span>提供经营性租赁服务，送税送险还送牌，让您年年开新车</span>。低月租，手续简便，提车快捷，租期灵活；两证一卡即可申请，最快当天批复；1对1线下顾问服务，全程体验来自易鑫车贷的优质服务。</p>

		<h6>汽车保险</h6>
		<p>易鑫车险平台集合车险行业八大品牌，在官网价格上，更有好礼相送。采用图象解析技术，<span>只需一张行驶本照片，1分钟即获优惠车险报价，全网首发“真比价”</span>，只买对的，不买贵的。信息找回功能，降低客户记忆成本，打造极致投保体验。在线便捷支付，微信、支付宝、京东白条方式各取所需，保单快递到家。贴心服务，易鑫车险微信公众号，为客户带来全方位的呵护。</p>

		<h6>车主信用卡</h6>
		<p>易鑫车贷将各种特色的车主信用卡进行了汇集，为车主线上选择并申请开通信用卡提升绿色通道，其中较为出众的是：易车广发联名信用卡，现办理可获得加油返现3%、保养减免、维修打折、便捷ETC、道路救援、保险免息等多种功能和服务。</p>
	</article>

</template>

<style>
	body{
		background: #fff;
	}
</style>
<style scoped>
@import '../vars';
@import '../mixin';

article{
	padding:px2rem(40) px2rem(30);
	line-height: map-get($line, m);

	p{
		@include font(m);
		color:map-get($mfont, dark);
		padding:px2rem(20) 0;

		span{
			color:$font-main;
		}
	}

	h6{
		@include font(m);
		color:map-get($mfont,black);
		margin-top: px2rem(20);
		border-left: px2rem(6) solid $font-active;
		line-height:px2rem(33);
		text-indent: px2rem(30);
	}
}
</style>

<script>
import Header from '../components/header.vue'
import Footer from '../components/footer.vue'

export default {
  data () {
    return {
    	title: '我们做什么'
    }
  },

  components: {
  	'component-header': Header,
  	'component-footer' : Footer
  }
}
</script>