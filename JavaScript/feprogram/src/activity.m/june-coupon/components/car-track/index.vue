<template>
  <div class="component-car-track">
    <div class="car-track-1" v-el:car1></div>
    <div class="car-track-2" v-el:car2></div>
    <div class="car-track-3" v-el:car3></div>
    <div class="car-track-4" v-el:car4></div>
    <div class="car-track-5" v-el:car5></div>
    <div class="car-track-6" v-el:car6></div>
    <div class="car-track-7" v-el:car7></div>
    <div class="car-track-8" v-el:car8></div>
    <div class="tip tip-{{level}}" v-if="showTip">
      <p>已加满</p>
      <p>{{power}}个油</p>
    </div>
    <div class="layer1"></div>
    <div class="layer2"></div>
    <div class="layer3"></div>
    <div class="house"></div>
    <div class="tree"></div>
    <div class="pointer"></div>
  </div>
</template>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  %background{
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    position: absolute;
  }

  .component-car-track{
    width: 100%;
    height:px2rem(1028);
    position: absolute;
    left:0;
    top:0;
    overflow: hidden;

    .tip{
      @extend %background;
      width: px2rem(101);
      height:px2rem(103);
      background-image: url(./tip.png);
      z-index: 11;
      text-align: center;
      color:#fff;
      font-size:px2rem(24);
      /*transition: opacity .3s ease;*/

      p{
        line-height: 1;
        padding:px2rem(7) 0 0 0;
      }

      &-1{
        left:px2rem(150);
        top:px2rem(682);
      }

      &-2{
        left:px2rem(343);
        top:px2rem(766);
      }

      &-3{
        left:px2rem(46);
        top:px2rem(727);
      }

      &-4{
        left:px2rem(354);
        top:px2rem(890);
      }

      &-5{
        left:px2rem(534);
        top:px2rem(796);
      }
    }

    .layer1{
      @extend %background;
      background-image: url(./layer1.png);
      width: px2rem(307);
      height:px2rem(434);
      left:px2rem(292);
      top:px2rem(390);
      z-index: 10;
    }

    .layer2{
      @extend %background;
      background-image: url(./layer2.png);
      width: px2rem(228);
      height:px2rem(378);
      left:px2rem(178);
      top:px2rem(390);
      z-index: 1;
    }

    .layer3{
      @extend %background;
      background-image: url(./layer3.png);
      width: px2rem(145);
      height:px2rem(245);
      left:px2rem(437);
      top:px2rem(697);
      z-index: 1;
    }

    .house{
      @extend %background;
      background-image: url(./house.png);
      width: px2rem(664);
      height:px2rem(885);
      left:px2rem(39);
      top:px2rem(390);
    }

    .tree{
      @extend %background;
      background-image: url(./tree.png);
      width: px2rem(39);
      height:px2rem(58);
      left:px2rem(587);
      top:px2rem(688);
      z-index: 11;
    }

    .pointer{
      @extend %background;
      background-image: url(./pointer.png);
      width: px2rem(68);
      height:px2rem(81);
      left:px2rem(116);
      top:px2rem(713);
      z-index: 1;
    }

    .car-track-1{
      @extend %background;
      background-image: url(./car1.png);
      width: px2rem(105);
      height:px2rem(75);
      left:px2rem(249);
      top:px2rem(683);
      z-index: 9;
      display: none;
    }
    .car-track-2{
      @extend %background;
      background-image: url(./car4.png);
      width: px2rem(105);
      height:px2rem(75);
      left:px2rem(199);
      top:px2rem(749);
      z-index: 11;
      display: none;
    }
    .car-track-3{
      @extend %background;
      background-image: url(./car2.png);
      width: px2rem(107);
      height:px2rem(67);
      left:px2rem(378);
      top:px2rem(820);
      z-index: 12;
      display: none;
    }
    .car-track-4{
      @extend %background;
      background-image: url(./car3.png);
      width: px2rem(107);
      height:px2rem(67);
      left:px2rem(561);
      top:px2rem(676);
      z-index: 9;
      display: none;
    }
    .car-track-5{
      @extend %background;
      background-image: url(./car1.png);
      width: px2rem(105);
      height:px2rem(75);
      left:px2rem(190);
      top:px2rem(669);
      z-index: 1;
      display: none;
    }
    .car-track-6{
      @extend %background;
      background-image: url(./car4.png);
      width: px2rem(105);
      height:px2rem(75);
      left:px2rem(60);
      top:px2rem(777);
      z-index: 9;
      display: none;
    }
    .car-track-7{
      @extend %background;
      background-image: url(./car2.png);
      width: px2rem(107);
      height:px2rem(67);
      left:px2rem(394);
      top:px2rem(926);
      z-index: 9;
      display: none;
    }
    .car-track-8{
      @extend %background;
      background-image: url(./car3.png);
      width: px2rem(107);
      height:px2rem(67);
      left:px2rem(527);
      top:px2rem(841);
      z-index: 1;
      display: none;
    }
  }
