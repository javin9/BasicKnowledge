import './detail.scss';

$(function(){
  if (navigator.userAgent.toLowerCase().indexOf(' applewebkit/') <= -1) {
    $(".clame2Event").each(function() {
      tools.substringClame($(this), 100);
    });
  }
});