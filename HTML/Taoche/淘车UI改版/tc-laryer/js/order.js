 var data = [{
         className: '一班',
         name: '张三',
         sex: '女',
         age: 23,
         aihao: '足球'
     }, {
         className: '一班',
         name: '张三33',
         sex: '女',
         age: 29,
         aihao: '篮球'
     }, {
         className: '一班',
         name: '张三44',
         sex: '女',
         age: 26,
         aihao: '足球'
     }, {
         className: '一班',
         name: '张三55',
         sex: '女',
         age: 21,
         aihao: '篮球'
     }, {
         className: '一班',
         name: '张三1',
         sex: '男',
         age: 21,
         aihao: '篮球'
     }, {
         className: '一班',
         name: '张三2',
         sex: '男',
         age: 21,
         aihao: '足球'
     }, {
         className: '一班',
         name: '张三3',
         sex: '女',
         age: 21,
         aihao: '足球'
     },

     {
         className: '二班',
         name: '李四',
         sex: '女',
         age: 22,
         aihao: '足球'
     }, {
         className: '一班',
         name: '李四1',
         sex: '男',
         age: 23,
         aihao: '篮球'
     }, {
         className: '二班',
         name: '李四2',
         sex: '男',
         age: 24,
         aihao: '足球'
     }, {
         className: '一班',
         name: '李四3',
         sex: '女',
         age: 24,
         aihao: '足球'
     }, {
         className: '二班',
         name: '李四4',
         sex: '女',
         age: 26,
         aihao: '足球'
     }, {
         className: '一班',
         name: '李四5',
         sex: '男',
         age: 22,
         aihao: '篮球'
     }, {
         className: '二班',
         name: '李四6',
         sex: '男',
         age: 22,
         aihao: '足球'
     },

 ];

 var data2 = [{
     className: '一班',
     name: '张三',
     sex: '女',
     age: 23,
     aihao: '足球'
 }, {
     className: '二班',
     name: '张三33',
     sex: '女',
     age: 29,
     aihao: '篮球'
 }, {
     className: '一班',
     name: '张三44',
     sex: '女',
     age: 26,
     aihao: '足球'
 }];
 var res = orderBy(data2, ['className', 'age'], ['desc', 'desc']);

 console.log('----最后结果----')
 console.log(res);

 function orderBy(source, orders, sortarr) {
     var ordersc = orders.concat([]);
     var results = [];
     var totalSum = {};

     grouporder(source, ordersc, totalSum);

     function grouporder(source, orders, totalSum) {
         source.sort(function(a, b) {
             var convertA = a[orders[0]];
             var convertB = b[orders[0]];
             var type = sortarr[0];
             console.log(type);
             if (typeof convertA == 'string' && typeof convertB == 'string') {
                 if (type.toUpperCase() == 'ASC') {
                     return convertA.localeCompare(convertB);
                 } else {
                     return convertB.localeCompare(convertA);
                 }
             } else {
                 if (type.toUpperCase() == 'ASC') {
                     return convertA - convertB;
                 } else {
                     return convertB - convertA;
                 }
             }
         });

         var groupmap = {};
         source.forEach(function(item) {
             var temp = item[orders[0]];
             if (!groupmap[temp]) {
                 groupmap[temp] = [];
             }
             groupmap[temp].push(item);
         });



         orders.shift();
         sortarr.shift();

         for (var key in groupmap) {
             var val = groupmap[key];
             totalSum[key] = {};
             totalSum[key].name = key;
             totalSum[key].value = val.length;
             if (orders.length === 0) {
                 results = results.concat(val);
             } else {
                 totalSum[key].children = {};
                 var orderscopy = orders.concat([]);
                 grouporder(val, orderscopy, totalSum[key].children);
             }
         }
     }


     return {
         results: results
     };
 }

var dd=formatNum(24123412.342,2);
console.log(dd);

 function formatNum(num, n) {
     //参数说明：num 要格式化的数字 n 保留小数位      
     num = String(num.toFixed(n));
     var re = /(-?\d+)(\d{3})/;
     while (re.test(num)) {
         num = num.replace(re, "$1,$2");
     }
     return num;
 }