import React from 'react'
import 'libs/jquery.datetimepicker'

class DatePicker extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount(){
    this.activeDatePicker()
  }

  componentDidUpdate(){
    this.activeDatePicker()
  }

  activeDatePicker(){
    const defaultDateObj = new Date()
    const [defaultYear, defaultMonth, defaultDate] = [defaultDateObj.getFullYear(), defaultDateObj.getMonth()+1, defaultDateObj.getDate()]

    const options = {
      lang: 'ch',          //选择语言
      format: 'Y年m月',      //格式化日期
      monthpicker: true,    //关闭时间选项
      timepicker: false,
      datepicker: false,
      isPosition:false,
      yearEnd: defaultYear, //设置最大年份
      minDate: (this.props.minYear || '1950') + '/01/1',
      maxDate: defaultYear + '/' + defaultMonth + '/' + defaultDate,//最大日期 
      onChangeDateTime: dp => {
        this.props.onChange({
          year: dp.getFullYear(),
          month:dp.getMonth() + 1
        })
      }
    }

    if(this.props.minYear){
      options.yearStart = this.props.minYear
    }

    $('#date').datetimepicker(options)
  }

  render () {
    const clsName ='form-item form-select' + (this.props.valid ?'': ' form-item-error') + (this.props.disabled?" disabled":"");
    return (
    	<div className={clsName}>
        <label>首次上牌时间</label>
        <div className="content" style={{position:'relative'}}>
          <span className="mask-layer" style={{'display':this.props.disabled?"":"none"}}></span>
          {
            this.props.year && this.props.month ?
              <span className="text text-value" id="date">{`${this.props.year}年${this.props.month}月`}</span> :
              <span className="text text-no-value" id="date">请选择首次上牌时间</span>
          }
          {
            this.props.valid ? '' : 
            this.props.year > this.props.minYear ? <i className="warning">请选择</i> :
            <i className="error"></i>
          }
        </div>
      </div>
    )
  }
}

export default DatePicker