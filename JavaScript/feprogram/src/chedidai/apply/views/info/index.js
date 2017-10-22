import React from 'react'
import Info from '../../components/info'

class AdditionalInfo extends React.Component {
  constructor (props) {
    super(props)
  }

  componentWillMount(){
    $(window).trigger('progress', 'form')
  }

  render () {
    const styles = {
      padding:'50px 0 70px 276px', 
      background:'#fff'
    }
    return (
      <div style={styles}>
        <Info 
          isProduct={window.ApplyAmount === '0' ? false : true} 
          car={{name: window.CarName || '', id: window.CarID || '', year: window.carYear || ''}} 
          realName={window.RealName || ''} 
          orderId={window.orderId || ''} 
          city={{name:window.cityName || '', id: window.cityId || ''}} 
          mobile={window.telephone || ''}></Info>
      </div>
    )
  }
}

export default AdditionalInfo