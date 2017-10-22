
import './index.scss'
var check = require("libs/check");
var sc = require("libs/carSelect/selCarThird.pc");
var sci = require("libs/selCity");

require('jquery.lazyload');
var swiper = require("swiper");

var fg=true;

var token = $('input[name=__RequestVerificationToken]').val()

var cb=function(obj){
	$(".yxcxa").next().css("display","none");
	$(".yxcxa").next().next().val(obj.attr("data-id"));
	$(".yxcxa").next().next().next().val(obj.attr("data-val"));
	$(".yxcxa").css("border","1px solid #ddd");

	$(".yxcxa").next().html("参考价格："+obj.attr("data-val")+"万").css("background","none");
	$(".yxcxa").next().css("display","");
	fg=true;
}

var cb2=function(obj){
	$(".gccsa").html(obj.cityName);
	$(".gccsa").parent().next().css("display","none");
	$(".gccsa").parent().next().next().val(obj.cityId);
	$(".gccsa").css("border","1px solid #ddd");
	fg=true;
} 



var ccl = {

	init: function(){
		$("img.lazy").lazyload({
			effect:"fadeIn"
		})
		$(".yxcxa").selCar2({
		   OnlyOnSale:true,
             Callback: cb
          });
		$(".gccsa").selCity({
              callBacks: cb2,
			isRelationHeader:true
          });
          window.selCityCallback=function(s){};
		$(".gccs .sel-city-wrapper").css("width","280px");
		$(".gccs .sel-city-wrapper").css("height","40px");

		$(".xm input").blur(function(){
			if(check.isName(this.value)===false){
				fg=false;
				$(this).next().html("请输入2-8位汉子");
				$(this).next().css("display","");
				$(this).css("border","1px solid #ff6446");
			}else if(check.isName(this.value)==true){
				fg=true;
				$(this).next().css("display","none");
				$(this).css("border","1px solid #ddd");
			}else if(check.isName(this.value)==""){
				$(this).next().css("display","none");
				$(this).css("border","1px solid #ddd");
			}
		})
		$(".sjh input").blur(function(){
			if(check.isPhoneNumber(this.value)===false){
				fg=false;
				$(this).next().html("手机号错误");
				$(this).next().css("display","");
				$(this).css("border","1px solid #ff6446");
			}else if(check.isPhoneNumber(this.value)==true){
				fg=true;
				$(this).next().css("display","none");
				$(this).css("border","1px solid #ddd");

				//添加埋点
                  try {
                      bc.evt.send('mobile', 'mobblur',this.value);
                  }catch (err) { }

			}else if(check.isPhoneNumber(this.value)==""){
				$(this).next().css("display","none");
				$(this).css("border","1px solid #ddd");
			}
		})
		$(".xykh input").blur(function(){
			var _this=this;
			if(check.isCreditCard(this.value)===false){
				fg=false;
				$(this).next().css("display","none");
				$(this).css("border","1px solid #ddd");
				$(this).next().removeClass("alert2");
				$(this).next().css("background","");
				$(this).next().html("信用卡号错误");
				$(this).next().css("display","");
				$(this).css("border","1px solid #ff6446");
			}else if(check.isCreditCard(this.value)==true){
				fg=true;
				$(this).next().css("display","none");
				$(this).css("border","1px solid #ddd");
				tools.$ajax({
					url:GetCompanybyCardNumberUrl,
					data:{cardNumber:this.value},
					success:function(res)
					{
						if(res.ShortCName){
							$(_this).next().addClass("alert2");
							$(_this).next().html('<img src="'+res.LogoImage+'" width="40" />'+ res.ShortCName+' 卡尾号：'+_this.value.substring(_this.value.length-4,_this.value.length));
							$(_this).next().css("display","");
						}else{
							$(_this).next().addClass("alert2");
							$(_this).next().css("background","none");
							$(_this).next().html("卡尾号："+_this.value.substring(_this.value.length-4,_this.value.length));
							$(_this).next().css("display","");
						}
					}
				});
			}else if(check.isCreditCard(this.value)==""){
				$(this).next().css("display","none");
				$(this).css("border","1px solid #ddd");
				$(this).next().removeClass("alert2");
				$(this).next().css("background","");
			}
		})
		$(".yzm input").blur(function(){
			$(this).next().next().css("display","none");
			$(this).css("border","1px solid #ddd");
			if(this.value!=""){
				fg=true;
			}
		})
		$(".tjwc a").click(function(){
			if($(".xykh input").val()==""){
				fg=false;
				$(".xykh input").next().html("请输入信用卡号");
				$(".xykh input").next().css("display","");
				$(".xykh input").css("border","1px solid #ff6446");
			}
			/*if($(".sfzh input").val()==""){
				fg=false;
				$(".sfzh input").next().html("请输入身份证号");
				$(".sfzh input").next().css("display","");
				$(".sfzh input").css("border","1px solid #ff6446");
			}*/
			if($(".yxcxa").html()==""){
				fg=false;
				$(".yxcxa").next().html("请选择意向车型");
				$(".yxcxa").next().css("display","");
				$(".yxcxa").css("border","1px solid #ff6446");
			}
			if($(".gccsa").html()==""){
				fg=false;
				$(".gccsa").parent().next().html("请选择购车城市");
				$(".gccsa").parent().next().css("display","");
				$(".gccsa").css("border","1px solid #ff6446");
			}
			if($(".xm input").val()==""){
				fg=false;
				$(".xm input").next().html("请输入姓名");
				$(".xm input").next().css("display","");
				$(".xm input").css("border","1px solid #ff6446");
			}
			if($(".sjh input").val()==""){
				fg=false;
				$(".sjh input").next().html("请输入手机号");
				$(".sjh input").next().css("display","");
				$(".sjh input").css("border","1px solid #ff6446");
			}
			if($(".yzm input").val()==""){
				fg=false;
				$(".yzm input").next().next().html("请输入验证码");
				$(".yzm input").next().next().css("display","");
				$(".yzm input").css("border","1px solid #ff6446");
			}
			


			if(fg){
				tools.$ajax({
					url:checkValidateCodeUrl,
					data:{ __RequestVerificationToken:token, mobile:$(".sjh input").val(), validatecode:$(".yzm input").val(), line:BusinessLine },
					async:false,
					success:function(res)
					{

						//添加埋点
						try {
							bc.evt.send('mobile', 'chkcode', $(".sjh input").val())
						}
						catch (err) { }
						if(res.Result==false)
						{
							fg = false;	
							$(".yzm input").next().next().html("验证码不正确");
							$(".yzm input").next().next().css("display","");
							$(".yzm input").css("border","1px solid #ff6446");
						}else{
							fg=true;
							$(".yzm input").next().next().css("display","none");
							$(".yzm input").css("border","1px solid #ddd");
						}
					}
				});
			}

			if(!$(".tycd input")[0].checked && fg){
				fg=false;
				$(".cdfwtk-con").css("top",($(window).height()-$(".cdfwtk-con").height())/2+$(window).scrollTop());
				$(".cdfwtk-con").css("left",($(window).width()-$(".cdfwtk-con").width())/2+$(window).scrollLeft());
				$("#maskLayer").css("display","block");
				$(".cdfwtk-con").css("display","block");
			}

			if(fg){
				 try {
                  //添加埋点
                  bc.evt.send('mobile', 'sbtclk',$(".sjh input").val(), '1', '信用卡直通PC订单提交成功')
              } catch (err) { }

				$(".xykztc form")[0].submit();
			}

		})
		var ff=true;
		$(".yzm a").click(function(){
			var _this=this;
		    if(!check.isPhoneNumber($(".sjh input").val()))
		    {
				$(".sjh input").next().html("手机号错误");
				$(".sjh input").next().css("display","");
				$(".sjh input").css("border","1px solid #ff6446");
				return;
		    }
			if(!ff){
				return;
			}
			ff=false;
			tools.$ajax({
				url:getValidateCodeUrl,
				data:{ __RequestVerificationToken: token, codelen:4, mobile:$(".sjh input").val(),line:BusinessLine  },
				success:function(res){
				//添加埋点
				try {
					bc.evt.send('mobile', 'codeclk', $(".sjh input").val())
				}
				catch (err) {}
					if(res.Result=="False")
					{
						//if(console) console.log(res.Message);
					}
				}

			});
			var _tt=60;
			$(this).css("background-color","#ccc");
			$(this).html(_tt+"秒后获取");
			var tt=setInterval(function(){
				_tt--;
				if(_tt<1){
					clearInterval(tt);
					$(this).css("background-color","#ff6d50");
					$(_this).html("获取校验码");
					ff=true;
				}else{
					$(_this).html(_tt+"秒后获取");
				}
			},1000)
		})

		$(".tybtj a").click(function(){
			$(".tycd input")[0].checked=true;
			fg=true;
			$(".tjwc a").click();
		})
		$(".cdfwtk a").click(function(){
			$(".tycd input")[0].checked=false;
			fg=true;
			$("#maskLayer").css("display","none");
			$(".cdfwtk-con").css("display","none");
		})

		var footSwiper = new Swiper('#footSwiper',{
		    paginationClickable: true,
		    slidesPerView: 8,
		    slidesPerGroup:8,
		    speed: 800,
		    loop: true
	  	})
	  	$('.zyz').on('click', function(e){
		    e.preventDefault();
		    footSwiper.swipePrev();
	  	});
	  	$('.zyy').on('click', function(e){
		    e.preventDefault();
		    footSwiper.swipeNext();
	  	});
	}
}

ccl.init();