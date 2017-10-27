//两种方式
// import css from '../css/detail.css';
var underscore=require('underscore'); 
console.log(underscore);
require('../../css/detail.css');
import common from '../../libs/common.js';

var Jquery=require('Jquery'); 
console.log(Jquery);

common.cl();
function detail(){
	console.log('detail');
	console.log(+new Date());
}
detail();


