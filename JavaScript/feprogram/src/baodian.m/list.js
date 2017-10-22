import './css/list.scss'
import Vue from 'vue'
import moment from 'moment'
import iScroll from 'iscroll'
import 'libs/swiper'
import hideType from 'libs/hideType'

var $toTop = $('.bottom-to-top')

if(hideType.nav){
  $('body').addClass('is-app')
}

// register filters
Vue.filter('formatJsonDate', function (text, format) {
  if(text){
    var date = new Date(parseInt(text.replace("/Date(", "").replace(")/", ""), 10))
    text = moment(date).format(format || 'YYYY-MM-DD')
  }
  return text
})

// format iso 8601
Vue.filter('formatIsoDate', function (text) {
  if(text){
    var date = new Date(text)
    text = moment(date).format('YYYY-MM-DD')
  }
  return text
})

Vue.filter('getType', function(type){
  let text = ''
  $('.baodian-nav a').each((key, item)=>{
    if(key === type){
      text = item.innerText
    }
  })
  return text
})

// iScroll object
var scroll = new iScroll('.baodian-list', {
  mouseWheel: true,
  useTransition: false,
  checkDOMChanges: true,
  scrollbars:true,
  fadeScrollbars:true,
  freeScroll: false,
  click:true
  // preventDefault:false
})

scroll.on('scrollEnd', function(){
  var isEnd = this.y <= this.maxScrollY
  if(!vm.loadingData && !vm.allData && isEnd){
    vm.loadingData = true
    vm.pullRequest()
  }
  if(this.y <= -2000){
    $toTop.show()
  }else{
    $toTop.hide()
  }
})

$toTop.on('click', function(){
  scroll.scrollTo(0,0)
  $toTop.hide()
})

$('body').on('click', '.swiper-slide', function(e){
  if(dev){
    alert(this.getAttribute('rel'))
  }else{
    window.location.href = this.getAttribute('rel')
  }
})

// vm
var vm = new Vue({
  el: '#app',

  data: {
    list : [],
    type: null,

    // 首页精选type
    typeHome: 0,

    // 车主晒单type
    typeSpe: 7,

    offset: 0,
    inter: 10,

    bannerList:[],
    adList: [],

    loadedAd: false,
    loadedBanner: false,

    swiperActive:false,


    // control the pull up bar loading status
    loadingData: true,

    // loading all data for current type
    allData: false
  },

  methods: {
    // article type
    setType(type){
        if( type !== this.type ){
          this.swiperActive = false
          this.type = type
          this.list = []
          this.offset = 0
          this.getList()
          scroll.scrollTo(0,0)
        }
    },

    // pull up refresh
    pullRequest(){
      this.offset += this.inter
      this.getList()
    },

    // get data
    getList(){
      if(!this.loadedAd){
        return false
      }
      this.loadingData = true
      let requestUrl
      switch(this.type){
        case this.typeSpe :
          requestUrl = apiUrl.showList 
          break
        case this.typeHome :
          requestUrl = apiUrl.home 
          break
        default :
          requestUrl = apiUrl.list 
      }

      tools.$ajax({
          url: requestUrl,
          data: {type:this.type, page:this.offset},
          success: res => {
            this.loadingData = false
            if( res.status && res.result && res.result.length){

              // 处理imglist
              if(this.type === this.typeSpe || this.type === this.typeHome){
                $.each(res.result, function(index, item){
                  if(item.ImageList){
                    item.ImageList = item.ImageList.split(',')
                  }
                })
              }

              this.allData = false
              this.list = this.list.concat(res.result)
              if(this.type === this.typeHome){
                Vue.nextTick(this.homePageRender.bind(this))
              }
            }

            // has loaded all data
            if(!res.status || !res.result || res.result.length < this.inter || this.type === this.typeHome){
              this.allData = true
            }
          }
      })
    },

    homePageRender(){

      const bindSwiper = () => {
        this.swiperActive = true
        if(this.bannerList.length > 1){
          new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            autoplay: 3000,
            loop:true,
            preventClicks:false,
            threshold:50
            // onClick(swiper, event){
            //   const href = swiper.slides[swiper.realIndex].getAttribute('href')
            //   alert(href)
            //   // window.location.href = href
            //   return false
            // }
          })
        }
      }

      // 获取焦点图
      if(!this.loadedBanner){
        tools.$ajax({
          url: apiUrl.focusBanner,
          data: {
            citySpell
          },
          success: res => {
            this.bannerList = res.result
            Vue.nextTick(bindSwiper)
          }
        })
      }else if(!this.swiperActive){
        Vue.nextTick(bindSwiper)
      }

      // 获取广告图
      if(!this.loadedAd){
        tools.$ajax({
          url: apiUrl.banner,
          success: res => {
            res.result.forEach(item => this.adList.push(item))
            this.loadedAd = true
            this.getList()
          }
        })
      }
    },

    setTypeAndNav(type){
      this.setType(type)
      // 为防止dom操作阻碍type设置
      Vue.nextTick(()=>this.scrollNavToType(type))
    },

    scrollNavToType(type){
      document.querySelector('.baodian-nav ul').scrollLeft = $('.baodian-nav li').eq(this.type-1)[0].offsetLeft
    }
  },

  watch: {
    // 确保滚动条正常
    adList(){
      setTimeout(() => {
        Vue.nextTick(scroll.refresh.bind(scroll))
      },2000)
    },
    // 确保滚动条正常
    list(){
      Vue.nextTick(scroll.refresh.bind(scroll))
    }
  },

  created: function(){
    // get default article type from url
    // the first of loading data
    this.type = +window.location.hash.substring(1) || this.typeHome
    this.getList()
  },

  compiled: function(){
    // scroll to current type
    // simple way but can be optimize
    if(this.type > 3){
      this.scrollNavToType(this.type)
    }

    // if(this.type === this.typeHome){
      this.homePageRender()
    // }
  }
})

module.exports = {
  
}