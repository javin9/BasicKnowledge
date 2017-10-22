import './index.scss'
import React, {PropTypes} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Nav from '../../components/Nav'
import { getSourcesInfo } from '../../actions/sources'

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      needInitData : props.carId,
    }
  }

  componentDidMount(){
    if(this.state.needInitData){
      this.props.getSourcesInfo(this.props.carId, this.props.cityId)
    }
  }

  render () {
    return (
      <div className="container">
        <Nav />
        <div className="panel-wrapper">
          {this.props.children}
        </div> 
      </div>
    )
  }
}

App.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    carId: state.sources.car.id,
    cityId: state.sources.city.id
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getSourcesInfo: (...params) => getSourcesInfo(dispatch,...params)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
