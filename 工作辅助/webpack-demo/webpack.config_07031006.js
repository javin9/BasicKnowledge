var path = require('path');
module.exports = {
	entry: ['./src/js/main.js', './src/js/a.js'],
	output: {
		path: path.resolve(__dirname, './dist/js'),
		filename: 'bundle.js'
	}
}