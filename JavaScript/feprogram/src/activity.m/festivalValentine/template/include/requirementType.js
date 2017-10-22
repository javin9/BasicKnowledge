module.exports = (type, key) => {
	const values = {
		className : ['level_one', 'level_two', 'level_three'],
		text: ['严格', '一般', '宽松']
	}
	return values[key][type-1]
}