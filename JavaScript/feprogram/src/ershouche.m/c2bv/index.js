import './index.scss';
import Vue from 'vue';
import conter from './components/conter.vue';
import check from 'libs/check/m.js';
const valid={
	'professional':[
		{'classname':'','txt':'上班族','id':76,'imgclass':'hook p_1'},
		{'classname':'','txt':'事业单位','id':73,'imgclass':'hook p_2'},
		{'classname':'','txt':'企业主','id':74,'imgclass':'hook p_3'},
		{'classname':'','txt':'个体户','id':75,'imgclass':'hook p_4'},
		{'classname':'','txt':'自由职业','id':77,'imgclass':'hook p_5'}],
	'monthlyincome':[
		{'classname':'','txt':'3000以下','id':66,'imgclass':'hook p_1'},
		{'classname':'','txt':'3000-5000','id':67,'imgclass':'hook p_2'},
		{'classname':'','txt':'5000-8000','id':68,'imgclass':'hook p_3'},
		{'classname':'','txt':'8000-12000','id':69,'imgclass':'hook p_4'},
		{'classname':'','txt':'12000-20000','id':108,'imgclass':'hook p_5'},
		{'classname':'','txt':'20000以上','id':109,'imgclass':'hook p_6'}],
	'social':[{'classname':'','txt':'有社保','id':1,'imgclass':'hook p_1'},
		{'classname':'','txt':'无社保','id':0,'imgclass':'hook p_2'}],
	'credit':[{'classname':'','txt':'信用良好','id':71,'imgclass':'hook p_1'},
		{'classname':'','txt':'无信用记录','id':256,'imgclass':'hook p_2'},
		{'classname':'','txt':'少数逾期','id':72,'imgclass':'hook p_3'}],
	'house':[{'classname':'','txt':'租房','id':81,'imgclass':'hook p_1'},
		{'classname':'','txt':'有房有贷','id':80,'imgclass':'hook p_2'},
		{'classname':'','txt':'有房无贷','id':79,'imgclass':'hook p_3'}],
	'carprice':[{'classname':'','txt':'5万以下','id':770,'imgclass':''},
		{'classname':'','txt':'5-10万','id':771,'imgclass':''},
		{'classname':'','txt':'10-15万','id':772,'imgclass':''},
		{'classname':'','txt':'15-20万','id':773,'imgclass':''},
		{'classname':'','txt':'20-30万','id':774,'imgclass':''},
		{'classname':'','txt':'30万以上','id':1074,'imgclass':''}],
	'downpayment':[{'classname':'','txt':'30%','id':0.3,'imgclass':''},
		{'classname':'','txt':'40%','id':0.4,'imgclass':''},
		{'classname':'','txt':'50%','id':0.5,'imgclass':''},
		{'classname':'','txt':'60%','id':0.6,'imgclass':''}],
}
let channelurl = ''
let channels = tools.getUrlParam('channel')||''
if(channels){
	channelurl='&channel='+channels
}
var vm = new Vue({
	el: '#main',
	components: {
		conter: conter,
	},
	template: `<div id="app">					
					<conter v-bind:professional="professional" 
					v-bind:monthlyincome="monthlyincome" 
					v-bind:social="social" 
					v-bind:credit="credit" 
					v-bind:house="house" 
					v-bind:carprice="carprice" 
					v-bind:downpayment="downpayment" 
					v-bind:channelurl="channelurl" ></conter>
    			</div>`,
	data: {
		professional:valid.professional,
		monthlyincome:valid.monthlyincome,
		social:valid.social,
		credit:valid.credit,
		house:valid.house,
		carprice:valid.carprice,
		downpayment:valid.downpayment,
		channelurl:channelurl
	},
	computed: {

	},
	methods: {

	},
	ready(){},
});
