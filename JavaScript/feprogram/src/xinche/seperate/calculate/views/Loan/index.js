import './index.scss'
import React, {PropTypes} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Buttons, FormItem} from '../../components/Form'
import Result from '../../components/Result'
import Insurance from '../../components/Insurance'
import { openInsuranceModal } from '../../actions/insurance'
import { getSourcesInfo, resetSourcesInfo, updateSeat, updateCC, updateCity, updateCar, updatePlate, updatePrice, /*updateFinalRate,*/ updatePayment, updateTerm, updateTax} from '../../actions/sources'
import { updateResultLoan  } from '../../actions/result'
import { getFeeByTerm, validatorFinalRate, historyReplaceCity } from '../../util'

class Loan extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount(){
    // 与header中城市空间联动，不单独检测city change, 全部在selCityCallback中处理
    window.selCityCallback = ({cityId : id, cityName: name}) => this.changeCity({id,name})
  }

  submitHandler(){
    const source = initData.source ? `?source=${initData.source}` : ''
    this.props.updateResultLoan({
      price: this.props.price,
      payment: this.props.payment,
      cc: this.props.cc,
      seat:this.props.seat,
      plate:this.props.plate,
      insurance:this.props.insurancePrice,
      tax:this.props.tax,
      term: this.props.term,
      // finalrate: this.props.finalrate,
      link: `${initData.baseUrl}/${this.props.city.spell}/${this.props.car.spell}/m${this.props.car.id}${source}`
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
          inline />

        <FormItem 
          label="4S店平均报价:" 
          type="text" 
          value={this.props.price} 
          onChange={this.props.updatePrice} 
          inline 
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
          onChange={this.props.updatePayment}/>

        <FormItem 
          label="贷款期限" 
          type="checkbox" 
          options={this.props.termOptions} 
          value={this.props.term} 
          icon="false" 
          disabled={!this.props.car.id}
          onChange={this.changeTermHandler.bind(this)}/>

        {/*<FormItem 
          label="尾款比例" 
          type="text" 
          format="rate"
          value={this.props.finalrate} 
          disabled={!this.props.car.id}
          validator={validatorFinalRate.bind(this,this.props.payment)}
          onChange={this.props.updateFinalRate}/>*/}

        <FormItem 
          label="贷款利率" 
          type="switchSelect" 
          options={this.props.taxOptions} 
          value={this.props.tax} 
          onChangeSelect={this.switchTax.bind(this)}
          onChange={this.changeTaxValue.bind(this)}
          disabled={!this.props.car.id}/>

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
          <h3>填写信息</h3>
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
    result: state.result.loan,
    tips: state.tips
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
    updateResultLoan: bindActionCreators(updateResultLoan, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Loan)