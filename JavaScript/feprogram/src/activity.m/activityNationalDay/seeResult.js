require('./index.scss');

import CAR_INFO from './config';

class SeeResult{
	constructor(){
		this.carid = carid;
		this.carObj;
		this.domCache={
			$carInfo:$(".car-info"),
			$carInfoDiv:$(".car-info>div"),
			$carInfoSpan:$(".car-info>span"),
			$carName:$(".level-intr .car-name"),
			$btn:$(".button")
		}
		this.render();
		this.bindEvents();
	}
	bindEvents(){
		this.domCache.$btn.on('click', (e)=>{
			e.preventDefault();
			location.href="/activity/activityNationalDay/index?v="+Math.random();
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
			this.domCache.$carInfo.addClass('car0'+this.carObj.index);
			this.domCache.$carInfoDiv.text('月供低至' + this.carObj.carPrice +'元起')
			this.domCache.$carName.text(this.carObj.carName)
			this.domCache.$carInfoSpan.text(this.carObj.carIntr)
		}
	}
}

//走起
new SeeResult();