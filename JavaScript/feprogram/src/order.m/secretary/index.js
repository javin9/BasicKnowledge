import 'animate.css'
import './css/index.scss'
import Vue from 'vue'
import VueResource from 'vue-resource'
import carSelector from 'libs/vue-components/car-selector'
import ko from 'knockout'
import store from './store/store'
import SecretaryView from './store/products'
import tpl from './template/template'
import ChattingController from './controller/chattingController'
import OrderController from './controller/orderController'
import ResultController from './controller/resultController'
import {getElement} from './util/util'
import hideType from 'libs/hideType'

Vue.use(VueResource)

const [pageContainer, wrapper] = ['.page-container', '#SecretaryMain'];

// 皮肤id和类名映射
const SKINS = {
    0: 'theme-default',
    1: 'theme-default theme-car-festival-66'
};

const Dispatcher = {
    run(){
        this.render();
        this.bindEvent();
        ko.applyBindings(SecretaryView);

        store.vueInstance = new Vue({
            el: '#SecretaryMain',
            data: {
                selectCarCallback(){}
            },
            components: {
                carSelector
            },
        })

        // 本地测试
        if(dev){
            // store.data = {BuyCarCityID : "2401", CarId : 115867, CarPrice : "810", Career : "75", CityId : "2401", Credit : "70", DownPaymentRate : "0.3", Funds : "", HouseState : "80", Income : "108", Insurance : "", RepaymentPeriod:"36"}
            this.goToPage('chatting');
            // this.goToPage('order');
            // this.goToPage('result');
            return false
        }
        
        this.goToPage('chatting');
    },

    // 是否可以切换(显示)页面
    dispatchReady: true,

    render(){
        getElement(wrapper).append(tpl.layout({
            isLoggedIn,
            isAuthenticated,
            mobile,
            userName,
            showingMobile: typeof window.showingMobile !== 'undefined' ? showingMobile : '',
            showingUserName: typeof window.showingUserName !== 'undefined' ? showingUserName : '',
            data: qualifications || {},
            tf: typeof window.tfPageNumber !== 'undefined' && window.tfPageNumber,  // 是否是投放页
            tftype: typeof window.tfPageNumber !== 'undefined' && window.tfPageNumber ? window.tfPageNumber : undefined, // 投放页类型
            isTf2: typeof window.tfPageNumber !== 'undefined' && window.tfPageNumber === 2, // 是否是投放页2
            tfintro: '<em>【我们是谁】</em>易鑫车贷是由腾讯、京东、百度、易车共同投资的互联网汽车金融平台，为您提供全面的线上汽车金融产品和服务', // 投放页顶头文案
            shouldShowLinks: typeof window.shouldShowLinks !== 'undefined' ? shouldShowLinks : true,   // 58同城渠道号（from=775），左上角Logo不可点，结果页没有跳转按钮
            c2c: c2bConfigInfo.IsC2CEnabled,
            activity: c2bConfigInfo.ActivityPic || c2bConfigInfo.ActivityContent,
            activityPic: c2bConfigInfo.ActivityPic || '',
            modalPic: c2bConfigInfo.ToastPic,
            modalText: c2bConfigInfo.RedirectText,
            activityContent: c2bConfigInfo.ActivityContent || '',
            guideContent: c2bConfigInfo.GuideContent || '',
            blockback: window.from === 775 // 58同城渠道号（from=775），左上角Logo不可点，结果页没有跳转按钮
        }));

        // 页头APP交互
        var _isApp = tools.getCookie('YiXinAppInfo');
        if(_isApp) {
            tools.jsNativeBridge('getTitle', $('header.header-bar .font-nav').text());
        }

        if (hideType.header) {
            $('header.header-bar').addClass('hide');
            $('#SecretaryMain').addClass('app');
        }

        // 皮肤链接
        getElement(wrapper).addClass(SKINS[c2bConfigInfo.SkinId]);
        switch (c2bConfigInfo.SkinId) {
            // 66购车节
            case 1: $('#firstContainer').append(
                        $('<a>', {
                            href: 'http://mai.m.yiche.com/index1.aspx?stime=2017-05-31T22:00:36',
                            class: 'activity-link'
                        })
                    );
                    break;
            default:
                    break;
        }
    },

    bindEvent(){
        const win = getElement(window);
        win.on('goToPage', (e,view) => this.goToPage(view));
        win.on('showPage', (e,view) => this.showPage(view));
        win.on('getDispatchStatus', () => {return this.dispatchReady});
        win.on('setDispatchStatus', (e, status) => this.dispatchReady = status);
    },

    controller: {
        result: new ResultController(),
        order: new OrderController(),
        chatting: new ChattingController()
    },

    goToPage(view){
        this.controller[view].render(this);
        $('#SecretaryMain').addClass(view);
    },

    showPage(view){
        getElement(pageContainer).hide().filter('[rel='+view+']').css('display', 'block').fadeIn();
        this.ready = false
    }
};

Dispatcher.run();