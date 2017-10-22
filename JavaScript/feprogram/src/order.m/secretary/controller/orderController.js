import service from '../service/service'
import tpl from '../template/template'
import store from '../store/store'
import {getElement, getValidateElement, disabledSubmit, enabledSubmit, isDisabledSubmit, getValue, resetInput, throwError} from '../util/util'
import check from 'libs/check/m'
import BaseController from './baseController'

export default class OrderController extends BaseController{
  constructor (options) {
    super();

    this.view = 'order';

    this.ref = {
      CLASS_CLOSE : 'close',
      CLASS_VISIBLE: 'visible',
      CLASS_PANEL: 'panel',

      INT_VAL: 30,

      ALERT_TIME:2000,
      ALERT_STAY:1000,

      PHONE_LENGTH_LIMIT:11,
      CODE_LENGTH_LIMIT:4,

      closePanel: '.close-panel',
      recommendWrapper: '#recommend-wrapper',
      productNewcarTit: '#product-newcar-tit',
      productNewcar: '#product-newcar',
      productLeaseTit: '#product-lease-tit',
      productLease: '#product-lease',
      warning: '.warning',
      skipCertificateLink: '#skip-certificate',
      textCertSuccess: '实名认证成功',
      textCertFail: '身份证与姓名不匹配',

      textSubmit: '立即申请',
      textCodeEmpty: '验证码为空',
      textCodeError: '验证码错误',

      btnSubmit: '#submitBtn',
      // btnTelSubmit: '#tel-submit',
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
      inputCertificate: '#CertificateNumber',
      inputImgCode: '#imgCode',

      imgCodeBox:'#imgCodeBox',
      changeImgCode:'#changeImgCode',
      isfirstClickSubmit: true,
    };

    this.orderDetector = {
        Newcar: false,   // 是否选中新车产品
        Lease: false,    // 是否选中开走吧产品
        NewcarRespond: null, // 新车下单接口返回值
        LeaseRespond: null  // 开走吧下单接口返回值
    }
  }

  render() {
    // 检测上以页面是否完全结束
    const readyCheck = () => {
        let intNum = setInterval(() => {
            if(this.getDispatchStatus()){
                clearInterval(intNum);
                this.showPage(this.view);
                this.bindFormEvent()
            }
        },this.ref.INT_VAL)
    };

    // todo check
    service.get_feaures_getting(res => {
      if (res.Result) {
          // 默认产品
          if (res.Data.Product) {
              if(res.Data.Adviser){
                  store.AdviserId = res.Data.Adviser.Id
              }

              if(res.Data.Product.MultiLabel||res.Data.Product.PackageGiftValueAmount){
                  res.Data.Product.isUl = true;
              }else{
                  res.Data.Product.isUl = false;
              }

              store.packageId = res.Data.Product.PackageId;

              this.syncStoreOrders(res.Data.Properties.Orders);
              getElement(this.ref.productNewcarTit).show().find('span').html('<i>' + res.Data.Properties.Features.join('、') + '</i>');
              getElement(this.ref.productNewcar).show().html(tpl.product(res.Data));

              // 统计
              if(window.bc && res.Data.Product && res.Data.Product.ProductId) {
                  window.bc.send({
                      etype: 'exp',
                      ex1: res.Data.Product.ProductId,
                      ex2: store.data.CityId,
                      ex3: store.data.CarId
                  })
              }
          } else {
              // fix 移除空元素
              getElement(this.ref.productNewcarTit).remove();
              getElement(this.ref.productNewcar).remove();
          }

          // 开走吧产品
          if (res.Data.Ki) {
              store.Ki_CarId = res.Data.Ki.CarId;
              store.Ki_OrderId =  res.Data.Ki.Orders;
              if (res.Data.Ki.CarShowingName === '所选车型') {
                  getElement(this.ref.productLeaseTit).show().html(`为您推荐所选车型的租赁产品，超低月供！`);
              } else {
                  getElement(this.ref.productLeaseTit).show().html(`为您推荐<span><i>${res.Data.Ki.CarShowingName}</i></span>的租赁产品`);
              }
              getElement(this.ref.productLease).show().html(tpl.productLease(res.Data.Ki));

              // 统计
              let kiProductId = store.Ki_OrderId.split('_')[1]; // '3886_106466_0' 中间是productId
              if(window.bc && kiProductId) {
                  window.bc.send({
                      etype: 'exp',
                      ex1: kiProductId,
                      ex2: store.data.CityId,
                      ex3: store.data.CarId
                  });
              }
          }

          // 两种产品都有时候，可以选择
          // 初始化下单监视器
          if (res.Data.Product && res.Data.Ki) {
              var self = this;
              getElement(this.ref.recommendWrapper).addClass('choosable');
              getElement(this.ref.productNewcar).find('.pro-groups').addClass('active');
              this.orderDetector.Newcar = true;
              getElement(this.ref.recommendWrapper).on('click', '.pro-groups', function(e) {
                  // 顾问电话
                  if ($(e.target).hasClass('adviser')) {
                      location.href = $(e.target).attr('href');
                      return false;
                  }
                  // 其他情况
                  $(this).toggleClass('active');
                  if ($(this).hasClass('newcar')) {
                      if ($(this).hasClass('active')) {
                          self.orderDetector.Newcar = true;
                      } else {
                          self.orderDetector.Newcar = false;
                      }
                  } else {
                      if ($(this).hasClass('active')) {
                          self.orderDetector.Lease = true;
                      } else {
                          self.orderDetector.Lease = false;
                      }
                  }
                  // console.log(`orderNewcar: ${self.orderDetector.Newcar}, orderLease: ${self.orderDetector.Lease}`)
              });
          } else if (res.Data.Product && !res.Data.Ki) {
              this.orderDetector.Newcar = true;
          } else if (!res.Data.Product && res.Data.Ki) {
              this.orderDetector.Lease = true;
          }

          readyCheck();
      }else{
          throwError(res.Message)
      }
    });

    // 隐藏卡券
    $('.card').hide();
  }

