<template>
	<component-header :title="title"></component-header>
	<section>
		<h6>我们是谁</h6>
		<p>易鑫集团是由腾讯、京东、百度、易车等互联网巨头共同注资百亿元打造的互联网交易平台，以人+车的大数据智能交易系统为核心驱动。整合旗下易鑫车贷App、易鑫车险App、易鑫汽车报价App、淘车App、淘车二手车App、taoche.com、daikuan.com、chexian.com及京东车贷频道等第三方专营合作平台，联合汽车品牌、金融机构、银行等机构，已拥有230余个汽车品牌、220+银行、金融机构及线下15000+经销商合作伙伴网络的汽车金融产品供消费者选择。</p>
		<p>为用户提供全面的线上汽车金融产品和服务，为金融客户提供有效的全方位运营服务。总汽车成交规模超200亿元，业务范围遍及全国300多个城市。</p>
	</section>
	<section>
		<h6>股东背景</h6>
		<p>
			<div class="gudong"></div>
		</p>
		<dl class="tlist">
			<dt><span>腾讯</span></dt>
			<dd>互联网增值服务提供商，腾讯控股有限公司</dd>
			<dd>（香港联交所股票代码：00700）</dd>
		</dl>
		<dl class="tlist">
			<dt><span>京东</span></dt>
			<dd>自营电商企业，京东</dd>
			<dd>(纳斯达克股票代码：JD）</dd>
		</dl>
		<dl class="tlist">
			<dt><span>百度</span></dt>
			<dd>中文搜索引擎，百度</dd>
			<dd>(纳斯达克股票代码：BIDU）</dd>
		</dl>
		<dl class="tlist">
			<dt><span>易车</span></dt>
			<dd>汽车互联网企业，易车控股有限公司</dd>
			<dd>（纽交所股票代码：BITA）</dd>
		</dl>
	</section>
	<section class="history-box">
		<h6 class="tit">过去与未来</h6>
		<div class="history">
			<div class="bg_history_1"></div>
			<div class="bg_history_2"></div>
			<!--<div class="bar"></div>
			<div class="pannel-wrap">
				<div class="pannel current">
					<em>2017.5</em>
					<span>签约工行，获得100亿元人民币融资支持</span>
				</div>
				<div class="pannel">
					<em>2017.5</em>
					<span>获腾讯、易车、东方资产、王卫40亿元人民币投资</span>
				</div>
				<div class="pannel">
					<em>2017.4</em>
					<span>签约农行，获得100亿元人民币战略支持</span>
				</div>
				<div class="pannel">
					<em>2017.4</em>
					<span>与东风启辰签订10000台合作协议</span>
				</div>
				<div class="pannel">
					<em>2017.4</em>
					<span>创国内首单车贷险资ABS</span>
				</div>
				<div class="pannel">
					<em>2017.3</em>
					<span>中泰-易鑫二期证券发行超20亿</span>
				</div>
				<div class="pannel">
					<em>2017.3</em>
					<span>获中泰证券200亿战略投资</span>
				</div>
				<div class="pannel">
					<em>2016.12</em>
					<span>日均线上申请融资金额30亿</span>
				</div>
				<div class="pannel">
					<em>2016.10</em>
					<span>发布易鑫车贷App</span>
				</div>
				<div class="pannel">
					<em>2016.10</em>
					<span>腾讯、京东、百度再注资35亿元人民币</span>
				</div>
				<div class="pannel">
					<em>2016.1</em>
					<span>运营独立网站daikuan.com</span>
				</div>
				<div class="pannel">
					<em>2015.12</em>
					<span>运营腾讯新闻App车贷</span>
				</div>
				<div class="pannel">
					<em>2015.8</em>
					<span>运营京东车贷</span>
				</div>
				<div class="pannel">
					<em>2015.2</em>
					<span>易车、腾讯、京东注资25亿元人民币</span>
				</div>
			</div>-->
		</div>
	</section>
	<!-- <component-footer></component-footer> -->
</template>

<style>
	body{
		background: #fff;
	}
</style>
<style scoped>
@import '../vars';
@import '../mixin';

section{
	padding:px2rem(20) px2rem(30);

	h6{
		@include font(m);
		padding:px2rem(30) 0;
		font-weight: bold;
		color:map-get($mfont, black);
	}

	p{
		@include font(m);
		color:map-get($mfont, dark);
		line-height: map-get($line, m);
	}
}

.gudong{
	width: px2rem(581);
	height:px2rem(355);
	display: block;
	margin:0 auto;
	background: url(../images/gudong.png) no-repeat left top;
	-webkit-background-size: contain;
	background-size: contain;
}

.tlist{
	margin-top: px2rem(20);

	dt{
		@include font(m);
		color: $font-main;
		text-align: center;
		padding:px2rem(20) 0 0;
		border-bottom:1px solid map-get($border, normal);
		width: px2rem(170);
		margin:0 auto px2rem(20);

		span{
			border-bottom:4px solid $font-main;
			display: inline-block;
			padding:px2rem(5);
		}
	}
	dd{
		@include fsize(26);
		color:map-get($mfont, dark);
		text-align: center;
		line-height: map-get($line,m);
	}
}
.history-box{
	padding:px2rem(20) px2rem(0);
	.tit{padding:px2rem(0) px2rem(30);}
	.history{
		@include clearfix;
		.bg_history_1,.bg_history_2{width: 100%;display: block}
		.bg_history_1{background: url("../images/history_1.jpg") no-repeat left top;background-size:px2rem(750) px2rem(1068);height:px2rem(1068);}
		.bg_history_2{background: url("../images/history_2.jpg") no-repeat left top;background-size:px2rem(750) px2rem(939);height:px2rem(939);}
	}
}

/*.bar{
	background: url(../images/history.png) no-repeat left top;
	-webkit-background-size: contain;
	background-size: contain;
	width: px2rem(17);
	height:px2rem(1240);
	float: left;
	margin: 0 px2rem(30) 0 px2rem(10);
}
.pannel-wrap{
	overflow: hidden;
}
.pannel{
	@include font(m);
	color:map-get($mfont, dark);
	height:px2rem(90);
	box-sizing: border-box;
	padding-top: px2rem(18);
	display:flex;
	&.current{
		color: $font-active;
	}

	span,em{
		display: block;
		font-style:normal;
		line-height: 1;
	}
	span{
		flex:1;
		line-height:120%;
	}
	em{
		width: px2rem(160);
	}
}*/

</style>

<script>
import Header from '../components/header.vue'
import Footer from '../components/footer.vue'

export default {
  data () {
    return {
    	title: '我们是谁'
    }
  },

  components: {
  	'component-header': Header,
  	'component-footer' : Footer
  }
}
</script>