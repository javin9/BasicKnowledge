require('./index.scss');

import swiper from 'libs/swiper';
import selCar from 'libs/carSelect';
import {isPhoneNumber} from 'libs/check/m.js';


//模拟数据
var prizeData = [{
					id:10,
					name:"空间卫士车内净化膏",
					intro:"香百年汽空间卫士净化炭膏，采用法国进口香料制作而成，从中萃取天然香精，具有舒缓身心，平和心灵作用。无论是新车除味还是净化空气，空间卫士净化炭膏都是你最好的选择。"
				},
				{
					id:4,
					name:"小狗电器350元抵用券",
					intro:"小狗电器新款北欧风格超静音手持吸尘器，无门槛350元抵用券（D-521B）。多锥技术五重精密过滤，高性电机完美匹配提升动力89%。让您的家居生活，更为舒适。"
				},
				{
					id:1,
					name:"同程网5元现金券",
					intro:"中国最好的旅游预订平台之一，网站拥有国内最全的旅游产品线，提供国内20000余家及海外100000余家酒店预订， 5000余家景区门票预订。"
				},
				{
					id:6,
					name:"WSIWA日本进口可悬挂式杂物筒",
					intro:"SEIWA日本可悬挂式杂物筒，超大容量，可存放杂志、CD、纸巾盒等多种物件。致力于打造做工精细，设计新颖、创意独特、方便耐磨、贴心实用的车载环境功能产品。"
				},
				{
					id:3,
					name:"D17（家用吸尘器）",
					intro:"小狗吸尘器，1700W超强功率，370W强劲大吸力，可清除大量建筑粉尘，新增强大宠物功能，给你的爱宠带来舒适体验。采用A级吸入率的专利地刷，吸入效率提高40%。"
				},
				{
					id:11,
					name:"香百年芳香膏",
					intro:"香百年汽车香膏,体积小巧，安装简便；有10种清新水果香型可供选择，有效去除车内有害气体、各类残留异味，帮助您放松、安抚紧张情绪，消除疲劳感，打造愉悦驾乘空间。"
				},
				{
					id:2,
					name:"汽车超人大礼包",
					intro:"中国领先的汽车保养在线商城，汽车后市场服务平台。致力于向广大车主们提供“专业、优质、便捷、贴心”的汽车服务。恭喜获得汽车超人200元现金礼包。"
				},
				{
					id:7,
					name:"WSIWA日本进口车载充电器",
					intro:"日本车载充电大师，严格按照日本JIS标准监制，通用多功能USB车充，配备70CM伸缩数据线，可承载12－24V电压，2.4A大功率大大减少充电时间，提供极致电路保护。"
				},
				{
					id:8,
					name:"日本进口蓝牙耳机",
					intro:"立体声蓝牙耳机，带防脱耳挂，三麦降噪，隔绝口声，高清通话，高保真音质，待机165小时，通话时间5小时，自带充电器，电量显示，快速充电仅需2小时。"
				},
				{
					id:5,
					name:"车载手机支架",
					intro:"金蕊车载手机支架是冠军巾帼车手同名品牌，产品制作用料考究，搭载进口高强度磁力吸，防止在驾驶过程中造成风险。目前累计服务中国超30万汽车用户！"
				},
				{
					id:12,
					name:"爱车小屋APP大礼包（300元）",
					intro:"爱车小屋是国内知名的汽车后市场电子商务平台，深受车主喜爱。旗下由900多家优质品牌厂家入住，专注于汽车用品领域，让车主真正体会用车养车无忧。"
				},
				{
					id:9,
					name:"空间卫士氧吧加湿器",
					intro:"空间卫士氧吧加湿器是由高强度PC/ABS塑胶外壳、钢化玻璃、高频振动荡器等电子器件组成，加湿强度大、加湿面积均匀、加湿效率强劲；节能、省电、实用寿命长等特点。"
				}

				];
var prizeMatching ={
	1:2,
	2:6,
	3:4,
	4:1,
	5:9,
	6:3,
	7:7,
	8:8,
	9:11,
	10:0,
	11:5,
	12:10
}


