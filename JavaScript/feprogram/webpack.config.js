const config = require('./libs/config')
const util = require('./libs/util')
const ENV = config.DEVELOPMENT

const projectName = util.getProjectName()

process.env.NODE_ENV = ENV

module.exports = {
  devtool: 'eval-source-map',
  entry: util.getEntry(projectName, ENV),
  output: util.getOutput(projectName, ENV),
  plugins: util.getPlugins(projectName, ENV),
  resolve: util.getResolves(ENV),
  module: {
    loaders: util.getLoaders(ENV)
  },
  vue: util.getVueConfig(ENV),
  postcss: function(){
    return util.getPostcss(ENV)
  },
  sassLoader: util.getSassloader(ENV),
  devServer: {
    stats: 'errors-only',
    disableHostCheck: true,
    proxy: {
      '/dll' : {
        target: 'http://' + config.SERVER + '/jinrong/assets/'
      },
      '!*sockjs-node*': {
        target: '/',
        bypass: require('mock').middleware
      }
    }
  }
}