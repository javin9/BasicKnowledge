import './index.scss'
import React from 'react'
import {findDOMNode} from 'react-dom';
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'zrender/lib/vml/vml'

export default class ChartComponent extends React.Component {
  constructor (props) {
    super(props)

    this.chartOptions = {
        color: ['#FFD221','#EF4D00','#38BEB2','#F5706E'],
        series: [
            {
                type:'pie',
                radius: ['50%', '100%'],
                animation:false,
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:props.data
            }
        ]
    }
  }

  componentDidMount(){
    const chartDom = findDOMNode(this)
    this.chart = echarts.init(chartDom)
    this.chart.setOption(this.chartOptions)
  }

  componentWillUpdate(props){
    if(this.chart){
      this.chartOptions.series[0].data = props.data
      this.chart.setOption(this.chartOptions)
    }
  }

  shouldComponentUpdate(props){
    if(!this.chart){
      return true
    }

    let shouldUpdate = false
    props.data.forEach((value, key) => {
      if(value !== this.props.data[key]){
        shouldUpdate = true
      }
    })
    return shouldUpdate
  }

  render () {
    return (
      <canvas width="126" height="126"/>
    )
  }
}

// ChartComponent.defaultProps = {
//   data: [0,0,1,0]
// }