//游戏部分
class TurntableGame {
	constructor(turntableId,prizeData,callback){
		//浏览器兼容
		var styles = document.getElementsByTagName("head")[0].style,
			toCheck="transformProperty WebkitTransform OTransform msTransform MozTransform".split(" ");
		for (let i=0;i<toCheck.length;i++) {
			if (styles[toCheck[i]] !== undefined) this.supportedCSS = toCheck[i];
		}
		this.callback = callback;
		this.prizeData = prizeData;
		// this.playBtn = document.getElementById(pointerId);
		this.speed= 30;//每帧速度
        this.areaNumber = this.prizeData.length;//奖区数量
        this.deviation= 2 ;//随机结果角度偏差值 为了防止出现指针和扇区分割线无限重合 单位:°
        this.startStatus = false;//开始状态
        this.turntable = document.getElementById(turntableId);
        this.raf = null;
        this.runAngle = 0;
        this.targetAngle = -1;
        this.resultIndex = -1;
	}

	start(){
		if(!this.startStatus){
			this.angle = 0;
			this.startStatus = true;
			this.raf = setTimeout(()=> this.animationStart(),10);
		}
	}

	animationStart() {
        //如果没有设置结束点 就匀速不停旋转
        //如果设置了结束点 就减速到达结束点
        if (this.targetAngle == -1) {
            this.runAngle += this.speed;
        } else {
            this.angle = (this.targetAngle - this.runAngle) / this.speed;
            this.angle = this.angle > this.speed ? this.speed : this.angle < 0.5 ? 0.5 : this.angle;
            this.runAngle += this.angle;
            this.runAngle = this.runAngle > this._targetAngle ? this._targetAngle : this.runAngle;
        }
        //指针旋转
        this.turntable.style[this.supportedCSS] = 'rotate(' + (this.runAngle % 360) + 'deg)';
        if (parseInt(this.runAngle) == this.targetAngle) {
            clearTimeout(this.raf);
	        this.raf = null;
	        this.runAngle = 0;
	        this.targetAngle = -1;
	        this.startStatus = false;
	        typeof this.callback == "function" && this.callback(this.prizeData[this.resultIndex]);
        } else {
            this.raf = setTimeout(()=> this.animationStart(),10);
        }
    }

    setResult(index) {
        //得到中奖结果 index:中奖奖区下标
        var singleAngle = 360 / this.areaNumber, //单个奖区角度值
            endAngle = index * singleAngle; //随机得出结果在扇区内的角度
        this.resultIndex = index;
        this.runAngle = 0;
        this.targetAngle = endAngle + (Math.floor(Math.random() * 10) + 4) * 360; //随机旋转几圈再停止
    }

}


