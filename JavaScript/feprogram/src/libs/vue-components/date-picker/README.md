# 选择弹层

### 使用
    <date-picker default-date="2015-5-9"  min-date="2013-2-3"  type="date" max-date="2015-7-20" @selected="onSelected"></date-picker>

### props
	* defaultDate : String, 默认日期
	* minDate: String,最小日期
	* maxDate: String,最小日期
	* type: String, date 调出日期选择(默认) ym 调出年月选择
	* selected: Function, 选择结果回调函数

### events
	* openDatePicker: 显示选择弹层

