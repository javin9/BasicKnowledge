const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin'); //commonJS的写法

module.exports = {
	entry: './src/app.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'js/[name].js'
	},
	module: {
		rules: [{
				test: /\.js?$/,
				loader: "babel-loader",
				include: [
					path.resolve(__dirname, "./src")
				],
				exclude: [
					path.resolve(__dirname, "./node_modules")
				],
				options: {
					presets: ["latest"]
				}
			},
			{
				test: /\.css$/,
				include: [
					path.resolve(__dirname, "./src")
				],
				exclude: [
					path.resolve(__dirname, "./node_modules")
				],
				use: ['style-loader', {
						loader: 'css-loader',
						options: {
							importLoaders: 1
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: function() {
								return [require('autoprefixer')({
									browsers: ["last 5 versions"],
									//add: false
								})];
							}
						}
					},
					"less-loader"
				]
			}, {
				test: /\.less$/,
				include: [
					path.resolve(__dirname, "./src")
				],
				exclude: [
					path.resolve(__dirname, "./node_modules")
				],
				use: ['style-loader', 'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							plugins: function() {
								return [require('autoprefixer')({
									browsers: ["last 5 versions"],
									//add: false
								})];
							}
						}
					},
					"less-loader"
				]
			},
			{
				test:/\.html$/,
				include: [
					path.resolve(__dirname, "./src")
				],
				exclude: [
					path.resolve(__dirname, "./node_modules")
				],
				use:['html-loader']
			},
			{
			     test:/\.tpl$/,
			     include: [
					path.resolve(__dirname, "./src")
				],
				exclude: [
					path.resolve(__dirname, "./node_modules")
				],
				use:['ejs-loader']
			},
			{
				test:/\.(png|jpg|jpeg|svg|gif)$/i,
				 include: [
					path.resolve(__dirname, "./src")
				],
				exclude: [
					path.resolve(__dirname, "./node_modules")
				],
				use:[
				{
					loader:'file-loader',
					//loader:'url-loader',
					options:{
						name:'[name]-[hash].[ext]',
						limit:20000150
					}
					}
				]
			}
		]
	},
	plugins: [
		new htmlWebpackPlugin({
			template: 'index.html',
			filename: 'index.html',
			inject: 'body' //位置
		})
	]

};

/*
  一、babel
1、babel是一个转换编译器,它能将ES6转换成可以在浏览器中运行的代码
2、安装babel
终端目标文件夹输入：npm install --save-dev babel-loader babel-core
3、loader:'babel-loader'可以正常运行，视频中的loader:'babel'不能正常运行。
4、babel的loader是一个非常耗时的转换。
改善之前的时间是8260ms
二、query: ['kwɪərɪ]查询
presets:[priː'sets] 
三、安装plugin的latest
终端目标文件输入：npm install --save-dev babel-preset-latest
四、改善：
（1）webpack 的api的configuration
loaders的参数5个：test,exclude,include,loader,loaders
（2）改善方法：exclude,include参数
例如：exclude:'./node_modules/',//node_modules是已经引用过的，已经打包过的文件，其实这里对速度没有影响，这是告诉你如果是不相关的文件，可以用exclude
include:'./src/',
1）会报错：-configuration.module.loaders[0].exclude: The provided value "./node_modules/" is not an absolute path!
2）报错的解决方法：
    exclude:__dirname+'/node_modules/',//已经引用过的，已经打包过的文件
    include:__dirname+'/src/',
（3）这样初步改善后时间是1210ms
五、给loader指定参数presets
1、直接Loader后跟问号
require('url-loader?mimetype=images/png!./file.png');
2、配置文件中跟问号
3、配置文件中用query
4、项目根目录建立babelrc配置文件，配置文件中一个对象，对象中参数为presets.
5、config.js中指定babel，babel指定presets. 
 * */