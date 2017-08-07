// import Vue from 'vue'
// import Router from 'vue-router'
// import Hello from '@/components/Hello'

// Vue.use(Router)

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'Hello',
//       component: Hello
//     }
//   ]
// })

import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

//引入组件
import Home from '@/components/Home';

let  router= new Router({
  routes: [
  {
    path:'/',
    name:'Home',
    component:Home
  }
  ]
});

 export default router;
