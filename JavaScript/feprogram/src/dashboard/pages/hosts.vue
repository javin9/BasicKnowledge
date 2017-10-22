<template>
  <section>
  		<pre id="hosts">
  192.168.145.8 dashboard.dev.daikuan.com
  192.168.145.8 wiki.dev.daikuan.com
  192.168.145.8 placehold.it
	  	</pre>
	  	<button type="button" class="btn btn-primary copy-btn" data-clipboard-target="#hosts">复制hosts</button>
  </section>
</template>

<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
</style>

<script>
	import Clipboard from 'clipboard'
  export default{
      data(){
          return {
          }
      },

      ready(){
      	new Clipboard('.copy-btn')
      }
  }
</script>
