<template>
 <div>
 <h2>我是DOC</h2>
 <ul>
 	<router-link tag="li" to="/doc" exact>
 	<div>文档1</div>
 		
 	</router-link>	
 	<router-link tag="li" to="/doc/d2">
 		<a>文档1</a>
 	</router-link>	
 	<router-link tag="li" to="/doc/d3">
 		<a>文档1</a>
 	</router-link>	
 </ul>
 <router-view></router-view>	
 </div>
</template>

<script>
export default {
  name: 'doc',
  data:function() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
