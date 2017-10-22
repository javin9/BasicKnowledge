# 手机验证码组件

### props（所有都是可选）
	* mobile: [String] 初始手机号
	* isTextErrTip: [Boolean] 文本框内的字是否错误标红，默认true
	* authcode: [String] 初始验证码
	* authcodeLength: [Number] 验证码长度，默认6
	* getcodeApi: [String] 获取验证码API, 默认取window.CODE_GETTING_URL
	* checkcodeApi: [String] 校验验证码API, 默认取window.CODE_VALIDATING_URL
	* showButton: [Boolean] 是否显示提交按钮，默认true
	* buttonText: [String] 提交按钮文本，默认'提交'
	* disabled: [Boolean] 提交按钮禁用状态同步，默认false
	* showLabels: [Boolean] 是否显示表单label, 默认true
	* showIcons: [Boolean] 是否显示表单icon, 默认false
	* mobileIcon: [String] base64图片， 手机号icon, showIcons时生效, 有默认图片
	* authcodeIcon: [String] base64图片， 验证码icon, showIcons时生效, 有默认图片
	* readonly: [Boolean] 是否只读模式，只读模式没有验证码，且手机号不可更改
	* mobileReadonly: [Boolean] 是否手机只读模式，仅仅手机号不可更改，但是显示验证码;@deprecated, 不建议使用，通过readonly和authcodeAutoHide属性来控制。
	* authcodeAutoHide: [Boolean] 是否自动隐藏验证码，默认true, 会根据登录状态和只读状态来隐藏验证码
	* countdown: [Number] 倒计时秒数，默认60
	* line: [Number] 验证码API调用传参的业务线, 默认550
	* token: [String] 验证码API调用传参token, 默认取input[type=__RequestVerificationToken]值
	* mobileLabel: [String] 手机号label文本，默认'手机号'
	* authcodeLabel: [String] 手机号label文本，默认'验证码'
	* authcodeButtonText: [String] 获取验证码按钮文本，默认'获取验证码'
	* mobilePlaceholder: [String] 手机号输入框placeholder, 默认'请输入手机号'
	* authcodePlaceholder: [String] 验证码输入框placeholder, 默认'请输入验证码'
	* getAuthcodeErrorCallback: [Function] 验证码获取出错后的回调， 默认toast
		* @params msg: 错误信息
		* @params mobile: 错误手机号
	* checkAuthcodeErrorCallback: [Function] 验证码校验出错后的回调， 默认toast
		* @params msg: 错误信息
		* @params mobile: 错误手机号

### events
	* submit: (data) 提交
		* @params data: {mobile: xxx, authcode: xxx, loginMobile: xxx}
	* update: (mobile, authcode) 同步手机号验证码到父级组件
		* @params mobile
		* @params authcode

### broadcast events
    * validateFail: 如果是父组件验证验证码失败可以直接调用
	* validateAuthcode: (callback) 校验验证码 
		* @params callback: 校验完毕回调函数, 若错误调用props.checkAuthcodeErrorCallback
			* @params valid: [Boolean] 是否校验通过
	* trackSubmitSuccess:  (ex3) 提交成功统计
	* trackSubmitFail:  (ex3) 提交失败统计