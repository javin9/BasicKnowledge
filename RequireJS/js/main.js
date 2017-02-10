require.config({
	baseUrl: 'js',
	paths: {
		jquery: 'lib/jquery',
		store: 'lib/store',
		underscore: 'lib/underscore',
		domReady:'lib/domReady'
	},
	shim: {
		store: {
			deps: ['jquery']
		}
	}
});

define(function(require) {
	var $ = require('jquery'),
	 domReady = require('domReady');
//	 store=require('store');

	domReady(function() {
		// Init common module code here
		console.log('init');
	});
});