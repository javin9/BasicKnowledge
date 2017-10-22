import './index.scss';

class AnualParty{

	constructor(){
		this.dom = {
			$body : $('body'),
			$jobIpt : $('#jobId'),
			$nameIpt : $('#jobName'),
			$tipmsg : $('.msg'),
			$seekBtn : $('#seekBtn'),
			$popMask : $('#masklayer'),
			$popCont : $('.pop'),
			$popClose : $('.pop .close'),
			$popHello : $('.pop .hello'),
			$popDesk : $('.pop .desk')
		}
		this.defaultName = '易鑫员工';

		this.init();
		this.bindEvent();
	}

	init(){
		const self = this;
		// 按钮初始不可点
		self.dom.$seekBtn.addClass('disable');
		// 初始化页面高度
		self.dom.$body.height($(window).height() + 'px');
	}

	bindEvent(){
		const self = this;

		// 工号输入
		self.dom.$jobIpt.on({
			'focus': function(){
				$(this).attr('placeholder', '');
			},
			'blur': function(){
				$(this).attr('placeholder', '请输入你的工号');
			},
			'keyup': function(){
				$(this).val( self.idlength($(this).val()) );
				if( $(this).val().length == 5 ){
					self.getUserInfo();
					self.dom.$seekBtn.removeClass('disable');
				} else {
					self.dom.$nameIpt.val('');
					self.dom.$seekBtn.addClass('disable');
					self.hideError();
				}
			}
		});

		// 查看桌号
		self.dom.$seekBtn.click(()=>{
			if ( !self.dom.$seekBtn.hasClass('disable') ){
				self.getDesk();
			}
		});

		// 关闭按钮
		self.dom.$popClose.click(() => {
			self.dom.$popMask.addClass('hide');
			self.dom.$popCont.addClass('hide');
		});
	}

	// 根据工号获取姓名
	getUserInfo(){
		const self = this;

		tools.$ajax({
			url: GetUserInfo_url,
            data: {
            	JobNum: self.dom.$jobIpt.val()
            },
            type: 'GET',
            success: function(res){
            	if(res.Result){
            		self.dom.$nameIpt.val( self.namelength(res.Data.UserName));
            		self.dom.$seekBtn.removeClass('disable');
            	} else {
            		self.showError(res.Message);
            		self.dom.$seekBtn.addClass('disable');
            	}
            }
        });
	}
	// 根据工号获取座位
	getDesk(){
		const self = this;

		tools.$ajax({
			url: GetUserDesk_url,
            data: {
            	JobNum: self.dom.$jobIpt.val()
            },
            type: 'GET',
            success: function(res){
            	if(res.Result){
            		if( res.Data.IsLeader ){
            			self.dom.$popHello.html('亲爱的领导<br/>请您到' + res.Data.DeskName + '桌就餐');
            			self.dom.$popDesk.text(res.Data.DeskName).attr('class', 'desk leader');
            		} else {
            			if( res.Data.DeskName.toLowerCase() == 'nodesk' ){
            				// 无座员工
            				self.dom.$popHello.html('');
	            			self.dom.$popDesk.text(res.Data.Name + '同学，请联系现场红丝带行政人员').attr('class', 'desk other');
            			} else {
            				// 普通有座员工
	            			self.dom.$popHello.html('您的桌号是' + res.Data.DeskName);
	            			self.dom.$popDesk.text(res.Data.DeskName).attr('class', 'desk');
            			}

            		}

					self.dom.$popMask.removeClass('hide');
					self.dom.$popCont.removeClass('hide');
            	} else {
            		self.showError(res.Message);
            	}
            }
        });
	}
	// 处理工号长度
	idlength( num ){
		const self = this;

		let len = 5,
			myLen = num.length;
		
		if( myLen > len ){
			num = num.substring(0, len);
		}

		return num;
	}
	// 处理姓名长度
	namelength( str ){
		const self = this;

		let len = 8,
			myLen = 0,
			i = 0;

		for( i=0; i<str.length && myLen<=len; i++){
			if(str.charCodeAt(i)>0 && str.charCodeAt(i)<128)
				myLen++;
			else
				myLen+=2;
		}
		if( myLen>len ){
			str = str.substring(0, 3) + '...';
		}

		return str;
	}
	// 显示错误信息
	showError( text ){
		const self = this;

		self.dom.$tipmsg.removeClass('hide').find('span').text(text);
	}
	// 隐藏错误信息
	hideError(){
		const self = this;

		self.dom.$tipmsg.addClass('hide');
	}
}

let anualPartyPage = new AnualParty();