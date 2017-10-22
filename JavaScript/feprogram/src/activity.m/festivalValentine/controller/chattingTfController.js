import store from '../store/store'
import {page_scr_down} from '../util/util'
import city from 'libs/citySelect'
import car from 'libs/carSelect'
import BaseController from './baseController'

export default class ChattingController extends BaseController{
  constructor () {
    super()

    this.view = 'chatting'

    this.ref = {
      chartCity: '#dataCity',
      selectCity: '#selectCity',
      CLASS_SLIDE_UP : 'slideInUp'
    }
  }

  render(){
    let $this = this
    this.showPage(this.view)

    //定位输出到页面的城市Id
    store.data.BuyCarCityID = cityId
    store.data.CityId = cityId

    // 第一个对话动效
    var intervalNum = 0;
    $('#Chatting_tip1').removeClass('hide').addClass($this.ref.CLASS_SLIDE_UP);
    var intervalAni =  setInterval(function(){
        intervalNum++;
        if(intervalNum == 1){
            $('#Chatting_tip2').removeClass('hide').addClass($this.ref.CLASS_SLIDE_UP);
        }else if(intervalNum == 2){
            $('#Chatting_tip3').removeClass('hide').addClass($this.ref.CLASS_SLIDE_UP);
        }else if(intervalNum == 3){
            $('#Chatting_tip4').removeClass('hide').addClass($this.ref.CLASS_SLIDE_UP);
        }else if(intervalNum == 4){
              // 选车和城市动效
            $('#Chatting_0').removeClass('hide').addClass($this.ref.CLASS_SLIDE_UP);
            $('#carCityDiv').show().addClass($this.ref.CLASS_SLIDE_UP);
            page_scr_down();
            clearInterval(intervalAni);
        }
    },600)
    
    $("#yxWrapper").on('click', '.title-img', function(event) {
        event.preventDefault();
        if (!shouldHideLinks) {
            location.href = "http://m.daikuan.com"
        }
    });

    //选车型
    $('#selectCar').on('click', function (e) {
        e.preventDefault()
        var self = this
        car.carSelect({
            onlyOnSale: true,
            showLevel: 3,
            showAllBrand: false,
            showSearch:false,
            hide:true
        }, function (result) {
            $('#CarValidata').hide()
            var carDisplayName = result.masterBrand.name + " " + result.brand.name + " " + result.carType.name
            if(result.masterBrand.name!==null)
            {
                if(result.brand.name.indexOf(result.masterBrand.name)>=0){
                    carDisplayName = result.brand.name + " " + result.carType.name
                }
            }
            
            var carImg = result.brand.imgUrl || result.brand.logo || result.masterBrand.logo
            $(self).find('span').text(carDisplayName)
            $('#dataCar').text(carDisplayName) // 对话框赋值

            $('#dataLogo').attr('src',carImg) // 对话框赋值
            store.data.CarId = result.carType.id
            store.data.CarPrice = result.carType.price
            $this.confirmCarCity()
        })
    })
    //选城市
    $($this.ref.selectCity).on('click', function (e) {
        e.preventDefault()
        var self = this
        city.citySelect({
            
        }, function (result) {
            $('#CityValidata').hide()
            $(self).find('span').text(result.CityName)
            $($this.ref.chartCity).text(result.CityName) // 对话框赋值
            store.data.BuyCarCityID = result.CityId
            store.data.CityId = result.CityId
            $this.confirmCarCity()
        })
    })

    var millisec=1000
    var interval

    function setSelected(obj){           
        $(obj).addClass('cur').siblings('a').removeClass('cur');
    }
    function setNext(showDomId,hideDomId){
         clearInterval(interval)
        interval = setInterval(function(){
            $("#"+hideDomId).hide()
            $("#"+showDomId).show().addClass('slideInUp')
            clearInterval(interval)
        },millisec)
    }

    $("#CareerDiv").on("click","a",function(e){
        e.preventDefault()
        store.data.Career = $(this).attr("id")

        setSelected(this)

        addDialogCust('chattingInner', $(this).text(),'msg_career')

        setNext("CreditDiv","CareerDiv")
    })

    $("#CreditDiv").on("click","a",function(e){
        e.preventDefault()
        store.data.Credit = $(this).attr("id")

        setSelected(this)

        addDialogCust('chattingInner', $(this).text(),'msg_credit')

        setNext("HouseStateDiv","CreditDiv")
    })

    $("#HouseStateDiv").on("click","a",function(e){
        e.preventDefault()
        store.data.HouseState = $(this).attr("id")

        setSelected(this)

        addDialogCust('chattingInner', $(this).text(),'msg_house')
        
        setNext("FundAndInsurance","HouseStateDiv")
    })

    $("#FundsDiv").on("click","a",function(e){
        e.preventDefault()
        store.data.Funds = $(this).attr("id")

        setSelected(this)

        $("#FundsText").val($(this).text())
        FundAndInsuranceCheck()
    })
    $("#InsuranceDiv").on("click","a",function(e){
        e.preventDefault()
        store.data.Insurance = $(this).attr("id")

        setSelected(this)

        $("#InsuranceText").val($(this).text())
        FundAndInsuranceCheck()
    })
    function FundAndInsuranceCheck(){
        if(store.data.Funds && store.data.Funds.length>0 && store.data.Insurance && store.data.Insurance.length>0) {
            var _txt = $("#FundsText").val() + '/' + $("#InsuranceText").val()

            addDialogCust('chattingInner', _txt,'msg_fundandinsurance')
            
            setNext("IncomeDiv","FundAndInsurance")
        }
    }

    $("#IncomeDiv").on("click","a",function(e){
        e.preventDefault()
        store.data.Income = $(this).attr("id")
        
        setSelected(this)

        addDialogCust('chattingInner', '月收入' + $(this).text(),'msg_income')

        // 调整动画
        $('#firstContainer').addClass('fixAfterStyle');
        
        clearInterval(interval)
        interval = setInterval(function(){
            $("#IncomeDiv").hide()
            $("#CircleDiv").show().addClass('slideInUp')
            CircleProgress() // 显示圆环进度
            $this.setDispatchStatus(false)
            $this.goToPage('order')
            clearInterval(interval)
        },millisec)
    })

    function CircleProgress(){
        var circleInterval = null
        var targetNum = null
        var self = $('.circle-item')
        targetNum = self.find('.circle-mask span').text()
        var curNum = 0
        circleInterval = setInterval(function(){
            if(curNum <= targetNum){
                updatePrograss(self, curNum++)
            }else{
                clearInterval(circleInterval)
                circleInterval = null
                if (!isAuthenticated) {
                    setTimeout(function () {
                      $this.setDispatchStatus(true)
                    }, 500)
                } else {
                  $this.setDispatchStatus(true)
                }
            }
        }, 30)
    }            
    
    function updatePrograss(el, persent){
        persent = +persent
        var deg = persent*360/100
        if(deg>180){
            //左右半圆均需旋转
            $(el).find('.circle-left').css({'-webkit-transform': 'rotate('+(deg-180)+'deg)', 'transform': 'rotate('+(deg-180)+'deg)'})
            $(el).find('.circle-right').css({'-webkit-transform': 'rotate(180deg)', 'transform': 'rotate(180deg)'})
        }else{
            //右半圆旋转
            $(el).find('.circle-left').css({'-webkit-transform': 'rotate(0deg)', 'transform': 'rotate(0deg)'})
            $(el).find('.circle-right').css({'-webkit-transform': 'rotate('+deg+'deg)', 'transform': 'rotate('+deg+'deg)'})
        }
        //文本
        $(el).find('.circle-mask span').text(persent)
    }
    // 对话框动效
    function addDialogCust(wrap_id, txt, flag) {
        var $chattingWrap = $('#' + wrap_id)
        var $articleDom = $("article[data-id='" + flag + "']")
        // var isExist = false;

        if ($articleDom && $articleDom.length > 0) {
            $articleDom.remove()
            // isExist = true;
        }
        $('<article class="dialog_cust uf uf_ase" data-id="' + flag + '"><div class="message uf_f1"><div class="txt">' + txt + '</div></div><i class="icon icon_cust"></i></article>').appendTo($chattingWrap).addClass('slideInUp')

        // 判断页面滚动
        var _pageH = $(window).height(),
            _topH = $('.header-bar').height(),
            _botH = 0,
            _contH = 0,
            _dialogH = $('#chattingInner').height()
        var $dialogWrap = $('#chattingWrap'),
            $botItem = $('.choose_bot')

        // 循环计算.choose_bot高度
        _botH = $botItem.eq(0).height()
        for (var i = 0; i < $botItem.length; i++) {
            _botH = (_botH < $botItem.eq(i).height()) ? $botItem.eq(i).height() : _botH
        }
        // 对话框容器高度
        _contH = _pageH - _topH - _botH - 0.2 * store.rootFontSize
        $dialogWrap.height(_contH + 'px')

        // 对话超出容器高度后，滚动至最底部对话
        if (_dialogH >= _contH) {

            myscrollTop(_dialogH, 500, 'chattingWrap')
        }
    }

    function myscrollTop(scrollTo, time, domId) {
        var scrollFrom = parseInt(document.getElementById(domId).scrollTop),
            i = 0,
            runEvery = 5 // run every 5ms

        scrollTo = parseInt(scrollTo)
        time /= runEvery

        var interval = setInterval(function () {
            i++

            document.getElementById(domId).scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom

            if (i >= time) {
                clearInterval(interval)
            }
        }, runEvery)
    }
  }

