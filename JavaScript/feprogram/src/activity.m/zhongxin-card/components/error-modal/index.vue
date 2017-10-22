<template>
	<section class="component-error-modal" transition="opacity" v-if="show">
	 <h1>{{title}}</h1>
   <p>{{{content}}}</p>
   <footer>
     <a href="javascript:void(0)" @click="close">{{button}}</a>
   </footer>
	</section>
  <mask @click="close"></mask>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

	.component-error-modal{
    position: fixed;
    width: px2rem(620);
    left:50%;
    top:50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
    background: #fff;
    border-radius:px2rem(12);

    h1{
      @include fsize(36);
      color:$dark-color;
      padding:px2rem(40) 0 px2rem(27);
      line-height: $main-line-height;
      text-align: center;
    }

    p{
      @include fsize(32);
      color:$dark-color;
      line-height: $main-line-height;
      padding:0 px2rem(38) px2rem(30);
      font-weight: normal;
    }

    footer{
      @include borderTop;
      @include fsize(32);
      line-height: px2rem(100);
      text-align: center;
      a{
        color:$main-color;
      }
    }
	}
</style>

<script>
import Mask from 'libs/mask'

export default {
  props:[],

  data() {
    return {
      show: false,
      title: '',
      content: '',
      button: ''
    }
  },

  events: {
    showModal(title, content, button='我知道了'){
      this.title = title
      this.content = content
      this.button = button
      this.show = true
      this.$broadcast('showMask')
    },
    hideModal(){
      this.show = false
      this.button = this.title = this.content = ''
      this.$broadcast('hideMask')
    }
  },

  methods: {
    close(){
      this.$emit('hideModal')
    }
  },


  components:{
   Mask
  }
}
</script>