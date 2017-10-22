'use strict';


//引用变量
import app from './app';

function loadUserInfo() {
    console.log('app-preload:start loadUserInfo');
    return new Promise((resolve, reject) => {

        setTimeout(function() {
            console.log('app-preload:end loadUserInfo');
            resolve();
        }, 1500);

    });
}

function loadAppConstant() {
    console.log('app-preload:start loadAppConstant');
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            console.log('app-preload:end loadAppConstant');
            resolve();
        }, 800);

    });
}

function loadChartData() {
    console.log('app-preload:start loadChartData');
    return new Promise((resolve, reject) => {

        setTimeout(function() {
            console.log('app-preload:end loadChartData');
            resolve();
        }, 1000);

    });
}


module.exports = {
    ershoucheAPI: '',
    xincheAPI: '',
    initStore: function() {
        var tasks = [];
        tasks.push(loadUserInfo());
        tasks.push(loadAppConstant());
        tasks.push(loadChartData());
        return Promise.all(tasks);
    },

    /**
     * 花小钱开好车
     * 参数:cityId
     * @return Promise
     */
    getMoreCarList: function(cityId) {
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.ershoucheAPI + 'Interface/GetSmallUcarlist?cityId=' + cityId,
                type: 'GET',
                callback: function(result) {
                    resolve(result);
                },
                errorCallback: function() {
                    reject();
                }
            });

        })
    },
    /**
     * 最近成交
     * 参数:cid, Pindex,Psize,SoldOrUnSold
     * @return Promise
     */
    getIndexCarList: function(params) {
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.ershoucheAPI + 'Interface/GetCarList',
                type: 'POST',
                data: params,
                callback: function(result) {
                    resolve(result);
                },
                errorCallback: function() {
                    reject();
                }
            });
        })
    },



    /**
     * 易问答-点赞接口 
     * 参数:questionId,agreeUserId,deviceId
     * @return Promise
     */
    clickAgree: function(params) {
        var _this = this;
        return new Promise((resolve, reject) => {
            // app.ajax({
            //     url: '/ClickAgree',
            //     type: 'GET',
            //     callback: function (result) {
            //         resolve(result);
            //     },
            //     errorCallback: function () {
            //         reject();
            //     }
            // });
            resolve({ "Result": true, "Message": "", "Data": 1, "RowCount": 1 });
        });
    },

    /**
     * 列表list数据
     * 参数:questionId,agreeUserId,deviceId
     * @return Promise
     */
    getCarList: function(params) {
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.ershoucheAPI + 'UcarListPartialView',
                data: params,
                type: 'GET',
                dataType: "html",
                callback: function(result) {
                    resolve(result);
                },
                errorCallback: function() {
                    reject();
                }
            });

        });
    },

    /**
     * 易问答-list
     * 参数:questionId,agreeUserId,deviceId
     * @return Promise
     */
    getExpertAndQuestionAnswerByExpertId: function(expertId, pageIndex, pageSize, orderBy, userId) {
        return new Promise((resolve, reject) => {});
    },



    /**
     * 详情页面----获取套餐列表，未展开的list GET
     * 参数:carid,carPrice,cityid
     * @return Promise
     */
    getPackageList: function(params) {
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.ershoucheAPI + 'Interface/GetPackageList',
                type: 'GET',
                data: params,
                callback: function(result) {
                    resolve(result);
                },
                errorCallback: function() {
                    reject();
                }
            })

        })
    },

    /**
     * 详情页面----获取套餐详情（根据列表ID）GET
     * 参数:packageId
     * @return Promise
     */
    getSecondCarFinanceInfo: function(packageId) {
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.xincheAPI + 'Product/Get/' + packageId + '/?checkAvailability=false',
                type: 'GET',
                isAllUrl: true,
                callback: function(result) {
                    resolve(result);
                },
                errorCallback: function() {
                    reject();
                }
            })

        })
    },

    /**
     *  详情页面----计算首付，贷款额度接口（根据获取套餐详情参数）GET
     * 参数:carPrice,Period,Rate,PackageID
     * @return Promise
     */
    getDownpayAndMonthpay: function(params) {
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.ershoucheAPI + 'Interface/GetDownpayAndMonthpay',
                type: 'GET',
                data: params,
                callback: function(result) {
                    resolve(result);
                },
                errorCallback: function() {
                    reject();
                }
            })

        })
    },

    /**
     *   贷款顾问 [adviserApi + "adviser/" + city.cityId + "/" + companyID + "/"] GET
     * 参数:carPrice,Period,Rate,PackageID
     * @return Promise
     */
    adviser: function(cityId, companyID) {
        var _this = this;
        return new Promise((resolve, reject) => {})
    },
    /**
     *   获取明细信息
     * 参数:carPrice=3.5&Period=24&Rate=0.5&packageID=4183
     * @return Promisehttp://192.168.145.9:8040/
     */
    calculateLoanInfo: function(params) {
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.xincheAPI + 'Product/Calculation/?checkAvailability=false',
                data: params,
                type: 'POST',
                callback: function(result) {
                    resolve(result);
                },
                errorCallback: function() {
                    reject();
                }
            })
        })
    },
    /**
     *   获取车类型list
     * 参数: onlyOnSale: true,  type: 'xinche'
     * @return Promise
     */
    getRecommendCarMasterBrands: function(params) {
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.xincheAPI + 'carrecommend/GetRecommendCarMasterBrands',
                data: params,
                type: 'GET',
                callback: function(result) {
                    resolve(result);
                },
                errorCallback: function() {
                    reject();
                }
            })
        })
    },
    /**GetUcarSum(ViewCarParam Param)
     *   获取车类型list--OpstionView--
     * 参数:data: {
                cid: data.cid, //data.cid, //城市
                pid: data.pid, //data.pid, //城市
                Carlevelid: data.Carlevelid, //级别
                Mbid: data.Mbid,  //品牌
                Brandid: data.Brandid, //车系
                Year: data.Year, //车辆年限
                Lmili: data.Lmili, //里程
                downpay: data.downpay, //首付
                mouthpay: data.mouthpay, //月供
                Pindex: data.Pindex * 10, //pindex, //当前页
                Psize: data.Psize, //当前页显示的数据
                orderId: data.orderId, // 排序
                productId: data.productId,
                carPrice: data.carPrice,
                SoldOrUnSold: data.SoldOrUnSold// 车源类别:SoldOrUnSold（  0：未售    1：已售   -1 : 空为不限）,
                ordernum: data.ordernum
     * @return Promise
     */
    GetUcarSum: function(params) {
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.ershoucheAPI + 'Interface/GetUcarConditionSum',
                data: params,
                type: 'post',
                callback: function(result) {
                    resolve(result);
                },
                errorCallback: function() {
                    reject();
                }
            })
        })
    },

    /**
     *  详情页面----获取税率表格-ershouche
     * 参数:carPrice,Period,Rate,PackageID
     * @return Promise
     */
    calculation: function(params) {
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.ershoucheAPI + 'Interface/CalculateLoanInfoByProductId',
                type: 'GET',
                data: params,
                callback: function(result) {
                    resolve(result);
                },
                errorCallback: function() {
                    reject();
                }
            })

        })
    },
    /**
     *  最新成交 or 更多推荐
     * 参数:cityId=201&UCarId=11744626&productId=0&DisplayPrice=3.5&MainBrandID=159&SoldOrUnSold=1
     * @return Promise
     */
    getRecommendCarList: function(params) {
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.ershoucheAPI + 'interface/GetRecommendCarList',
                data: params,
                type: 'GET',
                callback: function(result) {
                    resolve(result);
                },
                errorCallback: function() {
                    reject();
                }
            })
        })
    },
    /**
     * 获取金融产品
     * carid=105218&carPrice=21.5&cityid=201&productid=3977
     * @return Promise
     */
    GetPackageListWithProduct: function(params) {
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.ershoucheAPI + 'interface/GetPackageListWithProduct',
                data: params,
                type: 'POST',
                callback: function(result) {
                    resolve(result);
                },
                errorCallback: function() {
                    reject();
                }
            })
        })
    },
    /**
     * 获取金融产品
     * carid=105218&cityid=201&carPrice=21.5&down=0.3&repriod=36
     * @return Promise
     */
    GetPackageListWithDownRepriod: function(params) {
        var _this = this;
        return new Promise((resolve, reject) => {
            app.ajax({
                url: _this.ershoucheAPI + 'interface/GetPackageListWithDownRepriod',
                data: params,
                type: 'POST',
                callback: function(result) {
                    resolve(result);
                },
                errorCallback: function() {
                    reject();
                }
            })
        })
    }
}