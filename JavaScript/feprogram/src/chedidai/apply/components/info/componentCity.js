import React from 'react'
import 'libs/selCity'

class City extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: props.text || '请选择车辆所在地'
    }
  }

  componentDidMount(){
    $("#city").selCity({
      isSetCookie: false,
      callBacks: (item) => {
        this.setState({name:item.cityName})
        this.props.onChange(item.cityId)
      }
    })
  }

  render () {
    const clsName ='form-item form-select' + (this.props.disabled?" disabled":"");
    return (
    	<div className={clsName}>
        <label>车辆所在地</label>
        <div className="content">
        <span style={{position:'relative'}}>
          <span className="mask-layer" style={{'display':this.props.disabled?"":"none"}}></span>
          <span className={this.props.value ? 'text' : 'text text-no-value'} id="city">{this.state.name}</span>
          </span>
          {
            this.props.valid ? '' : <i className="warning" style={{position:'absolute', left: '422px', top:'10px', 'whiteSpace': 'noWrap'}}>请选择</i>
          }
        </div>
      </div>
    )
  }
}

export default City