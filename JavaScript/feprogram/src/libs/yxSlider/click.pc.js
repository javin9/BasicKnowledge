require('./click.pc.scss');


/*	使用方法，先new类传入参数1、dom ID 2、数据(可以传需要的其他数据回调函数会返回当前选项的整个对象) 3、回调函数
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
	       <div class="package_box">
                        <dl class="down-payment">
                            <dt>首付比例</dt>
                            <dd>
                                <a href="javascripts:;">0%</a>
                                <a href="javascripts:;">10%</a>
                                <a href="javascripts:;">20%</a>
                                <a href="javascripts:;">30%</a>
                                <a href="javascripts:;">40%</a>
                                <a href="javascripts:;">50%</a>
                                <a href="javascripts:;" class="cur">60%</a>
                                <a href="javascripts:;">70%</a>
                                <a href="javascripts:;">80%</a>
                            </dd>
                        </dl>
                        <dl class="deadline">
                            <dt>还款期限</dt>
                            <dd>
                                <a href="javascripts:;">12期</a>
                                <a href="javascripts:;" class="cur">24期</a>
                                <a href="javascripts:;">36期</a>
                                <a href="javascripts:;">48期</a>
                            </dd>
                        </dl>
                    </div>
*/
export default class YXSliderClick {

	constructor(ele, data = [], callback) {
		this.callback = callback;
		this.ele = '';
		this.start = '';
		this.range = {
			min: 0,
			max: 100
		};
		this.sliderPips = '';
		this.sliderTips = '';//弹层
		this.dataLength = data.length;
		this.dataArr = data;
		this.sliderPipsHtml = '';
		this.unit = '';//单位
		//滑块数据
		this.sliderDataTextAllArr = [];
		this.sliderDataTextArr = [];
		this.itemSilderIndex;
		this.itemSilderDisableIndex = [];
		if (ele && typeof ele == 'string' && data instanceof Array && this.dataLength > 0) {
			this.ele = document.getElementById(ele);
			this.unit = this.dataArr[0].unit;
			this.render(this.dataArr);
		} else {
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



	render(data) {
		var _this = this;
		var html = '';
		for (var i = 0; i < data.length; i++) {
			var c = '';
			// console.log(data[i])
			if (data[i].isDisable)
				c += ' disable';
			if (data[i].isDefault)
				c += ' cur';
			html += '<a  href="javascript:;" data=\'' + JSON.stringify(data[i]) + '\' class="select_a ' + c + '">' + data[i].text + _this.unit + '</a>';
		}
		$(_this.ele).html(html);
		$(_this.ele).off('click').on('click', 'a', function (event) {
			if ($(this).hasClass('disable')) {
				return;
			}
			event.preventDefault();
			$(_this.ele).find('a').removeClass('cur');
			$(this).addClass('cur');
			var d = $(this).attr('data')
			_this.callback(JSON.parse(d));
		});
	}

	//更新数据
	update(data) {

		var updateData = data,
			isRedraw = false;
		if (updateData instanceof Array && updateData.length > 0) {
			this.render(updateData)
		} else {
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
	setAttribute(state) {
		if (state == "disabled") {
			this.ele.setAttribute('disabled', true);
		} else {
			this.ele.removeAttribute('disabled');
		}

	}
}