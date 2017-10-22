import './index.scss'
import React from 'react'
import ReportHeader from '../reportHeader'
import ReportResult from '../reportResult'

class Report extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      data : {}
    }
  }

  componentWillMount(){
    $.getJSON('/MortgageApply/GetEvaluationReport', {orderId: this.props.orderId}, res => {
      if(res.Result){
        this.setState({
          data : res.Data
        })
      }else{
        this.showAlert(res.Message)
      }
    })
  }

  render () {
  	return (
  	<div className="component-report">
	  	<ReportHeader 
        carName={this.state.data.CarName} 
        price={this.state.data.CarPriceText} 
        licenseYear={this.state.data.LincenseYear} 
        licenseMonth={this.state.data.LicenseMonth} 
        mileage={isNaN(+this.state.data.Mileage)?'--':(+this.state.data.Mileage).toFixed(2)}
        city={this.state.data.CityName}></ReportHeader>
      <ReportResult 
        scrapValue={this.state.data.ScrapValue} 
        value={this.state.data.CarEstimate || this.state.data.B2CCarValuation} 
        applyAmount={this.state.data.ApplyAmount}
        loanPeriod={this.state.data.LoanPeriod}
        disabled={this.props.hasMortgage}></ReportResult>
  	</div>
  	)
  }
}

export default Report