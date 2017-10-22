<template>
  <div class="component-car-selector" v-show="show" transition="slideleft" @touchmove.prevent>
    <div v-show="!disabledLevelOne">
      <car-level-one 
        :disabled="disabledLevelOne"
        :api="runtime.api" 
        :interface="runtime.interfaceBrand"
        :method="runtime.interfaceBrandMethod"
        :category="runtime.category"
        :only-on-sale="runtime.onlyOnSale" 
        :show-hot-series="runtime.showHotSeries" 
        :show-all-brand="runtime.showAllBrand" 
        :show-recommend-brand="runtime.showRecommendBrand" 
        :show-search="runtime.showSearch" 
        :show-logo="runtime.showBrandLogo"
        :search-placeholder="runtime.searchPlaceholder"
        :search-default-link="runtime.searchDefaultLink"
        :only-search="runtime.onlySearch"
        :tag="showTag"
        :from="from"
        @callback="dispatcher"></car-level-one>
    </div>
   
    <car-level-two  
      :disabled="disabledLevelTwo"
      :api="runtime.api" 
      :interface="runtime.interfaceSeries"
      :method="runtime.interfaceSeriesMethod"
      :only-on-sale="runtime.onlyOnSale"
      :show-all-series="runtime.showAllSeries" 
      :show-logo="runtime.showSeriesLogo"
      :tag="showTag"
      :from="from"
      @callback="dispatcher"></car-level-two>

    <car-level-three 
      :api="runtime.api" 
      :interface="runtime.interfaceCar"
      :method="runtime.interfaceCarMethod"
      :only-on-sale="runtime.onlyOnSale" 
      :show-logo="runtime.showCarLogo"
      :city-id="runtime.cityId"
      :tag="showTag"
      :from="from"
      :allbrand-link="allbrandLink"
      :allbrand-href="allbrandHref"
      :selected-car="selectedCar"
      @callback="dispatcher"></car-level-three>
  </div>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';
  
  .component-car-selector{
    position: fixed;
    left:0;
    top:0;
    bottom:0;
    width:100%;
    max-width: 10rem;
    max-width: 100vw;
    z-index: 9999;
  }
</style>

