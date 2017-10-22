var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCss = new ExtractTextPlugin({
    filename: "[name].[contenthash].css"
});


module.exports = {
    //context:'./' //上下文默认是我们的根目录
    entry: {
        index: './src/index/index.js',
        list: './src/list/list.js',
        detail: './src/detail/detail.js'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        // publicPath: 'http://m.taoche.com',
        filename: 'js/[name]-[hash].js'
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
            template: './src/detail/detail.html',
            inject: 'head', // true | 'head' | 'body' |false
            chunks: ['detail'], //指定的js文件
            filename: 'detail/detail.html',
            title: "我是详情页", //传参数
            h2: '我是详情页啊啊啊啊啊'
        }),
        new HtmlWebpackPlugin({
            template: './src/list/list.html',
            inject: 'body', // true | 'head' | 'body' |false
            chunks: ['list'],
            filename: 'list/list.html'
            // inlineSource: '.(js|css)$'
        }),
        new HtmlWebpackPlugin({
            template: './src/index/index.html',
            inject: false, // true | 'head' | 'body' |false  !!!
            filename: 'index/index.html'
        }),
        new HtmlWebpackInlineSourcePlugin(),
        extractCss
    ]
};