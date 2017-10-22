import './css/list.scss'
import Masonry from 'masonry-layout'
import imagesLoaded from 'imagesloaded'
var listTpl = require('./template/list.hbs')

var CURRENT_CLASS = 'current'

var STYPE = '7'

var $nav = $('.baodian-list-nav li a')
var $grid = $('.baodian-list-content .grid')
var $loading = $('.baodian-list-loading')
var navlist = $nav.map(function() {
  return $(this).attr('href')
})
var currentType = $.inArray(window.location.hash, navlist) > 0 ? window.location.hash.substring(1) : navlist[0].substring(1)
var currentPage = 0
var offset = 10

var city = window.location.pathname.split('/')[1]

var prepareLoadData = true

var loadingAllData = false

main()

/**
 * 入口
 */
function main() {
  setType(currentType)
  bindEvent()
}

/**
 * 事件绑定
 */
function bindEvent() {

  // 切换nav
  $nav.on('click', function() {
    var type = $(this).attr('href').substring(1)
    if (currentType !== type) {
      setType(type)
    }
  })

  // scroll下拉刷新
  $(window).on('scroll', function() {
    if ($(window).scrollTop() + $(window).height() === $(document).height()) {
      pullRequest()
    }
  })

  window.selCityCallback = function (obj) {
    window.location.href = window.location.href.replace(/([^\/]+)(\/ListPage)/i, obj.citySpell + '$2')
  }
}

/*
 * 更新种类
 * @param type {String}
 * @param page {Number}
 */
function setType(type) {
  loadingAllData = false
  prepareLoadData = true
  currentType = type
  $nav.removeClass(CURRENT_CLASS).filter('[href="#' + type + '"]').addClass(CURRENT_CLASS)
  clearGrid()
  getData(type, 0)
}

/**
 * 清空grid
 */
function clearGrid() {
  $grid.html('')
}

/**
 * 拉取数据
 * @param  type {String}
 * @param  page {Niumber}
 */
function getData(type, page) {
  var url = type === STYPE ? apiUrl.showList : apiUrl.list
  if(prepareLoadData){
    currentPage = page
    $.getJSON(url, { articleType: type, page: page }, function(res) {
      if (res.result.length) {
        $.each(res.result, function(index, item){
          item['ID'] = '/' + city + (type === STYPE ? '/Topic/' : '/') + ( item['ID'] || item['TopicId'])

          if(item.ImageList){
            item.image = item.ImageList.split(',')[0]
          }
        })
        res.isSType = type === STYPE
        $grid.append(listTpl(res))
        renderItem()
      }else{
        loadingAllData = true
        disableLoading()
      }
    })
  }
}

/**
 * 瀑布流
 */
function renderItem() {
  var grid = new Masonry('.grid', {
    // columnWidth: 1140,
    gutter: 15,
    itemSelector: '.baodian-list-item'
  })

  imagesLoaded('.grid', function() {
    $grid.find('img').show()
    grid.layout()
    disableLoading()
  })
}

/**
 * 下拉更新
 */
function pullRequest(){
  if(!prepareLoadData){
    enableLoading()
    getData(currentType, currentPage + offset)
  }
}

/**
 * 展示loading
 */
function enableLoading(){
  if(!loadingAllData){
    prepareLoadData = true
    $loading.show()
  }
}

/**
 * 隐藏loading
 */
function disableLoading(){
  prepareLoadData = false
  $loading.hide()
}
