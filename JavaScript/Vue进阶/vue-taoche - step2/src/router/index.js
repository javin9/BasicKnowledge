import VueRouter from 'vue-router';
import Vue from 'vue';

Vue.use(VueRouter)

import home from '@/components/home';
import about from '@/components/about';
import doc from '@/components/doc';


export default new VueRouter({
  mode:'history',	//默认是hash模式 ，这里采用history模式
  routes: [{
      path: '/',
      component: home
    },
    {
      path: '/about',
      component: about
    },
    {
      path: '/doc',
      component: doc
    }
  ]
})
