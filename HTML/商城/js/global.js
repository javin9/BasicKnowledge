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
	$(".enroll_box").height(hh);
	$(".index_box").height(hh);
	$(".address_list_box").css("min-height",hh-$(".title_box").height());
	
	$(".scroll_box").height(hh-$(".index_tit").height());
	$(".left_index_pop").height(hh);
	$(".left_index_pop_secondary").height(hh);


	$(".pop_box").height(hh);
	var inH = null;
	var ifGo = 0;
	$(".add_shopCar_b").click(function(){
		$(".pop_box").show();
		$("html").addClass("noScroll");
		inH = $(".pop_inner_text").height()-$(".pop_inner").height()-3;//可滑动距离
	})
	$(".pop_pic_close").click(function(){
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
	    	/*$(".pop_box").hide();
	    	$("html").removeClass("noScroll");*/
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
	$(".pop_box").click(function(event){
		var target  = $(event.target);
		if(target.closest(".pop").length == 0){//点的黑的
	    	$(".pop_box").hide();
	    	$("html").removeClass("noScroll");
	    }
	})
	$(".arr_b_box").click(function(){
		var that = $(this);
		if(that.hasClass("arr_t_box")){
			that.find("span").html("点击显示全部分类");
			$(".index_second_list").css("height","3.2rem");
			that.find("img").toggle();
			that.removeClass("arr_t_box");
		}else{
			that.find("span").html("合上");
			$(".index_second_list").css("height","auto");
			that.find("img").toggle();
			that.addClass("arr_t_box");
		}
	})






	/*首页*/
	$(".three_l_index").click(function(){
		$(".index_box").addClass("current");
		$(".left_index_pop_box").show();
		$("html").addClass("noScroll");
	})
	$(".left_index_pop_box").click(function(){
		var target  = $(event.target);
		if(target.closest(".left_index_pop,.left_index_pop_secondary").length == 0){//点的黑的
	    	$(".left_index_pop_box").hide();
	    	$("html").removeClass("noScroll");
	    	$(".index_box").removeClass("current");
	    	$(".left_index_pop").show();
			$(".left_index_pop_secondary").hide();
	    }
	})
	$(".search_tit").focus(function(){
		$(this).css("background","#919296");
	})
	$(".search_tit").blur(function(){
		$(this).css({"background":"url(images/serch_input_bg.jpg) #919296 no-repeat center","background-size:":"0.79rem 0.24rem","-webkit-background-size":"0.79rem 0.24rem"});
	})
	$(".left_index_pop_inner").click(function(){
		/*$(this).addClass("current");*/
		$(".left_index_pop").hide();
		$(".left_index_pop_secondary").show();
	})
	$(".left_index_pop_inner_back").click(function(){
		$(".left_index_pop").show();
		$(".left_index_pop_secondary").hide();
	})
	/**以下为清除************************************************************************************************/
	hh = null;
})

