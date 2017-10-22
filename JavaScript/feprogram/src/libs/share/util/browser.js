export default {
	ua: navigator.userAgent,

	getPlatform(){
		if ((this.ua.indexOf('iPhone') > -1 || this.ua.indexOf('iPod') > -1)) {
      return 'iPhone'
    }
    return 'Android'
	},

	isWeixin(){
    if (/MicroMessenger/.test(this.ua)) {
        return true
    } else {
      return false
    }
	},

	getVersion(c){
		var a = c.split('.'), 
				b = parseFloat(a[0] + "." + a[1]);
    return b
	},

	isqqBrowser(){
		const isAndroid = this.getPlatform() === 'Android'
		const isInsideQQ = this.ua.indexOf('QQ/') >= 0
		const match = this.ua.split('MQQBrowser/').length > 1
		const version = match ? this.getVersion(this.ua.split('MQQBrowser/')[1]) : 0

		if(!match || match && version < 5.4 || match && isAndroid && isInsideQQ){
			return false
		}

		return match && !this.isWeixin()
	},

	isucBrowser(){
		const match = this.ua.split('UCBrowser/').length > 1
		const version = match ? this.getVersion(this.ua.split('UCBrowser/')[1]) : 0
		const platform = this.getPlatform()

		if(!match || match && platform === 'iPhone' && version < 10.2 || platform === 'Android' && version < 9.7 ){
			return false
		}

		return match
	}
}