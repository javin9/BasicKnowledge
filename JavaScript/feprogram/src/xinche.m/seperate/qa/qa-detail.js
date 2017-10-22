import './qa.scss'
import 'zepto/src/touch'

var myHeader = {
  init: function() {
    // 导航menu
    var $navMenu = $('#navTips');
    $('#tools-nav').on('click',function (e) {
      $navMenu.toggleClass('hide');
    });

    $navMenu.on('click', function(e) {
      $navMenu.addClass('hide');
    });
    $navMenu.on('touchmove', function(e) {
      $navMenu.bind('touchend', function() {
        $navMenu.addClass('hide');
        $navMenu.unbind('touchend');
      });
    });
  }
};

$(function() {
  myHeader.init();
});