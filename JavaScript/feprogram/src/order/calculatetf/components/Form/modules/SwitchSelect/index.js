import './index.scss'
import React from 'react'
import Select from '../Select'
import Text from '../Text'

export default class SwitchSelect extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      tip: this.getTipByValue(props.value.type)
    }
  }

  getTipByValue(value){
    return this.props.options.filter(option => option.value === value)[0].tip
  }

  changeSwitchHandler(value){
    this.setState({tip: this.getTipByValue(value)})
    this.props.onChangeSelect(value)
  }

  changeTextHandler(value){
    this.setState({tip: ''})
    this.props.onChange(value)
  }

  render () {
    return (
      <div>
        <div className="SwitchSelect">
          <div className="SwitchSelect-Select">
            <Select options={this.props.options} onChange={this.changeSwitchHandler.bind(this)}  placeholder="" value={this.props.value.type} searchable={false} disabled={this.props.disabled}/>
          </div>
          <div className="SwitchSelect-Text">
            {this.props.disabled ? 
              <Text value='' disabled format="percent"/> : 
              <Text value={this.props.value.value} format="percent" onChange={this.changeTextHandler.bind(this)}/>
            }
          </div>
        </div>
        <p className="Switch-tip">{this.state.tip || ' '}</p>
      </div>
    )
  }
}