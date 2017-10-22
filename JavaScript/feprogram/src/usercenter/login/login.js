
  var LoginPage = function(){

  } 

  LoginPage.prototype = {
    init: function(){
      this.domInit();
    },
    domInit: function(){
      var self = this;
    	if(navigator.appName =="Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g,"")=="MSIE8.0") {
				$('#user-btn2').removeClass('disable');
				$('#user-btn1').removeClass('disable');
				$('#reg-btn').removeClass('disable');
			}
      var oldTarget = "2";
      $(".tab").click(function(e){
        if($(e.target).attr("id")==2){
                    $('.apart').addClass("hide");
        }else{
                    $('.apart').removeClass("hide");
        }
        if($(e.target).attr("id") != oldTarget){
          var id = $(this).attr("id");
          oldTarget = id;
          $(this).addClass("cur").siblings("aside").removeClass("cur");
          $("#tab"+id).removeClass("hide").siblings("blockquote").addClass("hide");
          // $("#tab"+id+" input").val("");

          $("#tab"+id+" #GetImgValidateCode"+id+" img").attr('src', '/Login/GetImageValidateCode?t='+ (new Date().getTime()));

          $("#form .jyts").hide();
          $("#user-btn"+id).removeClass("hide").siblings(".user-btn").addClass("hide");
          $("input[name='rememberMe']").prop("checked",false);
          clearInterval(window.tmo);
          $("#GetValidateCode").text("获取验证码");
        }
      })
    }
  }
  ////////////////////页面初始化
  $(function(){
    var loginPage = new LoginPage();
    loginPage.init();
  });

