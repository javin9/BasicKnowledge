# 选车组件

### 使用方法
```
	// import dependences
	import CarSelector from 'libs/vue-components/car-selector'

	// vue instance components
	components: {
		CarSelector
	}

	// template
	<car-selector></car-selector>
```

### props

* api: [String] 接口域名，默认读取window.APIURL
* autoInit: [Boolean] 是否以新页面显示选车控件，默认false，为true时点击后退至history(-1)
* interfaceBrand: [String] 覆写默认的品牌列表接口
* interfaceBrandMethod: [String] 调用品牌列表接口的method, 默认jsonp
* interfaceSeries: [String] 覆写默认的车系列表接口
* interfaceSeriesMethod: [String] 调用车系列表接口的method, 默认jsonp
* interfaceCar: [String] 写默认的车型列表接口
* interfaceCarMethod: [String] 调用车型列表接口的method, 默认jsonp
* category: [String] 推荐品牌，热卖车型及搜索推荐的类目参数, 默认xinche
* level: [Number] 选车视图级别, 默认2, 决定了回调的数据到第几层
* onlySearch: [Boolean] 是否只显示搜索视图, 默认false
* onlyOnSale: [Boolean] 数据是否只取在售，默认true
* showSearch: [Boolean] 是否显示搜索模块, 默认true, 若false则没有头部搜索框
* showHotSeries: [Boolean] 是否显示热门车系模块(一级视图)
* showRecommendBrand: [Boolean] 是否显示推荐品牌模块(一级视图)
* showAllBrand: [Boolean] 是否显示'所有品牌'标签(一级视图)
* showAllSeries: [Boolean] 是否显示'所有车系'标签(二级视图)
* showBrandLogo: [Boolean] 是否显示品牌logo(一级视图)
* showSeriesLogo: [Boolean] 是否显示车系logo(二级视图)
* showCarLogo: [Boolean] 是否显示车型logo(三级视图)
* allbrandLink: [Boolean] 是否显示全部品牌按钮(三级视图)
* allbrandHref: [String] 全部品牌的跳转链接(三级视图)
* searchPlaceholder: [String] 搜索框默认提示文字
* searchDefaultLink: [String] 搜索框为空时点击搜索跳转链接，默认无
* cityId: [Number] 车型列表接口需要携带的城市id， 默认不传
* autoClose: [Boolean] 选择车款后是否自动关闭弹层， 默认true, 回调如果是跳转链接，需要设为false, 跳转页面后浏览器后退若是从缓存取就能够保留选择前状态
* callback: [function] 回调函数

### events
* callback(data, options) 回调函数
	* data: {brand:{}, series:{}, car:{}}
	* options: 调用showCarSelector时传的options, 其中options.runtime为调用时的组件运行时状态
* showCarSelector(options) 显示选车控件
	* options: 如果传送brand信息，直接展示二级选车视图，如果传送brand和series信息，直接展示三级选车视图
		* runtime: 也可以在options.runtime中覆写任何支持的props(不包含callback)

### 数据结构
```
	// brand,series,car的通用结构（id, name确保有，其余根据级别而定）
	{
		id: 1,
		name: 'xxx',
		logo: 'xxx',
		spell: 'xxx',
		price: '20.0',
		selected: 1 // 某一项选中状态，值为car的id, 只有car列表有该属性
	}
```

### 注意事项

* 所有props均为非必须
* 组件使用了vue-resource, 外层脚本需要Vue.use(VueResource)
* 回调使用props或者events方式都可以, 但不要同时使用
* 返回结构如果id为0, 则说明选择的是所有品牌或者所有车系, 如 {brand:{id:0}}或{series:{id:0}}
* 一个页面多个选车控件的回调，可以根据传入的options不同来判断，也可以在showCarSelector前手动变更回调的function/event指向来区别回调