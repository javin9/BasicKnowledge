import './index.scss'
import React, {PropTypes} from 'react'
import { Link } from 'react-router'

export default class Nav extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      activeTab : props.tab
    }
  }

  componentDidMount(){
    this.setState({activeTab: this.context.router.isActive('loan') ? 0 : 1})
  }

  changeTab(tab){
    this.setState({activeTab:tab})
  }

  render () {
    return (
      <ul className="nav">
        <li className={this.state.activeTab === 0 ? 'active' : ''} onClick={this.changeTab.bind(this, 0)}><Link to="/loan">贷款购车计算器</Link></li>
        <li className={this.state.activeTab === 1 ? 'active' : ''} onClick={this.changeTab.bind(this, 1)}><Link to="/full">全款购车计算器</Link></li>
      </ul>
    )
  }
}

Nav.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}