//页面逻辑
class CurPage{
	constructor(){
		this.dom = {
			$applyHistoryInfo:$('#applyHistoryInfo'),
			$applyNowPepoleNum:$('#applyNowPepoleNum'),
			$selectCar:$('#selectCar'),
			$elasticLayer:$('#elasticLayer'),
			$prizeName:$('#elasticLayer .prize-name'),
			$prizeImg:$('#elasticLayer .prize-img'),
			$prizeIntro:$('#elasticLayer .prize-intro'),
			$elasticLayerBox:$('#elasticLayer .elastic-layer'),
			$verCodeInput:$('.ver-code input'),
			$telBoxInput:$('.tel-box input'),
			$layerBtm1:$('.layer-bottom01'),
			$layerBtm2:$('.layer-bottom02'),
			$sendBtn:$('.layer-bottom02 .send-btn')
		}
		this.userKey = tools.getCookie("uktt");//
		// this.interfaceHost = "http://zujs.activity.m.daikuan.com"; // 服务器要注释！！！！！
		this.isGetCode = true;
		this.startTimer;
		this.curTimer;
		this.isStartgame = false;
		this.isResultCorrect = true;
		this.recordId;
		this.recentApp();//最近申请
		this.panicBuying();//限时抢购
		this.winningExpress();//中奖快报
		this.selectCar();//选车型
		this.scrollLogo();//滚动logo
		this.playGame();
		this.bindEvents();
		Echo.init({
		    offset: 400,
		    throttle: 0
		});

		this._timerTurntable = null; // 倒计时
		this._numReceivePrize = 0; // 重新发送次数
	}
	bindEvents(){
		var _telItem= this.dom.$telBoxInput;
		//关闭弹层
		$(".close-btn").on('click', (e) => {
			this.dom.$elasticLayer.hide();
			this.layerStatus(1);
			$('body').unbind('touchmove');
			$("#yxWrapper").css({
				overflow:"visible",
				heigth:"auto",
				position:"static",
			})
			this.clearCountDown($('.ver-code-btn'), '获取验证码');
			this.clearCountDown( this.dom.$sendBtn, '重新发送' );
		})

		//手机号验证
		$(".tel-box input").bind('input', (event)=>{
			// console.log(event.target);
			var _item = $(event.currentTarget),
				_telNum = $(event.currentTarget).val();
			if($.trim(_telNum) != ""){
				if(isPhoneNumber(_telNum)){
					_item.removeClass('err');
				}else{
					_item.addClass('err');
				}
				
			}
		});

		//获取验证码
		$(".layer-bottom01").on('click', '.ver-code-btn,.send-msg-btn', (event)=> {
			event.preventDefault();
			var _item = $(event.currentTarget);

			if($.trim(_telItem.val()) == "" ||  _telItem.hasClass('err')){
				tools.showAlert("请输入正确的手机号！");
				return false;
			}

			if(_item.hasClass('ver-code-btn') && this.isGetCode){
				this.getCode(_telItem.val(),_item);
			}else if(_item.hasClass('send-msg-btn')){
				// console.log(this.dom.$verCodeInput.val())
				if($.trim(this.dom.$verCodeInput.val()) != ""){
					this.checkCode(_telItem.val(),this.dom.$verCodeInput.val());
				}else{
					tools.showAlert("请输入验证码！")
				}
			}
		});

		/*重新发送兑换完成*/
		$(".layer-bottom02").on('click', '.send-btn,.completed-btn', (event)=> {
			var _item = $(event.currentTarget);

			if(_item.hasClass('send-btn') && ! _item.hasClass('disable') 
				&& !($.trim(_telItem.val()) == "" ||  _telItem.hasClass('err'))){

				if(this.isGetCode){
					this.receivePrize("again");
					// 超出次数后按钮置灰，不倒计时
					if( this._numReceivePrize >= 10 ){
						_item.addClass('disable');
						return;
					}
					this.countDown(_item,"重新发送");
				}

				
			}else if(_item.hasClass('completed-btn')){
				this.dom.$elasticLayer.hide();
				this.layerStatus(1);
				$('body').unbind('touchmove');
				$("#yxWrapper").css({
					overflow:"visible",
					heigth:"auto",
					position:"static",
				})
				this.clearCountDown($('.send-btn'), '重新发送');
			}

		});
	}
	//发送抽奖结果
	receivePrize(isAgain){
		var that = this,
			_url = (that.interfaceHost||'') +'/activity/TurnTable/' + (isAgain?'ReSendRedeemCode':'ReceivePrize') + '?';
		$.ajax({
			url: _url,
			type:(isAgain?"GET":"POST"),
			data:{
				"activityId":activityId,
				"recordId":that.recordId,
				"userKey":that.userKey,
				"userTel":that.dom.$telBoxInput.val()
			},
			success:function(res){
				// console.log(res)
				if(!res.Result){
					tools.showAlert(res.Message);
					
				}else{
					if(isAgain){
						tools.showAlert(res.Data.Msg);
						// 记录重新发送次数
						that._numReceivePrize = res.Data.Count;
						that.layerStatus(2);
					}else{
						that.clearCountDown($('.ver-code-btn'), '获取验证码');
						if(!res.Data.ReceivePrizeFlag){
							that.dom.$elasticLayer.hide();
							tools.showAlert(res.Data.ReceivePrizeMsg);
						}else{
							that.layerStatus(2);
						}
						
					}
					
				}	
			}
		})
	}

	//倒计时
	countDown(item,text){
		var that = this;

		this.isGetCode = false;
		var _timerNum = 60;
		item.addClass("disable").text(_timerNum+"秒后获取");

		this._timerTurntable = setInterval(()=>{
            if(--_timerNum <= 0){
                clearInterval(this._timerTurntable);
                item.removeClass("disable").text(text||"获取验证码");
                this.isGetCode = true;
                return;
            }
        	item.addClass("disable").text(_timerNum+"秒后获取");
   		}, 1000);
	}
	// 清除倒计时
	clearCountDown(item, text){
		item.removeClass('disable').text(text||'获取验证码');
        this.isGetCode = true;
        clearInterval(this._timerTurntable);
	}

