//引用外部静态数据 ,只能用相对路径，不能用绝对路径
let postData = require("../../../data/posts-data.js");
Page({
  data:{
     
  },
  onLoad:function(options){
      console.log(options);
      let id=options.postid;
      this.data.postid=id;////借助data全局函数传参数
      let data=postData.postList[id];
      console.log(data);
      this.setData({
          postData:data
      });

       var postsCollected = wx.getStorageSync('posts_collected')
        if (postsCollected) {
            var postCollected = postsCollected[id];
            this.setData({
                collected: postCollected
            })
        }
        else {
            var postsCollected = {};
            postsCollected[id] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }
  },
  onColletionTap:function(){
     var postCollent= wx.getStorageSync('posts_collected');
     let postcollected=postCollent[this.data.postid];
     postcollected=!postcollected;
     postCollent[this.data.postid]=postcollected;
     wx.setStorageSync('posts_collected',postCollent);
     //更新数据
     this.setData({
         collected:postcollected
     });
     wx.showToast({
         mask:false,
         title:postcollected?"收场成功":"取消成功"
     });
  },
  onShareTap:function(){
     var itemList = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                // res.cancel 用户是不是点击了取消按钮
                // res.tapIndex 数组元素的序号，从0开始
                wx.showModal({
                    title: "用户 " + itemList[res.tapIndex],
                    content: "用户是否取消？" + res.cancel + "现在无法实现分享功能，什么时候能支持呢"
                })
            }
        })
  }
})