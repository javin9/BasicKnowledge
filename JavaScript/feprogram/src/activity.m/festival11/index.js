import 'libs/swiper'
import carSelect from 'libs/carSelect'
import './index.scss'
import queryLoader from './queryloader2'

//获取vip顾问
const $linkVip = $(".link-vip");

//增加APP内嵌的判断
var cityId = tools.getUrlParam("cityId");
if(cityId && tools.getCookie("YiXinAppInfo")){
	if (document.domain.search(".daikuan.com") != -1) {
        tools.setCookie("selectCityId", cityId, "", ".daikuan.com");
        tools.setCookie("selectcity", cityId, "", ".daikuan.com");
    }else{
        tools.setCookie("selectCityId", cityId, "", document.domain);
        tools.setCookie("selectcity", cityId, "", document.domain);
    }
}else{
	var cityCookie = tools.getCookie("selectCityId");
	if(!cityId && cityCookie){
		cityId = cityCookie;
	}
} 

const views = ['a', 'b', 'c']

class View{
	constructor(viewName, views){
		this.$el = $('body')
		this.$list = this.$el.find('.car-list')
		this.$next = this.$el.find('.next')
		this.$prev = this.$el.find('.prev')
		this.$car = this.$el.find('.more')
		this.$header = this.$el.find('.header')
		this.viewReady = true
		this.views = views

		this.renderView(viewName)
		this.initSwiper()
		this.bindChangeViewHandler()
		this.bindSelectCar()

		//贷款顾问
		this.loanAdvisor();
	}

	renderView(viewName){
		if(this.viewReady){
			this.viewReady = false
			this.viewName = viewName
			this.initSkin()
			this.showData()
		}
	}

	initSkin(){
		this.$el[0].className = 'theme-' + this.viewName
		setTimeout(() => this.viewReady = true, 1000)
	}

	initSwiper(){
		// missing setTimeout will fail
		setTimeout(()=>{
			new Swiper('.swiper-container', {
			  pagination: '.swiper-pagination',
			  effect: 'coverflow',
			  centeredSlides: true,
			  slidesPerView: 'auto',
			  loop:true,
			  coverflow: {
			    rotate: 30,
			    stretch: 0,
			    depth: 250,
			    modifier: 1,
			    slideShadows : true
			  }
			})
		},1000)
	}

	bindChangeViewHandler(){
		this.$next.on('click', () => this.renderView(this.nextView()))
		this.$prev.on('click', () => this.renderView(this.prevView()))
		this.$header.on('swipeLeft', () => this.renderView(this.nextView()))
		this.$header.on('swipeRight', () => this.renderView(this.prevView()))
	}

	bindSelectCar(){
		this.$car.on('click', ()=>{
			carSelect.carSelect({
          onlyOnSale: true,
          showLevel: 2,
          showAllBrand: false,
          showSearch: false,
          hide: false
      },  result => {
        setTimeout(function () {
        		const locationPrefix = xincheUrl + '/www/'
            if (result.allBrand) {

            } else if (result.hotCar) {
                document.location.href =locationPrefix + result.hotCar.CarSerialAllSpell + '?source=' + source
            } else if (result.searchCar) {
                if (result.searchCar.type === '主品牌') {
                } else if (result.searchCar.type === '子品牌' || result.searchCar.type === '品牌') {
                    document.location.href = locationPrefix + result.searchCar.spell + '?source=' + source
                }
            } else {
                if (result.carType) {
                    document.location.href = locationPrefix + result.carType.spell + '?source=' + source
                } else if (result.brand) {
                    document.location.href = locationPrefix + result.brand.spell + '?source=' + source
                }
            }
        }, 110)
      })
			return false
		})
	}

	showData(){
		this.$list.hide().filter('[rel='+this.viewName+']').show()
	}

	nextView(){
		let viewIndex = this.views.indexOf(this.viewName) + 1
		viewIndex = viewIndex > this.views.length - 1 ? 0 : viewIndex
		return this.views[viewIndex]
	}

	prevView(){
		let viewIndex = this.views.indexOf(this.viewName) - 1
		viewIndex = viewIndex < 0 ? this.views.length - 1 : viewIndex
		return this.views[viewIndex]
	}

	loanAdvisor(){
		if(cityId){
			var linkVipHref = $linkVip.attr("href");
			if(linkVipHref.indexOf("?")>=0){
				$linkVip.attr({
					"href":linkVipHref+"&CityId="+cityId
				})
			}else{
				$linkVip.attr({
					"href":linkVipHref+"?CityId="+cityId
				})
			}
		}
	}
}

$('body').addClass('theme-c')


new queryLoader(document.querySelector('body'), {
  barColor: 'transparent',
  backgroundColor: '#F2F2F2',
  minimumTime: 200,
  onComplete(){
  	$('#yxWrapper').append('<footer></footer>')
  	$('#qLtempOverlay').remove()

		views.forEach(value => {
			$('body').append('<div class="preload-'+value+'"></div>')
			$('body').append('<div class="preload-'+value+'-repeat"></div>')
		})
		
  	$('[data-src]').each(function(){
  		$(this).attr('src', $(this).data('src'))
  	})
  	$('.lazy').removeClass('lazy')
  	new View('c', views)
  }
})




