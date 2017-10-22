import '../comm.scss';
import Vue from 'vue';
import $ from 'jquery'
import Store from  '../Store.js';
import index from './pages/UserDetailInfo.vue';
import comm from '../comm/comm.js';
import '../comm/script/keyboard.js';
window.Store = Store;
window.comm = comm;
var UserDetailInfo = new Vue({
	el: '#UserDetailInfo',
	data:{},
	components: {
		index
	},
	created:function(){
	}
});
