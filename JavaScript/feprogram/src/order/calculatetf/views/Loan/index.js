import './index.scss'
import React, {PropTypes} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Buttons, FormItem} from '../../components/Form'
import Result from '../../components/Result'
import Insurance from '../../components/Insurance'
import { openInsuranceModal } from '../../actions/insurance'
import { getSourcesInfo, resetSourcesInfo, updateSeat, updateCC, updateCity, updateCar, updatePlate, updatePrice, /*updateFinalRate,*/ updatePayment, updateTerm, updateTax, updateTel, updateVerification} from '../../actions/sources'
import { addUserTelnumber } from '../../actions/result'
import { getFeeByTerm, validatorFinalRate, historyReplaceCity, validatorTelNumber, checkCode} from '../../util'

class Loan extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount(){
    // 与header中城市空间联动，不单独检测city change, 全部在selCityCallback中处理
    window.selCityCallback = ({cityId : id, cityName: name}) => this.changeCity({id,name})
  }

  pmt(i, n, p) {
   return i * p * Math.pow((1 + i), n) / (1 - Math.pow((1 + i), n))
  }

  submitHandler(){
    if($('#mobile').val() == ''){
      return tools.showAlert('请输入您的手机号')
    }

    if($('#validatorCode').val() == '') {
      return tools.showAlert('请输入您的手机验证码')
    }
    const sourceUrl = initData.source ? `?source=${initData.source}` : ''

    let pay = this.props.price * this.props.payment / 100//首付
    // 购置税
    let ptax = this.props.price/(1+0.17)*(this.props.cc <= this.props.ccLevel ? 0.075 : 0.1)

    // 必要花费
    let mustcost = Math.round(ptax + this.props.plate + this.props.cc + this.props.seat)

    // 月供
    let monthPayment = Math.round(this.props.tax.type === 1 ? ((this.props.price * (1 - this.props.payment / 100)) * (1 + this.props.tax.value / 100)) / this.props.term : this.pmt(this.props.tax.value/100/12, this.props.term, -loan))

    let loan = this.props.price - pay
    // 贷款成本
    let loanCost = monthPayment*this.props.term-loan

    // 总花费
    // 车价+贷款成本+必要花费+商业保险
    let total = this.props.price + loanCost + mustcost + this.props.insurancePrice

    checkCode($('#validatorCode').val(), 'mobile', BusinessLine, (res)=>{

      if(!res.Result){
        return tools.showAlert('请输入正确的验证码')
      }

      this.props.addUserTelnumber({
        CarId: this.props.car.id,
        CityId: this.props.city.id,
        Telephone: $('#mobile').val(),
        code: $('#validatorCode').val(),
        Channel: channel,
        Source: source,
        From: tools.getCookie('form') || '',
        DownPaymentAmount: pay,//首付 
        FirstPaymentAmount: pay + mustcost + this.props.insurancePrice,//首次支付
        LoanAmount: loan,//贷款额度
        TotalInterest: loanCost,//贷款成本  
        TotalCost: total,//总花费
        CarPrice: this.props.price,//报价  
        DownPaymentRate: this.props.payment,//首付比 
        RepaymentPeriod: this.props.term,//期限
        MonthlyPayment: monthPayment,//月供
        RequiredCost: mustcost,//必要花费

        extendsData: {
          price: this.props.price,
          payment: this.props.payment,
          cc: this.props.cc,
          seat:this.props.seat,
          plate:this.props.plate,
          insurance:this.props.insurancePrice,
          tax:this.props.tax,
          term: this.props.term,
          link: `${initData.baseUrl}/${window.citySpell}/${this.props.car.spell}/m${this.props.car.id}${sourceUrl}`,
        }
      })
      $('#validatorCode').val('');
    })
  }

  changeCar(car){
    // this.props.updateCar(car)
    this.props.getSourcesInfo(car.id, this.props.city.id)
  }

  changeCity(city){
    this.props.updateCity(city)
    this.props.getSourcesInfo(this.props.car.id, city.id)
    historyReplaceCity(city.id)
  }

  changeTermHandler(term){
    this.props.updateTerm(term)
    this.props.updateTax({
      value: getFeeByTerm(this.props.tax.type, term, this.props.taxOptions)
    })
  }

  changeTaxValue(value){
    this.props.updateTax({
      value
    })
  }

  changeTelValue(value){
    this.props.updateTel(value)
  }

  changeCodeValue(value){
    this.props.updateVerification(value)
  }
  switchTax(type){
    const value = getFeeByTerm(type, this.props.term, this.props.taxOptions)
    this.props.updateTax({
      type,
      value
    })
  }

  render () {

    const Info = <div className="info-loan">
        <FormItem 
          label="选择车款" 
          type="carSelect" 
          value={this.props.car.name} 
          onChange={this.changeCar.bind(this)}/>

        <FormItem 
          label="购车城市" 
          type="citySelect" 
          value={this.props.city.name} 
          // onChange={this.changeCity.bind(this)} 
          // inline
        />

        <FormItem 
          label="4S店平均报价" 
          type="text" 
          value={this.props.price} 
          onChange={this.props.updatePrice} 
          // inline 
          disabled={!this.props.car.id}
          disabledValue='&yen; --'
          disabledTheme='light'
          format="price"/>

        <FormItem 
          label="首付比例" 
          type="checkbox" 
          options={this.props.paymentOptions} 
          value={this.props.payment} 
          disabled={!this.props.car.id}
          onChange={this.props.updatePayment}
          labelbox/>

        <FormItem 
          label="贷款期限" 
          type="checkbox" 
          options={this.props.termOptions} 
          value={this.props.term} 
          icon="false" 
          disabled={!this.props.car.id}
          onChange={this.changeTermHandler.bind(this)}
          labelbox/>

        <FormItem 
          telId="mobile"
          label="手机号" 
          type="text"
          format="tel"
          getcode="GetCode"
          placeholder="请输入手机号"
          maxlength='11'
          value={$('#mobile').val()} 
          validator={validatorTelNumber.bind(this)}
          // onChange={this.changeTelValue.bind(this)}
          icon="false" 
          disabled={!this.props.car.id}/>

          <FormItem 
          telId="validatorCode"
          label="验证码" 
          type="text"
          format="code"
          placeholder="请输入验证码"
          maxlength='4'
          value={$('#validatorCode').val()} 
          // onChange={this.changeCodeValue.bind(this)}
          icon="false" 
          disabled={!this.props.car.id}/>

        {/*<FormItem 
          label="尾款比例" 
          type="text" 
          format="rate"
          value={this.props.finalrate} 
          disabled={!this.props.car.id}
          validator={validatorFinalRate.bind(this,this.props.payment)}
          onChange={this.props.updateFinalRate}/>*/}

        {/*<FormItem 
          label="贷款利率" 
          type="switchSelect" 
          options={this.props.taxOptions} 
          value={this.props.tax} 
          onChangeSelect={this.switchTax.bind(this)}
          onChange={this.changeTaxValue.bind(this)}
          disabled={!this.props.car.id}/>*/}

        <FormItem 
          label="上牌费" 
          type="text" 
          value={this.props.plate} 
          format="price" 
          labelTip={this.props.tips.plate}
          disabled={!this.props.car.id}
          onChange={this.props.updatePlate}/>

        <FormItem 
          label="车船税" 
          type="select" 
          options={this.props.ccOptions} 
          value={this.props.cc} 
          labelTip={this.props.tips.cc}
          disabled={!this.props.car.id}
          onChange={this.props.updateCC}/>

        <FormItem 
          label="交强险" 
          type="select" 
          options={this.props.seatOptions} 
          value={this.props.seat} 
          labelTip={this.props.tips.seat}
          disabled={!this.props.car.id}
          onChange={this.props.updateSeat} />

        <FormItem 
          label="商业保险" 
          type="staticInput" 
          value={this.props.insurancePrice} 
          disabled={!this.props.car.id}
          onClick={this.props.openInsuranceModal}/>

        <Buttons 
          submit={this.submitHandler.bind(this)} 
          reset={this.props.resetSourcesInfo}
          disabled={!this.props.car.id}/>
      </div>

    return (
      <div>
        <div className="panel panel-info">
          <div className="content">
          {Info}
          </div>
        </div>
        <div className="panel panel-result">
          <h3>计算结果<em>（以下计算结果仅供参考，实际费用以具体成交为准）</em></h3>
          <div className="content">
            <Result type="loan" data={this.props.result}/>
          </div>
        </div>
        <Insurance />
      </div>
    )
  }
}

