var path = require('path')
module.exports={
	entry:'./src/js/main.js',//入口文件
	output:{
		path:path.resolve(__dirname,'./dist/js'),
		filename:'bundle.js'
	}
};