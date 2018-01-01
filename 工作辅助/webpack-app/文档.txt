https://webpack.js.org/guides/getting-started/


mkdir webpack//创建文件夹

cd webpack //打开文件

npm install webpack -g//全局安装

npm init //初始化  

npm install webpack --save-dev //安装webpack  项目开发的依赖
------------------------------------------------
npm install css-loader style-loader  --save-dev//安装loader

require('css-loader!./main.css');//指定特定的loader

require('style-loader!css-loader!./main.css');//使用css生效

wepack hello.js hello.m.js --module-bind  "css=style-loader!css-loader"//命令行工具，指定loader 必须是双引号

wepack hello.js hello.m.js --module-bind  "css=style-loader!css-loader"  --watch//命令行工具，指定loader 必须是双引号  自动检测

wepack hello.js hello.m.js --module-bind  "css=style-loader!css-loader"  --progress --display-modules  //显示进度和打包木块


webpack.config.js
http://webpack.github.io/docs/configuration.html

webpack --config webpack.dev.config.js 指定配置文件

设置npm命令行缩写
"webpack":"webpack --config webpack.config.js --progress --display-modules  --display-reasons --colors"
添加参数到script 
npm run webpack 运行 

webpack --config webpack.dev.config.js//指定配置文件的名字


webpack --config webpack.config.js --progress --display-modules --colors --display-reasons  //package.json  配置文件

npm run webpack
----------------------------------------------------
output.filename
[name]
[hash]
[chunkhash]
打包插件


npm install html-webpack-plugin --save-dev


-------------------------------------
//安装babel
//webpack3.0 configuration  https://webpack.js.org/configuration/
//http://babeljs.io/docs/plugins/preset-latest/

npm install --save-dev babel-loader babel-core babel-preset-env webpack

npm install --save-dev babel-loader babel-core


npm install --save-dev babel-preset-latest


//https://webpack.js.org/configuration/


----------------------------------------------------------
//安装CSS loader 和style loader

npm install --save-dev babel-loader babel-core babel-preset-env

npm install css-loader style-loader  --save-dev//安装loader

npm install postcss-loader --save-dev  //css3前缀

npm install autoprefixer --save-dev  //前缀

https://github.com/postcss/postcss#plugins

npm install less-loader less --save-dev

npm install html-loader --save-dev

npm install ejs-loader --save-dev

//所有loader的网址
http://webpack.github.io/docs/list-of-loaders.html#templating

npm install file-loader --save-dev

npm install url-loader --save-dev

npm install image-loader  --save-dev


output  中的path输入目录

webpack 如果是全局的，必须在项目底下安装一个

模板传参数 htmlWebpackPlugin.options.title
<!-- htmlWebpackPlugin  是模块的名字，不是自己定义的名字 -->

   <% for(var key in htmlWebpackPlugin.files){ %>
   	<%= key %>:<%=JSON.stringify(htmlWebpackPlugin.files[key])%>
   <% } %>

      <% for(var key in htmlWebpackPlugin.options){ %>
   	<%= key %>:<%=JSON.stringify(htmlWebpackPlugin.files[key])%>
   <% } %>


   <script type="text/javascript" src="<%=htmlWebpackPlugin.files.chunks.index.entry%>"></script>


  excludeChunks:[]  //除了谁之外


使用compilation.assets这时候我们就可以取到它里面的内容
官方案例:https://github.com/ampedandwired/html-webpack-plugin/blob/master/examples/inline/template.jade

compilation.assets[htmlWebpackPlugin.files.chunks.index.entry.substr(htmlWebpackPlugin.files.publicPath.length)].source()


new HtmlWebpackPlugin({
		inlineSource: '.(js|css)$' // embed all javascript and css inline
	}),
new HtmlWebpackInlineSourcePlugin()


npm install --save-dev extract-text-webpack-plugin

<!-- <script type="text/javascript" src="<%= compilation.assets[htmlWebpackPlugin.files.chunks.index.entry.substr(htmlWebpackPlugin.files.publicPath.length)].source() %>" ></script> -->

npm install --save-dev babel-loader babel-core babel-preset-env webpack
script 指定 babel:{"preset":['env']}

include
exclude


npm install minimist

//此处会把命令行的的参数都出来
    const args = require("minimist")(process.argv.slice(2));


////////////////////////////////////////////////////////////////////////////////
webpack-dev-server 本地服务器，先打包-在访问r 不会产生真实的文件 都放到内存里面去了
 webpack-dev-server --inline --hot  --colors --host 0.0.0.0 //--inline --hot  顺序不能颠倒

 npm i clean-webpack-plugin --s-ave-dev

 npm install jquery  --save-dev



 // "start": "webpack-dev-server --inline --hot  --colors --host 123 ",

 默认找到的是webpack.config.js文件 如果更改了需要在start 配置 --config webpack-dev-server-dev.js


//////////////////////////////////////////////////////////////////////////////
 path:'dist/' 不要加文件夹名 
 publicPath:'/' 
   1.最后都要添加 / 因为loader的静态资源，比如images，css，前面不会自动添加 / 
   2.所有资源的基础路径  拼接在静态资源前面的路径
   index.html ,不要使用../的形式

 deServer:{
   open:true,
   port:888,
   contentPath:'./',
   publicPath:'/' //1.如果这里有publicPath 就用自己的，如果没有 就去上面找output 的publicPaht
                  //2.服务器打包后的资源路径  真实的文件路径  所有资源打包的起点
 }


https://webpack.js.org/guides/getting-started/
https://doc.webpack-china.org/concepts/




