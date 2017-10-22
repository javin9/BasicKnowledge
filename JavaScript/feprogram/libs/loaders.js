var ExtractTextPlugin = require('extract-text-webpack-plugin')
var config = require('./config')

module.exports = function(isDev){
	return [
      {
        test: /\.js$/,
        loader: 'babel?cacheDirectory',
        exclude: /node_modules/,
        include: config.srcDir
      },
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.css$/,
        loader : isDev ? 'style!css?sourceMap!postcss' : ExtractTextPlugin.extract('style-loader', 'css-loader', 'postcss-loader')
      },
      { test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'url',
        query: isDev ? {} : {limit: 10000, name:'[path][name].[hash:6].[ext]', context: config.SRC}
      },
      {
          test: /\.scss$/,
          loader: isDev ? 'style!css?sourceMap!postcss!sass?sourceMap' : ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader')
      },

      // https://github.com/pcardune/handlebars-loader
      {
          test: /\.(handlebars|hbs)$/,
          loader: 'handlebars-loader',
          query: { inlineRequires: '\.html\.(png|jpe?g|gif|svg)$' }
      },

      {
          test: require.resolve('zepto'),
          loader: 'imports?this=>window'
      },
      {
          test: require.resolve("jquery"), 
          loader: "expose?$!expose?jQuery"
      },
      {
          test: require.resolve("imagesloaded"), 
          loader: "imports?define=>false&this=>window"
      }
    ]
}