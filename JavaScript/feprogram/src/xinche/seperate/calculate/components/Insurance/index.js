import './index.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Select} from '../Form'
import { updateInsurance, closeInsuranceModal } from '../../actions/insurance'
import {formatPrice} from '../../util'

class Insurance extends React.Component {
  constructor (props) {
    super(props)
    this.state = this.propsMapToState(props)
  }

  propsMapToState(props){
    const glassOptions = [
      {label : '国产', value: props.price*0.001235},
      {label : '进口', value: props.price*0.002015}
    ]

    return {
      tabs: ['经济型', '大众型', '豪华型'],

      total: 0,

      type: props.type,

      glassOptions:glassOptions,

      glassType: props.glassType,

      glass:glassOptions[props.glassType].value,

      // 三者20万
      t20: 812.53,

      // 三者50万
      t50: 1100.32,

      // 司机乘客1万
      driver: 108.39,

      // 车上人员2万
      member: 216.78,

      // 划痕5000
      scratch: 370,

      // 车损
      loss : props.price*0.02185,

      // 盗抢
      steal: 93.6+props.price*0.003445*1.20,

      // 发动机涉水
      water: props.price*0.02185*0.05,

      // 车损无法找到第三方
      nofound: props.price*0.02185*0.025
    }
  }

  componentWillReceiveProps(props){
    this.setState(this.propsMapToState(props), () => this.updateTotal(this.syncData))
  }

  updateTotal(callback){
    let total
    switch(this.state.type){
        case 0:
          total =  Math.round(this.state.loss + this.state.t20)
          break
        case 1:
          total =  Math.round(this.state.loss + this.state.t50 + this.state.steal + this.state.driver + this.state.glass)
          break
        case 2:
          total =  Math.round(this.state.loss + this.state.t50 + this.state.steal + this.state.member + this.state.glass + this.state.scratch + this.state.water + this.state.nofound)
          break
      }
    this.setState({total}, callback || function(){})
  }

  setType(key){
    this.setState({type:key},this.updateTotal)
  }

  changeGlass(glass){
    this.state.glassOptions.forEach((item, key) => {
      if(item.value === glass){
        this.setState({glass, glassType: key},this.updateTotal)
      }
    })
  }

  submit(){
      this.syncData()
      this.props.closeInsuranceModal()
  }

  syncData(){
    this.props.updateInsurance({total:this.state.total, type: this.state.type, glassType: this.state.glassType})
  }

  buildElement(name, key, condition=[0,1,2]){
    let judge = false
    const postfix = key === 'glass' ? <div className="insurance-select"><Select options={this.state.glassOptions} value={this.state.glass} onChange={this.changeGlass.bind(this)}  searchable={false}/></div> : ''

    Array.prototype.concat(condition).forEach(value => {
      if(value === this.state.type){
        judge = true
      }
    })


    if(judge){
      return <li><label>{name}</label><div className="insurance-item"><em>{formatPrice(this.state[key])}</em></div>{postfix}</li>
    }else{
      return ''
    }
  }

  render () {

    if(!this.props.open){
      return <div></div>
    }

    return (
      <div className="insurance-modal" id="insurance">
        <div className="modal">
          <div className="insurance-close" onClick={this.props.closeInsuranceModal}></div>
          <div className="insurance-header">
            <ul>
              {
                this.state.tabs.map((val, key) => <li className={key === this.state.type ? 'active' : ''} onClick={this.setType.bind(this, key)}>{val}</li>)
              }
            </ul>
            <div className="insurance-summary">
              <span>总金额：</span>
              <em>{formatPrice(this.state.total)}</em>
              <span>元</span>
              <i>(参考平均报价)</i>
            </div>
          </div>
          <div className="insurance-content">
            <div className="insurance-content-left">
              <ul>
                {this.buildElement('车损', 'loss')} 
                {this.buildElement('三者20万', 't20', 0)}
                {this.buildElement('三者50万', 't50', [1,2])} 
                {this.buildElement('盗抢', 'steal', [1,2])} 
                {this.buildElement('司机乘客1万', 'driver', 1)} 
                {this.buildElement('车上人员2万', 'member', 2)} 
                {this.buildElement('划痕5000', 'scratch', 2)} 
                {this.buildElement('发动机涉水', 'water', 2)} 
                {this.buildElement('车损无法找到第三方', 'nofound', 2)} 
                {this.buildElement('玻璃', 'glass', [1,2])} 
              </ul>
            </div>
            <div className="insurance-content-right">
              <button onClick={this.submit.bind(this)}>确定</button>
            </div>
          </div>
        </div>
        <div className="cover"></div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    price: state.sources.price,
    type: state.insurance.type,
    glassType: state.insurance.glassType,
    // total: state.insurance.total,
    open: state.insurance.open
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateInsurance: bindActionCreators(updateInsurance, dispatch),
    closeInsuranceModal: bindActionCreators(closeInsuranceModal, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Insurance)