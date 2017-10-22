<template>
  <div class="container" :class="{active: open}">
    <div class="wrapper">
      <component-header :title="title" type="modal" :modal.sync="open"></component-header>

      <!-- 计算类型面板 -->
      <section class="pannel">
        <header>
          <dl>
            <dt>
              <span><span>总金额:</span><em>{{{total | format}}}</em></span>
              <span>(参考平均报价)</span>
            </dt>
            <dd>
              <span v-for="one in options" :class="{current: $index === type}" @click="type=$index">{{one}}</span>
            </dd>
          </dl>
        </header>
        <ul>
          <li>
            <span>车损</span>
            <span>{{{loss | format}}}</span>
          </li>
          <li v-if="type === 0">
            <span>三者20万</span>
            <span>{{{calculated.t20 | format}}}</span>
          </li>
          <li v-if="type === 1 || type === 2">
            <span>三者50万</span>
            <span>{{{calculated.t50 | format}}}</span>
          </li>
          <li v-if="type === 1 || type === 2">
            <span>盗抢</span>
            <span>{{{steal | format}}}</span>
          </li>
          <li v-if="type === 1">
            <span>司机乘客1万</span>
            <span>{{{calculated.driver | format}}}</span>
          </li>
          <li v-if="type === 2">
            <span>车上人员2万</span>
            <span>{{{calculated.member | format}}}</span>
          </li>
          <li v-if="type === 1 || type === 2" @click="openSelector=true">
            <span>玻璃<i>（{{glassOptions[glassType]}}）</i></span>
            <span class="select">{{{glass | format}}}</span>
          </li>
          <li v-if="type === 2">
            <span>划痕5000</span>
            <span>{{{calculated.scratch | format}}}</span>
          </li>
          <li v-if="type === 2">
            <span>发动机涉水</span>
            <span>{{{water | format}}}</span>
          </li>
          <li v-if="type === 2">
            <span>车损无法找到第三方</span>
            <span>{{{nofound | format}}}</span>
          </li>
        </ul>
      </section>

      <a class="button" @click="close()">确定</a>
      <a class="more" :href="link">去精确报价</a>

      <div class="aside" :class="{active: openSelector}">
        <header>请选择玻璃类型</header>
        <ul>
          <li v-for="one in glassOptions" @click="selectGlass($index)" :class="{current: glassType === $index}">{{one}}</li>
        </ul>
      </div>
    </div>

    <mask v-if="openSelector" @click="openSelector=false"></mask>
  </div>
</template>

<style scoped>
  @import '../vars';
  @import '../mixin';

  .container{
    position: fixed;
    top:0;
    width: 100%;
    height:100%;
    height:100vh;
    background: #f2f2f2;
    left:100%;
    transition:all 0.3s;

    .wrapper{
      width: 100%;
      height:100%;
      overflow-y:scroll;
    }

    &.active{
      left:0;
      position: absolute;
    }
  }

  dl{
    padding:0 px2rem(30) px2rem(30);

    dt{
      overflow: hidden;
      padding:px2rem(30) 0;
      > span{
        @include fsize(26);

        @include first(1){
          float: left;
          color:map-get($mfont,black);

          span{
            display: inline-block;
            vertical-align: middle;
            margin-right: px2rem(15);
          }

          em{
            display: inline-block;
            vertical-align: middle;
            color:map-get($mfont, important);
          }
        }

        @include last(1){
          float: right;
          color:$des-color;
        }
      }
    }

    dd{
      font-size:0;
      span{
        @include font(m);
        color: map-get($mfont,normal);
        display: inline-block;
        border:px2rem(1) solid map-get($border, normal);
        margin-right: px2rem(25);
        width: px2rem(157);
        line-height:px2rem(60);
        text-align: center;
        border-radius:px2rem(6);

        &.current{
          @include theme(border-color, main);
          @include theme(color, main);
          position: relative;

          &:before{
            content:' ';
            width: px2rem(19);
            height:px2rem(14);
            background-repeat: no-repeat;
            background-position: center center;
            @include theme(background-image, selected);
            background-size: contain;
            display: inline-block;
            margin-right: px2rem(10);
            position: relative;
            top:px2rem(-2);
          }
        }
      }
    }
  }

  ul li span:last-child{
    margin-right: px2rem(40);

    &.select{
      margin-right: 0;
    }
  }

  .button{
    @include fsize(30);
    display: block;
    margin:px2rem(30) px2rem(30) 0;
    @include theme(background-color, main);
    color:map-get($mfont, white);
    text-align: center;
    padding:px2rem(30) 0;
    line-height: 1;
    border-radius:px2rem(7);
    text-decoration: none;
  }

  .more{
    @include fsize(26);
    display: block;
    margin:px2rem(15) px2rem(30);
    text-align: right;
    @include theme(color, main);
  }
</style>

<script>
import Header from './header.vue'
import Mask from './mask.vue'

export default {
  props: ['price', 'open'],

  data () {
    return {

      title: '商业保险',

      // 类型选择
      options: ['经济型', '大众型', '豪华型'],

      glassOptions: ['国产玻璃', '进口玻璃'],

      // 默认类型
      type: 1,

      // 默认玻璃类型
      glassType: 0,

      // 计算后各类车险价格
      calculated: {

        // 三者20万
        t20: 812.53,

        // 三者50万
        t50: 1100.32,

        // 司机乘客1万
        driver: 108.39,

        // 车上人员2万
        member: 216.78,

        // 划痕5000
        scratch: 370
      },

      // 精确报价链接
      link: initData.link3,

      // 是否打开选择框
      openSelector: false
    }
  },

  computed: {
    // 车损
    loss(){
      return this.price*0.02185
    },

    // 盗抢
    steal(){
      return 93.6+this.price*0.003445*1.20
    },

    // 发动机涉水
    water(){
      return this.price*0.02185*0.05
    },

    // 车损无法找到第三方
    nofound(){
      return this.price*0.02185*0.025
    },

    // 玻璃价格
    glass(){
      return this.glassType === 0 ? this.price*0.001235 : this.price*0.002015
    },

    // 总价
    total(){
      switch(this.type){
        case 0:
          return this.loss + this.calculated.t20
        case 1:
          return this.loss + this.calculated.t50 + this.steal + this.calculated.driver + this.glass
        case 2:
          return this.loss + this.calculated.t50 + this.steal + this.calculated.member + this.glass + this.calculated.scratch + this.water + this.nofound
      }
    }
  },

  methods: {
    // 切换玻璃类型
    selectGlass(id){
      this.glassType = id
      this.openSelector = false
    },

    // 关闭弹层
    close(){
      this.open = false
    }
  },

  created(){
    // document.ontouchmove = (e) => !this.open
  },

  components: {
    'component-header': Header,
    Mask
  }
}
</script>