$(function() {
	window.onerror = function(msg, url, row, col, error) {
		var postData = {
			msg: msg,
			url: url,
			row: row,
			col: col,
			error: error
		};

		console.log(postData);
		postData = (function(obj) { // 转成post需要的字符串.
			var str = "";
			for(var item in obj) {
				str += item;
				str += "=";
				str += obj[item];
				str += "&";
				//str += prop + "=" + obj[item] + "&"
			}
			return str;
		})(postData);
		console.log(postData);
		//		$.ajax({
		//		type: 'post',
		//		url: 'http://www.demo.com/handler/logerror.ashx',
		//		data: {
		//			msg: msg,
		//			url: url,
		//			row: row,
		//			col: col,
		//			error: error
		//		},
		//		success: function(data) {
		//			console.log(data);
		//		}
		//	});

		var xhr = new XMLHttpRequest();

		xhr.open("POST", "http://www.demo.com/handler/logerror.ashx", true);
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
		return true;
	};

	window.onload = function() {
		a = a + b;
		var c = a + d;
		console.log('jie');
		a / 0;
	};

})