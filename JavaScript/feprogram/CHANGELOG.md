# feProgram Changelog

## v4.0.0
* **Change** : 移除老架构文件及编译方式

## v3.0.5
**2017-04-27**
* **Change** : 移除jquery-json依赖
* **Change** : 移除js-cookie依赖
* **Change** : 精简npm start的输出log

## v3.0.0
**2016-09-21**
* **New** : webpack功能完善

## v1.8.2
**2016-08-26**
* **Fix** : gulp server增删文件或切换分支造成进程崩溃的问题

## v1.8.1
**2016-08-26**
* **Fix** : gulp server修复样式更新需重新刷新才生效问题

## v1.8.0
**2016-08-26**
* **Change** : gulp server调整为npm run server, 变更端口直接跟端口号: npm run server 8080

## v1.7.0
**2016-08-11**
* **New** : mock支持
* **New** : 增加部分MWeb站测试模板

## v1.6.2
**2016-08-10**
* **fix** : server 中 html支持@Url.PublicStaticResource

## v1.6.2
**2016-08-10**
* **fix** : npm run patch 压缩包文件夹重复问题

## v1.6.1
**2016-08-09**
* **fix** : npm run patch 图片编译bug

## v1.6.0
**2016-08-09**
* **New** : npm run patch 直接编译相关文件，无需gulp生成

## v1.5.0
**2016-08-08**
* **New** : 添加打包命令 npm run patch, 兼容windows及mac, 同npm run pack

## v1.4.0
**2016-08-07**
* **New** : 添加打包命令 npm run pack, 直接打包当前svn处于Modified和Added的文件。【前提是已经gulp prod生成压缩的文件后。】目前只支持shell环境

## v1.3.1
**2016-08-06**
* **Fix** : server同时检测js,html文件更新, 更新后自动刷新

## v1.3.0
**2016-08-05**
* **New** : html增加MWeb和Web的layout模板，访问模式改变，例：/html/MWeb/Home/index为m站首页，/html/Web/Home/index为pc站主页

## v1.2.1
**2016-08-04**
* **Change** : server启动后访问/src/MWeb/** 会自动去掉src, 为兼容后端appsetting当前配置

## v1.2.0
**2016-08-04**
* **New** : gulp server -p 8080更改启动端口

## v1.1.0
**2016-08-03**
* **New** : scss支持 : src中可直接用scss
* **New** : server : gulp server启动本地服务器, 默认端口20000
* **New** : bourbon : scss中可以@import 'bourbon'; 功能见 http://bourbon.io/docs/
* **New** : bulma: scss中可以@import 'bulma';功能见 http://bulma.io/
* **New** : html文件夹， 供本地测试html页面
* **Change** : ignore MWeb/Web/node_modules, 不提交到版本库
* **Fix** : css样式文件中造成scss编译不过的语法错误
