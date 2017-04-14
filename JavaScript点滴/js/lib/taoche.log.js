/*
 * Error自动采集日志,不需要手动调用，会自动捕获错误，上传到服务器
 */
window.onerror = function(msg, url, row, col, error) {

	var parameters = {
		msg: msg,
		url: url,
		row: row,
		col: col,
		error: !!error.stack ? error.stack : ''
	};
	console.log(parameters);
	sendData({
		postData: parameters,
		url: 'http://www.demo.com/handler/logerror.ashx'
	});
};


/*
 * 公共发送错误日志的方法
 */
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

	var xhr = new XMLHttpRequest();
	xhr.open("POST", options.url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		var XMLHttpReq = xhr;
		if(XMLHttpReq.readyState == 4) {
			if(XMLHttpReq.status == 200) {
				var text = XMLHttpReq.responseText;
				console.log(text);
			}
		}
	};
	xhr.send(postData);
}

(function(window) {
	//默认配置
	var postData = {
		msg: '',
		host: '',
		time: ''
	};
	//调用写日志方法
	var log = function(msg) {
		postData.msg = !!msg ? 'no msg' : encodeURIComponent(msg);
		postData.url = window.location.href; //当前页面
		sendData({
			postData: postData,
			url: 'http://www.demo.com/handler/logerror.ashx'
		});
	};
	window.Taoche = !!window.Taoche ? window.Taoche : {};
	window.Taoche.log = log;
})(window);