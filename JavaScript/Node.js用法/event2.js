// var events=require('events');
// var emitter=new events.EventEmitter();

var events = require('events'); 
var emitter = new events.EventEmitter(); 

emitter.on('e',function (value) {
	console.log(+new Date());
	console.log(value);
});

emitter.on('d',function (value) {
	console.log(+new Date());
	console.log(value);
});

setTimeout(function () {
	emitter.emit('e',(+new Date()));
},3000);

setTimeout(function () {
	emitter.emit('d',(+new Date()));
},6000);