import '../comm.scss';
import Vue from 'vue';
import $ from 'jquery'
import Store from  '../Store.js';
import index from './pages/UserBasicInfo.vue';
import comm from '../comm/comm.js';
import '../comm/script/NewSelectCity.js';
import '../comm/script/keyboard.js';
window.Store = Store;
window.comm = comm;
var UserBasicInfo = new Vue({
	el: '#UserBasicInfo',
	data:{
		ShortEName:comm.getUrlParam('ShortEName'),//保险公司名称
	},
	components: {
		index
	},
	created:function(){
	},
	ready:function(){
		var id = this.ShortEName;
		$('#bannerCtn .'+id).show();
	}
});
