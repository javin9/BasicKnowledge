var path = require('path')
var autoprefixer = require('autoprefixer')
var config = require('./config')
var loaders = require('./loaders')
var resolves = require('./resolves')
var plugins = require('./plugins')
var getProject = require('./project')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var argv = require('minimist')(process.argv.slice(2))

module.exports = {

	// 获取源文件
	getEntry: function(name, env){
		var that = this
		var project
		var defaultEntry
		var res = {}
		
		// multi project
		if(typeof name !== 'string'){
			name.forEach(function(name){
				res = Object.assign(res, that.getEntry(name, env))
			})
			return res
		}
		project = name ? getProject(name) : {entry:[]}

		// 合并通用模块
		defaultEntry = (project.info.isCommon || env === config.PRODUCTION) ? {} : this.getEntry(project.info.relatedCommon, env)
		return Object.assign({}, defaultEntry,project.config.entry)
	},

	// 获取输出文件
	getOutput: function(projectName, env){
		return {
	    path: config.distDir,
	    filename: config.outputFile,
	    publicPath: env === config.PRODUCTION ? config.publicPathOnline : config.publicPathLocal
	  }
	},

	// 后去plugin
	getPlugins: function(projectName, env){
		return plugins(projectName, env, env === config.DEVELOPMENT)
	},

	// 获取默认loader
	getLoaders: function(env){
		return loaders(env === config.DEVELOPMENT)
	},

	getPostLoaders: function(env){
		return [
	    {
	        test: /\.js$/,
	        loaders: ['es3ify-loader']
	      }
	    ]
	},

	// 获取默认的resolve
	getResolves: function(env){
		return resolves(env === config.DEVELOPMENT)
	},

	// 获取项目名称
	getProjectName: function(){
		var name = argv[config.PROJECT_PARAM] || config.COMMON_PROJECT
		if(name.indexOf('+') > 0){
			name = name.split(config.SEP_MULTI)
		}
		return name
	},

	getVueConfig: function(env){
		var conf = {}
		if( env === config.PRODUCTION){
			conf.loaders = {
				css: ExtractTextPlugin.extract('css!sass'),
	      sass: ExtractTextPlugin.extract('css!sass')
			}
		}else{
			conf.loaders = {
				css: 'style!css?sourceMap!sass',
	      sass: 'style!css?sourceMap!sass'
			}
		}
		return conf
	},

	// 获取postcss
	getPostcss: function(env){
		return [autoprefixer({browsers: ['last 2 versions', 'ie 8-11', '> 5%']})]
	},

	getSassloader: function(env){
		return {
			includePaths: require('sass-helper').includePaths
		}
	}
}