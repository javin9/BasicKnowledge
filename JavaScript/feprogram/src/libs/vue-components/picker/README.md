# 选择弹层

### 使用
 <picker :picker-data="pickerData" :title="title" type="ios" @selected="onSelected" @change="onChange" @cancel="onCancel" :default-index="defaultIndex" ></picker>

### props
	* pickerData : Array, 选项数据，如果是多个选项则如需要传入一个多纬数组
	* title: String, 选项的标题
	* type: String, 选择框的类型 'ios','android'两种,默认 ios
	* selected: Function, 选择结果回调函数
	* defaultIndex: Array, 默认选项从0开始
	* change:Function,滚动变化
    * cancel:Function, 取消

### events
	* openPicker: 显示选择弹层

