'use strict';


//引用变量
import app from './app';
module.exports = {
    /**
    * 获取产品列表
    * @param 无
    * @return Promise
    */
    GetProductList: function (_url) {
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _url,
                type: 'get',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        
        })
    },
    /**
     * 城市是否支持该套餐检验 
     * @param 参数:int packageId,int carId,int cityId
     * @return Promise
     */
    CheckProduct: function (_url, params) {
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _url,
                type: 'get',
                data: params,
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });

        })
    },
    /**
     * 立即申请 提交订单
     */
     Creating: function (_url, params) {
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _url,
                type: 'post',
                data: params,
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });

        })
    },
    /**
    * 获取订单列表
    * @param 无
    * @return Promise
    */
    GetRentCarLoanOrder: function () {
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                //http://192.168.148.146:8008
                url: '/Tencent/GetRentCarLoanOrder',
                type: 'get',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        
        })
    },

}

