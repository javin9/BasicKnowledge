import service from '../service/service'
import tpl from '../template/template'
import {proxy, getElement} from '../util/util'
import store from '../store/store'
import BaseController from './baseController'

export default class ResultController extends BaseController{
  constructor () {
    super();

    this.view = 'result';

    this.ref = {
      btnTijiao: '.tijiao',
      btnYixuan: '.yixuan',
      btnFanhui: '.btn-fanhui',
      btnChakan: '.btn-chakan',
      domOther: '#other-wrapper',
      domQalist: '#qa-wrapper',

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
    this.showPage(this.view);
    this.bindFnButtonEvent();

    /* service.get_similar_products_getting(res => {
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
        store.ordersFirst = target.attr(this.ref.attrOrders)
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
    }); */

    // 帮助中心
    service.get_qa_list_getting(res => {
        if (res.Result) {
            var questionType = [
                {name: '常见问题', hash: '#common'},
                {name: '关于资质问题', hash: '#about'},
                {name: '下单流程问题', hash: '#order'},
                {name: '审批流程问题', hash: '#approval'}
            ];
            var data = {
                questionTitle: questionType[res.Data.QuestonType].name,
                moreUrl: res.Data.MoreUrl + questionType[res.Data.QuestonType].hash,
                questions: res.Data.Questions
            };
            getElement(this.ref.domQalist).html(tpl.qa(data));
        }
    });

    this.labelBoxRender();
  }

  /* getOtherTemplateParams(res){
    return {...res, other:true, newversion: false} || {other:true}
  } */

    bindFnButtonEvent(){
        const _isApp = tools.getCookie(this.ref.APP_COOKIE);

        proxy(this.ref.btnFanhui, () => {
            if(_isApp){
                tools.jsNativeBridge(this.ref.APP_ACTION, this.ref.APP_ACTION_HOME);
            }else{
                location.href = xin_che_url
            }
        });

        proxy(this.ref.btnChakan, () => {
            if(_isApp){
                 tools.jsNativeBridge(this.ref.APP_ACTION, this.ref.APP_ACTION_ORDER);
            }else{
                location.href = user_center_url
            }
        });
    }

    labelBoxRender(){
        // console.log(Product.MultiLabel);
    }
}