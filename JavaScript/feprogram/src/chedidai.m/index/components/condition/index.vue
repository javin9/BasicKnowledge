<template>
	<section class="block">
		<header class="block-header"><span>申请条件</span></header>
	  <div class="panel">
	  	<dl>
		  	<dt class="icon-car"></dt>
	  		<dd>
	  			<h6>车辆要求：</h6>
	  			<p>车辆无抵押、无质押、所有权完整</p>
	  			<p>车辆年检正常</p>
	  			<p>无待处理违章信息</p>
	  		</dd>
	  	</dl>
	  	<dl>
		  	<dt class="icon-id"></dt>
	  		<dd>
	  			<h6>身份要求：</h6>
	  			<p>18-60周岁大陆公民</p>
	  			<p>个人车主、上班族、私营企业主、本地常住居民</p>
	  			<p>良好的还款习惯 充足的银行流水</p>
	  		</dd>
	  	</dl>
	  	<dl>
		  	<dt class="icon-material"></dt>
		  	<dd>
		  		<h6>所需材料：</h6>
		  		<p>身份证、车辆登记证、本地常住证明、征信报告委托书</p>
		  		<p>6个月银行流水、车辆保单</p>
		  	</dd>
	  	</dl>
	  </div>
	</section>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

	header:before{
		background-image: url(./icon.png);
	}

  .panel{
  	width: 100%;
  	background: #fff;
    padding-bottom: px2rem(10);

  	dl{
  		margin-left: px2rem(30);
  		padding:px2rem(20) 0 px2rem(20);
  		border-bottom:1px solid #E5E5E5;

  		&:last-child{
  			border:0;
  		}

  		dt{
  			@include size(px2rem(32));
  			float: left;
				background-repeat: no-repeat;
				background-position: center center;
				background-size: contain;
				margin-right: px2rem(20);

  			&.icon-id{
  				background-image: url(./id.png);
  			}
  			&.icon-material{
  				background-image: url(./material.png);
  			}
  			&.icon-car{
  				background-image: url(./car.png);
  			}
  		}

  		dd{
  			@inlcude fsize(24);
  			overflow: hidden;
				line-height: 1.5;

  			h6{
  				color:#333;
  				line-height: 1.2;
          margin-bottom: px2rem(10);
  			}

  			p{
  				color:#666;
  			}
  		}
  	}
  } 
</style>

<script>
  export default {
    data () {
      return {
      }
    }
  }
</script>