import service from '../service/service'
import tpl from '../template/template'
import store from '../store/store'
import {getElement, getValidateElement, disabledSubmit, enabledSubmit, isDisabledSubmit, getValue, resetInput, throwError} from '../util/util'
import check from 'libs/check/m'
import BaseController from './baseController'

export default class OrderController extends BaseController{
  constructor () {
    super()

    this.view = 'order'

    this.ref = {
      CLASS_CLOSE : 'close',
      CLASS_VISIBLE: 'visible',
      CLASS_PANEL: 'panel',

      INT_VAL: 30,

      ALERT_TIME:2000,
      ALERT_STAY:1000,

      PHONE_LENGTH_LIMIT:11,
      CODE_LENGTH_LIMIT:6,

      closePanel: '.close-panel',
      result: '#result',
      tag: '#p_characteristic',
      warning: '.warning',
      skipCertificateLink: '#skip-certificate',
      textCertSuccess: '实名认证成功',
      textCertFail: '身份证与姓名不匹配',

      textSubmit: '立即申请',
      textCodeEmpty: '验证码为空',

      btnSubmit: '#submitBtn',
      btnTelSubmit: '#tel-submit',
      btnCertSubmit: '#certificate-submit',
      btnCode: '#getCodeBtn',
      btnEditTel: '#edit-tel-btn',

      panelCertificateName: 'certificate',
      panelPhoneName: 'edit-phone',

      // input
      inputName: '#Name',
      // 手机号
      inputTelphone: '#Telphone',
      // 修改手机号
      inputPhone: '#Phone',
      inputCheckCode: '#CheckCode',
      inputRealName: '#RealName',
      inputCertificate: '#CertificateNumber'
    }
  }

  render() {
    // 检测上以页面是否完全结束
    const readyCheck = () => {
        let intNum = setInterval(() => {
            if(this.getDispatchStatus()){
                clearInterval(intNum)
                this.showPage(this.view)
                this.bindFormEvent()
            }
        },this.ref.INT_VAL)
    }

    service.get_feaures_getting(res => {
      if (res.Result) {
          if(res.Data.Adviser){
              store.AdviserId = res.Data.Adviser.Id
          }
          if(res.Data.Product.MultiLabel||res.Data.Product.PackageGiftValueAmount){
            res.Data.Product.isUl = true;
          }else{
            res.Data.Product.isUl = false;
          }

          if( res.Data.ZY ){
            $('#successTopZy').show();
            $('#successTop').hide();
          } else {
            $('#successTopZy').hide();
            $('#successTop').show();
          }

          this.syncStoreOrders(res.Data.Properties.Orders)
          getElement(this.ref.tag).html('<i>[' + res.Data.Properties.Features.join(']</i>、<i>[') + ']</i>')
          getElement(this.ref.result).html(tpl.product(res.Data))    
          readyCheck()
      }else{
          // throwError(res.Message)
          tools.showAlert(res.Message)
          setTimeout(function(){
            location.reload();
          }, 3000);
      }
    })
  }

  panelControl(id){
    const hide = id === this.ref.CLASS_CLOSE
    const $panel = hide ? $('.' + this.ref.CLASS_PANEL + '.' + this.ref.CLASS_VISIBLE) : getElement('#' + id)
    if(hide){
        $panel.removeClass(this.ref.CLASS_VISIBLE)
    }else{
        $panel.addClass(this.ref.CLASS_VISIBLE)
    }
  }

  bindSubmitEvent(){
    const submitOrder = () => {
        disabledSubmit(this.ref.btnSubmit)
        getElement(this.ref.warning).hide()

        this.syncStoreData()

        service.post_creating(res => {
            if(!res.Result){
                enabledSubmit(this.ref.btnSubmit)
                tools.showAlert(res.Message)

                // 订单限制情况逻辑：
                // 不允许再修改手机号
                if(res.Data === 2 || res.Data === 3){
                    isLoggedIn = true
                    getElement(this.ref.inputCheckCode).closest('li').remove()
                    getValidateElement(this.ref.inputCheckCode).remove()
                    getElement(this.ref.btnCode).remove()
                    getElement(this.ref.inputTelphone).prop('disabled', true)
                }
                return false
            }
            mobile = getValue(this.ref.inputTelphone)
            store.userId = res.Data.UserId
            store.OrderId = res.Data.OrderId
            store.EnOrder = res.Data.EnOrder // 新加加密后的orderid
            isAuthenticated = res.Data.IsAuthenticated
            if (isAuthenticated) {
                this.goToPage('result')
            }else{
                this.panelControl(this.ref.panelCertificateName)
                getElement(this.ref.skipCertificateLink).click(() => this.goToPage('result'))
            }
        })
    }

    const submitHandler = () => {
        if(isDisabledSubmit(this.ref.btnSubmit)){
            return false
        }

        if(isLoggedIn){
            if(!store.validate.name){
                getValidateElement(this.ref.inputName).show()
                return false
            }
            submitOrder()
        }else if(store.validate.name && store.validate.telphone && store.validate.code){
            submitOrder()
        }else{
            !store.validate.name && getValidateElement(this.ref.inputName).show()
            !store.validate.telphone && getValidateElement(this.ref.inputTelphone).show()
            !store.validate.code && getValidateElement(this.ref.inputCheckCode).show()
        }
    }

    const telSubmitHandler = () => {

        if(isDisabledSubmit(this.ref.btnTelSubmit)){
            return false
        }

        if(!store.validate.phone && !dev){
            getValidateElement(this.ref.inputPhone).show()
            return false
        }

        if(!store.validate.code && !dev){
            getValidateElement(this.ref.inputCheckCode).show()
            return false
        }

        getElement(this.ref.warning).hide()
        disabledSubmit(this.ref.btnTelSubmit)
        service.switch_account( res => {
            resetInput(this.ref.inputPhone)
            resetInput(this.ref.inputCheckCode)
            enabledSubmit(this.ref.btnTelSubmit)
            if(res.Result){
                mobile = res.Data.Mobile
                this.panelControl(this.ref.CLASS_CLOSE)
                getElement(this.ref.inputTelphone).val(mobile)
            }else{
                tools.showAlert(res.Message)
            }
        },{mobile: getValue(this.ref.inputPhone), code: getValue(this.ref.inputCheckCode)})

        return false
    }

    const certSubmitHandler= () => {
        if(isDisabledSubmit(this.ref.btnCertSubmit)){
            return false
        }

        if(!store.validate.realName){
            getValidateElement(this.ref.inputRealName).show()
            return false
        }
        if(!store.validate.certificate){
            getValidateElement(this.ref.inputCertificate).show()
            return false
        }

        disabledSubmit(this.ref.btnCertSubmit)

        service.auth(res => {
            if(res.Result){
                tools.showAlert(this.ref.textCertSuccess, this.ref.ALERT_STAY)
                service.order_updating()
                setTimeout(() => this.goToPage('result'), this.ref.ALERT_TIME)
            }else{
                tools.showAlert(this.ref.textCertFail)
                enabledSubmit(this.ref.btnCertSubmit)
            }
        }, {realName: getValue(this.ref.inputRealName),IdNo:getValue(this.ref.inputCertificate),})
    }

    getElement(this.ref.btnSubmit).on('click', submitHandler)
    getElement(this.ref.btnTelSubmit).on('click', telSubmitHandler)
    getElement(this.ref.btnCertSubmit).on('click', certSubmitHandler)
  }

