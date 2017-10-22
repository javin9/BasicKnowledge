!function(){
		//获取URL中的参数
        function getUrlParam(name){
            // 转换为小写
            var lowerName = name,
                lowerSearch = window.location.search.substr(1);
            //构造一个含有目标参数的正则表达式对象
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            //匹配目标参数
            var r = lowerSearch.match(reg);
            //返回参数值
            if (r!=null) return unescape(r[2]);
            return null;
        }

        //读取cookies
        function getCookie(name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)){
                return unescape(arr[2]);
            }
            else{
                return null;
            }
        }
        
        var hideType = "",
        	hideTypeUrlParam = getUrlParam("hideType"),
        	_isHeaderHidden = getCookie("IsHeaderHidden"),
        	_isNavHidden = getCookie("IsNavHidden"),
        	_isAboutHidden = getCookie("IsAboutHidden"),
        	_isFooterHidden = getCookie("IsFooterHidden");
		if(hideTypeUrlParam){
			hideType = hideTypeUrlParam;
			var _hideCookiesScript = document.createElement("script");
                _hideCookiesScript.src = "http://www.daikuan.com/commonpage/HideCookies/index?type=" + hideType;
            var _script = document.getElementsByTagName("script")[0];
            _script.parentNode.insertBefore(_hideCookiesScript, _script);
            _isHeaderHidden = "False";
        	_isNavHidden = "False";
        	_isAboutHidden = "False";
        	_isFooterHidden = "False";
		}else if(_isHeaderHidden == "False" && _isNavHidden == "False" &&_isAboutHidden == "False" &&_isFooterHidden == "False"){
			return false;
		}


		var isHeaderHidden = false,
			isNavHidden = false,
			isFooterHidden = false,
			isAboutHidden = false;
		if ((hideType & 1) > 0 || _isHeaderHidden == "True") // 对应十进制1
	    {
	        isHeaderHidden = true;
	    }
	    if ((hideType & 2) > 0 || _isNavHidden == "True") // 对应十进制2
	    {
	        isNavHidden = true;
	    }
	    if ((hideType & 4) > 0 || _isFooterHidden == "True") // 对应十进制4
	    {
	        isFooterHidden = true;
	    }
	    if ((hideType & 8) > 0 || _isAboutHidden == "True") // 对应十进制8
	    {
	        isAboutHidden = true;
	    }

	    module.exports = {
	    	header: isHeaderHidden,
	    	nav: isNavHidden,
	    	about: isAboutHidden,
	    	footer: isFooterHidden
	    }
	}();