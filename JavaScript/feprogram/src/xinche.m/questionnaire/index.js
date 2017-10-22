'user strict';

import './index.scss';
import tools from 'libs/tools.m'

class View {
	constructor(){
		this.$item = $('.quesitem');
		this.$li = $('.quesitem_list li');
		this.$btn = $('#submitBtn');
		// this.formdata = {};
		this.flagFull = true;

		this.renderDom();
		this.bindRadio();
		this.bindSubmit();
	}

	// 初始化渲染
	renderDom(){
		this.$item.find('img').each(function(){
			$(this).css('width', $(this).width()/$('body').data('dpr') );
		});
	}

	// 单选
	bindRadio(){
		this.$li.on('click', function(){
			if( !$(this).hasClass('selected') ){
				$(this).addClass('selected').siblings().removeClass('selected');
			}
		});		
	}
	// 验证是否填全
	chkFull(){
		let self = this;
		
		self.flagFull = true;

		$('textarea, input').removeClass('alert');
		
		$('.quesitem').each(function(){
			let qnum = $(this).data('ques'),
				qrequ = $(this).data('require'),
				qtype = $(this).data('type'),
				itemSel = $(this).find('li.selected'),
				itemTxt = $(this).find('textarea');

			if( ( ( qtype == 'radio' ) && ( qrequ == 'yes' ) && ( itemSel.length == 0 ) ) ||
				( ( qtype == 'text' ) && ( qrequ == 'yes' ) && ( itemTxt.val() == '' ) ) ||
				( ( qtype == 'text' ) && ( qrequ == 'yes' ) && ( $(this).find('input').val() == '' ) ) ){
				tools.showAlert('请填写第' + qnum + '项');
				location.href = '#q' + qnum;
				self.flagFull = false;
				return false;
			} else if ( ( itemSel.data('other') == 'ipt' ) && ( itemTxt.val() == '' ) ){
				tools.showAlert('请填写第' + qnum + '项的说明');
				itemTxt.addClass('alert');
				location.href = '#q' + qnum + 'Txt';
				self.flagFull = false;
				return false;
			} else if ( ( itemSel.data('other') == 'ipt' ) && ( itemTxt.val().length > itemTxt.data('maxlength') ) ){
				switch (qnum)
				{
					case 4:
						tools.showAlert('其他筛选条件中最多输入' + itemTxt.data('maxlength') + '个汉字');
						break;
					case 5:
						tools.showAlert('通过其他功能中最多输入' + itemTxt.data('maxlength') + '个汉字');
						break;
					case 6:
						tools.showAlert('其他中最多输入' + itemTxt.data('maxlength') + '个汉字');
					中最多输入200个汉字
						break;						
				}
				itemTxt.addClass('alert');
				location.href = '#q' + qnum + 'Txt';
				self.flagFull = false;
				return false;
			} else if ( ( $(this).data('field') == 'Suggest' ) && ( itemTxt.val().length > itemTxt.data('maxlength') ) ){
					// q7单独验证
					tools.showAlert('意见或建议中最多输入' + itemTxt.data('maxlength') + '个汉字');
					itemTxt.addClass('alert');
					location.href = '#q' + qnum + 'Txt';
					self.flagFull = false;
					return false;
			}
		});
	}
	// 记录用户数据
	keepData(){
		let self = this;
		let formdata = {};

		$('.quesitem').each(function(){			
			let qnum = $(this).data('ques'),
				qtype = $(this).data('type'),
				qfield = $(this).data('field'),
				curval = '';

			if ( qtype == 'radio'){
				// 单选
				let itemSel = $(this).find('li.selected'),
					itemTxt = $(this).find('textarea');

				if ( itemSel.data('other') == 'ipt' ) {
					// 选中的是输入项
					curval = itemSel.data('id');
					formdata[qfield] = curval;
					formdata[qfield + 'Content'] = itemTxt.val();
				} else {
					// 选中的是单选项
					curval = itemSel.data('id');
					formdata[qfield] = curval;
				}
			} else if ( qtype == 'text' ) {
				// 输入
				if( $(this).find('textarea').length > 0 && $(this).find('textarea') != '') {
					curval = $(this).find('textarea').val();
				} else if ( $(this).find('input').length > 0 && $(this).find('input') != '' ){
					// 已填写
					curval = $(this).find('input').val();
				} else {
					curval = '';
				}
				formdata[qfield] = curval;
			}
		});

		formdata['DeviceID'] = DeviceID;
		formdata['Termainal'] = Termainal;
		formdata['CityName'] = CityName;
		formdata['NickName'] = NickName;
		formdata['Telephone'] = Telephone;

		// console.log(formdata);

		// 现在提交数据吧！！！
		tools.$ajax({
            url: BASEURL + '/APPQuestionNaire/SaveAPPQuestionNaire',
            method: 'POST',
            data: formdata,
            beforeSend: function(){
            	self.$btn.addClass('disable');
            },
            success: function (res) {
            	if ( res.Result ){
					tools.showAlert('提交成功');
					setTimeout(function(){
						var isApp = tools.getCookie("YiXinAppInfo");
						if(isApp){
						    tools.jsNativeBridge("goHome");
						}
					},300);
            	} else {
					tools.showAlert(res.Message);
					self.$btn.removeClass('disable');
            	}
			}
        });

	}

	// 提交
	bindSubmit(){
		let self = this;

		if( this.$btn.hasClass('disable') ){
			return;
		} else {				
			this.$btn.on('click', function(){
				self.chkFull();

				if( !self.flagFull ){
					return;
				} else {
					// 记录数据
					self.keepData();
				}
			});
		}

	}
}

new View()