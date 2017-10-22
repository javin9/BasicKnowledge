import Vue from 'vue';
import VueResource from 'vue-resource'
import ComponentIndex from './views/index.vue';
Vue.use(VueResource);

var vm = new Vue({
    el: '#main',
    components: {
        ComponentIndex
    }
});