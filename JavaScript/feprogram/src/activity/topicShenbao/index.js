import './index.scss'
import $ from 'jquery'
import tools from 'libs/tools'
import { getNames, renderSelect, renderDate, getCitys, getDistricts, getSellers } from './utils'
// 经销商滚动条优化
import './jquery.mCustomScrollbar'
import './jquery.featureCarousel'
import './jquery.mousewheel'

const $form = $('.form form')
const $telephone = $form.find('input[name=Telephone]')
const $name = $form.find('input[name=UserName]')
const $province = $form.find('select[name=Province]')
const $city = $form.find('select[name=City]')
    // const $district = $form.find('select[name=County]')
const $seller = $form.find('select[name=Dealer]')
const $list = $('#sellerList')
const $tab = $('#tabList')

const cacheData = {
    provinces: getNames(DealerInfo),
    citys: []
}
// 渲染经销商
showSellers()
// 经销商滚动条
$(".jxsbox").mCustomScrollbar({
    'set_width': 1000
});

// 渲染省份select
renderSelect(cacheData.provinces, 'Province')

// 电话输入
$telephone.on('keydown', e => {
    // 非特殊按键
    const notSpecial = [8, 37, 39].indexOf(e.keyCode) < 0
        // 数字键盘
    const numberKey = e.keyCode <= 105 && e.keyCode >= 96 || e.keyCode >= 48 && e.keyCode <= 57
    if ($telephone.val().length >= 11 && notSpecial) {
        return false
    }
    if (!numberKey && notSpecial) {
        return false
    }
})
$telephone.on('keyup', e => {
    const value = $telephone.val()
    if (/[^\d]/.test(value)) {
        $telephone.val(value.replace(/[^\d]/g, ''))
    }
})

$name.on('keyup', e => {
    const value = $name.val()
    if (value.length > 10) {
        $name.val(value.slice(0, 10))
    }
})

function cName() {
    let stext = $seller.val();
    $seller.find('option').each(function() {
        if ($(this).val() == stext) {
            if ($(this).text().length > 8)
                $(this).text(stext.substr(0, 8) + '...');
        } else {
            $(this).text($(this).val());
        }
    })
}

// 省份选择句柄
$province.on('change', function() {
    const getCitysfromArray = getCitys(this.value)
    const citys = getCitysfromArray(DealerInfo)
    const citysNames = getNames(citys)
    cacheData.citys = citys
    renderSelect(citysNames, 'City')
    $city.triggerHandler('change')
    cName()
})

// 城市选择句柄
$city.on('change', function() {
    const getSellersfromArray = getSellers(this.value)
    const sellers = getSellersfromArray(cacheData.citys)
    const sellersNames = getNames(sellers)
    renderSelect(sellersNames, 'Dealer')
    $seller.triggerHandler('change')
    cName()
})

$seller.on('change', function() {
        cName()
    })
    // 表单提交
$form.on('submit', (e) => {
    e.preventDefault()
    const params = $form.serializeObject()
    if (!/^[\u4e00-\u9fa5]{2,10}$/.test(params.UserName)) {
        tools.showAlert('请填写正确的姓名', 1000)
        return false
    }
    if (!/^1[3|4|5|7|8][0-9]{9}$/.test(params.Telephone)) {
        tools.showAlert('请填写正确的手机号', 1000)
        return false
    }

    if (params.Province == '省份') {
        tools.showAlert('请选择省份', 1000)
        return false
    }
    if (params.CarSerial == '意向车型') {
        tools.showAlert('请选择车型', 1000)
        return false
    }
    if (params.City == '城市') {
        tools.showAlert('请选择城市', 1000)
        return false
    }

    if (params.Dealer == '意向经销商') {
        tools.showAlert('请选择经销商', 1000)
        return false
    }

    $.post(window.SaveUrl, params, res => {
        console.log(params)
        if (res.Result) {
            $telephone.val('');
            $name.val('');
            tools.showAlert('报名成功!')
        } else {
            tools.showAlert(res.Message)
        }
    }, 'json')


    return false
})


$province.triggerHandler('change')

// 轮播
setTimeout(function() {
    $("#featureCarousel").featureCarousel({
        // containerWidth:         2042,
        // containerHeight:        1580,
        largeFeatureWidth: 850,
        largeFeatureHeight: 478,
        smallFeatureWidth: 0.6,
        smallFeatureHeight: 0.6,
        carouselSpeed: 1000,
        autoPlay: false,
        pauseOnHove: false,
        OnHover: false,
        topPadding: 150,
        sidePadding: 0
    });
}, 1000)

// 切换经销商城市
$('#tabList a').on('click', function(){
    let _index = $(this).attr('id').replace('nav-','')
    $('#nav-'+_index).addClass('cur').siblings().removeClass('cur')
    $('#list-'+_index).show().siblings().hide();
})
// 经销商列表
function showSellers(){
    let _navhtml = '',
        _html = ''
    for (let i = 0; i < DealerInfo.length; ++i) {
        // 拼接tab
        let _title = DealerInfo[i].name
        if( _title != '省份' ){
            _navhtml += `<a href="javascript:void(0);" id="nav-`+ i +`">`+ _title +`</a>`

            let _itemhtml = ''
            // 拼接list
            let _data = DealerInfo[i].citys;
            for (let m = 0; m < _data.length; ++m) {
                let _city = _data[m];
                let _cityName = _city.name;
                for (let j = 0; j < _city.sellers.length; ++j) {
                    let companys = _city.sellers[j];
                    companys.cityName = _cityName;
                    _itemhtml += `<li>
                                    <span class="cs">` + companys.cityName + `</span>
                                    <span class="mz">` + companys.name + `</span>
                                    <span class="dz">` + companys.address + `</span>
                                    <span class="dh">` + companys.tel + `</span>
                                </li>`
                }
            }
            _html += `<ul id="list-`+ i +`">`+ _itemhtml +`</ul>`
        }
    }
    $tab.html(_navhtml)
    $list.html(_html)
    $('#nav-1').addClass('cur')
}



