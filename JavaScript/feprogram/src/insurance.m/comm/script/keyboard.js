import '../css/keyBoard.scss';
;(function(exports){
	var KeyBoard = function(input, options){
		var KeyBoardMain = {
			init:function(){
				KeyBoardMain.setData();
				KeyBoardMain.addEvent();
			},
			setData:function(){
				var body = document.getElementsByTagName('body')[0];
				var DIV_ID = options && options.divId || 'keyBoardBox';

				if(document.getElementById(DIV_ID)){
					body.removeChild(document.getElementById(DIV_ID));
				}else{comm.setCookie('CaretPos',0)}
				KeyBoardMain.input = input;
				KeyBoardMain.el = document.createElement('div');
				// KeyBoardMain.self = KeyBoardMain;
				KeyBoardMain.zIndex = options && options.zIndex || 99999;
				KeyBoardMain.width = options && options.width || '10rem';
				KeyBoardMain.height = options && options.height || '7.04rem';
				// var fontSize = options && options.fontSize || '15px';
				KeyBoardMain.backgroundColor = options && options.backgroundColor || '#fff';
				KeyBoardMain.TABLE_ID = options && options.table_id || 'table_0909099';
				KeyBoardMain.mobile = typeof orientation !== 'undefined';
				KeyBoardMain.callback = options && options.callback || false;
				KeyBoardMain.initText = options && options.initText || false;
				KeyBoardMain.el.id = DIV_ID;
				KeyBoardMain.el.style.position = 'fixed';
				KeyBoardMain.el.style.left = 0;
				KeyBoardMain.el.style.right = 0;
				KeyBoardMain.el.style.bottom = 0;
				KeyBoardMain.el.style.zIndex = KeyBoardMain.zIndex;
				KeyBoardMain.el.style.width = KeyBoardMain.width;
				KeyBoardMain.el.style.height = KeyBoardMain.height;
				KeyBoardMain.el.style.backgroundColor = KeyBoardMain.backgroundColor;
				KeyBoardMain.el.style.margin = '0 auto';
				KeyBoardMain.CaretPos = false;
				KeyBoardMain.isInput = (KeyBoardMain.input.tagName == 'INPUT');
				$(KeyBoardMain.el).addClass('keyBoardBox fontSize_28');
				$(KeyBoardMain.input).next('.cursor-blink').removeClass('hide');
				if($(KeyBoardMain.input).css('text-align') == 'left'){
					$(KeyBoardMain.input).next('.cursor-blink').css({left: '3.013333rem'})
				}else{
					$(KeyBoardMain.input).next('.cursor-blink').css({right: '0.4rem',left:'inherit'})
				}
			},
			addEvent:function(){
				var self = KeyBoardMain;
				KeyBoardMain.setDom();
				document.getElementsByTagName('body')[0].appendChild(KeyBoardMain.el);
				if(self.mobile){
					self.el.ontouchstart = KeyBoardMain.clickKeyBoard;
					// self.el.ondblclick  = KeyBoardMain.dblclickKeyBoard;
				}else{
					self.el.onclick = KeyBoardMain.clickKeyBoard;
					// self.el.ondblclick  = KeyBoardMain.dblclickKeyBoard;
				}
				// $('body').delegate(self.el,"touchmove",function(e){
			 //    　　e.preventDefault();
			 //    });
				$(self.input).click(function(e){
					// $(this).removeAttr('readonly')
					var valueLen = self.isInput?self.input.value: self.input.innerText;
					var valueW = $(self.input).css('font-size').replace('px','')/2;
					var left = positionObj(e,$(self.input)).left;
					if($(KeyBoardMain.input).css('text-align') == 'right'){
						left =$(KeyBoardMain.input).width() - positionObj(e,$(self.input)).left -$(KeyBoardMain.input).parents('ul').find('li.nobg a').css('margin-right').replace('px','');
					}
					var CaretPos2 = parseInt(left/valueW);
					if(CaretPos2 > valueLen.length){
						CaretPos2 = valueLen.length;
					}
					if(valueLen == KeyBoardMain.initText){
						CaretPos2=0;
					}
					if($(KeyBoardMain.input).parent().hasClass('box')){

						if($(KeyBoardMain.input).css('text-align') == 'left'){
							$(KeyBoardMain.input).next('.cursor-blink').css('left',Number(Compute(valueLen.substring(0,CaretPos2)).w)+Number($(KeyBoardMain.input).css('padding-left').replace('px','')));
						}else{
							$(KeyBoardMain.input).next('.cursor-blink').css({'right':Number(Compute(valueLen.substring(CaretPos2)).w)+Number($(KeyBoardMain.input).parents('ul').find('li.nobg a').css('padding-right').replace('px','')),'left':'inherit'});
						}
					}else{
						if($(KeyBoardMain.input).css('text-align') == 'left'){
							$(KeyBoardMain.input).next('.cursor-blink').css('left',Number(Compute(valueLen.substring(0,CaretPos2)).w)+Number($('.fromList li.nobg a').css('padding-left').replace('px','')));
						}else{
							$(KeyBoardMain.input).next('.cursor-blink').css({'right':Number(Compute(valueLen.substring(0,CaretPos2)).w)+Number($(KeyBoardMain.input).parents('ul').find('li.nobg a').css('padding-right').replace('px','')),'left':'inherit'});
						}
					}
					setCaretPosition(CaretPos2);
					KeyBoardMain.CaretPos = CaretPos2;
					comm.setCookie('CaretPos',CaretPos2);
				});
				$(document).click(function (event) {
					event.stopPropagation();
					event.preventDefault();
					if (!$(event.target).isChildAndSelfOf(self.el) && !$(event.target).isChildAndSelfOf(self.input) && $('body').find($(self.el)).length==1) {
						var initH = Number($('body').css('padding-bottom').replace('px',''));
						var addScrollTop = Number($(window).scrollTop()) + initH;
						var removeScrollTop = Number($(window).scrollTop()) - initH;
						var val = self.isInput?self.input.value: self.input.innerText;
						comm.setCookie('CaretPos',0);
		                document.getElementsByTagName('body')[0].removeChild(self.el);
		                window.scrollTo(0,removeScrollTop);
		                $('body').css('padding-bottom','0');
		                $(KeyBoardMain.input).next('.cursor-blink').addClass('hide');
		                KeyBoardMain.callback({val:val,isHidden:true});
		                return false;
		            }
				});

				if($('body').css('padding-bottom').replace('px','')!=0){
					var initH = Number($('body').css('padding-bottom').replace('px',''));
					var addScrollTop = Number($(window).scrollTop()) + initH;
					var removeScrollTop = Number($(window).scrollTop()) - initH;
					window.scrollTo(0,addScrollTop);
				}
			},
			dblclickKeyBoard:function(e){
		        e.preventDefault();
		        return false;
			},
			setDom:function(){
				if($('body').css('padding-bottom').replace('px','')==0){$('body').css({'padding-bottom':'7.466667rem'});}
				//Button
				var btnStr = '<div class="keybrandTitle fontSize_16">完成</div>';
				//table
				var tableStr = '<table id="' + KeyBoardMain.TABLE_ID + '" class="" border="0" cellspacing="0" cellpadding="0">';
					tableStr += '<tr><td>1</td><td>2</td><td>3</td></tr>';
					tableStr += '<tr><td>4</td><td>5</td><td>6</td></tr>';
					tableStr += '<tr><td>7</td><td>8</td><td>9</td></tr>';
					tableStr += '<tr><td class="gray fontSize_20">字母X</td><td>0</td>';
					tableStr += '<td class="remove gray"></td></tr>';
					tableStr += '</table>';
				KeyBoardMain.el.innerHTML = btnStr + tableStr;
			},
			clickKeyBoard:function(e){
				// e.stopPropagation();
				e.preventDefault();
				// alert( '事件类型：'+e.type);
				var self = KeyBoardMain;
				var ev = e || window.event;
				var clickEl = ev.element || ev.target;
				var value = clickEl.textContent || clickEl.innerText;
				var fontWidth = Number($(self.input).css('fontSize').replace('px',''));
				var val = self.isInput?self.input.value: self.input.innerText;
				if(val == KeyBoardMain.initText){
					val='';
				}
				if(clickEl.tagName.toLocaleLowerCase() === 'td' && !$(clickEl).hasClass('remove')){
					if(val.length >= 18){
						return false;
					}
					if(self.input){
						var newVal = '';
						if(comm.getCookie('CaretPos')){
							var CaretPos1 = comm.getCookie('CaretPos');
						}else{
							var CaretPos1 = getCursortPosition(self.input);
						}
						if(val.length == CaretPos1){
							value == '字母X'?newVal=val+='X':newVal=val+=value;
						}else{
							value == '字母X'?newVal= val.substring(0, CaretPos1)+'X'+val.substring(CaretPos1):newVal= val.substring(0, CaretPos1)+value+val.substring(CaretPos1);
						}
						// self.isInput?self.input.value = newVal: self.input.innerText = newVal;
						if($(KeyBoardMain.input).parent().hasClass('box')){
							if($(KeyBoardMain.input).css('text-align') == 'left'){
								$(KeyBoardMain.input).next('.cursor-blink').css('left',Number(Compute(newVal.substring(0,Number(CaretPos1)+1)).w)+Number($(KeyBoardMain.input).css('padding-left').replace('px','')));
							}else{
								$(KeyBoardMain.input).next('.cursor-blink').css({'right':Number(Compute(newVal.substring(Number(CaretPos1)+1)).w)+Number($(KeyBoardMain.input).parents('ul').find('li.nobg a').css('padding-right').replace('px','')),'left':'inherit'});
							}
						}else{
							if($(KeyBoardMain.input).css('text-align') == 'left'){
								$(KeyBoardMain.input).next('.cursor-blink').css('left',Number(Compute(newVal.substring(0,Number(CaretPos1)+1)).w)+Number($('.fromList li.nobg a').css('padding-left').replace('px','')));
							}else{
								$(KeyBoardMain.input).next('.cursor-blink').css({'right':Number(Compute(newVal.substring(Number(CaretPos1)+1)).w)+Number($(KeyBoardMain.input).parents('ul').find('li.nobg a').css('padding-right').replace('px','')),'left':'inherit'});
							}
						}
						KeyBoardMain.callback({val:newVal,dom:self.input,isHidden:false});
						setCaretPosition(self.input,CaretPos1);
						var newCaretPos = Number(CaretPos1)+1;
						comm.setCookie('CaretPos',newCaretPos);
					}
				}else if(clickEl.tagName.toLocaleLowerCase() === 'div' && value === "完成"){
					var initH = Number($('body').css('padding-bottom').replace('px',''));
					var addScrollTop = Number($(window).scrollTop()) + initH;
					var removeScrollTop = Number($(window).scrollTop()) - initH;
					document.getElementsByTagName('body')[0].removeChild(self.el);
					$(window).scrollTop(removeScrollTop);
	                $('body').css('padding-bottom','0');
	                $(KeyBoardMain.input).next('.cursor-blink').addClass('hide');
	                KeyBoardMain.callback({val:val,isHidden:true});
	                return false;
	                comm.setCookie('CaretPos',0);
				}else if(clickEl.tagName.toLocaleLowerCase() === 'td' && $(clickEl).hasClass('remove')){
					if($(KeyBoardMain.input).css('text-align') == 'left'){
						if(val.length==0){return false;KeyBoardMain.callback({val:val,isHidden:true});}
					}
					if(comm.getCookie('CaretPos')){
						var CaretPos1 = comm.getCookie('CaretPos');
					}else{
						var CaretPos1 = getCursortPosition(self.input);
					}
					if(val){
						var newNum = val.substring(0, CaretPos1 - 1)+val.substring(CaretPos1);
						if($(KeyBoardMain.input).css('text-align') == 'right'){
							if(CaretPos1 == 0 || CaretPos1 < 0 || CaretPos1 == val.length){
								var newNum = val.substring(0,val.length - 1);
							}else{
								var newNum = val.substring(0, (val.length - Number(CaretPos1)-1))+val.substring((val.length- Number(CaretPos1)));
							}
						}
					}
					if($(KeyBoardMain.input).parent().hasClass('box')){
						if($(KeyBoardMain.input).css('text-align') == 'left'){
							$(KeyBoardMain.input).next('.cursor-blink').css('left',Number(Compute(newNum.substring(0,CaretPos1-1)).w)+Number($(KeyBoardMain.input).css('padding-left').replace('px','')));
						}else{
							$(KeyBoardMain.input).next('.cursor-blink').css({'right':Number(Compute(newNum.substring(CaretPos1-1)).w)+Number($(KeyBoardMain.input).parents('ul').find('li.nobg a').css('padding-right').replace('px','')),'left':'inherit'});
						}
					}else{
						if($(KeyBoardMain.input).css('text-align') == 'left'){
							$(KeyBoardMain.input).next('.cursor-blink').css('left',Number(Compute(newNum.substring(0,CaretPos1-1)).w)+Number($('.fromList li.nobg a').css('padding-left').replace('px','')));
						}else{
							if(val.length==CaretPos1 || CaretPos1<0){
								$(KeyBoardMain.input).next('.cursor-blink').css({'right':Number($(KeyBoardMain.input).parents('ul').find('li.nobg a').css('padding-right').replace('px','')),'left':'inherit'});
							}else{
								$(KeyBoardMain.input).next('.cursor-blink').css({'right':Number(Compute(newNum.substring(0,CaretPos1)).w)+Number($(KeyBoardMain.input).parents('ul').find('li.nobg a').css('padding-right').replace('px','')),'left':'inherit'});
							}
						}
					}
					KeyBoardMain.callback({val:newNum,dom:self.input,isHidden:false});
					setCaretPosition(self.input,CaretPos1-1);
					var newCaretPos = Number(CaretPos1)-1;
					comm.setCookie('CaretPos',newCaretPos);
				}
			}
		};
		KeyBoardMain.init();
	};
	exports.KeyBoard = KeyBoard;
	function getCursortPosition (ctrl) {
	    var CaretPos = 0;   // IE Support
	    if (document.selection) {
	    	ctrl.focus ();
	        var Sel = document.selection.createRange ();
	        Sel.moveStart ('character', -ctrl.value.length);
	        CaretPos = Sel.text.length;
	    }
	    // Firefox support
	    else if (ctrl.selectionStart || ctrl.selectionStart == '0')
	        CaretPos = ctrl.selectionStart;
	    return (CaretPos);
	}
	function setCaretPosition(ctrl, pos) {
	    if (ctrl.setSelectionRange) {
	        ctrl.focus();
	        ctrl.setSelectionRange(pos, pos);
	    }
	    else if (ctrl.createTextRange) {
	        var range = ctrl.createTextRange();
	        range.collapse(true);
	        range.moveEnd('character', pos);
	        range.moveStart('character', pos);
	        range.select();
	    }
	}
	function Compute(v) {
		var d = document.getElementById('dvCompute');
		d.innerHTML = v;
		return { w: d.offsetWidth, h: d.offsetHeight };
	}
	//当需求为获得的坐标值相对于某一对象时，用：
	function positionObj(event,dom){
	    //获得对象相对于页面的横坐标值；id为对象的id
	    var thisX = dom.offset().left;

	    //获得对象相对于页面的横坐标值；
	    var thisY = dom.offset().top;

	    //获得页面滚动的距离；
	    //注：document.documentElement.scrollTop为支持非谷歌内核；document.body.scrollTop为谷歌内核
	    var thisScrollTop = document.documentElement.scrollTop + document.body.scrollTop;

	    event = event||window.event;
	    //获得相对于对象定位的横标值 = 鼠标当前相对页面的横坐标值 - 对象横坐标值；
	    var x = event.clientX - thisX;

	    //获得相对于对象定位的纵标值 = 鼠标当前相对页面的纵坐标值 - 对象纵坐标值 + 滚动条滚动的高度；
	    var y = event.clientY - thisY + thisScrollTop;
	    return {left:x,top:y}

	}
})(window);