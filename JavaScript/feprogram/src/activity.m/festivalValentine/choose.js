import './choose.scss';

import uuid from 'uuid';


class ChoosePage {

	constructor (){
		this.dom = {
			$wrap : $('.main'),
			$header : $('.header-bar'),

			$btnPartner : $('#btnPartner'),
			$btnSingle : $('#btnSingle'),
		}

		this.type = '';
		this.randomNum = '';

		this.setSize();
		this.bindEvent();
	}

	setSize (){
		let self = this;

		let _h = $(window).height() - self.dom.$header.height(); 
		// alert(_h + ' ' + $('html').data('dpr'));
		self.dom.$wrap.css('height', _h + 'px');

		if( _h > 583 * $('html').data('dpr') ){
			$('.main .tip, .main .note').addClass('fix');
		}
	}

	bindEvent(){
		let self = this;

		self.dom.$btnPartner.on('click', ()=> {
			this.setActivity(1);
		});

		self.dom.$btnSingle.on('click', ()=> {
			self.setActivity(2);
		});
	}
	// 产生活动记录
	setActivity( type ){
		let self = this;

		self.randomNum = uuid();
		self.type = type;

		tools.$ajax({
			url: SaveActivity,
            data: {
            	ActivityID: self.randomNum,
            	ActivityType: self.type,
            	UserName: username
            },
            type: 'POST',
            success: function(res){
            	if( res.Result ){
            		self.saveOrder();
            	} else {
            		tools.showAlert(res.Message);
            	}
            }
		});
	}

	// 保存活动记录与订单号关联
	saveOrder(){
		let self = this;

		tools.$ajax({
			url: SaveActivityOrder,
            data: {
            	ActivityID: self.randomNum,
            	OrderID: encryptv
            },
            type: 'POST',
            success: function(res){
            	if( res.Result ){
            		window.location.href = ActivityShareAction + '?v=' + self.randomNum;
            	} else {
            		tools.showAlert(res.Message);
            	}
            }
		});
	}
}

let choosePage = new ChoosePage();