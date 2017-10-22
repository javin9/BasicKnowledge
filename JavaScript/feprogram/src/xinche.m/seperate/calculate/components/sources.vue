<template>
  <section class="pannel">
    <header>
      <div class="tab">
        <ul>
          <li :class="{current: tab === 1}" @click="tab=1">
            <h6>贷款计算</h6>
            <p><span>首次花费:</span><em>{{{firstPrice | format}}}</em></p>
          </li>
          <li :class="{current: tab === 2}" @click="tab=2">
            <h6>全款计算</h6>
            <p><span>全款花费:</span><em>{{{fullPaymentPrice | format}}}</em></p>
          </li>
        </ul>
      </div>
    </header>
    <div class="select-wrapper" v-if="tab===1">
      <div class="line">
        <label>首付:</label>
        <div class="selector">
          <span v-for="one in options.payment" :class="{current: one === payment}" @click="payment=one">{{one}}%</span>
        </div>
      </div>
      <div class="line">
        <label>期限:</label>
        <div class="selector">
          <span v-for="one in options.terms" :class="{current: one === term}" @click="term=one">{{one}}期</span>
        </div>
      </div>
    </div>
    <ul>
      <li v-if="tab===1" @click="openSelector=true">
        <span>{{options.taxType[taxType]}}&emsp;<i v-text="taxType ? '(已为您推荐市场平均车贷利率)' : '(已为您推荐市场平均车贷费率)'" v-if="!customizeRate"></i></span>
        <span class="select"><b @click.stop.prevent=""><input type="number" v-model="taxRate" lazy number @focus.stop.prevent="customizeRate=true">%</b></span>
      </li>
      <li v-if="tab===1">
        <span>尾款比例&emsp;<i class="error" v-if="finalrateInvalid">(首付比例+尾款比例需小于100%)</i></span>
        <span><input type="number" v-model="finalrate" lazy number @blur="checkFinalrate()" @focus="this.finalrateInvalid=false">%</span>
      </li>
      <li v-if="tab===2">
        <span>必要花费&emsp;<i>(购置税+上牌费用+车船税+交强险)</i></span>
        <span>{{{mustCost | format}}}</span>
      </li>
      <li @click="openInsurance()">
        <span>商业保险</span>
        <span class="select"><b>{{$refs.insurance.options[$refs.insurance.type]}} {{{insurancePrice | format}}}</b></span>
      </li>
    </ul>
  </section>

  <!-- 选择年费利率 -->
  <div class="aside" :class="{active: openSelector}">
    <header>请选择纳费方式</header>
    <ul>
      <li v-for="one in options.taxType" @click="selectTax($index)" :class="{current: taxType === $index}">{{one}}</li>
    </ul>
  </div>

  <insurance :price="price" :open.sync="insuranceModal" v-ref:insurance ></insurance>
  <mask v-if="mask" @click="openSelector=false"></mask>
</template>

<style scoped>
  @import '../vars';
  @import '../mixin';

  .tab{
    border-bottom:1px solid map-get($border, normal);

    ul{
      @include equal-parts(flex,li);
      margin:0 px2rem(47);

      li{
        text-align: center;
        padding:px2rem(25) 0;
        color:#9a9a9a;
        width: px2rem(283);

        @include first(1){
          margin-right: px2rem(80);
          position: relative;

          &:after{
            display: none;
            content:' ';
            position: absolute;
            border-right:1px solid map-get($border, normal);
            right:px2rem(-40);
            top:px2rem(25);
            height:px2rem(90);
          }
        }

        h6{
          @include fsize(30);
        }

        span{
          margin-right: px2rem(10);
        }

        &.current{
          @include theme(border-color, main){
            border-bottom: px2rem(7) solid;
          }
          h6{
            /*@include theme(color, main);*/
            color:map-get($mfont, black);
          }

          span{
            color:map-get($mfont, black);
          }

          em{
            color:map-get($mfont, important);
          }
        }
      }
    }
  }
  .select-wrapper{
    @include fsize(26);
    border-bottom:1px solid map-get($border, normal);
    padding:0 $padding;

    .line{
      padding:px2rem(38) 0;
      white-space: nowrap;

      @include first(1){
        padding-bottom: px2rem(20);
      }

      label{
        font-weight: bold;
        display: inline-block;
        width: 10%;
        white-space: nowrap;
        box-sizing:border-box;
        vertical-align: middle;
      }
      
      .selector{
        display: inline-block;
        width: 85%;
        box-sizing:border-box;
        white-space: nowrap;
        overflow: scroll;
        vertical-align: middle;
        font-size:0;
        padding-bottom: px2rem(3);

        span{
          @include fsize(26);
          margin-right: px2rem(20);
          color:map-get($mfont,normal);
          line-height: px2rem(53);
          text-align: center;
          width: px2rem(100);
          display: inline-block;
          border:px2rem(2) solid map-get($border,normal);
          border-radius:px2rem(6);

          &.current{
            color:map-get($mfont,white);
            @include theme(background, main);
            @include theme(border, main);
          }

          @inlcude last(1){
            margin-right: 0;
          }
        }
      }
    }
  }
