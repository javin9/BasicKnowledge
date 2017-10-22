'use strict';


//引用变量
import app from './app';

module.exports = {
    ershoucheAPI:'',
    xincheAPI:'',
     /**
     * 易问答-点赞接口 
     * 参数:questionId,agreeUserId,deviceId
     * @return Promise
     */
    clickAgree: function (params) {
        return new Promise((resolve, reject) => {
        });
       },
      
    
     /**
     * 易问答-list
     * 参数:questionId,agreeUserId,deviceId
     * @return Promise
     */
   getExpertAndQuestionAnswerByExpertId: function (params) {
        return new Promise((resolve, reject) => {
        });
       },
       
    /*
    用户评价
    */
    getPackageComment:function (params) {
        var _this=this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url:_this.ershoucheAPI +'PackageComment/Get',
                data:params,
                type: 'GET',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        });
       }

}