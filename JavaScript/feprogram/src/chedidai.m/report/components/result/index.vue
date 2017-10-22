<template>
  <section>
  	<slot></slot>
  	<p class="des">本结果仅供参考，实际金额以线下真实额度为准</p>
	  <div style="text-align:center;">
		  <a href="javascript:void(0)" v-bind:class="{'button':true,'hide':isApp}" @click="download">下载易鑫App</a><a href="javascript:void(0)" v-bind:class="{'button':true,'crossing':isApp,'app-hide':!isApp}" @click="goHome">返回首页</a>
	  </div>

  </section>
</template>

<style>
	@import 'sassHelper/mixin';

	.result-panel{
		h2{
			@include fsize(30);
			color:#333;
		}

		.info{
			@include fsize(24);
			color:#686868;
			margin:px2rem(10) 0;

			span{
				margin-right: px2rem(16);

				&:after{
					content:'|';
					padding-left: px2rem(16);
				}
				
				&:last-child:after{
					content:'';
				}
			}
		}

		ul{
			display:flex;
			margin:px2rem(40) px2rem(50);

			li{
				flex:1;
				text-align: center;
				position: relative;

				&:after{
					position:absolute;
					right:0;
					top:50%;
					transform:translateY(-50%);
					content:' ';
					display: block;
					width: px2rem(2);
					height:px2rem(61);
					background: #E5E5E5;
				}

				&:last-child:after{
					display: none;
				}

				h6{
					span{
						@include fsize(40);
						display: inline-block;
						vertical-align: middle;
					}

					em{
						@include fsize(24);
						vertical-align: middle;
						display: inline-block;
						position: relative;
						top: px2rem(5);
					}
					color:#E9474D;
				}

				&.dark h6{
					color:#333;
				}


				p{
					@include fsize(24);
					color:#686868;
					padding-top: px2rem(5);
				}
			}
		}
	}
</style>
<style scoped>
	@import 'sassHelper/mixin';
	@import 'sassHelper/vars';

	section{
		padding:px2rem(30);
		background: #fff;
		margin-bottom: px2rem(20);

		.des{
			@include fsize(22);
			color:#999;
			margin:px2rem(20) 0;
		}

		.button{
			@include border(#E9474D,2px);
			@include fsize(32);
			display:inline-block;
			text-align:center;
			border-radius:px2rem(5);
			background: #fff;
			color:#E9474D;
			padding:0;
			line-height: px2rem(90);
			height: px2rem(90);
			width: px2rem(300);
			margin:0 px2rem(15);
			white-space: nowrap;

			&.hide{
				display: none;
			 }
			&.crossing{
				width:auto;
				margin:0;
				display:block;
			 }
			&.app-hide{
				border-color:#c4c4c4;
				color:$normal-color;
			 }
		}
	}
</style>

<script>
export default {
  data () {
    return {
    	isApp: Boolean(tools.isWebView() == 'yixinapp'),
    	homelink: window.HomePageUrl
    }
  },

  created(){
  },

  methods: {
  	goHome(){
  		if(this.isApp){
  			tools.jsNativeBridge('backCZDHome','goHome')
  		}else{
  			window.location.href = this.homelink
  		}
  	},
	  download(){
          window.location.href = window.xinUrl + '/app/down/?from=1719'
	  }
  }
}
</script>