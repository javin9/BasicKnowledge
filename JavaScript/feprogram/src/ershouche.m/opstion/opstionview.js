'use strict';
import '../css/ershouche.scss'
import './opstion.scss'
var car = require('libs/carSelect');
import citySelect from 'libs/citySelect';
import app from '../script/app';
import XTK from '../script/XTK';
import Store from  '../script/Store';



// 按预算选车api
// var BudgetAPI = {
//     data: {
//         cityId: -1,
//         carPriceMin: -1,
//         carPriceMax: -1,
//         downPaymentMin: -1,
//         downPaymentMax: -1,
//         monthlyPaymentMin: -1,
//         monthlyPaymentMax: -1,
//         repaymentPeriod: -1,
//         carMasterBrandId: -1,
//         carSerialLevel: -1,
//         carSerialSecondLevel: -1,
//         sortName: 'MR',
//         pageIndex: 1,
//         pageSize: 10
//     },
//     dataAttrShort: {
//         cMin: 'carPriceMin',
//         cMax: 'carPriceMax',
//         dMin: 'downPaymentMin',
//         dMax: 'downPaymentMax',
//         mMin: 'monthlyPaymentMin',
//         mMax: 'monthlyPaymentMax',
//         p: 'repaymentPeriod',
//         b: 'carMasterBrandId',
//         sl: 'carSerialLevel',
//         ssl: 'carSerialSecondLevel'
//     },
// }