Loan.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    payment: state.sources.payment,
    paymentOptions: state.options.payment,
    term: state.sources.term,
    termOptions: state.options.terms,
    seat: state.sources.seat,
    seatOptions: state.options.seat,
    cc: state.sources.cc,
    ccOptions: state.options.cc,
    car: state.sources.car,
    city: state.sources.city,
    plate: state.sources.plate,
    finalrate: state.sources.finalrate,
    price: state.sources.price,
    tax: state.sources.tax,
    taxOptions: state.options.tax,
    insurancePrice: state.insurance.total,
    result: state.result.usertel,
    tips: state.tips,
    tel: state.sources.tel,
    verification: state.sources.verification,
    // 1.6升分隔界限
    ccLevel: state.options.cc[1].value
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getSourcesInfo: (...params) => getSourcesInfo(dispatch,...params),
    resetSourcesInfo: bindActionCreators(resetSourcesInfo, dispatch),
    openInsuranceModal: bindActionCreators(openInsuranceModal, dispatch),
    updateSeat: bindActionCreators(updateSeat, dispatch),
    updateCC: bindActionCreators(updateCC, dispatch),
    updateCar: bindActionCreators(updateCar, dispatch),
    updateCity: bindActionCreators(updateCity, dispatch),
    updatePlate: bindActionCreators(updatePlate, dispatch),
    updatePrice: bindActionCreators(updatePrice, dispatch),
    // updateFinalRate: bindActionCreators(updateFinalRate, dispatch),
    updatePayment: bindActionCreators(updatePayment, dispatch),
    updateTerm: bindActionCreators(updateTerm, dispatch),
    updateTax: bindActionCreators(updateTax, dispatch),
    updateTel: bindActionCreators(updateTel, dispatch),
    updateVerification: bindActionCreators(updateVerification, dispatch),
    addUserTelnumber: (...params) => addUserTelnumber(dispatch,...params)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Loan)