  confirmCarCity(){
    if (this.chkFormFirst()) {
        page_scr_down()
        $("#Chatting_1").removeClass('hide').addClass(this.ref.CLASS_SLIDE_UP) 
        setTimeout(() => {
            $("#Chatting_2").removeClass('hide').addClass(this.ref.CLASS_SLIDE_UP)
            $("#carCityDiv").hide()
            $("#CareerDiv").show().addClass(this.ref.CLASS_SLIDE_UP);
            var _pageH = $(window).height(),
                _topH = $('.header-bar').height(),
                _botH = 0,
                _contH = 0,
                _dialogH = $('#chattingInner').height(),
                $dialogWrap = $('#chattingWrap'),
                $botItem = $('.choose_bot');
            // 循环计算.choose_bot高度
            _botH = $botItem.eq(0).height()
            for (var i = 0; i < $botItem.length; i++) {
                _botH = (_botH < $botItem.eq(i).height()) ? $botItem.eq(i).height() : _botH
            }
            // 对话框容器高度
            _contH = _pageH - _topH - _botH - 0.2 * store.rootFontSize
            $dialogWrap.height(_contH + 'px')
        },500)
    }
  }

  chkFormFirst(){
    if(!store.data.CarId || store.data.CarId.length<0){
        $('#CarValidata').show()
        return false
    }

    if(!store.data.CityId || store.data.CityId.length<0){ 
        $('#CityValidata').show()
        return false
    }
    return true
  }
}