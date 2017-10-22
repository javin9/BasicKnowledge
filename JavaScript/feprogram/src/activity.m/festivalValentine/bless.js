import './bless.scss';

import 'libs/tools.m.js';
import Vue from 'vue'
import iScroll from 'iscroll';
import uuid from 'uuid';

var defGuestName = ['大佬','隔壁老王','你老板','磨人小妖精','朝阳大妈','吃瓜群众','尼古拉斯·罩得住','爱新觉罗·搞事儿','葫芦娃','蛇精','至尊宝','紫霞仙子','齐天大圣','白骨精','美羊羊','懒羊羊']; // 16
var defGuestWordPaYixin = '向你发射一颗爱心';
var defGuestWordPa = ['助你买车一臂之力','向你发射一颗爱心','你的车贷我承包','送你桃心么么哒','买车优惠天天有','买对了车每天都是情人节']; // 6
var defGuestWordSiYixin = '向你抛洒一包狗粮';
var defGuestWordSi = ['助你买车一臂之力','向你抛洒一包狗粮','你的车贷我承包','送你狗粮么么哒','买车优惠天天有','买对了车每天都是情人节']; // 6
var defGuestAvatarYixin = './images/defaultavatar-0.html.png';
var defGuestAvatar = ['http://img2.bitautoimg.com/jinrong/assets/usercenter.m/myHome/images/car-002.html.png?v=201701221750','http://img3.bitautoimg.com/jinrong/assets/usercenter.m/myHome/images/car-003.html.png?v=201701221750','http://img4.bitautoimg.com/jinrong/assets/usercenter.m/myHome/images/car-004.html.png?v=201701221750','http://img1.bitautoimg.com/jinrong/assets/usercenter.m/myHome/images/car-005.html.png?v=201701221750','http://img4.bitautoimg.com/jinrong/assets/usercenter.m/myHome/images/car-008.html.png?v=201701221750']; // 6

class BlessPage{

	constructor(){
		this.dom = {
			$pop : $('#moduleDesc'),
			$mask : $('#maskLayer'),
			$top : $('.top')
		}

		this.vm = new Vue({
			el: '#valentineBless',
			data: {
				hostName: '', // 用户名
				voteNumLeft: '', // 还需票数
				prizeNow: '', // 已获得
				prizeThen: '', // 即将获得
				isLimit: true,
				classSpecial: '',
				textTypeNum: '颗心',
				classTypeBtn: 'btn_heart',
				items:[]
			}
		});

		this.isWeixin = (isWeiXinBroswer.toLowerCase() == 'true') ? true : false ; // 是否微信环境
		this.activityId = '';
		this.voteValentine = ''; // 浏览器端已投票的记录

		this.type = ''; // 活动类型
		this.voteStatus = false, // 此人是否已投票
		this.voteFlag = false, // 记录接口数据
		this.voteNum = '', // 已有票数

		this.guestId = voteUser;
		this.guestName = voteUserName;
		this.guestImgUrl = voteUserImgUrl;

		this.init();
	}

	init(){
		let self = this;

		self.activityId = tools.getUrlParam('v');

		self.getInfo();
		self.getList();

		self.bindEvent();
	}
	// 浏览器端查看是否已投票
	doInBrowser(){
		let self = this;

		self.voteValentine = tools.getCookie('voteValentine');

		if( self.voteValentine != null ){
			let _arr = self.voteValentine.split(',');

			for( let j=0; j<= _arr.length ; j++ ){
				if ( _arr[j] == self.activityId ){					
					$('.btn_heart, .btn_food').addClass('disabled');
					self.voteStatus = true;
					return;
				}
			}
		}
	}

