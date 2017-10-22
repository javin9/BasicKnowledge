require('./index.scss');

import CAR_INFO from './config';

class Game {
	constructor(){
		this.domCache={
			$btn:$("#btn"),
			$index:$(".index"),
			$sexSelect:$(".sexSelect"),
			$level1Game:$(".level1Game"),
			$level1Result:$(".level1Result"),
			$level2Game:$(".level2Game"),
			$level2Result:$(".level2Result"),
			$level3Game:$("level3Game"),
			$sexSelSpan:$("#sexSelect>span"),
			$level1:$("#level1"),
			$level2:$("#level2"),
			$level3:$("#level3"),
			$carImg:$("#level1 .carTransition"),
			$level1Title:$("#level1 .level-title"),
			$level1IntrDt:$("#level1 .level-intr dt"),
			$level1IntrDd:$("#level1 .level-intr dd"),
			$level1Key:$("#level1 .car-key"),
			$level1CountDown:$("#level1 .count-down"),
			$level1Arrow:$("#level1 .key-arrow"),
			$level2People:$("#level2 .people"),
			$level2Score:$("#level2 .level-2-score"),
			$level2IntrDd:$("#level2 .level-intr dd"),
			$level2Photo:$("#level2 .photo-frame"),
			$level3ConUl:$("#level3 .level-3-con ul"),
			$level3ConLi:$("#level3 .level-3-con li"),
			$level3IntrDd:$("#level3 .level-intr dd"),
		}
		this.sex;
		this.level2Timer;
		this.curState = 0;
		this.btnState = true;
		this.selCarBtnState = false;//第一关选车
		this.allState = ["index","sexSelect","level1Game","level1Result","level2Game","level2Result","level3Game"];
		this.carPosition = ["left-car","center-car","right-car"];
		this.score="0";
		this.scoreArr=['9.8','9.5','9.3','8.9','8.5','8.0','7.8','7.2','6.8'];
		this.rdmCarMax;
		this.rdmCarMin;
		this.bindEvents();
	}
	
