import React from 'react'
import Status from '../../components/status'
import ReportPanel from '../../components/report'

class Report extends React.Component {
  constructor (props) {
    super(props)
  }

  componentWillMount(){
    $(window).trigger('progress', 'report')
  }

  render () {

    // window.ApplyAmount = 0 快速评估
    // window.ApplyAmount = Number 放鑫融
    let orderId = this.props.params.id.split(",")[0];
    return (
      <div>
        {window.ApplyAmount !== '0' ? <Status></Status> : <span></span>}
        <ReportPanel orderId={orderId} hasMortgage={this.props.params.id.split(",")[1]}></ReportPanel>
      </div>
    )
  }
}

export default Report