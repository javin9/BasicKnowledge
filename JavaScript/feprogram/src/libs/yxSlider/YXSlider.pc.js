require('./nouislider.css');
require('./YXSlider.pc.scss');

import noUiSlider from './nouislider.js';
/*	使用方法，先new类传入参数1、dom ID 2、数据 3、回调函数
	var downPaymentSlider =  new YXSlider('downPayment',[
									{'text':20,'isDisable':false,'isDefault':true,'unit':'%'},
									{'text':30,'isDisable':false,'isDefault':false,'unit':'%'},
									{'text':40,'isDisable':false,'isDefault':false,'unit':'%'},
									{'text':50,'isDisable':true,'isDefault':false,'unit':'%'}
									],this.callback);
	new 完后至每次调用接口返回的数据在 update中更新
	downPaymentSlider.update([
								{'text':20,'isDisable':true,'isDefault':false},
								{'text':30,'isDisable':false,'isDefault':false},
								{'text':40,'isDisable':false,'isDefault':true},
								{'text':50,'isDisable':false,'isDefault':false}
								]);
	downPaymentSlider.setAttribute('disabled');//设置滑动是否可用，可以控制在接口没返回前禁止滑动，不传参数则解除禁止

	dom结构
	<div class="yx-silder-wrapper">
        <div id="downPayment"></div>
    </div>
*/
export default class YXSlider{

