import './index.scss'
import React from 'react'
import Checkbox from '../Checkbox'
import Select from '../Select'
import Text from '../Text'
import CitySelect from '../CitySelect'
import CarSelect from '../CarSelect'
import SwitchSelect from '../SwitchSelect'
import Tip from '../Tip' 
import {formatPrice} from '../../../../util'

export default class FormItem extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {

    let FormItemContent

    const classname = this.props.labelbox ? 'FormItem FormItem-labelbox' : 'FormItem'

    const LabelTip = this.props.labelTip ? <Tip title={this.props.label} content={this.props.labelTip} /> : ''
    
    switch(this.props.type){
      case 'select' : 
        FormItemContent = <Select value={this.props.value} options={this.props.options} onChange={this.props.onChange}  placeholder="" noResultsText="没有可选项" searchable={false} disabled={this.props.disabled}/>
        break
      case 'checkbox':
        FormItemContent = <Checkbox options={this.props.options} value={this.props.value} icon={this.props.icon} onChange={this.props.onChange} disabled={this.props.disabled}/>
        break
      case 'citySelect':
        FormItemContent = <CitySelect value={this.props.value} onChange={this.props.onChange}/>
        break
      case 'carSelect':
        FormItemContent = <CarSelect value={this.props.value} onChange={this.props.onChange}/>
        break
      case 'text':
       FormItemContent = <Text telId={this.props.telId} value={this.props.value} format={this.props.format} onChange={this.props.onChange}  disabled={this.props.disabled} disabledTheme={this.props.disabledTheme} disabledValue={this.props.disabledValue} validator={this.props.validator} getcode={this.props.getcode} placeholder={this.props.placeholder} maxlength={this.props.maxlength}/>
       break
      case 'switchSelect':
        FormItemContent = <SwitchSelect value={this.props.value} options={this.props.options} onChange={this.props.onChange} onChangeSelect={this.props.onChangeSelect} tip={this.props.tip} disabled={this.props.disabled}/>
        break
      case 'staticInput':
        FormItemContent = <div className="StaticInput">
          {
            this.props.disabled 
            ? <span className="disabled"></span> 
            : <span onClick={this.props.onClick}>{formatPrice(this.props.value)}</span>
          }
        </div>
        break
    }

    return (
      <div className={classname}>
        <label>{this.props.label}{LabelTip}</label>
        <div className="FormItem-content">
          {FormItemContent}
        </div>
      </div>
    )
  }
}