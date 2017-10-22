var fs = require('fs-extra')
var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var config = require('./config')
var getProject = require('./project')
var argv = require('minimist')(process.argv)

var dllPackages = config.dllPackages
var dllPackagesUrl = {}
var distMode = argv.dist
var SERVER_BASE = '//' + config.SERVER + config.publicPathOnline

module.exports = function(projectName, env, isDev){

	var plugins = [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(env), 'dev' : isDev})
  ]
  
  // 编译非dll模块
  dllPackages.forEach(function(packageName){
    // 测试机访问地址
    dllPackagesUrl[packageName] = buildDllUrl(packageName)

    // dll插件添加
    plugins.push(new webpack.DllReferencePlugin({
        context: argv.node_modules_absolute_path || config.base,
        manifest: fs.readJsonSync(path.join(config.base, config.DLL, packageName + '-manifest.json'))
    }))
  })

  if(typeof projectName === 'string'){
    projectName = [].concat(projectName)
  }

  if(isDev){
    projectName.forEach(function(name){
      htmlPluginBuider(name, plugins)
    })
  }else{

    plugins.push(new webpack.optimize.OccurenceOrderPlugin())

    !argv.debug && plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }))

    plugins.push(new ExtractTextPlugin('[name].css'))

    copyPluginBuilder(projectName, plugins)
  }

  return plugins
}

/**
 * 构造html插件， dev环境
 */
function htmlPluginBuider(projectName, plugins){
  var project = getProject(projectName)
  var headerTpl = ''
  var footerTpl = ''

  // 获取hf
  if(project.info.relatedCommon){
    headerTpl = fs.readFileSync(path.join(config.srcDir, project.info.relatedCommon, config.HTML, 'header' + config.EXT.TEMPLATE))
    footerTpl = fs.readFileSync(path.join(config.srcDir, project.info.relatedCommon, config.HTML, 'footer' + config.EXT.TEMPLATE))
  }

  project.config.html.forEach(function(conf){
    plugins.push(new HtmlWebpackPlugin({
      inject:false,
      filename : conf.filename,
      template: conf.template,
      cache:false,
      common:distMode ? SERVER_BASE + conf.common.substring(1) : conf.common,
      script:distMode ? '/dist' + conf.script : conf.script,
      header:headerTpl,
      footer:footerTpl,
      dll:dllPackagesUrl,
      shim:buildShim(distMode, conf.common, conf.script)
    }))
  })
}

/**
 * 复制html中用到的图片
 */
function copyPluginBuilder(projectName, plugins){
  var options = []

  projectName.forEach(function(name){
    options.push({context: config.srcDir,from: path.join(name, '**/*.html.png'),to: config.distDir})
    options.push({context: config.srcDir,from: path.join(name, '**/*.html.jpg'),to: config.distDir})
    options.push({context: config.srcDir,from: path.join(name, '**/*.html.jpeg'),to: config.distDir})
    options.push({context: config.srcDir,from: path.join(name, '**/*.html.gif'),to: config.distDir})
    options.push({context: config.srcDir,from: path.join(name, '**/*.html.svg'),to: config.distDir})
    options.push({context: config.srcDir,from: path.join(name, '**/*.mp3'),to: config.distDir})
  })
  plugins.push(new CopyWebpackPlugin(options))
}

/**
 * 构造shim
 */
function buildShim(distMode, commonUrl, scriptUrl){
    var arr = ['<!--[if lt IE 9]><script src="'+ buildDllUrl('shim') + '"></script><![endif lt IE 9]-->']

    var LinkBuilder = function(url){
      return '<link rel="stylesheet" href="'+ SERVER_BASE + url.replace('.js', '.css').replace(/^\//, '') +'">'
    }

    if(distMode){
      arr.unshift(LinkBuilder(scriptUrl))
      arr.unshift(LinkBuilder(commonUrl))
    }

    return arr.join('')
}

/**
 * dll url构造
 */
function buildDllUrl(packageName){
  return SERVER_BASE + config.DLL + '/' + packageName + '.' + config.DLL + config.EXT.SCRIPT
}