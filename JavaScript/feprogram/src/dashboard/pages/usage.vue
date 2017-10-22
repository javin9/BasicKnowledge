<template>
	<iframe :src="location" frameborder="0"></iframe>
</template>

<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';

    iframe{
    	width: 1200px;
    	height:800px;
    	border:0;
    }
</style>

<script>
  export default{
    data(){
      return {
      	location: dev ? 'http://dashboard.daikuan.com/usepage' : 'usepage'
      }
    },

    methods:{
    },

    created(){
    }
  }
</script>
