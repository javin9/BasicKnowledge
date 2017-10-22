/* 
//PC选城市控件
//版本号：1.1
//参数说明
callBacks：回调函数，返回一个参数属性是对象
loadCityUrl：城市接口路径
isRelationHeader: 是否开启头部城市选择的关联
//模块加载使用方法
	require("selCity");
	//#selCity 应该是文本框的ID
	$("#selCity").selCity({
		callBacks:callBack
	});

	//页面回调
	function callBack(obj){
		console.log(obj);
	}
//返回信息说明：
返回的对象只有五个键："cityId"、"cityName"、"regionId"、"url"、"citySpell"

增加了全局返回函数，可以同步页眉的城市不需要自己写回调函数
如下：
window.selCityCallback = function(obj) {
	console.log(obj);
}
*/
require('./index.scss')

var SelCity = function(ele,options){
	this.element = ele;
	this.defaults = {
      	//回调函数
	    callBacks: new Function,
    	loadCityUrl: APIURL + "api/Common/GetGroupingCityList",
    	isRelationHeader: false,
    	isSetCookie:true,
        // 参数
        data: {},
		dataType:'jsonp'
    }
    this.opts = $.extend(this.defaults,options);

    //反推省份的接口
    //this.loadProvinceUrl = "";
    //选择城市DOM
    this.cityDom = $('<div class="sel-city-menu drop-layer">');

    //文本框或者块级高度
    this.boxHeight = this.element.height();
    //缓存切换DOM
    this.cacheDom = {};
    //城市数据
    this.cityData ="";
    this.asynData = true;
    this.init();
};

