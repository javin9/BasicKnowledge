/**
 * Created by 毅 on 2015/9/20.
 */

var fs = require('fs');

fs.open('1.txt', 'r+', function(err, fd) {

    /*
    * 当我们要对打开的文件进行写操作的时候，打开文件的模式应该是  读写  方式
    *
    * fs.write(fd, buffer, offset, length[, position], callback)
    *   fd : 打开的文件
    *   buffer : 要写入的数据
    *   offset : buffer对象中要写入的数据的起始位置
    *   length : 要写入的buffer数据的长度
    *   position : fd中的起始位置
    *   callback : 回调
    * */

    if (err) {
        console.log('打开文件失败')
    } else {

        /*var bf = new Buffer('123');

        fs.write( fd, bf, 0, 3, 5, function() {
            console.log(arguments);
        } );*/

        fs.write( fd, '1234', 5, 'utf-8' );

        fs.close( fd, function() {



        } );

    }

});