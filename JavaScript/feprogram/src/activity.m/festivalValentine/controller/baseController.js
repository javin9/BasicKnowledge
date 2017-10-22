class BaseController{
	constructor(){
		this.win = $(window)
	}

	goToPage(view){
		this.win.trigger('goToPage', view)
	}

	showPage(view){
		this.win.trigger('showPage', view)
	}

	getDispatchStatus(){
		return this.win.triggerHandler('getDispatchStatus')
	}

	setDispatchStatus(status){
		this.win.trigger('setDispatchStatus', status)
	}
}

export default BaseController