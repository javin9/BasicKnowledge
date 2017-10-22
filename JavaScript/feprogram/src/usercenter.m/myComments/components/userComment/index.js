import './index.scss'
import ko from 'knockout'
;(function($){
    var e = {
        nextAll: function(s) {
            var $els = $(), $el = this.next()
            while( $el.length ) {
                if(typeof s === 'undefined' || $el.is(s)) $els = $els.add($el)
                $el = $el.next()
            }
            return $els
        },
        prevAll: function(s) {
            var $els = $(), $el = this.prev()
            while( $el.length ) {
                if(typeof s === 'undefined' || $el.is(s)) $els = $els.add($el)
                $el = $el.prev()
            }
            return $els
        }
    }

    $.extend( $.fn, e )
})($);

var backGoPageTipBox = $(".backGoPageTip"),
    maskLayerBox = $("#maskLayer");

module.exports = {
	init:function(){
		var self = this;
		self.bindEvents();
		},
    bindEvents: function(){
        var self = this;

        //标签点击事件
        $(".tag").on("click",function(e){
            if($(this).hasClass('on')){
                $(this).removeClass('on');
            }else{
                if($(this).siblings('label.on').length>2){
                    tools.showAlert("最多选3个哦~");
                }else{
                   $(this).addClass('on'); 
                }
                
            }
        })

        //星星点击
        $(".star-level em").on("click",function(e){
            var _parentNode =  $(this).parent(".star-level");
            var _scoreDetails = _parentNode.next(".score-details");
            _scoreDetails.html('<span class="score"><font>'+ ($(this).index()+1) +'.0</font>分</span>').attr("data-id",($(this).index()+1));
            $(this).addClass('on').nextAll("em").removeClass('on');
            $(this).prevAll("em").addClass('on');
        })

        //返回按钮
        $(".backGoPage").on('click', function(event) {
            event.preventDefault();
            maskLayerBox.show(); 
            backGoPageTipBox.show();
        });
        //弹层事件
        backGoPageTipBox.on('click', '.cancel-btn,.sure-btn', function(event) {
            event.preventDefault();
            if($(this).hasClass("cancel-btn")){
                maskLayerBox.hide();
                backGoPageTipBox.hide(); 
            }else if($(this).hasClass("sure-btn")){
                 backGoPageTipBox.hide(); 
                window.history.back();
                return false;
            }
        });

        //文本域事件
        $("textarea").on("keyup input",function(e){
            if($(this).val().trim() == "" || $(this).val().trim().length>20){
                $(this).next(".warn").hide();
            }else{
                $(this).next(".warn").show();
            }
        })
        //提交按钮
        $(".submit-btn").on("click",function(){
            if(self.check()){
                var _adviseEvaluateTags="",
                    _productEvaluateTags="";
                $.each($(".adviser-comment .tag.on"), function(index, val) {
                    if(index == $(".adviser-comment .tag.on").length-1){
                        _adviseEvaluateTags += $(val).attr("data-id");
                    }else{
                        _adviseEvaluateTags += $(val).attr("data-id")+"|";
                    }
                });
                $.each($(".product-comment .tag.on"), function(index, val) {
                    if(index == $(".product-comment .tag.on").length-1 ){
                        _productEvaluateTags += $(val).attr("data-id");
                    }else{
                         _productEvaluateTags += $(val).attr("data-id")+"|";
                    }
                });

                var _data ={
                    AdviserId:$("#AdviserId").val(), //顾问Id（来自隐藏域）
                    AdviseEvaluateTags:_adviseEvaluateTags,  //顾问标签,多个以"|"为分隔符
                    AdviserJudgeScore:$(".adviser-comment .adviser-score .score-details").attr('data-id')||"",   //顾问评分
                    AdviserJudgeContent:$(".adviser-comment textarea").val(),    //顾问评价内容
                    
                    Car_ID:$("#Car_ID").val(),    //车款ID（来自隐藏域）
                    ChildOrderID:$("#ChildOrderID").val(),  //子订单号（来自隐藏域）
                    CompanyID:$("#CompanyID").val(),   //金融公司ID（来自隐藏域）
                    PackageID:$("#PackageID").val(),  //套餐ID（来自隐藏域）
                    ProductJudgeScore:$(".product-comment li").eq(0).find(".score-details").attr("data-id"),   //总体评分
                    FeedbackScore:$(".product-comment li").eq(1).find(".score-details").attr("data-id"),  //反馈速度评分
                    ServiceScore:$(".product-comment li").eq(2).find(".score-details").attr("data-id"),  //服务评分
                    VerifyScore:$(".product-comment li").eq(3).find(".score-details").attr("data-id"), //审批速度评分
                    ProductEvaluateTags:_productEvaluateTags, //产品评价标签,多个以"|"为分隔符
                    ProductJudgeContent:$(".product-comment textarea").val()
                };
                $.ajax({
                    url: '/MyComment/SubmitUserEvaluate',
                    type: 'POST',
                    data: _data,
                    beforeSend: function () {
                    },
                    success: function (res) {
                       location.href="/MyComment/CommentResult?childOrderID="+_data.ChildOrderID;
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                       
                    }
                })                    
            }
        })
    },
    check:function(){
        var checkNum = 0;
        $.each($(".product-comment li"), function(index, val) {
            if($(val).find(".score-details").attr("data-id")){
                checkNum+=1;
            }else{
               $(val).find(".score-details .warn").show();
            };
        });
        if($(".product-comment textarea").val().trim() == "" || $(".product-comment textarea").val().trim().length>20){
            checkNum+=1;
            $(".adviser-comment footer .warn").hide();
        }else{
            $(".product-comment footer .warn").show();
        }
        
        if($(".adviser-comment textarea").val().trim() == "" || $(".adviser-comment textarea").val().trim().length>20){
            checkNum+=1;
             $(".adviser-comment footer .warn").hide();
        }else{
            $(".adviser-comment footer .warn").show();
        }

        // console.log(checkNum);
        if(checkNum ==6){
            return true;
        }else{
            return false;
        }
    }
}