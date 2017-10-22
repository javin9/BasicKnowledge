import React, {PropTypes} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Links from '../Links'
import Chart from '../Chart'
import {Tip} from '../Form'
import {formatPrice} from '../../util'

class ResultLoan extends React.Component {
  constructor (props) {
    super(props)
  }

  format(value){
    if(this.props.data.initial){
      return formatPrice(value)
    }else{
      return '¥ --'
    }
  }

  pmt(i, n, p) {
   return i * p * Math.pow((1 + i), n) / (1 - Math.pow((1 + i), n))
  }

  render () {
    const _data = this.props.data
    const {plate, seat, insurance, price, cc, payment, tax={}, term/*, finalrate*/} = _data.initial?_data.extendsData:_data

    // 贷款尾款
    // const finalPayment = price * finalrate/100

    // 购置税
    const ptax = price/(1+0.17)*(cc <= this.props.ccLevel ? 0.075 : 0.1)

    // 必要花费
    const mustcost = Math.round(ptax + plate + cc + seat)

    // 首付
    const pay = price * payment / 100

    // 首次花费
    const firstPay = pay + mustcost + insurance

    // 贷款额度
    const loan = price - pay

    // 全款
    const full = mustcost + insurance + price

    // 月供
    const monthPayment = Math.round(tax.type === 1 ? ((price * (1 - payment / 100)) * (1 + tax.value / 100)) / term : this.pmt(tax.value/100/12, term, -loan))

    // 贷款成本
    const loanCost = monthPayment*term-loan

    const chartData = [pay, loan, loanCost, mustcost]

    // 总花费
    // 车价+贷款成本+必要花费+商业保险
    const total = price + loanCost + mustcost + insurance

    return (
      <div className="result-loan">
        <div className="result-header">
          {_data.initial ? <Chart data={chartData}/> : <div className="default-chart"></div>}
          <div className="result-info">
            <h5><span>月供</span><em>{this.format(monthPayment)}</em></h5>
            <h6><span>首次花费</span><em>{this.format(firstPay)}</em></h6>
            <p>(首次花费：首付＋必要花费＋商业保险)</p>
          </div>
        </div>
        <div className="result-content">
        <div className="result-title result-line"><i className="icon-circle-1"></i><label>首付</label><em>{this.format(pay)}</em></div>
        <div className="result-title result-line"><i className="icon-circle-2"></i><label>贷款额度</label><em>{this.format(loan)}</em></div>
        <div className="result-title result-line"><i className="icon-circle-3"></i><label>贷款成本</label><em>{this.format(loanCost)}</em></div>
          {/*
            finalPayment ? <div className="result-line"><label>贷款尾款</label><em>{this.format(finalPayment)}</em></div> : ''
          */}
          <div className="result-title result-line"><i className="icon-circle-4"></i><label>必要花费</label><em>{this.format(mustcost)}</em></div>
          <div className="result-line">
            <label>购置税</label>
            <em>{this.format(ptax)}</em>
            {_data.initial ? <b>（裸车价格÷（1＋17％）× {cc <= this.props.ccLevel ? '7.5%' : '10%'}）</b> : ''}
            {_data.initial ? <Tip title="购置税" content={this.props.ptaxTip}/> : ''}
          </div>
          <div className="result-line"><label>上牌费</label><em>{this.format(plate)}</em></div>
          <div className="result-line"><label>车船税</label><em>{this.format(cc)}</em></div>
          <div className="result-line"><label>交强险</label><em>{this.format(seat)}</em></div>
          <div className="result-title result-line"><label>总花费</label><em>{this.format(total)}</em></div>
          {_data.initial ? <Links link={_data.extendsData.link}/> : <Links disabled/>}
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    ptaxTip: state.tips.ptax,

    // 1.6升分隔界限
    ccLevel: state.options.cc[1].value
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultLoan)