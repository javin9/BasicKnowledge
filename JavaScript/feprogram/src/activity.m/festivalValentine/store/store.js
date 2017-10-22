export default {
	data: {
		DownPaymentRate: '0.3',
    RepaymentPeriod: '36'
	},

	productIds: [],

	order_ID: '',

	userId: '',

	AdviserId: 0,

	rootFontSize: parseInt($('html').css('font-size').replace('px', '')),

	validate: {
		name: isAuthenticated && !!userName,

		// 手机号
		telphone: !!mobile,

		// 验证码
		code: false,

		// 修改手机号
		phone: false,

		// 实名认证: 姓名
		realName: false,

		// 实名认证: 身份证
		certificate: false,
	}
}