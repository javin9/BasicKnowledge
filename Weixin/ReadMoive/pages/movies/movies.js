Page({
   onLoad:function(){
     wx.request({
       url: 'https://api.douban.com/v2/book/1220562',
       data: {},
       method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
         header: {
             "Content-Type":"json"
         }, // 设置请求的 header
       success: function(res){
         // success name
         console.log(res);
       },
       fail: function(res) {
           //console.log(res);
         // fail
       },
       complete: function() {
         // complete
       }
     })
   }
});