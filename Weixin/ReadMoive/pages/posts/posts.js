//引用外部静态数据 ,只能用相对路径，不能用绝对路径
let postData = require("../../data/posts-data.js");
console.log(postData);
Page({
  data: {//小程序总是会读取data数据做数据绑定，这个读取事件，是在onload之后发生的
    list: []
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    console.log("onLoad");
    this.setData({
      list: postData.postList
    });
  },
  onGotoDetail: function (ev) {
    console.log(ev);
    let postId = ev.currentTarget.dataset.postid;
    console.log(postId);
    wx.navigateTo({
      url:'post-detail/post-detail?postid='+postId+"&t="+Date.now()
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    console.log("onReady");
  },
  onReady: function () {
    // 生命周期函数--监听页面显示
    console.log("onReady");
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏
    console.log("onHide");
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
    console.log("onUnload");
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
    console.log("onPullDownRefresh");
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
    console.log("onReachBottom");
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  },
  onTapSwiper:function(ev){
    //target:当前点击的组建
    //currentTarget事件捕获的组件
   console.log(ev);//
  }
})
