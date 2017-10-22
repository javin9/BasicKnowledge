import 'animate.css'
import './tf.scss'
import ko from 'knockout'
import store from './store/store'
import SecretaryView from './store/products'
import tpl from './template/template'
import ChattingController from './controller/chattingTfController'
import OrderController from './controller/orderController'
import ResultController from './controller/resultTfController'
import {getElement} from './util/util'

const [pageContainer, wrapper] = ['.page-container', '#SecretaryMain']

const Dispatcher = {
    run(){
        this.render()
        this.bindEvent()

        ko.applyBindings(SecretaryView)

        // 本地测试
        if(dev){
            store.data = {BuyCarCityID : "2401", CarId : 115867, CarPrice : "810", Career : "75", CityId : "2401", Credit : "70", DownPaymentRate : "0.3", Funds : "1", HouseState : "80", Income : "108", Insurance : "1", RepaymentPeriod:"36"}
            this.goToPage('chatting')
            // this.goToPage('order')
            // this.goToPage('result')
            return false
        }
        
        this.goToPage('chatting')
    },

    // 是否可以切换(显示)页面
    dispatchReady: true,

    render(){
        getElement(wrapper).append(tpl.layout({cityName, isLoggedIn, isAuthenticated, mobile, userName, data: qualifications || {} ,tf:true,shouldShowLinks:!shouldHideLinks}))
    },

    bindEvent(){
        const win = getElement(window)
        win.on('goToPage', (e,view) => this.goToPage(view))
        win.on('showPage', (e,view) => this.showPage(view))
        win.on('getDispatchStatus', () => {return this.dispatchReady})
        win.on('setDispatchStatus', (e, status) => this.dispatchReady = status)
    },

    controller: {
        result: new ResultController(),
        order: new OrderController(),
        chatting: new ChattingController()
    },

    goToPage(view){
        this.controller[view].render(this)
    },

    showPage(view){
        getElement(pageContainer).hide().filter('[rel='+view+']').css('display', 'block').fadeIn()
        this.ready = false
    }
}

Dispatcher.run()