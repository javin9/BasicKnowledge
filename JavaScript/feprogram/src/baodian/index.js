import './css/index.scss'
import Swiper from 'libs/swiper/2.0'

var $next = $('.swiper-button-next')
var $prev = $('.swiper-button-prev')
var $baike = $('.block-baike')
var swiperButtonPrevent = false
var intVal = 500

// 迁移后swiper位置只有在setTimeout里才准确，原因待查
setTimeout(function(){
  new Swiper ('.baodian-home-header-slide', {
    direction: 'vertical',
    loop: true,
    paginationClickable:true,
    autoplay:3000,
    speed:600,
    pagination: '.swiper-pagination'
  })  

  var baikeSlider = new Swiper ('.block-baike-slide', {
    direction: 'vertical',
    speed:600,
    loop: true
  }) 

  $next.on('click', function(){
    baikeSlider.swipeNext()
  })
  $prev.on('click', function(){
    baikeSlider.swipePrev()
  })

  $baike.on('mouseenter', function(){
    swiperButtonPrevent && clearTimeout(swiperButtonPrevent)
    $next.show()
    $prev.show()
  })

  $baike.on('mouseleave', function(){
    swiperButtonPrevent = setTimeout(function(){
      $next.hide()
      $prev.hide()
    },intVal)
  })
},0)

window.selCityCallback = function (obj) {
  window.location.href = obj.url
}