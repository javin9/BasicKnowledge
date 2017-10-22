import './info.scss'

import Vue from 'vue'
import VueResource from 'vue-resource'
import CarSelector from 'libs/vue-components/car-selector'
import citySelect from 'libs/citySelect'
import MobileVerify from 'libs/vue-components/mobile-verify'

Vue.use(VueResource)

const $toolsNav = $('#tools-nav'),
	$navTips = $('#navTips'),
	$searchcar = $('#searchcar')


new Vue({
	el: '#info',
	data: {
		isSubmiting: false,
		carLevel:2,
		carSearchView:true
	},
	ready: function() {
		tools.appDown(true)
		this.bindEvent()
	},
	components: {
		MobileVerify,
		CarSelector
	},
	methods: {
		// 验证码校验失败后的回调
		getAuthcodeErrorCallback(msg, mobile) {
			tools.showAlert(`您的手机号${mobile}今日已达到下单次数限制，请前往个人中心查看订单详情。`)
		},
		selectCarCallback(data, options){
			let href
			if(options.type === 'change'){
				href = `/pre/${window.city.citySpell}/${window.car.carSerialAllSpell}/m${data.car.id}${window.dealer.dealerId ? '/d'+ window.dealer.dealerId : ''}/${window.source ? '?source='+source : ''}`
			}else{
				$searchcar.find('span').text(data.series.name)
				href = `/pre/${window.city.citySpell}/${data.series.spell}/${window.source ? '?source='+source : ''}`
			}
			if(dev){
				console.log(href)
			}else{
				document.location.href = href
			}
		},
		goBack() {
			history.go(-1)
			return false
		},
		// 换城市
		changeCity(e) {
			e.preventDefault()
			citySelect.citySelect(city, function(result) {
				setTimeout(function() {
					window.location.href =
						'/pre/' +
						result.CitySpell +
						'/' +
						car.carSerialAllSpell +
						'/m' +
						car.carId +
						'/?source=' +
						tools.getUrlParam('source')
				}, 100)
			})
		},
		// 切换车款
		changeCar() {
			this.carLevel = 3
			this.carSearchView = false
			this.$broadcast('showCarSelector',{
				type:'change',
				brand: {
					id: +car.masterBrandId,
					name: car.masterBrandName,
					logo: car.masterBrandLogo
				},
				series: {
					id: +car.serialId,
					name:car.carSerialShowName
				}
			})
		},
		// 头部导航搜索车款
		searchCar() {
			this.carLevel = 2
			this.carSearchView = true
			this.$broadcast('showCarSelector',{type:'search'})
		},
		// 事件绑定
		bindEvent() {
			// 导航tips
			$toolsNav.click(function() {
				$('#navTips').toggleClass('hide')
			})
			$navTips.find('a').click(function() {
				$navTips.addClass('hide')
			})
			$('body').click(function(e) {
				if ($(e.target).attr('id') != 'tools-nav') $navTips.addClass('hide')
			})
		},

		submit(data) {
			if (!data) {
				return false
			}

			this.isSubmiting = true

			if (data.authcode) {
				this.submitLogin(data.mobile, data.authcode)
			} else {
				this.getOrderId(data.mobile)
			}
		},

		// 提交
		submitLogin(mobile, mobileValidateCode) {
			const params = {
				mobile,
				mobileValidateCode
			}

			this.$http
				.jsonp(`${window.usercenterUrl}/user/CreateAccount`, { params })
				.then(response =>
					response.json().then(res => {
						if (res.Result) {
							this.getOrderId(mobile)
						} else {
							tools.showAlert(res.Message)
							this.isSubmiting = false
						}
					})
				)
		},

		// 生成订单接口
		getOrderId(mobile) {
			const params = {
				ApplyerTelephone: mobile,
				Telephone: mobile,
				UserId: 0,
				OrderType: 1,
				CarId: car.carId,
				CityId: city.CityId,
				From: tools.getCookie('from'),
				Source: source,
				Channel: channel,
				ListIndex: 0,
				Way: 7,
				CarPrice: car.carPrice
			}

			this.$http
				.post(window.addLeadsUrl, params, { emulateJSON: true })
				.then(response =>
					response.json().then(res => {
						if (res.Result) {
							this.$broadcast('trackSubmitSuccess', '信用卡直通M订单提交成功')
							if (dev) {
								console.log(
									`/pre/${city.CitySpell}/m${car.carId}/?orderId=${res.Data.OrderId}`
								)
							} else {
								window.location.href = `/pre/${city.CitySpell}/m${car.carId}/?orderId=${res.Data.OrderId}`
							}
						} else {
							this.$broadcast('trackSubmitFail', '信用卡直通M订单提交失败 原因' + res.Message)
							this.isSubmiting = false
							tools.showAlert(res.Message)
						}
					})
				)
		}
	}
})
