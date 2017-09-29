var ui = {
	init:function(){
		//控制屏幕
		ui.disableChange();
		ui.disableScroll(document)
	},

	//获取当前URL参数值
	getParam:function(a){var b=decodeURI(location.href.match(eval('/'+a+'=([^&]+)/g'))).replace(a+'=','');return b=="null"?'':b},

	//禁止目标滚动
	disableScroll:function(target){
		target.addEventListener('touchmove',function(event){event.preventDefault()},false);
	},
	//禁止屏幕变化
	disableChange:function(){
		var covert = $('<div style="z-index:999;top:0;left:0;line-height:5;position:fixed;width:100%;height:100%;display:none;color:white;font-size:16px;text-align:center;background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PHBhdGggZmlsbD0id2hpdGUiIG9wYWNpdHk9Ii41IiBkPSJNNTcuNTQ4LDQ5LjkzNWgxOC4xNTdjMS4zNDYsMCwyLjQzNywxLjA5MSwyLjQzNywyLjQzN3YyNy41NGMwLDEuMzQ2LTEuMDkxLDIuNDM3LTIuNDM3LDIuNDM3SDU3LjU0OHYtMy4xMDdoMTYuOTM4VjUzLjA0Mkg1Ny41NDhWNDkuOTM1eiIvPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJNNTUuMDA5LDgyLjI4OGMwLDEuMzQ2LTEuMDkxLDIuNDM3LTIuNDM3LDIuNDM3aC0yNy41NGMtMS4zNDYsMC0yLjQzNy0xLjA5MS0yLjQzNy0yLjQzN1YzMi4wODNjMC0xLjM0NiwxLjA5MS0yLjQzNywyLjQzNy0yLjQzN2gyNy41NGMxLjM0NiwwLDIuNDM3LDEuMDkxLDIuNDM3LDIuNDM3VjgyLjI4OHogTTUxLjkwMiwzMy4zMDFIMjUuNzAzdjQyLjc3MmgyNi4xOTlWMzMuMzAxek0zOC44MDIsNzguNzU0Yy0xLjE0NCwwLTIuMDcyLDAuOTI3LTIuMDcyLDIuMDcyczAuOTI3LDIuMDcyLDIuMDcyLDIuMDcyczIuMDcyLTAuOTI3LDIuMDcyLTIuMDcyUzM5Ljk0Nyw3OC43NTQsMzguODAyLDc4Ljc1NHoiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBkPSJNODYuMDc5LDI1Ljc1MmwtMy44NzUsMy42NWwtMi42LTkuNTg2bDEwLjE3NSwyLjUxOEw4Ni4wNzksMjUuNzUyYzcuMjAzLDguMzMxLDExLjU2LDE5LjE5LDExLjU2LDMxLjA2N2MwLDEwLjQyOC0zLjM1OCwyMC4wNzEtOS4wNTMsMjcuOTA3Ii8+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgb3BhY2l0eT0iLjUiIGQ9Ik03OC40MzMsMTguNjVjLTcuOTA5LTUuODc3LTE3LjcwNy05LjM1NS0yOC4zMTgtOS4zNTVjLTI2LjI0NywwLTQ3LjUyNCwyMS4yNzctNDcuNTI0LDQ3LjUyNGMwLDEwLjQyNywzLjM1OCwyMC4wNyw5LjA1MiwyNy45MDYiLz48L3N2Zz4=) center center no-repeat #05031b">请使用竖屏浏览</div>').appendTo('body')
		if(window.orientation==90||window.orientation==-90){covert.show()}
		window.addEventListener("orientationchange",function(){if(window.orientation==90||window.orientation==-90){covert.show()}else if(window.orientation==0||window.orientation==180){covert.hide()}},false);
	},

	//loading
	loader: function(fn) {
		var overflow = $("#loader-overflow"), percent = $("#loader-complete"), li = $("img[data-src]"), complete = 0;
		li.each(function() {
			$(this).attr("src", $(this).attr("data-src")).bind("load error", function() {
				complete++,percent.text(parseInt(complete*100/li.length)),
				complete == li.length && setTimeout(function() {
					overflow.remove();
					li.unbind("load error");	
					if(fn)fn()
				}, 500)
			})
		})
	},
};
//微信分享到
var weixin = {
	//关注
	attention: function(fn){
		var attention;
		$.ajax({
			cache:false,
			async:false,
			type: 'post',
			dataType: 'json',
			url: "../api/WXUserInfor/JudgeConcerned",
			data: {
				PARAM_weixinAccount: "taochew",
				PARAM_OpenId: this.user.openid
			},
			success: function(_d) {
				attention=_d.Data.IsConcerned!=1?fn?fn(_d):true:false
			}
		});

		return attention
	},

	//微信分享
	share: function(shareData) {
		$.ajax({
			cache:false,
			async:false,
			type: 'post',
			dataType: 'json',
			url: "../api/WXUserInfor/GetSignature",
			data: {
				PARAM_weixinAccount: "taochew",
				PARAM_PageUrl:location.href.split('#')[0]
			},
			success: function(data) {
				if(data.status==1){
					var signature = data.Data.Signature.split("|");
					wx.config({
						appId: 'wx0ee6bc40f9bec4ed',
						signature: signature[0],
						timestamp: signature[1],
						nonceStr: 'PbDwGEEc58uPL559',
						jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo']
					});
					wx.ready(function() {
						wx.onMenuShareTimeline(shareData);
						wx.onMenuShareAppMessage(shareData);
						wx.onMenuShareQQ(shareData);
						wx.onMenuShareWeibo(shareData);
					})
				}
			}
		});
	},

	//用户个人信息
	user: null,

	getUserInfo: function(code, fn) {
		var _this = this
		$.ajax({
			type: 'post',
			async:false,
			cache:false,
			url: "../api/WXUserInfor/GetUserOpenId",
			data: {
				PARAM_Code: code,
				PARAM_ZtName: document.title,
				PARAM_ZtCode: _this.ZTCode
			},
			dataType: 'json',
			success: function (_d) {
				if(_d.status==1){
					_this.user={
						openid: _d.Data.openid,
						nickname: _d.Data.nickname,
						sex: _d.Data.sex,
						city: _d.Data.city,
						country: _d.Data.country,
						province: _d.Data.province,
						avatar: _d.Data.headimgurl,
						IP: _d.Data.IPAddress
					}
					if(fn){fn(_this.user)}
				}else{
					window.location=_this.authorize
				}
			}
		})
	},

	//构造一个微信分享层
	mask: function(){
		var mask = $('#_weixin_share_mask');
		if(!mask.length) {
			mask = $('<div id="_weixin_share_mask" style="display:none;font-size:22px;text-align:center;color:white;padding-top:160px;z-index:999;position:fixed;top:0;left:0;width:100%;height:100%;background:right top no-repeat rgba(0,0,0,.8) url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNTAgMTUwIiB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCI+PHBhdGggc3Ryb2tlLWRhc2hhcnJheT0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNMCwxNTBjMCwwLDIzLjcwNi04MS4xMTcsODEuMTU4LTY3LjcyMWMyOS4zODQsNi44NTItMjQuMjUxLDM2LjYzMi0xMy40MzctMi4xNUM4MC40OTIsMzQuMzMxLDk0LjA1NywyMi42MiwxMjAuOTMsMTAuNzk2Ii8+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMTkuMjUsNy41NDZsNi44NzUsMC42MjVsLTMuODc1LDUuODc1TDExOS4yNSw3LjU0NnoiLz48L3N2Zz4=)">分享到朋友圈！</div>');
			mask.appendTo('body');
			mask.bind("click",function(){$(this).hide()})
		}
		mask.show()
	}
};

//微信分享到
weixin.share({
	title: '易鑫集团 全新发布',
	desc: '一站式互联网汽车交易平台',
	link: 'http://zt.taoche.com/zt/20170709/',
	imgUrl: 'http://zt.taoche.com/zt/20170709/static/images/00.jpg',
});

//loading
window.onload = ui.loader(ui.init);