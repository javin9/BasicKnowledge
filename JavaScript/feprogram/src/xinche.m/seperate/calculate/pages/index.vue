<template>
  <!-- header -->
	<component-header :title="title" type="page"></component-header>

  <!-- 基本信息面板 -->
  <info v-ref:info></info>

  <!-- 输入面板 -->
  <sources v-ref:sources :price="$refs.info.price"></sources>

  <!-- 结果面板 -->
  <result v-if="$refs.sources.tab === 1" :taxType="taxType" :price="$refs.info.price" :tax-type="$refs.sources.taxType" :finalrate="$refs.sources.finalrate" :payment="$refs.sources.payment" :first-price="$refs.sources.firstPrice" :must-cost="$refs.sources.mustCost" :payment-price="$refs.sources.paymentPrice" :tax-rate="$refs.sources.taxRate" :term="$refs.sources.term" :insurance-price="$refs.sources.insurancePrice" v-show="!$refs.sources.insuranceModal"></result>

  <!-- 跳转按钮 -->
  <span v-if="!isAppHide">
    <buttons v-show="!$refs.sources.insuranceModal" :link-target="linkTarget"></buttons>
  </span>

</template>

<style scoped>
</style>

<script>
import Header from '../components/header.vue'
import Info from '../components/info.vue'
import Sources from '../components/sources.vue'
import Result from '../components/result.vue'
import Buttons from '../components/buttons.vue'

export default {
  data () {
    return {
    	title: '购车计算',
        isAppHide:Boolean(tools.isWebView() == 'yixinbjapp'),
        linkTarget:tools.getUrlParam("from") == "2158"?"_blank":"_self"
    }
  },

  components: {
  	'component-header': Header,
    Info,
    Sources,
    Result,
    Buttons
  },
  created(){
    $('body').addClass('theme-' + (tools.getUrlParam('theme') || 'a'))
  }
}
</script>