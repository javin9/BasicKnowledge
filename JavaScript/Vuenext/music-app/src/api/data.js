import { ERR_OK, commonParams, options } from 'api/config.js';
import { ajax, jsonp } from 'common/js/ajax.js';
import { hotsongs } from 'data/data.js'

const API = {
  "recommend": 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
  "hotsong": 'https://easy-mock.com/mock/59bf2621e0dc663341ad67cc/example/hotsongs',
  "hotSingers":'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
}

export function getRecommend() {
  var data = Object.assign({}, commonParams, {
    uid: 0,
    needNewCode: 1
  });
  return jsonp(API.recommend, data, options);
}

export function getHotSongs() {
  return ajax({
    url: API.hotsong,
    type: 'get'
  });
}
/*
?platform=h5&g_tk=5381&notice=0&format=jsonp&incharset=utf-8&outcharset=utf-8&uid=0&needNewCode=1&jsonpCallback=__jp0
?g_tk=1928093487&outCharset=utf-8&notice=0&format=jsonp&channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&hostUin=0&needNewCode=0&platform=yqq&jsonpCallback=__jp0
*/
export function getSingers() {
  var data=Object.assign({},commonParams,{
    uid: 0,
    needNewCode: 1,
    g_tk:1928093487,
    hostUin:0,
    channel:'singer',
    page:'list',
    key:'all_all_all',
    pagesize:100,
    pagenum:1,
    platform:'yqq'
  });
  return jsonp(API.hotSingers,data,options);
}
