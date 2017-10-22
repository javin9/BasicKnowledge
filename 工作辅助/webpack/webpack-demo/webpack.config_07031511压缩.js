var path = require('path');
var htmlWebpackPlugin = require('html-webpack-plugin'); //commonJS的写法
module.exports = {
	entry: {
		main: './src/js/main.js',
		a: './src/js/a.js'
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'js/[name]-[chunkhash].js'
	},
	plugins:[
	  new htmlWebpackPlugin({
	  	template:'index.html',
	  	filename:'index.html',//index-[hash].html
	  	inject:'head',//位置
	  	title:'webpack is title',//自定义
	  	minify:{
	  		
	  	}
	  })
	]
	
}

/*
 *[name] key的值
 *[hash] 本次打包的hash值
 * [chunkhash] 文件的hash值  类似于版本号 没有更改多的hash值不会改变
 * 
 * */