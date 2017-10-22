<template>
    <div  v-show="isShowPackage" transition="fadeUp" class="all-package">
        <div v-show="isShowClose" class="package-colse" v-on:click="closePackage">
        </div>
        <div id="package" class="package">
            <div class="wrapper">
                <div class="package-info">
                    <div class="package-info-img">
                        <img src="http://img1.bitautoimg.com/chedai/35f66dd3-8cd6-48f3-bb83-801853ccd335.jpg">
                    </div>
                    <div class="package-info-desc">
                        <div class="package-info-desc-price">
                            首付 {{tomoney(viewPackageInfo.downPayment*10000)}}
                            <span></span>月供 {{tomoney(viewPackageInfo.monthlyPayment)}}
                        </div>
                        <div class="package-info-desc-text">已选:"首付{{viewPackageInfo.downPaymentRate*100}}%" "还款{{viewPackageInfo.repaymentPeriod}}期" "{{viewPackageInfo.packageName}}"</div>
                    </div>
                </div>
                <div class="package-tips">首付</div>
                <div class="package-shoufu" id="index_shoufu">
                    <a></a>
                </div>
                <div class="package-tips">期限</div>
                <div class="package-qixian" id="index_qixian">
                    <a></a>
                </div>
                <div class="package-tips">金融套餐</div>
                <div class="package-list">
                    <a v-for="(i,info) in package_list" v-bind:class="info.isSelect?' select':''" class="package-list-item" v-on:click="click_package(i,info)">
                        <div class="package-list-item-name">{{info.PackageName}}</div>
                        <div class="package-list-item-price">{{tomoney(info.MonthPaymentText)}}/月</div>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
