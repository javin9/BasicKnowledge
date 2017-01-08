var EventUtils = {
	on: function(obj, eventname, fn, b) {
		/*
		 注册事件：
		 obj：dom对象
		 eventname:事件名称
		 fn:指定要事件触发时执行的函数
		 * */
		var b = !!b;
		(obj.addEventListener) ? obj.addEventListener(eventname, fn, b): obj.attachEvent("on" + eventname, fn);
	},
	remove: function(obj, eventname, fn) {
		/*
		 移除事件
		  obj：dom对象
		 eventname:事件名称
		 fn:指定要事件触发时执行的函数
		 */
		(obj.removeEventListener) ? obj.removeEventListener(eventname, fn, false): obj.detachEvent("on" + eventname, fn);
	},
	target: function(e) {
		return e.target || e.srcElement;
	},
	event: function(e) {
		//事件兼容
		return e ? e : window.event;
	},
	cancelAction: function(e) {
		//阻止默认时间
		(e.preventDefault) ? e.preventDefault(): e.returnValue = false;
	},
	stopBub: function(e) {
		//阻止冒泡
		(e.stopPropagation) ? e.stopPropagation(): e.cancelBubble = true;
	}
};
/*
 class操作
 */
function hasClass(elem, cls) {
	cls = cls || '';
	if(cls.replace(/\s/g, '').length == 0) return false;
	var re = new RegExp('\\b' + c + '\\b', 'i');
	return re.test(o.className);
}

function addClass(elem, cls) {
	if(hasClass(elem, cls)) {
		return;
	}
	elem.className = (elem.className === '') ? cls : elem.className + ' ' + cls
}

function removeClass(elem, cls) {
	if(hasClass(elem, cls)) {
		var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
		while(newClass.indexOf(' ' + cls + ' ') >= 0) {
			newClass = newClass.replace(' ' + cls + ' ', ' ');
		}
		elem.className = newClass.replace(/^\s+|\s+$/g, '');
	}
}

function  isParents(o, p) {
	while(o != undefined && o != null && o.nodeName != "BODY") {
		o = o.parentNode;
		if(o == p) {
			return true;
		}
	}
	return false;
}