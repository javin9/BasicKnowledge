import './index.scss'
import React from 'react'
import {formatPrice, validator, formatPercent, getCode} from '../../../../util'

export default class Text extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    	value : this.format(props.value),
      message:''
    }
  }

  componentWillReceiveProps(props){
    this.setState({
      value : this.format(props.value)
    })
  }

  format(value){
  	if(this.props.format === 'price'){
  		return formatPrice(value)
  	}

  	if(this.props.format === 'rate'){
  		return Math.round(value)
  	}

    if(this.props.format === 'percent'){
      return formatPercent(value)
    }

    return value
  }

  getOriginValue(value){
    // if(value){
      return +value.replace(/[^\d\.]/g, '').split('.').slice(0,2).join('.')
    // }
  }

  changeHandler(){
    const validator = this.props.validator || (() => {return {valid:true}})
  	let value = this.props.format === 'tel' || this.props.format === 'code' ? this.state.value : this.getOriginValue(this.state.value)
    const valid = validator(value)

    if(!valid.valid){
      value = valid.correct
      this.setState({message: valid.message})
      this.clearMessage()
    }

    this.setState({value: this.format(value)})

  	if(typeof this.props.onChange === 'function'){
  		this.props.onChange(value)
  	}
  }

  clearMessage(){
    setTimeout(() => this.setState({'message': ''}), 2000)
  }

  setValue(e){
    this.setState({value:e.target.value})
  }

  getValidecode() {
    if(this.state.value) 
      getCode(this.state.value)
  }

  render () {
    return (
    	<div className={`Text Text-${this.props.format}`}>
        {
          this.props.disabled 
          ? <input id={this.props.telId} value={this.props.disabledValue || ''}  disabled className={this.props.disabledTheme ? `disabled-${this.props.disabledTheme}` : 'disabled'} placeholder={this.props.placeholder}/> 
          : <input id={this.props.telId} value={this.state.value} onChange={this.setValue.bind(this)} onBlur={this.changeHandler.bind(this)} placeholder={this.props.placeholder} maxLength={this.props.maxlength}/>
        }

        {this.props.getcode ? <p className="Text-tips">*我们会将计算结果以短信的形式发送到您的手机</p> : ''}
        {this.props.getcode ? <div id="GetValidateCode" className={`${this.props.getcode} ${!this.state.value?'disabled':''}`} onClick={this.getValidecode.bind(this)}>获取验证码</div> : ''}
        {this.state.message ? <div className="Text-error">{this.state.message}</div> : ''}
    	</div>
    )
  }
}