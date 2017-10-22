import $ from 'jquery'
import R from 'ramda'
import moment from 'moment'

$.fn.serializeObject = function(){    
   var o = {}   
   var a = this.serializeArray()   
   $.each(a, function() {    
       if (o[this.name]) {    
           if (!o[this.name].push) {    
               o[this.name] = [o[this.name]]   
           }    
           o[this.name].push(this.value || '')   
       } else {    
           o[this.name] = this.value || ''   
       }    
   })   
   return o   
}

export const limitDate = moment().add(3, 'days')

export const getNames = R.map(item => item.name)

export const getOptions = R.compose(R.join(''), R.map(item => `<option value="${item}">${item}</option>`))

export const getItemByName = name => R.find(R.propEq('name', name))

export const getCitys = name => R.pipe(getItemByName(name), R.prop('citys'))
export const getDistricts = name => R.pipe(getItemByName(name), R.prop('district'))
export const getSellers = name => R.pipe(getItemByName(name), R.prop('sellers'))

export const renderSelect = (arr, element) => $(`select[name=${element}]`).html(getOptions(arr))

export const renderDate = (year, month, day) => {
  $('#year').text(year)
  $('#month').text(month < 10 ? `0${month}` : month)
  $('#day').text(day < 10 ? `0${day}` : day)
}
