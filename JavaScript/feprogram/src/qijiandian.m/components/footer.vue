<template>
	<footer>
		<p>北京易鑫信息科技有限公司 版权所有</p>
		<p>Copyright © 2015-2016 daikuan.com</p>
  </footer>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  footer{
  	@include fsize(map-get($mfont, s));
  	color:map-get($mfont, light);
  	line-height: map-get($line, l);
  	text-align: center;
  	padding-bottom: px2rem(20);
  }
</style>