import Vue from 'vue';
import VueResource from 'vue-resource'
import ComponentApply from './views/apply.vue';
import './index.scss';
Vue.use(VueResource);

var vm = new Vue({
    el: '#yxWrapper',
    components: {
        ComponentApply
    }
});