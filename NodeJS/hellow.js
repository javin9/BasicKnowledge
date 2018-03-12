// console.log('hellow Node.js')
// console.log(module);
// console.log("__filename");//__ 和 _却分开
// console.log(__filename);
// console.log('__dirname')
// console.log(__dirname);

// console.log('process')
// console.log(process.env);

console.log(__dirname)
process.stdout.write('请输入a的值');
process.stdin.resume();
process.stdin.on('data',function(chunk){
	console.log('用户输入')
	console.log(Number(chunk))
});
// process.exit();

