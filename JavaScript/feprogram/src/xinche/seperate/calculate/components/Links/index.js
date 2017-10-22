import './index.scss'
import React, {PropTypes} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class Link extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className="links-wrapper">
        {
          this.props.disabled 
          ? <span className="button-link">查看贷款产品</span>
          : <a className="button-link" href={this.props.link} target="_blank">查看贷款产品</a>
        }
        <a className="normal-link" href={initData.linkBuyProduct} target="_blank">优惠购买商业产品 </a>
      </div>
    )
  }
}

Link.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Link)