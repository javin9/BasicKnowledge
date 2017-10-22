var Main = {
	nameRexp: new RegExp(/^[\u4e00-\u9fa5]{2,8}$/),//名字2-8位汉字
	isIE8: navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/8./i)=="8.",
	isIE9: navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i)=="9.",
	/**
	 *全局处理ajax
	 *@param Object opt  传入ajax对象参数
	*/
	ajaxUrl: {},
		$ajax: function(opt) {
		if (Main.ajaxUrl[opt.url]) {
			return false;
		}
		Main.ajaxUrl[opt.url] = true;
		opt.cache = true;
		opt.dataType = opt.dataType?opt.dataType:"json";
		opt.type = opt.type?opt.type:"POST";
		opt.error = function(XMLHttpRequest, textStatus) {
			var status = XMLHttpRequest.status;
			if (status == 0)
				return;
			else if (status == 500)
				alert("服务器错误");
			else if (status == 404)
				alert("请求没有找到");
		};
		opt.goSuccess = opt.success;
		opt.success = function(res) {
			if (opt.goSuccess)
				opt.goSuccess(res);
		}
		opt.complete = function() {
			delete Main.ajaxUrl[opt.url];
		}
		$.ajax(opt);
	},
	/**
	 *校验11位手机号
	 *@param int phone  int类型手机号
	*/
	checkPhone: function(phone) {
	    var phoneRexp = new RegExp(/^1[3|4|5|7|8][0-9]{9}$/);
	    if (!phoneRexp.test(phone) || phone == "")
	        return false;
	    return true;
	},
	/**
	 *截取url参数值
	 *@param String name  传入要截取的参数名
	*/
	getQueryString: function(name) { 
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null)
	        return unescape(r[2]);
	    return null;
	},
	/**
	 *模拟睡眠
	 *@param int numberMillis  传入毫秒值
	*/
	sleep: function(numberMillis) {
	　　var now = new Date();
	　　var exitTime = now.getTime() + numberMillis;
	　　while (true) {
	    　　now = new Date();
	    　　if (now.getTime() > exitTime)
	    　　    return;
	　　}
	}
}

