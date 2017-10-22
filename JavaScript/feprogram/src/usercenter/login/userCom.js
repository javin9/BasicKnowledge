
	//导入所需js
	// var slider = require("libs/jquery.nivo.slider");
	var main = require("./main");
	var ko = require("knockout");

	var indexViewModel = {
        /***已贷款总额 ***/
        LoanTotalMoney: ko.observable('--'),
         /***申请人数 ***/
        ApplyPersons: ko.observable()
    }

	var UserPage = function(){

	} 

	UserPage.prototype = {
		init: function(){
			ko.applyBindings(indexViewModel);
			// this.domInit();
		},
		domInit: function(){
			var self = this;
			// 首页banner初始化
			var num = $(".nivoSlider > a").length;
			if(num <= 0){
				$("#index-slider").hide();
			}else if(num == 1){
				$("#index-slider .slider-wrapper, #index-slider .nivoSlider, #index-slider a").css('height', '320px');
				$("#index-slider .nivoSlider img").show();
			}else{
				$(".slider").nivoSlider({
					effect:"fade", //slideInLeft,slideInRight,sliceDown,sliceDownLeft,sliceUp,sliceUpLeft,sliceUpDown,sliceUpDownLeft,fold,fade,random,boxRandom,boxRain,boxRainReverse,boxRainGrow,boxRainGrowReverse
                    startSlide:1,//从第几张开始
					manualAdvance:true,	 // 是否手动播放(false为自动播放幻灯片)
		        	directionNav:false,  //是否显示图片切换按钮(上/下页) 
		        	controlNav:false	 // 显示序列导航
				});
			}
			/*************申请人数数字效果*************/
	        // setInterval(function(){
	        // 	self.getTopInfo()
	        // }, 60000);
            //
	        // self.getTopInfo();
		},
		// 贷款总额 && 正在申请贷款
        getTopInfo: function() {
            var $this = this;
            tools.$ajax({
                url: APIURL + 'api/Other/GetNewCarLoanStatisticsInfo',
                dataType: 'jsonp',
                success: function(res) {
                    if (!res.Result)
                        return;
                    var  _total= res.Data.TotalLoans,_applyingNum = res.Data.ApplyingNum,
                   		_number="",
                     	_numStr="";
                    	_total = _total.replace(/,/g,'');
                    	//_total = tools.formatCurrency(_total.substring(0,_total.length - 8));
                    	_total = (parseFloat(_total/100000000)).toFixed(2);
                    	_total = tools.formatCurrency(_total);

                    	//_number = parseFloat("0." + _total.substring(_total.length - 8,_total.length - 5)).toFixed(2);
                    	//_numStr =_number.toString();
                    	//_numStr = _numStr.substring(2,4);

                    	//_total =_total.substring(0,_total.length - 3);
                    	_applyingNum = _applyingNum.replace(/,/g,'');

                    	//(_number>0)?_total = _total +"."+ _numStr:_total=_total;
                    indexViewModel.LoanTotalMoney(_total);
                    indexViewModel.ApplyPersons(_applyingNum);
                    //滚动数字
                    $this.showPersonCount();    
                }
            });
        },
		showPersonCount: function(){
			var n = indexViewModel.ApplyPersons();//模拟数据，需从服务取出真实数据
			$("#person_num").aniNumber({
				number: n,
				itemHeight:40
			});
		}
	}
	////////////////////页面初始化
	$(function(){
		var userPage = new UserPage();
		userPage.init();
	});