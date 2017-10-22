import './index.scss'
import React, {PropTypes} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Buttons, FormItem} from '../../components/Form'
import Result from '../../components/Result'
import Insurance from '../../components/Insurance'
import { openInsuranceModal } from '../../actions/insurance'
import { getSourcesInfo, resetSourcesInfo, updateSeat, updateCC, updateCity, updateCar, updatePlate, updatePrice  } from '../../actions/sources'
import { updateResultFull  } from '../../actions/result'
import {historyReplaceCity} from '../../util'

class Full extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount(){
    // 与header中城市空间联动，不单独检测city change, 全部在selCityCallback中处理
    window.selCityCallback = ({cityId : id, cityName: name}) => this.changeCity({id,name})
  }

  submitHandler(){
    const source = initData.source ? `?source=${initData.source}` : ''
    this.props.updateResultFull({
      price: this.props.price,
      plate: this.props.plate,
      cc: this.props.cc,
      seat: this.props.seat,
      insurance:this.props.insurancePrice,
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

  render () {

    const Info = <div className="info-full">
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
          label="上牌费" 
          type="text" 
          value={this.props.plate} 
          format="price" 
          onChange={this.props.updatePlate} 
          disabled={!this.props.car.id}
          labelTip={this.props.tips.plate}/>

        <FormItem 
          label="车船税" 
          type="select" 
          options={this.props.ccOptions} 
          value={this.props.cc} 
          onChange={this.props.updateCC} 
          disabled={!this.props.car.id}
          labelTip={this.props.tips.cc}/>

        <FormItem 
          label="交强险" 
          type="select" 
          options={this.props.seatOptions} 
          value={this.props.seat} 
          onChange={this.props.updateSeat} 
          disabled={!this.props.car.id}
          labelTip={this.props.tips.seat}/>

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
            <Result type="full" data={this.props.result} />
          </div>
        </div>
        <Insurance />
      </div>
    )
  }
}

Full.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    seat: state.sources.seat,
    seatOptions: state.options.seat,
    cc: state.sources.cc,
    ccOptions: state.options.cc,
    car: state.sources.car,
    city: state.sources.city,
    plate: state.sources.plate,
    price: state.sources.price,
    insurancePrice: state.insurance.total,
    result: state.result.full,
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
    updateResultFull: bindActionCreators(updateResultFull, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Full)