import VueRouter from 'vue-router';
import Vue from 'vue';

Vue.use(VueRouter)

import home from '@/components/home';
import about from '@/components/about';
import doc from '@/components/doc';
import plan from '@/components/plan';
import error from '@/components/404';
import slider from '@/components/slider';

import one from '@/views/doc_one';
import two from '@/views/doc_two';
import three from '@/views/doc_three';

import usercenter from '@/components/user';
import login from '@/components/login';

export default new VueRouter({
  mode: 'history', //默认是hash模式 ，这里采用history模式
  // linkActiveClass: 'is-class', /*默认router-link-active*/
  routes: [{
      path: '/',
      name:'myhome',
      components: {
        default:home,
        slider:slider
      }
    },
    {
      path: '/about',
      component: about,
      alias:'/at'
    },
    {
      path: '/doc',
      component: doc,
      children:[
      {
        path:'',
        component:one
      },
      {
        path:'d2',
        component:two
      },
      {
        path:'d3',
        component:three
      },
      ]
    },
    {
      path: '/plan/:title',
      component: plan
    },
    ,
    {
      path:'/user/:username/post/:id',
      name:'user',
      component:usercenter
    },
   {
      path:'/user/:id',
      name:'user',
      component:usercenter
    }
    ,
    {
      path:'/login',
      name:'login',
      component:login
    },
    {
      path:'/abc',
      name:'abc',
      component:about
    }
    //,
    // {/*跳转到404页面*/
    //  path: '*',
    //  component: error  
    // }
    // ,
    // {/*重新定向到指定页面*/
    //  path: '*',
    //  redirect:{path:'/about'}
    // }
    // ,
    // { /*重新定向到指定页面*/
    //   path: '*',
    //   redirect: { name:'myhome' }
    // }
    ,
    { /*重新定向到指定页面*/
      path: '*',
      redirect:function (to) {
        /* body... */
        console.log(to);
        return '/doc'
      }
    }
  ]
})