  panelControl(id){
    const hide = id === this.ref.CLASS_CLOSE;
    const $panel = hide ? $('.' + this.ref.CLASS_PANEL + '.' + this.ref.CLASS_VISIBLE) : getElement('#' + id);
    if(hide){
        $panel.removeClass(this.ref.CLASS_VISIBLE);
        $(window).unbind('touchmove');
    }else{
        $panel.addClass(this.ref.CLASS_VISIBLE);
        $(window).bind('touchmove', function(e) {
            e.preventDefault();
        });
    }
  }

    bindSubmitEvent(){
        // 下单控制器
        const submitOrder = () => {
            if (this.orderDetector.Newcar || this.orderDetector.Lease) {
                disabledSubmit(this.ref.btnSubmit);
                getElement(this.ref.warning).hide();
                this.syncStoreData();

                // 置空返回值
                this.orderDetector.NewcarRespond = null;
                this.orderDetector.LeaseRespond = null;
                // 有新车先下单新车（如果还有开走吧，在回调函数里继续下单开走吧）
                if (this.orderDetector.Newcar) {
                    submitOrderNewcar();
                // 只有开走吧，则下单开走吧
                } else if (this.orderDetector.Lease) {
                    submitOrderLease();
                }
            } else {
                tools.showAlert('请至少选择一个产品');
            }
        };

        // 下单 - 新车产品
        const submitOrderNewcar = () => {
            service.post_creating(res => {
                this.orderDetector.NewcarRespond = res || {};
                submitComplete();
            }, res => {
                this.orderDetector.NewcarRespond = res || {};
                submitComplete();
            });
        };

        // 下单 - 开走吧产品
        const submitOrderLease = () => {
            service.post_creating_lease(res => {
                this.orderDetector.LeaseRespond = res || {};
                submitComplete();
            }, res => {
                this.orderDetector.LeaseRespond = res || {};
                submitComplete();
            });
        };

        // 处理下单返回结果
        const submitComplete = () => {
            // （下单顺序：先下单新车，后下单开走吧）如果开走吧还没下单，则再继续下单开走吧
            if (this.orderDetector.Lease && !this.orderDetector.LeaseRespond) {
                submitOrderLease();
                return false;
            }

            // 下了两单
            if (this.orderDetector.Lease && this.orderDetector.Newcar) {
                if (this.orderDetector.LeaseRespond.Result) {
                    // 租车成功
                    orderLeaseCallback();
                } else if (this.orderDetector.NewcarRespond.Result) {
                    // 租车失败，新车成功
                    orderNewcarCallback();
                } else {
                    // 两个订单都失败，报租车提示
                    enabledSubmit(this.ref.btnSubmit);
                    tools.showAlert(this.orderDetector.LeaseRespond.Message);
                }
            }
            // 仅租车
            else if (this.orderDetector.Lease && !this.orderDetector.Newcar) {
                orderLeaseCallback();
            }
            // 仅新车
            else if (!this.orderDetector.Lease && this.orderDetector.Newcar) {
                orderNewcarCallback();
            }
        };

        // 新车产品下单回调
        const orderNewcarCallback = () => {
            let res = this.orderDetector.NewcarRespond;

            if (!res.Result) {
                enabledSubmit(this.ref.btnSubmit);
                tools.showAlert(res.Message);

                // 订单限制情况逻辑：
                // 不允许再修改手机号
                /* if (res.Data === 2 || res.Data === 3) {
                 isLoggedIn = true;
                 getElement(this.ref.inputCheckCode).closest('li').remove();
                 getValidateElement(this.ref.inputCheckCode).remove();
                 getElement(this.ref.btnCode).remove();
                 getElement(this.ref.inputTelphone).prop('disabled', true);
                 } */
                return false;
            }

            // app交互 - 登录
            tools.getLoginStatus();
            //判断是否在线审批的跳转URL是否存在
            if(res.Data.RedirectUrl){
                location.href = res.Data.RedirectUrl;
                return false;
            }
            //判断是否在线进件
            if (res.Data.IsRequiringSnap) {
                location.href = snap_index_url + "?orderId=" + res.Data.OrderId + "&childOrderId=" + res.Data.ChildOrderId;
                return false;
            }

            // store.userId = res.Data.UserId;
            store.OrderId = res.Data.OrderId;
            store.ChildOrderId = res.Data.ChildOrderId;
            mobile = getValue(this.ref.inputTelphone);
            isAuthenticated = res.Data.IsAuthenticated;

            if (isAuthenticated) {
                this.goToPage('result');
                $(window).unbind('touchmove');
            } else {
                // m站或者投放1：实名认证弹层
                // 投放2是先认证再下单，所以不会进这里
                this.panelControl(this.ref.panelCertificateName);
                getElement(this.ref.btnSubmit).text('下单成功');
                getElement(this.ref.inputRealName).val(store.data.Name);
                getElement(this.ref.skipCertificateLink).click(() => {
                    this.goToPage('result');
                    $(window).unbind('touchmove');
                });
            }
        };

        // 开走吧产品下单回调
        const orderLeaseCallback = () => {
            let res = this.orderDetector.LeaseRespond;

            if (!res.Result) {
                enabledSubmit(this.ref.btnSubmit);
                tools.showAlert(res.Message);
                return false;
            }

            // app交互 - 登录
            tools.getLoginStatus();

            location.href = res.Data.RedirectUrl;
        };

        // 实名认证后，一级订单变二级订单
        const updateOrder = () => {
            disabledSubmit(this.ref.btnCertSubmit);
            getElement(this.ref.warning).hide();

            service.auth(res => {
                if(res.Result){
                    tools.showAlert(this.ref.textCertSuccess, this.ref.ALERT_STAY);
                    // service.order_updating(); // 实名认证后会自动更新订单等级，不需要调用此接口了？
                    setTimeout(() => {
                        this.goToPage('result');
                        $(window).unbind('touchmove');
                    }, this.ref.ALERT_TIME);
                }else{
                    // tools.showAlert(this.ref.textCertFail);
                    enabledSubmit(this.ref.btnCertSubmit);
                    if(res.Data === 0){
                        //验证码错误
                        getElement(this.ref.imgCodeBox).removeClass('hide');
                        if(!this.ref.isfirstClickSubmit){
                            getValidateElement(this.ref.inputImgCode).show();
                            store.validate.imgCode = false;
                        }else{
                            getElement(this.ref.changeImgCode).find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                            tools.showAlert("请输入图片校验码");
                        }
                        
                    }else if(res.Data === -1){
                        //需要验证码
                        getElement(this.ref.changeImgCode).find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                        getElement(this.ref.imgCodeBox).removeClass('hide');
                        tools.showAlert("请输入图片校验码");
                    }else {
                        tools.showAlert(this.ref.textCertFail);
                        if(!getElement(this.ref.imgCodeBox).hasClass('hide')){
                          getElement(this.ref.changeImgCode).find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                        }
                    }
                }
                this.ref.isfirstClickSubmit = false;
            }, {
                name: getValue(this.ref.inputRealName),
                idNumber:getValue(this.ref.inputCertificate),
                orderId: store.OrderId,
                childOrderId: store.ChildOrderId,
                imageCode: getElement(this.ref.imgCodeBox).hasClass('hide')?'':getValue(this.ref.inputImgCode)
            });
        };

        // 先登录，再实名认证并下单
        const login = () => {
            disabledSubmit(this.ref.btnSubmit);
            getElement(this.ref.warning).hide();

            // 登录
            if (isLoggedIn) {
                certificateAndSubmitOrder();
            } else {
                service.login(res => {
                    if (res.Result) {
                        isLoggedIn = true;
                        certificateAndSubmitOrder();
                    } else {
                        tools.showAlert(res.Message);
                        enabledSubmit(this.ref.btnSubmit);
                    }
                }, {
                    name: getValue(this.ref.inputRealName),
                    mobile: getValue(this.ref.inputTelphone),
                    code: getValue(this.ref.inputCheckCode),
                    line: window.businessLineId
                });
            }
        };

        // 先实名认证，再下单
        const certificateAndSubmitOrder = () => {
            service.auth(res => {
                if (res.Result) {
                    // 身份验证成功 下单
                    tools.showAlert(this.ref.textCertSuccess, this.ref.ALERT_STAY);
                    submitOrder();
                }else{
                    tools.showAlert(this.ref.textCertFail);
                    enabledSubmit(this.ref.btnSubmit);
                    // if(res.Data === 0){
                    //     //验证码错误
                    //     getElement(this.ref.imgCodeBox).removeClass('hide');
                    //     if(!this.ref.isfirstClickSubmit){
                    //         getValidateElement(this.ref.inputImgCode).show();
                    //         store.validate.imgCode = false;
                    //     }else{
                    //         getElement(this.ref.changeImgCode).find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                    //         tools.showAlert("请输入图片校验码");
                    //     }
                        
                    // }else if(res.Data === -1){
                    //     //需要验证码
                    //     getElement(this.ref.changeImgCode).find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                    //     getElement(this.ref.imgCodeBox).removeClass('hide');
                    //     tools.showAlert("请输入图片校验码");
                    // }else {
                        // tools.showAlert(this.ref.textCertFail);
                        // getElement(this.ref.changeImgCode).find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                    // }
                }
                // this.ref.isfirstClickSubmit = false;
            }, {
                name: getValue(this.ref.inputRealName),
                idNumber:getValue(this.ref.inputCertificate),
                orderId: store.OrderId,
                childOrderId: store.ChildOrderId,
                // imageCode: getElement(this.ref.imgCodeBox).hasClass('hide')?'':getValue(this.ref.inputImgCode)
            });
        };

        const submitHandler = () => {
            if(isDisabledSubmit(this.ref.btnSubmit)){
                return false
            }

            // 未登录先验证手机号、验证码
            let inputs = $("#form-wrapper").find('input[type=text], input[type=number], input[type=tel]');
            let validatePass = true,
                inputname;
            
            for (let i = 0; i < inputs.length; i++) {
                inputname = inputs.eq(i).attr('id');
                if (!store.validate[inputname.toLowerCase()]) {
                    getValidateElement('#'+inputname).show();
                    validatePass = false;
                    break;
                }
            }
            
            if (validatePass) {
                if (typeof tfPageNumber !== 'undefined' && tfPageNumber === 2) {
                    // 投放2
                    if (!isLoggedIn || !isAuthenticated) {
                        login();
                    } else {
                        submitOrder();
                    }
                 } else {
                     // m站或投放1
                     submitOrder();
                 }
            }
        };

        const certSubmitHandler= () => {
            if(isDisabledSubmit(this.ref.btnCertSubmit)){
              return false;
            }
            
            if(!store.validate.realname){
              getValidateElement(this.ref.inputRealName).show();
              return false;
            }
            
            if(!store.validate.certificatenumber){
              getValidateElement(this.ref.inputCertificate).show();
              return false;
            }

            if(!getElement(this.ref.imgCodeBox).hasClass('hide') && !store.validate.imgCode){
              getValidateElement(this.ref.inputImgCode).show();
              return false;
            }
            updateOrder();
        };

        /* const telSubmitHandler = () => {

            if(isDisabledSubmit(this.ref.btnTelSubmit)){
                return false
            }

            if(!store.validate.phone && !dev){
                getValidateElement(this.ref.inputPhone).show()
                return false
            }

            if(!store.validate.checkcode && !dev){
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
        } */

        getElement(this.ref.btnSubmit).on('click', submitHandler);
        getElement(this.ref.btnCertSubmit).on('click', certSubmitHandler);
        // getElement(this.ref.btnTelSubmit).on('click', telSubmitHandler);
        getElement(this.ref.changeImgCode).on('click', ()=> {
          getElement(this.ref.changeImgCode).find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
        });
    }

