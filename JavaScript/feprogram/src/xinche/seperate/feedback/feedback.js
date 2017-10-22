require('./feedback.scss');
var Swiper = require('libs/swiper/2.0');
var tools = require('libs/tools');
import check from 'libs/check';

class Feedback{
	static domCache={
		$nameInput: $("#nameInput"),
		$telInput:$("#telInput"),
		$messageTextarea:$("#messageTextarea"),
		$elasticLayer:$("#elasticLayer"),
		$maskLayer:$("#maskLayer"),
		$questionList:$(".question-list")
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

		$(".layout-left").on('keyup', '#nameInput,#telInput,#messageTextarea', (event)=> {
			event.preventDefault();
			var item = $(event.target);
			// 	checkVal = $.trim(item.val());
			if(item.attr("id") == "messageTextarea"){
				this.checkVal("messageTextarea");
			}else if(item.attr("id") == "telInput"){
				this.checkVal("telInput");
			}else{
				this.checkVal("nameInput");
			}
		});

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

		this.domCache.$elasticLayer.on('click', '.close-btn,.btn', (event)=>{
			event.preventDefault();
			this.domCache.$maskLayer.hide();
			this.domCache.$elasticLayer.hide();
		});
	}
	//验证
	static checkVal(id){
		var item = this.domCache["$"+id],
			checkVal = $.trim(item.val());
		if(checkVal == "" ||(id == "telInput" && !check.isPhoneNumber(checkVal))){
			this[id+"Check"] = false;
			item.addClass('error');
		}else{
			this[id+"Check"] = true;
			item.removeClass('error');
		}
	}

	static insertData(){
		var self = this;
		var data ={
			OldQuestion:this.domCache.$messageTextarea.val(),
			Consultant:this.domCache.$nameInput.val(),
			Telphone:this.domCache.$telInput.val(),
			Terminal:0
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
					self.domCache.$maskLayer.show();
					self.domCache.$elasticLayer.show();
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
						var dataLength = res.Data.length,
							remainder = dataLength%3;
						$.each(res.Data, function(index, val) {
							questionHtml +=`<dl class="swiper-slide">
				               <dt><span>${index+1}</span>${val.Question}</dt>
				               <dd>${val.Answer}</dd>
			           		</dl>`
			           		if(index == dataLength - remainder-1){
			           			return false;
			           		}
						});
						self.domCache.$questionList.html('<div class="swiper-wrapper">' + questionHtml +'</div>');
						if(dataLength>3){
							var mySwiper = new Swiper ('.swiper-container', {
							    mode: 'vertical',
							    autoplay : 5000,
							    autoplayDisableOnInteraction:false,
							    slidesPerView : 3,
								slidesPerGroup : 3,	
							    loop: true,
							    onFirstInit: function(){
				                	$(".swiper-container").hover(function(){
										mySwiper.stopAutoplay();
									},function(){
										mySwiper.startAutoplay();
									})
				                }
							  }) 
						}
						
					}else{
						self.domCache.$questionList.html('<div class="default-box">暂无常见问题</div>');
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