  bindFormEvent(){
    const [name, tel, phone, code, getCode, certificate, editTelBtn, realName] = [this.ref.inputName, this.ref.inputTelphone, this.ref.inputPhone, this.ref.inputCheckCode, this.ref.btnCode, this.ref.inputCertificate, this.ref.btnEditTel, this.ref.inputRealName]

    const fnLimitLength = (element, length) => {
        return () => {
            const value = element.val()
            if(value > length){
                element.val(value.slice(0, length))
            }
        }
    }

    getElement(name).blur(() => {
        if(!check.isName(getElement(name).val()))
        {
            getValidateElement(name).show()
            store.validate.name = false
        }
        else{ 
            getValidateElement(name).hide()
            store.validate.name = true
        }
    })

    getElement(realName).blur(() => {
        if(!check.isName(getElement(realName).val()))
        {
            getValidateElement(realName).show()
            store.validate.realName = false
        }
        else{ 
            getValidateElement(realName).hide()
            store.validate.realName = true
        }
    })

    getElement(certificate).blur(() => {
        if(!check.isID(getElement(certificate).val()))
        {
            getValidateElement(certificate).show();
            store.validate.certificate = false
        }
        else{ 
            getValidateElement(certificate).hide();
            store.validate.certificate = true
        }
    })
    
    // 手机号
    getElement(tel).blur(() => {
        if(!check.isPhoneNumber(getElement(tel).val()))
        {
            getValidateElement(tel).show()
            store.validate.telphone = false
        }
        else{ 
            getValidateElement(tel).hide()
            store.validate.telphone = true
        }
    })
    .on('input', fnLimitLength(getElement(tel), this.ref.PHONE_LENGTH_LIMIT))

    // 修改手机号
    getElement(phone)
        .blur(() => {
            if(!check.isPhoneNumber(getElement(phone).val()))
            {
                getValidateElement(phone).show()
                store.validate.phone = false
            }
            else{ 
                getValidateElement(phone).hide()
                store.validate.phone = true
            }
        })
        .on('input', fnLimitLength(getElement(phone), this.ref.PHONE_LENGTH_LIMIT))

    getElement(code)
    .blur(() => {
        if(getElement(code).val().trim().length === 0)
        {
            getValidateElement(code).text(this.ref.textCodeEmpty).show()
            store.validate.code = false
        }
        else{ 
            getValidateElement(code).hide()
            store.validate.code = true
        }
    })
    .on('input', fnLimitLength(getElement(code), this.ref.CODE_LENGTH_LIMIT))

    getElement(getCode)
    .click(() => {
        const telId = getElement(getCode).attr('rel')
        if(!getElement('#' + telId).val()){
            getValidateElement('#'+telId).show()
            return false
        }

        service.get_code(telId, getCode.substring(1))
    })

    getElement(editTelBtn).click(() => {
        this.panelControl(this.ref.panelPhoneName)
        return false
    })

    getElement(this.ref.closePanel).click(() => {
        this.panelControl(this.ref.CLASS_CLOSE)
    })

    this.bindSubmitEvent()
  }

  syncStoreOrders(orders){
    orders = orders.split(',')
    store.order_ID = orders[0]
    if (orders.length > 1){
        for (var i = 1; i < orders.length;i++){
            store.productIds.push(orders[i].split('_')[1])
        }
    }
  }

  syncStoreData(){
    store.data.Name = getValue(this.ref.inputName) || userName
    store.data.CertificateNumber = getValue(this.ref.inputCertificate) || identityNumber
    store.data.Telephone = getValue(this.ref.inputTelphone) || mobile
    store.data.validatecode = getValue(this.ref.inputCheckCode)
  }
}