Store.ershoucheAPI = ershoucheUrl;
Store.xincheAPI = xincheUrl;
//获取 source
var source='',linkURL= window.location.href;
if(linkURL.indexOf('source=')!=-1){
    source=linkURL.split('?')[1].replace('source=','');
}else{
    source=990;
}
var dataLink={
    dataBud:{
        cid: cityInfo.cityId, //data.cid, //城市
        Carlevelid:'', //级别
        Mbid: '',  //品牌
        Year: '', //车辆年限
        Lmili:'', //里程
        downpay: '', //首付
        mouthpay:'', //月供
    },
    dataLink:{
        cid: cityInfo.cityId, //data.cid, //城市
        Carlevelid:'', //级别
        Mbid: '0',  //品牌
        Year: '', //车辆年限
        Lmili:'', //里程
        downpay: '', //首付
        mouthpay:'', //月供
    }
}
var carSelectName = $('#car-select .select .text');
var hotBrandOpts;
var resetBtn = $('#reset-btn');
var viewBtn = $('#view-btn');
var originalData = {};
var BudgetSearch = {
    init: function() {
        var self = this;
        self.location();
        //初始化数据
        self.updateLink();
        // 选车控件
        $('#car-select').bind('click', function() {
            car.carSelect({
                onlyOnSale: true,
                showLevel: 1,
                showAllBrand: true,
                showSearch: false,
                hide: false
            }, function (result) {
                console.log(result)
                if (result.allBrand) {
                    dataLink.dataBud.Mbid = dataLink.dataLink.Mbid = 0;
                    carSelectName.text('全部品牌').addClass('sel');
                    $('.brand .choice').siblings('.active').removeClass('active');
                    $('.brand .choice').eq(0).addClass('active');
                } else {
                    $('.brand .choice').siblings('.active').removeClass('active');
                    dataLink.dataBud.Mbid = dataLink.dataLink.Mbid = result.masterBrand.id;
                    carSelectName.text(result.masterBrand.name).addClass('sel');
                    $('.brand .choice').each(function (index,con) {
                        var _this=$(this);
                        var _thisTxt=$(this).find('.name').text();
                        if (result.masterBrand.name==_thisTxt){
                            _this.addClass('active')

                        }
                    })

                }
                $('#carSelectComponent').removeClass('drawAni');
                self.updateLink();
            });
        });

        // 选项
        $('.search-list').on('click', '.choice', function() {
            // 新选择
            $(this).addClass('active').siblings('.active').removeClass('active');
            var _this=$(this);
            // 点击已选择选项：热门车型选中状态取消，其他直接返回
            if (_this.parents('dd').hasClass('level')){
                dataLink.dataBud.Carlevelid=_this.attr('date')
                dataLink.dataLink.Carlevelid=_this.attr('link')
            }else if (_this.parents('dd').hasClass('brand')){
                if (_this.find('.name').text()=='不限'){
                    carSelectName.text('请选择').removeClass('sel');
                    dataLink.dataBud.Mbid=dataLink.dataLink.Mbid='0';
                }else {
                    carSelectName.text(_this.find('.name').text()).addClass('sel');
                    dataLink.dataBud.Mbid=_this.attr('date')
                    dataLink.dataLink.Mbid=_this.attr('link')
                }
            }else if (_this.parents('dd').hasClass('oldyear')){
                dataLink.dataBud.Year=_this.attr('date')
                dataLink.dataLink.Year=_this.attr('link')
            }else if (_this.parents('dd').hasClass('mileage')){
                dataLink.dataBud.Lmili=_this.attr('date')
                dataLink.dataLink.Lmili=_this.attr('link')
            }else if (_this.parents('dd').hasClass('downpayment')){
                dataLink.dataBud.downpay=_this.attr('date')
                dataLink.dataLink.downpay=_this.attr('link')
            }else if (_this.parents('dd').hasClass('monthlypayment')){
                dataLink.dataBud.mouthpay=_this.attr('date')
                dataLink.dataLink.mouthpay=_this.attr('link')
            }
            self.updateLink();
        });

        // 重置
       /* resetBtn.bind('tap', function(e) {
            e.preventDefault();

        });*/
        resetBtn.bind('click', function(e) {
            e.preventDefault();
            $('.search-list dd').each(function() {
                $(this).find('.choice').removeClass('active').eq(0).addClass('active');
            });
            carSelectName.text('请选择').removeClass('sel');
            dataLink.dataBud={cid: cityInfo.cityId,Carlevelid:'',Mbid: '',Year: '',Lmili:'',downpay: '',mouthpay:''}
            dataLink.dataLink={cid: cityInfo.cityId,Carlevelid:'',Mbid: '0',Year: '',Lmili:'',downpay: '',mouthpay:''}
            self.updateLink();
            console.log(dataLink)
        });

        // 跳转
        viewBtn.bind('click', function(e) {
            e.preventDefault();
            console.log(dataLink)
            //liangshanyizuzizhizhou/list?source=706   /m{品牌id}/D1M2S1L1Y1G1P1O1  其中D-首付，M-月供，S-来源（判断已售还是在售）,L-级别，Y-车龄，G-里程,P-页码,O-排序规则
            var location ='',m='',d='',m2='',l='',y='',g='';
            //console.log('dataLink.dataLink.Mbid:',dataLink.dataLink.Mbid,dataLink.dataLink.Mbid.indexOf('/m'))
            //console.log(typeof dataLink.dataLink.Mbid)
            if (dataLink.dataLink.Mbid!=''){
                console.log(typeof dataLink.dataLink.Mbid,dataLink.dataLink.Mbid)
                if ((dataLink.dataLink.Mbid).toString().indexOf('/m')!= -1){
                    m = dataLink.dataLink.Mbid
                }else {
                    m = dataLink.dataLink.Mbid
                }
                console.log(m)
            }
            if (dataLink.dataLink.downpay!=''){
                d= dataLink.dataLink.downpay
            }
            if (dataLink.dataLink.mouthpay!=''){
                m2= dataLink.dataLink.mouthpay
            }
            if (dataLink.dataLink.Carlevelid!=''){
                l= dataLink.dataLink.Carlevelid
            }
            if (dataLink.dataLink.Year!=''){
                y= dataLink.dataLink.Year
            }
            if (dataLink.dataLink.Lmili!=''){
                g= dataLink.dataLink.Lmili
            }
            console.log('M:',m,' D:',d, ' M2:',m2, ' l:',l, ' Y:',y, ' G:',g)
            if (dataLink.dataLink.downpay == '' && dataLink.dataLink.mouthpay == '' && dataLink.dataLink.Carlevelid == '' && dataLink.dataLink.Year == '' && dataLink.dataLink.Lmili == '' && dataLink.dataLink.Mbid == 0) {
                 document.location.href = '/'+cityInfo.citySpell + '/list' + '/?source=' + source;
                location = '/'+cityInfo.citySpell + '/list' + '/?source=' + source;
                console.log(1)
            } else if (dataLink.dataLink.Mbid == 0 && (dataLink.dataLink.downpay != '' || dataLink.dataLink.mouthpay != '' || dataLink.dataLink.Carlevelid != '' || dataLink.dataLink.Year != '' || dataLink.dataLink.Lmili != '')) {
                document.location.href = '/'+cityInfo.citySpell  + '/'+d+m2+l+y+g+'/?source=' + source
                location ='/'+cityInfo.citySpell  + '/'+d+m2+l+y+g+'/?source=' + source
                console.log(2)
            }else if (dataLink.dataLink.Mbid != 0 &&dataLink.dataLink.downpay == '' && dataLink.dataLink.mouthpay == '' && dataLink.dataLink.Carlevelid == '' && dataLink.dataLink.Year == '' && dataLink.dataLink.Lmili == '') {
                document.location.href = '/'+cityInfo.citySpell +m+'/?source=' + source
                location ='/'+cityInfo.citySpell +m+'/?source=' + source
                console.log(3)
            } else {
                document.location.href = '/'+cityInfo.citySpell +m+'/'+d+m2+l+y+g+'/?source=' + source
                location ='/'+cityInfo.citySpell +m+'/'+d+m2+l+y+g+'/?source=' + source
                console.log(4)
            }
            //location=m+'/'+d+m2+l+y+g+'?source=' + source
            console.log(location)
        });
    },
    //连接
    updateLink: function() {

        var self = this;
        // todo 获取车型数量，并更新链接
        //var viewBtn = self.dom.viewBtn;
        // console.log(dataBud)
        // console.log(cityInfo,cityInfo.citySpell)
        // console.log(cityInfo.citySpell+'/m'+dataLink.dataBud.Mbid+'/d'+dataLink.dataBud.downpay+'m'+dataLink.dataBud.mouthpay+'l'+dataLink.dataBud.Carlevelid+'y'+dataLink.dataBud.Year+'g'+dataLink.dataBud.Lmili)
        console.log(dataLink.dataBud)
        Store.GetUcarSum(dataLink.dataBud).then(function (result) {
            console.log(result)
            viewBtn.find('#count').html(result.Data);
        });
    },
    //城市定位
    location: function () {
        var ipLocationInfo=cityInfo;
        //$('#localText').html(ipLocationInfo.cityName);
        $('#city-select').on('click', function () {
            citySelect.citySelect(ipLocationInfo,function (result) {
                cityInfo.cityId=dataLink.dataBud.cid=dataLink.dataLink.cid=result.CityId;
                cityInfo.cityName=result.CityName;
                cityInfo.citySpell=result.CitySpell;
                cityInfo.cityName=result.CityName;
                //Object {CityId: 201, RegionId: 110100, CityName: "北京", CitySpell: "beijing", Url: "http://localhost:8080/beijing/OpstionView.html"}
                $('#city-select .text').text(result.CityName);
                BudgetSearch.updateLink();

            });
        })
    },
}

$(function() {
    BudgetSearch.init();
});





