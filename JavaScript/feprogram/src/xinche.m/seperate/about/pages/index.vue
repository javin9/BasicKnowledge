<template>
	<component-header :title="title"></component-header>
	<div class="about-logo">
		<img src="../images/logo.png">
		<h6>易鑫集团</h6>
	</div>
	<ul class="about-list">
		<li>
			<a v-link="'who'">我们是谁</a>
		</li>
		<li>
			<a v-link="'what'">我们做什么</a>
		</li>
		<li>
			<a v-link="'advantage'">我们的优势</a>
		</li>
		<li>
			<a v-link="'media'">媒体报道</a>
		</li>
		<li>
			<a v-link="'contact'">联系我们</a>
		</li>
		<li>
			<a :href="helpcenterUrl">帮助中心</a>
		</li>
		<li>
			<a :href="tiyandianUrl"><span>易鑫体验店</span><em>招募中</em></a>
		</li>
	</ul>
	<component-footer></component-footer>
</template>

<style>
@import '../vars';
@import '../mixin';

$main: map-get($colors, red);

body{
	@include font-family(font-hei);
	background: map-get($bg, white);
}
.about-logo{
	text-align: center;
	width: 100%;
	padding:px2rem(60) 0 px2rem(40);

	img{
		width: px2rem(140);
		height:px2rem(131);
	}

	h6{
		@include font(m);
		font-weight: normal;
		padding:px2rem(22) 0;
	 	}

}
.about-list{
	min-height:px2rem(600);
	min-height:50vh;

	a{
		display: flex;
		align-items: center;
		@include font(l);
		border-top:1px solid map-get($border, normal);
		line-height: px2rem(96);
		padding:0 px2rem(30);
		position: relative;
		text-decoration: none;

		&:after{
			@include arrow(right, px2rem(20), px2rem(30));
		}

		span {
			display: block;
		}

		em {
			display: block;
			margin-left: px2rem(10);
			width: px2rem(80);
			height: px2rem(36);
			line-height: px2rem(36);
			box-shadow: inset 0 0 0 1px $main;
			border-radius: px2rem(3);
			@include fsize(22);
			text-align: center;
			color: $main;
		}
	}

	li:last-child a{
		border-bottom:1px solid map-get($border, normal);
	}
}
</style>

<script>
import Header from '../components/header.vue'
import Footer from '../components/footer.vue'
import wxBridge from 'wx-bridge'    // 微信分享

export default {
  data () {
    return {
    	title: '关于我们',
    	helpcenterUrl: window.helpcenterUrl,
    	tiyandianUrl: window.tiyandianUrl
    }
  },

  components: {
  	'component-header': Header,
  	'component-footer' : Footer
  },
  ready(){
  	// 微信分享
    wxBridge(Object.assign({}, window.__WX_AUTH__ || {}, {
        debug: false,
        title: '关于我们',
        desc: '易鑫集团为您提供全面的线上汽车金融产品和服务',
        imgUrl: `http://img1.yixinfinance.com/jinrong/assets/xinche.m/seperate/about/images/yixinjituan.html.png`,
        shareUrl: window.location.href
    }));
  }
}
</script>