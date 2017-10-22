import Browser from './browser'

const isQQ = Browser.isqqBrowser() && !Browser.isWeixin()
const isUC = Browser.isucBrowser()
const platform = Browser.getPlatform()

export const isNative = isQQ || isUC

const apiList = {
  weibo: ['kSinaWeibo', 'SinaWeibo', 11, '新浪微博'],
  wechat: ['kWeixin', 'WechatFriends', 1, '微信好友'],
  timeline: ['kWeixinFriend', 'WechatTimeline', '8', '微信朋友圈'],
  qq: ['kQQ', 'QQ', '4', 'QQ好友']
}

if(isQQ){
  const qqScript = document.createElement('script')
  qqScript.setAttribute('src','//jsapi.qq.com/get?api=app.share')
	document.getElementsByTagName('body')[0].appendChild(qqScript)
}

export function nativeDispatch(type, params){
	if(isUC){
		type = platform === 'iPhone' ? apiList[type][0] : apiList[type][1]
    if (typeof ucweb !== 'undefined') {
      ucweb.startRequest('shell.page_share', [params.title, type === 'SinaWeibo' ? params.title : params.desc, params.url, type, '', '', ''])
    } else if(typeof ucbrowser !== 'undefined'){
      ucbrowser.web_share(params.title, type === 'SinaWeibo' ? params.title : params.desc, params.url, type, '', '', '')
    }
	}else if(isQQ){
		type = apiList[type][2]
    var config = {
        url: params.url,
        title: params.title,
        description: params.desc,
        img_url: params.image,
        img_title: params.title,
        to_app: type,
        cus_txt: params.title
    }
    if (typeof browser !== 'undefined' && browser.app) {
      browser.app.share(config)
    }
	}
}