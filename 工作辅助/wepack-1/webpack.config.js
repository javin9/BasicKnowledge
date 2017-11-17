var path = require('path');
var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCss = new ExtractTextPlugin({
    filename: "css/[name].css"
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

console.log(process.env.NODE_ENV)

var argv = require('minimist')(process.argv.slice(2));
console.log(argv);
console.log(__dirname);
module.exports = {
    //context:'./' //上下文默认是我们的根目录
    entry: {
        index: './src/demo/index/index.js',
        list: './src/demo/list/list.js',
        detail: './src/demo/detail/detail.js',
        // common: './src/libs/common.js',
        // cookie: './src/libs/cookie.js',
        vendor: ["jquery", "underscore"],
        // jq:["jquery"],
        // ud:["underscore"]
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
        filename: 'js/[name]-[hash].js',
        //chunkFilename用来打包require.ensure方法中引入的模块,如果该方法中没有引入任何模块则不会生成任何chunk块文件

        /*由于通过 external 提取过的 js 模块是不会被记录到 webapck 的 chunk 信息中，通过 libraryTarget 可告知我们构建出来的业务模块，当读到了 externals 中的 key 时，需要以 umd 的方式去获取资源名，否则会有出现找不到 module 的情况。*/
        libraryTarget: 'umd',
    },
    module: {
        noParse: /jquery|lodash/,
        // since webpack 3.0.0
        noParse: function(content) {
            return /jquery|lodash/.test(content);
        },
        rules: [{
                test: /\.js$/,
                 exclude: [
                    path.resolve(__dirname, "./node_modules")
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.css$/,
                // use: extractCss.extract({
                //     use: [{
                //         loader: "css-loader"
                //     }]
                // }),
                use: extractCss.extract({
                    use: [{
                        loader:'style-loader'
                    },
                      {
                        loader:'css-loader',
                        options:{
                            module:true//模块化
                        }
                      }
                    ],
                }),
                exclude: [
                    path.resolve(__dirname, "./node_modules")
                ]
            },
            {
                // test: /\.(png|jpg|gif)$/,
                // use:[{
                //     loader: 'file-loader',
                //     options: {
                //         // name: '[name].[ext]?[hash]',
                //         name: '[name]-[hash:5].[ext]',
                //         outputPath:'/images/',//受上面path影响
                //         publicPath:" http://www.webpackdemo.com/dist/demo",
                //     }
                // }]
            },
            {
                test:/\.(png|jpg|gif)$/,
                use:[{
                    loader:'url-loader',
                    // options:{
                    //     limit:12000
                    // }
                }]
            }
        ]
    },
    devServer:{
        open:true,
        port:9090,
        contentBase: './dist'
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

        new webpack.ProvidePlugin({
            $: "jquery",
            _: "underscore",
            // swiper:"swiper"
        }),
        /*
          第一种：传入字符串参数，由 chunkplugin 自动计算提取 
          注意：需要在页面上手动引入 vendor.js  vendor.js的名字受output.filename影响
          new webpack.optimize.CommonsChunkPlugin('vendor')
        */

        /*
          第二种：有选择的提取公共代码
           new webpack.optimize.CommonsChunkPlugin({
            name:"vendor",
            chunks:["detail","list"]
          })

        注意：需要在页面上手动引入 vendor.js  vendor.js的名字受output.filename影响
        只提取 detail 节点和 list节点 中的共用部分模块, 生成一个 common.js
    minChunks: number|Infinity|function(module, count) -> boolean,
         */

        /*
         第三种:将 entry 下所有的模块的公共部分（可指定引用次数）提取到一个通用的 chunk 中
         #提取所有 node_modules 中的模块至 vendors 中，也可以指定 minChunks 中的最小引用数；
          //module.resource.indexOf(path.join(__dirname, './node_modules')) === 0
          new webpack.optimize.CommonsChunkPlugin({
             name: "vendor",
             filename: "js/[name].js",
             chunks: ["detail", "list"],
             minChunks: function(module, count) {
                 console.log('111111111111111111111111111')
                 console.log(module.resource);
                 console.log(path.join(__dirname, './node_modules'));
                 console.log(module.resource.indexOf(path.join(__dirname,'./node_modules'))===-1);
                 console.log('111111111111111111111111111')
                 return module.resource&&
                        /\.js$/.test(module.resource)&&
                        module.resource.indexOf(path.join(__dirname,'./node_modules'))===-1;
             }
         }),
         //抽取 enry 中的一些 lib 抽取到 vendors 中
        new webpack.optimize.CommonsChunkPlugin({
         name:"jq",
         filename: "js/[name].js",
         minChunks:1
        })

         new webpack.optimize.CommonsChunkPlugin({
            names: ["lib", "vendor"],
            filename: "js/[name].js",
            minChunks: 2
        })
        */
        new webpack.optimize.CommonsChunkPlugin({
            names: ["lib", "vendor"],
            filename: "js/[name].js"
        }),
        extractCss,
    ]
};