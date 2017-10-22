import './index.scss'
import React from 'react'
import YXSlider from 'libs/yxSlider/YXSlider.pc.js'
import check from 'libs/check'
import FormClass from '../formClass'
import md5 from 'blueimp-md5'

class Product extends FormClass {
  constructor (props) {
    super(props)

    this.componentName = 'product'

    this.state = {
        errmsg: '',
				// 贷款额度
        loanMoney: 5,

        loanMoneyArr:[3,4,5,8,10,20,30,50].map(value => {return {text: value, isDisable: false, isDefault:value === 5, unit:'万'}}),

        // 贷款期限
        loanPeriod: 0,

        // 月供
        monthPayment: 0,

        // 贷款成本
        totalMoney:0,

        // 贷款期限列表
        loanPeriodArr:[1,3,6,12,24,36].map(value => {return {text: value, isDisable: true, isDefault:value === 24, unit:'期'}}),

        tel: this.isPlaceholderSupport ? '' : '请输入手机号',

        productId:'',

        loanRate: '',

        authCode: this.isPlaceholderSupport ? '' : '请输入验证码'
    }
  }

  getLoanInfo(loanMoney, loanPeriod){
  	$.getJSON('/MortgageV/GetMortgageLoanInfo', {loanPeriod, loanMoney}, res => {
  		if(res.Result){
  			const loanPeriodArr = this.state.loanPeriodArr;
  			const loanMoneyArr = this.state.loanMoneyArr;
  			if(loanPeriod && res.Data.LoanPeriod!=loanPeriod){
                loanPeriod = res.Data.LoanPeriod;
            }
  			loanPeriod =  loanPeriod ? loanPeriod : res.Data.LoanPeriodArr[res.Data.LoanPeriodArr.length - 1]

  			loanPeriodArr.forEach(item => {
  				item.isDisable = res.Data.LoanPeriodArr.indexOf(item.text) < 0 ? true : false
  				item.isDefault = item.text === loanPeriod ? true : false
  			})
            // console.log(loanMoneyArr)
            if(loanMoney != 0){
                loanMoneyArr.forEach(item => {
                    item.isDefault = item.text === loanMoney ? true : false
                })
            }

  			this.setState({
  				loanMoney: loanMoney,
  				loanPeriodArr : loanPeriodArr,
                loanMoneyArr:loanMoneyArr,
  				loanPeriod: loanPeriod,
  				monthPayment: res.Data.MonthPayment.toFixed(2),
  				totalMoney: res.Data.TotalMoney.toFixed(2),
  				productId: res.Data.ProductId,
  				loanRate: res.Data.LoanRate,
  			})
            // console.log(this.state.loanMoneyArr)
  			this.termSlider.update(this.state.loanPeriodArr)
      }else{
        this.loanSlider.update(this.state.loanMoneyArr);
      	tools.showAlert(res.Message)
      }
  	})
  }

  submit(){
    const sameMobile = md5(this.state.tel) === this.props.loginStatus.hashMobile

    this.resetError()

    if(!this.state.tel || !check.isPhoneNumber(this.state.tel)){
      this.throwError('请输入正确的手机号')
      return false
    }

    // 考虑plceholder不支持的情况
    if((!this.state.authCode || this.state.authCode === '验证码') && !sameMobile){
      this.throwError('请输入正确的验证码')
      return false
    }

    const login = {
      mobile: this.state.tel,
      mobileValidateCode: this.state.authCode
    }

    const generate = {
      Mobile: this.state.tel,
      ProductId: this.state.productId,
      LoanRate: this.state.loanRate,
      LoanPeriod: this.state.loanPeriod,
      MonthPay: +this.state.monthPayment,
      TotalMoney: +this.state.totalMoney,
      ApplyAmount: +this.state.loanMoney,
      Source: 1018
    }

    if(sameMobile){
      // 填写手机号与登录用户手机号相同，直接创建订单，不验证验证码
      $(window).trigger('generateOrder', generate)
    }else{
      check.checkCode(this.state.authCode, 'product-tel', 550, res => {
        if(res.Result){
          $(window).trigger('submit', {login, generate})
        }else{
          this.throwError(res.Message)
        }
      })
    }

  }

  componentWillMount(){
  	this.getLoanInfo(this.state.loanMoney, this.state.loanPeriod)
  }

  componentDidMount(){
  	this.loanSlider = new YXSlider('loan', this.state.loanMoneyArr, value => {
  		this.getLoanInfo(value.text, this.state.loanPeriod)
  	})

  	this.termSlider = new YXSlider('term', this.state.loanPeriodArr, value => {
  		this.getLoanInfo(this.state.loanMoney, value.text)
  	})
  }

  render () {
    const totalMoney = (+this.state.totalMoney) >= 10000 ? `${(+this.state.totalMoney/10000).toFixed(2)}万` : `${Math.floor((+this.state.totalMoney))}元`
    return (
      <div className="component-product">
	      <div className="info">
		      <header>
			      <span><label>贷款</label><strong>{`${this.state.loanMoney}万`}</strong></span>
			      <span><label>月供</label><strong>{`${Math.round(this.state.monthPayment)}元*${this.state.loanPeriod}期`}</strong></span>
			      <span className="last"><label>贷款成本</label><strong>{totalMoney}</strong></span>
		      </header>
		      <div className="info-content">
			      <div className="info-item">
				      <label>贷款</label>
				      <div className="yx-silder-wrapper"><div id="loan"></div></div>
			      </div>
			      <div className="info-item">
				      <label>期限</label>
				      <div className="yx-silder-wrapper"><div id="term"></div></div>
			      </div>
		      </div>
	      </div>
	      <div className="form">
		      <h6>留下联系方式，立即申请贷款</h6>
		      <div className="form-item form-tel">
		      	<input className={this.state.errmsg == '请输入正确的手机号' ?'errTip':''} type="text" placeholder="请输入手机号" id="product-tel" onChange={this.changeTel.bind(this)} value={this.state.tel} onFocus={this.focusHandler.bind(this)} onBlur={this.blurHandler.bind(this)}/>
		      </div>
          {
            (md5(this.state.tel) === this.props.loginStatus.hashMobile) && this.props.loginStatus.hashMobile ? (
              <div className="form-item form-code disabled">
                <span>验证码</span>
                <a href="javascript:void(0)">无需验证码</a>
              </div>) : (
              <div className="form-item form-code">
                <input className={(this.state.errmsg &&  this.state.errmsg !== '请输入正确的手机号') ?'errTip':''} type="text" placeholder="请输入验证码"  onChange={this.changeCode.bind(this)} value={this.state.authCode} id="product-authcode" onFocus={this.focusHandler.bind(this)} onBlur={this.blurHandler.bind(this)}/>
                <a href="javascript:void(0)" onClick={this.getCode.bind(this)} id="product-get-code">获取验证码</a>
              </div>
              )
          }
          <p className="error">{this.state.errmsg}</p>
		      <button onClick={this.submit.bind(this)}>我要申请</button>
	      </div>
      </div>
    )
  }
}

export default Product