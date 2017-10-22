<template>
  <search-header 
    v-if="showSearch" 
    :placeholder="searchPlaceholder" 
    :default-link="searchDefaultLink"
    :cancel="cancelHandler" 
    :focus="activeSearchView"
    :has-arrow="mainView"
    @change="changeSearchValueHandler"
    @search="searchTriggerHandler"></search-header>
  <component-header v-else @back="close">选择品牌</component-header>

  <loading v-if="loading && show"></loading>

  <div v-el:wrapper v-show="mainView" class="component-car-level-one" v-if="show">
    <div class="component-car-level-one-wrapper">

      <all-brand 
        class="component-car-level-one-has-border" 
        v-if="showAllBrand"
        @click="clickAllBrandHandler"></all-brand>

      <recommend-brand 
        class="component-car-level-one-has-border"  
        v-if="showRecommendBrand" 
        :api="compatApi" 
        :category="category" 
        :only-on-sale="onlyOnSale" 
        @rendered="refreshScrollView" 
        @callback="clickHandler"></recommend-brand>

      <hot-car-series 
        v-if="showHotSeries" 
        :api="compatApi" 
        :category="category" 
        :only-on-sale="onlyOnSale" 
        @rendered="refreshScrollView" 
        @callback="clickHandler"></hot-car-series>

      <brand-list 
        :api="api" 
        :interface="interface"
        :method="method"
        :only-on-sale="onlyOnSale" 
        :show-logo="showLogo"
        :tag="tag"
        :from="from"
        @update="updateBrandKeys"
        @rendered="refreshScrollView" 
        @callback="clickHandler"></brand-list>
    </div>
  </div>

  <letter-bar
     v-show="!searchView"
    :data="letterBarData" 
    @scroll="scrollTo"></letter-bar>

  <div class="component-car-search" v-show="searchView">
    <hot-search 
      v-if="showHotSearch"
      :api="compatApi"
      :category="category"
      @callback="clickHandler"></hot-search>
    <search-result 
      v-if="showSearchResult" 
      :value="searchValue"
      @callback="clickHandler"></search-result>
  </div>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';
  
  .component-car-level-one{
    position: absolute;
    left:0;
    top:px2rem(88);
    bottom:0;
    width: 100%;
    background: #fff;

    &-wrapper{
      position: absolute;
      width: 100%;
    }

    &-has-border{
      @include borderBottom;
    }
  }

  .component-car-search{
    position: absolute;
    left:0;
    top:px2rem(88);
    bottom:0;
    width: 100%;
    background: #fff;
  }
</style>

<script>
  import SearchHeader from '../components/search-header'
  import ComponentHeader from '../components/header'
  import AllBrand from '../components/all-brand'
  import RecommendBrand from '../components/recommend-brand'
  import HotCarSeries from '../components/hot-car-series'
  import BrandList from '../components/brand-list'
  import LetterBar from '../components/letter-bar'
  import HotSearch from '../components/hot-search'
  import SearchResult from '../components/search-result'
  import Loading from '../components/loading'
  import IScroll from 'iscroll'

  export default {
    props:{
      api: String,
      interface: String,
      method: String,
      category: String,
      onlyOnSale: Boolean,
      onlySearch: Boolean,
      showLogo: Boolean,
      showHotSeries: Boolean,
      showSearch: Boolean,
      showAllBrand: Boolean,
      showRecommendBrand: Boolean,
      searchPlaceholder: String,
      searchDefaultLink: String,
      tag:Boolean,
      from: [String, Number]
    },

    data () {
      return {
        compatApi: window.APIURL,
        show: false,
        searchValue: '',
        loading: true,
        letterBarData: [].concat(this.showRecommendBrand ? '荐' : [], this.showHotSeries ? '热' : []),
        view: this.onlySearch ? 'search' : 'main',
        scrollY: 0
      }
    },

    computed: {
      mainView(){
        return !this.searchView
      },
      searchView(){
        return this.showSearch && ( this.view === 'search' )
      },
      showHotSearch(){
        return this.searchView && !this.searchValue
      },
      showSearchResult(){
        return this.searchView && this.searchValue
      }
    },

    watch:{
      onlySearch(){
        this.view = this.onlySearch ? 'search' : 'main'
      }
    },

    events: {
      showCarLevelOne(data={}, state=true){
        if(state){
          this.$dispatch('historyPushState', 1, data)
        }
        this.show = true
        this.$nextTick(()=>this.refreshScrollView())
      },
      resetCarLevelOne(){
        this.view = this.onlySearch ? 'search' : 'main'
        this.$broadcast('resetSearchHeader')
      }
    },

    methods:{
      updateBrandKeys(keys){
        this.letterBarData = [].concat(this.letterBarData, keys)
      },
      refreshScrollView(module){
        // 同时控制多个异步模块的实现太不优雅，后期待优化
        // 品牌列表加载完毕就去掉loading状态
        if(module === 'brandlist'){
          this.loading = false
        }
        if(!this.scrollView){
          this.scrollView = new IScroll(this.$els.wrapper, {
              scrollbars: true,
              shrinkScrollbars: 'scale',
              fadeScrollbars: true,
              click: true
          })
          this.scrollView.on('scrollEnd', ()=>{
            this.$broadcast('scrollEnd')
          })
        }else{
          this.scrollView.refresh()
          this.scrollView.scrollTo(0,0)
        }
      },

      scrollTo(key){
        const element = $('[data-bar-index="'+key+'"]')[0]
        if(this.scrollView && element){
          this.scrollView.scrollToElement(element, 100)
        }
      },

      clickHandler(data){
        this.$emit('callback', data)
      },

      clickAllBrandHandler(){
        this.$emit('callback', {
          brand: {
            id: 0
          }
        })
      },

      cancelHandler(){
        if(this.searchView && !this.onlySearch){
          this.view = 'main'
        }else{
          this.close()
        }
      },

      changeSearchValueHandler(value){
        this.searchValue = value
      },

      searchTriggerHandler(){
        this.$broadcast('searchResultActive')
      },

      activeSearchView(){
        this.view = 'search'
      },

      close(){
        this.$dispatch('historyPopState')
      }
    },

    ready(){
    },

    components:{
      ComponentHeader,
      SearchHeader,
      AllBrand,
      RecommendBrand,
      HotCarSeries,
      BrandList,
      LetterBar,
      HotSearch,
      SearchResult,
      Loading
    }
  }
</script>