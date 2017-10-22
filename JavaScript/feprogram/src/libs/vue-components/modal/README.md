# modal组件

### props
	* type: [String], alert|confirm|success, 默认alert, alert只有一个按钮，confirm两个按钮，success有icon
	* title: [String], 标题
	* content: [String], 内容
	* confirmText: [String], 默认'确定'
	* cancelText: [String], 默认'取消'
	* align: [String], center|left , 默认center, 内容对齐方式
	* mask: [Boolean], 是否有遮罩层，默认true

### events
	* showModal
	* hideModal

### usage
`
	// 方式一
	this.$broadcast('标题', '内容', function(){
		...
	})

	// 方式二
	this.$broadcast({
		type: 'confirm',
		content: '内容',
		callback(){
			...
		}
	})
`