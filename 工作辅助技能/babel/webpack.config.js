var path = require('path');
module.exports = {
	entry: {
		'app': './src/app.js'
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'js/[name].js'
	},
	module: {
		rules: [{
			test: /\.js?$/,
			loader: "babel-loader",
			include: [
				path.resolve(__dirname, "./src")
			],
			exclude: [
				path.resolve(__dirname, "./node_modules")
			],
			options: {
				presets: ["latest"]
			}
		}]
	}
};