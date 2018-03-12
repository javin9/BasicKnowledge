/**
 * Created by 毅 on 2015/10/25.
 */
var http = require('http');
var url = require('url');

var server = http.createServer();

/*var urlStr = url.parse( 'http://www.baidu.com:8080/a/index.html?b=2#p=1' );
console.log(urlStr);*/

server.on('request', function(req, res) {

    //req.url ： 访问路径
    //?后面的部分 query string
    //console.log(req.url);

    var urlStr = url.parse( req.url );
    //console.log(urlStr);

    switch (urlStr.pathname) {
        case '/':
            //首页
            res.writeHead(200, {
                'content-type' : 'text/html;charset=utf-8'
            });
            res.end('<h1>这是首页</h1>');
            break;

        case '/user':
            //用户首页
            res.writeHead(200, {
                'content-type' : 'text/html;charset=utf-8'
            });
            res.end('<h1>个人中心</h1>');
            break;

        default:
            //处理其他情况
            res.writeHead(404, {
                'content-type' : 'text/html;charset=utf-8'
            });
            res.end('<h1>页面被LEO吃掉了</h1>');
            break;
    }

});

server.listen(8080, 'localhost');
