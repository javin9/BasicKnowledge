import React from 'react'

class Mileage extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      focused: false
    }
  }

  changeHandler(e){
    const value = e.target.value
    if(/^(?:\d+(\.(?:\d{1,2})?)?)?$/.test(value)){
        if(Number(value)>=0 && Number(value)<100){
            this.props.onChange(value)
        }
    }
  }

  render () {
    const labelStyle = {
      'position': 'absolute',
      'lineHeight': '40px',
      'textAlign': 'right',
      'left':'300px',
      'width': '100px'
    }

    const valid = this.props.valid || this.state.focused
    const clsName ='form-item' + (valid ?'': ' form-item-error') + (this.props.disabled?" disabled":"");
    return (
    	<div className={clsName}>
        <label>行驶里程</label>
        <div className="content">
          <input type="text" maxLength="5" size="5" disabled={this.props.disabled} placeholder="请输入行驶里程" value={this.props.value} onChange={this.changeHandler.bind(this)}  onFocus={()=>this.setState({focused:true})} onBlur={()=>this.setState({focused: false})}/>
          <span style={labelStyle}>万公里</span>
          {
            valid ? '' : <i className="warning">请填写0-100之间的数字，最多两位小数</i>
          }
        </div>
      </div>
    )
  }
}

export default Mileage