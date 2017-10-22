<template>
  <div class="component-banner">
    <div class="component-banner-cover"></div>
    <footer v-if="name">您的<span> {{name}} </span>预计可贷<em> {{amount}}元 </em>，快去申请吧！</footer>
    <footer v-else>易鑫车抵贷<em> {{amount}}元 </em>额度等你拿！</em></footer>
  </div>
</template>
<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .component-banner{

    &-cover{
      width: 100%;
      height:px2rem(260);
      background: url(./banner.jpg) no-repeat left top;
      background-size: contain;
    }

    footer{
      @include fsize(24);
      background: #fff;
      padding:px2rem(27) px2rem(30);
      color:$light-color;
      span{
        color:#000;
      }
      em{
        @include fsize(28);
        color:$main-color;
        font-weight: bold;
      }
    }
  }
</style>

<script>
  export default {
    props:{
    },

    events:{
      getAmount(carId, cityId){
        this.$http.post('/MortgageApply/GetCarEstimate', {carId, cityId}).then(response => response.json().then(res => {
          if(res.Result){
            this.name = res.Data.CarSerialName
            this.amount = res.Data.CarValuation
          }
        }))
      }
    },

    data () {
      return {
        name: '',
        amount: '500,000'
      }
    },

    methods: {
    }
  }
</script>