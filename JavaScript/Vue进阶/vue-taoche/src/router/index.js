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


var router = new VueRouter({
  mode: 'history', //默认是hash模式 ，这里采用history模式
  // linkActiveClass: 'is-class', /*默认router-link-active*/
  scrollBehavior: function(to, from, saveposition) {
    /* body... */
    // console.log(to);
    // console.log(from);
    // console.log(saveposition);
    // if (saveposition) {
    //   return saveposition
    // } else {
    //   return { 'x': 0, 'y': 0 };
    // }
  },
  routes: [{
      path: '/',
      name: 'myhome',
      components: {
        default: home,
        slider: slider
      },
      meta: {
        index: 0,
        title: 'myhome',
        login: true
      }
    },
    {
      path: '/about',
      component: about,
      alias: '/at', //别名
      meta: {
        index: 1,
        title: 'about',
        login: true
      },
       beforeEnter:function (to,from,next) {
        console.log('beforeEnter');
        next();
      }
    },
    {
      path: '/doc',
      component: doc,
      children: [{
          path: '',
          component: one,
          meta: {
            title: 'doc',
            login: true
          }
        },
        {
          path: 'd2',
          component: two
        },
        {
          path: 'd3',
          component: three
        },
      ]
    },
    {
      path: '/plan/:title',
      component: plan,
      meta: {
        title: 'plan',
        login: true
      }
    },
    {
      path: '/user/:id?',
      name: 'user',
      component: usercenter,
      meta: {
        title: 'user',
        login: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {
        title: 'login',
        login: true
      }
    },
    {
      path: '/abc',
      name: 'abc',
      component: about,
      meta: {
        title: 'login',
        login: true
      }
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
      redirect: function(to) {
        /* body... */
        console.log(to);
        return '/doc'
      }
    }
  ]
});

// router.beforeEach(function(to, from, next) {
//   /* 还没渲染... */
//   if (to.meta.login) {
//     next('/login');
//   }else {
//      next();
//   }
// });

// router.afterEach(function(to, from, next) {
//   /* body... */
//   next();
// });

export default router;
