import './index.scss'
// import 'libs/selCity'
import React from 'react'

export default class CitySelect extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount(){
  	const $city = $('#city-select')

  	const cb = item => {
  		$city.val(item.cityName)

			if(typeof this.props.onChange === 'function'){
				this.props.onChange({
          id:item.cityId, 
          name: item.cityName, 
          spell: item.citySpell
        })
			}
  	}

  	$city.selCity({
			callBacks: cb.bind(this),
      isRelationHeader: true
		})
  }

  clickHandler(value){
  }

  render () {
    return (
    	<div className="city-wrapper">
    		<input type="text" id="city-select" value={this.props.value}  autoComplete="false" readOnly/>
    	</div>
    )
  }
}