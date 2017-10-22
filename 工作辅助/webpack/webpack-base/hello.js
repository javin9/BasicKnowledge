require('./worlds.js');
require('style-loader!css-loader!./main.css');//css-loader 处理css文件，style-loader把生成好的css文件用style标签的形式插入到页面上
function hello(){
	console.log('hello world');
}

hello();