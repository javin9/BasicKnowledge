<template>
 <div>用户中心 
    <br />ID :{{$route.params.id}}
    <br />用户名 :{{$route.params.username}}
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
<style scoped>

</style>
