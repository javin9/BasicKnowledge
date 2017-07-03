var path = require('path');
var htmlWebpackPlugin = require('html-webpack-plugin'); //commonJS的写法
module.exports = {
	entry: {
		main: './src/js/main.js',
		a: './src/js/a.js'
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'js/[name]-[chunkhash].js',
		publicPath:'http://m.taoche.com'//上线用  把项目中的文件应用替换成 带域名的
	},
	plugins:[
	  new htmlWebpackPlugin({
	  	template:'index.html',
	  	filename:'index.html',//index-[hash].html
	  	inject:'head',//位置  可以是false就不会注入
	  	title:'webpack is title', //自定义
	  	minify:{
	  		
	  	}//对需要的js进行压缩配置
	  })
	]
	
}

/*
 *[name] key的值
 *[hash] 本次打包的hash值
 * [chunkhash] 文件的hash值  类似于版本号 没有更改多的hash值不会改变
 * 
 * */