import './index.scss'
import React from 'react'

class ReportResult extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loanPeriod:0,
      monthPayment:0,
      totalMoney: 0,
      loanRate:'',
      selectedEstimate: 'B',
      loanPeriodArr: [],

      // 暂存接口报错信息，相邻重复报错信息不重复提示
      errorCached: ''
    }
  }

  componentDidUpdate(prevProps){
    // 父组件从接口拿到贷款额度时，组件获取贷款信息
    if(this.props.applyAmount !== prevProps.applyAmount){
      this.getLoanInfo(this.props.loanPeriod)
    }
  }

  /**
   * 获取贷款信息
   * @param  {Number} loanPeriod 贷款期限
   */
  getLoanInfo(loanPeriod){
      // console.log(loanPeriod)
    // 1. 父组件传入贷款额度(放鑫融)，贷款额度取父组件传入值
    // 2. 父组件不传入(快速评估)， 贷款额度根据车况水平动态获得
      if(this.props.value){
          let loanMoney

          if(this.props.applyAmount === 0){
            loanMoney = typeof this.props.value === 'object' ? this.props.value[this.state.selectedEstimate] : this.props.value
            // 解决js精度问题，做整数运算后再化小数
            loanMoney = loanMoney * 8 * 10000/100000
          }else{
            loanMoney = this.props.applyAmount
          }

          $.getJSON('/MortgageV/GetMortgageLoanInfo', {loanPeriod, loanMoney}, res => {
              if(res.Result){
                  const loanPeriodArr = res.Data.LoanPeriodArr

                  // 若没有当前贷款期限的数据，调整贷款期限为该额度最长可贷期限
                  loanPeriod = (loanPeriod && loanPeriodArr.indexOf(loanPeriod) >= 0) ? loanPeriod : res.Data.LoanPeriod

                  this.setState({
                      errorCached: '',
                      loanPeriodArr : loanPeriodArr,
                      loanPeriod: loanPeriod,
                      monthPayment: Math.round(res.Data.MonthPayment),
                      totalMoney: Math.round(res.Data.TotalMoney)
                  })
              }else if(!this.state.errorCached || this.state.errorCached !== res.Message){
                  this.setState({errorCached: res.Message})
                  tools.showAlert(res.Message)
              }
          })
      }

  }

  /**
   * 更改车况
   * @param  {String} type 车况: C|B|A
   */
  changeEstimate(type){
    this.setState({selectedEstimate: type},()=>{
      // 快速评估改变车况需要重新获取贷款信息
      if(this.props.applyAmount === 0){
        this.getLoanInfo(this.state.loanPeriod)
      }
    })
  }

  render () {
    if(!this.props.value && !this.props.scrapValue){
      return <div></div>
    }

    const isEstimate = typeof this.props.value === 'object'

    // 当前车辆估值
    const currentValue = isEstimate ? this.props.value[this.state.selectedEstimate] : this.props.value

    // 辅助计算图表宽度
    const barColors = ['#58D8EB', '#FAB94C', '#FA656A']
    const barWidth = price => Math.ceil(220*price/this.props.scrapValue[0].Price)

    const LeftPanel = (
      <div className="left-panel">
        <h6><i></i><span>车辆估值：</span><strong>{`${(currentValue*1).toFixed(2)}万`}</strong></h6>
        {
          isEstimate ? <div className="chart">
          <p>此车未来价格趋势为：</p>
          <ul>
            {
              this.props.scrapValue.map((item, key) => (
                <li>
                  <label>{item.Year}</label>
                  <div className="bar" style={{width:`${barWidth(item.Price)}px`, backgroundColor: barColors[key]}}></div>
                  {
                    key ? <span>{`${item.Price}万`}</span> : <strong>{`${item.Price}万`}</strong>
                  }
                </li>
              ))
            }
          </ul>
          </div> : <div className="chart empty-chart">
          </div>
        }
        
      </div>
      )

    // 计算贷款额度分快速评估和放鑫融两种规则
    const loanAmount = (this.props.applyAmount === 0 ? currentValue*8*10000/100000 : this.props.applyAmount).toFixed(2)

    const RightPanel =(
      <div className={"right-panel" + (this.props.disabled=='true'?" disabled":"")}>
        <dl>
          <dt><i></i><span>易鑫车贷·车抵贷</span></dt>
          <dd>
            <label className="loan-details">贷款明细</label>
            <ul className="info">
              <li><span>贷款额度</span><strong>{`${loanAmount}万`}</strong></li>
              <li><span>月供</span><em>{`${this.state.monthPayment || '--'}元`}</em></li>
              <li><span>总成本</span><em>{`${+this.state.totalMoney ? this.state.totalMoney : '--'}元`}</em></li>
            </ul>
          </dd>
          <dd>
            <label>贷款期限</label>
            {
              this.state.loanPeriodArr && this.state.loanPeriodArr.length ? 
              <ul className="checkbox">
              {
                this.state.loanPeriodArr.map(value => <li onClick={()=>this.getLoanInfo(value)} className={this.state.loanPeriod === value ? 'current' : ''}>{`${value}期`}</li>) 
              }
              </ul>
              :<span className="checkbox-empty">暂无可选期限</span>
            }
          </dd>
        </dl>
      </div>
      )
    const Table = (
      <div className="table">
        <header>
          <ul>
            <li className={this.state.selectedEstimate === 'C' ? 'current' : ''} onClick={this.changeEstimate.bind(this,'C')}>车况较差</li>
            <li className={this.state.selectedEstimate === 'B' ? 'current' : ''} onClick={this.changeEstimate.bind(this,'B')}>正常耗损</li>
            <li className={this.state.selectedEstimate === 'A' ? 'current' : ''} onClick={this.changeEstimate.bind(this,'A')}>车况良好</li>
          </ul>
        </header>
        <div className="content">
          <div className="panel-wrapper">
            {LeftPanel}
            {RightPanel}
          </div>
          <p>提示：评估数据由精真估提供，评估及贷款信息将通过短信下发给您，请注意查收，平台提供数据仅供参考，具体估值及贷款额度以线下验车评估为准。 </p>
        </div>
      </div>
      )

  	return (
  	<div className="component-report-panel">
      <h6>车辆评估报告</h6>
      {Table}
      <footer>
        <a href="/" className="button">返回首页</a>
      </footer>
  	</div>
  	)
  }
}

export default ReportResult