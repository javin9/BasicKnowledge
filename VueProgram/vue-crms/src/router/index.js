import Vue from 'vue'
import Router from 'vue-router';
import Home from '@/components/home';

import Layout from '@/views/layout';
/*

*/
import Project from '@/views/backend/project'
import Doc from '@/views/backend/doc';
import Workbench from '@/views/backend/workbench'

import Login from '@/components/login';



Vue.use(Router);

let router = new Router({
  mode: 'history',
  linkActiveClass: 'is-active',
  routes: [{
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        login: false
      },
      beforeEnter:function () {
        /* body... */
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/management',
      name: 'Management',
      component: Layout,
      children: [{
          path: '/project',
          name: 'Project',
          component: Project,
          meta: {
            login: true
          }
        },
        {
          path: '/doc',
          name: 'Doc',
          component: Doc
        },
        {
          path: '/workbench',
          name: 'Workbench',
          component: Workbench,
          meta: {
            login: true
          }
        }
      ]
    },
    {
      path: '*',
      redirect: { name: 'Home' }
    }
  ]
})

router.beforeEach((to, from, next) => {
	
   let bl = to.matched.some(function(item){
    return item.meta.login
  })

  if(to.matched.some((item) => item.meta.login)){
    let info = router.app.$local.fetch("name")
    if(info.login){  // 已经登录
        next()
    }else{
      router.push({
        path: '/login',
        query: {
          redirect: to.path.slice(1)
        }
      })
    }

  }else{
    next()
  }

});

export default router;