	bindEvent(){
		let self = this;

		// 弹层
		$('#btnDesc').on('click', function(){
			self.dom.$pop.show();
			self.dom.$mask.addClass('show');

            let _popH = 0;
            _popH = $(window).height() - ( 274/75 + 264/75) * parseInt($('html').css('font-size').replace('px', ''));
            $('#wrapper').css('height', _popH + 'px');

			let popScroll = new iScroll("#wrapper", {
				'hScroll': false
            });
            popScroll.refresh();
		});

		// 关闭弹层
		$('.closeX').on('click', function(){
			self.dom.$pop.hide();
			self.dom.$mask.removeClass('show');
		});

		// 按钮点击效果
		$('.btn').on('click', '.btn_heart', function(e){
            e.preventDefault();
			if( !self.voteStatus && !$(this).hasClass('disabled') ){
				self.voteStatus = true;
				$('.eleAnimate').addClass('heart active');
				setTimeout(function(){
					$('.btn_heart').addClass('disabled');
				}, 100);
				self.saveVote();
				return;
			} else {
				if(self.voteNum < 99){
					tools.showAlert('桃心已发送，分享好友，帮TA达成心愿~');
				} else {
					tools.showAlert('已获得贷款购车2年免息优惠，不用再点啦！');
				}
			}
		});
		$('.btn').on('click', '.btn_food', function(e){
            e.preventDefault();
			if( !self.voteStatus && !$(this).hasClass('disabled') ){
				self.voteStatus = true;
				$('.eleAnimate, .eleAnimate1, .eleAnimate2, .eleAnimate3, .eleAnimate4').addClass('food active');
				setTimeout(function(){
					$('.btn_food').addClass('disabled');
				}, 100)
				self.saveVote();
				return;
			} else {
				if(self.voteNum < 99){
					tools.showAlert('狗粮已投喂，分享好友，帮TA达成心愿~');
				} else {
					tools.showAlert('已获得贷款购车2年免息优惠，不用再喂啦！');
				}
			}
		});
		
		$('.btn').on('click', '.btn_benefit', function(){
			location.href = ActivityIndex;
		});
	}
	// 获取活动基本信息
	getInfo(){
		let self = this;
		
		tools.$ajax({
			url: GetActivity,
            data: {
            	v: self.activityId,
            	oid: self.guestId
            },
            type: 'GET',
            success: function(res){

            	if ( res.Result ){
	            	let _data = res.Data;

	            	self.type = _data.ActivityType;
	            	self.voteStatus = _data.Voted;
	            	self.voteFlag = _data.Voted; // 标记接口初始状态
	            	self.voteNum = _data.Votes;

					if( self.type == '1'){
						self.dom.$top.addClass('top_partner');
						self.vm.textTypeNum = '颗心';
						if( !self.voteStatus ){
							self.vm.classTypeBtn = 'btn_heart';
						} else {
							self.vm.classTypeBtn = 'btn_heart disabled';
						}
					} else if ( self.type = '2' ){
						self.dom.$top.addClass('top_single');
						self.vm.textTypeNum = '包狗粮';
						if( !self.voteStatus ){
							self.vm.classTypeBtn = 'btn_food';
						} else {
							self.vm.classTypeBtn = 'btn_food disabled';
						}
					}

	            	self.vm.hostName = _data.UserName;

	            	if( self.voteNum < 12 ){
	            		self.vm.prizeNow = '已获得购车首付最高直降1600元优惠';
	            		self.vm.prizeThen = '距购车首付最高直降<span class="highlight">2000</span>元优惠';
	            		self.vm.voteNumLeft = 12 - _data.Votes;
	            	} else if ( self.voteNum < 50 ){
	            		self.vm.prizeNow = '已获得购车首付最高直降2000元优惠';
	            		self.vm.prizeThen = '距购车首付直降<span class="highlight">2000元+200元JD卡</span>优惠';
	            		self.vm.voteNumLeft = 50 - _data.Votes;
	            	} else if( self.voteNum < 99 ) {
	            		self.vm.prizeNow = '已获得购车首付直降2000元+200元JD卡优惠';
	            		self.vm.prizeThen = '距<span class="highlight">贷款购车2年免息</span>';
	            		self.vm.voteNumLeft = (99 - _data.Votes>=0) ? (99 - _data.Votes) : 0;
	            	} else {
	            		self.vm.prizeNow = '99个支持已集满　0息名额有限';
	            		self.vm.prizeThen = '赶快拨打4000-598-598 否则就被抢走啦!';
	            		// self.vm.isLimit = false;
	            		self.vm.classSpecial = 'txt3_spe';
						$('.btn_heart, .btn_food').addClass('disabled');
	            		self.voteStatus = true;

	            		$('article.text').addClass('special');
	            	}

	            	if( !self.isWeixin ){
						self.doInBrowser();
					}

            	} else {
            		tools.showAlert(res.Message);
            	}
            }
		});
	}
	// 获取投票列表
	getList(){
		let self = this;

		tools.$ajax({
			url: GetActivityVoteList,
            data: {
            	v : self.activityId
            },
            type: 'GET',
            success: function(res){

            	if( res.Result ){
            		let _data = res.Data;
	        			self.vm.items = [];

	        		for( let i = 0; i <= 10 && i < _data.length; i++ ){
	        			let voteitem = [];

	        			voteitem.guestAvatar = _data[i].VoteUserImgUrl;
	        			voteitem.guestName = _data[i].VoteUserName;

	        			if( self.type == '1' ){
	        				if( i == 0 ){
	        					voteitem.guestWord = defGuestWordPaYixin;
	        				} else {
	        					voteitem.guestWord = defGuestWordPa[self.getRandom(5)];	        					
	        				}
	        			} else if ( self.type == '2' ){
	        				if( i == 0 ){
	        					voteitem.guestWord = defGuestWordSiYixin;
	        				} else {
	        					voteitem.guestWord = defGuestWordSi[self.getRandom(5)];	        					
	        				}
	        			}

	        			voteitem.guestTime = _data[i].DayInfo;

	        			self.vm.items.push(voteitem);
	        		}
            	} else {
            		tools.showAlert(res.Message);
            	}

            }
		});
	}
	// 保存投票
	saveVote(){
		let self = this;

		if( !self.isWeixin ){
			// 浏览器端
			self.guestName = defGuestName[self.getRandom(15)];
			self.guestId = uuid();
			self.guestImgUrl = defGuestAvatar[self.getRandom(5)];
		}

		tools.$ajax({
			url: SaveActivityVote,
            data: {
            	ActivityID: self.activityId,
            	VoteUserImgUrl: self.guestImgUrl,
            	VoteUserName: self.guestName,
            	VoteUser: self.guestId
            },
            type: 'POST',
            success: function(res){

            	if( res.Result ){

            		// 浏览器端
            		if( !self.isWeixin && !self.voteFlag ){
            			let _old = (self.voteValentine == null) ? '' : (self.voteValentine + ',');
	            		let _new = _old + self.activityId;
	            		tools.setCookie("voteValentine", _new);
            		}

					self.getInfo();
					self.getList();

					return;
            	} else {
            		tools.showAlert(res.Message);
            	}

            }
		});
	}
	// 随机数，0-(n-1)之间的n个数随机
	getRandom(n){
		return Math.floor(Math.random()*n);
	}
}

let blessPage = new BlessPage();