	constructor(ele,data=[],callback){
		this.callback = callback;
		this.ele = '';
		this.start = '';
		this.range = {
			min:0,
			max:100
		};
		//dom
		this.sliderPips = '';
		this.sliderUiBase = '';
		this.$noUiConnect = '';//滚轴
		this.$noUiOrigin ='';//滑块

		this.dataLength = data.length;
		this.dataArr = data;
		this.sliderPipsHtml = '';
		this.unit='';//单位
		//滑块数据
		this.sliderDataTextAllArr = [];
		this.sliderDataTextArr = [];
		this.itemSilderIndex;
		this.itemSilderDisableIndex =[];

		//滑块位置
		this.sliderPos = [];

		//ie8判断
		this.isIe8 = (navigator.appName=="Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "")=="MSIE8.0");

		if(ele && typeof ele == 'string' && data instanceof Array && this.dataLength>0){
			this.ele = document.getElementById(ele);
			this.nouisilderInit();	
		}else{
			console.error(`id==>${ele}==>请传入正确的参数,第一个参数应该是dom ID，第二个参数应该为数组
						[
							{
								"text":20,//必须为数字
								"isDisable":true,
								"isDefault":true,
								"unit":"%"
							},
							{
								"text":30,//必须为数字
								"isDisable":false,
								"isDefault":false,
								"unit":"期"
							}
						]，第三个参数是回调函数`);
		}
		

	}

	nouisilderInit(){
		if(this.isIe8){
			//绘制滚轴
			this.ele.className = "noUi-target noUi-ltr noUi-horizontal";

	        this.sliderUiBase = document.createElement('div');
			this.sliderUiBase.className = 'noUi-base';
			this.ele.appendChild(this.sliderUiBase);
			this.sliderUiBase.innerHTML = `<div class="noUi-connect" style="left: 0%"></div>
								     	<div class="noUi-origin">
								     		<div class="noUi-handle" data-handle="0" style="z-index: 4;"></div>
								     	</div>`;
			this.$noUiConnect = $(this.sliderUiBase).find('.noUi-connect');
			this.$noUiOrigin = $(this.sliderUiBase).find('.noUi-origin');
		}
		//初始化指针点
        this.sliderPips = document.createElement('ul');
		this.sliderPips.className = 'noUi-pips noUi-pips-horizontal';
		this.ele.appendChild(this.sliderPips);

		this.render();
		this.redraw();

		// console.log(this.range)
		if(!this.isIe8){
			noUiSlider.create(this.ele, {
	            start: this.start,
	            connect: [true, false],
	            range: this.range,
	            snap:true
	        });
		}
		
		this.unit = this.dataArr[0].unit;

        this.bindEvents();
	}

	bindEvents(){
		if(this.isIe8){
			$(this.ele).on('click', '.ie8-span', (event)=>{
				event.preventDefault();
				var $item = $(event.target),
					$itemParent = $item.parent();
				if(!$itemParent.hasClass('cur') && !$itemParent.hasClass('disable')){
					var itemParentIndex = $itemParent.index();
					this.callback(this.dataArr[itemParentIndex]);
					$itemParent.addClass('cur').siblings('li').removeClass('cur');
					this.itemSilderIndex = itemParentIndex;

					this.$noUiConnect.css({
						'right': (100-this.sliderPos[this.itemSilderIndex])+'%'
					});//滚轴

					this.$noUiOrigin.css({
						'left': this.sliderPos[this.itemSilderIndex] +'%'
					});//滑块
				}
			});
		}else{
			this.ele.noUiSlider.on('change', ( values, handle )=>{
			
				var itemIndex = this.sliderDataTextArr.indexOf(parseFloat(values[handle]));
				this.itemSilderIndex = this.sliderDataTextAllArr.indexOf(parseFloat(values[handle]))
				if(itemIndex<0){
					this.ele.noUiSlider.set(this.start);
				}else if(this.start != parseFloat(values[handle])){
					this.start = parseFloat(values[handle]);
					this.callback(this.dataArr[this.itemSilderIndex]);

					//修改标红项
					$(this.sliderPips).find('li').eq(this.itemSilderIndex).addClass('cur').siblings('li').removeClass('cur');
				}	
			});

			var $noUiPipsLi = $(this.ele).find('.noUi-pips li');
			
			$(this.ele).on('click', '.noUi-pips li', (event)=>{
                event.preventDefault();
                if(!$(event.currentTarget).hasClass('disable')){
                	this.itemSilderIndex = $(event.currentTarget).index();
	                $noUiPipsLi.removeClass('cur').eq(this.itemSilderIndex).addClass('cur');
	                this.ele.noUiSlider.set(this.dataArr[this.itemSilderIndex].text);
	                this.callback(this.dataArr[this.itemSilderIndex]);
                }
                
            });
		}
		

	}

	//重绘
	redraw(){
		this.sliderPips.innerHTML = this.sliderPipsHtml;
	}

	render(){
		this.range = {
			min:0,
			max:100
		};
		this.sliderPipsHtml = '';
		//重新初始化数据
		this.sliderDataTextArr = [];
		this.sliderDataTextAllArr =[];
		this.itemSilderDisableIndex =[];
		var spanClassName = '';
		if(this.isIe8){
			spanClassName = "ie8-span";
		}
		//判断数据数量
		if(this.dataLength == 1){
			var sliderPipsItemText ='';
			this.start = this.dataArr[0].text;
			this.range["50%"] = this.dataArr[0].text;
			if(this.dataArr[0].text==-1){
				this.range.min = -2;
				sliderPipsItemText = '不限';
			}else{
				sliderPipsItemText = this.dataArr[0].text + (this.dataArr[0].unit?this.dataArr[0].unit:this.unit);
			}
			this.sliderPipsHtml=`<li style="left:50%" class="cur">
								<span class="${spanClassName}">
								${sliderPipsItemText}
								</span>
							</li>`;
			this.sliderPos = [50];
			this.itemSilderIndex = 0;
		}else if(this.dataLength == 2){
			var sliderClassNameL = '',
				sliderClassNameR = '',
				sliderPipsItemTextL = '';
			if(this.dataArr[0].isDefault){
				this.start = this.dataArr[0].text;
				this.itemSilderIndex = 0;
				sliderClassNameL = 'cur';
				this.sliderPos.push(30);
			}else{
				this.start = this.dataArr[1].text;
				this.itemSilderIndex = 1;
				sliderClassNameR = 'cur';
				this.sliderPos.push(70);
			}

			if(this.dataArr[0].isDisable){
				sliderClassNameL = 'disable';
				this.itemSilderDisableIndex.push(0);
				this.range['70%'] = this.dataArr[1].text;
				this.sliderDataTextArr = [this.dataArr[1].text];
			}else if(this.dataArr[1].isDisable){
				sliderClassNameR = 'disable';
				this.itemSilderDisableIndex.push(1);
				this.range['30%'] = this.dataArr[0].text;
				this.sliderDataTextArr = [this.dataArr[0].text]
			}else{
				this.range['30%'] = this.dataArr[0].text;
            	this.range['70%'] = this.dataArr[1].text;
            	this.sliderDataTextArr = [this.dataArr[0].text,this.dataArr[1].text];
			}
			
			this.sliderDataTextAllArr = [this.dataArr[0].text,this.dataArr[1].text];

			if(this.dataArr[0].text==-1){
				this.range.min = -2;
				sliderPipsItemTextL = '不限';
			}else{
				sliderPipsItemTextL = this.dataArr[0].text + (this.dataArr[0].unit?this.dataArr[0].unit:this.unit);
			}
            this.sliderPipsHtml=`<li style="left:30%" class="${sliderClassNameL}">
            					<span class="${spanClassName}">
            						${sliderPipsItemTextL}
            					</span>
            				</li>
            				<li style="left:70%" class="${sliderClassNameR}">
            					<span class="${spanClassName}">
            						${this.dataArr[1].text}${this.dataArr[1].unit?this.dataArr[1].unit:this.unit}
            					</span>
            				</li>`;
		}else{
			var sliderPCT = 100 / ( this.dataLength - 1),
				sliderClassName = '';

			for (let i = 0; i < this.dataLength; i++) {
				sliderClassName='';
				this.range[sliderPCT * i + '%'] = this.dataArr[i].text;
				
				this.sliderPos.push(sliderPCT * i);

				if(this.dataArr[i].isDefault){
					this.start = this.dataArr[i].text;
					this.itemSilderIndex = i;
					sliderClassName += ' cur';

				}
				if(this.dataArr[i].isDisable){
					sliderClassName += ' disable';
					this.itemSilderDisableIndex.push(i);
				}else{
					this.sliderDataTextArr.push(this.dataArr[i].text);
				}
				this.sliderDataTextAllArr.push(this.dataArr[i].text);

				if(i == 0){
                    this.range.min = this.dataArr[i].text;
                    sliderClassName+=" first-child";
                }else if(i == this.dataArr.length-1){
                	sliderClassName+=" last-child";
                    this.range.max = this.dataArr[i].text;
                }
                var sliderPipsItemText = this.dataArr[i].text < 0 ?'不限':this.dataArr[i].text +  (this.dataArr[i].unit?this.dataArr[i].unit:this.unit);
                this.sliderPipsHtml+=`<li style="left:${sliderPCT * i}%" class="${sliderClassName}"><span class="${spanClassName}">${sliderPipsItemText}</span></li>`;			
			}

		}

		if(this.isIe8){
			//初始化滚轴位置
			this.$noUiConnect.css({
				'right': (100-this.sliderPos[this.itemSilderIndex])+'%'
			});//滚轴

			this.$noUiOrigin.css({
				'left': this.sliderPos[this.itemSilderIndex] +'%'
			});//滑块
		}
		
		//修改标红项
		$(this.sliderPips).find('li').eq(this.itemSilderIndex).addClass('cur').siblings('li').removeClass('cur');
		$(this.sliderPips).find('li').removeClass('disable');
		for (let i = 0; i <this.itemSilderDisableIndex.length; i++) {
			$(this.sliderPips).find('li').eq(this.itemSilderDisableIndex[i]).addClass('disable');
		}

	}

	//更新数据
	update(data){
		var updateData = data,
			isRedraw = false;
		if(updateData instanceof Array && updateData.length>0){


			this.dataLength = updateData.length;
			this.dataArr = updateData;

			if(this.dataLength != this.sliderDataTextAllArr.length){
				isRedraw = true;
			}else{
				for (let i = 0; i < this.dataLength; i++) {
					if(updateData[i].text != this.sliderDataTextAllArr[i]){
						isRedraw = true;
						break;
					}
				}	
			}
			this.render();
			if(isRedraw){
				this.redraw();
			}
			this.ele.noUiSlider.updateOptions({
            	range: this.range,
			});	
			this.ele.noUiSlider.set(this.start);
			
		}else{
			console.error(`id==>${$(this.ele).attr("id")}==>update方法请传入正确的参数应该为数组
						[
							{
								"text":20,//必须为数字
								"isDisable":true,
								"isDefault":true,
							},
							{
								"text":30,//必须为数字
								"isDisable":false,
								"isDefault":false,
							}
						]`);
		}
	}
	//设置是否滑动是否不可用
	setAttribute(state){
		if(state =="disabled"){
			this.ele.setAttribute('disabled', true);
		}else{
			this.ele.removeAttribute('disabled');
		}
		
	}
}