import './list.scss';
import check from 'libs/check';

$(function(){
    if (navigator.userAgent.toLowerCase().indexOf(' applewebkit/') <= -1) {
      $(".clame2Event").each(function() {
        tools.substringClame($(this), 100);
      });
    }
    check.telChannel('freeAdviceTel', 'freeMobile', BusinessLine, {
      'CityId': CityId,
      'CityText': CityName,
      'PageType': 9,//入口页类型 9-资质列表页
      'statisticalMarker': 'pc-zixun-list-freezx-tel-channel'
    });
  });