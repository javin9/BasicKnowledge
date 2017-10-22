import './index.scss'
import React from 'react'
import Select from '../select'

class Nav extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      provinces: [],

      citys: this.getDefaultCitys(),

      areaName: '全国'
    }
  }

  componentDidMount(){
    this.getProvinces()
  }

  getDefaultCitys(){
    return [{text:'全国', value:0}]
  }

  getProvinces(){
    $.getJSON(`${window.APIURL}api/ExperienceStore/GetProvinceList?callback=?`, res => {
      if(res.Result){
        this.setState({
          provinces: [{text:'全国', value:0}].concat(res.Data.map(item => {
            return {
              text: item.Name,
              value: item.ID
            }
          }))
        })
      }else{
          tools.showAlert(res.Message)
      }
    })
  }

  getCitys(provinceId){
    // 全国
    if(provinceId === 0){
      this.setState({
        citys: this.getDefaultCitys()
      })
    }else{
      $.getJSON(`${window.APIURL}api/ExperienceStore/GetCityList?callback=?`, {provinceId}, res => {
        if(res.Result){
          this.setState({
            citys: res.Data.map(item => {
              return {
                text: item.Name,
                value: item.ID
              }
            })
          })

          if(res.Data.length === 1 && this.isDirectProvince(res.Data[0].Name)){
            this.props.onChange(this.props.provinceId, res.Data[0].ID)
          }
        }else{
            tools.showAlert(res.Message)
        }
      })
    }
  }

  // 是否直辖市
  isDirectProvince(name){
    return /北京|天津|上海|重庆/.test(name)
  }

  changeProvince(province){
    this.getCitys(province.value)
    this.setState({areaName: province.text})
    this.props.onChange(province.value, province.value === 0 ? 0 : '')
  }

  changeCity(city){
    this.setState({areaName: city.text})
    this.props.onChange(this.props.provinceId, city.value)
  }

  render () {
    return (
    	<div className="component-nav">
        <Select 
          options={this.state.provinces} 
          onChange={this.changeProvince.bind(this)} 
          value={this.props.provinceId}>省份</Select>
        <Select 
          options={this.state.citys} 
          onChange={this.changeCity.bind(this)} 
          value={this.props.cityId}>城市</Select>
	    	<span>{this.state.areaName}<strong>{this.props.total}家</strong>门店，欢迎您光临体验！<a href={this.props.joinUrl} target="_blank">易鑫体验店合作商招募</a></span>
    	</div>
    )
  }
}

export default Nav