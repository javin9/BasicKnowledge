/**
 * Created by zMouse.
 */

/*
* __filename : 返回当前模块文件解析后的绝对路径，该属性其实并非全局的，而是模块作用域下的
* __dirname : 返回当前模块文件所在目录解析后的绝对路径，该属性也不是全局的，而是模块作用域下的
* */

//console.log(__filename);
//console.log(__dirname);

//var d = new Date();
//var arr = new Array(1,2,3);

setInterval(function() {

    var d = new Date();

    console.log( '现在是：' + d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() );

}, 1000);