</style>

<script>
  import Insurance from './insurance.vue'
  import Mask from '../components/mask.vue'

  const monthPerYear = 12

  // 费率展示规则
  const feeRate = [
    0,
    7.3,
    14.7,
    22.0,
    27.5,
    33.0
  ]

  // 利率展示规则
  const liRate = [
    0,
    4,
    8,
    12,
    15,
    18
  ]

  // 排量档位对应税费
  const ccPrice = [
    300,
    420,
    480,
    900,
    1920,
    3480,
    5280
  ]

  // 小于6座 => 950
  // 大于6座 => 1100
  const seatPrice = [
    950,
    1100
  ]

  export default {
    props: ['price'],
    data () {
      return {
        options: {
          // 首付选项
          payment: [0, 10, 20, 30, 40, 50, 60, 70],

          // 期限选项
          terms: [12, 24, 36, 48, 60],

          // 纳费方式
          taxType: ['年费率', '年利率']
        },

        // 默认贷款计算
        // 1: 贷款计算
        // 2: 全款计算
        tab: 1,

        // 默认36期
        term:36,

        // 费利率
        taxRate:0,

        // 尾款比例
        finalrate: 0,

        // 默认纳税方式
        taxType: 0,

        // 默认30%首付
        payment: 30,

        // 遮罩层控制
        mask: false,

        // 是否展示保险浮层
        insuranceModal: false,

        // 是否打开选择框
        openSelector: false,

        // 是否手动输入费利率
        customizeRate: false,

        // 尾款比例输入不合法
        finalrateInvalid: false
      }
    },

    computed:{
      // 必要花费
      mustCost(){
        return Math.round(/*购置税*/this.price/(1+0.17)*(initData.cc <= 1 ? 0.075 : 0.1) + /*上牌费用*/500 + /*车船税*/ccPrice[initData.cc] + /*交强险*/seatPrice[initData.seatCountType])
      },

      // 首付
      paymentPrice(){
        return this.price * this.payment / 100
      },

      // 保险价格
      insurancePrice(){
        return Math.round(this.$refs.insurance.total)
      },

      // 全款计算总价
      fullPaymentPrice(){
        return this.mustCost + this.insurancePrice + this.price
      },

      // 首次花费
      firstPrice(){
        return this.paymentPrice + this.mustCost + this.insurancePrice
      }
    },

    methods: {
      // 打开保险选择弹层
      openInsurance(){
        this.insuranceModal = true
      },

      // 选择纳税方式
      selectTax(type){
        this.taxType = type
        this.openSelector = false
        this.customizeRate = false
      },

      // 尾款比例验证
      checkFinalrate(){
        if(this.finalrate + this.payment >= 100){
          this.finalrate = 0
          this.finalrateInvalid = true
        }
      },

      // 更新费利率
      updateTaxRate(taxType, term){
        this.taxRate = taxType ? feeRate[ Math.ceil(term/monthPerYear) ] : liRate[ Math.ceil(term/monthPerYear) ]
      }
    },

    watch: {
      // 打开遮罩
      openSelector(val){
        this.mask = val
      },

      // 切换费利率
      taxType(taxType){
        this.updateTaxRate(taxType, this.term)
      },

      term(term){
        this.updateTaxRate(this.taxType, term)
      },

      insuranceModal(value){
        if(value){
          this.$nextTick(()=>{
            window.scrollTo(0,0)
          })
        }
      }
    },

    created(){
      this.updateTaxRate(this.taxType, this.term)
    },

    components: {
      Insurance,
      Mask
    }
  }
</script>