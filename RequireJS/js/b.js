//Inside b.js:
define(['a', 'exports'], function(a, exports) {
    //If "a" has used exports, then we have a real
    //object reference here. However, we cannot use
    //any of a's properties until after b returns a value.
console.log(exports);
//  exports.foo = function () {
//      return a.bar();
//  };
});