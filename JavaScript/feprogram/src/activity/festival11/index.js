import 'libs/swiper'
import './index.scss'
import 'velocity-animate'
import modernizr from './modernizr'

const supportAll = /Safari/.test(navigator.userAgent)

const supportTransform = modernizr.csstransforms && modernizr.testProp('transform') || supportAll
const supportTransform3D = modernizr.csstransforms3d && modernizr.preserve3d || supportAll

if(!modernizr.testProp('transform') && !supportAll){
	$('html').addClass('no-csstransforms')
}else{
	$('html').removeClass('no-csstransforms')
}

if(!supportTransform3D){
	$('html').addClass('no-preserve3d')
}else{
	$('html').removeClass('no-preserve3d')
}

const views = ['a', 'c', 'b']

class View{
	constructor(viewName, views){
		this.$el = $('body')
		this.$win = $(window)
		this.$list = this.$el.find('.car-list')
		this.$next = this.$el.find('.next')
		this.$prev = this.$el.find('.prev')
		this.$code = this.$el.find('.app-code')
		this.$container = this.$el.find('.container-wrapper')

		this.duration = 1000
		this.rotate = 0
		this.viewReady = true
		this.views = views

		this.initTemplate()
		this.renderView(viewName)
		this.initSwiper()
		this.bindChangeViewHandler()
		this.initAppCode()
	}

	renderView(viewName, type){
		if(this.viewReady){
			this.rotate = type === 'next' ? this.rotate - 120 : 
										type === 'prev' ?this.rotate + 120 : -this.views.indexOf(viewName)*120
			this.viewReady = false
			this.oldView = this.viewName
			this.viewName = viewName

			this.initSkin()
			this.showData()
			this.animate(this.viewName, this.oldView)
		}
	}

	initTemplate(){

		const templateMain = `
			<div class="main-wrapper">
				<div class="main">
					<div class="main-element main-1"></div>
					<div class="main-element main-2"></div>
					<div class="main-element main-3"></div>
					<div class="main-element main-4"></div>
					<div class="main-element main-5"></div>
				</div>
			</div>
		`

		const templateTop = `
			<div class="top-wrapper">
				<div class="top-bg top-a"></div>
				<div class="top-bg top-b"></div>
				<div class="top-bg top-c"></div>
			</div>
		`

		const templateCover = `
			<div class="cover">
				<div class="cover-element cover-a"></div>
				<div class="cover-element cover-b"></div>
				<div class="cover-element cover-c"></div>
			</div>
		`

		const templateContainer = `
			<div class="container-bg container-a"></div>
			<div class="container-bg container-b"></div>
			<div class="container-bg container-c"></div>
		`

		supportTransform && this.$el.append(templateMain)
		this.$el.append(templateTop)
		supportTransform && this.$el.append(templateCover)
		this.$container.prepend(templateContainer)
	}

	initSkin(){
		this.$el[0].className = 'theme-' + this.viewName
		setTimeout(() => this.viewReady = true, 1000)
	}

