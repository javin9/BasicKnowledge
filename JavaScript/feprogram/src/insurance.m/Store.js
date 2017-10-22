'use strict';


//引用变量
import app from './app';
function loadUserInfo() {
    console.log('app-preload:start loadUserInfo');
    return new Promise((resolve, reject) => {

        setTimeout(function () {
            console.log('app-preload:end loadUserInfo');
            resolve();
        }, 1500);

    });
}

function loadAppConstant() {
    console.log('app-preload:start loadAppConstant');
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            console.log('app-preload:end loadAppConstant');
            resolve();
        }, 800);

    });
}

function loadChartData() {
    console.log('app-preload:start loadChartData');
    return new Promise((resolve, reject) => {

        setTimeout(function () {
            console.log('app-preload:end loadChartData');
            resolve();
        }, 1000);

    });
}
module.exports = {
    // insuranceAPI:'http://192.168.154.242:805',
    // insuranceAPI:'http://192.168.151.60',
    insuranceAPI:'',
    initStore: function () {
        var tasks = [];
        tasks.push(loadUserInfo());
        tasks.push(loadAppConstant());
        tasks.push(loadChartData());
        return Promise.all(tasks);
    },
    GetIpCityInfo: function (params) {//根据城市ID获取城市信息
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceCity/GetIpCityInfo',
                data:params,
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
     * 根据城市名称查询城市信息
     * 参数:Query
     * @return Promise
     */
    GetQueryCitiesInfo: function (params) {//根据城市ID获取城市信息
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceCity/GetQueryCitiesInfo',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   GetPreferentialPolicy: function (params) {//获取对于城市的保险公司优惠信息
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceApi/GetPreferentialPolicy',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   GetCityInfoList: function (params) {//获取全部城市列表
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceCity/GetCityInfoList',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   GetMHotCitiesInfo: function (params) {//获取热门城市（保险公司）
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceCity/GetMHotCitiesInfo',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   GetHotCitiesInfo: function (params) {//获取热门城市
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceCity/GetHotCitiesInfo',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
    },
    GetCityAllInfo: function (params) {//选择某个城市下的区县
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceCity/GetCityAllInfo',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
    },
    GetCountries: function (params) {//获取点击城市的区县信息
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceCity/GetCountries',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   GetRegionByRegionid: function (params) {//根据城市国标码查询城市信息
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceCity/GetRegionByRegionid',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   GetRegion: function (params) {//根据易车城市编码查询城市信息
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceCity/GetRegion',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   GetInsureRegionByGbcode: function (params) {//验证城市是否能投保
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceApi/GetInsureRegionByGbcode',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   GetInsuredGiftTag: function (params) {//投保礼显示控制
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceApi/GetInsuredGiftTag',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   GetVerifyCode: function (params) {//获取验证码
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceApi/GetVerifyCode',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   CheckVerifyCode: function (params) {//验证验证码
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceApi/CheckVerifyCode',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   SaveFieldBasicInfo: function (params) {//买车险页面按字段保存
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceApi/SaveFieldBasicInfo',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   SaveFieldVehicleInfo: function (params) {//填信息页面按字段保存
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceApi/SaveFieldVehicleInfo',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   GetInsuranceBasicInfo:function(params){//投保流程获取用户信息
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceApi/GetInsuranceBasicInfo',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   SendMessage:function(params){//发送短信
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceApi/SendMessage',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   AddInsuranceBasicInfo:function(params){//填信息页面数据保存
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceApi/AddInsuranceBasicInfo',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   UpdateInsuranceBasicInfo:function(params){//买车险页面数据保存
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceApi/UpdateInsuranceBasicInfo',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   RenewalConfirm:function(params){//续保验证身份证
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsureApi/RenewalConfirm',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   GetAgencyCode:function(params){//获取江苏验证码
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsureApi/GetAgencyCode',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   SelectCarModels:function(params){//搜索车型
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsureApi/SelectCarModels',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   VehicleModelQueryLy:function(params){//力扬解析车型
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceParity/VehicleModelQueryLy',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   SelectCarModels2:function(params){//搜索车型
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceApi/SelectCarModels2',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   UpdateOcr:function(params,id){//行驶证解析
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceApi/UpdateOcr',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   GetInsuranceStartDate:function(params,id){//获取用户起保日期
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceOrderDataCache/InsuranceOrderDataCache',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   SaveOrUpdateInsuranceFeesInfo:function(params,id){//保存险种数据
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsureApi/SaveOrUpdateInsuranceFeesInfo',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   GetInsuranceFeesResult:function(params,id){//获取报价信息
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsureApi/GetInsuranceFeesResult',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   GetInsurancePriceByOrderId:function(params,id){//获取默认报价
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceApi/GetInsurancePriceByOrderId',
                data:params,
                type: 'post',
                callback: function (result) {
                    resolve(result);
                },
                errorCallback: function () {
                    reject();
                }
            });
        })
   },
   GetEachInsuranceQuotesInfo:function(params,id){//获取修改报价
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.insuranceAPI+'/InsuranceApi/GetEachInsuranceQuotesInfo',
                data:params,
                type: 'post',
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

