import './index.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import Nav from './components/nav'
import Map from './components/map'
import List from './components/list'
import 'libs/home_page_ad'
class Page extends React.Component {
	constructor (props) {
		super(props)

		this.state = {
			provinceId:0,
			cityId:0,
			total:0,
			list:[],
			selectedMarker: 0,
			joinUrl:'/joinus.htm'
		}
	}

	componentDidMount(){
		$('#tiyandian_index').addClass('current').siblings().removeClass('current')
	}

	changeProvinceCityHandler(provinceId, cityId){
		this.setState({
			provinceId,
			cityId
		})
	}

	changeListHandler(total,list){
		this.setState({total, list})
	}

	selectMarkerHandler(index){
		this.setState({
			selectedMarker: index
		})
	}

	render(){
		const containerStyle = {
			width: '1200px',
			margin:'20px auto 60px'
		}

		const sectionStyle = {
			marginTop: '14px',
			overflow:'hidden'
		}

		const mapZoom = 5 + (this.state.provinceId ? 6 : 0) + (this.state.cityId ? 5 : 0)

		return <div className="container" style={containerStyle}>
			<Nav 
				onChange={this.changeProvinceCityHandler.bind(this)} 
				provinceId={this.state.provinceId} 
				cityId={this.state.cityId}
				total={this.state.total}
				joinUrl={this.state.joinUrl}></Nav>
			<section style={sectionStyle}>
				<Map 
					zoom={mapZoom} 
					markers={this.state.list}
					current={this.state.selectedMarker}
					onClick={this.selectMarkerHandler.bind(this)}></Map>
				<List 
					provinceId={this.state.provinceId} 
					cityId={this.state.cityId}
					onChange={this.changeListHandler.bind(this)}
					onClick={this.selectMarkerHandler.bind(this)}
					current={this.state.selectedMarker}></List>
			</section>
		</div>
	}
}

ReactDOM.render(
	<Page></Page>,
	document.getElementById('app')
	)