SelCity.prototype = {
		init:function(){
			var self = this;
			//先渲染基本dom结构
            if(self.element.parent().hasClass('sel-city-wrapper') && self.element.next().hasClass('sel-city-menu')){
            	var _curUrl =  location.href;
            	var _curParame = _curUrl.split("?")[1];
                self.cityData = true;
                self.asynData = false;
                self.cityDom = self.element.next(".sel-city-menu.drop-layer");
                if(_curParame){
                    self.cityDom.find('a').each(function(){
                        var _itemHref = $(this).attr('href') + '?' + _curParame;
                        $(this).attr('href',_itemHref);
                    })
				}

                self.cacheDom = {
                    "domesticfrom":self.cityDom.find("div[data-panel='domesticfrom']"),
                    "ABCDE":self.cityDom.find("div[data-panel='ABCDE']"),
                    "FGHIJ":self.cityDom.find("div[data-panel='FGHIJ']"),
                    "KLMNOP":self.cityDom.find("div[data-panel='KLMNOP']"),
                    "QRSTUV":self.cityDom.find("div[data-panel='QRSTUV']"),
                    "WXYZ":self.cityDom.find("div[data-panel='WXYZ']")
                }
            }else{
                self.asynData = true;
                self.renderDom();
			}

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
        //渲染DOM
        renderDom:function(){
        	var self =this,
        		_relation = "";
            if(self.opts.isRelationHeader){
                _relation = 'data-relation="true"';
            }
			self.element.wrap('<span class="sel-city-wrapper" '+ _relation +' style="height:' + self.boxHeight +'px;display:inline-block;"></span>');
			self.cityDom.html('<div class="city-loading"></div>');
			self.element.after(self.cityDom);
        },
        //加载城市
        loadCity:function(){
        	var self =  this,
        		_url = self.opts.loadCityUrl,
        		domStr = "",
        		domBtmStr ="",
        		domObj= {},
        		navHotStr="",
        		navABCDEStr = "",
        		navFGHIJStr = "",
        		navKLMNOPStr = "",
        		navQRSTUVStr = "",
        		navWXYZStr = "",
        		domHot = "",
        		domABCDE ="",
        		domFGHIJ = "",
        		domKLMNOP = "",
        		domQRSTUV = "",
        		domWXYZ = "",
        		domLiArr = [];

			// var dataType = _url.indexOf(location.hostname) > -1 || _url.slice(0,1) === '/' ? 'json' : 'jsonp';
			//console.log(_url)
			//console.log(location.hostname);
			//console.log(dataType)
        	self.sendAjax({
                url: _url,
                data: self.opts.data,
                dataType: self.opts.dataType
            }, showBrands, sendAgain);

            //获取成功
            function showBrands(res){
            	if(res.Result){
            		var data = res.Data;


	           		$.each(data,function(i,item){
	           			//console.log(item);
	           			if(item.GroupName == "HOT"){
	           				navHotStr += "热门城市";
	           				domHot += '<div data-panel="domesticfrom" class="hot-city"><dl class="clrfix"><dt>城市</dt><dd class="clrfix"><ul>';
	           				$.each(item.ItemCollection,function(index,cityItem){
	           					domHot += '<li><a data-url="' + cityItem.Url + '" data-id="'+ cityItem.CityId +'" data-regionId="'+ cityItem.RegionId +'" data-citySpell="'+ cityItem.CitySpell +'" href="javascript:void(0);" title="'+ cityItem.CityName +'">'+ cityItem.CityName +'</a></li>';
	           				});
	           				domHot += '</ul></dd></dl></div>';
	           				domLiArr[0]="Hot";
	           			}else if(item.GroupName >="A" && item.GroupName <= "E" && item.GroupName !="HOT"){
	           				navABCDEStr += item.GroupName;
	           				domABCDE += '<dt>'+ item.GroupName +'</dt><dd class="clrfix"><ul>';
	           				$.each(item.ItemCollection,function(index,cityItem){
	           					domABCDE += '<li><a data-url="' + cityItem.Url + '" data-id="'+ cityItem.CityId +'" data-regionId="'+ cityItem.RegionId +'" data-citySpell="'+ cityItem.CitySpell +'" href="javascript:void(0);" title="'+ cityItem.CityName +'">'+ cityItem.CityName +'</a></li>';
	           				});
	           				domABCDE += '</ul></dd>';
	           				domLiArr[1]="ABCDE";
	           			}else if(item.GroupName >="F" && item.GroupName <= "J" && item.GroupName !="HOT"){
	           				navFGHIJStr += item.GroupName;
	           				domFGHIJ += '<dt>'+ item.GroupName +'</dt><dd class="clrfix"><ul>';
	           				$.each(item.ItemCollection,function(index,cityItem){
	           					domFGHIJ += '<li><a data-url="' + cityItem.Url + '" data-id="'+ cityItem.CityId +'" data-regionId="'+ cityItem.RegionId +'" data-citySpell="'+ cityItem.CitySpell +'" href="javascript:void(0);" title="'+ cityItem.CityName +'">'+ cityItem.CityName +'</a></li>';
	           				});
	           				domFGHIJ += '</ul></dd>';
	           				domLiArr[2]="FGHIJ";
	           			}else if(item.GroupName >="K" && item.GroupName <= "P" && item.GroupName !="HOT"){
	           				navKLMNOPStr += item.GroupName;
	           				domKLMNOP += '<dt>'+ item.GroupName +'</dt><dd class="clrfix"><ul>';
	           				$.each(item.ItemCollection,function(index,cityItem){
	           					domKLMNOP += '<li><a data-url="' + cityItem.Url + '" data-id="'+ cityItem.CityId +'" data-regionId="'+ cityItem.RegionId +'" data-citySpell="'+ cityItem.CitySpell +'" href="javascript:void(0);" title="'+ cityItem.CityName +'">'+ cityItem.CityName +'</a></li>';
	           				});
	           				domKLMNOP += '</ul></dd>';
	           				domLiArr[3] = "KLMNOP";
	           			}else if(item.GroupName >="Q" &&  item.GroupName <= "V" && item.GroupName !="HOT"){
	           				navQRSTUVStr += item.GroupName;
	           				domQRSTUV += '<dt>'+ item.GroupName +'</dt><dd class="clrfix"><ul>';
	           				$.each(item.ItemCollection,function(index,cityItem){
	           					domQRSTUV += '<li><a data-url="' + cityItem.Url + '" data-id="'+ cityItem.CityId +'" data-regionId="'+ cityItem.RegionId +'" data-citySpell="'+ cityItem.CitySpell +'" href="javascript:void(0);" title="'+ cityItem.CityName +'">'+ cityItem.CityName +'</a></li>';
	           				});
	           				domQRSTUV += '</ul></dd>';
	           				domLiArr[4] = "QRSTUV";
	           			}else if(item.GroupName >="W" &&  item.GroupName <= "Z" && item.GroupName !="HOT"){
	           				navWXYZStr += item.GroupName;
	           				domWXYZ += '<dt>'+ item.GroupName +'</dt><dd class="clrfix"><ul>';
	           				$.each(item.ItemCollection,function(index,cityItem){
	           					domWXYZ += '<li><a data-url="' + cityItem.Url + '" data-id="'+ cityItem.CityId +'" data-regionId="'+ cityItem.RegionId +'" data-citySpell="'+ cityItem.CitySpell +'" href="javascript:void(0);" title="'+ cityItem.CityName +'">'+ cityItem.CityName +'</a></li>';
	           				});
	           				domWXYZ += '</ul></dd>';
	           				domLiArr[5] = "WXYZ";
	           			}
	           		});
					domObj={
						"navHotStr":navHotStr,
						"navABCDEStr":navABCDEStr,
						"navFGHIJStr":navFGHIJStr,
						"navKLMNOPStr":navKLMNOPStr,
						"navQRSTUVStr":navQRSTUVStr,
						"navWXYZStr":navWXYZStr,
						"domWXYZ":domWXYZ,
						"domQRSTUV":domQRSTUV,
						"domKLMNOP":domKLMNOP,
						"domFGHIJ":domFGHIJ,
						"domABCDE":domABCDE,
						"domHot":domHot
					}
	           		// domABCDE += "</dl></div>";
	           		// domFGHIJ += "</dl></div>";
	           		// domKLMNOP += "</dl></div>";
	           		// domQRSTUV += "</dl></div>";
	           		// domWXYZ += "</dl></div>";

	           		domStr += '<div class="sel-city-menuCon"><i class="icon-close"></i><div class="sel-city-nav">';
	           		var domLiArr2=[],
	           			navClass = "",
	           			conStyle = "";
	           		$.each(domLiArr,function(index, el) {
	           			if(el!=undefined){
	           				domLiArr2.push(el);
	           			}
	           		});

	           		$.each(domLiArr2,function(index, el) {
	           			if(index==0){
	           				navClass="active";
	           				conStyle ="";
	           			}else{
	           				navClass ="";
	           				conStyle="display:none";
	           			}
	           			if(el=="Hot"){
	           				domStr += '<span data-key="domesticfrom" class="'+navClass+'">' + navHotStr + '</span>';
	           				domBtmStr += domHot;
	           			}else{
	           				domStr +='<span data-key="'+el+'" class="'+navClass+'">' + domObj['nav'+el+'Str'] + '</span>';
	           				domBtmStr += '<div data-panel="'+el+'" class="other-city" style="'+conStyle+'"><dl>' + domObj['dom'+el] + '</dl></div>';
	           			}
	           		});

	           		self.cityData = domStr +"</div>" + domBtmStr +"</div>";
		        	self.cityDom.html(self.cityData);

		        	//缓存切换的DOM节点
		        	self.cacheDom = {
		        		"domesticfrom":self.cityDom.find("div[data-panel='domesticfrom']"),
		        		"ABCDE":self.cityDom.find("div[data-panel='ABCDE']"),
		        		"FGHIJ":self.cityDom.find("div[data-panel='FGHIJ']"),
		        		"KLMNOP":self.cityDom.find("div[data-panel='KLMNOP']"),
		        		"QRSTUV":self.cityDom.find("div[data-panel='QRSTUV']"),
		        		"WXYZ":self.cityDom.find("div[data-panel='WXYZ']")
		        	}
            	}else{
            		tools.showAlert("城市加载失败");
            	}

            };

            // 出错后重新加载
            function sendAgain(info) {
                //console.log(info);
                self.sendAjax({
                    url: _url,
                    dataType: 'jsonp'
                }, showSerials, sendAgain);
            };
        },
        //绑定事件
        bindEvent:function(){
        	var self = this;
        	self.element.parent(".sel-city-wrapper").on("click",".sel-city-nav span,dd li a,.icon-close",function(e){

        		var currentTarget = $(e.currentTarget);
        		if(currentTarget.is(".sel-city-nav span")){
                    e.preventDefault();
        			$(this).siblings("span").removeClass("active").end().addClass("active");
        			var key = currentTarget.attr("data-key");
        			self.cityDom.find("div[data-panel]").hide();
        			self.cacheDom[key].show();
        		}else if(currentTarget.is("dd li a")){
                    if(self.asynData){
                        e.preventDefault();
					}
        			var obj= {
        				"cityId":$(this).attr("data-id"),
        				"cityName":$(this).text(),
        				"regionId":$(this).attr("data-regionid"),
        				"url":$(this).attr("data-url"),
        				"citySpell":$(this).attr("data-citySpell")
        			}

        			self.element.parent(".sel-city-wrapper").find(".upArrow-icon").removeClass('upArrow-icon').addClass('downArrow-icon');
        			var domain = tools.wildcardUrl();
        			if(self.opts.isSetCookie){
        				var cookieString = "selectcity=" + obj.cityId + ";path=/;domain=" + domain;
	        			var cookieString_selectCityId = "selectCityId=" + obj.cityId + ";path=/;domain=" + domain;
	        			document.cookie = cookieString;
	        			document.cookie = cookieString_selectCityId;
        			}


					// tools.setCookie("selectcity",obj.cityId,"",domain);
					if(self.asynData){
                        setTimeout(function(){
                            self.element.find('.area-city-con').text(obj.cityName);

                            //调用头部的城市切换
                            if(window.selCityHeader && self.element.parent(".sel-city-wrapper").attr("data-relation")=="true"){
                                window.selCityHeader(obj);
                            }

                            //全局的返回函数
                            if(window.selCityCallback && self.element.parent(".sel-city-wrapper").attr("data-relation")=="true"){
                                window.selCityCallback(obj);
                            }

                            //自身单独回调
                            self.opts.callBacks(obj);
                        },300);
					}
        			self.cityDom.hide();
        		}else if(currentTarget.is(".icon-close")){
        			self.cityDom.hide();
        			self.element.parent(".sel-city-wrapper").find(".upArrow-icon").removeClass('upArrow-icon').addClass('downArrow-icon');
        		}
        	});
        	self.element.on("click",function(e){
        		e.preventDefault();
        		e.stopPropagation();
        		self.element.parent(".sel-city-wrapper").find(".sel-city-nav span").removeClass("active");
        		self.element.parent(".sel-city-wrapper").find(".sel-city-nav span:first").addClass("active");
        		self.element.parent(".sel-city-wrapper").find(".sel-city-menu div[data-panel]").hide();
        		self.element.parent(".sel-city-wrapper").find(".sel-city-menu div[data-panel]:first").show();
        		// console.log(self.cityDom)
        		if(self.cityDom.is(":visible")){
					self.cityDom.hide();
					self.element.parent(".sel-city-wrapper").find(".upArrow-icon").removeClass('upArrow-icon').addClass('downArrow-icon');
        		}else{
        			//隐藏其他下拉菜单
        			$(".drop-layer:visible").hide();
                    $(".up-arrow").removeClass('up-arrow');
                    $(".upArrow-icon").removeClass('upArrow-icon').addClass('downArrow-icon');

        			self.element.parent(".sel-city-wrapper").find(".downArrow-icon").removeClass('downArrow-icon').addClass('upArrow-icon');
        			// console.log(self.cityData)
        			if(self.cityData == ""){
        				self.loadCity();
        			}
        			self.cityDom.show();
        		}

        	})
        	//DOM点击关闭
        	$(document).on("click",function(e){
        		var target = $(e.target);
        		if (!target.is(self.cityDom) && target.parents(".sel-city-menu").length <= 0 && target != self.element) {
		          self.cityDom.hide();
		          self.element.parent(".sel-city-wrapper").find(".upArrow-icon").removeClass('upArrow-icon').addClass('downArrow-icon');
		        }
        	});
        },
		// 改变参数
		setOptions:function(options) {
			this.opts = $.extend(this.opts, options);
			this.cityData = '';
			this.cityDom.html('<div class="city-loading"></div>');
		}
    }

/*扩展方法*/
$.fn.selCity = function(options){
    if (!$(this).data('selCity')) {
        var selCity = new SelCity(this,options);
        $(this).data('selCity', selCity);
    } else {
        $(this).data('selCity').setOptions(options);
    }
    return this;
};

module.exports = $
