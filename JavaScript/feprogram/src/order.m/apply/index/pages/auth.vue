<template>
	<component-header :title="title"></component-header>
	<p class="tip">您已成功提交订单，补充以下实名认证信息，以加快审批速度，提高通过几率</p>
	<auth-form></auth-form>
</template>

<style scoped>
@import 'sassHelper/mixin';

.tip{
	@include fsize(24);
  color: #9C9FA1;
  line-height: px2rem(36);
	padding:px2rem(20) px2rem(30);
}
</style>

<script>
import Header from '../../components/header.vue'
import authForm from '../../components/form/authForm.vue'

export default {
  data () {
    return {
    	title: '实名认证'
    }
  },
  components: {
  	'component-header': Header,
  	authForm
  }
}
</script>