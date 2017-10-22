import './index.scss'
import $ from 'jquery'
import tools from 'libs/tools'
import 'libs/jquery.datetimepicker'
import {getNames, renderSelect, renderDate, limitDate, getCitys, getDistricts, getSellers} from './utils'

const $form = $('.form form')
const $datepicker = $form.find('#datepicker')
const $telephone = $form.find('input[name=Telephone]')
const $name = $form.find('input[name=UserName]')
const $province = $form.find('select[name=Province]')
const $city = $form.find('select[name=City]')
const $district = $form.find('select[name=County]')
const $seller = $form.find('select[name=Dealer]')

const cacheData = {
  provinces: getNames(DealerInfo),
  citys: [],
  districts: []
}

// 默认日期
renderDate(limitDate.year(), limitDate.month()+1, limitDate.date())

// 渲染省份select
renderSelect(cacheData.provinces,'Province')

// 日期选择事件
$datepicker.datetimepicker({
  lang: 'ch',
  format: 'Y年m月d日',
  monthpicker: false,
  datepicker: true,
  timepicker: false,
  isPosition:false,
  scrollMonth:false,
  scrollTime:false,
  scrollInput:false,
  minDate: `${limitDate.year()}/${limitDate.month()+1}/${limitDate.date()}`,
  onChangeDateTime: dp => {
  	if(dp){
      renderDate(dp.getFullYear(), dp.getMonth()+1, dp.getDate())
  	}
  }
})

// 电话输入
$telephone.on('keydown', e => {
  // 非特殊按键
  const notSpecial = [8,37,39].indexOf(e.keyCode) < 0
  // 数字键盘
  const numberKey = e.keyCode <= 105 && e.keyCode >=96 || e.keyCode >= 48 && e.keyCode <= 57
  if($telephone.val().length >= 11  && notSpecial){
    return false
  }
  if( !numberKey && notSpecial){
    return false
  }
})
$telephone.on('keyup', e => {
  const value = $telephone.val()
  if(/[^\d]/.test(value)){
    $telephone.val(value.replace(/[^\d]/g, ''))
  }
})

$name.on('keyup', e => {
  const value = $name.val()
  if(value.length > 10){
    $name.val(value.slice(0,10))
  }
})

// 省份选择句柄
$province.on('change', function(){
  const getCitysfromArray = getCitys(this.value)
  const citys = getCitysfromArray(DealerInfo)
  const citysNames = getNames(citys)
  cacheData.citys = citys
  renderSelect(citysNames, 'City')
  $city.triggerHandler('change')
})

// 城市选择句柄
$city.on('change', function(){
  const getDistrictsfromArray = getDistricts(this.value)
  const districts = getDistrictsfromArray(cacheData.citys)
  const districtsNames = getNames(districts)
  cacheData.districts = districts
  renderSelect(districtsNames, 'County')
  $district.triggerHandler('change')
})

// 区县选择句柄
$district.on('change', function(){
  const getSellersfromArray = getSellers(this.value)
  const sellers = getSellersfromArray(cacheData.districts)
  const sellersNames = getNames(sellers)
  renderSelect(sellersNames, 'Dealer')
  $seller.triggerHandler('change')
})

// 表单提交
$form.on('submit', (e) => {
	e.preventDefault()
	const params = $form.serializeObject()

	params.BookDate = `${$('#year').text()}-${$('#month').text()}-${$('#day').text()}`

	if(!dev){
		if(!/^[\u4e00-\u9fa5]{2,10}$/.test(params.UserName)){
			tools.showAlert('请填写正确的姓名')
			return false
		}

		if(!/^1[3|4|5|7|8][0-9]{9}$/.test(params.Telephone)){
			tools.showAlert('请填写正确的手机号')
			return false
		}

    if(!params.CarSerial){
      tools.showAlert('请选择车型')
      return false
    }

    if(!params.Province){
      tools.showAlert('请选择省份')
      return false
    }

    if(!params.City){
      tools.showAlert('请选择城市')
      return false
    }

    if(!params.County){
      tools.showAlert('请选择区县')
      return false
    }

    if(!params.Dealer){
      tools.showAlert('请选择经销商')
      return false
    }

    if(!/^\d{4}-\d{2}-\d{2}/.test(params.BookDate)){
      tools.showAlert('请选择时间')
      return false
    }
	}

  $.post(window.SaveUrl, params, res => {
    if(res.Result){
      tools.showAlert('预约试驾成功!')
    }else{
      tools.showAlert(res.Message)
    }
  }, 'json')


	return false
})


$province.triggerHandler('change')

    
