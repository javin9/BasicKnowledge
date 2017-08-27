<template>
  <div>
  	<h2>关于页面</h2>
  	<div class="content">content</div>
  </div>
</template>

<script>
export default {
  name: 'about',
  data:function() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .content{height:20000px;background-color:#BCEE68;}
</style>
