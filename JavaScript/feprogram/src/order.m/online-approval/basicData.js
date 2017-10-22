import './basicData.scss'
import Vue from 'vue';
import VueResource from 'vue-resource';
import ComponentBasicData from './views/basicData.vue';

Vue.use(VueResource);
var vm = new Vue({
    el: '#main',
    components: {
        ComponentBasicData
    }
});