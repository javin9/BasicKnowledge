//两种方式
// import css from '../css/detail.css';
// require('../../css/reset.css');
// require('../css/detail.css');
import common from '../../libs/common.js';
var cookie = require('../../libs/cookie.js');
var cc = require('./subdetail.js');
require('swiper');



common.cl();

function detail() {
    console.log('detail');
    console.log(+new Date());
    console.log($);
    console.log(_);
}
detail();