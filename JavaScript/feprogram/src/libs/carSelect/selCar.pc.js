/* 
//PC选车控件
//版本号：1.1
//参数说明

CallBacks：回调函数，返回一个参数属性是对象
OnlyOnSale：是否只需要在售信息（可不传入此参数，默认true，若需要返回已经停售的信息请设置为false）
IsThreeLevelList：此功能暂不实现默认即可
IsDownMenu：是否显示关联搜索的下拉菜单
FailTip：搜索失败提示，默认是“未找到符合条件的车型！”，二手车可能不一样
SerialImgShow：是否显示车系图片默认为 true
IsOpenSearch: 是否开启搜索功能默认为true
IsBrandsBack: 是否开启品牌返回功能默认为false
DownMenuWidth: 搜索下拉菜单的默认宽度

//模块加载使用方法
	require("selCar");
	//#selCar 应该是文本框的ID，如果不是文本框IsOpenSearch参数请设置false
	$("#selCar").selCar({
		CallBacks:callBack
	});

	//页面回调
	function callBack(obj){
		console.log(obj);
	}
注意：搜索结果的下拉菜单，滑动选择会在搜索框上添加选择的ID，可以根据这个ID进行搜索按钮定义
//返回信息说明：
只有四个属性：名称、ID、类型（如果选择的是车型还会返回车型的全拼spell）
如果点击的品牌（前提是开启品牌返回），则返回的对象为{brandName: "品牌名称", brandId: "品牌ID",returnType:"brands"}
如果点击的是车型，则返回的对象是{carType: "车型名称", carTypeId: "车型ID",returnType:"carType",spell:"aerfaluomiougtv"}
如果returnType为clear说明点击的是input上的叉子即是清空文本框
*/

	require("./selCar.pc.scss");
		(function($){
			var SelCar = function(ele,options){
        		this.element = ele;
        		this.defaults = {
        			//回调函数
		            CallBacks: new Function,
		            // 是否只需要在售信息（可不传入此参数，默认true，若需要返回已经停售的信息请设置为false）
            		OnlyOnSale: true,
            		//是否显示三级选车，默认是三级选车款
            		IsThreeLevelList : false,
            		//是否显示下拉菜单
            		IsDownMenu : true,
            		//搜索失败提示
            		FailTip:"未找到符合条件的车型！",
            		//是否显示车系图片
            		SerialImgShow:true,
            		//是否开启搜索功能
            		IsOpenSearch:true,
            		//是否开启品牌返回功能
            		IsBrandsBack:false,
            		//搜索下拉菜单默认宽度
            		DownMenuWidth:240,
            		//品牌接口
            		BrandsUrl:'',
            		//品牌接口类型
            		BrandsType:'jsonp',
            		//车型接口
            		SerialsUrl:'',
            		ShowLevel:'',
            		//车型接口类型
            		SerialsType:'jsonp',
            		//默认开启第几级菜单
            		DefaultLevel:1,
            		//事件类型 click和hover
            		EventType:'click',

		        }
		        this.opts = $.extend(this.defaults,options);

		        // 选车接口
		        this.loadSearchUrl = 'http://59.151.102.96/yichesugforcar.php?k=';
		        this.loadBrandsUrl = this.opts.BrandsUrl || APIURL + 'api/Common/GetCarMasterBrandListWithFirstLetter';
		        this.loadSerialsUrl = this.opts.SerialsUrl || APIURL + 'api/Common/GetCarSerialListWithBrand?masterBrandId=';
		        this.loadCarsUrl = APIURL + 'api/Common/GetCarListWithPrice?serialId=';
		        
		        //清空按钮
		        this.emptyDom = $('<div class="empty-search"></div>');
		       	//下拉菜单dom
		       	this.downMenuDom = $('<div class="sel-car-menu drop-layer">');
		       	//下拉菜单右侧DOM
		       	this.downMenuRDom = $('<div class="sel-car-menu-right">');
		       	//下拉菜单的当前选项
		       	this.curOpts = 0;
		       	//文本框的val
		       	this.textVal = "";
		       	//文本框高度
		       	this.inputHeight = this.element.height();
		       	//是否调用搜索接口
		       	this.IsSearch = true;
		       	//选车控件品牌列表
		       	this.brandsListDom = $('<div class="sel-car-brands drop-layer"><div class="sel-car-loading"></div></div>');
		       	//品牌中的字母列表
		       	this.letterNavDom = $('<div class="brand_letters" id="master-index_letters">');
		       	//品牌名称列表
		       	this.brandsNameDom = $('<div class="brand_name_bg"><div class="brand_name" id="masterIndexList">');

		       	//选车控件车型列表
		       	this.carTypeListDom = $('<div class="sel-car-type drop-layer"><div class="sel-car-loading"></div></div>');

		       	//品牌接口是否已经加载过
        		this.hasloadBrands = false;

		       	//回调函数中的数据
		       	this.callBacksObj = {};

		        this.init();
		        
			};

			SelCar.prototype = {
				init:function(){
					var self = this;
					//先渲染基本dom结构
					self.renderDom();
					//添加事件
					self.bindEvent();
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
		                complete: function(XMLHttpRequest, textStatus){    
		                    if (status == 'timeout') {//超时,status还有success,error等值的情况
		                        _errorcallback(textStatus);
		                    }
		                }
		            })
		        },
		        //下拉菜单
		        downMenu:function(){
		        	var self = this,
		        		_url = self.loadSearchUrl + self.textVal,
		        		downMenuStr = "";
		        	// console.log(_url);
		        	self.sendAjax({
		                url: _url,
		                dataType: 'jsonp'
		            }, showBrands, sendAgain);

		            //获取成功
		            function showBrands(res){
		            	if(res.length > 0){
		            		self.downMenuDom.css({"height":"auto","width":self.opts.DownMenuWidth + "px"});
		            		self.downMenuRDom.hide();
		            		downMenuStr += '<ul class="sel-car-menu-left">';
		            		$.each(res,function(i, item){
			            		if(item.type !="品牌"){
			            			if(item.type =="主品牌"){
			            				downMenuStr += '<li data-id="" data-brandid="'+ item.id +'" data-brandspell="'+item.spell+'" class="sel-car-brand">'+ item.showname +'</li>';
			            			}else{
			            				downMenuStr += '<li data-id="'+ item.id +'" data-brandid="" data-spell="'+  item.spell +'">'+ item.showname +'</li>';
			            			}
			            			
			            		}
			            		
			            	})
		            	}else{
		            		self.downMenuRDom.hide();
		            		// self.downMenuDom.css("height","auto");
		            		downMenuStr += '<ul class="sel-car-menu-left menu-fail">';
		            		downMenuStr += '<li class="fail-tip">'+ self.opts.FailTip +'</li>';
		            		self.downMenuDom.css({"height":"30px","width":"240px"});
		            	}
		            	downMenuStr += "</ul>";
		            	self.downMenuDom.html(downMenuStr);
		            	self.downMenuRDom.html('<div class="menu-right-title">全部车型</div><div class="menu-right-con"></div>');
		            	self.downMenuDom.append(self.downMenuRDom);
		            };
		            
		            // 出错后重新加载
		            function sendAgain(info) {
		                //console.log(info);
		                self.sendAjax({
		                    url: _url,
		                    dataType: 'jsonp'
		                }, showSerials, sendAgain);
		            };

		        	self.downMenuDom.show();
		        },
		        //渲染dom
		        renderDom:function(){
		        	var self =  this;
		        	self.element.wrap('<span class="sel-car-wrapper" style="height:' + self.inputHeight +'px;display:inline-block;"></span>');
		        	if(self.opts.IsOpenSearch){
			        	self.element.after(self.emptyDom);
			        	// self.emptyDom.css("height",self.inputHeight);
			        	self.element.after(self.downMenuDom);
			        	self.downMenuDom.css("top",self.inputHeight);
		        	}else{
		        		
		        	}
		        	self.element.after(self.brandsListDom);
		        	self.brandsListDom.css("top",self.inputHeight);
		        	self.brandsListDom.append(self.letterNavDom).append(self.brandsNameDom).after(self.carTypeListDom);
		        	self.brandsListDom.css("top",self.inputHeight);
		        	self.carTypeListDom.css("top",self.inputHeight);
		        },
		        //所有的事件
		        bindEvent:function(){
		        	var self = this;
		        	if(self.opts.IsOpenSearch){
		        		//输入框事件
			        	self.element.on("focus keyup",function(e){
			        		e.preventDefault();
			        		//隐藏所有下拉菜单
			        		$(".drop-layer:visible").hide();
		                    $(".up-arrow").removeClass('up-arrow');
		                    $(".upArrow-icon").removeClass('upArrow-icon').addClass('downArrow-icon');

			        		self.downMenuDom.show();
			        		var allNum = self.downMenuDom.find(".sel-car-menu-left li").length,
								item = self.downMenuDom.find(".sel-car-menu-left li");
							if(e.keyCode == 38 && self.downMenuDom.is(":visible")){
								self.IsSearch = false;
								if(self.curOpts == 0 || self.curOpts == 1){
									self.curOpts = allNum;
								}else{
									self.curOpts -=1;
								}
								if(self.curOpts != 0 && self.downMenuDom.find(".sel-car-menu-left li.fail-tip").length<=0){
									self.element.attr("data-id",item.eq(self.curOpts -1).attr("data-id"));
									self.element.attr("data-brandid",item.eq(self.curOpts -1).attr("data-brandid"));
		    						//改变文本框内容
		    						self.element.val(item.eq(self.curOpts -1).text());
		    					}
							}else if(e.keyCode == 40 && self.downMenuDom.is(":visible")){
	    						self.IsSearch = false;
	    						if(self.curOpts == allNum){
									self.curOpts = 1;
								}else{
									self.curOpts += 1;
								}
								if(self.curOpts != 0 && self.downMenuDom.find(".sel-car-menu-left li.fail-tip").length<=0){
									self.element.attr("data-id",item.eq(self.curOpts -1).attr("data-id"));
									self.element.attr("data-brandid",item.eq(self.curOpts -1).attr("data-brandid"));
		    						//改变文本框内容
		    						self.element.val(item.eq(self.curOpts -1).text());
		    					}
	    					}else if(e.keyCode == 13 
	    						&& self.downMenuDom.is(":visible") 
	    						&& $.trim(self.element.val())!=""
	    						&& !self.downMenuDom.find(".sel-car-menu-left li").hasClass('fail-tip')){
	    						var _curItemL;
	    						var _curItemR = self.downMenuDom.find(".menu-right-con");
	    						if(self.downMenuDom.find(".sel-car-menu-left li.hover").length !=0){
	    							_curItemL = self.downMenuDom.find(".sel-car-menu-left li.hover");
	    						}else{
	    							_curItemL = self.downMenuDom.find(".sel-car-menu-left li").eq(0);
	    						}
	    						
	    						if(_curItemL.hasClass('sel-car-brand')){

	    							if(self.opts.IsBrandsBack){
	    								self.callBacksObj.brandName = _curItemL.text();
										self.callBacksObj.brandId = _curItemL.attr("data-brandid");
										self.callBacksObj.spell = "";
										self.callBacksObj.carType = "";
										self.callBacksObj.carTypeId = "";
										self.callBacksObj.returnType = "brands";		
	    							}else{
	    								if(_curItemR.find("dd.hover").length !=0){
	    									self.callBacksObj.brandName = ""
											self.callBacksObj.brandId = "";
											self.callBacksObj.spell = _curItemR.find("dd.hover").attr("data-spell");
											self.callBacksObj.carType = _curItemR.find("dd.hover").text();
											self.callBacksObj.carTypeId = _curItemR.find("dd.hover").attr("data-id");
											self.callBacksObj.returnType = "carType";	
	    								}else{
			    							self.callBacksObj={};
			    						}
	    							}
	    						}else if(_curItemL.length !=0){
	    							self.callBacksObj.brandName = ""
									self.callBacksObj.brandId = "";
									self.callBacksObj.spell = _curItemL.attr("data-spell");
									self.callBacksObj.carType = _curItemL.text();
									self.callBacksObj.carTypeId = _curItemL.attr("data-id");
									self.callBacksObj.returnType = "carType";
	    						}
								self.callBackFun();
	    					}else if(e.keyCode == 8){
	    						self.element.attr("data-id","");
	    						self.element.attr("data-brandid","");
	    						self.IsSearch = true;
	    						// self.inputBoxChange();
	    					};
	    					if(self.curOpts != 0){
	    						item.removeClass("hover").eq(self.curOpts -1).addClass("hover");
				        		if(item.eq(self.curOpts -1).hasClass("sel-car-brand") && $.trim(self.element.val())!=""){
				        			self.downMenuModel(item.eq(self.curOpts -1).attr("data-brandid"),item.eq(self.curOpts -1).text());
				        			self.element.attr("data-brandid",item.eq(self.curOpts -1).attr("data-brandid"));
				        			self.downMenuDom.css({"height":"290px","width":"450px"});
				        			self.downMenuRDom.show();
				        		}else{
				        			self.downMenuRDom.hide();
				        			self.downMenuDom.css({"height":"auto","width":self.opts.DownMenuWidth + "px"});
				        		}
				        
	    					}
			        		self.inputBoxChange();
			        	});


			        	//下拉菜单的鼠标滑过事件
			        	self.downMenuDom.on("mouseover",".sel-car-menu-left li,.sel-car-menu-right dd,.sel-car-menu-right .menu-right-title,.sel-car-menu-right dt",function(e){
			        		e.preventDefault();
			        		var currentTarget = $(e.currentTarget);
			        		$(this).siblings().removeClass("hover").end().addClass("hover");
			        		if(currentTarget.is(".sel-car-menu-left li")){
				        		if($(this).hasClass("sel-car-brand")){
				        			self.downMenuModel($(this).attr("data-brandid"),$(this).text());
				        			self.element.attr("data-brandid",$(this).attr("data-brandid"));
				        			self.downMenuDom.css({"height":"290px","width":"450px"});
				        			self.downMenuRDom.show();
				        		}else if($(this).text() != self.opts.FailTip){
				        			self.element.attr("data-id",$(this).attr("data-id"));
				        			self.element.attr("data-brandid",$(this).attr("data-brandid"));
				        			self.element.val($(this).text());
				        			self.downMenuRDom.hide();
				        			self.downMenuDom.css({"height":"auto","width":self.opts.DownMenuWidth + "px"});
				        		}

			        		}else if(currentTarget.is(".sel-car-menu-right dd")){
			        			self.element.attr("data-id",$(this).attr("data-id"));
			        			self.element.attr("data-brandid",$(this).attr("data-brandid"));
			        			self.element.val($(".sel-car-menu-left li.hover").text() + " " + $(this).text());
			        		}else if(currentTarget.is(".sel-car-menu-right dt") && self.opts.IsBrandsBack){
			        			self.element.attr("data-id","");
			        			self.element.attr("data-brandid",$(this).attr("data-id"));
			        			self.element.val($(this).text());
			        		}else if(currentTarget.is(".sel-car-menu-right .menu-right-title") && self.opts.IsBrandsBack){
			        			self.element.attr("data-id","");
			        			self.element.attr("data-brandid",self.downMenuDom.find('.sel-car-menu-left li.hover').attr("data-brandid"));
			        			self.element.val(self.downMenuDom.find('.sel-car-menu-left li.hover').text());
			        		}
			        		
			        	})
		        	}else{
		        		if(self.opts.EventType =="click"){
		        			self.element.on("click",function(){
			        			if(!self.element.hasClass('up-arrow')){
			        				//隐藏所有下拉菜单
						        	$(".drop-layer:visible").hide();
						        	$(".up-arrow").removeClass('up-arrow');
				                    $(".upArrow-icon").removeClass('upArrow-icon').addClass('downArrow-icon');
				                    self.element.addClass('up-arrow');
				                    if(self.opts.DefaultLevel ==1){
				                    	self.carCtrlBrands();
				                    }else if(self.opts.DefaultLevel ==2){
				                    	self.carTypeListDom.css({"left":0}).show();
				                    	self.carCtrlSerials();
				                    }
				        			
			        			}else{
			        				self.carTypeListDom.hide();
					          		self.element.removeClass('up-arrow');
					          		self.brandsListDom.hide();
			        			}
			        		})
		        		}else if(self.opts.EventType =="hover"){
		        			self.element.on("mouseover",function(){
		        				//隐藏所有下拉菜单
					        	$(".drop-layer:visible").hide();
					        	$(".up-arrow").removeClass('up-arrow');
			                    $(".upArrow-icon").removeClass('upArrow-icon').addClass('downArrow-icon');
			                    self.element.addClass('up-arrow');

								if(self.opts.DefaultLevel ==1){
			                    	self.carCtrlBrands();
			                    }else if(self.opts.DefaultLevel ==2){
			                    	self.carTypeListDom.css({"left":0}).show();
			                    	self.carCtrlSerials();
			                    }
			
			        		})
		        		}
		        		
		        	}
					
		        	//选车插件的品牌事件
		        	self.brandsListDom.on("click","#master-index_letters span a,#masterIndexList dd",function(e){
		        		e.preventDefault();
		        		var currentTarget = $(e.currentTarget);
		        		if(currentTarget.is("#master-index_letters span a")){
		        			var scrollId ="#master-indexletters_" + $(this).parent("span").attr("data-char");
		        			var itembrandsList = self.brandsNameDom.find("#masterIndexList");
		        			//滚动
		        			var scrollTop = $(scrollId).position().top + itembrandsList.scrollTop();
		        			itembrandsList.scrollTop(scrollTop);
		        			//$(scrollId)[0].scrollIntoView(true);
		        		}else if(currentTarget.is("#masterIndexList dd")){
		        			self.carTypeListDom.show();
		        			self.brandsNameDom.find("a").removeClass("current");
		        			$(this).find("a").addClass("current");
		        			self.carCtrlSerials($(this).find("a").attr("data-id"),$(this).find("a").attr("data-text"),$(this).find("a").attr("data-spell"));
		        		}
		        	});
		        	//DOM点击关闭
		        	var docEventType = "";
		        	if(self.opts.EventType =="hover"){
		        		docEventType = "mouseover"
		        	}else if(self.opts.EventType =="click"){
		        		docEventType = "click"
		        	}
		        	$(document).on(docEventType,function(e){
		        		var target = $(e.target);
		        		if (!target.is(self.downMenuDom) && target.parents(".sel-car-wrapper").length <= 0) {
				          self.downMenuDom.hide();
				          self.element.removeClass('up-arrow');
				        }
				        if(!target.is(self.carTypeListDom) && target.parents(".sel-car-wrapper").length <= 0
				        	 && !target.is(self.brandsListDom)){
				        	self.carTypeListDom.hide();
							self.brandsListDom.hide();
							self.element.removeClass('up-arrow');
				        }
		        		
		        	});
					//下拉菜单的点击事件
					self.downMenuDom.on("click",".sel-car-menu-left li,.sel-car-menu-right .menu-right-con dd,.sel-car-menu-right .menu-right-title,.sel-car-menu-right dt",function(e){
						e.preventDefault();
						var currentTarget = $(e.currentTarget);
						if(currentTarget.is(".sel-car-menu-left li")){
							if($(this).text() != self.opts.FailTip){
								if(!$(this).hasClass("sel-car-brand")){
									self.callBacksObj.brandName = ""
									self.callBacksObj.brandId = "";
									self.callBacksObj.spell = $(this).attr("data-spell");
									self.callBacksObj.carType = $(this).text();
									self.callBacksObj.carTypeId = $(this).attr("data-id");
									self.callBacksObj.returnType = "carType";	
								}else{
									delete self.callBacksObj.carType;
									delete self.callBacksObj.carTypeId;
									delete self.callBacksObj.spell;
									delete self.callBacksObj.categoryId;
									self.callBacksObj.brandName = $(this).text();
									self.callBacksObj.brandId = $(this).attr("data-brandid");
									self.callBacksObj.returnType = "brands";	
								}
								
								if(self.opts.IsBrandsBack){
									//console.log(self.callBacksObj +"11");
									self.callBackFun();
								}else{
									if(!$(this).hasClass("sel-car-brand")){
										//console.log(self.callBacksObj);
										self.callBackFun();
									}
								}
							}else{
								// self.downMenuDom.find(".sel-car-menu-left").hide();
							}
							
							
						}else if(currentTarget.is(".sel-car-menu-right .menu-right-con dd")){
							self.callBacksObj.brandName = self.downMenuDom.find(".sel-car-menu-left li.hover").text();
							self.callBacksObj.brandId = self.downMenuDom.find(".sel-car-menu-left li.hover").attr("data-id");
							self.callBacksObj.spell = $(this).attr("data-spell");
							self.callBacksObj.carType = $(this).find("span").text();
							self.callBacksObj.carTypeId = $(this).attr("data-id");
							self.callBacksObj.returnType = "carType";	
							//console.log(self.callBacksObj);
							self.callBackFun();
						}else if(currentTarget.is(".sel-car-menu-right .menu-right-title") && self.opts.IsBrandsBack){
							self.callBacksObj.brandName = self.downMenuDom.find('.sel-car-menu-left li.hover').text();
							self.callBacksObj.brandId = self.downMenuDom.find('.sel-car-menu-left li.hover').attr("data-brandid");
							self.callBacksObj.spell = self.downMenuDom.find('.sel-car-menu-left li.hover').attr("data-brandspell");
							self.callBacksObj.carType = "";
							self.callBacksObj.carTypeId = "";
							self.callBacksObj.returnType = "brands";	
							//console.log(self.callBacksObj);
							self.callBackFun();					
						}else if(currentTarget.is(".sel-car-menu-right dt") && self.opts.IsBrandsBack){
							self.callBacksObj.brandName = $(this).text();
							self.callBacksObj.brandId = $(this).attr("data-id");
                            self.callBacksObj.categoryId= $(this).attr("data-categoryid");
							self.callBacksObj.spell = self.downMenuDom.find('.sel-car-menu-left li.hover').attr("data-brandspell");
							self.callBacksObj.carType = "";
							self.callBacksObj.carTypeId = "";
							self.callBacksObj.returnType = "brands";	
							//console.log(self.callBacksObj);
							self.callBackFun();
						}
					})

					//选车控件选择车型
					self.carTypeListDom.on("click","#serialIndexList dd,#serialIndexList dt,h6",function(e){
						e.preventDefault();
						var currentTarget = $(e.currentTarget);
						var curBrand =self.brandsNameDom.find("a.current");
						self.element.removeClass('up-arrow');
						if(self.opts.IsBrandsBack && currentTarget.is("#serialIndexList dt")){
							delete self.callBacksObj.carType;
							delete self.callBacksObj.carTypeId;
							self.callBacksObj.spell = $(this).attr("data-spell");
							self.callBacksObj.categoryId = $(this).attr("data-categoryId");
							self.callBacksObj.brandId = curBrand.attr("data-id");
							self.callBacksObj.brandName = $(this).find("i").text(); 
							self.callBacksObj.returnType = "brands";
							self.callBackFun();	
						}else if(currentTarget.is("#serialIndexList dd")){
							delete self.callBacksObj.categoryId;
							self.callBacksObj.brandId = curBrand.attr("data-id");
							self.callBacksObj.brandName = $(this).parents("dl").find("dt i").text(); 
							self.callBacksObj.spell = $(this).find("a").attr("data-spell");
							self.callBacksObj.carType = $(this).find("span").text();							
							self.callBacksObj.carTypeId = $(this).find("a").attr("data-id");
							self.callBacksObj.returnType = "carType";
							self.callBackFun();		
						}else if(currentTarget.is("h6") && self.opts.IsBrandsBack){
							delete self.callBacksObj.categoryId;
							delete self.callBacksObj.carType;
							delete self.callBacksObj.carTypeId;
							self.callBacksObj.spell = $(this).find("span").attr("data-spell");
							self.callBacksObj.brandId = $(this).find("span").attr("data-id");
							self.callBacksObj.brandName = $(this).find("span").attr("data-text");
							self.callBacksObj.returnType = "brands";
							self.callBackFun();	
						}
						
					});

					//关闭按钮事件
					self.emptyDom.on("click",function(){
						self.curOpts = 0;
						self.element.removeClass('up-arrow');
						self.element.attr("data-brandid","");
						self.element.attr("data-id","");
						self.element.val("");
						self.downMenuDom.hide();
						self.carTypeListDom.hide();
						self.brandsListDom.hide();
						self.emptyDom.hide();
						self.textVal = "";
						delete self.callBacksObj.carType;
						delete self.callBacksObj.carTypeId;
						delete self.callBacksObj.brandId;
						delete self.callBacksObj.brandName;
						delete self.callBacksObj.spell;
						delete self.callBacksObj.categoryId;
						self.callBacksObj.returnType = "clear";
						self.callBackFun();
					});

		        },
		        inputBoxChange:function(){
		        	var self = this;
		        	self.emptyDom.show();
		        	var val = $.trim(self.element.val());
		        	if(self.textVal != self.trim(val,"g")){
		        		self.textVal = self.trim(val,"g");
			        	if(self.textVal!= "" && self.opts.IsDownMenu){
			        		self.carTypeListDom.hide();
							self.brandsListDom.hide();
							if(self.IsSearch){
								self.curOpts = 0;
								self.downMenu();
							}
									
						}	
		        	}else if(self.textVal == ""){
		        		self.IsSearch = true;
						self.downMenuDom.hide();
						self.element.attr("data-id","");
						//调取插件
						self.carCtrlBrands();
					}else{
		        		self.element.attr("data-id","");
		        	}
		        		
		        	
				},
		        //输入列表品牌关联的车系
		        downMenuModel:function(brandId,brandName){
		        	var self = this,
		        		_url;
		        	self.downMenuRDom.find(".menu-right-con").html('<div class="sel-car-loading"></div>');
		        	if (self.opts.OnlyOnSale) {
		                _url = self.loadSerialsUrl + brandId;
		            } else {
		                _url = self.loadSerialsUrl + brandId + '&onlyOnSale=false';
		            }

		        	self.sendAjax({
		                url: _url,
		                dataType: self.opts.SerialsType
		            }, showSerials, sendAgain);

		            //获取成功
		            function showSerials(res){
		            	if(res.Result){
		            		var data = res.Data;
		            		if(data.length != 0){
		            			self.downMenuRDom.find("sel-car-loading").hide();
		            			var modelStr = "<dl>";
		            			$.each(data,function(i,item){
		            				var _style="";
		            				if(self.opts.IsBrandsBack){
		            					_style = "cursor: pointer;"
		            				}
			            			modelStr += '<dt data-id="'+brandId+'" data-categoryid="'+ item.CategoryId+'" style="'+ _style +'">'+ item.CategoryName + '</dt>';
			            			$.each(item.CategoryCollection,function(index,carModel){
			            				if(self.opts.SerialImgShow){
			            					var curClass= "";
			            					if(index == 0 && !self.opts.IsBrandsBack){
												curClass= ' class="hover"';
			            					}else{
			            						curClass= '';
			            					}

			            					modelStr += '<dd data-id="' + carModel.Id + '" data-spell="'+ carModel.Spell +'" ' + curClass + '><img src="' + carModel.ImgUrl + '"/><span>' + carModel.Name + '</span></dd>';

			            				}else{
			            					modelStr += '<dd data-id="' + carModel.Id + '" data-spell="'+ carModel.Spell +'"><span>' + carModel.Name + '</span></dd>';
			            				}
			            				
			            			})
			            		})
			            		modelStr += "</dl>";
								self.downMenuRDom.find(".menu-right-con").html(modelStr);
								var eleVal ="";
			            		if(self.opts.IsBrandsBack){
			            			eleVal = brandName;
			            		}else{
									eleVal = brandName + " " + self.downMenuRDom.find("dd").eq(0).text()
			            		}
			            		self.element.attr("data-id",self.downMenuRDom.find("dd").eq(0).attr("data-id"));
			            		self.element.val(eleVal);
		            		}else{
		            			self.IsSearch = true;
		            			self.downMenuDom.css({"width":"450px"});
		            			self.downMenuDom.find(".sel-car-menu-left").css({"height":"290px"})
		            			self.downMenuRDom.height(self.element.parent(".sel-car-wrapper").find(".sel-car-menu-left").height());
		            			self.downMenuRDom.html('<div class="no-models">此品牌下没有车型(T_T)</div>');
		            		}
		            		
		            	}
		            	
		            }
		            // 出错后重新加载
		            function sendAgain(info) {
		                //console.log(info);
		                self.sendAjax({
		                    url: _url,
		                    dataType: self.opts.SerialsType
		                }, showSerials, sendAgain);
		            };
		        },
		        //默认选车控件品牌
		        carCtrlBrands:function(){
		        	var self = this;
		        	self.brandsListDom.show();
		        	if(!self.hasloadBrands){
		                // 获取品牌
		                self.sendAjax({
		                    url: self.loadBrandsUrl,
		                    dataType:self.opts.BrandsType
		                }, initLetters,sendAgain);
		            }; 
		            // 出错后重新加载
		            function sendAgain(info) {
		                self.sendAjax({
		                    url: _url,
		                    dataType: self.opts.BrandsType
		                }, initLetters, sendAgain);
		            };
		            //获取成功
		            function initLetters(res){
		            	// console.log(res);
		            	self.brandsListDom.find(".sel-car-loading").hide();
		            	var strLetter = "",
		            		strbrands = "";
		            	if(res.Result){
		            		self.hasloadBrands = true;
		            		var data = res.Data;
		            		$.each(data,function(i,item){
		            			//console.log(item.CategoryName);
		            			strLetter += '<span data-char="' + item.CategoryName + '"><a href="javascript:void(0);">' + item.CategoryName + '</a></span>';
		            			strbrands += '<dl id="master-indexletters_' + item.CategoryName + '">';
		            			$.each(item.CategoryCollection,function(index,brandsItem){
		            				strbrands += '<dd><a href="javascript:void(0);" data-id="' + brandsItem.Id + '" data-text="' + brandsItem.Name +'" data-spell="' + brandsItem.Spell +'"><img src="' + brandsItem.ImgUrl + '">'+ item.CategoryName +' ' + brandsItem.Name+ '</a></dd>';
		            			})
		            			strbrands += '</dl>';
		            		})

		            		self.letterNavDom.html(strLetter);
		            		self.brandsNameDom.find("#masterIndexList").html(strbrands);
		            	}

		            }
		        },
		        //去除空格
		        trim: function(str,is_global){
		        	var result;
		            result = str.replace(/(^\s+)|(\s+$)/g,"");
		            if(is_global.toLowerCase()=="g")
		            {
		                result = result.replace(/\s/g,"");
		             }
		            return result;
		        },
		        //默认选车控件车系
        		carCtrlSerials:function(id,text,spell){

        			var self = this;
        			self.carTypeListDom.html('<div class="sel-car-loading"></div>');
		            // 判断是否显示停售的车
		            var _url = self.loadSerialsUrl;

		            if(self.opts.DefaultLevel ==1){
		            	if (self.opts.OnlyOnSale) {
			                _url = self.loadSerialsUrl + id;
			            } else {
			                _url = self.loadSerialsUrl + id + '&onlyOnSale=false';
			            }
		            }else if(self.opts.DefaultLevel ==2){
		            	if (self.opts.OnlyOnSale) {
			                _url = self.loadSerialsUrl;
			            } else {
			                _url = self.loadSerialsUrl + '&onlyOnSale=false';
			            }
		            }
		            

		            self.sendAjax({
		                url: _url,
		                dataType: self.opts.SerialsType
		            }, showSerials, sendAgain);

		            //获取成功
		            function showSerials(res){
		            	var pointerCss = "";
		            	if(self.opts.IsBrandsBack){
		            		pointerCss = "cursor: pointer;";
		            	}
		            	var strSerials ='<h6 style="'+ pointerCss +'"><span data-id="' + id + '" data-text="'+ text + '" data-spell="'+ spell +'">全部车型</span></h6><div class="models_detail_bg"><div class="models_detail" id="serialIndexList">';
		            	if(res.Result){
		            		var data = res.Data;
		            		$.each(data,function(i,item){
		            			strSerials += '<dl><dt style="'+ pointerCss + '" data-spell="'+ spell +'" data-categoryId="'+ item.CategoryId+'"><span>·&nbsp;&nbsp;<i>' + item.CategoryName + '</i></span></dt>';
		            			$.each(item.CategoryCollection,function(index,serialsItem){
		            				if(self.opts.SerialImgShow){
		            					strSerials += '<dd><a data-id="' + serialsItem.Id + '" data-spell="'+ serialsItem.Spell +'" href="javascript:void(0);"><img src="' + serialsItem.ImgUrl + '"><span>' + serialsItem.Name + '</span></a></dd>';
		            				}else{
		            					strSerials += '<dd><a style="padding-left:12px;" data-id="' + serialsItem.Id + '" data-spell="'+ serialsItem.Spell +'" href="javascript:void(0);"><span>' + serialsItem.Name + '</span></a></dd>';
		            				}
		            				
		            			})
		            			strSerials += '</dl>';
		            		})
		            	}
		            	strSerials += '</div></div>';
		            	self.carTypeListDom.html(strSerials);
		            }

		            // 出错后重新加载
		            function sendAgain(info) {
		                //console.log(info);
		                self.sendAjax({
		                    url: _url,
		                    dataType: 'jsonp'
		                }, showSerials, sendAgain);
		            };
		        },
		        //回调的相关操作
		        callBackFun:function(){
		        	var self = this;
		        	self.downMenuDom.hide();
		        	self.carTypeListDom.hide();
					self.brandsListDom.hide();

		        	self.opts.CallBacks(self.callBacksObj);
		        }
			}

			/*扩展方法*/
		    $.fn.selCar = function(options){
		        var selCar = new SelCar(this,options); 
		        return this;
		    };
		})(jQuery)

	
module.exports = $