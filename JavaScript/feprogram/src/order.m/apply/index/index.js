import Vue from 'vue'
import VueResource from 'vue-resource'
import LoginView from './pages/login.vue'

Vue.use(VueResource)

new Vue({
    el: '#main',
    template: `<login-view></login-view>`,
    components: {
      LoginView
    },
})
