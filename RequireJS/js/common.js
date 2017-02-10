require.config({
	baseUrl:'./js',
	paths:{
		'jquery':'./lib/jquery',
		'store':'./lib/store',
		'underscore':'lib/underscore'
	},
	shim:{
		underscore:{
			exports:'_'
		},
		store:{
			deps:['jquery',''],
		}
	}
});

/*
 * ./ 当前目录
 * ../ 父级目录
 * / 根目录
 */