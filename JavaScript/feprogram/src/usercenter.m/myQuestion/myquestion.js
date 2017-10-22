require('./myquestion.scss');

class QuestionList{

	constructor(){
		this.domCache = {
	        $queslist: $(".ques_list")
		}

	    this.scrollSign = true;
	    this.pageIndex = 1;
	    this.pageSize = 10;
	    this.text = {
	        'load': '上拉 加载更多',
	        'end': '已经没有更多数据'
	    };

	    this.init();
	    this.bindEvent();
	}

	// 初始化
	init(){
		var self = this;

		this.getData( self.pageIndex, self.pageSize );
	}

	// 获取数据
	getData( _pageIndex, _pageSize){
		let self = this;

		if ( _pageIndex === 1 ) {
            $('#quesLoading').addClass('first');
            self.domCache.$queslist.removeClass('allshowed');
        } else {
            $('#quesLoading').removeClass('first');
        }

		$.ajax({
			url: '/MyQuestion/GetMyQuestionList',
            method: 'GET',
            dataType: 'json',
            data: {
            	pageIndex: _pageIndex,
            	pageSize: _pageSize
            },
            success: function(res){

            	var resData = res.Data;
            	
            	if( res.Result && resData.length > 0 ){
            		self.scrollSign = true;

            		$.each(resData, function(i, val){
	    				let dataObj = '';
	    				if ( val.Answer ){
	    					// 有回答
	    					dataObj += '<li class="ques_item">' +
			                    '<h3>' + val.Question + '</h3>' +
			                    '<p>' + val.Answer + '</p>' +
			                    '<aside><span>' + val.AnswerTime + '</span>|<span>向<b>' + val.ProfessionalName + '</b>提问</span>|<span>赞(<b>' + val.PraiseCount + '</b>)</span></aside>' +
			                '</li>';
	    				} else {
	    					// 无回答
	    					dataObj += '<li class="ques_item">' +
			                    '<h3>' + val.Question + '</h3>' 
			                '</li>';
	    				}	    				

		                $('.ques_list ul').append(dataObj);
	            	})

            		$('#quesLoading').hide();

            		if ( res.RowCount <= self.domCache.$queslist.find('li').length ) {
	                    self.domCache.$queslist.addClass('allshowed');
	                    $('#queTipbox').show().text(self.text.end);
	                } else {
	                    $('#queTipbox').show().text(self.text.load);
	                }

                	self.scrollSign = true;
            	} else {
	                if ( self.pageIndex === 1) {
	                    $('#quesEmpty').show();
	                    $('#quesLoading').hide();
	                    self.domCache.$queslist.addClass('allshowed');
	                } else {
	                    if (res.Data.length === 0) {
	                        $('#quesLoading').hide();
	                        $('#queTipbox').show().text(self.text.end);
	                        self.domCache.$queslist.addClass('allshowed');
	                    } else {
	                        tools.showAlert(res.Message);
	                    }
	                }
	            }
            }
		});
	}

	// scroll滚动加载数据
	bindEvent(){
		let self = this;

	    $(window).scroll(function () {
	        var scrollHeight = document.body.scrollTop || document.documentElement.scrollTop;
	        var moreHeight = self.domCache.$queslist.offset().top - $(window).height() + self.domCache.$queslist.height() - 5;
	        if ( self.scrollSign ) {
	            if (scrollHeight >= moreHeight && !self.domCache.$queslist.hasClass('allshowed')) {
	                self.scrollSign = false;
	                ++self.pageIndex;
	                self.getData(self.pageIndex, self.pageSize);
	            }
	        };
	    });
	}

}

$(function(){	
	new QuestionList();
})