	//获取验证码
	getCode(telNum,item,text){
		var that = this;
		that.countDown(item,text)

		$.ajax({
			url: (that.interfaceHost||'') +'/activity/TurnTable/GetCode?',
			type:"POST",
			data:{
				"mobile":telNum
			},
			success:function(res){
				if(!res.Result){
					tools.showAlert(res.Message)
				}	
			}
		})
	}
	//验证验证码
	checkCode(telNum,codeNum){
		var that = this;
		$.ajax({
			url: (that.interfaceHost||'') +'/activity/TurnTable/CheckCode?',
			type:"POST",
			data:{
				"mobile":telNum,
				"validatecode":codeNum
			},
			success:function(res){
				// console.log(res);
				if(res.Result){
					that.isGetCode = true;
					that.receivePrize();
				} else {
					tools.showAlert(res.Message);
				}
	
			}
		})
	}	
	//弹层切换
	layerStatus(num){
        this.dom.$verCodeInput.val("");
		if(num==2){
			this.dom.$elasticLayerBox.addClass('layer2');
			this.dom.$telBoxInput.attr("disabled",true);
			this.dom.$layerBtm1.hide();
			this.dom.$layerBtm2.show();
			
		}else{
			this.dom.$telBoxInput.removeAttr("disabled");
			this.dom.$layerBtm2.hide();
			this.dom.$layerBtm1.show();
			this.dom.$elasticLayerBox.removeClass('layer2');
		}

		$('body').bind('touchmove',function(e){
            e.preventDefault();
        });
		$("#yxWrapper").css({
			overflow:"hidden",
			heigth:"100%",
			position:"fixed",
		})

	}
	//最近申请
	recentApp(){
		var that = this;
		//申请人数
		$.ajaxJSONP({
	        url: APIURL + "api/Other/GetNewCarLoanStatisticsInfo?callback=?",
	        success: function (data) {
	            //console.log(data)
	            that.dom.$applyNowPepoleNum.text(data.Data.ApplyingNum + "人");
	        },
	        complete: function () {

	        }
	    });
		//申请信息
		$.ajaxJSONP({
		    url: APIURL + "api/LoanOrder/GetNewestLoanOrderApprovalInfo?top=7&callback=?",
		    success: function (data) {
		        for (var i = 0; i < data.Data.length; i++) {
		            var strInfo =`${data.Data[i].UserCallName}　${data.Data[i].LoanCompanyName}　额度${that.quotaFormat(data.Data[i].ApproveQuota)}`;
		            var node = `<div class="swiper-slide">
		            				<div class="width-percent-100 height-percent-100 text-overflow-ellipsis" style="line-height: 0.4rem;">${strInfo}</div>
		            			</div>`;
		            that.dom.$applyHistoryInfo.append(node);
		        }
		        var applyNow_swiper = new Swiper('.second-block-line-3-applyHistory .swiper-container', {
		            autoplay: 3000,
		            direction: 'vertical',
		            slidesPerView: 1,
		            loop: true,
		            spaceBetween: 10,
		            simulateTouch: false,
		            noSwiping: true,
		            observer:true,//修改swiper自己或子元素时，自动初始化swiper
		            observeParents:true,//修改swiper的父元素时，自动初始化swiper
		            onSlideChangeEnd: function(swiper){
		                swiper.update();
		            },
		        });
		    },
		    complete: function () {

		    }
		})
	}

	quotaFormat(value) {
	    return (value / 10000).toFixed(2) + "万";
	}

	//限时抢购
	panicBuying(){
		var five_mySwiper = new Swiper('.five-block .swiper-container', {
	        slidesPerView: 'auto',
	        observer:true,
	        observeParents:true,
	        onInit: function (swiper) {
	            if (swiper.snapIndex == 1) {
	                $('.five-block .swiper-pagination').hide();
	            }
	        }
	    });
	}

	//滚动logo
	scrollLogo(){
		var scrollLogo_Swiper = new Swiper('.logo-list .swiper-container', {
			autoplay: 3000,
			loop: true,
			slidesPerView:4,
			slidesPerGroup:4,
	        observeParents:true,
	        observer:true,
	        simulateTouch: false,
	        onlyExternal : true,
	    });

	}

