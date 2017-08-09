<template>
   <h3>{{ $route.params.title }}</h3>
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
