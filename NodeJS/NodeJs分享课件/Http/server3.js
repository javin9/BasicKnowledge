/**
 * Created by 毅 on 2015/10/25.
 */
var http = require('http');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');

var server = http.createServer();

var HtmlDir = __dirname + '/html/';

server.on('request', function( req, res ) {

    var urlStr = url.parse( req.url );

    switch (urlStr.pathname) {
        case '/':
            //首页
            sendData( HtmlDir + 'index.html', req, res );
            break;

        case '/user':
            //用户首页
            sendData( HtmlDir + 'user.html', req, res );
            break;

        case '/login':
            //用户登录
            sendData( HtmlDir + 'login.html', req, res );
            break;

        case '/login/check':
            //console.log(req.method);
            //console.log(urlStr);

            //console.log( querystring.parse(urlStr.query) );

            if (req.method.toUpperCase() == 'POST') {

                var str = '';

                req.on('data', function(chunk) {
                    str += chunk;
                })

                req.on('end', function() {
                    console.log(str);
                    console.log( querystring.parse( str ) );
                })

            }

            break;

        default:
            //处理其他情况
            sendData( HtmlDir + 'err.html', req, res );
            break;
    }

});

function sendData(file, req, res) {
    fs.readFile( file, function(err, data) {

        if (err) {
            res.writeHead(404, {
                'content-type' : 'text/html;charset=utf-8'
            });
            res.end('<h1>页面被LEO吃掉了</h1>');
        } else {
            res.writeHead(200, {
                'content-type' : 'text/html;charset=utf-8'
            });
            res.end(data);
        }

    } );
}

server.listen(8080, 'localhost');

