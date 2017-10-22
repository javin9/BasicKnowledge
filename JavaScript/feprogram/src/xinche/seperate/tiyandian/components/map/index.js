import './index.scss'
import React from 'react'

class Map extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    }
  }

  componentDidMount(){
  	this.map = new BMap.Map('map')
    this.map.enableScrollWheelZoom()
    this.mapControl()
  }

  componentWillReceiveProps(nextProps){
    const markersLength = nextProps.markers.length
    if(markersLength && nextProps.markers !== this.props.markers){
      setTimeout(()=>{
        this.mapCenterAndZoom(nextProps.markers.reduce((coordinate, item) => [coordinate[0] + item.coordinate[0]/markersLength,coordinate[1]+item.coordinate[1]/markersLength],[0,0]))
        this.mapMarkers(nextProps.markers)
      },500)
    }

    if(nextProps.current !== this.props.current && this.markers[nextProps.current] && this.markers[nextProps.current].domElement){
      this.markers[nextProps.current].domElement.click()
    }
  }

  resetCachesMarkers(){
    this.markers = []
  }

  // 地图定义中心点和缩放比例
  mapCenterAndZoom(coordinate){
    this.map.centerAndZoom(new BMap.Point(coordinate[0],coordinate[1]), this.props.zoom)
  }

  // 地图控制条
  mapControl(){
    this.map.addControl(new BMap.NavigationControl({type: BMAP_NAVIGATION_CONTROL_ZOOM} ))
  }

  // 地图构建指示物
  mapMarkers(markers){
    this.map.clearOverlays()
    this.resetCachesMarkers()
    const icon = new BMap.Icon(require('./location.png'), new BMap.Size(20, 20), {      
         anchor: new BMap.Size(10, 20),
         infoWindowAnchor: new BMap.Size(10, 10)
     })
    let lazyMarkder
    markers.forEach((item, key) => {
      const marker = new BMap.Marker(new BMap.Point(item.coordinate[0],item.coordinate[1]), {icon: icon})
      this.markers.push(marker)
      this.map.addOverlay(marker)
      marker.addEventListener('click', () => {
        if(this.props.onClick){
          this.props.onClick(key)
        }
        marker.openInfoWindow(new BMap.InfoWindow(`
          <dl class="marker ${item.picture ? 'marker-pic' : ''}">
            ${item.picture ? `<dt><img src="${item.picture}" /></dt>` : ''}
            <dd>
              <h6>${item.name}</h6>
              <p><label>地址:</label>${item.address}</p>
              <p><label>电话:</label>${item.tel}</p>
            </dd>
          </dl>
       `))
      })

      // 首次渲染后触发
      if(key === 0){
        lazyMarkder = marker.domElement
      }

      if(key === markers.length - 1){
        setTimeout(()=>lazyMarkder.click(), 500)
      }
    })
  }

  render () {
    const layoutStyle = {
      width: '904px',
      height:'520px'
    }
    return (
    	<div className="component-map" id="map" style={layoutStyle}>
    	</div>
    )
  }
}

export default Map