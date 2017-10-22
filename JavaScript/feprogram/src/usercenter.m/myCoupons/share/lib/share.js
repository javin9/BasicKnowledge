import wxBridge from 'wx-bridge'

if(/MicroMessenger/.test(window.navigator.userAgent)){
	wxBridge(Object.assign({}, window.__WX_AUTH__ || {}, {
    debug:false,
    title: `【发福利】你贷款购车，我送你${window.CouponWayValue}元${window.CouponWayName}`,
    desc: '福利来袭，易鑫助您轻松购车',
    imgUrl: 'http://img4.bitautoimg.com/jinrong/newmweb/images/pic300.jpg'
  }))
}