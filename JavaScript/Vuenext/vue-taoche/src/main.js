import Vue from 'vue';//1
//import VueRouter from 'vue-router';//2

// //作为Vue的插件
// Vue.use(VueRouter);//3

// //一个路径(path)对应一个组件(components)
// import Home from '@/components/Home';
// var router=new VueRouter({
// 	routes:[//routes千万不要拼错了
// 	{
//      path:'/',
//      component:Home
// 	}
// 	]
// });
import router from '@/router/index';

//引入模板组件
import App from './App';//4

//引入css文件
import appcss from '@/assets/css/app';

import $ from 'jquery';
console.log($.fn.jquery);

//启动应用
new Vue({
	el:"#app",//挂载点 在index.html页面里面
	router:router,
	template:'<App></App>',
    components:{
    	App:App
    }
});