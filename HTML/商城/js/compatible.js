// JavaScript Document
$(function(){
	/*手机检测开始*/
	var utilityJs = {
	    that: this,
	    isMobile: function () {
	        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"),
	        userAgentInfo = navigator.userAgent, con = false;
	        for (var v = 0; v < Agents.length; v++) { if (userAgentInfo.indexOf(Agents[v]) > 0) { con = true; break; } }
	        return con;
	    }
	};
	var clickEventName = {
	    touchstart: (utilityJs.isMobile() && ('ontouchstart' in document)) ? 'touchstart' : 'click',
	    touchend: (utilityJs.isMobile() && ('ontouchstart' in document)) ? 'touchend' : 'click'
	}
	/*手机检测结束*/
	/*$(document).on(clickEventName["touchend"], '.option_list li', function() {*/	
		
})

