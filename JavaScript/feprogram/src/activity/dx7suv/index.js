require('./index.scss')
require('select2')
require('select2/dist/css/select2.css')
var tools = require('libs/tools')
var tpl = require('./success.hbs')

var $ = require('jquery')
var $mask = $('#maskLayer')
var $hover = $('.hover')
var options = {
	minimumResultsForSearch: Infinity,
	theme: "classic"
}

var url_suffix  = window.location.port === '' ? '/activity' : ''

var city = {
	'shanxi' : [
		{id: '西安市', text: '西安市', shop: '西部车城销售服务店'},
		{id: '铜川市', text: '铜川市', shop:'西部车城销售服务店'},
		{id: '咸阳市', text: '咸阳市', shop:'西部车城销售服务店'},
		{id: '渭南市', text: '渭南市', shop:'西部车城销售服务店'},
		{id: '汉中市', text: '汉中市', shop:'西部车城销售服务店'},
		{id: '安康市', text: '安康市', shop:'西部车城销售服务店'},
		{id: '商洛市', text: '商洛市', shop:'西部车城销售服务店'},
		{id: '延安市', text: '延安市', shop:'西部车城销售服务店'},
		{id: '榆林市', text: '榆林市', shop:'西部车城销售服务店'},
		{id: '宝鸡市', text: '宝鸡市', shop:'西部车城销售服务店'},
		{id: '汉中市', text: '汉中市', shop: '贾旗路销售服务店'}
	],
	'gansu' : [
		{id:'兰州市',text:'兰州市', shop: '南山路销售服务店'},
		{id:'酒泉市',text:'酒泉市', shop: '南山路销售服务店'},
		{id:'嘉峪关市', text: '嘉峪关市', shop:'南山路销售服务店'},
		{id:'金昌市', text: '金昌市', shop:'南山路销售服务店'},
		{id:'白银市', text: '白银市', shop:'南山路销售服务店'},
		{id:'天水市', text: '天水市', shop:'南山路销售服务店'},
		{id:'武威市', text: '武威市', shop:'南山路销售服务店'},
		{id:'定西市', text: '定西市', shop:'南山路销售服务店'},
		{id:'陇南市', text: '陇南市', shop:'南山路销售服务店'},
		{id:'张掖市',text:'张掖市', shop: '大宇车城销售（服务）店'},
		{id:'庆阳市',text:'庆阳市', shop: '西峰区销售服务店'},
		{id:'平凉市',text:'平凉市', shop: '仁河车城销售服务店'}
	]
}

$('.hover-target').hover(function(){
	$hover.show()
}, function(){
	$hover.hide()
})

$('form').submit(function() {
  var data = $(this).serialize()
  var name = $('[name=UserName]').val()
  var tel = $('[name=Telephone]').val()
  if(!name){
  	tools.showAlert('请填写姓名')
  	return false
  }else if(!tel){
  	tools.showAlert('请填写手机')
  	return false
  }else if(!/^\d{11}$/.test(tel)){
  	tools.showAlert('请填写正确的手机号')
  	return false
	}
  $.post(url_suffix + '/DNQC/SaveActivity', data, function(res){
  	if(res.Result){
  		showSuccessModal()
  		reset()
  	}else{
  		tools.showAlert(res.Message)
  	}
  }, 'json')
  return false
})


$('#select-city').select2($.extend({},options, {data:city.shanxi}))
$('#select-province').select2(options).on('select2:select', changeProvinceHandler)
$('#select-car').select2(options)
$('#select-sex').select2(options)

$('.hover-target').on('click', function(){
	var href = $(this).attr('href')
	if(href.indexOf('http') < 0){
		var html = '<iframe height=600 width=1000 src="http://player.youku.com/embed/XMTQ1NzA3NzEyOA==" frameborder=0 allowfullscreen id="video"></iframe>'
		$("#maskLayer").show()
		$(html).appendTo('body')
		return false
	}
})

$mask.on('click', function(){
	$('#video').remove()
	$(this).hide()
})

$('body').on('click', '.success-modal button',function(){
	$mask.hide()
	$('.success-modal').remove()
})

function changeProvinceHandler(){
	var province = $('#select-province').val()
	$('#select-city').select2().empty()
	if(province === '甘肃省'){
		$('#select-city').select2($.extend({},options, {data:city.gansu}))
	}else{
		$('#select-city').select2($.extend({},options, {data:city.shanxi}))
	}
}

function reset(){
	$('[name=UserName]').val('')
  $('[name=Telephone]').val('')
}

function showSuccessModal(){
	var html = ''
	var data = {}
	var cities = city.shanxi.concat(city.gansu)
	var current = $('#select-city').val()

	$.each(cities, function(key, item){
		if(item.id === current){
			data = item
			return false
		}
	})

	html = tpl(data)

	$('body').append($(html))

	$mask.show()
	return html
}