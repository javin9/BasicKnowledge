// var path=require('path');
// var htmlWebpackPlugin=require('html-webpack-plugin');//commonJS的写法
// module.exports={
// //	entry: ['./src/js/main.js', './src/js/a.js'],
// //context
//     entry:{
//     	main:'./src/js/main.js',
//     	a:'./src/js/a.js'
//     },/ 
// 	output:{
// 		path:path.resolve(__dirname,'./dist/js'),
// 		filename:'[name]-[chunkhash].js'
// 		//	filename:'[name]-[hash].js'
// 	},
// 	plugins:[
// 	new htmlWebpackPlugin({
// 		template:'index.html'
// 	})
// 	]
// }

// /*
//  *[name] key的值
//  *[hash] 本次打包的hash值
//  * [chunkhash] 文件的hash值  类似于版本号 没有更改多的hash值不会改变
//  * */