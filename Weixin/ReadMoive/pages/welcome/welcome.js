Page({
    onTap: function () {
        console.log("onTap");
        //又返回按钮，而且跳转页面是子页面
        // wx.navigateTo({
        //   url: '../posts/posts',
        //   success: function(res){
        //     // success
        //   },
        //   fail: function() {
        //     // fail
        //   },
        //   complete: function() {
        //     // complete
        //   }
        // });
        //不会有返回按钮，评级关系
        // wx.redirectTo({
        //     url: '../posts/posts',
        //     success: function (res) {
        //         // success
        //     },
        //     fail: function () {
        //         // fail
        //     },
        //     complete: function () {
        //         // complete
        //     }
        // });
        wx.switchTab({
          url: '../posts/posts',
          success: function(res){
            // success
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
    },
    // onUnload:function(){
    //     console.log("redirectTo 跳转  执行");
    // },
    onUnload: () => {
        console.log("redirectTo 跳转  执行");
    },
    onHide: function () {
        console.log("navigateTo 跳转 执行");
    }
});