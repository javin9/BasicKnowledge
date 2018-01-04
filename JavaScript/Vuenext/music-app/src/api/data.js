import { ERR_OK, commonParams, options } from 'api/config.js';
import { ajax, jsonp } from 'common/js/ajax.js';
import {hotsongs} from 'data/data.js'

const API = {
  "recommend": 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
  "hotsong": 'http://vuemusic.t.imooc.io/api/getDiscList'
}

export function getRecommend() {
  var data = Object.assign({}, commonParams, {
    uid: 0,
    needNewCode: 1
  });
  return jsonp(API.recommend, data, options);
}

export function getHotSongs() {
  return new Promise((resolve,reject)=>{
  	 console.log(hotsongs)
         resolve(hotsongs);
  });
}
