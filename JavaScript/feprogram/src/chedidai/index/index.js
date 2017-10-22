import './index.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import 'libs/jquery.nivo.slider'
import Product from './components/product'
import Evaluate from './components/evaluate'
import 'libs/home_page_ad'

class Page{
    constructor(){ 
        this.renderSlider()
        this.bindChangeCityForHeader()
        this.userStatusReady(() => {
          this.renderEvaluate()
          this.renderProduct()
        })
        this.bindEvents()
    }

    bindChangeCityForHeader(){
      window.selCityCallback = function (obj) {
        window.location.href = obj.url
      }
    }

    getLoginStatus(){
      return $(window).triggerHandler('getUserStatus')
    }

    userStatusReady(cb){
      if($(window).data('userStatusReady')){
        cb()
      }else{
        setTimeout(this.userStatusReady.bind(this, cb),100)
      }
    }

    /**
     * 渲染焦点图
     */
    renderSlider(){
        const opt = {
            effect: 'fade', 
            // 是否手动播放(false为自动播放幻灯片)
            manualAdvance: false, 
            //是否显示图片切换按钮(上/下页)
            directionNav: false,  
            // 显示序列导航
            controlNav: true     
        }

        $('.slider').nivoSlider(opt)
    }

    /**
     * 渲染放心贷
     */
    renderProduct(){
        ReactDOM.render(
          <Product loginStatus={this.getLoginStatus()}/>,
          document.querySelector('.product-content')
        )
    }

    /**
     * 渲染评估
     */
    renderEvaluate(){
        ReactDOM.render(
          <Evaluate loginStatus={this.getLoginStatus()}/>,
          document.querySelector('.evaluate-content')
        )
    }

    /**
     * 事件监听
     */
    bindEvents(){
      $(window).on('submit', (e, params) => {
        const userStatus = this.getLoginStatus()
        // 已登录状态不做登录操作，直接生成订单
        if(userStatus.login){
          $(window).trigger('generateOrder', params.generate)
        }else{
          // 未登录先登录后生成订单
          $.getJSON(`${window.loginApiUrl}?callback=?`, Object.assign({line:550}, params.login), res => {
            if(res.Result){
              $(window).trigger('generateOrder', params.generate)
            }else{
              tools.showAlert(res.Message)
            }
          })
        }
      })

      $(window).on('generateOrder', (e, params) => {
        $.post('/MortgageApply/GenerateOrder', params, res => {
          if(res.Result){
            if(dev){
              console.log('生成订单成功' + `/Mortgage/AdditionalInfo/${res.Data}/`)
            }else{
              window.location.href = `/Mortgage/AdditionalInfo/${res.Data}/`
            }
          }else{
            tools.showAlert(res.Message)
          }
        }, 'json')
      })
    }
}

new Page()