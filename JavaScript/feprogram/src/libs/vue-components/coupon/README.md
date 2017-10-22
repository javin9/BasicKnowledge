# modal 分享有礼入口弹层组件

### 使用
	<coupon-modal :options="shareOptions" rule="xxx"></coupon-modal>

### props
	* options: Object
		* rule: 规则页面地址
		* shareOptions: Object, 分享参数
			* title : 分享标题, 可选，默认document.title
	    * url : 分享url及生成二维码url, 可选，默认当前页面url
	    * desc : 分享描述, 可选，默认同title
	    * image: 分享图片, 可选， 默认空
	    * qrcodeTitle: 可选,二维码view标题, 默认同title

### events
 * showCouponModal
 * hideCouponModal



# tag 分享有礼角标

### 使用
	<coupon-tag href="xxx"></coupon-tag>

### props
	* href: 角标链接地址
