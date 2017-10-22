var config = require('./libs/config')
var util = require('./libs/util')
var ENV = config.PRODUCTION

var projectName = util.getProjectName()

// for babel
process.env.NODE_ENV = ENV

module.exports = {
  entry: util.getEntry(projectName, ENV),
  output: util.getOutput(projectName, ENV),
  plugins: util.getPlugins(projectName, ENV),
  resolve: util.getResolves(ENV),
  module: {
    loaders: util.getLoaders(ENV),
    postLoaders: util.getPostLoaders(ENV)
  },
  vue: util.getVueConfig(ENV),
  postcss: function(){
    return util.getPostcss(ENV)
  },
  sassLoader: util.getSassloader(ENV)
}