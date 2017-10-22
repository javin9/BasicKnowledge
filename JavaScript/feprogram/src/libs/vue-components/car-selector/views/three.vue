<template>
    <!-- <div class="component-car-level-three-mask" v-show="show" transition="opacity"></div> -->
    <div class="component-car-level-three" v-show="show" transition="slideleft">
      <div class="component-car-level-three-mask" @click="close" v-touch:swiperight="close" v-show="showClose" transition="opacity">
        <div class="component-car-level-three-close"><span>点击收起</span></div>
      </div>
      <div class="component-car-level-three-content">
        <component-header @back="close">选择车款</component-header>
        <div class="component-car-level-three-main" v-el:wrapper>
          <div class="component-car-level-three-wrapper">
            <car-list 
              :api="api" 
              :interface="interface"
              :method="method"
              :only-on-sale="onlyOnSale" 
              :series-id="series.id"  
              :series-name="series.name"  
              :series-logo="brand.logo"  
              :show-logo="showLogo"
              :city-id="cityId"
              :tag="tag"
              :from="from"
              :allbrand-link="allbrandLink"
              :allbrand-href="allbrandHref"
              :selected="selectedCar"
              @rendered="refreshScrollView" 
              @callback="clickHandler" ></car-list>
          </div>
        </div>
        <loading v-if="loading"></loading>
      </div>
    </div>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';

  .component-car-level-three{
    position: absolute;
    top:0;
    bottom:0;
    left:0;
    width: 10rem;
    width: 100vw;
    z-index: 300;

    &-main{
      position: absolute;
      left:0;
      top:px2rem(88);
      bottom:0;
      width: 100%;
    }
    
    &-wrapper{
      position: absolute;
      width: 100%;
    }

    &-close{
      font-size:px2rem(32);
      writing-mode:vertical-lr;
      color: #fff;
      position: absolute;
      left:12%;
      top:50%;
      transform: translateY(-50%);

      span{
        display: inline-block;
        vertical-align: middle;
      }

      &:before{
        content:' ';
        width: px2rem(42);
        height:px2rem(42);
        background: url(./close.png) no-repeat center center;
        background-size: contain;
        display: inline-block;
        vertical-align: middle;
        margin-bottom: px2rem(20);
      }
    }

    &-content{
      width: 70%;
      background: #fff;
      height: 100%;
      position: absolute;
      right:0;
    }
  }
  .component-car-level-three-mask{
    position: absolute;
    top:0;
    bottom:0;
    left:0;
    width: 10rem;
    width: 100vw;
    /*z-index: 290;*/
    background: rgba(0,0,0,.6);
  }
</style>

<script>
  import ComponentHeader from '../components/header'
  import CarList from '../components/car-list'
  import Loading from '../components/loading'
  import IScroll from 'iscroll'

  export default {
    props:{
      api: String,
      interface: String,
      method: String,
      onlyOnSale: Boolean,
      showLogo: Boolean,
      cityId: Number,
      tag:Boolean,
      selectedCar: Number,
      from: [String, Number],
      allbrandLink: Boolean,
      allbrandHref: String,
    },

    data () {
      return {
        brand: '',
        series: '',
        show: false,
        showClose:false,
        loading: true
      }
    },

    watch: {
      show(value){
        if(value){
          setTimeout(()=>this.showClose = value, 200)
        }
      },
      showClose(value){
        if(!value){
          setTimeout(()=>this.show = value, 100)
        }
      }
    },

    events: {
      showCarLevelThree(data, state=true){
        if(state){
          this.$dispatch('historyPushState', 3, data)
        }
        this.show = true
        this.brand = data.brand
        this.series = data.series
      },
      hideCarLevelThree(){
        this.showClose = false
        this.loading = true
        this.series = ''
        this.brand = ''
      }
    },

    methods:{
      refreshScrollView(){
        this.loading = false
        if(!this.scrollView){
          this.scrollView = new IScroll(this.$els.wrapper, {
              scrollbars: true,
              shrinkScrollbars: 'scale',
              fadeScrollbars: true,
              click: true
          })
        }else{
          this.scrollView.refresh()
          this.scrollView.scrollTo(0,0)
        }
      },

      clickHandler(data){
        this.$emit('callback', Object.assign({}, {brand: this.brand, series: this.series}, data))
      },

      close(){
        this.$dispatch('historyPopState')
      }
    },

    ready(){
    },

    components:{
      ComponentHeader,
      CarList,
      Loading
    }
  }
</script>