module.exports = Main;
/*
*最近申请滚动插件，用法： 
*$('id').marquee();
*/
(function($){
	$.fn.marquee = function(options){
		var defaults = {
			id: $(this).attr("id"),
			direction: "up"
		}
		var ops = $.extend(defaults,options);
		var obj = $("#" + ops.id)[0],
			obj1 = $("#" + ops.id + "_1")[0],
			obj2 = $("#" + ops.id + "_2")[0];

		var marqueeStart = function(direction){
			if (direction == "up"){
				if (obj2.offsetTop - obj.scrollTop <= 0)
					obj.scrollTop -= obj1.offsetHeight;
				else{
					var tmp = obj.scrollTop;
					obj.scrollTop++;
					if (obj.scrollTop == tmp)
						obj.scrollTop = 1;
				}
			}else{
				if (obj2.offsetWidth - obj.scrollLeft <= 0)
					obj.scrollLeft -= obj1.offsetWidth;
				else
					obj.scrollLeft++;
			}
		}

		obj2.innerHTML = obj1.innerHTML;
		var marqueeVar = window.setInterval(function(){
			marqueeStart(ops.direction);
		}, 80);
		obj.onmouseover = function(){
			window.clearInterval(marqueeVar);
		}
		obj.onmouseout = function(){
			marqueeVar = window.setInterval(function(){
				marqueeStart(ops.direction);
			}, 80);
		}	
	}
}(jQuery));
/*
*数字滚动插件，用法： 
*$('div').aniNumber({number: 12345678});
*/ 
(function ($) {
      if (!document.defaultView || !document.defaultView.getComputedStyle) {
          var oldCurCSS = jQuery.css;
          jQuery.css = function (elem, name, force) {
              if (name === 'background-position') {
                  name = 'backgroundPosition';
              }
              if (name !== 'backgroundPosition' || !elem.currentStyle || elem.currentStyle[name]) {
                  return oldCurCSS.apply(this, arguments);
              }
              var style = elem.style;
              if (!force && style && style[name]) {
                  return style[name];
              }
              return oldCurCSS(elem, 'backgroundPositionX', force) + ' ' + oldCurCSS(elem, 'backgroundPositionY', force);
          };
      }

      var oldAnim = $.fn.animate;
      $.fn.animate = function (prop) {
          if ('background-position' in prop) {
              prop.backgroundPosition = prop['background-position'];
              delete prop['background-position'];
          }
          if ('backgroundPosition' in prop) {
              prop.backgroundPosition = '(' + prop.backgroundPosition + ')';
          }
          return oldAnim.apply(this, arguments);
      };

      function toArray(strg) {
          strg = strg.replace(/left|top/g, '0px');
          strg = strg.replace(/right|bottom/g, '100%');
          strg = strg.replace(/([0-9\.]+)(\s|\)|$)/g, "$1px$2");
          var res = strg.match(/(-?[0-9\.]+)(px|\%|em|pt)\s(-?[0-9\.]+)(px|\%|em|pt)/);
          return res&&[parseFloat(res[1], 10), res[2], parseFloat(res[3], 10), res[4]];
      }

      $.fx.step.backgroundPosition = function (fx) {
          if (!fx.bgPosReady) {
              var start = $.css(fx.elem, 'backgroundPosition');

              if (!start) {//FF2 no inline-style fallback
                  start = '0px 0px';
              }

              start = toArray(start);
              fx.start = [start[0], start[2]];

              var end = toArray(fx.end);
              fx.end = [end[0], end[2]];

              fx.unit = [end[1], end[3]];
              fx.bgPosReady = true;
          }

          var nowPosX = [];
          nowPosX[0] = ((fx.end[0] - fx.start[0]) * fx.pos) + fx.start[0] + fx.unit[0];
          nowPosX[1] = ((fx.end[1] - fx.start[1]) * fx.pos) + fx.start[1] + fx.unit[1];
          fx.elem.style.backgroundPosition = nowPosX[0] + ' ' + nowPosX[1];
      };
      $.fn.aniNumber = function(options){
      	var id = $(this).attr("id");
      	var defaults = {
      		number: (new Date().getTime()+"").substring(7),
      		itemHeight:30
      	}
      	var ops = $.extend(defaults,options);
      	
      	var n = ops.number,
      		it = $("#" + id + " i"),
	    	len = String(n).length; 
	    for(var i=0;i<len;i++){ 
	        if(it.length<=i){ 
	            $("#" + id).append("<i></i>"); 
	        } 
	        var num = (n+"").charAt(i),
	        	y = -parseInt(num)*ops.itemHeight, //y轴位置 
	        	obj = $("#" + id + " i").eq(i); 
	        obj.animate({ //滚动动画 
	            backgroundPosition :'(0 '+ y +'px)'  
	            }, 'slow','swing',function(){} 
	        ); 
	    } 
      }
  })(jQuery);

  /*
*选项卡tab切换插件，用法： 
* new Tabs({
*	tabsId:"modular_2_tabs",//tabs  ID
*	consId:"modular_2_sins" //cons  ID
* });
*/
  ;(function(window,$,undefined){
	var defaults = {
		tabsId: "tabs",//tab容器ID
		consId: "cons"//内容ID
	}
	var Tabs = function(jsonData){
		var _this = this;

		this.data = $.extend(defaults,jsonData);
		this.scroll = null;

		if(this.data.tabsId)
			this.tabsId = this.data.tabsId;
		else
			return console.log("请填写选项tab ID");
		if(this.data.consId)
			this.consId = this.data.consId;
		else
			return console.log("请填写内容con ID");

		this.domInit();
		this.eventInit();
	}
	Tabs.prototype = {
		domInit: function(){
			$("#" + this.tabsId + ">div:eq(" + 0 + ")").addClass("stab active").siblings().addClass("stab");
			$("#" + this.consId + ">div:eq(" + 0 + ")").addClass("scon active").siblings().addClass("scon");
		},
		eventInit: function(){
			var _this = this;
			$(".scon.active").animate({"top":0},600,"swing");
			if ($("#" + _this.tabsId + ">div").length<2)return;
			$("body").on("mousedown","#" + _this.tabsId + ">div",function(){
				var $con = $("#" + _this.consId),i = $(this).index();
				$(this).addClass("active").siblings().removeClass("active");
				$con.children("div:eq(" + i + ")").css("top","-100%").addClass("active").stop().animate({"top":"0"},600,"swing",function(){
					 $con.children("div:eq(" + i + ")").siblings().removeClass("active").css("top", "-100%");
				}).siblings().removeClass("active");
			});
		}
	}
	window.Tabs = Tabs;
})(window,$);
/*
*汽车图片小幅移动插件，用法： 
* $("div").leftMove();
*
*/	
;(function($){
	$.fn.leftMove = function(options){
		var defaults = {
			time: 300,  //时间
			distance: 20  //位移距离  单位：px
		}
		var ops = $.extend(defaults,options);

		var time = parseInt(ops.time),
		oldDistance = parseInt($(this).css("margin-left").split("px")[0])||0,
		distance = oldDistance - parseInt(ops.distance);

		$(this).on("mouseover",function(){
			$(this).stop().animate({"margin-left": distance + "px"},time);
		})
		.on("mouseout",function(){
			$(this).stop().animate({"margin-left": oldDistance + "px"},time);
		});
	}
})(jQuery);
/*
* button  hover从下至上效果，用法： 
* $("div").btnHover(200);
*
*/	
;(function($){
	$.fn.btnHover = function(options){
		var _this = this;
		var defaults = {
			animate: "bottomUp",
			color: "#fc654d",
			time: 300
		}
		var ops = $.extend(defaults, options);
		var $mask = $('<i class="mask"></i>');

		$(_this).append($mask);

		$(_this).on("mouseover", function(){
			$(this).css("color", "#fff").find(".mask").stop().animate({"height": "100%"}, ops.time);
		}).on("mouseout", function(){
			$(this).css("color", ops.color).find(".mask").stop().animate({"height": "0"}, ops.time);
		});
	};
})(jQuery);