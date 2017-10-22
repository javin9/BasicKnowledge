/**
 * 首页放鑫贷和快速评估模块公用基类
 *
 * @static componentName 组件名， 需要子类覆写
 * @static isPlaceholderSupport 是否支持placeholder, ie8/9不支持
 * @method getCode 获取验证码
 * @method changeCode 验证码输入监听及限制
 * @method changeTel 手机号输入监听及限制
 * @method resetError 重置表单错误
 * @method throwError 显示表单错误信息
 * @method focusHandler 文本框placeholder处理相关
 * @method blurHandler  文本框placeholder处理相关
 */

import React from 'react'
import check from 'libs/check'

class FormClass extends React.Component {
  constructor (props) {
    super(props)

    this.componentName = ''

    this.isPlaceholderSupport = 'placeholder' in document.createElement('input')
  }

  getCode(){
    if(!this.state.tel || !check.isPhoneNumber(this.state.tel)){
      this.throwError('请输入正确的手机号')
      return false
    }
  	check.getCode(60, `${this.componentName}-tel`,`${this.componentName}-get-code`,550, false)
  }

  changeCode(e){
  	const authCode = e.target.value
  	if(/^(\d+|)$/.test(authCode) && authCode.length <= 6){
	  	this.setState({authCode})
  	}
  }

  changeTel(e){
  	const tel = e.target.value
  	if(/^(\d+|)$/.test(tel) && tel.length <= 11){
	  	this.setState({tel})
  	}

  }

  resetError(){
    this.setState({errmsg: ''})
  }

  throwError(errmsg){
    this.setState({errmsg})
  }

  // 处理ie8/9 placeholder问题
  focusHandler(e){
    if(!this.isPlaceholderSupport){
      const placeholder = e.target.getAttribute('placeholder')
      if(placeholder === '请输入手机号'){
        this.setState({
          tel: ''
        })
      }else{
        this.setState({
          authCode: ''
        })
      }
    }

    this.resetError()
  }

  // 处理ie8/9 placeholder问题
  blurHandler(e){
    if(!this.isPlaceholderSupport){
      const placeholder = e.target.getAttribute('placeholder')
      if(placeholder === '请输入手机号' && this.state.tel === ''){
        this.setState({
          tel: placeholder
        })
      }else if(this.state.authCode === ''){
        this.setState({
          authCode: placeholder
        })
      }
    }
  }
}

export default FormClass