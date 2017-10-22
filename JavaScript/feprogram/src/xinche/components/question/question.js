/*
//PC我要提问
//版本号：1.1
//参数说明
	packageId为必传参数如果不知道可以写 0
	interfaceUrl为接口参数
//使用方法
	$("我要提问按钮").questions({packageId:111});
*/
var check = require("libs/check");
(function($){
	var Questions = function(ele,options){
		this.element = ele;
      	this.defaults = {
      		packageId: "",
      		interfaceUrl: "/PackageConsulation/Add"
	    }
	    this.opts = $.extend(this.defaults,options);

	    //最外层
	    ($('#questionsCenter').length>0)? this.questionsCenter = $('#questionsCenter') : this.questionsCenter = $('<div id="questionsCenter">');
	   
	    //表单
	    this.qaPopupForm = $('<dl class="qa-popup-form">');
	    //结果
	    this.qaPopupResult = $('<dl class="qa-popup-result">');
	    //获取遮罩层
	    this.maskLayer= $("#maskLayer");
	    this.bodyDom = $("body");
	    this.init();
	}
	Questions.prototype = {
		init: function(){
			var self = this;
			if(self.opts.packageId == ""){
				alert("缺少参数产品的packageId为必传项");
			}else{
				self.renderDom();
			}
			
		},
		//ajax
	    sendAjax:function(options, _callback, _errorcallback){
	       	var self = this;
	    	var setting={
	    		url: '',
	    		timeout: 5000,
	    		type: 'get',
	    		dataType: 'json',
	    		cache: true,
	    		async: true,
	    		data: {}
	    	};
	    	setting = $.extend(setting, options);
	    	$.ajax({
	    		url: setting.url,
	    		type: setting.type,
	    		dataType: setting.dataType,
	        	async: setting.async,
	        	cache: setting.cache,
	        	data: setting.data,
	        	beforeSend: function(){
	                    
	        	},
	        	success: function(res){
	        		_callback(res);
	        	},
	        	complete: function (XMLHttpRequest, textStatus) {
	        		if (status == 'timeout') {//超时,status还有success,error等值的情况
	        			_errorcallback(textStatus);
	        		}
	        	}
	        })
	   	},
	   	//渲染dom
	    renderDom:function(){
	    	var self = this;
	    	self.qaPopupForm.html('<dt>我要提问<div class="close-layer"></div></dt><dd><div class="popup-con"><div class="popup-content clrfix"><div class="popup-content-left"><i>* </i>姓名：</div><div class="popup-content-right"><input type="text" name="name" value=" " placeholder="请输入姓名"/><div class="warn">请输入姓名</div></div></div><div class="popup-content clrfix"><div class="popup-content-left"><i>* </i>手机号：</div><div class="popup-content-right"><input type="text" name="mobile" value=" " placeholder="请输入手机号"/><div class="warn">请输入手机号</div></div></div><div class="popup-content popup-textarea clrfix"> <div class="popup-content-left"><i>* </i>问题描述：</div><div class="popup-content-right"><textarea name="textarea"></textarea><div class="warn">请输入问题描述</div></div></div><div class="btn-box clrfix"><a class="confirm-btn" href="javascript:void(0);">确定</a><a class="cancel-btn" href="javascript:void(0);">取消</a></div></div></dd>');
			self.questionsCenter.append(self.qaPopupForm).append(self.qaPopupResult);
			self.bodyDom.append(self.questionsCenter);

			self.bindEvent();
	    },
	    //绑定事件
	    bindEvent: function(){
	    	var self = this;
	    	//点击我要提问按钮
	    	self.element.on("click",function(){
	    		self.openLayer();
	    		self.qaPopupForm.fadeIn();
	    		self.qaPopupResult.fadeOut();
	    	})

	    	//弹出层事件委托
	    	self.questionsCenter.on("click",".close-layer,.qa-popup-form .confirm-btn,.qa-popup-form .cancel-btn,.qa-popup-result .confirm-btn,.qa-popup-result .resubmit-btn",function(e){
	    		e.preventDefault();
		        var curTarget = $(e.currentTarget);
		        if(curTarget.is(".close-layer") || curTarget.is(".qa-popup-form .cancel-btn") || curTarget.is(".qa-popup-result .confirm-btn")){
		        	self.closeLayer();
		        	self.qaPopupForm.fadeOut();
	    			self.qaPopupResult.fadeOut();
		        }else if(curTarget.is(".qa-popup-form .confirm-btn")){	
		        	if(self.check("name") && self.check("mobile") && self.check("textarea") ){
		        		self.submitData();
		        	}
		        }else if(curTarget.is(".qa-popup-result .resubmit-btn")){
		        	self.qaPopupResult.fadeOut();
		        	self.qaPopupForm.fadeIn();		    			
		        }
	    	})

	    	self.qaPopupForm.on('blur keyup',"input[name='name'],input[name='mobile'],textarea", function(e) {
		        var curTargetName = $(e.currentTarget).attr("name");
		        self.check(curTargetName);
		    });
	    },
	    //打开弹层
	    openLayer: function(){
	    	var self = this;
	    	self.qaPopupForm.find("input,textarea").removeClass('error').val("").next().hide();
	    	// self.bodyDom.css({"overflow":"hidden"});
	    	self.maskLayer.fadeIn();
	    	self.questionsCenter.fadeIn();
	    },
	    //关闭弹层
	    closeLayer: function(){
	    	var self = this;
	    	// self.bodyDom.css({"overflow":"visible"});
	    	self.maskLayer.fadeOut();
	    	self.questionsCenter.fadeOut();
	    },
	    //验证
	    check: function(name){
	    	var self = this,
	    		itemName = self.qaPopupForm.find("input[name='name']"),
	    		itemMobile = self.qaPopupForm.find("input[name='mobile']"),
	    		itemTextarea = self.qaPopupForm.find("textarea");
	    	if(name == "name"){

	    		if(itemName.val().trim() == ""){
	    			itemName.addClass('error').next().text("姓名不能为空").show();
	    		}else if(!check.isName(itemName.val())){
	    			itemName.addClass('error').next().text("请输入正确的姓名").show();
	    		}else{
	    			itemName.removeClass('error').next().hide();
	    			return true;
	    		}
	    		return false;	
	    	}else if(name == "mobile"){

	    		if(itemMobile.val().trim() == ""){
	    			itemMobile.addClass('error').next().text("手机号不能为空").show();
	    		}else if(!check.isPhoneNumber(itemMobile.val())){
	    			itemMobile.addClass('error').next().text("请输入正确的手机号").show();
	    		}else{
	    			itemMobile.removeClass('error').next().hide();
	    			return true;
	    		}
	    		return false;	
	    	}else if(name == "textarea"){

	    		if(itemTextarea.val().trim() == ""){
	    			itemTextarea.addClass('error').next().text("问题描述不能为空").show();
	    		}else{
	    			itemTextarea.removeClass('error').next().hide();
	    			return true;
	    		}
	    		return false;	
	    	}	
	    },
	    submitData: function(){
	    	var self = this,
	    		_url = self.opts.interfaceUrl,
	    		Consultation = {};

              Consultation.Telphone = self.qaPopupForm.find("input[name='mobile']").val().trim();
              Consultation.Consultant = self.qaPopupForm.find("input[name='name']").val().trim(); 
              Consultation.OldQuestion = self.qaPopupForm.find('textarea').val().trim();
              Consultation.PackageID = self.opts.packageId;

              var postdata = {
                  "consulation": JSON.stringify(Consultation)
              };
              var ResultHtml = {
                  Success: '<dt>我要提问<div class="close-layer"></div></dt><dd class="popup-con"><div class="result-con">问题提交成功，请等待回复</div><a class="confirm-btn" href="javascript:void(0);">确定</a></dd>',
                  Fail: '<dt>我要提问<div class="close-layer"></div></dt><dd class="popup-con"><div class="result-con">问题提交成功，请等待回复</div><a class="resubmit-btn" href="javascript:void(0);">重新提交</a></dd>'
              }
	    	self.sendAjax({
	            url: _url,
	            type: "Post",
                  data: postdata,
                  async: false,
	        }, successFun, errorFun);

	        //获取成功
	        function successFun(res){
	        	var data = JSON.parse(res);
	        	self.qaPopupForm.fadeOut();
                  if (data.Result) {
	        		self.qaPopupResult.html(ResultHtml.Success).fadeIn();
	        	}else{
	        		self.qaPopupResult.html(ResultHtml.Fail).fadeIn();
	        	}
	        }
	        // 出错后重新加载
	        function errorFun(info) {
	                
	        };
	    }
	}
	/*扩展方法*/
	$.fn.questions = function(options){
	    var questions = new Questions(this,options); 
	    return this;
	};
})(jQuery)