<script>
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import VueTouch from 'vue-touch'
  import CarLevelOne from './views/one'
  import CarLevelTwo from './views/two'
  import CarLevelThree from './views/three'
  import createHistory from 'history/createBrowserHistory'

  Vue.use(VueResource)
  Vue.use(VueTouch)

  // 默认属性
  const props = {
    api: {
      type: String,
      default: dev ? '/' : ( window.WEBAPI || `${document.location.protocol}//webapi.daikuan.com/`)
    },
    autoInit: {
        type: Boolean,
        default: false
    },
    interfaceBrand: {
      type: String,
      default: ''
    },
    interfaceSeries: {
      type: String,
      default: ''
    },
    interfaceCar: {
      type: String,
      default: ''
    },
    interfaceBrandMethod: {
      type: String,
      default: 'get'
    },
    interfaceSeriesMethod: {
      type: String,
      default: 'get'
    },
    interfaceCarMethod: {
      type: String,
      default: 'get'
    },
    // 推荐品牌，热卖车型及搜索推荐的类目参数
    category: {
      type: String,
      default: 'xinche'
    },
    level:{
      type: Number,
      default: 2
    },
    onlySearch:{
      type: Boolean,
      default: false
    },
    onlyOnSale: {
      type: Boolean,
      default: true
    },
    showTag: {
      type: Boolean,
      default: false
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    showHotSeries: {
      type: Boolean,
      default: false
    },
    showAllBrand: {
      type: Boolean,
      default: false
    },
    showAllSeries: {
      type: Boolean,
      default: false
    },
    showRecommendBrand:{
      type: Boolean,
      default: true
    },
    showBrandLogo: {
      type: Boolean,
      default: true
    },
    showSeriesLogo: {
      type: Boolean,
      default: true
    },
    showCarLogo: {
      type:Boolean,
      default: false
    },
    searchPlaceholder: {
      type: String,
      default: '请输入品牌或车型'
    },
    searchDefaultLink: {
      type: String,
      default: ''
    },
    cityId: {
      type: Number,
      default: 0
    },
    from: {
      type: [String, Number],
      default: tools.getUrlParam('from') || tools.getCookie('from') || ''
    },
    autoClose: {
      type: Boolean,
      default: true
    },
    allbrandLink: {
      type: Boolean,
      default: false
    },
    allbrandHref: {
        type: String,
        default: ''
    },
    callback: {
      type: Function,
      default: function(data){
        if(dev){
          console.log(data)
        }
        this.$nextTick(()=>{
          this.$emit('callback', data, this.options.runtime)
        })
      }
    }
  }

  // 运行时可用的props
  // 从props中排除Function类型数据，因为state无法暂存Function
  const runtimeProps = Object.keys(props).filter(key => props[key].type !== Function)

  export default {
    props,

    data () {
      return {
        name: 'car-selector',

        history: createHistory(),

        // 路由深度
        stateDeep:0,

        show: false,

        options: {},

        // 页面是否从bfCache中取得
        bfCache: false,

        // 乐视浏览器不支持history.go多个页面， 关闭组件需要单独做兼容处理
        compatHistoryGo: /EUI Browser/.test(window.navigator.userAgent),

        // 强制关闭, 用来compatHistoryGo为true时的情况
        forceClose: false
      }
    },

    computed: {
      // 运行时状态
      runtime(){
        const runtimeObj = {}
        runtimeProps.forEach(key => {
          runtimeObj[key] = this.options.runtime ? this.options.runtime[key] : this[key]
        })
        return runtimeObj
      },

      // 进入控件默认展示的选车视图级别
      initView(){
        return this.options.runtime && this.options.runtime.initView  || (this.options.series ? 3 
                : this.options.brand ? 2
                : 1)
      },

      // 默认级别不为1， 则不展示品牌视图
      disabledLevelOne(){
        return this.initView && this.initView !== 1 
      },

      // 默认级别为3， 则不展示车系视图
      disabledLevelTwo(){
        return this.initView === 3
      },

      selectedCar(){
        return this.options.car ? this.options.car.selected : 0
      }
    },

    events:{

      /**
       * 增加一条浏览器历史记录
       * @description 控件视图切换通过state来管理
       * @param  {Number} level state的视图级别
       * @param  {Object} data  暂存到state的数据，为forward功能提供数据支持
       */
      historyPushState(level, data={}){
        // state默认参数，与当前location.href相同，不改变浏览器页面地址
        const options = {
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash
        }

        // 每增加一个state则控件state深度需要增加1
        this.stateDeep += 1

        this.history.push({
          state:{
            type: this.name,
            deep: this.stateDeep,
            runtime: {...this.options.runtime, initView:this.initView},
            data,
            level
          },
          ...options
        })
      },

      /**
       * pop一条state记录
       * @param  {Number} deep 浏览器后退几个state, 默认1
       */
      historyPopState(deep=1){
        // 不兼容history.go多个页面的情况下，需要逐级退出
        if(this.compatHistoryGo && deep > 1){
          deep = 1
          this.forceClose = true
        }
        this.stateDeep -= deep
        this.history.go(-deep)
      },

      /**
       * 显示选车控件，对外部提供的event
       * @param  {Object} options 选车控件运行时必要的数据
       */
      showCarSelector(options={}, state=true){
        // 手动触发显示选车控件，state为true, 此时若是页面未load状态，不展示选车控件， 会无法正常后退
        // ref: https://stackoverflow.com/questions/24096717/how-to-handle-back-button-when-browser-is-not-firing-popstate-event-immediately?newreg=8442073fba1d4def8b980b2887653046
        if(state && document.readyState !== 'complete'){
          return false
        }
        // 确保event调用时props为最新
        this.$nextTick(()=>{
          options.runtime = options.runtime || {...options}

          runtimeProps.forEach(key => {
            options.runtime[key] = options.runtime[key] || this[key]
          })

          // 需要先将运行时数据赋值data.options, 才能得到准确计算后的属性值initView
          this.options = options

          // 视图展示逻辑
          // 初始视图3： 展示三级选车视图
          if(options.series){
            this.$broadcast('showCarLevelThree', {brand: options.brand, series: options.series}, state)
          }else if(options.brand){
            this.$broadcast('showCarLevelTwo', {brand: options.brand}, state)
          }else{
            this.$broadcast('showCarLevelOne', {}, state)
          }
          this.show = true
        })
      }
    },

    methods:{
      /**
       * 总派发器
       * @description 任何视图内的点选动作都经过改函数来派发, 决定下一步操作
       * @param  {Object} data 运行时数据
       */
      dispatcher(data){
        // 选车控件若是设置了不自动关闭，则完成选择后不触发pop state来关闭选车控件
        // 一般是页面跳转的情况下，为了保存选车控件路由状态，似的浏览器后退可以按层回退
        const close = this.runtime.autoClose ? () => this.$emit('historyPopState', this.stateDeep) : function(){}

        switch(this.runtime.level){
          // 选车控件级别为1，做选择结束操作
          case 1: 
            // close和callback顺序不能反，否则callback中若是跳转，close的popstate事件可能会导致跳转被canceled掉
            close()
            this.callback(data)
            break

          // 选车控件级别为2, 检测是否全部选择完毕，是则结束操作，否则展示车系视图
          case 2: 
            // brand.id=0是点选了全部车型, 也需要做结束处理
            if(data.series || data.brand && data.brand.id === 0){
              close()
              this.callback(data.series && data.series.id ? data : {brand: data.brand})
            }else if(data.brand){
              this.$broadcast('showCarLevelTwo',  data)
            }
            break

          // 选车控件级别为3， 检测数据是否已经选择完整，是则操作结束。若未选车系，展示车系视图，未选车型，展示车型视图。
          case 3:
            // series.id=0, 是点选了全部车系， 做结束处理
            if(data.car || data.series && data.series.id === 0 || data.brand && data.brand.id === 0){
              close()
              this.callback(data)
            }else if(data.series){
              this.$broadcast('showCarLevelThree', data)
            }else if(data.brand){
              this.$broadcast('showCarLevelTwo',  data)
            }
            break

          default: break
        }
      },

      /**
       * 监听浏览器state
       * @description action为POP时确定触发是浏览器前进,后退
       */
      listenState(){
        this.history.listen(({state}, action) => {
//          alert(action)
          // 如果从bfCache中取得页面， state为undefined，不需要操作state
          if(action === 'POP' && !this.bfCache){
            // 浏览器后退不执行historyPopState, 需要同步deep
            if(state && state.deep){
              this.stateDeep = state.deep
            }
            if(this.compatHistoryGo && this.forceClose && this.stateDeep > 0){
              this.$emit('historyPopState')
              return 
            }
            // 当前state是否为选车控件的state
            // 若不是说明退出选车控件，需要对选车控件做关闭处理
            if(state && state.type === this.name){
              if(!this.show){
                this.initState()
              }else{
                switch(state.level){
                  case 1:
                    this.$broadcast('hideCarLevelThree')
                    this.$broadcast('hideCarLevelTwo')
                    this.$broadcast('showCarLevelOne', state.data, false)
                    break
                  case 2:
                    this.$broadcast('hideCarLevelThree')
                    this.$broadcast('showCarLevelTwo', state.data, false)
                    break
                  case 3:
                    this.$broadcast('showCarLevelThree', state.data, false)
                    break
                  default:
                    break
                }
              }
            }else if(this.show){
              // 退出选车控件：
              // 以独立页面显示控件时后退至浏览器记录的一页，否则如下：
              // 重设选车控件运行时数据
              // 关闭车型车系视图，品牌视图作为默认视图没有隐藏事件，无需手动关闭
              // 重设一级视图，品牌视图分为搜索和品牌列表视图， 所以需要根据props重设
              if(this.autoInit){
                  window.history.go(-1)
              }else{
                  this.stateDeep = 0
                  this.forceClose = false
                  this.show = false
                  this.options = {}
                  this.$nextTick(() => this.$broadcast('hideCarLevelTwo'))
                  this.$nextTick(() => this.$broadcast('hideCarLevelThree'))
                  this.$nextTick(() => this.$broadcast('resetCarLevelOne'))
              }
            }
          }
        })
      },

      /**
       * 初始化当前页面state状态
       * @description 根据当前页面state完全复原选车控件视图状态
       */
      initState(){
        const {state} = this.history.location
        if(state && state.type === this.name){
          this.$emit('showCarSelector', {...state.data, runtime: state.runtime}, false)
          this.stateDeep = state.deep
        }else if(this.autoInit){
            $(window).on('load',() => {
              // ios8 进入页面会触发pop， 需要延时展示选车控件
              setTimeout(() => this.$emit('showCarSelector'), 500)
            })
        }

        // bfCache的情况下设置标志位
        // 前提是选车控件未关闭
        $(window).bind('pageshow', event => {
          if (event.persisted && this.show) {
            this.bfCache = true
            // uc等浏览器不会触发listen, bfCache需要在限定时间内取消
            setTimeout(()=>this.bfCache = false, 100)
          }
        })
      }
    },

    created(){
      // 开始监听state变更
      this.listenState()
    },

    ready(){
      this.initState()
    },

    components:{
      CarLevelOne,
      CarLevelTwo,
      CarLevelThree
    }
  }
</script>