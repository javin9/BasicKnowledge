<template>
	<section class="block">
		<header class="block-header"><span>车贷申请流程</span></header>
	  <div class="panel">
      <ul>
        <li><i></i><span>线上申请</span></li>
        <li><i></i><span>线下办理手续</span></li>
        <li><i></i><span>申请材料审核</span></li>
        <li><i></i><span>贷款成功</span></li>
      </ul>
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
    padding:px2rem(53) 0 px2rem(39);

    ul{
      display:flex;
    }

    li{
      flex:1;
      text-align: center;
      position: relative;
    }

    span{
      @include fsize(24);
      color:$normal-color;
    }

    i{
      display: block;
      height:px2rem(60);
      background-repeat: no-repeat;
      background-position: center center;      
      margin-bottom: px2rem(25);

      &:after{
        content: ' ';
        width:px2rem(12);
        height:px2rem(22);
        position: absolute;
        background: url(arrow.png) no-repeat center center;
        background-size: contain;
        right:0;
        top:20%;
        transform:translateX(100%);
      }
    }

    li:nth-child(1) i{
      background-image: url(online.png);
      background-size: px2rem(60);
    }
    li:nth-child(2) i{
      background-image: url(offline.png);
      background-size: px2rem(60);
    }
    li:nth-child(3) i{
      background-image: url(material.png);
      background-size: px2rem(60);
    }
    li:nth-child(4) i{
      background-image: url(success.png);
      background-size: px2rem(60);

      &:after{
        display: none;
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