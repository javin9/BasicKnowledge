/**
 * Created by 毅 on 2015/9/20.
 */

var fs = require('fs');

/*
fs.open('1.txt', 'r', function(err, fd) {
    console.log(fd);
});

console.log(fd);*/

var fd = fs.openSync('1.txt', 'r');

console.log(fd);

