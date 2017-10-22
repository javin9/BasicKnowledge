import check from 'libs/check/m'

export default (validFields, params, msg, isShowImgCodeBox) => {
  return (cb, notValidCb) => {
    let valid = true

    const resultHandle = (valid) => {
      if(valid){
        (typeof cb === 'function') && cb()
      }else if(typeof notValidCb === 'function'){
        notValidCb()
      }
    }

    if(dev){
      resultHandle(valid)
      return false
    }

    if(validFields.indexOf('realName') >= 0){
      if(!check.isName(params.realName)){
        msg.realName = '姓名错误'
        valid = false
      }else{
        msg.realName = ''
      }
    }

    if(validFields.indexOf('IdNo') >= 0){
      if( !check.isID(params.IdNo + '') ){
        msg.IdNo = '身份证号错误'
        valid = false
      }else{
        msg.IdNo = ''
      }
    }

    if(isShowImgCodeBox && validFields.indexOf('imageCode') >= 0){
      if( !check.isImagePassword(params.imageCode) ){
        msg.imageCode = '请输入正确的图片校验码'
        valid = false
      }else{
        msg.imageCode = ''
      }
    }

    if(validFields.indexOf('name') >= 0){
      if(!check.isName(params.Name)){
        msg.name = '姓名格式错误，请核实'
        valid = false
      }else{
        msg.name = ''
      }
    }

    if(validFields.indexOf('telephone') >= 0){
      if(!check.isPhoneNumber(params.Telephone)){
        msg.telephone = '手机格式错误，请核实'
        valid = false
      }else{
        msg.telephone = ''
      }
    }

    if(validFields.indexOf('code') >= 0){
      if(!check.isAuthcode(params.code)){
        msg.code = '验证码错误，请核实'
        valid = false
        resultHandle(valid)
      }else{
        check.checkCode({number: params.code}, res => {
          if(!res.Result){
            valid = false
            msg.code = res.Message
          }else{
            msg.code =''
          }
          resultHandle(valid)
        })
      }
    }else{
      resultHandle(valid)
    }

  }
}