import './components/userComment/index.scss'

$('body').css('background','#fff')

$("a.backGoPage").on("click",function(){
  if (document.referrer.indexOf("/MyComment/UserComment") >= 0) {
    //用户评价
		window.history.go(-2);
		return false;
  } else if (document.referrer.indexOf("/MyComment/AdviserComment") >= 0) {
    //顾问评价
    window.history.go(-2);
    return false;
	}else {
		window.history.go(-1);
		return false;
	}
})