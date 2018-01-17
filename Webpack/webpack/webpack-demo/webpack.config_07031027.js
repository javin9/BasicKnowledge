var path=require('path');

module.exports={
//	entry: ['./src/js/main.js', './src/js/a.js'],
    entry:{
    	main:'./src/js/main.js',
    	a:'./src/js/a.js'
    },
	output:{
		path:path.resolve(__dirname,'./dist/js'),
		filename:'[name]-[chunkhash].js'
		//	filename:'[name]-[hash].js'
	}
}

/*
 *[name] key的值
 *[hash] 本次打包的hash值
 * [chunkhash] 文件的hash值  类似于版本号 没有更改多的hash值不会改变
 * */