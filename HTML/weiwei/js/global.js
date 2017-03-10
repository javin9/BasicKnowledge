// JavaScript Document
//document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
$(function(){
	var hh = $(window).height();
	function font_size(){
		var ww = $(window).width();
		if(ww>=768){
			$("html").css("font-size",768/750*100+'px');
		}else{
			$("html").css("font-size",ww/750*100+'px');/*1rem=100px,用750px宽的设计稿，直接把测量值除以100就是所需rem值*/
		}
	};
	font_size();
	$(window).resize(function(event){
		font_size();
	});
	/**以上为设定************************************************************************************************/
	$(".pop_box").height(hh);
	var inH = null;
	var ifGo = 0;
	$(".pop_button").click(function(){
		$(".pop_box").show();
		$("html").addClass("noScroll");
		inH = $(".pop_inner_text").height()-$(".pop_inner").height();//可滑动距离
	})
	$(".pop_close").click(function(){
		$(".pop_box").hide();
		$("html").removeClass("noScroll");
	})
	$(".pop_inner").scroll(function(){
		if($(".pop_inner").scrollTop()>=inH){//判断已到最底端
			console.log("已到最底端");
			$(".pop_box").on('touchmove',function(event) {
				event.preventDefault();
			}, false);
		}else if($(".pop_inner").scrollTop()==0 && ifGo==1){//判断已到最顶端
			console.log("到最顶端了");
			$(".pop_box").on('touchmove',function(event) {
				event.preventDefault();
			}, false);
		}else{
			$(".pop_box").on('touchmove',function(event) {
	    		$(".pop_box").off('touchmove');
			});
		}

	})
	$(".pop_box").on("touchstart",function(event){
	    var target  = $(event.target);
	    if(target.closest(".pop_inner_text").length == 0){//点的不是可滚动部分
	    	$(".pop_box").on('touchmove',function(event) {
				event.preventDefault();
			}, false);
	    }else{
	    	$(".pop_box").on('touchmove',function(event) {
	    		$(".pop_box").off('touchmove');
			});
	    }
	    event.stopPropagation();
    })
	/*检测滑动方向开始*/
	var  startX , startY ,endX,endY,distanceX,distanceY;
	$('.pop_inner_text').bind('touchstart',function(e){
	    startX = e.originalEvent.changedTouches[0].pageX,
	    startY = e.originalEvent.changedTouches[0].pageY;
	});
	$('.pop_inner_text').bind('touchmove',function(e){
		var that = $(this);
	    //获取滑动屏幕时的X,Y
	    endX = e.originalEvent.changedTouches[0].pageX,
	    endY = e.originalEvent.changedTouches[0].pageY;
	    //获取滑动距离
	    distanceX = endX-startX;
	    distanceY = endY-startY;
	    //判断滑动方向
	    if(Math.abs(distanceX)>Math.abs(distanceY) && distanceX>0){
	       
	       
	    }else if(Math.abs(distanceX)>Math.abs(distanceY) && distanceX<0){
	       
	       
	    }else if(Math.abs(distanceX)<Math.abs(distanceY) && distanceY<0){
	       //上滑
	       ifGo = 0;
	    }else if(Math.abs(distanceX)<Math.abs(distanceY) && distanceY>0){
	       //下滑
	       ifGo = 1;
	    }else{
	       /* console.log('点击未滑动');*/
	    }
	});
	/*检测滑动方向结束*/


	/**以下为清除************************************************************************************************/
	hh = null;
})