	initSwiper(){
		if(supportTransform3D){
			// missing setTimeout will fail
			setTimeout(()=>{

				const CLASS_CONTAINER = '.swiper-container'

				const swiper = new Swiper(CLASS_CONTAINER, {
				  pagination: '.swiper-pagination',
				  effect: 'coverflow',
				  centeredSlides: true,
				  slidesPerView: 'auto',
				  loop:true,
				  paginationClickable: true,
				  coverflow: {
				    rotate: 30,
				    stretch: 0,
				    depth: 250,
				    modifier: 1,
				    slideShadows : true
				  }
				})

				$('body').on('click', '.swiper-slide', function(){
					return false
				})

				$(CLASS_CONTAINER).on('click', (e) => {
					const x = e.pageX - $(CLASS_CONTAINER).offset().left
					if(x < 145){
						swiper.slidePrev()
						return false
					}

					if(x > 855){
						swiper.slideNext()
						return false
					}

					window.open($('.swiper-slide-active').attr('href'))
				})
			},1000)
		}else{
			const slideWrapper = $('.swiper-wrapper')
			const slides = $('.swiper-slide')
			const CLASS_LEFT = 'left'
			const CLASS_RIGHT = 'right'
			const CLASS_ACTIVE = 'active'

			slides.first().addClass(CLASS_LEFT)
			slides.eq(1).addClass(CLASS_ACTIVE)
			slides.last().addClass(CLASS_RIGHT)

			slideWrapper.append('<div class="swiper-cover left"></div><div class="swiper-cover right"></div>')
			slideWrapper.on('click', '.swiper-cover.left', () => {
				const leftSlider = slides.filter('.' + CLASS_LEFT)
				const rightSlider = slides.filter('.' + CLASS_RIGHT)
				const activeSlider = slides.filter('.' + CLASS_ACTIVE)
				leftSlider.removeClass(CLASS_LEFT).addClass(CLASS_ACTIVE)
				rightSlider.removeClass(CLASS_RIGHT).addClass(CLASS_LEFT)
				activeSlider.removeClass(CLASS_ACTIVE).addClass(CLASS_RIGHT)
			})
			slideWrapper.on('click', '.swiper-cover.right', () => {
				const leftSlider = slides.filter('.' + CLASS_LEFT)
				const rightSlider = slides.filter('.' + CLASS_RIGHT)
				const activeSlider = slides.filter('.' + CLASS_ACTIVE)
				leftSlider.removeClass(CLASS_LEFT).addClass(CLASS_RIGHT)
				rightSlider.removeClass(CLASS_RIGHT).addClass(CLASS_ACTIVE)
				activeSlider.removeClass(CLASS_ACTIVE).addClass(CLASS_LEFT)
			})
		}
	}

	initAppCode(){
		this.$win.on('scroll', () => {
			const CLASS_FIX = 'fixed'
			const CLASS_BOTTOM = 'bottom'
			const h = $(window).height()
			const top = this.$win.scrollTop()
			const headerTop = 1030 - h
			const footerTop = $('#Footer').offset().top - 26 - h
			if(top > headerTop && top < footerTop){
				this.$code.removeClass(CLASS_BOTTOM).addClass(CLASS_FIX)
			}else if(top > footerTop){
				this.$code.removeClass(CLASS_FIX).addClass(CLASS_BOTTOM)
			}else{
				this.$code.removeClass(CLASS_FIX)
								  .removeClass(CLASS_BOTTOM)
			}
		})
	}

	bindChangeViewHandler(){
		this.$next.on('click', () => this.renderView(this.nextView(), 'next'))
		this.$prev.on('click', () => this.renderView(this.prevView(), 'prev'))
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

	getElement(prefix, viewName){
		return this.$el.find('.' + prefix + '-' + viewName)
	}

	animate(view, oldView){
		const PREFIX_COVER = 'cover'
		const PREFIX_BOTTOM = 'container'
		const PREFIX_TOP = 'top'
		const CLASS_MAIN = '.main'
		const enableOpacity = {opacity:1}
		const disableOpacity = {opacity:0}
		this.$el.find(CLASS_MAIN).css('transform', 'rotate('+this.rotate+'deg)')

		// 顶层背景
		this.getElement(PREFIX_TOP, view).velocity(enableOpacity, this.duration/2)
		oldView && this.getElement(PREFIX_TOP, oldView).velocity(disableOpacity, this.duration/2)

		// 底层背景
		this.getElement(PREFIX_BOTTOM, view).velocity(enableOpacity, this.duration/2)
		oldView && this.getElement(PREFIX_BOTTOM, oldView).velocity(disableOpacity, this.duration/2)

		// 遮挡层
		this.getElement(PREFIX_COVER, view).delay(this.duration/4).velocity(enableOpacity, 0)
		oldView && this.getElement(PREFIX_COVER, oldView).velocity(disableOpacity, 0)

	}
}

new View('c', views)

