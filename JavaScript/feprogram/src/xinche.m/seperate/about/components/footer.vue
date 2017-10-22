<template>
	<footer>
		<p>北京易鑫信息科技有限公司 版权所有</p>
		<p>Copyright © 2015-{{year}} daikuan.com</p>
  </footer>
</template>

<script>
export default {
  data () {
    return {
        year:window.thisYear?window.thisYear:2017
    }
  }
}
</script>

<style scoped>
@import '../vars';
@import '../mixin';

footer{
	@include fsize(map-get($mfont, s));
	color:map-get($mfont, light);
	line-height: map-get($line, l);
	text-align: center;
	padding-bottom: px2rem(20);
	margin-top: px2rem(40);
}
</style>