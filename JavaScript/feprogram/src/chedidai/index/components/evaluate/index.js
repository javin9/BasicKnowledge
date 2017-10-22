import './index.scss'
import React from 'react'
import check from 'libs/check'
import 'libs/carSelect/selCarThird.pc'
import FormClass from '../formClass'
import md5 from 'blueimp-md5'

class Evaluate extends FormClass {
  constructor (props) {
    super(props)

    this.componentName = 'evaluate'

    this.state = {
    	authCode: this.isPlaceholderSupport ? '' : '请输入验证码',
    	carId : '',
    	tel: this.isPlaceholderSupport ? '' : '请输入手机号',
      errmsg: ''
    }
  }

  submit(){
      const sameMobile = md5(this.state.tel) === this.props.loginStatus.hashMobile

    this.resetError()

    if(!this.state.tel || !check.isPhoneNumber(this.state.tel)){
      this.throwError('请输入正确的手机号')
      return false
    }

    // 考虑plceholder不支持的情况
    if((!this.state.authCode || this.state.authCode === '验证码')  && !sameMobile){
      this.throwError('请输入正确的验证码')
      return false      
    }

    if(!this.state.carId){
      this.throwError('请选择品牌车型')
      return false      
    }


		const login = {
			mobile: this.state.tel,
			mobileValidateCode: this.state.authCode
		}

		const generate = {
			Mobile: this.state.tel,
			CarID: this.state.carId,
      Source: 594
		}

    if(sameMobile){
      // 填写手机号与登录用户手机号相同，直接创建订单，不验证验证码
      $(window).trigger('generateOrder', generate)
    }else{
    	check.checkCode(this.state.authCode, 'evaluate-tel', 550, res => {
    		if(res.Result){
    			$(window).trigger('submit', {login, generate})
    		}else{
    			this.throwError(res.Message)
    		}
    	})
    }

  }

  componentDidMount(){

  	const cb = item => {
  		this.setState({
    		carId: item.data('id')
    	})
  	}

  	$('#evaluate-car').selCar2({
  		OnlyOnSale:false,
      Callback: cb.bind(this)
    }).on('click', this.resetError.bind(this))

  }

  render () {
    return (
      <div className="component-evaluate">
	      <h6>快速评估 额度早知道</h6>
	      <p>估值数据由精真估提供</p>
	      <div className="form-item form-car">
          <span className={this.state.errmsg === '请选择品牌车型' ? 'car-input errTip' : (!this.state.carId && this.isPlaceholderSupport) ? 'car-input car-empty':'car-input'} id="evaluate-car">请选择品牌车型</span>
	      </div>
	      <div className="form-item form-tel">
	      	<input 
            type="text" 
            className={this.state.errmsg === '请输入正确的手机号' ?'errTip':''} 
            placeholder="请输入手机号" id="evaluate-tel" 
            onChange={this.changeTel.bind(this)} 
            value={this.state.tel}  
            onFocus={this.focusHandler.bind(this)} 
            onBlur={this.blurHandler.bind(this)}/>
	      </div>
        {
            (md5(this.state.tel) === this.props.loginStatus.hashMobile) &&this.props.loginStatus.hashMobile ? (
              <div className="form-item form-code disabled">
                <span>验证码</span>
                <a href="javascript:void(0)">无需验证码</a>
              </div>) : (
              <div className="form-item form-code">
                <input 
                  className={(this.state.errmsg &&  this.state.errmsg !== '请输入正确的手机号' && this.state.errmsg !== '请选择品牌车型') ? 'errTip' : ''} 
                  type="text" 
                  placeholder="请输入验证码" 
                  onChange={this.changeCode.bind(this)} 
                  value={this.state.authCode} 
                  id="evaluate-authcode"  
                  onFocus={this.focusHandler.bind(this)} 
                  onBlur={this.blurHandler.bind(this)}/>
                <a href="javascript:void(0)" onClick={this.getCode.bind(this)} id="evaluate-get-code">获取验证码</a>
              </div>
              )
          }
        <p className="error">{this.state.errmsg}</p>
	      <button onClick={this.submit.bind(this)}>免费评估</button>
      </div>
    )
  }
}

export default Evaluate