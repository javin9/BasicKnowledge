# vue form 组件

### 组件列表

* form/car 车型选择
* form/carno 车牌号
* form/city 城市选择
* form/datepicker 日期选择
* form/mileage 行驶里程
* form/name 姓名
* form/validatecode 验证码
* form/mortgage 抵押状态
* form/mobile 手机号
* form/button 提交按钮
* form/vin 车架号


### 引用示例

```
	<div class="form">
    <car :initial-value="initialCar" name="CarID" :border="true"></car>
    <carno name="LicensePlateNo" :border="true"></carno>
  </div>
  <component-button text="按钮名称"></component-button>
```

### 通用props

* initialValue: 初始值
* name: 组件名称，组件值更新时派发事件时使用
* border: 是否有border-bottom样式
* event: 组件值改变派发的事件名， 默认updateForm, Button组件为提交事件名，默认submitForm
* readonly: 是否只读
* label: 组件label
* placeholder: 组件placeholder
* hasFeedback: 值改变时是否交互错误提示

### Mileage组件独有props

* unit: 单位文本

### ValidateCode组件独有props

* maxlength: 最大可输入长度，默认6
* mobileEl: 相关联的手机号组件el(id), 默认mobile
* el: 获得验证码按钮的id, 默认GetValidateCode

### Mobile组件独有props

* el: 组件input的id, 默认mobile, 供验证码组件使用

### Vin组件独有props

* replace: 组件改变后确认替换车型，派发updateForm中的name
* car: 已选择车型的名称


### Button组件独有props

* disabled: 是否禁用状态
* text: 按钮文本
* description: 按钮提示文本
* descriptionPosition: 按钮提示文本位置，top|bottom, 默认top 

### 父级组件Event

* updateForm: (name, value)任何组件值改变后获得组件name和组件value的通知
* submitForm: 提交按钮提交获得通知
* validateForm: 通知form组件各自验证自己的值