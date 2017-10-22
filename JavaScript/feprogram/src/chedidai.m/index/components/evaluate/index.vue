<template>
  <section class="block">
    <div class="form-item select-item">
      <label>
        <span>品牌车型</span>
        <em class="input" @click="selectCar" :class="{'placeholder': !carName}" >{{carName || '请选择品牌车型'}}</em>
      </label>  
    </div>

    <div class="form-item" :class="{'error': !valid.tel}">
      <label>
        <span>手机号</span>
        <input type="tel" placeholder="请输入手机号" v-model="tel" @focus="valid.tel=true" @change="formatTel">
      </label>  
    </div>

  	<a href="javascript:void(0)" class="button" @click="submit()" :class="{'disabled':disabled}">先评估，后贷款</a>
  	<div class="footer-bar">
      <ul>
        <li class="icon-1"><i></i><strong>费率低</strong><span>月费率0.77起</span></li>
        <li class="icon-2"><i></i><strong>放款快</strong><span>最快当天可放款</span></li>
        <li class="icon-3"><i></i><strong>额度高</strong><span>最高估值80%</span></li>
      </ul> 
    </div>
  </section>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  section{
  	padding:px2rem(20) px2rem(30) px2rem(28);
  }

  .form-item{
    @include fsize(30);
    border:1px solid #ddd;
    margin-bottom: px2rem(20);
    position: relative;

    &.error{
      &:after{
        @include size(px2rem(44));
        content:' ';
        background: url(./error.png) no-repeat left top;
        background-size: contain;
        position: absolute;
        right:px2rem(30);
        top:px2rem(36);
      }

      input{
        color: $main-color;
      }
    }

    &.select-item:after{
      @include arrow(right, px2rem(14));
      content:' ';
      position: absolute;
      right:px2rem(30);
      top:px2rem(55);
      pointer-events: none;
    }

    label{
      height: px2rem(110);
      display: flex;
      align-items:center;
    }

    span{
      color:#333;
      width:px2rem(180);
      text-align: center;
      line-height: 100%;
      display: block;
    }

    input, .input{
      border:0;
      background: none;
      flex:1;
      display: block;
      white-space: nowrap;
    }

    .input{
      padding-right: px2rem(60);
      height:px2rem(110);
      overflow: hidden;
      text-overflow:ellipsis;
      line-height: px2rem(110);
    }

    .placeholder{
      color: #ccc;
    }
  }

  .button{
  	@include fsize(32);
  	color:#fff;
  	background: #E9474D;
		display: block;
		line-height: px2rem(90);
		text-align: center;
		border-radius:px2rem(5);
    margin-top: px2rem(30);

    &.disabled{
        background: $disabled-color;
      }
  }

  .footer-bar{
  	/*width: px2rem(700);*/
  	margin:0 auto 0;
  	display: block;

    ul{
      display:flex;
      margin-top: px2rem(50);

      li{
        display: block; 
        text-align: center;
        flex:1;

        i{
          height:px2rem(60);
          display: block;
          background-repeat: no-repeat;
          background-position: center center;
          margin-bottom: px2rem(13);
        }

        &.icon-1 i{
          background-image: url(./icon/feilvdi.png);
          background-size: px2rem(60);
        }
        &.icon-2 i{
          background-image: url(./icon/fangkuankuai.png);
          background-size: px2rem(60);
        }
        &.icon-3 i{
          background-image: url(./icon/edugao.png);
          background-size: px2rem(60);
        }

        strong{
          @include fsize(24);
          font-weight: normal;
          color:$normal-color;
          display: inline-block;
        }

        span{
          display: block;
          text-align: center;
          @include fsize(22);
          color:$light-color;
        }
      }
    }
  }
</style>

<script>
  import check from 'libs/check/m'
  import car from 'libs/carSelect'

  export default {
    data () {
      return {
        // 禁止提交(防止重复点击)
        disabled: false,

        carName: '',
        carId: '',
        tel: '',
        userStatus:null,
        valid: {
          tel: true
        }
      }
    },

    computed:{
      trimTel(){
        return this.tel.replace(/\s/g,'')
      }
    },

    events: {
      disabledSubmit(){
        this.disabled = true
      },

      enabledSubmit(){
        this.disabled = false
      }
    },

    watch:{
      tel(value, oldValue){
        if(this.trimTel.length > 11){
          this.$nextTick(()=>this.tel = oldValue)
        }
      }
    },
    ready(){
        tools.getLoginStatus(res => {
            if(tools.isWebView() == 'yixinapp' ){
                if(res.Telphone){
                    this.tel = res.Telphone;
                }
            }
        })
    },
    methods: {
      formatTel(){
        if(check.isPhoneNumber(this.trimTel)){
          this.tel = this.trimTel.replace(/^(\d{3})(\d{4})(\d{4})$/,'$1 $2 $3')
        }
      },
      submit(){
        if(!dev){
          if(this.disabled){
            return false
          }
          if(!this.carId){
            tools.showAlert('请选择品牌车型')
            return false
          }

          if(!this.tel || !check.isPhoneNumber(this.trimTel)){
            tools.showAlert('请输入正确的手机号')
            this.valid.tel = false
            return false
          }
        }

        this.$dispatch('showAuthCode', {
          Mobile: this.trimTel,
          CarID: this.carId,
          Source: tools.getUrlParam('source') || 715
        })
      },

      selectCar(){
        car.carSelect({
          onlyOnSale: false,
          showLevel: 3,
          showAllBrand: false,
          hide: true,
          showAllBrand: true,
          showSearch: false,
          type: 'chezhudai'
        },  result => {
          const brandName = result.brand.name.indexOf(result.masterBrand.name) >= 0 ? result.brand.name : `${result.masterBrand.name} ${result.brand.name}`
          this.carName =  `${brandName} ${result.year}款 ${result.carType.name}`
          this.carId = result.carType.id
        })
      }
    }
  }
</script>