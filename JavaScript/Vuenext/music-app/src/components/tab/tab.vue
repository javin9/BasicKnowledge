<template>
<div>
   <div class="tab">
   	<router-link tag="div" class="tab-item" :to="{name:'recommend'}">
	 <a class="tab-link">推荐</a>
	</router-link>	
	<router-link tag="div" class="tab-item" :to="{name:'singer'}">
	 <a class="tab-link">歌手</a>
	</router-link>	
	<router-link tag="div" class="tab-item" :to="{name:'rank'}">
	<a class="tab-link">排行</a>
	</router-link>	
	<router-link tag="div" class="tab-item" :to="{name:'search'}">
	<a class="tab-link">搜索</a>
	</router-link>	
   </div>
   <div class="line"></div>
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
@import "../../common/less/mixin.less";
 .tab{display:flex;display:-webkit-box;}
 .tab .tab-item{flex:1;-webkit-box-flex:1;text-align:center;height:100/@r;line-height:100/@r;background-color:#fff;}
 .tab .tab-link{color:#000;display:block;}
 .router-link-active{border-bottom:2/@r solid #31C27C;}
.router-link-active .tab-link{color:#FF6503;}
 .line{height:15/@r;background:#eee;}
</style>
