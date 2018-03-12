/**
 * Created by 毅 on 2015/10/25.
 */

/*
* 搭建一个http的服务器，用于处理用户发送的http请求
* 需要使用node提供一个模块  http
* */

//加载一个http模块
var http = require('http');
//通过http模块下的createServer创建并返回一个web服务器对象
var server = http.createServer();

server.on('error', function(err){
    console.log(err);
});

server.on('listening', function() {
    console.log('listening...');
})

server.on('request', function(req, res) {
    console.log('有客户端请求了');

    //console.log(req);

    //res.write('hello');

    res.setHeader('miaov', 'leo');

    res.writeHead(200, 'miaov', {
        //'content-type' : 'text/plain'

        'content-type' : 'text/html;charset=utf-8'
    });

    res.write('<h1>hello</h1>');

    res.end();

})

server.listen(8080, 'localhost');

//console.log(server.address());

