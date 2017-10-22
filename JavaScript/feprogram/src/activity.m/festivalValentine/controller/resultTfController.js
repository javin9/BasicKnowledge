import service from '../service/service'
import tpl from '../template/template'
import {proxy, getElement} from '../util/util'
import store from '../store/store'
import BaseController from './baseController'

export default class ResultController extends BaseController{
  constructor () {
    super()

    this.view = 'result'

    this.ref = {
      btnTijiao: '.tijiao',
      btnYixuan: '.yixuan',
      btnFanhui: '.btn-fanhui',
      btnChakan: '.btn-chakan',
      btnBless: '.btn-only',
      domOther: '#other-wrapper',

      attrOrders: 'data-orders',
      uf: '.uf',
      textSupplied: '&radic; 已申请',

      APP_COOKIE:'YiXinAppInfo',
      APP_ACTION: 'payResultAction',
      APP_ACTION_ORDER: 'goOrder',
      APP_ACTION_HOME: 'goHome'
    }
  }

  render(){
    this.showPage(this.view)
    this.bindFnButtonEvent()
    service.get_similar_products_getting(res => {
      // console.log(res);
      for(let i=0;i<res.Data.length;i++){
          if(res.Data[i].Product.MultiLabel||res.Data[i].Product.PackageGiftValueAmount){
            res.Data[i].Product.isUl = true;
          }else{
            res.Data[i].Product.isUl = false;
          }
      }
      
      res.Result && getElement(this.ref.domOther).html(tpl.other(this.getOtherTemplateParams(res)))
      proxy(this.ref.btnTijiao, e => {
        const target = $(e.currentTarget)

        if (target.find(this.ref.btnYixuan).length) {
            return false
        }
        store.order_ID = target.attr(this.ref.attrOrders)
        isLoggedIn = true
        service.post_creating(res => {
          
            if (res.Result) {
                target.find(this.ref.uf).html(this.ref.textSupplied)
                target.find(this.ref.uf).addClass(this.ref.btnYixuan.substring(1)).removeClass(this.ref.uf.substring(1))
            } else {
                tools.showAlert(res.Message)
            }
        })
      })
    })

    this.labelBoxRender()
  }

  getOtherTemplateParams(res){
    return {...res, other:true, newversion: false,shouldShowLinks:!shouldHideLinks} || {other:true,shouldShowLinks:!shouldHideLinks, zy: zy}
  }

  bindFnButtonEvent(){
    const _isApp = tools.getCookie(this.ref.APP_COOKIE)

    proxy(this.ref.btnFanhui, () => {
        if(_isApp){      
            tools.jsNativeBridge(this.ref.APP_ACTION, this.ref.APP_ACTION_HOME)
            return
        }else{
            location.href = home_page_url
        }
        
    })

    proxy(this.ref.btnChakan, () => {
        if(_isApp){      
             tools.jsNativeBridge(this.ref.APP_ACTION, this.ref.APP_ACTION_ORDER)
            return
        }else{
            location.href = usercenter_url
        }
    })

    proxy(this.ref.btnBless, () => {
      location.href = activity_url + '?v=' + store.EnOrder; // 需加密
    })
  }

    labelBoxRender(){
        // console.log(Product.MultiLabel);
    }
}