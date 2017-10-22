import './index.scss'
import React from 'react'
import {baseProps} from '../../util'

class ViewSuccess extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      link: baseProps('mainLink')
    }
  }

  componentWillMount(){
  }

  goBack(){
    window.history.back()
  }

  render () {
    return (
      <div className="view-success">
        <h1>恭喜您已成功提交推荐信息！</h1>
        <p>工作人员将在2-3个工作期内与您联系</p>
        <div className="view-success-buttons">
          <a href="javascript:void(0)" onClick={this.goBack}>返回</a>
          <a href={this.state.link}>开走吧</a>
        </div>
      </div>
    )
  }
}

export default ViewSuccess