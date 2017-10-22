import React from 'react'

class Mortgage extends React.Component {
	constructor (props) {
    super(props)

    this.state = {
    	timedown:0,
    	int:''
    }
  }

  clickHandler(value){
  	this.props.onClick(value)
  	if(value){
  		this.setState({
  			timedown: 2,
  			int:setInterval(() => {
	  			const timedown = this.state.timedown - 1
	  			if(!timedown){
	  				clearInterval(this.state.int)
	  			}
		  		this.setState({timedown:this.state.timedown - 1})
	  		}, 1000)
  		}) 
  	}else{
  		clearInterval(this.state.int)
  		this.setState({timedown:0})
  	}
  }

  render () {
  	return (
	  	<div className="form-item component-mortgage">
	        <label>抵押状态</label>
	        <div className="content">
          <span onClick={this.clickHandler.bind(this, false)}>
            <b className={!this.props.value ? 'selected' : ''}></b>
            <i>无抵押</i>
          </span>
	        <span onClick={this.clickHandler.bind(this, true)} className="last">
				<b  className={this.props.value ? 'selected' : ''}></b>
				<i>有抵押</i>
				<span className="hover-tip">(已抵押车辆不可贷款)</span>
	          </span>
	        </div>
	      </div>
	    )
  }
}

export default Mortgage