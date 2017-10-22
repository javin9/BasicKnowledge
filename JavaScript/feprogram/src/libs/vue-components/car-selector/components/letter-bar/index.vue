<template>
  <ul class="component-letter-bar"  @touchend="clearTip" @touchmove.prevent="checkScrollTo">
    <li v-for="one in data" @touchstart="scrollTo(one)">{{one}}</li>
  </ul>
  <span class="component-letter-tip" v-if="tip" :class="{'component-letter-tip-spe': tipFourWords}">{{tip}}</span>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';

  .component-letter-bar{
    position: fixed;
    display:flex;
    right:0;
    flex-direction:column;
    top:px2rem(95+130);
    bottom:px2rem(130);
    text-align: center;
    box-sizing: border-box;
    width: px2rem(50);
    user-select: none;

    li{
      font-size:px2rem(24);
      height:0;
      display: block;
      flex:1;
      color:#5A67AE;
    }
  }

  .component-letter-tip{
    font-size:px2rem(70);
    @include size(px2rem(160));
    @include border(#5A67AE);
    position: fixed;
    border-radius: px2rem(5);
    background: #fff;
    line-height: px2rem(160);
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    color: #5A67AE;
  }

  .component-letter-tip-spe{
    font-size:px2rem(36);
    box-sizing:border-box;
    padding:px2rem(25) px2rem(30);
    line-height: 1.5;
  }
</style>

<script>
export default {
  props:{
    data: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      tip: ''
    }
  },

  computed:{
    tipFourWords(){
      return this.tip ? this.tip.length === 4 : false
    }
  },

  methods:{
    clearTip(){
      this.tip=''
    },

    scrollTo(key){
      if(key === '荐'){
        this.tip = '推荐品牌'
      }else if(key === '热'){
        this.tip = '热卖车型'
      }else{
        this.tip = key
      }
      this.$emit('scroll', key)
    },

    checkScrollTo(e){
      const touch = e.targetTouches[0]
      const element = document.elementFromPoint(touch.clientX, touch.clientY)
      if(element && element.tagName === 'LI'){
        const key = element.innerText
        if(this.data.indexOf(key) >= 0){
          this.scrollTo(key)
        }
      }
    }
  },

  created(){
  },

  components:{
  }
}
</script>