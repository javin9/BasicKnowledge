import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

//引入组件
import Home from '@/components/Home';

let router = new Router({
  routes: [{
    path:'/',
    name:Home
    compontent:Home
  }]
}
});

exprot default router;
