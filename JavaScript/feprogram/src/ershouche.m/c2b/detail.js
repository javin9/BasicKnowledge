require("./detail.scss");
import Vue from 'vue';
	/*APP判断   */
    var isApp = tools.getCookie("YiXinAppInfo"),
    	detRecomContArr=[],
		urlIsApp='';
    if(isApp){
    	var _detBot = $(".det_bot").attr("href");
    	$(".det_recom_cont").on('click', 'div.det-list', function(event) {
    		event.preventDefault();
            tools.jsNativeBridge("sendToUsedCarDetail", detRecomContArr[$(this).index()]);//app交互
    	});
    	$(".det_bot a").attr("href","javascript:void(0);").on('click', function(event) {
    		event.preventDefault();
    		tools.jsNativeBridge("sendToUsedCarList",{source:source});//app交互
    	});
		/////判断是app用新接口
		urlIsApp=getCarListUrl_M;
	}else {
		/////判断是app用新接口
		urlIsApp=getCarListUrl_M;
	}
	var DetailPage = function(){
		// 数据绑定
		this.vm = new Vue({
			el: '#c2bDetail',
			data: {
				advName: '--', // 顾问姓名
				advAvatar: '', // 顾问头像
				advLevelClass: '--', // 顾问等级
				advAlready: '--', // 已贷款人数
				advRate: '--', // 好评度
				cN400: '--', // 电话
				advExTen: '--', // 分机
				cars: [
					// {
					// 	carName: '--',
					// 	picPath: '--',
					// 	downPaymentAmount: '--',
					// 	monthlyPayment: '--',
					// 	buyCarDate: '--', // 购车年份
					// 	drivingmileage: '--', // 行驶里程
					// 	warrantyType: '--', //特点

					// },
				] // 推荐二手车
			}
		});
		this.advNumTotal = 0; // 贷款顾问总个数
		this.advNumCur = 0; // 当前贷款顾问索引
		this.ershoucheNum = 4; // 展示的推荐二手车个数

		this.init();
	};

	DetailPage.prototype = {
		init: function(){
			var self = this;

			self.getAdviser();
			self.getErshouche();

			self.bindEvent();
		},
		bindEvent: function(){
			var self = this;

			// 重新评估
			$('#btnEvaluate').on('click', function () {
			    if (applyCountToday < 10) {
			        // if (from != '') {
			        //     window.location.href = '/c2b/index?again=1' + '&from=' + from + '&source=' + source;
			        // } else {
			            window.location.href = indexUrl;
			        //}
				} else {
					// 重新评估超出限制
					$('#btnEvaluate').text('明日再评').removeAttr('href');
				}
			});

			// 换贷款顾问
			$('#btnChange').on('click', function () {
				self.getAdviser();
			});
		},
		// 贷款顾问
		getAdviser: function(){
			var self = this;

			tools.$ajax({
                url: getAdviserUrl,
				//type:"get",
                data: {
                	cityId: city.CityId
                },
                success: function(res) {
                	// console.log(res);

                	if(res.Result){
                		var data = res.Data;

                		if( data.length == 1)
                			$('#btnChange').remove();

                		self.advNumTotal = data.length > 5 ? 5 : data.length; // 贷款顾问数量

                		// 数据绑定
			    		self.vm.advName = data[self.advNumCur].Name;
			    		self.vm.advAvatar = data[self.advNumCur].Photo;
			    		self.vm.advLevelClass = 'adviser_level_' + data[self.advNumCur].SkillLevelId;
			    		self.vm.advAlready = data[self.advNumCur].ExTen;
			    		self.vm.advRate = data[self.advNumCur].Rate;
			    		self.vm.cN400 = data[self.advNumCur].CN400;
			    		self.vm.advExTen = data[self.advNumCur].ExTen;

                		if( self.advNumCur == self.advNumTotal - 1 ) {
                			self.advNumCur = 0;
                		} else {
			    			self.advNumCur ++ ;
                		}
                		

                	} else {
                		// tools.showAlert(res.Message);
                		$('.det_adviser_empty').removeClass('hide').siblings().addClass('hide');
                	}
                },
                error: function (req, status, text) {
                    tools.showAlert(status);//req.responseText;
                }
            });
		},
		// 推荐二手车
		getErshouche: function(){
		    var self = this;
		    //var carPriceScope = '0|5';
			$.ajax({
				url: urlIsApp,
                type:"get",
                data: {
                	cityId: city.CityId,
                	ucarPrice: carPriceScope
                },
                beforeSend: function () {
                    $('.det_recom').hide();
                    $('.det_bot').hide();
                },
                success: function(res) {
                	 // var res = JSON.parse(res);
                	// console.log(res);

                    if (res.target == true) {
                		var data = res.Data.UcarList;

                		for( var i = 0; i < data.length && i < self.ershoucheNum; ++i ){
                			var ucarItem = [];
                			if(isApp){
                				ucarItem.link ="javascript:void(0);"
                                detRecomContArr[i] = {
                                    uCarId:data[i].UcarID,
                                    cityId:data[i].CarCitySpell,
                                    productID:data[i].ProductId,
                                    source:appSource
                                };
                			}else{
								ucarItem.link = '/' +data[i].CarCityId+'/u'+ data[i].UcarID + '/p' + data[i].ProductId + '?source='+ source;
                			}
                			
                			
                			ucarItem.carName = data[i].CarFullName;

                			// 取第一张图片
                			var pl = data[i].FirstPicturePath.split('|');
                			ucarItem.picPath = pl[0];

	                        //换算成万公里
	                        var drivingmileage = parseFloat(data[i].Drivingmileage / 10000).toFixed(2);
                			ucarItem.drivingmileage = drivingmileage;

                			//获取买车 年
	                        var buyCarDate = self.jsonDateFormat(data[i].BuyCarDate).split('-');
	                        var paiz;
	                        if (buyCarDate[0] == '1') {
	                            paiz = '未上牌';
	                        } else {
	                            paiz = buyCarDate[0] + "年上牌";
	                        }
	                        ucarItem.buyCarDate = paiz;

	                        // 特点
	                        var warrantyTypes = data[i].WarrantyTypes;
							var sn = "";//1:原厂质保;2:延长质保;5:原厂质保+免费过户;6:延长质保+免费过户)
							// if(isApp){
							// 	if (warrantyTypes.indexOf('1') == 0) {
							// 	    sn = '<span class="tag">品牌认证</span>';
							// 	} else if (warrantyTypes.indexOf('1') == 1) {
							// 	    sn = '<span class="tag">原厂质保</span>';
							// 	} else if (warrantyTypes.indexOf('1') == 2) {
							// 	    sn = '<span class="tag">延长质保</span>';
							// 	} else if (warrantyTypes.indexOf('1') == 3) {
							// 	    sn = '<span class="tag">免费过户</span>';
							// 	}
							// }else {
								if (warrantyTypes == 1) {
									sn = '<span class="tag">原厂质保</span>';
								} else if (warrantyTypes == 2) {
									sn = '<span class="tag">延长质保</span>';
								} else if (warrantyTypes == 5) {
									sn = '<span class="tag">免费过户</span>';
								} else if (warrantyTypes == 6) {
									sn = '<span class="tag">免费过户</span>';
								}else {
									sn='';
								}
							// }
							ucarItem.warrantyType = sn;
	                        //首付
	                        var sf = "";
	                        if (data[i].DownPaymentAmount >= 1) {
	                            sf = (data[i].DownPaymentAmount).toFixed(2) + "万";
	                        } else {
	                            sf = parseInt(data[i].DownPaymentAmount * 10000) + "元";
	                        }
                			ucarItem.downPaymentAmount = sf;

	                        //月供
	                        var g = data[i].MonthlyPayment;
	                        var yg;
	                        if (Number(g) > 1) {
	                            yg = g.toFixed(2) + '万';
	                        } else {
	                            yg = parseInt(g * 10000) + '元';
	                        }
                			ucarItem.monthlyPayment = yg;
                			// 输出啦~~~
                			self.vm.cars.push(ucarItem);

                		}
                		
                	} else {
                		tools.showAlert(res.Message);
                	}
                },
                complete: function () {
                    
                    $('.det_recom').show();
                    $('.det_bot').show();
                },
                error: function (req, status, text) {
                   // alert(status);//req.responseText;
                }
            });
		},
		//json日期格式转换为正常格式
    	jsonDateFormat: function(jsonDate) {
	        try {
	            var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));
	            var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
	            var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	            var hours = date.getHours();
	            var minutes = date.getMinutes();
	            var seconds = date.getSeconds();
	            var milliseconds = date.getMilliseconds();
	            return date.getFullYear() + "-" + month + "-" + day;
	        } catch (ex) {
	            return "";
	        }
	    }
	};

	new DetailPage();

//上线