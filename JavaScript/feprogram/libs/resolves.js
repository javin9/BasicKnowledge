var config = require('./config')
var path = require('path')

module.exports = function(isDev){
	return {
		extensions: ['', '.js', '.vue', '.jsx'],
		alias : {
			'libs' : path.join(config.srcDir, 'libs'),
			'jquery.lazyload' : 'jquery-lazyload/jquery.lazyload',
			'masonry-layout' : 'masonry-layout/dist/masonry.pkgd.min.js',
			'base' : config.srcDir
		}
	}
}