<!-- 
  分享弹层组件
  @example: 
    <share :options="shareOptions" qrcode-title="二维码描述标题" title="分享描述标题" :show.sync="showShareCtl" view="share"></share>

  @param {Object} shareOptions 分享参数
    title : 分享标题, 可选，默认document.title
    url : 分享url及生成二维码url, 可选，默认当前页面url
    desc : 分享描述, 可选，默认同title
    image: 分享图片, 可选， 默认空

  @param {String} title 可选,分享view标题，默认'分享到'
  @param {String} qrcodeTitle 可选,二维码view标题, 默认同title
  @param {String} view 可选,初始展示的view: share | qrcode, 默认share
  @param {Boolean} show 可选,近当用props控制展示与否时使用

  @event showShare 显示分享弹层
  @event hideShare 隐藏分享弹层
-->

<template>
    <div class="mask" v-if="show" transition="opacity" @click="close"></div>
    <div class="share-modal" v-if="show" transition="slideup">
      <header>{{currentView === 'share' ? title : qrcodeTitle}}</header>
      <div class="content" v-if="currentView === 'qrcode'">
        <div class="qrcode-wrapper">
          <img :src="qrcode" v-if="qrcode">
        </div>
      </div>
      <div class="content" v-if="currentView === 'share'">
        <ul class="share-modal-list">
          <li v-for="one in list"  v-if="one.show" >
            <a href="javascript:void(0)" :class="one.className" @click="one.click">{{one.name}}</a>
          </li>
        </ul>
      </div>
      <footer>
        <div @click="close">取消</div>
      </footer>
    </div>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  .opacity-transition {
    opacity:1;
    transition: all .3s ease;
  }
  .opacity-enter, .opacity-leave {
    opacity:0;
  }
  .slideup-transition {
    transform:translateY(0);
    transition: all .3s ease;
  }
  .slideup-enter, .slideup-leave {
    transform:translateY(100%);
  }
  .mask{
    position: fixed;
    background: rgba(0,0,0,.4);
    left:0;
    top:0;
    width: 100%;
    height:100%;
    z-index:9999;
  }

  .share-modal{
    background: #fff;
    position: fixed;
    left:0;
    bottom:0;
    width: 100%;
    z-index:9999;
    header{
      @include fsize(26);
      text-align: center;
      color:#333;
      padding:px2rem(50) 0 px2rem(30);
    }

    footer{
      @include fsize(32);
      color:#000;
      padding:px2rem(30);
      text-align: center;
      border-top:1px solid #CDCED2;
    }
  }

  .content{

    .qrcode-wrapper{
      text-align: center;
      padding:px2rem(20) 0 px2rem(60) 0;
      >img{
        @include size(px2rem(300));
      }
    }
  }
</style>

<script>
import QRCode from 'libs/qrcode'
import shareList from './shareList'

export default {
  props:['options', 'view', 'title', 'qrcodeTitle', 'show'],
  data () {
    return {
      list: [],
      qrcode:'',
      currentView:'share',
      params: {
        url : window.location.href,
        title: document.title,
        image: '',
        desc: document.title
      }
    }
  },

  events:{
    showShare(view){
      if(view){
        this.currentView = view
      }
      this.show = true
      $('body').bind('touchmove', e => e.preventDefault())
    },
    hideShare(){
      this.show = false
      $('body').unbind('touchmove')
    },
    updateShare(options){
      this.reset()
      this.params = Object.assign({},this.params, this.options, {
        image_title: this.options.title || this.params.title
      }, options || {})

      this.list = shareList(this.params, () => {
        this.currentView =  'qrcode'
      })
      const qrcodeElement = new QRCode(document.createElement('div'), {
        text: `${this.params.url}`,
        width: 1000,
        height: 1000,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
      })

      this.$nextTick(()=>{
        this.qrcode = qrcodeElement._el.querySelector('canvas').toDataURL('image/png')
      })
    }
  },

  methods:{
    close(){
      this.show = false
      $('body').unbind('touchmove')
      this.reset()
    },

    reset(){
      this.currentView = this.view || 'share'
      this.title = this.title || '分享到'
      this.qrcodeTitle = this.qrcodeTitle || this.title
    }
  },

  created(){
    
  },

  compiled(){
    this.$emit('updateShare')
  }
}
</script>