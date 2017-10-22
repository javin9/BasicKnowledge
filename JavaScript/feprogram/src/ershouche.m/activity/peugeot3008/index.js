import './index.scss';

import Vue from 'vue';
import check from 'libs/check/m.js';
import hideType from 'libs/hideType';

var IScroll = require('iscroll');

var vm = new Vue({
	el: '#main',
	components: {
	},
	template: `<div id="yxWrapper">
					<header class="header-bar" v-if="headerVisible">
						<a href="javascript:history.go(-1);"></a>
						<h3 class="font-nav" v-text="headerTitle"></h3>
						<span></span>
					</header>

					<div class="image-content">
						<slot name="content"></slot>
					</div>

					<div class="layer-cover" id="carLayerId" v-show="carLayerVisible" transition="fademenu" @click.self="hideCarLayer" @touchmove.prevent>
						<div class="layer-content">
							<div class="carinfo">
								<div class="title" v-text="car.title"></div>
								<div class="info">提交订单后金融顾问会尽快与您联系，您可重新修改金融方案。</div>
							</div>
							<div class="order">
								<form action="#">
									<div class="inputwrap">
										<input type="tel" maxlength="11" placeholder="请输入手机号" name="mobileNumber" v-model="mobileNumber" @input="checkMobileNumber" @blur="checkMobileNumber" @focus="inputFocus" @keydown.space.prevent />
										<div class="error"></div>
										<div class="empty-btn" v-show="mobileNumber" @touchend="emptyInput('mobileNumber', $event)"><span></span></div>
									</div>
									<div class="inputwrap validate-code-wrap">
										<input type="tel" maxlength="6" placeholder="请输入验证码" name="mobileValidateCode" v-model="mobileValidateCode" @input="checkValidateCode" @blur="checkValidateCode" @focus="inputFocus" @keydown.space.prevent />
										<span class="get-validate-code" :class="{disabled: getValidateCodeDisabled || !mobileNumberRight}" @click="getValidateCode" v-text="getValidateCodeText"></span>
										<div class="error"></div>
										<div class="empty-btn" v-show="mobileValidateCode" @touchend="emptyInput('mobileValidateCode', $event)"><span></span></div>
									</div>
									<div class="btn-wrap">
										<span class="submit-btn" :class="{disabled: submitBtnDisabled}" @click="submitOrder">提交</span>
									</div>
								</form>
							</div>
							<div class="close-btn" @click="hideCarLayer"></div>
						</div>
					</div>

					<div class="layer-cover" v-show="aboutLayerVisible" transition="fademenu" @click.self="hideAboutLayer"  @touchmove.prevent>
						<div class="layer-content">
							<div class="about-wrapper">
								<div>
									<h3>活动细则：</h3>
									<div class="content"></div>
								</div>
							</div>
							<div class="close-btn" @click="hideAboutLayer"></div>
						</div>
					</div>
				</div>`,
	data: {
		interfaceUrl: window.InterfaceUrl,
		headerVisible: !hideType.header,
		headerTitle: '易鑫二手车',

		// 车款信息
		carInfo: window.carInfo,
		carIndex: 0,

		// 活动细则
		aboutLayerVisible: false,

		// 提交订单弹层
		carLayerVisible: false,
		mobileNumber: '',
		mobileValidateCode: '',
		mobileNumberRight: false,
		getValidateCodeDisabled: false,
		getValidateCodeText: '获取验证码',
		getValidateCodeGap: 60,
		intervalValidateCode: null,
		submitBtnDisabled: false
	},
	computed: {
		car: function() {
			return this.carInfo[this.carIndex];
		}
	},
	methods: {
		// 打开订单弹层
		showCarLayer: function() {
			this.carLayerVisible = true;
			// todo iphone5 uc qq浏览器会点穿弹层？
			$('.yiche-link, .order-link').hide();
		},

		// 收起订单弹层
		hideCarLayer: function(e) {
			this.carLayerVisible = false;
			// todo iphone5 uc qq浏览器会点穿弹层？
			$('.yiche-link, .order-link').show();
		},

		// 验证手机号
		checkMobileNumber: function(event) {
			var elem = event.target,
				val = this.mobileNumber,
				checkpass = true;

			switch (event.type) {
				case 'input':
					// 录入到达11位后，验证手机号是否正确
					if (val.length >= 11 && !check.isPhoneNumber(val)) {
						this.showError(elem, '请输入正确手机号');
						checkpass = false;
					}
					if (check.isPhoneNumber(val)) {
						this.mobileNumberRight = true;
					} else {
						this.mobileNumberRight = false;
					}
					break;
				case 'blur':
					// 非空时验证
					if (val.length > 0 && !check.isPhoneNumber(val)) {
						this.showError(elem, '请输入正确手机号');
						checkpass = false;
					}
					break;
				case 'submit':
					// 完整验证
					if (!check.isPhoneNumber(val)) {
						this.showError(elem, '请输入正确手机号');
						checkpass = false;
					}
					break;
				default:
					break;
			}

			if (checkpass) {
				this.removeError(elem);
				return true;
			} else {
				return false;
			}
		},

		// 验证验证码
		checkValidateCode: function(event) {
			var elem = event.target,
				val = this.mobileValidateCode,
				checkpass = true;

			switch (event.type) {
				case 'blur':
					// 非空时验证
					if (val.length > 0 && val.length < 6) {
						this.showError(elem, '请输入正确验证码');
						checkpass = false;
					}
					break;
				case 'submit':
					// 完整验证
					if (val.length < 6) {
						this.showError(elem, '请输入正确验证码');
						checkpass = false;
					}
					break;
				default:
					break;
			}

			if (checkpass) {
				this.removeError(elem);
				return true;
			} else {
				return false;
			}
		},

		// 显示错误提示
		showError: function(elem, msg) {
			$(elem).siblings('.error').text(msg);
		},

		// 移除错误提示
		removeError: function(elem) {
			$(elem).siblings('.error').text('');
		},

		// 清除输入框
		emptyInput: function(name, event) {
			this[name] = '';
			$(event.target).siblings('.error').text('');
			// $(event.target).siblings('input').focus();
		},

		// 输入框焦点
		inputFocus: function(e) {
			// alert($(e.target).attr('name'))
		},

		// 获取验证码
		getValidateCode: function(event) {
			var self = this;
			if (!this.getValidateCodeDisabled && this.checkMobileNumber({type: 'submit', target: 'input[name=mobileNumber]'})) {
				$('input[name="mobileValidateCode"]').focus();
				$.ajax({
					url: this.interfaceUrl.GetCode,
					type: 'post',
					data: {
						mobile: this.mobileNumber
					},
					dataType: 'json',
					success: function(res) {
						if (res.Result) {
							var countdown = self.getValidateCodeGap;
							self.getValidateCodeDisabled = true;
							self.getValidateCodeText = countdown + '秒后获取';
							self.intervalValidateCode = setInterval(function() {
								if (countdown > 1) {
									countdown--;
									self.getValidateCodeText = countdown + '秒后获取';
								} else {
									self.getValidateCodeText = '获取验证码';
									self.getValidateCodeDisabled = false;
									clearInterval(self.intervalValidateCode);
								}
							}, 1000);
						} else {
							self.getValidateCodeDisabled = false;
							tools.showAlert(res.Message);
						}
					},
					error: function(res) {
						self.getValidateCodeDisabled = false;
					}
				});
			}
		},

		// 提交订单
		submitOrder: function(event) {
			var self = this;
			var checkAll = this.checkMobileNumber({type: 'submit', target: 'input[name=mobileNumber]'});
			checkAll = this.checkValidateCode({type: 'submit', target: 'input[name=mobileValidateCode]'}) && checkAll;
			if (!this.submitBtnDisabled && checkAll) {
				this.submitBtnDisabled = true;
				$.ajax({
					url: this.interfaceUrl.CheckAndThread,
					type: 'post',
					data: {
						mobile: this.mobileNumber,
						validateCode: this.mobileValidateCode,
						carInfo: this.car.carinfoso,
						cityId: this.car.cityid,
						from: window.from
					},
					dataType: 'json',
					success: function(res) {
						if (res.Result) {
							tools.showAlert(res.Message);
							// todo check 关闭弹层
							self.hideCarLayer();
							// 清空验证码
							self.mobileValidateCode = '';
							self.getValidateCodeText = '获取验证码';
							self.getValidateCodeDisabled = false;
							if (self.intervalValidateCode) {
								clearInterval(self.intervalValidateCode);
							}
						} else {
							// 验证码错误
							if (res.Data === -1) {
								self.showError('input[name=mobileValidateCode]', '请输入正确验证码');
							// 其他错误
							} else {
								tools.showAlert(res.Message);
							}
						}
					},
					error: function(res) {
					},
					complete: function() {
						self.submitBtnDisabled = false;
					}
				});
			}
		},

		// 打开活动细则弹层
		showAboutLayer: function() {
			this.aboutLayerVisible = true;
			setTimeout(function() {
				new IScroll('.about-wrapper', {
					scrollbars: true,
					shrinkScrollbars: 'scale',
					fadeScrollbars: true,
					bounce: false,
					click: true
				});
			}, 300);
		},

		// 收起活动细则弹层
		hideAboutLayer: function() {
			this.aboutLayerVisible = false;
		},

		// 页面滚动
		scrollTo: function(scrollTo, time) {
			var scrollFrom = parseInt(document.documentElement.scrollTop || document.body.scrollTop),
				i = 0,
				runEvery = 5; // run every 5ms

			scrollTo = parseInt(scrollTo);
			time /= runEvery;

			var interval = setInterval(function () {
				i++;
				document.documentElement.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;
				document.body.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;
				if (i >= time) {
					clearInterval(interval);
				}
			}, runEvery);
		}
	},

	created(){
		this.isApp = Boolean(tools.isWebView() === 'yixinapp');
		if (this.isApp) {
			tools.jsNativeBridge('getTitle',this.headerTitle);
		}
	},

	ready: function() {
		var self = this;

		Echo.init({
			offset: 800,
			throttle: 0
		});

		$('.order-link').each(function(index) {
			$(this).click(function() {
				self.carIndex = index;
				self.showCarLayer();
			});
		});

		$('.about-link').click(function() {
			self.showAboutLayer();
		});

		$('#anchors li a').bind({
			'click': function(e) {
				e.preventDefault();
				$(this).parent().siblings().find('a').removeClass('active');
				$(this).addClass('active');
				var target = $($(this).attr('href')).offset().top;
				self.scrollTo(target, 300);
			}
		});
		$('.bottom-to-top').unbind('click').bind({
			'click': function(e) {
				e.preventDefault();
				var target = $('#anchors').offset().top;
				self.scrollTo(target, 300);
			}
		})
	}
});