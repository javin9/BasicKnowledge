import './index.scss'
import React from 'react'

export default class Checkbox extends React.Component {
  constructor (props) {
    super(props)
  }

  clickHandler(value){
    if(!this.props.disabled){
    	if(typeof this.props.onChange === 'function'){
    		this.props.onChange(value)
    	}
    }
  }

  render () {
    return (
    	<div>
    		{this.props.options.map(item => {
			  	let ClassName = ['Checkbox']

			  	if(item.value === this.props.value && !this.props.disabled){
			  		ClassName.push('Checkbox-active')
			  	}

			  	if(this.props.icon === 'false'){
			  		ClassName.push('Checkbox-no-icon')
			  	}

          if(this.props.disabled){
            ClassName.push('disabled')
          }

    			return <em className={ClassName.join(' ')} onClick={this.clickHandler.bind(this, item.value)}>{item.label}</em>
    		})}
    	</div>
    )
  }
}