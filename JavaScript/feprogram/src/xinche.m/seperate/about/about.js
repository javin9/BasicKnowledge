import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Index from './pages/index.vue'
import Who from './pages/who.vue'
import What from './pages/what.vue'
import Advantage from './pages/advantage.vue'
import Media from './pages/media.vue'
import Contact from './pages/contact.vue'

Vue.use(VueRouter)
Vue.use(VueResource)

let App = Vue.extend({})

let router = new VueRouter()

router.map({
  '/': {
    component: Index
  },
  '/who': {
    component: Who
  },
  '/what': {
    component: What
  },
  '/advantage': {
    component: Advantage
  },
  '/media': {
    component: Media
  },
  '/contact': {
    component: Contact
  }
})

router.start(App, '#app')