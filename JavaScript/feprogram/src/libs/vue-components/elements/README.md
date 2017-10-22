# 抽象元素组件 Elements

## input

### 功能
	* 清除icon及其交互
	* 常用类型的输入限制
	* 常用类型的长度限制

### 使用
```
	<component-input 
    v-model="referTel" 
    type="mobile"
    placeholder="请输入推荐人手机号"
  ></component-input>
```

### props
	* 所有input具有的属性都可有
	* v-model: 双向绑定的数据
	* type: 选填， 默认text
		* 标准type种类
		* mobile: 只能输入数字，且不能超过11位
		* digits: 只能输入数字
		* name: 不能超过8位