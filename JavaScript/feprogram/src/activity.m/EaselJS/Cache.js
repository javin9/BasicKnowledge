import './css/shared.scss'
import './css/examples.scss'
import './js/examples.js'

var canvas;
var stage;
var shape;
var radius = 50;
var rings = 40;
var fpsLabel;

function init() {
	// create a new stage and point it at our canvas:
	canvas = document.getElementById("testCanvas");
	stage = new createjs.Stage(canvas);

	// create a large number of slightly complex vector shapes, and give them random positions and velocities:

	var colors = ["#828b20", "#b0ac31", "#cbc53d", "#fad779", "#f9e4ad", "#faf2db", "#563512", "#9b4a0b", "#d36600", "#fe8a00", "#f9a71f"];

	for (var i = 0; i < 200; i++) {
		shape = new createjs.Shape();
		for (var j = rings; j > 0; j--) {
			shape.graphics.beginFill(colors[Math.random() * colors.length | 0]).drawCircle(0, 0, radius * j / rings);
		}
		shape.x = Math.random() * canvas.width;
		shape.y = Math.random() * canvas.height;
		shape.velX = Math.random() * 10 - 5;
		shape.velY = Math.random() * 10 - 5;

		// turn snapToPixel on for all shapes - it's set to false by default on Shape.
		// it won't do anything until stage.snapToPixelEnabled is set to true.
		shape.snapToPixel = true;

		stage.addChild(shape);
	}

	// add a text object to output the current FPS:
	fpsLabel = new createjs.Text("-- fps", "bold 18px Arial", "#FFF");
	stage.addChild(fpsLabel);
	fpsLabel.x = 10;
	fpsLabel.y = 20;

	// start the tick and point it at the window so we can do some work before updating the stage:
	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
	var w = canvas.width + radius * 2;
	var h = canvas.height + radius * 2;
	var l = stage.numChildren - 1;

	// iterate through all the children and move them according to their velocity:
	for (var i = 1; i < l; i++) {
		var shape = stage.getChildAt(i);
		shape.x = (shape.x + radius + shape.velX + w) % w - radius;
		shape.y = (shape.y + radius + shape.velY + h) % h - radius;
	}

	fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";

	// draw the updates to stage:
	stage.update(event);
}

function toggleCache(value) {
	// iterate all the children except the fpsLabel, and set up the cache:
	var l = stage.numChildren - 1;

	for (var i = 0; i < l; i++) {
		var shape = stage.getChildAt(i);
		if (value) {
			shape.cache(-radius, -radius, radius * 2, radius * 2);
		} else {
			shape.uncache();
		}
	}
}

$(function() {
	init();

	$("#toggleCache").click(function() {
		toggleCache(this.checked)
	});
})