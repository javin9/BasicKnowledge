import './index.scss'
import React from 'react'
import {baseProps} from '../../util'
import {Map, fromJS} from 'immutable'
import check from 'libs/check'

class FormModal extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      interface: baseProps('interface'),
      data: fromJS({
        referName: {
          value: '',
          error: false,
          defaultError: '请输入真实姓名',
          valid(value){
            return dev || check.isName(value)
          }
        },
        referTel: {
          value: '',
          error: false,
          defaultError: '请输入正确的手机号',
          valid(value){
            return dev || check.isPhoneNumber(value)
          }
        },
        referNo: {
          value: '',
          error: false,
          defaultError: '请输入正确的联名卡号',
          valid(value){
            return dev || /^(622918|622919)\d{10}/.test(value)
          }
        },
        recommendName: {
          value: '',
          error: false,
          defaultError: '请输入真实姓名',
          valid(value){
            return dev || check.isName(value)
          }
        },
        recommendTel: {
          value: '',
          error: false,
          defaultError: '请输入正确的手机号',
          valid(value){
            return dev || check.isPhoneNumber(value)
          }
        }
      })
    }
  }

  componentWillMount(){
  }

  submit(){
    const value = key => this.state.data.getIn([key, 'value'])

    const params = {
        ReferName: value('referName'),
        ReferTel: value('referTel'),
        ReferNo: value('referNo'),
        RecommendName: value('recommendName'),
        RecommendTel: value('recommendTel')
    }
    $.post(this.state.interface, params, res=>{
      if(res.Result){
        this.props.close()
        this.props.submit()
      }else{
        tools.showAlert(res.Message, 1500, false)
      }
    },'json')
  }

  blurHandler(e){
    const key = e.target.name
    const value = e.target.value
    const valid = this.state.data.getIn([key, 'valid'])(value)

    this.setState(({data}) => ({
      data: data.updateIn([key, 'error'], () => !valid)
    }))
  }

  focusHandler(e){
    const key = e.target.name
    this.setState(({data}) => ({
      data: data.updateIn([key, 'error'], () => false)
    }))
  }

  changeHandler(e){
    const key = e.target.name
    const value =e.target.value
    const type = e.target.type

    if(type === 'tel' && /[^\d]/.test(value)){
      return false
    }

    this.setState(({data}) => ({
      data: data.updateIn([key, 'value'], () => value)
    }))
  }

  // >ie8控制中文限制
  compositionEndHandler(e){
    const key = e.target.name
    const value = e.target.value
    this.setState(({data}) => ({
      data: data.updateIn([key, 'value'], () => value.replace(/[^\u4e00-\u9fa5]/g,'').slice(0,8))
    }))
  }

  render () {
    const enabledSubmit = this.state.data.reduce((r, item) => r && item.get('valid')(item.get('value')), true)

    return (
    	this.props.show ? 
      <div className="component-form-modal">
	      <h3>推荐信息</h3>
	      <span 
          className="component-form-modal-close" 
          onClick={this.props.close}
        ></span>
        <section>
          <h6>推荐人信息</h6>
          <dl>
            <dt>姓名</dt>
            <dd className={this.state.data.getIn(['referName', 'error']) ? 'has-error' : ''}>
              <input 
                placeholder="请输入推荐人真实姓名" 
                type="text" 
                value={this.state.data.getIn(['referName', 'value'])} 
                name="referName" 
                maxLength="8"
                onChange={this.changeHandler.bind(this)} 
                onFocus={this.focusHandler.bind(this)} 
                onBlur={this.blurHandler.bind(this)}
                onCompositionEnd={this.compositionEndHandler.bind(this)}
              />
              <p>{this.state.data.getIn(['referName', 'defaultError'])}</p>
            </dd>
          </dl>
          <dl>
            <dt>手机号</dt>
            <dd className={this.state.data.getIn(['referTel', 'error']) ? 'has-error' : ''}>
              <input 
                placeholder="请输入推荐人手机号" 
                type="tel" 
                value={this.state.data.getIn(['referTel', 'value'])} 
                name="referTel" 
                maxLength="11" 
                onChange={this.changeHandler.bind(this)} 
                onFocus={this.focusHandler.bind(this)} 
                onBlur={this.blurHandler.bind(this)}
              />
              <p>{this.state.data.getIn(['referTel', 'defaultError'])}</p>
            </dd>
          </dl>
          <dl>
            <dt><span>联名卡号</span><em><i></i></em></dt>
            <dd className={this.state.data.getIn(['referNo', 'error']) ? 'has-error' : ''}>
              <input 
                placeholder="请输入推荐人联名卡号" 
                type="tel" 
                value={this.state.data.getIn(['referNo', 'value'])} 
                name="referNo" 
                maxLength="16" 
                onChange={this.changeHandler.bind(this)} 
                onFocus={this.focusHandler.bind(this)} 
                onBlur={this.blurHandler.bind(this)}
              />
              <p>{this.state.data.getIn(['referNo', 'defaultError'])}</p>
            </dd>
          </dl>
        </section>
        <section>
          <h6>被推荐人信息</h6>
          <dl>
            <dt>姓名</dt>
            <dd className={this.state.data.getIn(['recommendName', 'error']) ? 'has-error' : ''}>
              <input 
                placeholder="请输入被推荐人真实姓名" 
                type="text" 
                maxLength="8"
                value={this.state.data.getIn(['recommendName', 'value'])} 
                name="recommendName" 
                onChange={this.changeHandler.bind(this)} 
                onFocus={this.focusHandler.bind(this)} 
                onBlur={this.blurHandler.bind(this)}
              />
              <p>{this.state.data.getIn(['recommendName', 'defaultError'])}</p>
            </dd>
          </dl>
          <dl>
            <dt>手机号</dt>
            <dd className={this.state.data.getIn(['recommendTel', 'error']) ? 'has-error' : ''}>
              <input 
                placeholder="请输入被推荐人手机号" 
                type="tel" 
                value={this.state.data.getIn(['recommendTel', 'value'])} 
                name="recommendTel" 
                maxLength="11"  
                onChange={this.changeHandler.bind(this)} 
                onFocus={this.focusHandler.bind(this)} 
                onBlur={this.blurHandler.bind(this)}
              />
              <p>{this.state.data.getIn(['recommendTel', 'defaultError'])}</p>
            </dd>
          </dl>
          <dl>
            <dt>&nbsp;</dt>
            <dd>
              <a 
                href="javascript:void(0)" 
                onClick={enabledSubmit ? this.submit.bind(this) : function(){}} 
                className={enabledSubmit ? '' : 'disabled'}
              >提交</a>
            </dd>
          </dl>
        </section>
      </div>
      : <div></div>
    )
  }
}

export default FormModal