<template>
  <section>
	  <em></em>
	  <h1 v-if="align==='center'">{{title}}</h1>
	  <div v-else class="content">
	  	<h2>{{title}}</h2>
	  	<p>{{description}}</p>
	  </div>
  </section>
</template>

<style scoped>
	@import 'sassHelper/mixin';
	@import 'sassHelper/vars';

	section{
		background: #fff;
		padding:px2rem(60) 0;
		text-align: center;

		em{
			@include size(px2rem(100));
			display: inline-block;
			vertical-align: middle;
			background: url(./success.png) no-repeat center center;
			background-size: px2rem(100);
			margin-right: px2rem(30);
		}

		h1{
			@include fsize(30);
			color:#333;
			display: inline-block;
			vertical-align: middle;
		}

		.content {
			width: px2rem(456);
			text-align: left;
			color:#333;
			display: inline-block;
			vertical-align: middle;

			h2{
				@include fsize(30);
				color:#333;
			}

			p{
				@include fsize(24);
				margin-top: px2rem(10);
				color:$normal-color;
				line-height: $main-line-height;
			}
		}
	}
</style>

<script>
export default {
	props: {
		title: {
			type: String,
			default: '操作成功'
		},
		description: String,
		align: {
			type: String,
			default: 'center'
		}
	},
  data () {
    return {
    }
  },

  created(){
  },

  methods: {
  }
}
</script>