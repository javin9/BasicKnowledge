<template>
  <div class="component-card-detail" v-show="show" transition="slideup">
    <header>{{title}}</header>
    <article>{{{content}}}</article>
    <a v-if="button" :href="link">{{button}}</a>
    <em class="component-card-detail-close" @click="close"></em>
  </div>
  <mask :touchmove="true"></mask>
</template>

<style>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';

  /*覆盖后台样式*/
  .component-card-detail article p{
    font-size:px2rem(28) !important;
  }
</style>
<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';

  .component-card-detail{
    background: #fff;
    position: fixed;
    bottom:0;
    left:0;
    right:0;
    z-index: 10000;

    header{
      @include fsize(30);
      text-align: center;
      line-height: $main-line-height;
      color:$dark-color;
      @include borderBottom;
      line-height: px2rem(90);
    }

    article{
      padding:px2rem(30) px2rem(40);
      max-height:px2rem(668);
      overflow-y:scroll;

      *{
        margin:0;
        padding:0;
      }
    }

    >a{
      @include fsize(32);
      width: 100%;
      background:$main-color;
      color:#fff;
      line-height: px2rem(100);
      border:0;
      text-align: center;
      display: block;
    }

    &-close{
      @include size(px2rem(80));
      position: absolute;
      right:px2rem(50);
      top:px2rem(-40);
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAkFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+IiIhtbW3n5+dLS0tgYGBfX1/////////////MeLxVAAAAMHRSTlMAFEVsk7rS3+z5CU2P0f7/AT+d8Qdo3XHlH7EeUu8GkhLFHNUn4nL///////9tlLs1L4gWAAAByklEQVR4AazSBdKjQBiE4Y7iNBp399z/dLu/29TAB8xTGuHFGiVa7U6317dsx7Gtfq/babdQn+v5Qcg/wsD3XNQQxUlKjTSJI1ST5QMWGuQZ5NzhiKVGQxdCnkURy4PEeEKxyRSlZnPKcT5DscWSFS0XKLBas7L1ClqbLWvYbqCx27OW/U5zfUpPXNxAhdWWtW1XUCzWbGCtvuslG1kqe2ZDfxY+nrOh+RQ/TdjYBD94NMDDF9eiAZaLTwcaMcSHbEQjRhne5TQkx5toQEMGEV7FNCbGq4TGJHjhpjQmdYtHfTydqTifjsXj9ql1ulyV4vl2OVHLBxBQ63x9K+q/UgRAK6SwKOgxbKFNCouCHtnGneKioMcOHhQXBT0+8KS0KOnxiT5FRWGPfViUFWU9WrApK95EPdpwKCvKenSMB2W3/HK/V+ktG38pxmdjeNi9/7TYAQEAAATAMNBB/6ZKTAf4r1dvovVx4OeLH1j+AvCT8m/UP3qPIh6WOM5x4PRIHIuh3WsFFx+tZl4evd56AfeJwEcMn1l8CPKpysc0n/t8kPTJ9CHq3oCAS42YYWc1LjoOjFM+dE//yQXE9Ieunj5s+kNfT5fg9AcA4pNLDwGoyUAAAAAASUVORK5CYII=) no-repeat center center;
      background-size: contain;
    }
  }
</style>

<script>
import Mask from 'libs/mask'
export default {
  props:{},

  data () {
    return {
      show: false,
      title: '',
      content: '',
      button: '',
      link: ''
    }
  },

  events: {
    showCardDetail(data, cb){
      this.show = true
      this.$broadcast('showMask')
      this.title = data.title
      this.content = data.content
      this.button = data.button
      this.link = data.link
    }
  },

  methods:{
    reset(){
      this.title = this.content = this.button = this.link = ''
    },
    close(){
      this.$broadcast('hideMask')
      this.show = false
      this.reset()
    }
  },

  created(){
  },

  components:{
    Mask
  }
}
</script>