var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCss = new ExtractTextPlugin({
    filename: "demo/css/[name].[contenthash].css"
});

var argv = require('minimist')(process.argv.slice(2));
console.log(argv);

module.exports = {
    //context:'./' //上下文默认是我们的根目录
    entry: {
        index: './src/demo/index/index.js',
        list: './src/demo/list/list.js',
        detail: './src/demo/detail/detail.js'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: './dist/',
        filename: 'demo/js/[name]-[hash].js'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: extractCss.extract({
                 use: [ {
                    loader: "css-loader"
                  }]
            }),
            //  use: extractCss.extract({
            //      use: ['css-loader'],
            //     // use style-loader in development 
            //     fallback: "style-loader"
            // }),
            exclude: [
                path.resolve(__dirname, "./node_modules")
            ]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/demo/detail/detail.html',
            inject: 'head', // true | 'head' | 'body' |false
            chunks: ['detail'], //指定的js文件
            filename: 'demo/detail/detail.html',
            title: "我是详情页", //传参数
            h2: '我是详情页啊啊啊啊啊'
        }),
        new HtmlWebpackPlugin({
            template: './src/demo/list/list.html',
            inject: 'body', // true | 'head' | 'body' |false
            chunks: ['list'],
            filename: 'demo/list/list.html'
            // inlineSource: '.(js|css)$'
        }),
        new HtmlWebpackPlugin({
            template: './src/demo/index/index.html',
            inject: false, // true | 'head' | 'body' |false  !!!
            filename: 'demo/index/index.html'
        }),
        new HtmlWebpackInlineSourcePlugin(),
        extractCss
    ]
};