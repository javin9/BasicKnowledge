({
    appDir: './',
    baseUrl: './js',
    dir: './dist',
    modules: [
        {
            name: 'main'
        }
    ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard',
    removeCombined: true,
    paths: {
    	jquery: 'lib/jquery-1.7.2',
		sotre: 'lib/store',
		underscore: 'lib/underscore',
		common: 'lib/common',
		domReady:'lib/domReady',
		carinfo:'index/carinfo'
    },
    shim: {
        underscore: {
            exports: '_'
        }
    }
})