import './index.scss'
import ko from 'knockout'

var pageCount = 0,//总页码数 
    pageSize =10,//每页条数
    pageIndex = 1,
    scrollSign = true,//是否可滚动加载数据
    sliderUpBox = $(".evaluate-list .sliderUp-box");
//数据Model    
var myCommentViewModel = {
    myCommentArr: ko.observableArray(),//我的评价
    pageIndex:ko.observable(pageIndex),//当前页数
    rowCount:ko.observable(pageCount),//总数
    isCommentList:ko.observable(false),//评论列表是否显示
    isNoCommentList:ko.observable(false)//暂无评论是否显示
}

module.exports =  {
	init:function(){
		var self = this;
		ko.applyBindings(myCommentViewModel);
		self.bindEvents();
		self.render();
	},
	//事件绑定
	bindEvents:function(){
		var self = this;
		
          // var listHeight = moreHeight + myCommentViewModel.pageIndex()*105*pageSize/75*parseInt($("html").css("font-size").replace("px",""));
          $(window).scroll(function(){
          	sliderUpBox.show();
              var scrollHeight=document.body.scrollTop || document.documentElement.scrollTop;
              var moreHeight = $(".evaluate-list").offset().top-$(window).height()+$(".evaluate-list").height()-5;
              // console.log(moreHeight +"__"+scrollHeight)
              if (scrollSign) {
                  if(scrollHeight >= moreHeight){
                      scrollSign = false;
                      ++pageIndex;
                      myCommentViewModel.pageIndex(pageIndex);
                      sliderUpBox.html('数据加载中');
                      self.render();
                  }
              };
          });

          $(".evaluate-list").on("click",".product-title",function(e){
          	location.href = $(this).data("link");	
          })
	},

	render:function(){
		var self = this;
          self.sendAjax({
              url: '/MyComment/GetLoanUserEvaluate?pageIndex='+ myCommentViewModel.pageIndex() +'&pageSize=' + pageSize,
              type: 'Get'
          },
          function(res) {
          	if(res.Result){
          		var _data = res.Data;
            	pageCount = Math.ceil(res.RowCount/pageSize);
            	myCommentViewModel.rowCount(res.RowCount);
            	if(res.RowCount>0){
            		myCommentViewModel.isNoCommentList(false);
            		myCommentViewModel.isCommentList(true);
            		$.each(_data, function(index, val) {
	            		var productTags = [],
	            			productTagHtml = "",
	            			adviserTagHtml = "",
	            			adviserTags="",
	            			_adviserPhoto="",
	            			_adviserSkillLevelCls="",
	            			_adviserContentText="",
	            			_adviserServeNumber="",
	            			_adviserName="",
	            			_adviserWorkingYears="",
	            			_adviserScore="0%",
							_adviserRate="0%",
	            			_isAdviserScore = false,
	            			_isProductJudgeContent = false,
	            			_cN400 ="",
	            			_exTen="",
	            			_Phone="",
	            			curDate = new Date(),
	            			isAdviser1 = false,//跟随产品评价的贷款顾问评价
	            			isAdviser2 = false;//单独贷款顾问评价
	            		//删除数组中的空值
	            		function replaceEmptyItem(arr) {
	            			var newArr = new Array();
						    for (var i = 0,len = arr.length; i < len; i++) {
						        if (arr[i] && arr[i] != '' && arr[i] != undefined) {
						            newArr.push(arr[i]);
						        }
						    }
						    return newArr;
						}
						(val.ProductJudgeContent == null)?_isProductJudgeContent = false:_isProductJudgeContent=true;
	            		if(val.ProductEvaluateTagsName){
	            			productTags = val.ProductEvaluateTagsName.split("|");
	            			productTags = replaceEmptyItem(productTags);
	            		}
	            		// console.log(val.loanAdviserEvaluateInfos.length)
	            		if(val.loanAdviserEvaluateInfos.length == 0){
	            			isAdviser1 = false;
	            		}else{
	            			isAdviser1 = true;
	            			if(val.loanAdviserEvaluateInfos[0].Evaluate.TagsName){
	            				adviserTags = val.loanAdviserEvaluateInfos[0].Evaluate.TagsName.split("|");
	            				adviserTags = replaceEmptyItem(adviserTags);
	            			}
	            			
	            			_adviserPhoto = val.loanAdviserEvaluateInfos[0].UserInfo.Photo;
	            			_adviserSkillLevelCls = "medal-" + val.loanAdviserEvaluateInfos[0].UserInfo.SkillLevelId;
	            			_adviserContentText = val.loanAdviserEvaluateInfos[0].Evaluate.ContentText;
	            			_adviserServeNumber = val.loanAdviserEvaluateInfos[0].UserInfo.ServeNumber;
	            			_adviserName = val.loanAdviserEvaluateInfos[0].UserInfo.Name;
	            			_adviserWorkingYears = curDate.getFullYear() - val.loanAdviserEvaluateInfos[0].UserInfo.WorkingYears;
	            			_adviserScore = val.loanAdviserEvaluateInfos[0].Evaluate.Score * 20 +"%";
							_adviserRate=val.loanAdviserEvaluateInfos[0].UserInfo.Rate+"%";
	            			_cN400 = val.loanAdviserEvaluateInfos[0].UserInfo.CN400;
	            			_exTen = val.loanAdviserEvaluateInfos[0].UserInfo.ExTen;
	            			_Phone = (val.loanAdviserEvaluateInfos.length>0)?("tel:" + val.loanAdviserEvaluateInfos[0].UserInfo.Phone):"javascript:void(0)";
	            			(Number(val.loanAdviserEvaluateInfos[0].Evaluate.Score)>0)?_isAdviserScore = true:_isAdviserScore=false;
	            		}

	            		$.each(productTags, function(index, val) {
	            			productTagHtml+='<label class="adviser-name">'+ val +'</label>';
	            		});
	            		$.each(adviserTags, function(index, val) {
	            			adviserTagHtml+='<label class="adviser-name">'+ val +'</label>';
	            		});

	            		
	            		var myCommentData = {
		                    packageName: val.PackageName,
		                    companyName: val.CompanyName,
		                    carSerialName:val.CarSerialName,
		                    carYearType:val.CarYearType,
		                    carName:val.CarName,
		                    carFullName:" " +val.CarFullName,
		                    productJudgeScoreWidth:val.ProductJudgeScore * 20 +"%",//评分
		                    productJudgeContent:val.ProductJudgeContent,//评论内容
		                    isProductJudgeContent:_isProductJudgeContent,
		                    productTagHtml:productTagHtml,//标签
		                    createTime:val.CreateTime,
		                    adviserTagHtml:adviserTagHtml,//贷款顾问标签
		                    adviserPhoto:_adviserPhoto,//贷款顾问头像
		                    adviserSkillLevelCls:_adviserSkillLevelCls,//等级
		                    adviserContentText:_adviserContentText,//评论内容
		                    adviserServeNumber:_adviserServeNumber,//贷款人数
		                    adviserName:_adviserName,//姓名
		                    adviserWorkingYears:_adviserWorkingYears,//工作时间
		                    adviserScore:_adviserScore,
							adviserRate:_adviserRate,
		                    isAdviser1:isAdviser1,
		                    isAdviser2:isAdviser2,
		                    detailLink:xinche+"/"+val.CityId+"/m" + val.CarId + "/p"+ val.ProductId,
		                    telHref:_Phone,
		                    isAdviserScore:_isAdviserScore,
							isProductId:val.ProductId == 0?false:true,
		                };
		            	myCommentViewModel.myCommentArr.push(myCommentData);		            	 
	            	});

	            	if(myCommentViewModel.pageIndex() < pageCount){
                        scrollSign = true;
                        sliderUpBox.html('<i class="sliderUp"></i>向上滑动刷新');
                    }else{
                    	sliderUpBox.html('没有更多了~');
                    }	
            	}else{
            		myCommentViewModel.isNoCommentList(true);
            		myCommentViewModel.isCommentList(false);
            	}
            	
          	}
          	
          	
          },
          function (textStatus) { 
          	
          });
	},
	//ajax
      sendAjax: function (options, _callback, _errorcallback) {
          var self = this;
          var setting = {
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
              beforeSend: function () {
              },
              success: function (res) {
                  _callback(res);
              },
              complete: function (XMLHttpRequest, textStatus) {
                  if (status == 'timeout') {//超时,status还有success,error等值的情况
                      _errorcallback(textStatus);
                  }
              }
          })
      }
}