	//绑定事件
	bindEvents(){
		this.domCache.$btn.on("click",(e)=>{
			e.preventDefault();
			if(this.btnState){
				switch(this.curState)
				{
				case 0:
				  this.index();
				  break;
				case 1:
				  this.sexSelect();
				  break;
				case 2:
				  this.level1Game();
				  break;
				case 4:
				  this.level2Game();
				  break;
				case 5:
				  this.level2Result();
				  break;
				case 6:
				  this.level3Game();
				  break;
				default:
				  this.jumpResult();
				}

			}
			
			
		})

		this.domCache.$sexSelSpan.on('click',(e)=>{
			$(e.target).addClass('cur').siblings('span').removeClass('cur');
			if($(e.target).index()==0){
				this.sex = "boy";
			}else{
				this.sex = "girl";
			}
			
		})
		//第一关选择车
		this.domCache.$carImg.on('click',(e)=>{
			if(this.selCarBtnState){
				$(e.target).addClass('cur');
				//判断是否选择正确
				if($(e.target).hasClass(this.carPosition[1])){
					this.level1Result('correct');
				}else{
					this.level1Result('error');
				}
				this.curState += 1;
				this.selCarBtnState = false;
			}
			
		});
		//第三关选择逼格
		this.domCache.$level3ConLi.on('click',(e)=>{
			$(e.target).addClass('cur').siblings('li').removeClass('cur');
			let _index = $(e.target).index();
			if(((_index==0 || _index ==1 || _index ==2)&&this.sex=="girl") ||
				((_index==0 || _index ==3 || _index ==4)&&this.sex=="boy")){
				this.rdmCarMin = 1;
				this.rdmCarMax = 2;
			}else{
				this.rdmCarMin = 3;
				this.rdmCarMax = 4;
			}

		});
	}
	//首页按钮点击
	index(){
		this.btnState = false;
		this.domCache["$" + this.allState[this.curState]].addClass('hide');
		this.domCache["$" + this.allState[this.curState+1]].removeClass('hide');
		this.curState += 1;
		this.domCache.$btn.text("下一步");
		this.btnState = true;
	}
	//性别选择页面按钮
	sexSelect(){
		if(this.domCache.$sexSelSpan.hasClass('cur')){
			this.domCache["$" + this.allState[this.curState]].addClass('hide');
			this.domCache["$" + this.allState[this.curState+1]].removeClass('hide');
			this.domCache.$level1.removeClass('hide');
			this.domCache.$btn.text("开始挑战");
			this.curState += 1;
			this.domCache.$level2People.addClass(this.sex);
		}else{
			tools.showAlert('请选择性别');
		}
		
	}
	//第一关开始游戏
	level1Game(){
		this.btnState = false;
		this.domCache.$level1Key.removeClass('fadeInDownUp').addClass('bounceOutDown');
		this.domCache.$level1Arrow.removeClass('showHide').addClass('bounceOutDown');
		var timeout = setTimeout(()=>{
			window.clearTimeout(timeout);
			this.domCache.$level1CountDown.removeClass('hide');
			var _num = 3;
			var countDown = setInterval(()=>{
				_num--;
				this.domCache.$level1CountDown.text(_num);
				if(_num ==0){
					window.clearInterval(countDown);
					this.domCache.$level1CountDown.addClass('hide');
					this.level1GameStart();
				}
			},1000);
		},1000);		
	}
	//第一关开始游戏
	level1GameStart(){
		var num = 0;
		var timing = setInterval(()=>{
			var rdm = parseInt(3*Math.random())+1;
			num+=1;
			if(num==10){
				this.selCarBtnState = true;
				this.domCache.$level1CountDown.text('请选择车辆').removeClass('hide');
				window.clearInterval(timing);
			}
			if(rdm==1){
				this.domCache.$carImg.eq(0).removeClass(this.carPosition[0]).addClass(this.carPosition[1]);
				this.domCache.$carImg.eq(1).removeClass(this.carPosition[1]).addClass(this.carPosition[0]);
				let arr1 = this.carPosition[0],
					arr0 = this.carPosition[1];
				this.carPosition[0] = arr0;
				this.carPosition[1] = arr1;
			}else if(rdm==2){
				this.domCache.$carImg.eq(0).removeClass(this.carPosition[0]).addClass(this.carPosition[2]);
				this.domCache.$carImg.eq(2).removeClass(this.carPosition[2]).addClass(this.carPosition[0]);
				let arr2 = this.carPosition[0],
					arr0 = this.carPosition[2];
				this.carPosition[0] = arr0;
				this.carPosition[2] = arr2;	
			}else{
				this.domCache.$carImg.eq(1).removeClass(this.carPosition[1]).addClass(this.carPosition[2]);
				this.domCache.$carImg.eq(2).removeClass(this.carPosition[2]).addClass(this.carPosition[1]);
				var arr2 = this.carPosition[1],
					arr1 = this.carPosition[2];
				this.carPosition[1] = arr1;
				this.carPosition[2] = arr2;
			}
			// console.log(this.carPosition[1]);
		},500);
	}
	//第一关游戏结束
	level1Result(str){
		this.domCache.$level1CountDown.addClass('hide');
		this.domCache["$" + this.allState[this.curState]].addClass('hide');
		
		if(str == "correct"){
			this.domCache.$level1Title.text("第一关：考眼力");
			this.domCache.$level1IntrDt.text("　好眼力！");
			this.domCache.$level1IntrDd.text("GOOD EYE");
			this.domCache["$" + this.allState[this.curState+1]].removeClass('hide').text('Yes!');
		}else if(str == "error"){
			this.domCache.$level1Title.text("第一关：考眼力");
			this.domCache.$level1IntrDt.text("　眼力不咋地！");
			this.domCache.$level1IntrDd.text("BAD EYESIGHT");
			this.domCache["$" + this.allState[this.curState+1]].removeClass('hide').text('No!');
		}

		this.domCache.$btn.text('下一关');
		this.curState += 1;
		this.btnState = true;
		// console.log(this.curState)
	}
	//第二关开始
	level2Game(){
		this.domCache.$btn.text('拍照')
		this.domCache.$level1.addClass('hide');
		this.domCache.$level2.removeClass('hide');

		var rdm;
		this.level2Timer = setInterval(()=>{
			rdm = parseInt(9*Math.random())+1;
			this.score = this.scoreArr[rdm-1];
			this.domCache.$level2People[0].className='people rdmPos'+ rdm +' ' + this.sex;
		},1000);
		this.btnState = true;
		this.curState += 1;
	}
	//第二关结果
	level2Result(){
		this.domCache.$level2IntrDd.addClass('hide');
		this.domCache.$level2Score.text(this.score+'分').addClass('seal');
		this.domCache.$level2Photo.addClass('level-2-result');
		this.domCache["$" + this.allState[this.curState]].removeClass('hide');
		this.btnState = true;
		this.curState += 1;
		this.domCache.$btn.text('下一关');
		window.clearInterval(this.level2Timer);
	}
	//第三关
	level3Game(){
		if(this.sex == "girl"){
			this.domCache.$level3IntrDd.html('如果给车里备一些零食，你会选<br/>择以下哪一种好吃哒？');
		}else{
			this.domCache.$level3IntrDd.html('不开车的时候终于可以喝酒呢！<br/>你会选择以下哪种酒？');
			
		}
		this.curState += 1;
		this.domCache.$level3ConUl.addClass(this.sex);
		this.domCache.$btn.text('提交选择');
		this.domCache.$level2.addClass('hide');
		this.domCache.$level3.removeClass('hide');
	}
	//最终结果
	jumpResult(){
		if(this.domCache.$level3ConLi.hasClass('cur')){
			let rdm = parseInt((this.rdmCarMax - this.rdmCarMin +1)*Math.random()+this.rdmCarMin);	
			// console.log(rdm);
			location.href="/activity/activityNationalDay/result?carid=" + CAR_INFO[rdm-1].id;
		}else{
			tools.showAlert((this.sex=='boy')?"请选择一种酒":"请选择一种零食");
		}
	}
}

//走起
new Game();