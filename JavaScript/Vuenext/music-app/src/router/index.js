import Vue from 'vue';
import Router from 'vue-router';
import recommend from 'components/recommend/recommend.vue';
import singer from 'components/singer/singer.vue';
import search from 'components/search/search.vue';
import rank from 'components/rank/rank.vue';


Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [{
      path: '/',
      redirect: 'recommend'
    },
    {
      path: '/singer',
      name: 'singer',
      component: singer
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: recommend
    },
    {
      path: '/search',
      name: 'search',
      component: search
    },
    {
      path: '/rank',
      name: 'rank',
      component: rank
    }]
})
