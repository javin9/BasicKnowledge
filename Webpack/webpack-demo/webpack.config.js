var path = require('path');
var htmlWebpackPlugin = require('html-webpack-plugin'); //commonJS的写法
module.exports = {
	entry: {
		main: './src/js/main.js',
		a: './src/js/a.js',//a页面的入口
		b: './src/js/b.js',//b页面的入口
		c: './src/js/c.js',//c页面的入口
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'js/[name]-[chunkhash].js',
		publicPath:'http://m.taoche.com'
	},
	plugins:[
	  new htmlWebpackPlugin({
	  	template:'index.html',
	  	filename:'a.html',//index-[hash].html  
	  	inject:'head',//位置
	  	title:'this is A',//自定义
	  	chunks:['main','a']//指定的js文件
	  }),
	  new htmlWebpackPlugin({
	  	template:'index.html',
	  	filename:'b.html',//index-[hash].html
	  	inject:'head',//位置
	  	title:'this is B',//自定义
	    //chunks:['main','b']//指定的js文件
	   excludeChunks:['a','c']//除了谁
	  }),
	   new htmlWebpackPlugin({
	  	template:'index.html',
	  	filename:'c.html',//index-[hash].html
	  	inject:'head',//位置
	  	title:'this is C',//自定义
	    chunks:['main','c'],//指定的js文件
	    // //excludeChunks:['a','b']//除了谁
	  	minify:{
	  		removeComments:true
	  	}
	  })
	]
	
}
