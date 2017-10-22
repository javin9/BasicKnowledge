import css from './css/reset.css';
import css2 from './css/index.css';

import Layer from './components/layer/layer.js';
import usertemplate from './components/layer/user.tpl';

const App = function() {
	var app = document.getElementById('app');
	var layer = new Layer();
	console.log(layer);
	app.innerHTML = layer.tp;
	console.log(layer);

	var tps = document.getElementById('tps');
	tps.innerHTML = usertemplate({
		name: "Cupid",
		age: 190
	});
};
let p = 3.1418;
new App();