$(function() {

	var pageInit = (function() {
		var currentUrl = window.location.href;
		return {
			currentUrl: currentUrl
		}
	})();
	/*
	 *兼容老页面 变量
	 */
	IpLocation = null;
	Taoche.afterLocation(function() {
		var taocheTp = Taoche.IpLocation,
			cityId = taocheTp.cityId,
			citySpell = taocheTp.citySpell,
			cityName = taocheTp.cityName,
			areaType = taocheTp.bigAreaId;

		IpLocation = {
			AllSpell: citySpell,
			AreaId: cityId,
			AreaName: cityName,
			AreaType: areaType
		};

		//足迹
		;
		(function($, window) {
			var footprint = Cookie.getCookieDecode('taoche_userhistory');
			if(!!footprint) {
				var footprint = JSON.parse(footprint);
				if(footprint.length > 0) {
					var liFormat = '',
						spell = "http://" + citySpell,
						footHref = "";
					for(var i = 0, footprintLen = footprint.length; i < footprintLen; i++) {
						footHref = footprint[i].url;
						liFormat += '<li><a logwt="wap_list_history" href="' + footHref + '">' + footprint[i].name.replace(/[+]/g, " ") + '</a></li>';
					}
					$("#footprintUl").append(liFormat);
				} //footprint.length end
			} //footprint end
			var footprintUl = $("#footprintUl");
			if($("#footprintUl").find("li").length > 0) {
				$("#footPrint").show();
			}
		})($, window);

		//加载搜索插件
		;
		(function() {
			Taoche.suggest.render({
				inputEle: '#txtSearch',
				showListEle: '#divList',
				showHisEle: '#divHistorySearch',
				clearHisEle: '#clearHistory',
				targetUrl: "http://" + citySpell + ".m.taoche.com",
				clickSearchEles: '#btnSearch'
			});
		})();
		//
		;
		(function() {
			$(function() {
				var url = "http://m.taoche.com/select/selectcity.aspx?rul={0}&t={1}".format([encodeURIComponent($("#paramHid").val()), (+new Date())]);
				$("#currentCity").attr("href", url).text(cityName);
			});
		})();

		//非帮忙城市我要贷款链接
		if(!Taoche.isBangMaiCity(cityId)) {
			$("#liDaikuan").attr("href", "http://cooper.m.taoche.com/mtaoche/chedai/?frompage=1");
		}
	});
	//辅助滚动对象
	var scrollJs = {
		scrollTopExt: 0,
		type: false,
		getPostion: function() {
			this.scrollTopExt = $(document).scrollTop();
		},
		filterNav: $("#filterNav"),
		resetPostion: function() {
			var that = this;
			$(document).scrollTop(that.scrollTopExt);
			that.filterNav.find('ul')[0].style.cssText = (that.scrollTopExt >= parseInt(that.filterNav.offset().top)) ? "position: fixed;top:-1px;left:0;z-index:1009;-webkit-transform:translateZ(1009px);-moz-transform:translateZ(1009px);-o-transform:translateZ(1009x);transform:translateZ(1009px);  " : "position: relative;top:0;left:0;z-index:1;-webkit-transform:translateZ(0);-moz-transform:translateZ(0);-o-transform:translateZ(0);transform:translateZ(0);";
		},
		prevent: function() {
			arguments[0].preventDefault();
		},
		newHeader: $(".new-header"),
		setHeaderIndex: function(value) {
			this.newHeader.css({
				"z-index": value
			});
		}
	};
	//列表页面之前的逻辑代码
	;
	(function($, window) {
		/*
		 *Version:0.1  重置只重置筛选页面内容最终版
		 *2016-10-9 16:03:24
		 *DES:移动站3.0改版
		 *修改记录：2016年11月8日17:02:56  添加搜索浮层 
		 *2017-1-9 14:23:37
		 *修改记录：搜索浮层bug
		 */

		/*========================ljw==================*/
		//车源数量
		window.setTimeout(function() {
			$("#count_pop_ixedfloat").hide();
		}, 2000);
		/*筛选参数处理*/
		var parametersHelper = {
			param: {
				p: "",
				g: "",
				e: "",
				s: "",
				b: '',
				x: '',
				c: '',
				d: '',
				z: '',
				a: '',
				o: '',
				q: '',
				t: "",
				r: ""
			},
			paramext: {
				pic: '', //有图
				bm: '', //帮买
				newcar: '', //准新车
				cy: "", //国别
				active: '', //活动
				lp: "", //低价格
				hp: "" //高价格
			},
			isclickcloseBtn: false,
			paramextHidden: {}, //私有变量
			addTouchstartEvent: function(selector) {
				$(document).off(clickEventName["touchstart"], selector);
				$(document).on(clickEventName["touchstart"], selector, function(ev) {
					touchHelper.startX = touchHelper.getCoord(ev, 'X');
					touchHelper.startY = touchHelper.getCoord(ev, 'Y');
				});
			},
			addTouchendEvent: function(selector, callback) {
				$(document).off(clickEventName["touchend"], selector);
				$(document).on(clickEventName["touchend"], selector, function(ev) {
					if(Math.abs(touchHelper.getCoord(ev, 'X') - touchHelper.startX) < 10 && Math.abs(touchHelper.getCoord(ev, 'Y') - touchHelper.startY) < 10) {
						typeof callback === "function" && callback($(this));
					}
				});
			},
			subParam: '',
			urlToJson: function(isreset) {
				var self = this,
					paramHid = $("#paramHid").val(),
					paramHidArr = paramHid.split('/');
				paramHidArr = _.without(paramHidArr, ""),
					paramLen = paramHidArr.length;

				//二级参数
				self.subParam = paramHidArr[0] || "";
				if(self.subParam == "all") {
					self.subParam = "buycar";
				}
				//三级参数分割处理
				var fragParam = "",
					fragParamExt = "";
				switch(paramLen) {
					case 2:
						if(paramHidArr[1].indexOf("?") === 0) {
							fragParamExt = paramHidArr[1];
						} else {
							fragParam = paramHidArr[1];
						}
						break;
					case 3:
						fragParam = paramHidArr[1];
						fragParamExt = paramHidArr[2];
						break;
				}
				//点击了重置按钮
				if(isreset) {
					fragParam = "pgesbxcdzaoqtr";
				}

				//辅助参数定义
				var valArr = [],
					keyArr = [],
					val = "";
				//开始分割参数
				if(!!fragParam) {
					fragParam = fragParam.toLowerCase();

					var arrs = fragParam.split("");
					for(var i = 0, len = arrs.length; i < len; i++) {
						var item = arrs[i].toString();
						if(!isNaN(item)) { //如果是数字就加起来
							val += item;
							if(i === len - 1) {
								valArr.push(val);
							}
						} else {
							if(self.param.hasOwnProperty(item) && keyArr.indexOf(item) === -1) { //判断是否是自己的属性
								keyArr.push(item);
							}
							if(i > 0) {
								valArr.push(val);
							}
							val = "";
						} // if else end
					}

					if(valArr.length <= keyArr.length) { //
						for(var i = 0, len = keyArr.length; i < len; i++) {
							self.param[keyArr[i]] = valArr[i] || '';
						}
					}
				}
				self.urlToJsonExt(fragParamExt, isreset); //？后面的参数
				self.initPrice();
			},
			urlToJsonExt: function(url, isreset) {
				var hash,
					extJson = {},
					hashes = url.slice(url.indexOf('?') + 1).split('&');
				hashes = _.without(hashes, ""); //去掉空元素
				var paramext = this.paramext;
				for(var i = 0; i < hashes.length; i++) {
					hash = hashes[i].split('=');
					if(!!hash[0]) {
						extJson[hash[0]] = hash[1];
					}
				}
				this.paramext = isreset ? paramext : $.extend({}, paramext, extJson); //其它参数合并
			},
			shaixuanUrl: "",
			initSelectAndEvent: function() {
				$("div.sortbox-condition li.cur").removeClass("cur"); //删除所有的cur 重置的时候用
				$("div.sortbox-condition s.selected-item").text(""); //删除所有的cur 重置的时候用
				this.btnSureState($("#allCount").val()); //总数
				var param = this.param;
				paramext = this.paramext;
				/*===初始化 车龄 级别 排量 排放标准 里程 的选中状态和注册事件  start===*/
				var carAgeId = parseInt(param.a) || 0, //车龄
					levelId = parseInt(param.g) || 0, //级别
					exhaustId = parseInt(param.e) || 0, //排量
					emissionId = parseInt(param.o) || 0, //排放标准
					mileageId = parseInt(param.x) || 0, //里程
					sourceid = parseInt(param.s) || 0; //来源 比较特殊 绑定事件需要特殊处理

				var objSingle = {
					carAgeId: carAgeId,
					levelId: levelId,
					exhaustId: exhaustId,
					emissionId: emissionId,
					mileageId: mileageId,
					sourceid: sourceid
				};
				var shaixuan = $(".shaixuan");
				for(var item in objSingle) {
					if(objSingle[item] > 0) {
						if(item == "sourceid") {
							$("#sourceid>li.sourceid[data-id='" + objSingle[item] + "']").addClass("cur");
						} else {
							$("#" + item + ">li[data-id='" + objSingle[item] + "']").addClass("cur");
						}

						if(!shaixuan.hasClass("selected")) {
							shaixuan.addClass('selected');
						}
					}
					var selector = "#" + item + ">li";
					if(item == "sourceid") { //来源 比较特殊，注册时间需要特殊处理
						selector += ".sourceid";
					}
					this.addTouchstartEvent(selector);
					this.addTouchendEvent(selector, function(that) {
						var id = that.attr("data-id"),
							parent = that.parent(),
							parentId = parent[0].id,
							ps = parent.attr("data-ps");
						if(that.hasClass("cur")) { //点击取消
							that.removeClass("cur");
							parametersHelper.param[ps] = "";
						} else { //点击选中
							if(parentId == "sourceid") { //来源特殊处理
								that.addClass("cur").siblings(".sourceid").removeClass("cur"); //
							} else {
								that.addClass("cur").siblings(".cur").removeClass("cur"); //
							}

							var newcar = $(".newcar");
							if((parentId == "carAgeId" || parentId == "mileageId") && newcar.hasClass('cur')) {
								newcar.removeClass('cur');
								parametersHelper.paramext["newcar"] = "";
							}
							parametersHelper.param[ps] = id;
						}
						//TODO跳转页面
						parametersHelper.getlist();
					});
				}

				/*===初始化 车龄 级别 排量 排放标准 里程 的选中状态  end===*/

				/*===初始化 变速箱的选中状态  start===*/
				var gearBoxId = param.b, //变速箱  ++
					gearBoxArr = !!gearBoxId ? gearBoxId.split('98') : [];
				for(var i = 0, gearLen = gearBoxArr.length; i < gearLen; i++) {
					$("#gearBoxId>li[data-id='" + gearBoxArr[i] + "']").addClass("cur");
				}
				var gearSelector = "#gearBoxId>li";
				this.addTouchstartEvent(gearSelector);
				this.addTouchendEvent(gearSelector, function(that) {
					var id = that.attr("data-id"),
						parent = that.parent();
					ps = parent.attr("data-ps");
					if(that.hasClass("cur")) { //点击取消
						that.removeClass("cur");
					} else { //点击选中
						that.addClass("cur").siblings(".cur").removeClass("cur");
					} //else  end
					//统计选中的项
					var lis = parent.find("li.cur"),
						arrSelect = [];
					for(var i = 0, len = lis.length; i < len; i++) {
						(function(i) {
							var id = $(lis[i]).attr("data-id");
							arrSelect.push(id);
						})(i);
					}
					parametersHelper.param[ps] = arrSelect.length > 0 ? arrSelect.join("98") : '';
					//TODO跳转页面
					parametersHelper.getlist();
				});
				/*初始化 变速箱的选中状态  end*/

				/*===初始化 参数 保障车 准新车 有图 来源  国别 选中状态 start===*/
				for(var elseitem in paramext) {
					var else_val = parseInt(paramext[elseitem]) || 0;
					if(!!else_val) {
						var else_selectEd = $(".else_select").find("li." + elseitem + "[data-id='" + else_val + "']");
						else_selectEd.addClass("cur");
						if(elseitem == "cy") { //国别
							var elseTxt = else_selectEd.find("a").text();
							else_selectEd.parent().parent().siblings("div.stle-close").find("s.selected-item").text(elseTxt);
						}
					}
					var elseLiSector = ".else_select>li." + elseitem;
					this.addTouchstartEvent(elseLiSector);
					this.addTouchendEvent(elseLiSector, function(that) {
						var type = that.attr("data-type"),
							parent = that.parent(),
							parentId = parent[0].id,
							id = that.attr("data-id");
						if(that.hasClass("cur")) { //点击取消
							that.removeClass("cur");
							parametersHelper.paramext[type] = "";
							if(type == "cy") { //国别特殊处理
								that.parent().parent().siblings("div.stle-close").find("s.selected-item").text("");
							}
						} else { //点击选中
							that.addClass("cur");
							if(parentId !== "sourceid") {
								that.siblings("li.cur").removeClass("cur");
							}
							parametersHelper.paramext[type] = id;
							if(type == "cy") { //国别特殊处理
								var txt = that.find("a").text();
								that.parent().parent().siblings("div.stle-close").find("s.selected-item").text(txt);
							}
							/*
							 *Date:2017年2月17日15:03:10
							 *修改人：刘建伟
							 *内容：选中准新车的时候，去掉车龄和里程选项
							 */
							if(type == "newcar") {
								$("#carAgeId li.cur").removeClass('cur');
								$("#mileageId li.cur").removeClass('cur');
								parametersHelper.param["a"] = '';
								parametersHelper.param["x"] = '';
							}
						}
						//TODO
						parametersHelper.getlist();
					});
				}

				/*===初始化 参数 保障车 准新车 有图 来源  国别  选中状态 end===*/

				/*===初始化 驱动  车身 燃料 颜色 选中状态 start===*/
				var carDriveId = parseInt(param.q), //驱动
					carBodyId = parseInt(param.t), //车身
					carFuelId = parseInt(param.r), //燃料
					carColorId = parseInt(param.c); //颜色 特殊处理

				/*其它更多选择*/
				var objElseSelect = {
					carDriveId: carDriveId,
					carBodyId: carBodyId,
					carFuelId: carFuelId,
					carColorId: carColorId
				};
				//辅助方法
				function addSelectedTxt(that, id) {
					var txt = (id == "carColorId") ?
						that.find("p").text() :
						that.find("a").text();
					if(!!txt) {
						that.parent().parent().siblings("div.stle-close").find("a").find("s.selected-item").text(txt);
					} //if !txt end
				} //function end
				function cancelSelectedTxt(that) {
					that.parent().parent().siblings("div.stle-close").find("a").find("s.selected-item").text('');
				}

				for(var item2 in objElseSelect) {
					if(!isNaN(objElseSelect[item2])) {
						var item2Selector = $("#" + item2 + ">li[data-id='" + objElseSelect[item2] + "']");
						item2Selector.addClass("cur");
						//选中的文字内容
						addSelectedTxt(item2Selector, item2);
					} //if isNaN 结束 
					//注册事件
					var item2_selector = "#" + item2 + ">li";
					this.addTouchstartEvent(item2_selector);
					this.addTouchendEvent(item2_selector, function(that) {
						var id = that.attr("data-id"),
							parent = that.parent(),
							ps = parent.attr("data-ps");
						if(that.hasClass("cur")) { //点击取消
							that.removeClass("cur");
							cancelSelectedTxt(that); //
							parametersHelper.param[ps] = "";
						} else { //点击选中
							parentId = parent[0].id;
							that.addClass("cur").siblings(".cur").removeClass("cur"); //
							//选中文字
							addSelectedTxt(that, parentId);
							parametersHelper.param[ps] = id;
						} // else 结束

						//TODO跳转页面
						parametersHelper.getlist();
					});
				} // for 循环 end
				/*===初始化 驱动  燃料 车身 颜色 选中状态 end===*/

				/*===初始化 亮点配置  start===*/
				var carConfigId = param.z, //亮点配置
					carConfigIdArr = !!carConfigId ? carConfigId.split("98") : [],
					configTxt = [];
				for(var i = 0, configLen = carConfigIdArr.length; i < configLen; i++) {
					var configItemSeclector = $("#carConfigId>li[data-id='" + carConfigIdArr[i] + "']");
					configItemSeclector.addClass("cur");
					configTxt.push(configItemSeclector.find('a').text());
				}
				$("s.txtElps").text(configTxt); //选中的文本
				//注册事件
				var configSelector = "#carConfigId>li";
				this.addTouchstartEvent(configSelector);
				this.addTouchendEvent(configSelector, function(that) {
					var id = that.attr("data-id"),
						parent = that.parent();
					ps = parent.attr("data-ps");
					if(that.hasClass("cur")) { //点击取消
						that.removeClass("cur");
					} else { //点击选中
						that.addClass("cur");
					} //else  end
					//统计选中的项
					var configLis = parent.find("li.cur"),
						configArrSelect = [],
						configArrSelectTxt = [];
					for(var i = 0, len = configLis.length; i < len; i++) {
						(function(i) {
							var selector = $(configLis[i]),
								id = selector.attr("data-id"),
								txt = selector.find("a").text();
							configArrSelect.push(id);
							configArrSelectTxt.push(txt);
						})(i);
					} //for end
					parametersHelper.param[ps] = configArrSelect.length > 0 ? configArrSelect.join("98") : '';
					$("s.txtElps").text(configArrSelectTxt.join(',')); //选中的文本
					//TODO跳转页面
					parametersHelper.getlist();
				});
				/*===初始化 亮点配置 end===*/

				//重置 
				this.btnResetState();
			},
			btnResetState: function() {
				var able = false;
				for(var item in parametersHelper.param) {
					if(!!parametersHelper.param[item]) {
						if(item !== "d") {
							able = true;
						}
						break;
					}
				}
				if(!able) {
					for(var item in parametersHelper.paramext) {
						if(parametersHelper.paramext[item]) {
							able = true;
							break;
						}
					}
				}
				if(!(this.subParam == "buycar")) {
					able = true;
				}
				able ? $("#resetSelect").removeClass('li-reset-no') : $("#resetSelect").addClass('li-reset-no');
			},
			btnSureState: function(data) {
				data = parseInt(data) || 0;
				var count = $("#count");
				if(!!data) {
					$("#shaixuanSure").removeClass('li-sure-no');
					count.prev().text("确定");
					count.show();
					count.find("i").text(data);
				} else {
					$("#shaixuanSure").addClass('li-sure-no');
					count.prev().text("暂无符合条件车源");
					count.hide();
				}
			},
			getlist: function() {
				this.btnResetState();
				//拼接参数
				var param = this.param,
					paramext = this.paramext,
					urlArr = [this.subParam],
					paramStr = "",
					paramextStr = "",
					val = "",
					shaixuanUrl = "";
				for(var item1 in param) {
					paramStr += item1;
					paramStr += param[item1];
				}
				for(var item2 in paramext) {
					val = paramext[item2];
					if(!!val) {
						paramextStr += item2;
						paramextStr += "=";
						paramextStr += paramext[item2];
						paramextStr += "&";
					}
				}
				if(!!paramStr) {
					urlArr.push(paramStr);
				}
				if(!!paramextStr) {
					paramextStr = "?" + paramextStr.substr(0, paramextStr.length - 1);
					urlArr.push(paramextStr);
				}
				shaixuanUrl = urlArr.join("/");
				shaixuanUrl = "/" + shaixuanUrl;
				if(urlArr.length <= 2) {
					shaixuanUrl += "/?act=pgcount";
				} else {
					shaixuanUrl += "&act=pgcount";
				}
				this.shaixuanUrl = shaixuanUrl;
				$.ajax({
					type: 'get',
					url: shaixuanUrl,
					success: function(data) {
						parametersHelper.btnSureState(data);
					}
				});
			},
			initPrice: function() {
				var lp = this.paramext["lp"],
					hp = this.paramext["hp"];
				!!lp && $("#firstPrice").val(lp);
				!!hp && $("#secondPrice").val(hp);
				if(!!lp || !!hp) {
					$(".sortbox-price li.cur").removeClass("cur");
				}
			},
			init: function() {
				this.initBtnEvent();
				this.initDefault(false);
				this.searchValue();
			},
			initDefault: function(isreset) {
				this.urlToJson(isreset);
				this.initSelectAndEvent();
				this.isclickcloseBtn = false;
			},
			initBtnEvent: function() {
				/*===初始化 重置 start===*/
				$(document).off(clickEventName["touchend"], "#resetSelect");
				$(document).on(clickEventName["touchend"], "#resetSelect", function() {
					if(!$(this).hasClass('li-reset-no')) {
						//活动
						$("#footprintUl").find("a.selected").removeClass("selected");
						//其它
						for(var item in parametersHelper.param) {
							parametersHelper.param[item] = "";
						}
						for(var item in parametersHelper.paramext) {
							parametersHelper.paramext[item] = "";
						}
						$("#paramHid").val("/all/");
						var arrId = [{
							id: "#priceId",
							txt: "价格"
						}, {
							id: "#brandId",
							txt: "品牌"
						}, {
							id: "#orderId",
							txt: "排序"
						}];
						for(var i = 0, len = arrId.length; i < len; i++) {
							var thisObj = arrId[i];
							$(thisObj.id).removeClass("selected").find("em").text(thisObj.txt); //priceId 价格
						}
						parametersHelper.initDefault(true);
						parametersHelper.getlist(); //重新计算数字
						$("#resetSelect").addClass("li-reset-no");
						//提示
						$("#filter_pop_fixedfloat").show();
						window.setTimeout(function() {
							$("#filter_pop_fixedfloat").hide();
						}, 1000);
					} // if end
				}); //
				/*===初始化 重置 end===*/

				/*===初始化 筛选确认 start===*/
				$(document).off(clickEventName["touchend"], "#shaixuanSure");
				$(document).on(clickEventName["touchend"], "#shaixuanSure", function(e) {
					if(!$(this).hasClass('li-sure-no')) {
						$("#divMark").trigger("click");
						window.location.href = Taoche.removeQuery("act", parametersHelper.shaixuanUrl); // 
					}
					e.preventDefault();
					return false;
				}); //shaixuanSure
				/*===初始化 筛选确认 end===*/
			},
			searchValue: function() {
				var value = document.getElementById('hidKeyword').value;
				if(!!value) {
					$("div.seach>input.search_custom").attr("placeholder", value);
				}
			}
		};
		//初始化筛选
		parametersHelper.init();
		//品牌 不限品牌功能 moreBrand
		(function($, window) {
			var self = this,
				paramHid = $("#paramHid").val(),
				paramHidArr = paramHid.split('/'),
				moreBrand = $("#moreBrand").find('a'),
				url = "";
			paramHidArr = _.without(paramHidArr, ""),
				paramLen = paramHidArr.length;

			switch(paramLen) {
				case 1:
					url = paramHidArr.join('/'); // "/" + paramHidArr.join('/') + "/";
					break;
				case 2:
					if(paramHidArr[1].indexOf("?") === 0) {
						paramHidArr[0] = "all";
						url = paramHidArr.join('/'); //  "/" + paramHidArr.join('/') + "/";
					} else {
						paramHidArr[0] = "buycar";
						url = paramHidArr.join('/'); // "/" + paramHidArr.join('/');
					}
					break;
				case 3:
					paramHidArr[0] = "buycar";
					url = paramHidArr.join('/'); // "/" + paramHidArr.join('/');
					break;
			}
			url = '/' + url;
			if(url.indexOf("?") == -1) {
				url = url + '/';
			}
			moreBrand.attr("href", url);
		})($, window);
		/////////////////////////////
		var touchHelper = {
			startX: 0,
			startY: 0,
			tap: "",
			getCoord: function(e, c) {
				return /touch/.test(e.type) ? (e.originalEvent || e).changedTouches[0]['page' + c] : e['page' + c];
			},
			setTap: function() {
				j_xuanObj.tap = true;
				setTimeout(function() {
					j_xuanObj.tap = false;
				}, 500);
			},
			init: function() {
				this.startX = 0;
				this.startY = 0;
				this.tap = "";
			}
		};
		//选择的城市
		var AreaId = $("#hidAreaId").val();
		//是否帮买城市
		var IsBmCity = Taoche.isBangMaiCity(AreaId); //bangmaiCity.indexOf("," + AreaId + ",") > -1 ? true : false;
		//列表
		var listHelper = {
			loadingShow: function() {
				$(".loadingTip").show();
			},
			loadingHide: function() {
				$(".loadingTip").hide();
			},
			not: false,
			divId: "",
			init: function() {
				this.divId = !!this.aroundPageCount ? $(".carlist-around ul") : $(".carlist-inner-div ul");
			},
			pageIndex: 1,
			aroundPageCount: parseInt($("#aroundPageCount").val()) || 0,
			pageCount: parseInt($("#pageCount").val()) || 0,
			getdatabyindex: function() {
				var self = this;
				if(!self.not) {
					listHelper.pageIndex += 1;
				   var currentUrl = Taoche.addQuery("page", (listHelper.pageIndex), pageInit.currentUrl);
					currentUrl = Taoche.addQuery("act", "pgnext", currentUrl);
					if(!!self.aroundPageCount) {
						self.pageCount = self.aroundPageCount;
						currentUrl = Taoche.addQuery("around", "aroundcar", currentUrl);
					}
					if(self.pageIndex > self.pageCount) {
						$(".nomoreTip").show();
						self.loadingHide();
						self.not = true;
					}

					if(!self.not) {
						currentUrl = Taoche.removeQuery("t", currentUrl) + "&t=" + (+new Date());
						$.ajax({
							type: 'get',
							url: currentUrl,
							beforeSend: function() {
								self.loadingShow();
								self.not = true;
							},
							success: function(data) {
								self.loadingHide();
								if(!!data) {
									self.divId.append(data);
									if(listHelper.pageIndex <= 4 && !listHelper.aroundPageCount) {
										//插入广告 第26个位置
										InsertAd();
									}
								}
								if(!listHelper.aroundPageCount && listHelper.pageIndex == 5) {
									var value = Cookie.getCookie("mt_taoche_appdownload_tishi");
									if(!value) {
										$("#divOpenApp,#divBMMark").show();
										var date = new Date();
										date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000));
										Cookie.setCookie("mt_taoche_appdownload_tishi", 1, date.toGMTString(), "/", "m.taoche.com", null);
										var downloadUrls = $("#hidAppParams").val();
										DownloadApp.init({
											divId: "divOpenApp", //展示层Id  必填
											appDownloadId: "divOpenApp_dowload", //下载按钮Id; 必填
											clickCloseDiv: false, //点击下载之后是否自动关闭;
											stayShow: true,
											blurCloseDiv: false,
											androidUrlChange: false,
											downloadUrls: {
												ios: 'http://itunes.apple.com/cn/app/er-shou-che/id421347528?mt=8',
												android: 'http://app.yiche.com/19/c32'
											},
											config: {
												scheme_IOS: downloadUrls,
												scheme_Adr: downloadUrls,
												other: downloadUrls,
												timeout: 2000
											}
										});

									}
								}
								$('img.asynImg[src="http://st1.taoche.cn/taoche/wap/v3.0/images/lazyload.png"]').lazyload({
									threshold: liHeight
								});
								self.not = false;
							}
						});
					}
				}
			}
		};
		listHelper.init();

		/*--------------滑动分页加载车源----start------*/
		(function() {
			//异步加载精准车源
			var currentUrl = pageInit.currentUrl,
				orderid = Taoche.getQuery("orderid", currentUrl), //Taoche.getQuery(name, url)
				sdata = $("#hidData").val(),
				sourceid = parseInt($('#hidSouceId').val()),
				isactive = parseInt($('#hidIsActiveJd').val()),
				mode = $("#hidMode").val();

			//活动条件不显示精准车源
			var bangmaiCar = $('#hidBangMaiCar').val();
			if(isNaN(bangmaiCar))
				bangmaiCar = 0;
			else {
				bangmaiCar = parseInt(bangmaiCar, 10);
			}
			//放开保障车
			if(listHelper.pageIndex < 2 && orderid < 1 && isactive < 1 && bangmaiCar == 0) {
				var data = {
					"sdata": escape(sdata),
					"pg": listHelper.pageIndex,
					"mode": mode,
					"areaid": AreaId,
					"r": (+new Date())
				};
				$.post("/ajax/listad2016.ashx", data, function(res) {
					$(".carlist-inner-div ul").prepend(res);
					$(".carlist-inner-div").parent().show();
					//加载完精准车源后 插入广告 第11\16个位置
					InsertAd(1);
					$("li[data]").each(function() {
						var ucarid = $(this).attr("data");
						$("#li" + ucarid).hide();
					});
					try {
						Asyncpcview();
					} catch(e) {}
				});
			} else {
				//插入广告 第11\16个位置
				InsertAd(1);
			}
		})();
		/*--------------滑动分页加载车源----end------*/

		/*--------------------车源较少和没结果------start---------*/

		var lessCarSource = {
			bid: $("#hidMBrandId").val(),
			not: true,
			isClick: false,
			similarisfirst: true,
			zhoubianfirst: true,
			showloading: true,
			type: 0,
			csid: 0,
			brandIndex: 1,
			brandCount: 0,
			cityIndex: 1,
			cityCount: 0,
			list: (function() {
				var curcid = 0,
					sid = 0,
					cityid = 0,
					cids = "",
					paramArr = ["/aspxajax/getrelatecitycarlist"],
					returnUrl = "",
					$hidSerialId = $("#hidSerialId");
				//对象转url
				var paramTourl = function(options) {
					var urlExtObj = $.extend({}, paramext, options),
						paramextStr = "";
					for(var item2 in urlExtObj) {
						val = urlExtObj[item2];
						if(!!val && val !== "0") {
							paramextStr += item2;
							paramextStr += "=";
							paramextStr += urlExtObj[item2];
							paramextStr += "&";
						}
					}
					return !!paramextStr ? ("?" + paramextStr.slice(0, paramextStr.length - 1)) : "";
				};
				//初始化参数
				var initParam = function() {
					var paramStr = '',
						paramextStr = "";

					//获取当前页面参数
					param = $.extend({}, parametersHelper.param);
					paramext = $.extend({}, parametersHelper.paramext);
					//补充新参数
					paramext["sid"] = sid;
					for(var item1 in param) {
						paramStr += item1;
						paramStr += param[item1];
					}
					paramArr.push(paramStr); //固定参数
					//?后面的参数

					var urlExt = paramTourl({
						curcid: curcid,
						sid: sid
					});
					var arr = copyArray(paramArr);
					if(!!urlExt) {
						arr.push(urlExt);
					}
					url = arr.join('/');
					return url;
				};
				//深拷贝一份参数数组
				var copyArray = function(pArr) {
					var arr = [];
					for(var i = 0, len = pArr.length; i < len; i++) {
						arr.push(pArr[i]);
					}
					return arr;
				};
				//ajax获取数据
				var getHomeAroundcars = function() {
					if(!lessCarSource.not) {
						var curUrl = Taoche.addQuery("bid", lessCarSource.bid, returnUrl);
						$.ajax({
							type: 'get',
							url: curUrl,
							beforeSend: function() {
								lessCarSource.not = true;
							},
							success: function(data) {
								data = eval("(" + data + ")");
								if(!!data.data) {
									initBlock(data);
								}
							},
							error: function(data) {}
						});
					} //not end

				};
				//
				var getCityAroundcars = function(type) {
					if(lessCarSource.cityIndex == 1 && !type) {
						lessCarSource.cityIndex += 1;
					}
					if(!lessCarSource.not) {
						if(lessCarSource.cityIndex > lessCarSource.cityCount && !!lessCarSource.cityCount) {
							$("#cityCarlist").find('.bot-sxdiv-no').show();
							return false;
						}
						var curUrl = Taoche.addQuery("page", lessCarSource.cityIndex, returnUrl);
						curUrl = Taoche.addQuery("type", lessCarSource.type, returnUrl);
						curUrl = Taoche.addQuery("cityid", cityid, returnUrl);
						curUrl = Taoche.addQuery("cids", !!cids ? cids : "", returnUrl);
						curUrl = Taoche.addQuery("bid", lessCarSource.bid, returnUrl);
						$.ajax({
							type: 'get',
							url: curUrl,
							beforeSend: function() {
								lessCarSource.not = true;
								if(lessCarSource.showloading) {
									$("#cityCarlist").find('.bot-sxdiv-loading').show();
								}
							},
							success: function(data) {
								data = eval("(" + data + ")");
								if(!!data.data) {
									var tempData = data.data;
									lessCarSource.cityCount = tempData.pagecount,
										lessCarSource.cityIndex = tempData.pageindex;
									var options = {
										way: tempData.pageindex === 1 ? "html" : "append",
										data: tempData.cityCarList,
										index: tempData.pageindex
									};
									bindCityListData(options);
									if(lessCarSource.cityIndex >= lessCarSource.cityCount) {
										$("#cityCarlist").find('.bot-sxdiv-no').show();
									}
									lessCarSource.cityIndex += 1;
									lessCarSource.not = false;
								} else {
									console.log('home error');
								}
								$("#cityCarlist").find('.bot-sxdiv-loading').hide();
								lessCarSource.showloading = true;
							}
						});
					} //not end
				};
				//
				var getBrandAroundcars = function() {
					lessCarSource.csid = lessCarSource.csid || 0;
					if(!lessCarSource.not) {
						if(lessCarSource.brandIndex > 1 && lessCarSource.brandIndex > lessCarSource.brandCount) {
							$("#brandCarlist").find('.bot-sxdiv-no').show();
							return false;
						}
						if(lessCarSource.brandIndex === 1 && lessCarSource.brandCount === 1) {
							$("#brandCarlist").find('.bot-sxdiv-no').show();
							return false;
						}

						var curUrl = Taoche.addQuery("page", lessCarSource.brandIndex, returnUrl);
						curUrl = Taoche.addQuery("type", lessCarSource.type, curUrl);
						curUrl = Taoche.addQuery("sid", !!sid ? sid : $.trim($hidSerialId.val()), curUrl);
						curUrl = Taoche.addQuery("csid", lessCarSource.csid, curUrl);

						$.ajax({
							type: 'get',
							url: curUrl,
							beforeSend: function() {
								lessCarSource.not = true;
								if(lessCarSource.showloading) {
									$("#brandCarlist").find('.bot-sxdiv-loading').show();
								}
							},
							success: function(data) {
								document.querySelector('#brandCarlistUI').removeAttribute("style");
								data = eval("(" + data + ")");
								if(!!data.data) {
									var tempData = data.data;
									lessCarSource.brandCount = tempData.pagecount,
										lessCarSource.brandIndex = tempData.pageindex;
									var options = {
										way: lessCarSource.brandIndex === 1 ? "html" : "append",
										data: tempData.serialCarList,
										index: lessCarSource.brandIndex
									};
									bindBrandListData(options);
									if(lessCarSource.brandIndex >= lessCarSource.brandCount) {
										$("#brandCarlist").find('.bot-sxdiv-no').show();
									}
									lessCarSource.brandIndex += 1;
									lessCarSource.not = false;
								} else {
									console.log('home error');
								}
								$("#brandCarlist").find('.bot-sxdiv-loading').hide();
								lessCarSource.showloading = true;
							}
						});
					} //not end

				};
				//初始化标签的显示和隐藏

				var bindCityListData = function(options) {
					var defaultOptions = {
						way: "html",
						data: [],
						index: 1,
						size: 20
					};
					var opt = $.extend({}, defaultOptions, options);
					htmlRender.render({
						containerid: "#cityCarlist ul",
						templateid: "#cityCarListTemplate",
						data: {
							listtype: 1,
							size: opt.size,
							index: opt.index,
							data: opt.data
						},
						type: opt.way
					});
					var hidMode = $.trim($("#hidMode").val());
					if(hidMode == 2) {
						$("#cityCarlist li .txt-r").hide();
					}
				};
				var bindBrandListData = function(options) {
					var defaultOptions = {
						way: "html",
						data: [],
						index: 1,
						size: 20
					};
					var opt = $.extend({}, defaultOptions, options);
					htmlRender.render({
						containerid: "#brandCarlist ul",
						templateid: "#cityCarListTemplate",
						data: {
							listtype: 2,
							size: opt.size,
							index: opt.index,
							data: opt.data
						},
						type: opt.way
					});
					var hidMode = $.trim($("#hidMode").val());
					if(hidMode == 2) {
						$("#brandCarlist li .txt-r").hide();
					}
				}
				var initBlock = function(data) {
					//列表页面数据
					var cityCarList = data.data.cityCarList,
						serialCarList = data.data.serialCarList,
						cityList = data.data.citys,
						serialList = data.data.serials,
						cityCarListIsEmpty = !(!!cityCarList && !!cityCarList.length), // $.isEmptyObject(cityCarList),
						serialCarListIsEmpty = !(!!serialCarList && serialCarList.length), // $.isEmptyObject(serialCarList),
						cityListIsEmpty = !(!!cityList && cityList.length), // $.isEmptyObject(cityList),
						serialListIsEmpty = !(!!serialList && !!serialList.length), // $.isEmptyObject(serialList),
						homePageCount = data.data.pagecount;

					/*---------------------绑定数据 start-------------------------*/
					//绑定品牌车源列表列表
					if(!serialCarListIsEmpty) {
						var options = {
							way: "html",
							data: serialCarList,
							index: 1
						};
						bindBrandListData(options);
					}

					if(!cityCarListIsEmpty) {
						var options = {
							way: "html",
							data: cityCarList,
							index: 1
						};
						bindCityListData(options);
						lessCarSource.type = 0; //重新设定type值
					}
					//绑定品牌列表
					if(!serialListIsEmpty) {
						htmlRender.render({
							containerid: "#brandWrapper",
							templateid: "#aroundBrandTemplate",
							data: {
								data: serialList //
							},
							type: "append"
						});
						bindBrandEventListener();
						//设定type值
						lessCarSource.type = 2;
						lessCarSource.not = false;
						getBrandAroundcars(); //请求本地相似车系数据
						//第一次曝光
						if(lessCarSource.similarisfirst) {
							clickact('wap_buycar_list_expose_similar');
							lessCarSource.similarisfirst = false;
							//大数据曝光码
							_dcv.push(["_trackEvent", "二手车M站", "列表页相似车源补充", "曝光码", ""]);
						}
					}
					if(!cityListIsEmpty) {
						//绑定城市列表
						htmlRender.render({
							containerid: "#cityWrapper",
							templateid: "#aroundCityTemplate",
							data: {
								data: cityList //
							},
							type: "append"
						});
						bindCityEventListener();
						var tempArr = [];
						for(var i = 0, cityListLen = cityList.length; i < cityListLen; i++) {
							tempArr.push(cityList[i].Code);
						}
						cids = tempArr.join('|');
					}
					/*---------------------绑定数据 end-------------------------*/
					//没有数据
					if(cityCarListIsEmpty && serialListIsEmpty) {
						return false;
					}
					/*-------------------初始化组件的显示-------------------------*/
					if(!cityCarListIsEmpty && !serialListIsEmpty && !!sid && sid != '0') {
						lessCarSource.type = 2;
						var twoBanner = $("#two-banner"),
							$cityCarlist = $("#cityCarlist"),
							$brandCarlist = $("#brandCarlist"),
							$cityWrapper = $("#cityWrapper"),
							$brandWrapper = $("#brandWrapper");

						twoBanner.show(); //顶部两个banner显示
						$brandWrapper.parent().show(); //改成本地在前面
						$brandCarlist.show(); //改成本地在前面
						/*-------------------注册切换事件---------------------------*/
						twoBanner.find("li").click(function() {
							lessCarSource.showloading = false;
							var that = $(this);
							if(!that.find('a').hasClass('current')) {
								that.find('a').addClass('current');
								that.siblings('li').find('a').removeClass('current');
								var index = that.index(); //
								//if (index === 0) {
								if(index === 1) {
									$cityCarlist.show(); //底部列表
									$brandCarlist.hide();

									$cityWrapper.parent().show(); //中部城市选项卡
									$brandWrapper.parent().hide();
									lessCarSource.type = 1;
									//第一次曝光
									if(lessCarSource.zhoubianfirst) {
										clickact('wap_buycar_list_expose_zhoubian');
										_dcv.push(["_trackEvent", "二手车M站", "列表页周边补充车源", "曝光数", ""]);
										lessCarSource.zhoubianfirst = false;
									}
								} else {
									lessCarSource.type = 2;
									$brandCarlist.show();
									$cityCarlist.hide(); //底部列表

									$brandWrapper.parent().show();
									$cityWrapper.parent().hide(); //中部城市选项卡
								}
							} //has current end
						});
						lessCarSource.cityCount = data.data.pagecount;
						lessCarSource.not = false;
					} else if(!cityCarListIsEmpty) {
						//单个外地相同车型逻辑
						lessCarSource.type = 0;
						$("#one-banner").show().find(".sup_default").find('a').text('外地相同车型');
						$("#cityWrapper").parent().show();
						$("#cityCarlist").show();
						lessCarSource.cityCount = data.data.pagecount;
						lessCarSource.not = false;
						//第一次曝光
						if(lessCarSource.zhoubianfirst) {
							clickact('wap_buycar_list_expose_zhoubian');
							_dcv.push(["_trackEvent", "二手车M站", "列表页周边补充车源", "曝光数", ""]);
							lessCarSource.zhoubianfirst = false;
						}
					} else if(!serialListIsEmpty) {
						//单个本地相似车型逻辑  数据在 绑定品牌列表  处请求
						lessCarSource.type = 2;
						$("#one-banner").show().find(".sup_default").find('a').text('本地相似车型');
						$("#brandWrapper").parent().show();
						$("#brandCarlist").show();
						lessCarSource.brandCount = data.data.pagecount;
						lessCarSource.not = false;
					}
					$("#supply-wrapper ").show();
				};
				//
				var bindCityEventListener = function() {
					var selector = "#cityWrapper li a";
					$(document).on(clickEventName["touchstart"], selector, function(ev) {
						touchHelper.startX = touchHelper.getCoord(ev, 'X');
						touchHelper.startY = touchHelper.getCoord(ev, 'Y');
					});
					$(document).on(clickEventName["touchend"], selector, function(ev) {
						if(Math.abs(touchHelper.getCoord(ev, 'X') - touchHelper.startX) < 10 && Math.abs(touchHelper.getCoord(ev, 'Y') - touchHelper.startY) < 10) {
							$("#cityCarlist").find('.cityCarlist').show();
							var that = $(this);
							if(that.hasClass('current')) {
								return false;
							}
							var parent_li = that.parent("li"),
								parent_siblings_li = parent_li.siblings();
							parent_siblings_li.find("a.current").removeClass('current');
							that.addClass('current');
							lessCarSource.cityIndex = 1;
							lessCarSource.cityCount = 0;
							cityid = parseInt(that.attr("data-id"));

							if(!cityid) {
								lessCarSource.isClick = true;
							}
							lessCarSource.type = !cityid ? 0 : 1;
							lessCarSource.not = false;
							lessCarSource.showloading = false;
							getCityAroundcars(true);
						}
					});
				};
				//
				var bindBrandEventListener = function() {
					var selector = "#brandWrapper li a";
					$(document).on(clickEventName["touchstart"], selector, function(ev) {
						touchHelper.startX = touchHelper.getCoord(ev, 'X');
						touchHelper.startY = touchHelper.getCoord(ev, 'Y');
					});
					$(document).on(clickEventName["touchend"], selector, function(ev) {
						if(Math.abs(touchHelper.getCoord(ev, 'X') - touchHelper.startX) < 10 && Math.abs(touchHelper.getCoord(ev, 'Y') - touchHelper.startY) < 10) {
							$("#brandCarlist").find('.bot-sxdiv-no').hide();
							lessCarSource.type = 2;
							var that = $(this);
							if(that.hasClass('current')) {
								return false;
							}
							var parent_li = that.parent("li"),
								parent_siblings_li = parent_li.siblings();
							parent_siblings_li.find("a.current").removeClass('current');
							that.addClass('current');
							lessCarSource.csid = that.attr("data-id") | 0;
							lessCarSource.brandIndex = 1;
							lessCarSource.brandCount = 0;
							lessCarSource.not = false;
							lessCarSource.showloading = false;
							getBrandAroundcars();
						}

					});
				};
				//初始化
				var init = function() {
					var hidMode = $.trim($("#hidMode").val());
					if(hidMode == 1) {
						$("#cityCarlistUl,#brandCarlistUI").removeClass('carlist-ul').addClass('carlist-ul-horizontal');
					} else {
						$("#cityCarlistUl,#brandCarlistUI").removeClass('carlist-ul-horizontal').addClass('carlist-ul');
					}
					curcid = (typeof Taoche != "undefined") && !!Taoche.IpLocation && Taoche.IpLocation.cityId ? Taoche.IpLocation.cityId : 0,
						sid = $.trim($("#hidSerialId").val());
					returnUrl = initParam();
					getHomeAroundcars();
				};

				return {
					init: init,
					getCityAroundcars: getCityAroundcars,
					getBrandAroundcars: getBrandAroundcars
				};
			})()
		};

		(function() {
			var allCount = parseInt($("#allCount").val()); //车源数
			//车源较少
			if(allCount >= 0 && allCount < 20) {
				lessCarSource.not = false;
				lessCarSource.list.init();
			}
			//车源较少
			if(allCount > 0 && allCount < 20) {
				if(IsBmCity) {
					$("#divBMTips").show();
					$("#divDefaultTips").hide();
				} else {
					$("#divBMTips").hide();
					$("#divDefaultTips").show();
				}
			}
			//无结果
			if(allCount == 0) {
				if(IsBmCity) {
					$("#divBMEmpty").show();
					$("#divDefaultEmpty").hide();
				} else {
					$("#divBMEmpty").hide();
					$("#divDefaultEmpty").show();
				}
			}

		})();
		/*--------------------车源较少和没结果-----end----------*/

		/*-------------------------------条件筛选展开收起  张燕红g--------start-------------------------*/

		function hideStyle() {
			scrollJs.type = true; //出现弹层的情况下，隐藏北京内容
			if($("#footprintUl").find("li").length > 0) {
				$("#footPrint").hide();
			}
			$("#newHeader,.new-footer,.fixed-right,.seach-box,.car-list-wrap,#app-mask").hide(); //
		}

		function showStyle() {
			if(scrollJs.type) {
				$("#newHeader,.new-footer,.fixed-right,.seach-box,.car-list-wrap").show(); //fixed-right
				var appmask = Cookie.getCookie('Biauto.Taoche.App.WapDownlodadApp');
				if(!appmask) {
					$("#app-mask").show();
				}
				if(IsBmCity) {
					$("#divDefaultEmpty,#divDefaultTips").hide();
				} else {
					$("#divBMEmpty,#divBMTips").hide();
				}
				if($("#footprintUl").find("li").length > 0) {
					$("#footPrint").show();
				}
			}
		}

		//常用参数
		var leftmask3 = $("div.sortbox-brand .leftmask3"),
			divMark = $("#divMark"),
			filterNav = $("#filterNav"),
			filterNavLi = filterNav.find('li'),
			filterNavUl = filterNav.find('ul')[0];
		//定义下拉菜单显示方法swiperHide();
		function swiperShow(index, that, tabcnt) {
			scrollJs.setHeaderIndex(0);
			filterNavUl.style.cssText = "position: fixed;top:-1px;left:0;z-index:1009;-webkit-transform:translateZ(1009px);-moz-transform:translateZ(1009px);-o-transform:translateZ(1009x);transform:translateZ(1009px);";
			if(!filterNavLi.hasClass('cur')) {
				scrollJs.getPostion();
			}
			if(index == 0 || index == 2) {
				divMark.show().removeClass('not'); //;.css({ "background": "rgba(0, 0, 0, 0.4)" });
				showStyle();
				window.addEventListener('touchmove', scrollJs.prevent, {
					passive: false
				});
			} else {
				if(index === 3 && parametersHelper.isclickcloseBtn) {
					parametersHelper.initDefault();
				}
				hideStyle();
				window.removeEventListener('touchmove', scrollJs.prevent, {
					passive: false
				});
				divMark.hide().addClass('not');
			}
			that.addClass('cur').siblings().removeClass('cur');
			tabcnt.eq(index).addClass("swipeTop-block scroll").siblings().removeClass("swipeTop-block scroll");
			leftmask3.hide();
			leftmask3.trigger('close'); //隐藏品牌层
		}
		//定义下拉菜单隐藏方法swiperHide();
		function swiperHide(tindex, tabcnt, that) {
			divMark.hide().addClass('not');
			showStyle();
			window.removeEventListener('touchmove', scrollJs.prevent, {
				passive: false
			});
			tabcnt.eq(tindex).removeClass('swipeTop-block scroll');
			that.removeClass('cur');
			scrollJs.setHeaderIndex(10001);
			scrollJs.resetPostion();
			initCss(that);
		}
		//切换选项卡
		function tabs(tabtit, tabcnt) {
			tabtit.each(function(index) {
				$(this).click(function() {
					var tindex = index,
						that = $(this);
					/*-----------------start--------------------*/
					if(that.hasClass('cur')) {
						swiperHide(tindex, tabcnt, that);
					} else if(that.hasClass('tabsli-brand')) {
						swiperShow(tindex, that, tabcnt);
						if($(".brand-list>.content[data-key='brand']>div").length <= 1) { //只加载一次主品牌数据
							brandShow();
						}
					} else {
						swiperShow(tindex, that, tabcnt);
					}
					/*---------------------end----------------*/
				})
			});
		}
		//初始化样式
		function initCss(that) {
			if($("#resetSelect").hasClass('li-reset-no')) {
				$(".tabsli ").removeClass('cur');
			}
			if(that.hasClass("shaixuan")) {
				$("#paramHid").val($("#paramHidExt").val());
				parametersHelper.isclickcloseBtn = true;
				// parseInt()
				var hidOrder = $.trim($("#hidOrder").val()),
					hidBrand = $.trim($("#hidBrand").val()),
					hidPrice = $.trim($("#hidPrice").val());
				if(!!hidOrder) {
					$("#orderId").addClass("selected").find("em").text(hidOrder);
				} else {

				}
				if(!!hidBrand) {
					$("#brandId").addClass("selected").find("em").text(hidBrand);
				}
				if(!!hidPrice) {
					$("#priceId").addClass("selected").find("em").text(hidPrice);
				}
			}
		}
		//条件注册事件
		tabs($(".tabsli"), $(".sort-box-wrap"));
		//点击关闭按钮
		$(".btn-close-js,#divMark").click(function() {
			divMark.hide().addClass('not');
			showStyle();
			scrollJs.resetPostion();
			scrollJs.setHeaderIndex(10001);
			window.removeEventListener('touchmove', scrollJs.prevent, {
				passive: false
			}); //接触禁用滚动限制
			$(".sort-box-wrap").removeClass("swipeTop-block scroll");
			filterNav.find('li').removeClass('cur');
			leftmask3.trigger('close'); //隐藏品牌层
			initCss($(this));
		});
		//滚动

		(function() {
			var ul = filterNav.find('ul');
			var liHeight = $('.carlist-inner-div').find("li").eq(0).height() * 3 || 50;
			var doc = $(document),
				scrollTop = 0,
				divMark = $("#divMark");
			setTimeout(function() {
				if(doc.scrollTop() >= parseInt(filterNav.offset().top)) {
					ul[0].style.cssText = "position: fixed;top:-1px;z-index:1009;-webkit-transform:translateZ(1009px);-moz-transform:translateZ(1009px);-o-transform:translateZ(1009x);transform:translateZ(1009px);";
				}
			}, 800);
			var timer = null;
			$(window).scroll(function() {
				scrollTop = doc.scrollTop();
				//浮层；
				if(divMark.hasClass('not') && !$("#search_wrap").hasClass('fix')) {
					ul[0].style.cssText = scrollTop >= filterNav.offset().top ? "position:fixed;top:-1px;left:0px;z-index:1009;-webkit-transform:translateZ(1009px);-moz-transform:translateZ(1009px);-o-transform:translateZ(1009x);z-index:1009;transform:translateZ(1009px);" : "position: relative;top:0;left:0px;-webkit-transform:translateZ(0);-moz-transform:translateZ(0);-o-transform:translateZ(0);transform:translateZ(0);";
				}
				//加载更多
				if(scrollTop + liHeight >= doc.height() - $(window).height()) {
					if($(".scroll").length == 0) {
						listHelper.getdatabyindex();
					}
					if(!lessCarSource.not) {
						lessCarSource.type == 2 ? lessCarSource.list.getBrandAroundcars() : lessCarSource.list.getCityAroundcars();
					}
				}
			});
		})();

		//展开收起效果
		$(".term-hidecont").find(".tt-small,.tc-item").hide();
		//打开操作
		$(".stle-close").click(function() {
			var that = $(this),
				parent = that.parent();
			that.hide();
			parent.find(".tt-small").show();
			parent.find(".tc-item").slideDown(function() {});
		});
		//收起操作
		$(".tt-open").click(function() {
			var that = $(this),
				parents = that.parents(".term-box");
			that.parent().hide();
			parents.find(".stle-close").show();
			parents.find(".tc-item").slideUp();
		});
		//品牌筛选
		function brandShow() {
			var $body = $('body');
			//初始化品牌
			$body.trigger('brandinit', {
				selected: false,
				notetop: -42,
				noteTouchStart: function() {},
				noteTouchEnd: function() {},
				fnEnd1: function() {
					var $swipeLeft = this; //第一层对象
				},
				fnEnd2: function() {
					var $swipeLeft = this; //第二层对象
				}
			});
			api.brand.currentid = $("#hidMBrandId").val(); //默认选中品牌ID
			api.car.currentid = $("#hidSerialId").val(); //默认选中车型ID
		}

		//插入广告
		var b11 = false,
			b16 = false,
			b26 = false,
			b36 = false,
			adIndex = 0;
		///动态插入广告位，九宫格模式需要特殊处理，计算广告位置防止出现空白位
		var mode = $("#hidMode").val()

		function InsertAd() {
			var objLi = $(".carlist-inner-div ul li:not(.ad-li)");
			var liSize = objLi.size();
			if(liSize > 10 && !b11) {
				var i11 = 0;
				var ad11 = $("#ad11 ins");
				if($.trim($(ad11[0]).html()) === "" || $(ad11[0]).css("display") === "none") {
					i11++;
				}
				if($.trim($(ad11[1]).html()) === "" || $(ad11[1]).css("display") === "none") {
					i11++;
				}

				b11 = true;
				if(i11 > 1) {
					if($("#adcms11").html() === "") //cms没有有广告
					{
						i11++;
					} else {
						$("#ad11").html($("#adcms11").html()); //显示cms广告
					}
				}
				//11广告占位标志 无11位广告
				if(i11 > 2) {} else {
					adIndex++;
					objLi.eq(10).before("<li logctags=\"_dcv.push(['_trackEvent','二手车M站','买车频道','车辆位置-广告位11',''])\" class='list-ad ad-li'>" + $("#ad11").html() + "</li>");
				}
			}
			if(liSize > 16 && !b16) {
				b16 = true;
				var i16 = 0;
				if($.trim($("#ad16 ins").html()) === "" || $("#ad16 ins").css("display") === "none") {
					//无16位广告
					if($("#adcms16").html() === "") {
						i16++;
					} else {
						$("#ad16").html($("#adcms16").html()); //显示cms广告
					}
				}
				if(i16 == 0) {
					var index = 15;
					if(mode == 1) {} else {
						if(adIndex == 0) index = 14;
						if(adIndex == 1) index = 15;
					}
					adIndex += 2;
					objLi.eq(index).before("<li logctags=\"_dcv.push(['_trackEvent','二手车M站','买车频道','车辆位置-广告位16',''])\" class='list-ad-h ad-li'>" + $("#ad16").html() + "</li>");
				}
			}

			if(liSize > 20 && !b36) {
				var index = 20;
				if(mode == 1) {} else {
					if(adIndex == 0) index = 20;
					if(adIndex == 1 || adIndex == 3) index = 19;
					if(adIndex == 2) index = 18;
				}
				b36 = true;
				adIndex += 2;
				objLi.eq(index).before($("#ad36").html());
				var downloadUrls = $("#hidAppParams").val();
				DownloadApp.init({
					divId: "app-mask-li", //展示层Id  必填
					appDownloadId: "app-download-liapp", //下载按钮Id; 必填
					clickCloseDiv: false, //点击下载之后是否自动关闭;
					blurCloseDiv: false, //失去焦点后是否自动关闭
					stayShow: true, //是否一致保持显示
					androidUrlChange: false,
					downloadUrls: { //下载url对象集合;
						ios: 'http://itunes.apple.com/cn/app/er-shou-che/id421347528?mt=8',
						android: "http://app.yiche.com/19/c33"
					},
					config: {
						scheme_IOS: downloadUrls,
						scheme_Adr: downloadUrls,
						other: downloadUrls,
						timeout: 2000
					}
				});
			}

			if(liSize > 26 && !b26) {
				b26 = true;
				var i26 = 0;
				if($.trim($("#ad26 ins").html()) === "" || $("#ad26 ins").css("display") === "none") {
					//无广告 
					if($("#adcms26").html() === "") {
						i26++;
					} else {
						$("#ad26").html($("#adcms26").html()); //显示cms广告
					}
				}
				if(i26 == 0) {
					var index = 25;
					if(mode == 1) {} else {
						if(adIndex % 2 == 0)
							index = 24;
						else
							index = 25;
					}
					objLi.eq(index).before("<li logctags=\"_dcv.push(['_trackEvent','二手车M站','买车频道','车辆位置-广告位26',''])\" class='list-ad-h ad-li'>" + $("#ad26").html() + "</li>");
				}
			}
		}
		//*****************************************************************BEGIN*****************************************************************
		$("#txtSearch").focus(function() {
			window.setTimeout(function() {
				!!$.trim($("#txtSearch").val()) ? $("#ser_close").show() : $("#ser_close").hide();
			}, 300);
		}).blur(function() {
			var val = $(this).val();
			setTimeout(function() {
				if(val.indexOf("搜") > -1) {
					$("#ser_close").hide();
				}
			}, 25);
		}).keyup(_.debounce(function() {
			!!$.trim($("#txtSearch").val()) ? $("#ser_close").show() : $("#ser_close").hide();
		}, 1000));
		$('#txtSearch').bind('input propertychange', function() {
			if($(this).val() != "") {
				$("#divInit").hide();
			} else {
				$("#divList").hide();
				//$("#divInit").show();
			}
		});
		//关闭
		$("#ser_close").click(function() {
			$("#txtSearch").css("color", "#ccc").val("");
			$("#divList").html("");
			$(this).hide();
		});
		//打开弹层
		$("input.search_custom").click(function() {
			$(".search-wrap").addClass("scroll").show();
			searPop();
			clickact('wap_buycar_list_search');
		});
		//点击返回按钮关闭搜索弹层
		$("#goback").click(function() {
			$("#search_wrap").removeClass("scroll fix").hide();
			showStyle();
		});

		//////////////////
		function searPop() {
			var search_wrap = $("#search_wrap");
			search_wrap.addClass('fix');
			$("#txtSearch").trigger("click").focus();
			document.getElementById('filterNav').querySelector('ul').style.cssText = "position: relative;top:0;left:0px;-webkit-transform:translateZ(0);-moz-transform:translateZ(0);-o-transform:translateZ(0);transform:translateZ(0);";
			hideStyle();
			if(!search_wrap.hasClass('not')) {
				var windowH = $(window).height();
				search_wrap.height(windowH).addClass("not");
				$("#divList").css({
					"min-height": windowH
				});
			}
		}

	})($, window);

	//列表页面头部文件里面的逻辑代码
	;
	(function($, window) {
		var h_random = Math.random();
		//链接加随机数
		$("#aCollect").click(function() {
			clickact("wap_head_usercenter_attention");
			window.location.href = "http://m.taoche.com/buycar/attention.aspx?r=" + h_random;
		});
		$("#aHistory").click(function() {
			clickact("wap_head_usercenter_history");
			window.location.href = "http://m.taoche.com/buycar/history.aspx?r=" + h_random;
		});
		$("#aCarManager").click(function() {
			clickact("wap_head_usercenter_publish");
			window.location.href = "http://m.taoche.com/buycar/mycarlist_v1.aspx?r=" + h_random;
		});
		$("#menuid").click(function() {
			var menu_layerId = $("#menu_layerId");
			if(menu_layerId.hasClass("menu-transition")) {
				menu_layerId.removeClass('menu-transition');
				$("#banner_mask").hide();
				window.removeEventListener('touchmove', scrollJs.prevent, {
					passive: false
				}); //接触禁用滚动限制
			} else {
				menu_layerId.show().addClass('menu-transition');
				window.addEventListener('touchmove', scrollJs.prevent, {
					passive: false
				}); //禁止滚动
				$("#banner_mask").show();
			}
		});
		$(".header-mask").click(function() {
			$("#menu_layerId").removeClass('menu-transition');
			$("#banner_mask").hide();
			window.removeEventListener('touchmove', scrollJs.prevent, {
				passive: false
			}); //接触禁用滚动限制
		});
		//APP下载
		$("#divNavAppDownload").click(function() {
			DownloadApp.appDownload("headermask");
		})
	})($, window);
	//顶部banner下载
	DownloadApp.init({
		divId: "app-mask", //展示层Id  必填
		appDownloadId: "app-download", //下载或者打开按钮Id; 必填
		closeId: "app-colse",
		stayShow: true,
		blurCloseDiv: false //失去焦点的时候是否关闭 有的手机不支持 onblur
	});

	//App下载糖豆 头部文件中的
	$("#divNavAppDownload").click(function() {
		DownloadApp.appDownload("headermask");
	});
})