	//选车型
	selectCar(){
	    this.dom.$selectCar.on('click', function (e) {
	        e.preventDefault();
	        var self = this;
	        selCar.carSelect({
	            onlyOnSale: true,
	            showLevel: 2,
	            showAllBrand: false,
	            hide: true,
	        }, function (result) {
	            setTimeout(function () {
	                if (result.allBrand) {

	                } else if (result.hotCar) {
	                    document.location.href = xinche_m_url +'/' + localCity.CitySpell + '/' + result.hotCar.CarSerialAllSpell + "?source=" + ttSource;
	                } else if (result.searchCar) {
	                    if (result.searchCar.type == "主品牌") {
	                    } else if (result.searchCar.type == "子品牌" || result.searchCar.type == "品牌") {
	                        document.location.href = xinche_m_url + '/' + localCity.CitySpell + '/' + result.searchCar.spell + "?source=" + ttSource;
	                    }
	                } else {
	                    if (result.carType) {
	                        document.location.href = xinche_m_url + '/' + localCity.CitySpell + '/' + result.carType.spell + "?source=" + ttSource;
	                    } else if (result.brand) {
	                        document.location.href = xinche_m_url + '/' + localCity.CitySpell + '/' + result.brand.spell + "?source=" + ttSource;
	                    }
	                }
	            }, 110);
	        });
	    });
	}

	//中奖快报
	winningExpress(){
		var winningExpress_Swiper = new Swiper('#winningExpress', {
            autoplay: 3000,
            direction: 'vertical',
            slidesPerView : 3,
			slidesPerGroup : 3,
            loop: true,
            simulateTouch: false,
	        onlyExternal : true,
            observer:true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents:true,//修改swiper的父元素时，自动初始化swiper
            onSlideChangeEnd: function(swiper){
                swiper.update();
            }
        });
	}

	//转盘游戏
	playGame(){

		var turntableGame = new TurntableGame("turntable",prizeData,(obj)=>{
			if(this.isResultCorrect){
				turnCount++;
				setTimeout(()=>{
					this.resultsLayer(obj);
				}, 1000)
				
			}
			this.isStartgame = false;
			$("#showAlertBox").hide();
		});

		//开始按钮
		$(".pointer").on('click', (event)=>{
			event.preventDefault();
			// console.log(turnCount)
			if(!this.isStartgame){
				if(turnCount<2){
					this.startTimer =  +new Date();
					this.isStartgame = true;
					this.getWinningResults(turntableGame);
					turntableGame.start();
					$('body').bind('touchmove',function(e){
			            e.preventDefault();
			        });
				}else{
					$('body').unbind('touchmove');
					tools.showAlert("今天的抽奖机会已用完");
				}
			}
				
			

		});

	}
	//获取得奖结果
	getWinningResults(gameItem){
		var that = this;
		$.ajax({
			url: (that.interfaceHost||'') +'/activity/TurnTable/GetPrize?',
			data:{
				"activityId":activityId,
				"userKey":that.userKey
			},
			success:function(res){
				that.curTimer =  +new Date();
				var _timer = that.curTimer - that.startTimer;
				if(res.Result){
					if(res.Data.Id == 0){
						tools.showAlert("出错了，请稍后再试",99999);
						that.isResultCorrect = false;
						gameItem.setResult(prizeMatching[10]);
					}else{
						
						if(_timer >= 3000){
							gameItem.setResult(prizeMatching[res.Data.Id]);
						}else{
							setTimeout(function(){
								gameItem.setResult(prizeMatching[res.Data.Id]);
							},(3000 - _timer))
						}
						
					}

					that.recordId = res.Data.RecordId;
				
				}else{
					tools.showAlert(res.Message);
					that.isResultCorrect = false;
					if(_timer >= 3000){
						gameItem.setResult(0);
					}else{
						setTimeout(function(){
							gameItem.setResult(0);
						},(3000 - _timer))
					}
				}
			}
		})
	}
	//结果弹层
	resultsLayer(data){
		var prizeData = data;
		this.dom.$prizeName.text(prizeData.name);
		this.dom.$prizeIntro.text(prizeData.intro);
		this.dom.$prizeImg[0].className = "prize-img prize" + prizeData.id;
		this.dom.$elasticLayer.css({
			display:"block"
		});
		$('body').bind('touchmove',function(e){
            e.preventDefault();
        });
	}
}

$(function(){
	new CurPage();		
})

