define(function(require, exports, module){
	console.log(module);
	console.log(module.config());
	console.log('it work');
	return {
		showName:function(){
			console.log("我是a.js");
		}
		
	}
});