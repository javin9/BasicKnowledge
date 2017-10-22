import React, {PropTypes} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Links from '../Links'
import {Tip} from '../Form'
import {formatPrice} from '../../util'

class ResultFull extends React.Component {
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

  render () {
    const {plate, seat, insurance, price, cc} = this.props.data

    // 购置税
    const ptax = price/(1+0.17)*(cc <= this.props.ccLevel ? 0.075 : 0.1)

    const total = plate + seat + insurance + price + cc + ptax

    return (
      <div className="result-full">
        <h6><label>总花费</label><em>{this.format(total)}</em></h6>
        <div className="result-line"><label>车价</label><em>{this.format(price)}</em></div>
        <div className="result-line">
          <label>购置税</label>
          <em>{this.format(ptax)}</em>
          {this.props.data.initial ? <b>（裸车价格÷（1＋17％）× {cc <= this.props.ccLevel ? '7.5%' : '10%'}）</b> : ''}
          {this.props.data.initial ? <Tip title="购置税" content={this.props.ptaxTip}/> : ''}
        </div>
        <div className="result-line"><label>上牌费</label><em>{this.format(plate)}</em></div>
        <div className="result-line"><label>车船税</label><em>{this.format(cc)}</em></div>
        <div className="result-line"><label>交强险</label><em>{this.format(seat)}</em></div>
        <div className="result-line"><label>商业保险</label><em>{this.format(insurance)}</em></div>
        {this.props.data.initial ? <Links link={this.props.data.link}/> : <Links disabled/>}
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

export default connect(mapStateToProps, mapDispatchToProps)(ResultFull)