import './share.scss'
import Vue from 'vue'
var ShareOrder = function () {
	//相关数据
    this.inOrderToShareData = {
        pageCount:0,//总页码
        pageIndex:1,//评价当前页面
        pageSize:10,//每页条数
        scrollSign: false,//是否可以滚动
    }
    //DOM     
    this.domCache={
    	orderShareLoad:$(".loading"),//车主晒单加载
        orderShareList:$("#inOrderToShare"),//车主晒单列表
        orderShareDefault:$(".order-share-default"),//车主晒单缺省
        sliderUpBox:$(".sliderUp-box"),//车主晒单向下滑动
    }
    //数据绑定
	this.vm = new Vue({
	  el: '#inOrderToShare',
	  data: {
        inOrderToShareArr:[],//车主晒单列表
	  }
	});

    this.init();
}

ShareOrder.prototype = {
	init:function(){
		var self = this;
		self.inOrderToShare();
		self.bindEvents();
	}, 
	//获取数据
    inOrderToShare:function(){
        var self = this,
            _url = '/ShareOrder/GetMyShareOrderList?pageIndex='+ self.inOrderToShareData.pageIndex +'&pageSize=' + self.inOrderToShareData.pageSize;

        self.sendAjax({
            url: _url,
            dataType: 'json'
        }, success, sendAgain);

        function success(res){   
            var _data = res.Data;	
          	if(_data.length>0){ 
                self.inOrderToShareData.pageCount = Math.ceil(res.RowCount/self.inOrderToShareData.pageSize);//计算总页码
                self.domCache.orderShareLoad.addClass('hide');
                self.domCache.orderShareList.removeClass('hide');
                self.domCache.orderShareDefault.addClass('hide');

                $.each(_data, function(index, val) {
                    var _inOrderToShareObj={};

                    _inOrderToShareObj.createdOn = val.CreatedOn;
                    _inOrderToShareObj.browserCount = val.BrowserCount;
                    _inOrderToShareObj.agreeCount =val.AgreeCount;
                    _inOrderToShareObj.title = val.Title;
                    _inOrderToShareObj.userAvatar = val.UserAvatar;
                    _inOrderToShareObj.nickName =  val.UserName||val.NickName;
                    _inOrderToShareObj.summary = val.Summary;
                    _inOrderToShareObj.href =  window.shareOrderDetailUrl + '/' +val.TopicId;
                    self.vm.inOrderToShareArr.push(_inOrderToShareObj);
                })
                

                self.domCache.sliderUpBox.removeClass('hide');
                if(self.inOrderToShareData.pageIndex < self.inOrderToShareData.pageCount){
                    self.inOrderToShareData.scrollSign = true;
                    self.domCache.sliderUpBox.html('<i class="sliderUp"></i>向上滑动刷新');
                }else{
                    self.inOrderToShareData.scrollSign = false;
                    self.domCache.sliderUpBox.html('没有更多了~');
                }   

            }else{
                self.inOrderToShareData.scrollSign = false;
                self.domCache.orderShareLoad.addClass('hide');
                self.domCache.orderShareList.addClass('hide');
                self.domCache.orderShareDefault.removeClass('hide');
            }    
        }

        // 出错后重新加载
        function sendAgain(info) {
            //console.log(info);
            self.sendAjax({
                url: _url,
            }, success, sendAgain);
        };
    },
    formatTime: function(shijianchuo){
        var self = this;
        //time是整数，否则要parseInt转换
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        return y+'-'+(m<10?'0'+m:m)+'-'+(d<10?'0'+d:d);
    },
	bindEvents:function(){
		var self = this;
	  	//滚动加载
        $(window).scroll(function(){  
            var scrollHeight=document.body.scrollTop || document.documentElement.scrollTop;
            var moreHeight = $("#inOrderToShare").offset().top-$(window).height()+$("#inOrderToShare").height()-5;
            // console.log(moreHeight +"__"+scrollHeight)
            // console.log(self.inOrderToShareData)
            if (self.inOrderToShareData.scrollSign) {
                if(scrollHeight >= moreHeight && (self.inOrderToShareData.pageIndex < self.inOrderToShareData.pageCount)){
                    self.inOrderToShareData.scrollSign = false;
                    ++ self.inOrderToShareData.pageIndex;
                    self.domCache.sliderUpBox.removeClass('hide');
                    // self.domCache.sliderUpBox.html('数据加载中');
                    self.domCache.sliderUpBox.html('<i class="sliderUp"></i>向上滑动刷新');
                    self.inOrderToShare();  
                }
            };
        });
       
	},
	sendAjax:function(options, _callback, _errorcallback){
        var self = this;
        var setting={
            url: '',
            timeout: 5000,
            type: 'get',
            dataType: 'json',
            cache: true,
            async: true,
            data: {}
        };
        setting = $.extend(setting, options);
        
        $.ajax({
            url: setting.url,
            type: setting.type,
            dataType: setting.dataType,
            async: setting.async,
            cache: setting.cache,
            data: setting.data,
            beforeSend: function(){
                
            },
            success: function(res){
                _callback(res);
            },
            complete: function(XMLHttpRequest, textStatus){    
                if (status === 'timeout') {//超时,status还有success,error等值的情况
                    _errorcallback(textStatus);
                }
            }
        })
    }
}

//走起
new	ShareOrder();
