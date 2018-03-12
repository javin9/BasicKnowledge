/**
 * Created by 毅 on 2015/9/20.
 */

var fs = require('fs');

var filename = '2.new.txt';

fs.watch(filename, function(ev, fn) {
    console.log(ev);

    if (fn) {
        console.log(fn + ' 发生了改变');
    } else {
        console.log('....');
    }

});