  bindFormEvent(){
    const [name, tel, phone, code, getCode, certificate, imgCode, editTelBtn, realName] = [this.ref.inputName, this.ref.inputTelphone, this.ref.inputPhone, this.ref.inputCheckCode, this.ref.btnCode, this.ref.inputCertificate, this.ref.inputImgCode, this.ref.btnEditTel, this.ref.inputRealName]

    const fnLimitLength = (element, length) => {
        return () => {
            const value = element.val();
            if(value > length){
                element.val(value.slice(0, length));
            }
        }
    };

    getElement(name).blur(() => {
        if(!check.isName(getElement(name).val())) {
            getValidateElement(name).show();
            store.validate.name = false
        } else {
            getValidateElement(name).hide();
            store.validate.name = true
        }
    });

    getElement(realName).blur(() => {
        if(!check.isName(getElement(realName).val()))
        {
            getValidateElement(realName).show();
            store.validate.realname = false
        }
        else{
            getValidateElement(realName).hide();
            store.validate.realname = true
        }
    });

    getElement(certificate).blur(() => {
        if(!check.isID(getElement(certificate).val()))
        {
            getValidateElement(certificate).show();
            store.validate.certificatenumber = false
        }
        else{
            getValidateElement(certificate).hide();
            store.validate.certificatenumber = true
        }
    });

    //图片验证码
    getElement(imgCode).blur(()=>{
      if(!check.isImagePassword(getElement(imgCode).val())){
        getValidateElement(imgCode).show();
        store.validate.imgCode = false;
      }else{
        getValidateElement(imgCode).hide();
        store.validate.imgCode = true;
      }
    })
    // 手机号
    getElement(tel).blur(() => {
        if(!check.isPhoneNumber(getElement(tel).val()))
        {
            getValidateElement(tel).show();
            store.validate.telphone = false
        }
        else{
            getValidateElement(tel).hide();
            store.validate.telphone = true
        }
    })
    .on('input',
        //fnLimitLength(getElement(tel), this.ref.PHONE_LENGTH_LIMIT)
        () => {
            if(!check.isPhoneNumber(getElement(tel).val())) {
                getElement(getCode).addClass('disabled');
            } else {
                getElement(getCode).removeClass('disabled');
                getValidateElement(tel).hide();
            }
        }
    );

    // 修改手机号
    getElement(phone)
        .blur(() => {
            if(!check.isPhoneNumber(getElement(phone).val()))
            {
                getValidateElement(phone).show();
                store.validate.phone = false
            }
            else{
                getValidateElement(phone).hide();
                store.validate.phone = true
            }
        })
        .on('input', fnLimitLength(getElement(phone), this.ref.PHONE_LENGTH_LIMIT));

    getElement(code)
    .blur(() => {
        if (getElement(code).val().trim().length < this.ref.CODE_LENGTH_LIMIT) {
            getValidateElement(code).show();
            store.validate.checkcode = false;
        }
        else {
            getValidateElement(code).hide();
            store.validate.checkcode = true;
        }
    })
    .on('input', fnLimitLength(getElement(code), this.ref.CODE_LENGTH_LIMIT));

    getElement(getCode)
    .click(() => {
        if (!$(this).hasClass('disabled')) {
            const telId = getElement(getCode).attr('rel');
            service.get_code(telId, getCode.substring(1));
            getElement(code).focus();
        }
    });

    getElement(editTelBtn).click(() => {
        this.panelControl(this.ref.panelPhoneName);
        return false;
    });

    getElement(this.ref.closePanel).click(() => {
        this.panelControl(this.ref.CLASS_CLOSE)
    });

    this.bindSubmitEvent()
  }

  syncStoreOrders(orders){
    orders = orders.split(',');
    store.ordersFirst = orders[0];
    if (orders.length > 1){
        for (var i = 1; i < orders.length;i++){
            store.productIds.push(orders[i].split('_')[1]);
        }
    }
  }

  syncStoreData(){
    store.data.Name = getValue(this.ref.inputName);
    store.data.CertificateNumber = getValue(this.ref.inputCertificate);
    store.data.Telephone = getValue(this.ref.inputTelphone);
    store.data.code = getValue(this.ref.inputCheckCode);
  }
}