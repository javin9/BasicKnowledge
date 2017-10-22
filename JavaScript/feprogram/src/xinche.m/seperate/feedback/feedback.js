require('./feedback.scss');
var tools = require('libs/tools.m.js');

import check from 'libs/check';

class Feedback{
	static domCache={
		$nameInput: $("#nameInput"),
		$telInput:$("#telInput"),
		$messageTextarea:$("#messageTextarea"),
		$maskLayer:$("#maskLayer"),
		$questionList:$(".question-list"),
		$nameLi:$(".name-li"),
		$telLi:$(".tel-li"),
	}
	static nameInputCheck = false;
	static telInputCheck = false;
	static messageTextareaCheck = false;

	static init(){
		this.getData();
		this.bindEvents();
	}
	//绑定事件
	static bindEvents(){

		this.domCache.$nameInput.on('blur', (event) =>{
			event.preventDefault();
			this.checkVal("nameInput");
			
		});
		this.domCache.$telInput.on('blur', (event) =>{
			event.preventDefault();
			this.checkVal("telInput");
		});
		this.domCache.$messageTextarea.on('blur', (event) => {
			event.preventDefault();
			this.checkVal("messageTextarea");
			
		});
		// $(".layout-left").on('blur', '#nameInput,#telInput,#messageTextarea', (event)=> {
		// 	event.preventDefault();
		// 	var item = $(event.target);
		// 	// 	checkVal = $.trim(item.val());
		// 	if(item.attr("id") == "messageTextarea"){
		// 		this.checkVal("messageTextarea");
		// 	}else if(item.attr("id") == "telInput"){
		// 		this.checkVal("telInput");
		// 	}else{
		// 		this.checkVal("nameInput");
		// 	}
		// });

		//提交
		$("#submitBtn").on('click', (event)=>{
			event.preventDefault();
			if(this.nameInputCheck && this.telInputCheck && this.messageTextareaCheck){
				this.insertData();
			}else{
				this.checkVal("messageTextarea");
				this.checkVal("telInput");
				this.checkVal("nameInput");
			}
		});
	}
	//验证
	static checkVal(id){
		var item = this.domCache["$"+id],
			checkVal = $.trim(item.val());

		if(id == "nameInput"){
			if(checkVal == ""){
				this.nameInputCheck = false;
				this.domCache.$nameLi.parent("ul").addClass('error-name');
			}else{
				this.domCache.$nameLi.parent("ul").removeClass('error-name');
				this.nameInputCheck = true;
				
			}
		}else if(id == "telInput"){
			if(checkVal == "" || !check.isPhoneNumber(checkVal)){
				this.domCache.$telLi.parent("ul").addClass('error-tel');
				this.telInputCheck = false;	
			}else{
				this.domCache.$telLi.parent("ul").removeClass('error-tel');
				this.telInputCheck = true;
			}
		}else{
			if(checkVal == ""){
				this.messageTextareaCheck = false;
				item.addClass('error');
			}else{
				this.messageTextareaCheck = true;
				item.removeClass('error');
			}
		}
		
		
	}

	static insertData(){
		var self = this;
		var data ={
			OldQuestion:this.domCache.$messageTextarea.val(),
			Consultant:this.domCache.$nameInput.val(),
			Telphone:this.domCache.$telInput.val(),
			Terminal:1
		}
		self.domCache.$messageTextarea.val("");
		self.domCache.$nameInput.val("");
		self.domCache.$telInput.val("");
		self.nameInputCheck = false;
		self.telInputCheck = false;
		self.messageTextareaCheck = false;
		$.ajax({
			url:addFeedbackUrl,
			type:'post',
			dataType: 'json',
			data: data,
			error:function() {
				
			},
			success:function(res){
				if(res.Result){
					tools.showAlert("意见已提交成功<br/>感谢您的反馈");
					setTimeout(function(){
						history.go(-1); 
                		return false;
					},2000)
				}else{
					tools.showAlert(res.Message);
				}
				
			},
			complete:function(){

			}
		})
		
	}
	//获取常见问题数据
	static getData(){
		var self = this;
		$.ajax({
			url:getFeedbackListUrl,
			dataType: 'json',
			error:function() {
				
			},
			success:function(res){
				var questionHtml = '';
				if(res.Result){
					if(res.Data.length>0){
						$.each(res.Data, function(index, val) {
							questionHtml +=`<dl>
							               <dt><span></span>${val.Question}</dt>
							               <dd><span></span>${val.Answer}</dd>
							           </dl>`
						});
						self.domCache.$questionList.html('<div class="swiper-wrapper">' + questionHtml +'</div>');
					}else{
						self.domCache.$questionList.html('<div class="no-data"></div>');
					}
				}else{
					tools.showAlert(res.Message);
				}
			},
			complete:function(){

			}
		})

	}
}


Feedback.init();