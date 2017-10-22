import './index.scss'
import 'libs/carSelect/selCarThird.pc'
import React from 'react'

export default class CarSelect extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount(){
  	const $car = $('#car-select')

  	const cb = item => {
      if(typeof this.props.onChange === 'function'){
        this.props.onChange({
          id: item.data('id'),
          name: item.data('fullname'),
          spell: item.data('spell')
        })
      }
  	}

  	$car.selCar2({
      OnlyOnSale:true,
			Callback: cb.bind(this)
		})
  }

  render () {
    return (
    	<div className="car-wrapper">
    		<input type="text" id="car-select" value={this.props.value ? this.props.value : '选择意向车型'}  autoComplete="false" readOnly className={this.props.value ? '' : 'empty'}/>
    	</div>
    )
  }
}