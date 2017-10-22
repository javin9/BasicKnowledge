export default {
	data: {
		// DownPaymentRate: '0.3',
    	// RepaymentPeriod: '36'
	},
    isClickCoupon:false,//是否点击卡卷
	productIds: [],

	packageId: '',

	ordersFirst: '',

	userId: '',

	OrderId: '',
	ChildOrderId: '',

	Ki_CarId: '',		// 开走吧产品车型id
	Ki_OrderId: '',	// 开走吧订单id

	AdviserId: 0,
	TypeOfTakingCouponCard: 0,//领取卡券状态
	CouponCardId: 0,//卡券批次
	rootFontSize: parseInt($('html').css('font-size').replace('px', '')),
	validate: {
		name: isAuthenticated && !!userName,

		// 手机号
		telphone: !!mobile,

		// 验证码
		checkcode: false,

		// 修改手机号
		phone: false,

		// 实名认证: 姓名
		realname: true,

		// 实名认证: 身份证
		certificatenumber: false,

		//实名认证：图片验证码
		imgCode: false,
	}
}