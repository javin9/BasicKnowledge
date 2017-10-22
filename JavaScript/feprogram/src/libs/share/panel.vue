<!-- 
  分享面板组件
  @example: 
    <share-panel :options="shareOptions" limit="3"></share-panel>

  @param {Object} shareOptions 分享参数
    title : 分享标题, 可选，默认document.title
    url : 分享url及生成二维码url, 可选，默认当前页面url
    desc : 分享描述, 可选，默认同title
    image: 分享图片, 可选， 默认空

  @param {Number} limit 可选, 最多显示的分享类型条数

  @event onPanelQrcode 点击扫一扫事件
-->

<template>
  <ul class="share-panel-list">
    <li v-for="one in list">
      <a href="javascript:void(0)" :class="one.className" @click="clickDispatcher(one.click)">{{one.name}}</a>
    </li>
  </ul>
</template>

<style scoped>
  @import 'sassHelper/mixin';
</style>

<script>
import shareList from './shareList'

export default {
  props:['options','limit', 'filter'],
  data () {
    return {
      list: [],
      params: {
        url : window.location.href,
        title: document.title,
        image: '',
        desc: document.title
      }
    }
  },

  events:{
    showShare(){
      this.show = true
    },
    hideShare(){
      this.show = false
    },
    updateShare(options){
      this.params = Object.assign({},this.params, this.options, {
        image_title: this.options.title || this.params.title
      },options || {})

      let list = shareList(this.params, () => {
        this.$dispatch('onPanelQrcode')
      }).filter( item => item.show)

      if(this.filter){
        list = list.filter(item => this.filter.indexOf(item.className) >= 0)
      }

      if(this.limit){
        list = list.slice(0, this.limit)
      }

      this.list = list
    }
  },

  methods:{
    close(){
      this.show = false
      this.reset()
    },

    clickDispatcher(clickHandler){
      if(this.params.beforeShare){
        this.params.beforeShare(clickHandler)
      }else{
        clickHandler()
      }
    }
  },

  created(){
    this.$emit('updateShare')
  }
}
</script>