import check from 'libs/check'
// 金钱格式化,千分位
export function formatPrice(value){
	return `¥ ${Math.round(value).toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')}`
}

// 百分比格式化
export function formatPercent(value){
	value = value ? value : 0
	return `${Math.min(+value.toFixed(2),100)} %`
}

// 根据贷款期限和贷款利率种类获取贷款利率
export function getFeeByTerm(type, term, taxOptions){
	let value
	taxOptions.forEach(item => {
    if(item.value === type){
      value = item.values[term/12]
    }
  })
  return value
}

// 车型排量档位
// 0 => 1.0L(含)以下
// 1 => 1.0-1.6L(含)以下
// 2 => 1.6-2.0L(含)以下
// 3 => 2.0-2.5L(含)以下
// 4 => 2.5-3.0L(含)以下
// 5 => 3.0-4.0L(含)以下
// 6 => 4.0L 
export function getCC(cc){
	cc = +cc
	if( cc <= 1 ){
		return 0
	}
	if( cc <= 1.6 ){
		return 1
	}
	if( cc <= 2 ){
		return 2
	}
	if( cc <= 2.5 ){
		return 3
	}
	if( cc <= 3 ){
		return 4
	}
	if( cc <= 4 ){
		return 5
	}
	return 6
}

// 尾款比例校验器
export function validatorFinalRate(base, value){
	const max = 100-base
	const valid = value <= max && value >= 0
	return {
		valid,
		message:valid ? '' : `首付比例+尾款比例需小于100%`,
		correct: valid ? value : max
	}
}

// 替换url中cityid
export function replaceUrlWithCityId(id){
	let {origin, pathname, search, hash} = window.location
	const key = 'cityid'
	search = !search 
					? `?${key}=${id}`
					: search.toLowerCase().indexOf(key) >= 0
					? search.replace(/cityid=\d+/gi, `${key}=${id}`)
					: `${search}&${key}=${id}`
	return origin + pathname + search + hash
}

// 更改history
export function historyReplaceCity(id){
	const replacedUrl = replaceUrlWithCityId(id)
	if('replaceState' in history){
		history.replaceState({}, document.title, replacedUrl)
	}
}

// 验证手机号
export function validatorTelNumber (value) {
	const valid = check.isPhoneNumber(value)
	return {
		valid,
		message: valid ? '':`请输入正确的手机号`,
		correct: valid ? value : ''
	}
}

// 获取手机验证码
export function getCode (value) {
	check.newGetCode({
		line:BusinessLine,
		codelen:4
	},function(){
        $("#validatorCode").focus();
    })
}

//验证手机验证码
export function checkCode (value, id, line, successFunc) {
	check.checkCode(value, id, line, successFunc)
}