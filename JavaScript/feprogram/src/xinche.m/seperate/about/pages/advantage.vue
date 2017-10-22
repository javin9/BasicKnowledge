<template>
	<component-header :title="title"></component-header>
	<section>
		<div class="part">
			<h1>
				<em>1</em>
				<span>海量金融产品和车源</span>
			</h1>
			<img src="../images/about_1.png">
			<ul>
				<li><em></em><span>40000+</span>贷款产品,百万新车+二手车车源，汽车月购买需求<span>680亿</span>元</li>
			</ul>
		</div>

		<div class="part">
			<h1>
				<em>2</em>
				<span>在线审批放款快</span>
			</h1>
			<img src="../images/about_2.png">
			<ul>
				<li><em></em>最快<span>10秒钟</span>在线审批，当日放款</li>
				<li><em></em>部分产品实现在线实时放款</li>
			</ul>
		</div>

		<div class="part">
			<h1>
				<em>3</em>
				<span>省时省事</span>
			</h1>
			<img src="../images/about_3.png">
			<ul>
				<li><em></em><span>0</span>利息<span>低</span>月供</li>
				<li><em></em>低首付低利率 购车无压力，仅凭身份证即可贷款</li>
			</ul>
		</div>

		<div class="part">
			<h1>
				<em>4</em>
				<span>私人订制</span>
			</h1>
			<img src="../images/about_4.png">
			<ul>
				<li><em></em><span>220+</span>品牌金融机构，为您提供私人订制方案</li>
			</ul>
		</div>

		<div class="part">
			<h1>
				<em>5</em>
				<span>贷款顾问1对1免费服务</span>
			</h1>
			<img src="../images/about_5.png">
			<ul>
				<li><em></em>全国<span>300+</span>城市，<span>1000+</span>专业金融服务顾问</li>
				<li><em></em>最快2小时上门服务</li>
			</ul>
		</div>
	</section>
</template>

<style>
	body{
		background: #fff;
	}
	body, body * {
	    max-height: 1000000px;
	}
</style>
<style scoped>
@import '../vars';
@import '../mixin';

section{
	padding:px2rem(60) px2rem(78);

	.part{
		margin-bottom: px2rem(80);

		h1{

			em{
				@include fsize(26);
				@include size(px2rem(48));
				color:map-get($mfont, white);
				display: inline-block;
				vertical-align: middle;
				background: url(../images/label.png) no-repeat left top;
				-webkit-background-size: contain;
				background-size: contain;
				text-align: center;
				line-height: px2rem(48);
				margin-right: px2rem(20);
			}

			span {
				@include font(xl);
				color:map-get($mfont, black);
				display: inline-block;
				vertical-align: middle;
			}
		}

		img{
			margin: px2rem(30) 0 px2rem(30) px2rem(86);
			width: px2rem(401);
		}

		li{
			@include fsize(26);
			color:map-get($mfont, black);
			line-height: map-get($line, l);

			em{
				@include size(px2rem(16));
				display: inline-block;
				/*vertical-align: middle;*/
				background: url(../images/dot.png) no-repeat left top;
				-webkit-background-size: contain;
				background-size: contain;
				margin-right: px2rem(16);
			}

			span{
				color:$font-active;
				display: inline-block;
				/*vertical-align: middle;*/
			}
		}
	}
}
</style>

<script>
import Header from '../components/header.vue'
import Footer from '../components/footer.vue'

export default {
  data () {
    return {
    	title: '我们的优势'
    }
  },

  components: {
  	'component-header': Header,
  	'component-footer' : Footer
  }
}
</script>