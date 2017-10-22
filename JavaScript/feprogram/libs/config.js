const path = require('path')
//process.cwd() 是当前执行node命令时候的文件夹地址 ——工作目录，保证了文件在不同的目录下执行时，路径始终不变
const CURR = process.cwd();
const SRC = 'src'
const DIST = 'dist'
const pkg = require(path.resolve(process.cwd(), 'package.json'))

module.exports = {
	// env: production
	PRODUCTION : 'production',

	// env: development
	DEVELOPMENT: 'development',

	// 命令行参数
	PROJECT_PARAM: 'project',

	// 全站通用项目模块名称
	COMMON_PROJECT: 'common',

	NODE_MODULES: path.join(CURR, 'node_modules'),

	// dev config 文件名
	DEV_FILE: path.join(CURR, '.devconfig'),

	// 测试服务器
	SERVER: '192.168.154.243:8011',

	// 项目类型分隔符
	SEP: '.',

	// 多项目分隔符
	SEP_MULTI: '+',

	SRC: SRC,

	DIST: DIST,

	HTML: 'html',

	// 命令运行路径
	base: CURR,

	// 源代码路径
	srcDir : path.join(CURR, SRC),

	// 编译输出目录
	distDir: path.join(CURR, DIST),

	// 服务器监听目录
	publicPathLocal: '',

	// 线上资源目录
	publicPathOnline: pkg.sync.remote,

	// 项目配置文件名称
	configFileName: 'exports.js',

	// 输出命名规则
	outputFile: '[name].js',

	// 默认扩展名
	EXT: {
		HTML : '.html',
		TEMPLATE: '.hbs',
		SCRIPT: '.js'
	},

	// dll模块名称
	DLL: 'dll',

	// dll输出包
	dllPackages: ['vue', 'react'],

	// dll索引文件名称
	DLL_MANIFEST: 'manifest.json'
}