</style>

<script>
import 'velocity-animate'
export default {
  props:{
    power: {
      type: Number,
      default: 0
    }
  },

  data () {
    const base = $(window).width() / 750
    return {
      base,
      currentIndex:1,
      showTip: false,
      forceAnimate: false,
      stopStyle:[
        // car 1
        {
          left: base*192,
          top:base*720
        },
        // car 2
        {
          left: base*328,
          top:base*815
        },
        // car 3
        {
          left: base*579,
          top:base*716
        },
        // car 4
        {
          left: base*419,
          top:base*608
        },
        // car 5
        {
          left: base*59,
          top:base*745
        },
        // car 6
        {
          left: base*343,
          top:base*926
        },
        // car 7
        {
          left: base*530,
          top:base*863
        },
        // car 8
        {
          left: base*423,
          top:base*777
        }
      ]
    }
  },

  computed: {
    // 气泡提示的位置级别
    level(){
      if(this.power > 1 && this.power <= 6){
        return 2
      }
      if(this.power >6 && this.power <= 40){
        return 3
      }
      if(this.power > 40 && this.power < 60){
        return 4
      }
      if(this.power >= 60){
        return 5
      }
      return 1
    },

    // 停止在第几车道
    // map level to index
    stopIndex(){
      return [1, 3, 6, 7, 8][this.level-1]
    },

    // 停车位置
    // map level to position
    stopPosition(){
      return [
        {left: this.base*249,top:this.base*683},
        {left: this.base*450,top:this.base*780},
        {left: this.base*139,top:this.base*814},
        {left: this.base*463,top:this.base*892},
        {left: this.base*499,top:this.base*821},
        {left: this.base*192,top:this.base*720}
      ][this.level-1]
    }
  },

  watch:{
    // 油量增加时，需要绕一圈做动画展示
    power(value){
      this.forceAnimate = true
      // 若tip已经显示，说明已经动画停止，需要重启动画
      if(this.showTip){
        this.showTip = false
        this.track(this.currentIndex)
      }
    }
  },

  events: {
    startCarTrack(){
      this.track()
    }
  },

  methods: {
    track(index=1){
      const $element = $(this.$els[`car${index}`])
      const styles = index === this.stopIndex && !this.forceAnimate ? this.stopPosition : this.stopStyle[index-1]
      this.currentIndex = index
      $element.show().velocity(styles, {
        duration: 1000,
        complete:() => {
          if(this.forceAnimate){
            // 强行跑圈情况
            $element.removeAttr('style')
            if(index === 8){
              this.forceAnimate = false
              this.track(1)
            }else{
              this.track(index+1)
            }
          }else if(index === this.stopIndex){
            $element.show()
            this.showTip = true
            this.$dispatch('carTrackAnimateFinished')
          }else if(index < this.stopIndex){
            $element.removeAttr('style')
            this.track(index+1)
          }
        }
      })
    }
  }
}
</script>