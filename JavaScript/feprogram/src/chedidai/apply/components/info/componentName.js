import React from 'react'

class Name extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      focused: false
    }
  }

  onChange(e){
    this.props.onChange(e.target.value)
  }

  render () {
    const valid = this.props.valid || this.state.focused
    return (
      <div className={valid ? 'form-item' : 'form-item form-item-error'}>
        <label>姓名</label>
        <div className="content">
          <input type="text" placeholder="请输入姓名" maxLength="8" size="8" value={this.props.value} onChange={this.onChange.bind(this)} onFocus={()=>this.setState({focused:true})} onBlur={()=>this.setState({focused: false})}/>
          {
            valid ? '' : <i className="warning">请输入正确的姓名</i>
          }
        </div>
      </div>
    )
  }
}

export default Name