<template>
  <header class="header-bar">
      <a href="javascript:history.back();" class="nav-back"></a>
      <h1 class="font-nav">{{title}}</h1>
      <span></span>
  </header>
</template>

<style>
</style>

<script>
  export default {
  	props: ['title'],
    data () {
      return {
      }
    }
  }
</script>
