/*
 * Error自动采集日志,不需要手动调用，会自动捕获错误，上传到服务器
 */
window.onerror = function(msg, url, row, col, error) {
	console.log(error);
	var parameters = {
		msg: escape(msg),
		url: escape(url),
		row: row,
		col: col
	};
	console.log(parameters);
//	sendData({
//		postData: parameters,
//		url: 'http://ajax.taoche.cn/log/errorlog.ashx'
//	});
};

/*
 * 公共发送错误日志的方法
 */
function createXHR() {
	if(typeof XMLHttpRequest != "undefined") {
		return new XMLHttpRequest();
	} else if(typeof ActiveXObject != "undefined") {
		if(typeof arguments.callee.activeXString != "string") {
			var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
					"MSXML2.XMLHttp"
				],
				i, len;
			for(i = 0, len = versions.length; i < len; i++) {
				try {
					new ActiveXObject(versions[i]);
					arguments.callee.activeXString = versions[i];
					break;
				} catch(ex) {
					throw new Error("No ActiveXObject object available.");
				}
			}
		}
		return new ActiveXObject(arguments.callee.activeXString);
	} else {
		throw new Error("No XHR object available.");
	}
}

function sendData(options) {
	var postData = (function(obj) { // 转成post需要的字符串.
		var str = "";
		for(var item in obj) {
			str += item;
			str += "=";
			str += obj[item];
			str += "&";
		}
		return str;
	})(options.postData);

	var xhr = createXHR();
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
			if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
				//alert(xhr.responseText);
			} else {
				console.log("Request was unsuccessful: " + xhr.status);
			}
		}
	};
	xhr.open("POST", options.url, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(postData);

}

(function(window) {
	//默认配置
	var postData = {
		msg: ''
	};
	//调用写日志方法
	var log = function(msg) {
		postData.msg = !msg ? 'no msg' : escape(msg);
		postData.url = window.location.href; //当前页面
		sendData({
			postData: postData,
			url: 'http://ajax.taoche.cn/log/customlog.ashx'
		});
	};
	window.Taoche = !!window.Taoche ? window.Taoche : {};
	window.Taoche.log = log;
})(window);