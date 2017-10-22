<template>
	<component-header :title="title"></component-header>

	<ul>
		<li>
			<em>官方网站:</em>
			<span>daikuan.com</span>
		</li>
		<li>
			<em>微信公众号:</em>
			<span>yxchedai</span>
		</li>
		<li>
			<em>客服电话:</em>
			<span style="margin-right:-50%;"><a href="tel:4000-169-169">4000-169-169</a> (9:00-21:00)</span>
		</li>
		<li>
			<em>我们的地址:</em>
			<p><label>[上海]</label><i>上海市浦东新区杨高南路799号陆家嘴世纪金融广场3号楼12层</i></p>
      <p><label>[北京]</label><i>北京市海淀区首体南路6号新世纪日航饭店写字楼9层</i></p>
		</li>
	</ul>

</template>

<style>
	body{
		background: #fff;
	}
</style>
<style scoped>
@import '../vars';
@import '../mixin';

ul{
	padding:0 px2rem(38);
}

li{
	@include font(m);
	border-bottom:1px solid map-get($border, normal);
	padding:px2rem(33) 0;

	&:last-child{
		border:0;
	}

	em{
		width: px2rem(185);
		display: inline-block;
	}

	span{
		color:$font-active;
	}

	a{
		color:$font-active;
		text-decoration: none;
	}

	i{
		overflow: hidden;
		font-style:normal;
		display: block;
	}

	p{
		margin-top: px2rem(15);
		line-height: map-get($line, m);

		label{
			display: inline-block;
			width: px2rem(100);
			float: left;
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
    	title: '联系我们'
    }
  },

  components: {
  	'component-header': Header,
  	'component-footer' : Footer
  }
}
</script>