import './index.scss'
import React from 'react'

class Status extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <aside className="component-status">
      <dl>
	      <dt></dt>
	      <dd>
		      <h1>线上申请成功</h1>
		      <p>请保持申请时手机号畅通，工作人员会与您联系。</p>
	      </dd>
      </dl>
      </aside>
    )
  }
}

export default Status