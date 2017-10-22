<template>
  <div class="component-car-level-two" v-show="show" transition="slideleft">
    <component-header @back="close">选择车型</component-header>
    <div class="component-car-level-two-main" v-el:wrapper>
      <div class="component-car-level-two-wrapper">
        <series-list 
          :api="api" 
          :interface="interface"
          :method="method"
          :only-on-sale="onlyOnSale" 
          :brand-id="brand.id" 
          :brand-name="brand.name"
          :brand-logo="brand.logo"
          :show-logo="showLogo"
          :show-all-series="showAllSeries"
          :tag="tag"
          :from="from"
          @rendered="refreshScrollView" 
          @callback="clickHandler" ></series-list>
      </div>
    </div>
    <loading v-if="loading"></loading>
  </div>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';

  .component-car-level-two{
    position: absolute;
    top:0;
    bottom:0;
    left:0;
    width: 10rem;
    width: 100vw;
    background: #fff;
    z-index: 200;

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
  }
</style>

<script>
  import ComponentHeader from '../components/header'
  import SeriesList from '../components/series-list'
  import Loading from '../components/loading'
  import IScroll from 'iscroll'

  export default {
    props:{
      api: String,
      interface: String,
      method: String,
      onlyOnSale: Boolean,
      showAllSeries: Boolean,
      showLogo: Boolean,
      tag:Boolean,
      from: [String, Number]
    },
    data () {
      return {
        brand: '',
        show: false,
        loading: true
      }
    },

    events: {
      showCarLevelTwo(data, state=true){
        if(state){
          this.$dispatch('historyPushState', 2, data)
        }
        this.show = true
        this.brand = data.brand
      },
      hideCarLevelTwo(){
        this.show = false
        this.loading = true
        this.brand = ''
      }
    },

    methods:{
      refreshScrollView(){
        this.loading =false
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
        this.$emit('callback', Object.assign({}, {brand: this.brand}, data))
      },

      close(){
        this.$dispatch('historyPopState')
      }
    },

    ready(){
    },

    components:{
      ComponentHeader,
      SeriesList,
      Loading
    }
  }
</script>