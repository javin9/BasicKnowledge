<template>
  <section class="pannel" v-show="openResult">
    <div class="result-colse" @click="openResult=false"></div>
    <header>
      <dl class="info">
        <dt :style="{width:chartSize+'px', height: chartSize+'px'}">
          <canvas id="chart" width="{{chartSize}}" height="{{chartSize}}">
        </dt>
        <dd>
          <h6><span>月供:</span><em>{{{monthPayments | format}}}</em></h6>
          <h6><span>首次花费:</span><i>{{{firstPrice | format}}}</i></h6>
          <p>(首次花费: 首付+必要花费+商业保险)</p>
        </dd>
      </dl>
    </header>
    <div class="detail">
      <table>
        <tr>
          <td width="5%"></td>
          <td width="22%">首付</td>
          <td>(车价×{{payment}}%)</td>
          <td width="26%">{{{paymentPrice | format}}}</td>
        </tr>
        <tr>
          <td></td>
          <td>贷款额度</td>
          <td>(车价-首付)</td>
          <td>{{{loanAmount | format}}}</td>
        </tr>
        <tr v-show="finalrate">
          <td></td>
          <td>贷款尾款</td>
          <td></td>
          <td>{{{price*finalrate/100 | format}}}</td>
        </tr>
        <tr>
          <td></td>
          <td>贷款成本</td>
          <td>(根据{{taxType?"利率":"费率"}}计算)</td>
          <td>{{{loanCost | format}}}</td>
        </tr>
        <tr>
          <td></td>
          <td>必要花费</td>
          <td>(购置税+上牌费用+车船税+交强险)</td>
          <td>{{{mustCost | format}}}</td>
        </tr>
        <tr>
          <td></td>
          <td>总花费</td>
          <td>(车价+贷款成本+必要花费+商业保险)</td>
          <td>{{{total | format}}}</td>
        </tr>
      </table>
    </div>
  </section>
  <mask v-if="openResult" @click="openResult=false"></mask>
</template>

<style scoped>
  @import '../vars';
  @import '../mixin';
  .pannel {
    width: px2rem(690);
    position: fixed;
    border-radius: px2rem(6);
    left: 50%;
    top: px2rem(194);
    margin-left: px2rem(-345);
    z-index: 1001;
    .result-colse {
      width: px2rem(60);
      height: px2rem(60);
      position: absolute;
      right: 0;
      top: px2rem(-70);
      background: url(../images/close.png) no-repeat left top;
      background-size: contain;
    }
  }
  .info{
    padding:px2rem(36) 0 px2rem(36) px2rem(50);
    /*position: fixed;*/
    dt{
      float: left;
      width: px2rem(170);
      height:px2rem(192);
      margin-right: px2rem(30);
    }

    dd{
      @include fsize(26);
      overflow: hidden;
      /*white-space: nowrap;*/

      h6{
        margin-top: px2rem(25);

        em{
          @include fsize(30);
          color: $main-color;
          margin-left: px2rem(10);
          vertical-align: middle;
        }

        i, span{
          font-style:normal;
          vertical-align: middle;
        }
      }

      p{
        color:map-get($mfont,light);
        font-size:px2rem(26);
      }
    }
  }

  .detail{
    margin:0 px2rem(50);
  }

  table{
    @include fsize(26);
    width: 100%;
    td{
      padding-bottom: px2rem(30);
      vertical-align: top;
      color: #333;
      @include first(1){
        &:after{
          content:' ';
          background: none;
          width: px2rem(14);
          height:px2rem(14);
          border-radius:px2rem(7);
          display: inline-block;
        }
      }

      @include last(1){
        text-align: right;
      }

      @include from-end(2){
        color: map-get($mfont,light);
      }
    }

    tr{
      &:nth-child(1){
        td:first-child:after{
          @include theme(background, chart1);
        }
      }

      &:nth-child(2){
        td:first-child:after{
          @include theme(background, chart2);
        }
      }

      &:nth-child(4){
        td:first-child:after{
          @include theme(background, chart3);
        }
      }

      &:nth-child(5){
        td:first-child:after{
          @include theme(background, chart4);
        }
      }
    }
  }
</style>

<script>
import Chart from 'chart.js'
import Mask from '../components/mask.vue'

const chartColor = {
  // 'a': ['#000','#dbb76c','#5f5f5e','#a4a4a4'],
  'a': ['#FFD221','#EF4D00','#38BEB2','#F5706E'],
  'b': ['#305f9f','#59a3fc','#ffc851','#fff45f']
}

const theme = tools.getUrlParam('theme') || 'a'

const chartConfig = {
  type: 'doughnut',
  data: {
      datasets:[{
        data: [],
        backgroundColor: chartColor[theme],
        hoverBackgroundColor: chartColor[theme]
      }],
      labels: []
  },
  options: {
      responsive: true,
      cutoutPercentage:50,
      animation: {
          animateScale: false,
          animateRotate: true
      },
      elements: {
          arc: {
              backgroundColor: 'rgb(255, 0, 0)',
              borderColor: 'rgb(0, 0, 255)',
              borderWidth: 0,
              hoverBackgroundColor: 'rgb(255, 255, 255)',
          }
      },
      tooltips:{
        enabled: false
      }
  },
}

export default {
  props:['price', 'payment', 'finalrate', 'mustCost', 'paymentPrice', 'firstPrice', 'taxType', 'taxRate', 'term','insurancePrice', 'openResult'],
  data () {
    return {
      chart:null,
      chartSize: Math.ceil(170/75*(document.documentElement.getAttribute('style').match(/\d+/)[0] || 75))
    }
  },

  computed: {
    // 月供
    monthPayments(){
      // 年费率：月供 = ((车价  * (1 - 首付比例)) * (1 + rate)) /期限
      // 年利率：月供=PMT(年利率/期限，期限，贷款额度)
      return Math.round(!this.taxType ? ((this.price * (1 - this.payment / 100)) * (1 + this.taxRate / 100)) / this.term : this.pmt(this.taxRate/100/12, this.term, -this.loanAmount))
    },

    // 贷款额度
    loanAmount(){
      return this.price-this.paymentPrice
    },

    // 贷款成本
    loanCost(){
      return this.monthPayments*this.term-this.loanAmount
    },

    // 总花费
    total(){
      return this.price + this.loanCost + this.mustCost + this.insurancePrice
    }
  },
  events: {
    showResultFunc(){
      this.openResult = true;
    }
  },
  methods:{
    // pmt计算函数
    pmt(i, n, p) {
     return i * p * Math.pow((1 + i), n) / (1 - Math.pow((1 + i), n))
    },

    // 绘图
    drawChart(){
      const data = [
        this.paymentPrice,
        this.loanAmount,
        this.loanCost,
        this.mustCost,
      ]
      if(!this.chart){
        const chartDom = document.getElementById('chart')
        chartConfig.data.datasets[0].data = data
        this.chart = new Chart(chartDom, chartConfig)
      }else{
        // update data
        this.chart.data.datasets[0].data = data
        this.chart.update()

      }
    }
  },

  watch: {
    paymentPrice(){
      this.drawChart()
    },
    loanAmount(){
      this.drawChart()
    },
    loanCost(){
      this.drawChart()
    },
    mustCost(){
      this.drawChart()
    }
  },

  components: {
    Mask
  },

  ready(){
    this.drawChart()
  }
}
</script>