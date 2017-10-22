<template>
	<section class="block">
		<header class="block-header"><span>车抵贷</span></header>
	  <div class="panel">
     <div class="content">
       <header>
         <h6>
          <span>月供：<em>{{monthPayment | format}}元</em></span>
          <span>贷款成本：<em>{{totalMoney | format}}元</em></span>
        </h6>
        <p>本结果仅供参考，实际金额以线下真实额度为准</p>
       </header>
       <div class="view">
         <div class="source">
           <label>
             <span>贷款额度</span>
             <input type="tel" v-model="loanMoney" @change="getLoanInfo()">
             <em>万元</em>
           </label>
           <label @click="showSelector">
             <span>贷款期限</span>
             <em>{{loanPeriod}}期</em>
           </label>
         </div>
         <div class="form" :class="{error: !valid.tel}">
            <input type="tel" placeholder="请输入手机号" v-model="tel" @focus="valid.tel=true" @change="formatTel">
            <a href="javascript:void(0)" @click="submit" :class="{'disabled':disabled}">立即申请</a>
         </div>
       </div>
     </div> 
    </div>
	</section>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

	header:before{
		background-image: url(./icon.png);
	}

  .panel{
  	width: 100%;
  	background: #fff;
    padding:px2rem(20) px2rem(30) px2rem(30);
  } 

  .content{
    @include border();

    header{
      background: #FAFAFA;
      padding:px2rem(24) px2rem(37) px2rem(24);
      line-height: 1.5;

      h6{
        @include fsize(30);
        color:#686868;
        margin-bottom: px2rem(10);
        display:flex;

        span{
          flex:1;
          display: block;
        }

        em{
          color:#E9474D;
        }
      }

      p{
        @include fsize(22);
        color: #999;
      }
    }
  }

  .view{
    padding:px2rem(30) 0;
  }

  .source{
    @include fsize(30);
    display: flex;

    label{
      flex:1;
      padding-left: px2rem(40);
      height:px2rem(60);
      display: flex;
      align-items: center;
      color:#686868;
      position: relative;

      span,input,em{
        display: block;
      }
    }

    label:first-child{
      @include borderRight();

      span{
        margin-right: px2rem(20);
      }

      input{
        width:px2rem(50);
        color:#000;
        border:0;
        background: none;
        text-align: right;
        margin-right: px2rem(20);
      }

      em{
        position: relative;
      }

      em:after{
        content:' ';
        @include border();
        border-top:0 !important;
        border-radius:px2rem(0) px2rem(0) px2rem(5) px2rem(5);
        width: px2rem(140);
        height:px2rem(20);
        position: absolute;
        right:px2rem(-10);
        bottom:px2rem(-8);
        z-index: 10;
      }
    }

    label:last-child{
      em{
        color:#000;
        flex:1;
        text-align: right;
        padding-right: px2rem(40);
      }

      &:after{
        @include arrow(right, px2rem(15));
        content:' ';
        position: absolute;
        right:px2rem(20);
        top:px2rem(30);
      }
    }
  }

  .form{
    @include fsize(30);
    display: flex;
    margin-top: px2rem(30);
    align-items: center;
    position: relative;

    &.error input{
      color:$main-color;
    }

    &.error:before{
      @include size(px2rem(44));
      content:' ';
      background: url(./error.png) no-repeat center center;
      background-size: contain;
      position: absolute;
      right:px2rem(250);
      top:px2rem(20);
    }

    input{
      @include fsize(26);
      flex:1;
      margin-left: px2rem(40);
      border:0;
      background: none;
      display: block;
    }

    a{
      border-radius:px2rem(5);
      width: px2rem(200);
      text-align: center;
      line-height: px2rem(80);
      background: #E9474D;
      color:#fff;
      margin-right: px2rem(20);
      display: block;

      &.disabled{
        background: $disabled-color;
      }
    }

    &:after{
        @include border(#E9474D);
        content:' ';
        border-top:0 !important;
        border-radius:px2rem(0) px2rem(0) px2rem(5) px2rem(5);
        width: px2rem(428);
        height:px2rem(20);
        position: absolute;
        left:px2rem(20);
        top:50%;
        margin-top: px2rem(16);
    }
  }
</style>

<script>
  import check from 'libs/check/m'

  export default {
    data () {
      return {
        // 禁止提交(防止重复点击)
        disabled: false,

        // 贷款额度
        loanMoney: 5,

        // 贷款期限
        loanPeriod: 0,

        // 月供
        monthPayment: 0,

        // 贷款成本
        totalMoney:0,

        // 贷款期限列表
        LoanPeriodArr:[],

        tel:'',

        productId:'',

        loanRate: '',

        valid:{
          tel: true
        }

        // 贷款期限列表选择器显示控制
        // showSelector: false
      }
    },

    computed:{
      trimTel(){
        return this.tel.replace(/\s/g,'')
      }
    },

    watch:{
      tel(value, oldValue){
        if(this.trimTel.length > 11){
          this.$nextTick(()=>this.tel = oldValue)
        }
      },

      loanMoney(value, oldValue){
        if(!/^\d{0,2}$/.test(value+'')){
          this.$nextTick(()=>this.loanMoney = oldValue)
        }
      }
    },

    events:{
      changeSelector(value){
        this.loanPeriod = value
        this.getLoanInfo()
      },

      disabledSubmit(){
        this.disabled = true
      },

      enabledSubmit(){
        this.disabled = false
      }
    },

    methods: {
      formatTel(){
        if(check.isPhoneNumber(this.trimTel)){
          this.tel = this.trimTel.replace(/^(\d{3})(\d{4})(\d{4})$/,'$1 $2 $3')
        }
      },
      showSelector(){
        this.$dispatch('showSelector', {
          options : this.LoanPeriodArr,
          value: this.loanPeriod
        })
      },

      updateSelector(){
        this.$dispatch('updateSelector', {
          options : this.LoanPeriodArr,
          value: this.loanPeriod
        })
      },

      getLoanInfo(cb){
        if(!this.validateLoanMoney()){
          return false
        }
        this.$http.get('/MortgageV/GetMortgageLoanInfo', {params: {loanPeriod:this.loanPeriod, loanMoney:this.loanMoney}}).then(response => response.json().then(res => {
            if(!res.Result){
              tools.showAlert(res.Message)
            }else if(cb){
              cb()
            }else{
              const loanArr = res.Data.LoanPeriodArr
              // this.$emit('enabledSubmit')
              this.LoanPeriodArr = loanArr || []
              this.loanPeriod = loanArr.indexOf(this.loanPeriod) >= 0 ? this.loanPeriod : loanArr[loanArr.length-1]
              this.monthPayment = res.Data.MonthPayment.toFixed(2)
              this.totalMoney = res.Data.TotalMoney.toFixed(2)
              this.productId = res.Data.ProductId
              this.loanRate = res.Data.LoanRate

              // 若是在请求接口过程中用户打开了selector, 需要动态更新selector列表
              this.updateSelector()
            }
          }))
      },

      changePeriod(loanPeriod){
        this.loanPeriod = loanPeriod
        this.showSelector = false
        this.getLoanInfo()
      },

      validateLoanMoney(){
        if(!+this.loanMoney){
          this.monthPayment = 0
          this.totalMoney = 0
        }
        if(this.loanMoney < 3 || this.loanMoney > 50){
          this.$dispatch('alert', '注意<br>车抵贷申请额度为3-50万，请重新填写')
          return false
        }else{
          return true
        }
      },

      submit(){
        if(this.disabled){
          return false
        }
        if(!this.validateLoanMoney()){
          return false
        }
        if(check.isPhoneNumber(this.tel.replace(/\s/g,''))){
          // 需要调用接口验证字段是否正确
          this.getLoanInfo(() => {
            this.$dispatch('showAuthCode', {
              Mobile: this.tel,
              ProductId: this.productId,
              LoanRate: this.loanRate,
              LoanPeriod: this.loanPeriod,
              MonthPay: +this.monthPayment,
              TotalMoney: +this.totalMoney,
              ApplyAmount: +this.loanMoney,
              Source: tools.getUrlParam('source') || 1019
            })
          })
        }else{
          tools.showAlert('请输入正确的手机号')
          this.valid.tel = false
        }
      }
    },

    created(){
      this.getLoanInfo()
    }
  }
</script>