import './index.scss'
import React from 'react'
import Mask from '../../components/mask'

class CarReplaceModal extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    	selected : 0,
    	view: 'list',
    	selectedCar: {
    		carName: '',
    		carId : '',
        carYear: ''
    	}
    }
  }

  formatCarName(one){
  	return `${one.MakeName}${one.ModelName} ${one.StyleYear}款 ${one.StyleName}`
  }

  selectCar(one){
  	this.setState({
  		selectedCar: {
	  		carName: this.formatCarName(one),
	  		carId: one.StyleId,
        carYear: one.StyleYear
  		}
  	})
  }

  changeView(view){
    if(view === 'confirm' && !this.state.selectedCar.carId){
      this.selectCar(this.props.list[0])
    }

  	this.setState({
  		view
  	})
  }

  render () {
  	const listView = <div className="list">
	        <h6>请选择车型</h6>
	        <div className="code">{this.props.vin}</div>
	        <ul>
	          {
	            this.props.list.map((one, key) => <li onClick={this.selectCar.bind(this, one)}><i className={!this.state.selectedCar.carId && key === 0 ||  this.state.selectedCar.carId === one.StyleId ? 'selected' : ''}></i><span>{this.formatCarName(one)}</span></li>)
	          }
	        </ul>
	        <button onClick={this.changeView.bind(this, 'confirm')}>确认</button>
	      </div>

	   const confirmView = <div className="confirm">
      		<h6>您所选车型与已输入车型不符是否替换？<a href="javascript:void(0)" className="close" onClick={this.props.onClose}></a></h6>
		      <div class="info">
		        <dl v-if="carName">
		          <dt>已输入车型：</dt>
		          <dd>{this.props.carName}</dd>
		        </dl>
		        <dl>
		          <dt>VIN选择车型:</dt>
		          <dd>{this.state.selectedCar.carName}</dd>
		        </dl>
		      </div>
		      <footer>
		        <a href="javascript:void(0)" onClick={()=>this.props.confirm(this.state.selectedCar)}>确认替换</a>
		        <a href="javascript:void(0)" onClick={this.changeView.bind(this, 'list')} className="reset-btn">重新选择</a>
		      </footer>
		    </div>

      const style = {
        marginTop: this.state.view === 'list' ? `-${(Math.min(this.props.list.length,5)*72+250)/2}px` : '-150px'
      }

		    return <div><Mask></Mask><div className="component-car-replace-modal" style={style}>{this.state.view === 'list' ? listView : confirmView}</div></div>
  }
}

export default CarReplaceModal