import app from '../script/app';
import XTK from '../script/XTK';
import Store from '../script/Store';
import IScroll from 'iscroll'
import YXSlider from 'libs/yxSlider/click.m';
var myScroll;
var indexShouFu;
var indexYuegong;
Store.ershoucheAPI = ershoucheUrl;
Store.xincheAPI = xincheUrl;
export default {
    props: ['cardInfo', 'bottombtn', 'isShowPackage', 'closePackage', 'viewPackageInfo'],
    data() {
        return {
            isShowClose: false,
            package_list: [],
            maskLayer: $('#maskLayer'),

        }
    },
    watch: {
        isShowPackage(value) {
            const $body = $('body')
            const TOUCH_MOVE_EVENT = 'touchmove'
            if (value) {
                $body.bind(TOUCH_MOVE_EVENT, e => e.preventDefault())
                this.isShowClose = true
                this.showPackage();
            } else {
                this.isShowClose = false;
                $body.unbind(TOUCH_MOVE_EVENT)
                this.hidePackage();
            }
        }
    },
    events: {

    }
    ,
    methods: {
        tomoney(qian) {
            qian = (parseFloat(qian) / 10000);
            return (qian >= 1 ? qian.toFixed(2) + "万" : parseInt(qian * 10000) + '元')
        },
        showPackage() {
            this.maskLayer.show();
            this.maskLayer.on('touchmove', function (e) {
                e.preventDefault();
            });
            myScroll = new IScroll('#package', {
                'preventDefault': false,
                'bounce': false
            });

        },
        hidePackage() {
            this.maskLayer.hide();
            this.maskLayer.off('touchmove');
            this.closePackage();
        },
        loadDomEvent() {
            //financialIscroll.scrollToElement('#shortcontent' + id, 100);
            this.maskLayer.click(() => {
                this.hidePackage();
            })
        },
        //贷款顾问
        loanAdviser: function (cID) {
            var self = this;
            var _url = adviserApi + "v2/group/getadviserlist?CityId=" + cityInfo.localCityId + "&CompanyIds=" + cID + "&BusinessLineId=551";
            app.sendAjax({
                url: _url,
                dataType: 'jsonp',
            }, adviserList, sendAgain);

            //获取成功
            function adviserList(result) {
                if (result.Data != null && result.Data[0] != null) {
                    var ad = result.Data[0].Adviser;
                    self.bottombtn.tel = ad.CN400;
                }

            }
            // 出错后重新加载
            function sendAgain(info) {
                app.sendAjax({
                    url: _url,
                    dataType: 'jsonp'
                }, adviserList, sendAgain);
            };
        },
        //获取首付月供
        downPaymentPeriod: function () {
            indexShouFu = new YXSlider('index_shoufu', [
                { 'text': 20, 'isDisable': false, 'isDefault': true, 'unit': '%' }
            ], (data) => {
                this.loadData(data.ProductID, indexShouFu, indexYuegong);
            });

            indexYuegong = new YXSlider('index_qixian', [
                { 'text': 12, 'isDisable': false, 'isDefault': true, 'unit': '期' }
            ], (data) => {
                this.loadData(data.ProductID, indexShouFu, indexYuegong);
            });
            this.loadData(product.productID, indexShouFu, indexYuegong);
        },
        loadData: function (_productId, indexShouFu, indexYuegong, index) {

            var _this = this;
            Store.getSecondCarFinanceInfo(_productId).then((res) => {
                var shoufuList = [];
                var yuegongList = [];
                if (res.Result) {
                    //更改当前的产品ID，提交订单用
                    product.productID = _productId;

                    //构造首付数据
                    for (var i = 0; i < res.ProductDownpaymentrates.length; i++) {
                        var s = res.ProductDownpaymentrates[i];
                        var isDisable = false;
                        if (s.ProductID == _productId) {
                            isDisable = true;
                        }
                        if (SoldOrUnSold == '1') {
                            shoufuList.push({ 'text': s.DownPaymentRate * 100, 'isDisable': !isDisable, 'isDefault': isDisable, 'ProductID': s.ProductID });
                        } else {
                            shoufuList.push({ 'text': s.DownPaymentRate * 100, 'isDisable': !s.HasProduct, 'isDefault': isDisable, 'ProductID': s.ProductID });
                        }
                    }
                    //构造月供数据
                    for (var i = 0; i < res.ProductRepaymentperiods.length; i++) {
                        var s = res.ProductRepaymentperiods[i];
                        var isDisable = false;
                        if (s.ProductID == _productId) {
                            isDisable = true;
                        }

                        if (SoldOrUnSold == '1') {
                            yuegongList.push({ 'text': s.RepaymentPeriod, 'isDisable': !isDisable, 'isDefault': isDisable, 'ProductID': s.ProductID });
                        } else {
                            yuegongList.push({ 'text': s.RepaymentPeriod, 'isDisable': !s.HasProduct, 'isDefault': isDisable, 'ProductID': s.ProductID });
                        }
                    }
                    //重新绘制滚动轴
                    //new 完后至每次调用接口返回的数据在 update中更新
                    indexShouFu.update(shoufuList);
                    //new 完后至每次调用接口返回的数据在 update中更新
                    indexYuegong.update(yuegongList);

                    const params = {
                        carid: car.carId,
                        carPrice: ershoucheCar.price,
                        cityid: cityInfo.localCityId,
                        productid: _productId
                    }
                    Store.GetPackageListWithProduct(params).then((res) => {
                        if (res.Result) {
                            let list = res.Data;
                            for (let i = 0; i < list.length; i++) {
                                if (i == 0) {
                                    list[i].isSelect = true;
                                    _this.setLoadInfo(list[i]);
                                } else {
                                    list[i].isSelect = false;
                                }
                            }
                            this.package_list = list;
                            setTimeout(() => {
                                myScroll = new IScroll('#package', {
                                    'preventDefault': false,
                                    'bounce': false
                                });
                            }, 200)
                        } else {
                            this.package_list = [];
                        }
                    })
                }
            })
        },
        setLoadInfo(info) {
            this.bottombtn.paydown = this.tomoney(info.DownPaymentText);
            this.bottombtn.monthly = this.tomoney(info.MonthPaymentText);
            this.viewPackageInfo.downPayment = (parseFloat(info.DownPaymentText) / 10000);
            this.viewPackageInfo.monthlyPayment = info.MonthPaymentText;
            this.viewPackageInfo.downPaymentRate = info.DownPaymentRate;
            this.viewPackageInfo.repaymentPeriod = info.RepaymentPeriod;
            this.viewPackageInfo.packageName = info.PackageName;
            product.productID = info.ProductId;
            product.packageID = info.ID;

        }
        ,
        click_package(index, info) {
            this.loanAdviser(info.CompanyId);
            for (let i = 0; i < this.package_list.length; i++) {
                this.package_list[i].isSelect = false;
            }
            this.package_list[index].isSelect = true;
            this.setLoadInfo(info);
        }
    },
    ready() {
        this.loadDomEvent();
        this.downPaymentPeriod();
    }
    ,
    components: {

    }
}
</script>
