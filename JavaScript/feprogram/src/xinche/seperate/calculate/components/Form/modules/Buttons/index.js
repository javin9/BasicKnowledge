import './index.scss'
import React from 'react'

export default class Buttons extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {

    const ButtonSubmit = this.props.disabled ? <span className="Buttons-submit disabled">开始计算</span> : <a className="Buttons-submit" onClick={this.props.submit}>开始计算</a>
    const ButtonReset = this.props.disabled ? <span className="Buttons-reset disabled">清空重填</span> : <a className="Buttons-reset" onClick={this.props.reset}>清空重填</a>

    return (
      <div className="Buttons">
        {ButtonSubmit}
        {ButtonReset}
      </div>
    )
  }
}