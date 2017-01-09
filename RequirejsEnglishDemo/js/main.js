/**
 * 1、所有页面使用公共的require配置<br>
 * 2、根据current-page去加载相应地模块，不需要的模块不要去加载<br>
 * 3、每个模块都要按约定去对外暴露一个init的初始化方法，用于页面信息加载时间监听
 * 
 */
require.config({
	baseUrl: '../js/lib',
	paths: {
		jquery: 'jquery-1.7.2',
		sotre: 'store',
		underscore: 'underscore',
		common: 'common',
		a:'a',
		b:'b'
	},
	shim: {
		sotre: {　
			deps: ['jquery', 'underscore'],
		}
	},
	config: {
		'a': {
			size: 'large'
		},
		'b': {
			color: 'blue'
		}
	}
});

//require(['jquery'], function($) {
//	console.log($().jquery);
//});

//	
//});

require(["jquery"], function($) {
	require(["common"], function(common) {
		//		commonInit($, common);
		var currentPage = $("#current-page").attr("current-page");
		var targetModule = $("#current-page").attr("target-module");
		if(targetModule) {
			// 页面加载完毕后再执行相关业务代码比较稳妥
			$(function() {
				require([targetModule], function(targetModule) {
					// 不要在这里写业务代码，全部统一调用init方法,也就是每个模块都暴露一个init方法用于事件监听，页面内容加载等
					targetModule.init(currentPage);
				});
			});
			return;
		}

	});

});