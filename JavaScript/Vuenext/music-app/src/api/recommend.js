import {ERR_OK,API,commonParams,options} from 'api/config.js';
import {ajax,jsonp} from 'common/js/ajax.js'

export function getRecommend(){
  var data=Object.assign({},commonParams,{
      uid:0,
      needNewCode:1
    });
  return jsonp(API.recommend,data,options);
}