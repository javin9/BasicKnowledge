import './entrance.scss';
import Vue from 'vue'
import applyEntrance from '../components/applyEntrance/applyEntrance.vue'

var vmEntrance = new Vue({
    el: '#main',
    data: {
        showApply: false
    },
    components: {
        'apply-entrance': applyEntrance
    },
    methods: {
        apply: function() {
            this.showApply = true;
        },
        close: function() {
            this.showApply = false
        }
    }
});