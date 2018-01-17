<template>
  <div class="loading">
  	<img src="../../common/image/loading.gif"/>
  	<p>{{showtitle}}</p>
  </div>
</template>

<script>
export default {
  props:{
     title:{
     	type:String,
     	default:"加载中···"
     }
  },
  data:function() {
    return {
      showtitle:this.title
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped  lang="less">
@import "../../common/less/mixin.less";
.loading{
   padding-top:50/@r;
}
.loading img{
width:100/@r;
height:100/@r;
}
.loading p{
  text-align:center;
  .fz(20px);
}

</style>
