'use strict';

import '../css/ershouche.scss'
import './detail.scss'
import 'libs/swiper';
import app from '../script/app';
import XTK from '../script/XTK';
import Store from '../script/Store';
import YXSlider from 'libs/yxSlider';
import Vue from 'vue'
import VueResource from 'vue-resource'
import Package from './package.vue'
import Description from './Description.vue'
import Bottombtn from '../components/bottombtn.vue'
import List from '../components/list.vue'
import Loan from './loan.vue'
import Info from './info.vue'
Vue.use(VueResource)

const detail_vm = new Vue({
    el: '#app',
    props: {},
    data() {
        return {
            viewPackageInfo: {
                downPayment: packageInfo.downPayment,
                downPaymentRate: packageInfo.downPaymentRate,
                repaymentPeriod: packageInfo.repaymentPeriod,
                monthlyPayment: packageInfo.monthlyPayment,
                orderNumber: packageInfo.orderNumber,
                carImg: packageInfo.carImg,
                name: packageInfo.name,
                price: packageInfo.price, //车主报价
                newCarPrice: packageInfo.newCarPrice, //新车含税
                intervalPrice: packageInfo.intervalPrice,
                packageName: packageInfo.packageName,
                IsGuZhi: packageInfo.IsGuZhi
            },
            bottombtn: {
                src: packageInfo.carImg, // 展示车图连接
                paydown: '0元', // 首付价格(此处只是展示,未做任何处理,请算好数值加上单位传过来)
                monthly: '0元', // 月供价格(此处只是展示,未做任何处理,请算好数值加上单位传过来)
                tel: '', // 顾问电话 (无贷款顾问时清传 tel:'' )
            },
            sourceidone: 1171, //同车系 source id
            sourceidtwo: 1170, //同价位 source id
            prosize: 4, //请求多少条
            cityid: 201, //城市ID
            car: car,
            isShowPackage: false,
            isShowDescription: false,
            isShowBtn: false,
            select_sortIsShow: false,
            select_sfIsShow: false,
            select_qxIsShow: false,
            package_list: [],
        }
    },
    components: { Package, Bottombtn, List, Description, Loan, Info },
    methods: {
        backList() {
            history.go(-1);
        },
        loadViewDom() {
            var isApp = Boolean(tools.isWebView() == 'yixinbjapp');
            if (isApp) {
                $('#cheliang').hide();
                tools.jsNativeBridge('getTitle', '二手车详情页');
            }
            let _this = this;
            //<!--产品图 swiper start-->
            const mySwiper = new Swiper('#detailSwiper .swiper-container', {
                loop: true,
                pagination: '#detailSwiper .swiper-pagination',
                paginationType: 'fraction',
                //new add
                autoplayDisableOnInteraction: false,
                observer: true,
                observeParents: true,
                onSlideChangeEnd: function(swiper) {
                    swiper.update();
                },
            })
            $('.car-desc').on('click', () => {
                this.isShowPackage = true;
            });

            $('#ShowDescription').on('click', () => {
                this.isShowDescription = true;
            });
        },
        closePackage() {
            this.isShowPackage = false;
        },
        closeDescription() {
            this.isShowDescription = false;
        },
        //贷款顾问
        loanAdviser() {
            var self = this;
            var _url = adviserApi + "v2/group/getadviserlist?CityId=" + cityInfo.localCityId + "&CompanyIds=" + companyID + "&BusinessLineId=551";
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
        scrollTo(id) {
            var _id = document.getElementById(id);
            window.scrollTo(0, _id.offsetTop);
        },
        toCarParam() {
            this.applyNow();
            let orderParams = '&Orders=' + product.packageID + "_" + product.productID + "_0" + '&CarPrice=' + ershoucheCar.price + '&Source=' + source + '&Channel=' + channel + '&From=' + fromTxt + '&UcarId=' + ershoucheCar.id;
            location.href = carParamUrl + '?carid=' + car.carId + '&cityid=' + cityInfo.localCityId + '&src=' + this.bottombtn.src + '&paydown=' + this.bottombtn.paydown + '&monthly=' + this.bottombtn.monthly + '&tel=' + this.bottombtn.tel + orderParams;
        },
        applyNow() {
            $("#orderInfoForm").find('input[name="Orders"]').val(product.packageID + "_" + product.productID + "_0");
            $("#orderInfoForm").find('input[name="CarId"]').val(car.carId);
            $("#orderInfoForm").find('input[name="CityId"]').val(cityInfo.localCityId);
            $("#orderInfoForm").find('input[name="CarPrice"]').val(ershoucheCar.price);
            $("#orderInfoForm").find('input[name="Source"]').val(source);
            $("#orderInfoForm").find('input[name="Channel"]').val(channel);
            $("#orderInfoForm").find('input[name="From"]').val(fromTxt);
            $("#orderInfoForm").find('input[name="UcarId"]').val(ershoucheCar.id);

        },

    },
    watch: {},
    events: {

    },
    created() {},
    ready() {
        this.isShowBtn = true;
        this.loadViewDom();
        this.loanAdviser();
    },
});