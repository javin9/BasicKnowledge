var os = require("os");

// CPU 的字节序
console.log('endianness : ' + os.endianness());

// 操作系统名
console.log('type : ' + os.type());

// 操作系统名
console.log('platform : ' + os.platform());

// 系统内存总量
console.log('total memory : ' + os.totalmem() + " bytes.");

// 操作系统空闲内存量
console.log('free memory : ' + os.freemem() + " bytes.");

console.log('=======================path===========================');
var path = require("path");

// 格式化路径
console.log('normalization : ' + path.normalize('/test/test1//2slashes/1slash/tab/..'));

// 连接路径
console.log('joint path : ' + path.join('/test', 'test1', '2slashes/1slash', 'tab', '..'));

// 转换为绝对路径
console.log('resolve : ' + path.resolve('main.js'));

// 路径中文件的后缀名
console.log('ext name : ' + path.extname('main.js'));
/*
process.cwd() 是当前执行node命令时候的文件夹地址 ——工作目录，保证了文件在不同的目录下执行时，路径始终不变
__dirname 是被执行的js 文件的地址 ——文件所在目录

当前Node.js进程执行时的工作目录
__dirname: 当前模块的目录名

*/
console.log('process.cwd()==='+process.cwd());
console.log('__dirname==='+__dirname);

//path.normalize 路径整理
var path = require('path');

var str = path.normalize('./path//upload/data/../file/./123.jpg');
console.log(str); // path/upload/file/123.jpg

//path.join 拼接路径
var path = require('path');

var str = path.join('./path/./', './upload', '/file', '123.jpg');
console.log(str); // path/upload/file/123.jpg

var str = path.join('path', 'upload', 'file', '123.jpg');
console.log(str); // path/upload/file/123.jpg

var arr = ['path', 'upload', 'file', '123.jpg'];
var str = path.join.apply(null, arr);
console.log(str); // path/upload/file/123.jpg

//path.resolve 绝对路径  这个绝对路径操作，跟上面的不太一样，如果你懂命令行 cd 命令，那就秒懂了，否则需要花点时间多跑几个例子才能理解。这次直接上官方例子。
console.log('resolve'); // path/upload/file/123.jpg
path.resolve('foo/bar', '/tmp/file/', '..', 'a/../subfile');
/*
//相当于命令
cd foo/bar
cd /tmp/file/
cd ..
cd a/../subfile
pwd
*/
// 
var package=require(path.resolve(process.cwd(), 'package.json'))
console.log(package.name);

/*我们先创建webpack.config.js文件，即我们的基本配置文件，通常的情况下我们会把所有的配置项都写在这里面，但这里我们会把配置项拆分，把详细的配置项都放到了cfg文件夹中，并且分开开发环境和生产环境使用。 
　　首先我们需要读取开发环境或者生产环境的参数，我这里使用了minimist模块来读取命令行的参数*/
//console.log('process.argv=='+process.argv);//process.argv.slice(2)
//console.log('process.argv=='+process.argv.slice(2));//process.argv.slice(2)

 const args = require("minimist")(process.argv.slice(2));
 console.log(args);
