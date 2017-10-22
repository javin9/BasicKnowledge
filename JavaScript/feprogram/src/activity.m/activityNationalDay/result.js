require('./index.scss');

import CAR_INFO from './config';

class Result{
	constructor(){
		this.url = "/activity/activityNationalDay/SaveNationalDayUserInfo";
		this.carid = parseInt(tools.getUrlParam("carid"));
		this.carObj;
		this.domCache={
			$maskLayer:$(".mask-layer"),
			$share:$(".share"),
			$carInfo:$(".car-info"),
			$carInfoSpan:$(".car-info>span"),
			$carInfoDiv:$(".car-info>div"),
			$carName:$(".level-intr .car-name"),
			$btn:$(".button"),
		}
		this.sendData();
		this.render();
		this.bindEvents();
	}
	bindEvents(){
		this.domCache.$btn.on('click', (e)=>{
			e.preventDefault();
			if($(e.target).hasClass('btn01')){
				this.domCache.$maskLayer.removeClass('hide');
				this.domCache.$share.removeClass('hide');
			}else if($(e.target).hasClass('btn02')){
				location.href="/activity/activityNationalDay/index?v="+Math.random();
			}else{
				location.href="http://m.daikuan.com/activity/GQ16M?from=695";
			}
			
		});

		this.domCache.$maskLayer.on('click', (e)=>{
			event.preventDefault();
			this.domCache.$maskLayer.addClass('hide');
			this.domCache.$share.addClass('hide');
		});
	}
	render(){
		for(let i=0;i<CAR_INFO.length;i++){
			if(this.carid == CAR_INFO[i].id){
				this.carObj = CAR_INFO[i];
				this.carObj.index = i;
			}
		}
		// console.log(this.carObj)
		if(this.carObj){
			this.domCache.$carInfo.addClass('car1'+this.carObj.index);
			this.domCache.$carInfoDiv.text('月供低至' + this.carObj.carPrice +'元起')
			this.domCache.$carName.text(this.carObj.carName);
			this.domCache.$carInfoSpan.text(this.carObj.carIntr +"！");
		}
	}
	sendData(){
		$.ajax({
			url: this.url,
			type: 'get',
			dataType: 'json',
			data: {NickName: nickname,CarId:this.carid},
			success:function(res){
				rowId = res.Data.ID;
                if (uploadCallback && typeof uploadCallback === 'function') {
                    uploadCallback(res);
                }
			}
		})
		
		
	}
}

//走起
new Result();