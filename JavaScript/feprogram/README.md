# 项目文档

### 开发环境
npm i 

### 提供命令
* `npm start xxx` : 启动xxx项目服务
* `npm run build xxx` : 编译xxx项目到dist (xxx+yyy方式编译多个项目)
* `npm run build:watch xxx` : (@deprecated)编译xxx项目到dist,并检测文件改动
* `npm run release xxx `: 编译并打包xxx项目到项目上级路径release目录下，以当前git分支命名zip包(项目需要使用git, 使用svn的只能手动压缩dist下的输出文件)
* `npm run sync xxx` : 把dist下的文件同步到服务器xxx(代号), 支持的服务器名dev1|dev2|beta1|beta2|dev|beta
* `npm run mock xxx/yyy` : 创建mock/xxx/yyy.json文件，供mock使用

### 命令参数
`npm命令参数需要用 -- 与script的参数分别开来`
* `--port xxx`: 启动server时更改端口, 如 `npm start xxx -- --port 80`
* `--debug` : build或release时不压缩文件, 如 `npm run build xxx -- --debug`
* `--dist` : (@deprecated)start项目时支持测试ie8, 如`npm start xxx -- --dist`, 需要同时运行`npm run build`或`npm run build:watch`来编译
* `--js` : release时只打包js和css, `npm run release xxx -- --js`
* `--img` : release时只打包图片, `npm run release xxx -- --img`

### 目录结构
* src
	* common 公共文件 pc站
	* common.m 公共文件 m站
	* libs 供引入的公共模块
	* xxx 项目xxx
	* xxx.m 项目xxx移动版

### 输出文件
每个项目下建一个exports.js, 如 src/xxx/exports.js, 例如
'' module.exports = [
'' 	'seperate/about/about.js'
'' ]
数组写该项目需要导出的文件, 只写js, css会生成跟js相同路径相同文件名的文件

### ES6
可以使用es6进行编码，但如果使用了新的api， 如promise, Object.assign等，会自动在打包时引入相应的polyfill, 增加文件体积。pc站代码基本已经兼容ie8 , 但可能会有某些坑。

### sass
使用sass编写css文件, sass文件中可引入
`import 'sassHelper/mixin'`和 `import 'sassHelper/vars'` 提供公共变量和便携方法， 具体参见 src/libs/sassHelper

sass文件在js中直接引入:
`require('./test.scss')` 

### 图片输出
* 图片小于10k的全部base64进css或js文件
* 图片名为 xxx.html.png 这种带有.html的不论js/css中使用与否，都导出。可以供后端模板img使用

### mock
各项目中建立html文件夹， 里面.hbs文件是本地测试页面, 具体事例见xinche/seperate/about/html/about.hbs
mock接口按照后端给的路径全部放在mock文件夹下，post/get/jsonp都可访问

### 三方库
第三方库优先使用npm进行管理，尽量不要放在libs下面，除非该库不支持npm安装(这种基本没有了) 或因编译等特殊原因

### 子项目
npm run build xxx来编译xxx项目
npm run build xxx/yyy/zzz 来编译xxx/yyy/zzz这个子项目，exports中不是xxx/yyy/zzz路径开始的文件不会被导出。以防项目太大编译过慢

### 后端模板引入script及css
为兼容老项目，后端页面要使用webpack方式的脚本， 需要设置
`ViewBag.commonjs = true; `

页面引入一个样式:
`<link href="@Url.GetStaticResource("xinche.m/seperate/about/about.css")" rel="stylesheet" type="text/css" /> `

页面引入一个脚本：
`<script src="@Url.GetStaticResource("xinche.m/seperate/about/about.js")"></script> `

区别，老项目使用`@Url.PublicStaticResource `方法，新项目使用`@Url.GetStaticResource`方法

### Sync(同步服务器)
使用npm run sync xxx同步dist下文件到服务器, webpack项目只使用以下服务器

* dev1: 192.168.145.9:8011
* dev2: 192.168.145.9:8013
* beta1: 192.168.154.243:8011
* beta2: 192.168.154.243:8013

其中dev1,dev2两台开发机，供开发，联调使用。beta1,beta2两台测试机，供测试使用。
同步时dist下WEB目录和MWEB目录同步到服务器WEB和MWEB路径下, 供老项目兼容使用。其它目录同步到服务器assets路径下（webpack项目静态资源的起始路径）

### DLL
公用framework进行了单独打包，提供单独dll文件:
* dll/vue.dll.js : 包含vue+vueResource+vueRouter
* dll/react.dll.js: 包含react+reactDom+reactRouter

dll相关的模块在页面脚本中按正常方式引入:
`import {Vue} from 'vue'`, `const VueRouter = require('vue-router')`
但不会被编译进页面脚本，需要在页面中单独引入对应的dll文件

本地测试hbs文件中的引入方式： 
`<script src="{{htmlWebpackPlugin.options.dll.vue}}"></script> `

后段项目中的引入方式：
`<script src="@Url.GetStaticResource("dll/vue.dll.js")"></script> `