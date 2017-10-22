import './index.scss'
import React from 'react'

export default class Tip extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
    	<span className="Tip">
    		<div className="Tip-popup">
	    		<h6>{this.props.title}</h6>
	    		<p>{this.props.content}</p>
    		</div>
    	</span>
    )
  }
}
