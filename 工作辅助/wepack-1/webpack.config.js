var path = require('path');
var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCss = new ExtractTextPlugin({
    filename: "css/[name].[contenthash].css"
});

var CleanWebpackPlugin = require('clean-webpack-plugin'); //installed via npm
// the path(s) that should be cleaned
var pathsToClean = [
    'dist',
    'build'
]

// the clean options to use
var cleanOptions = {
    // root:__dirname,
    // exclude: ['shared.js'],
    verbose: true,
    dry: false
}



var argv = require('minimist')(process.argv.slice(2));
console.log(argv);
console.log(__dirname);
module.exports = {
    //context:'./' //上下文默认是我们的根目录
    entry: {
        index: './src/demo/index/index.js',
        list: './src/demo/list/list.js',
        detail: './src/demo/detail/detail.js',
        common: './src/libs/common.js',
        cookie: './src/libs/cookie.js',
        jq:["jquery"],
        ud:["underscore"]
    },
    output: {
        //path参数表示生成文件的根目录，需要传入一个绝对路径。path参数和后面的filename参数共同组成入口文件的完整路径。
        path: path.resolve(__dirname, './dist/demo'),
        /*
publicPath参数跟path参数的区别是：path参数其实是针对本地文件系统的，而publicPath则针对的是浏览器；因此，publicPath既可以是一个相对路径，如示例中的'../../../../build/'，也可以是一个绝对路径如http://www.xxxxx.com/。一般来说，我还是更推荐相对路径的写法，这样的话整体迁移起来非常方便。那什么时候用绝对路径呢？其实也很简单，当你的html文件跟其它资源放在不同的域名下的时候，就应该用绝对路径了，这种情况非常多见于后端渲染模板的场景
wepack-1/dist/demo/detail/dist/demo/css/detail.3d282265f969a5a2ee8585ae3bfb4845.css
wepack-1/dist/demo/css/demo/js/detail-a6b6a7cea322ccc60e4e.js
        */
        publicPath: path.resolve(__dirname, './dist/demo'), //'../../../dist/demo',
        filename: 'js/[name]-[hash].js'
        //chunkFilename用来打包require.ensure方法中引入的模块,如果该方法中没有引入任何模块则不会生成任何chunk块文件
    },
    module: {
        noParse: /jquery|lodash/,
        // since webpack 3.0.0
        noParse: function(content) {
            return /jquery|lodash/.test(content);
        },
        rules: [{
            test: /\.css$/,
            use: extractCss.extract({
                use: [{
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
        new CleanWebpackPlugin(pathsToClean, cleanOptions),
        new HtmlWebpackPlugin({
            template: './src/demo/detail/detail.html',
            inject: 'head', // true | 'head' | 'body' |false
            chunks: ['detail'], //指定的js文件
            filename: 'detail/detail.html',
            title: "我是详情页", //传参数
            h2: '我是详情页啊啊啊啊啊'
        }),
        new HtmlWebpackPlugin({
            template: './src/demo/list/list.html',
            inject: 'body', // true | 'head' | 'body' |false
            chunks: ['list'],
            filename: 'list/list.html'
            // inlineSource: '.(js|css)$'
        }),
        new HtmlWebpackPlugin({
            template: './src/demo/index/index.html',
            inject: false, // true | 'head' | 'body' |false  !!!
            filename: 'index/index.html'
        }),
        new HtmlWebpackInlineSourcePlugin(),
        extractCss,
        //  new webpack.optimize.CommonsChunkPlugin({
        //     name: "jquery",
        //     minChunks:2,
        //     chunks:["detail","list"]
        // }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ["js/common","js/jq","js/ud"], //这公共代码的chunk名为'commons',
            chu4nks: ["list", "detail"],
             filename: 'js/[name].js', //生成后的文件名，虽说用了[name]，但实际上就是'commons.bundle.js'了
            minChunks: 1 //设定要有4个chunk（即4个页面）加载的js模块才会被纳入公共代码。这数目自己考虑吧，我认为3-5比较合适。
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            underscore:"underscore"
        })

    ]
};