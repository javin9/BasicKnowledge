# 通用登录弹层

### 使用
<login-modal title="登录并分享" :callback="loginCallback" :interface="loginInterface"></login-modal>

### props
	* title : String, 登录弹层标题，默认'登录'
	* interface: String, 调用的登录接口, 默认取window.loginApiUrl
	* callback: Function, 登录后回调函数，参数为登录接口返回res.Data
	* jsonp: Boolean, 是否跨域，默认false
	* submitText: String, 登录按钮文案，默认'登录' 

### events
	* showLoginModal: 显示登录弹层

	