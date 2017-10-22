import React from 'react'
import 'libs/carSelect/selCarThird.pc'

class Car extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount(){
    if(!this.props.readonly){
      $('#car').selCar2({
        OnlyOnSale:false,
        Callback: (item) => {
          this.props.onChange({
            id: item.data('id'),
            name:item.data('fullname'),
            year: item.data('year')
          })
        }
      })
    }
  }

  render () {
    const clsName ='form-item' + (this.props.readonly ?'': ' form-select') + (this.props.disabled?" disabled":"");
    return (
    	<div className={clsName}>
        <label>品牌车型</label>
        <div className="content" style={{position:'relative'}}>
          <span className="mask-layer" style={{'display':this.props.disabled?"":"none"}}></span>
          <span className={this.props.value ? 'text' : 'text text-no-value'} id="car" title={this.props.text || '请选择品牌车型'} style={{paddingRight:'50px'}}>{this.props.text || '请选择品牌车型'}</span>
          {
            this.props.valid ? '' : <i className="error"></i>
          }
        </div>
      </div>
    )
  }
}

export default Car