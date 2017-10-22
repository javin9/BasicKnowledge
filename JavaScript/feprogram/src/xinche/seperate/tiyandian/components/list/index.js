import './index.scss'
import React from 'react'
import Pagination from '../pagination'
import { Scrollbars } from 'react-custom-scrollbars'

class List extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    	current: props.current || 0,
    	list: [],

      pageIndex:1,
      pageSize:150,
      count:0
    }
  }

  componentDidMount(){
    this.getList(this.state.pageIndex)
  }

  componentDidUpdate(prevProps){
    if(prevProps.provinceId !== this.props.provinceId || prevProps.cityId !== this.props.cityId){
      this.getList(1)
    }
    if(prevProps.current !== this.props.current){
      this.setState({
        current: this.props.current
      })
    }
  }

  getList(pageIndex){
    const params = {
      pageIndex,
      pageSize: this.state.pageSize,
      provinceId:this.props.provinceId
    }
    if(this.props.cityId !== ''){
      params.cityId = this.props.cityId
    }
    $.getJSON(`${window.APIURL}api/ExperienceStore/GetStoreList?callback=?`, params, res =>{
        if(res.Result){
            const list = res.Data.map(item =>{
                return {
                    name: item.Name,
                    address: item.Address,
                    coordinate:[item.Longitude, item.Latitude],
                    picture: item.Picture,
                    tel: item.Mobile
                }
            })
            const count = res.RowCount
            this.setState({
              current: 0,
              pageIndex,
              count,
              list
            })

            if(this.props.onChange){
              this.props.onChange(count, list)
            }
        }else{
            tools.showAlert(res.Message)
        }
    })
  }

  selectCurrent(key){
    this.setState({current: key})
    if(this.props.onClick){
      this.props.onClick(key)
    }
  }

  render () {
    const scrollStyle = {
      height: this.state.list.length >= 5 ? 470 : 500
    }

    const ie8Style = {
      overflowY: this.state.list.length >= 5 ? 'scroll' : 'auto'
    }

    const isIE8 = navigator.appName === 'Microsoft Internet Explorer' && /8./.test(navigator.appVersion)

    const List = <ul>
          {this.state.list.map((item, key) => (
              <li>
                <a href="javascript:void(0)" className={this.state.current === key ? 'current' : ''} onClick={this.selectCurrent.bind(this, key)}>
                  <span className="icon">{(this.state.pageIndex-1)*this.state.pageSize+key+1}</span>
                  <h6 title={item.name}>{item.name}</h6>
                  <p title={item.address}>{item.address}</p>
                  <p>{item.tel}</p>
                </a>
              </li>))}
        </ul>

    return (
    	<div className="component-list">
        {
          isIE8 ? <ul style={ie8Style}>{List}</ul> :  <Scrollbars style={scrollStyle}><ul>{List}</ul></Scrollbars>
        }
        <Pagination total={this.state.count} size={this.state.pageSize} current={this.state.pageIndex} onChange={this.getList.bind(this)}></Pagination>
    	</div>
    )
  }
}

export default List