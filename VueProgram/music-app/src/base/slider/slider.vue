<template>
 <div class="slider">
 	<div class="slider-group">
 		<slot></slot>
 	</div>
 	<div class="slots">
 		
 	</div>
 </div>
</template>

<script>
export default {
  name: 'hello',
  data:function() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
 .slider{
 	min-height: 1px;
 	.slider-group{
 		position:relative;
 		overflow:hidden;
 		whilte-space:nowrap;
 		.slider-item{
 			float:left;
 			box-sizing:boder-box;
 			overflow:hidden;
 			text-align:center;
 			a{
 				display:block;
 				 width:100%;
 				 overflow:hidden;
 				 text-decoration:none;
 				 img{
 				 	vertical-align: middle;
 				 	background:#E7E7E7;
 				 }
 			}
 		}
 	}
 }
</style>
