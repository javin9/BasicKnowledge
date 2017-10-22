<template>
  <div class="component-modal" v-show="show" transition="opacity">
    <div 
      class="component-modal-content" 
      :class="{'component-modal-content-has-title' : runtime.title || title, 'component-modal-content-success' : runtime.type === 'success'}">
      <h6 v-if="runtime.title || title">{{runtime.title || title}}</h6>
      <p v-if="runtime.content || content" :style="{'textAlign': runtime.align || align}">{{runtime.content || content}}</p>
    </div>
    <footer>
      <a 
        href="javascript:void(0)" 
        class="component-modal-cancel" 
        v-if="runtime.type==='confirm'"
        @click="close" 
      >{{runtime.cancelText || cancelText}}</a>

      <a 
        href="javascript:void(0)" 
        class="component-modal-confirm" 
        @click="runtime.callback"
      >{{runtime.confirmText || confirmText}}</a>
    </footer>
  </div>
  <mask></mask>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';

  .component-modal{
    @include border;
    border-radius:px2rem(12);
    position:fixed;
    left:50%;
    top:50%;
    transform:translate(-50%, -50%);
    background: #fff;
    box-sizing:border-box;
    width: px2rem(625);
    z-index: 12000;

    &-content{
      padding:px2rem(76) px2rem(38);

      &-has-title{
        padding: px2rem(40) px2rem(38);
      }

      &-success{
        padding: px2rem(191) px2rem(38) px2rem(60);
        background: url(./success.png) no-repeat center px2rem(62);
        background-size: px2rem(96) px2rem(96);
      }
    }

    h6{
      @include fsize(36);
      font-weight: normal;
      line-height: $main-line-height;
      text-align: center;
      color:$dark-color;
      margin-bottom: px2rem(20);
    }

    p{
      @include fsize(32);
      font-weight: normal;
      line-height: $main-line-height;
      color:$dark-color;
    }

    footer{
      @include borderTop;
      display:flex;

      a{
        @include fsize(32);
        display: block;
        min-width: 0;
        text-align: center;
        flex: 1;
        line-height: px2rem(100);
        box-sizing:border-box;
        text-decoration: none;

        &.component-modal-cancel{
          @include borderRight;
          color:#B2B2B2 !important;
        }

        &.component-modal-confirm{
          color:$main-color !important;
        }
      }
    }
  }
</style>

<script>
import Mask from 'libs/mask'

export default {
  props:{
    type: {
      type: String,
      default: 'alert'
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    align: {
      type: String,
      default: 'center'
    },
    mask: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      show: false,
      runtime: {}
    }
  },

  events:{
    showModal(options = {}, content='', callback){
      if(typeof options === 'object'){
        this.runtime = options
      }else{
        this.runtime = {
          title: content ? options : '', 
          content: content || options,
          callback: typeof content === 'function' ? content : callback
        }
      }

      if(!this.runtime.callback){
        this.runtime.callback = this.close.bind(this)
      }

      if(!this.runtime.type){
        this.runtime.type = this.type
      }

      if(this.runtime.mask || this.mask){
        this.$broadcast('showMask')
      }
      this.show = true
    },
    hideModal(){
      this.close()
    }
  },

  methods: {
    close(){
      this.show = false

      if(this.runtime.mask || this.mask){
        this.$broadcast('hideMask')
      }

      setTimeout(() => this.reset(), 500)
    },
    reset(){
      this.runtime = {}
    }
  },

  created(){
  },

  components: {
    Mask
  }
}
</script>