import './index.scss'
import React from 'react'

class Select extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      option: false,
      value: props.value
    }

    $(window).on('closeSelect', () => {
      this.setState({
        option: false
      })
    })

    $(window).on('click', e => {
      if(!$(e.target).closest('.component-select').length){
        this.closeBroadcast()
      }
    })
  }

  componentWillReceiveProps(props){
    this.setState({
      value: props.value
    })
  }

  closeBroadcast(){
    $(window).trigger('closeSelect')
  }

  getText(value){
    return this.props.options.filter(item => item.value === value)[0].text
  }

  change(option){
    this.setState({
      option: false,
      value: option.value
    })

    if(this.props.onChange){
      this.props.onChange(option)
    }
  }

  toggle(){
    this.closeBroadcast()
    this.setState({option: !this.state.option})
  }

  render () {
    return (
    	<div className="component-select">
      <div className="component-select-input" onClick={this.toggle.bind(this)}>
        {
          this.state.value !== '' && this.props.options.length ? this.getText(this.state.value) : <i>请选择</i>
        }
      </div>
      {
        this.state.option ? <div className={this.props.options.length > 15 ? 'component-select-options component-select-options-scroll' : 'component-select-options'}>
        <ul>
          {
            this.props.options.map(item => (
              <li>
                <a href="javascript:void(0)" onClick={this.change.bind(this, item)}>{item.text}</a>                  
              </li>
              ))
          }
        </ul>
      </div>: ''
      }
    	</div>
    )
  }
}

export default Select