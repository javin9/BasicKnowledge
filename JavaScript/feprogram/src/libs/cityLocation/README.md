tencent.m.js
增加了M站腾讯城市定位的js，此JS除了腾讯API不依赖任何第三方库，建议标签插入到需要增加定位的页面其他js上方，优先执行
程序会在定位成功（切与当前城市不同）和失败后各自有个弹层，
定位成功后与当前城市不符 弹层的确定按钮需要监听pageJump，Event会挂载需要切换的城市对象city
document.addEventListener("pageJump",function(e){
    console.log(e.city);
})

定位失败点击选择城市按钮需要监听
document.addEventListener("selectCity",function(e){
    console.log('选择城市');
})
