import store from '../store/store'
import service from '../service/service'
import {page_scr_down, getElement} from '../util/util'
import city from 'libs/citySelect'
import BaseController from './baseController'

export default class ChattingController extends BaseController{
    constructor () {
        super();

        this.view = 'chatting';

        this.ref = {
            wrapper: '#SecretaryMain',
            chartCity: '#dataCity',
            selectCity: '#selectCity',
            nextBtn: '#nextBtn',
            CLASS_SLIDE_UP : 'animated slideInUp'
        }
    }

    render() {
        let $this = this;
        this.showPage(this.view);

        // 车型预选
        if (typeof carInfo !== 'undefined' && carInfo) {
            store.data.CarId = carInfo.CarId;
            store.data.CarPrice = carInfo.CarReferPrice;

            $('#selectCar span').html(carInfo.CarSerialShowName + carInfo.CarName);
            $('#dataCar').text(carInfo.CarSerialShowName + carInfo.CarName);
            $('#dataLogo').attr('src', carInfo.CarSerialImgUrl);
        }
        //定位输出到页面的城市Id
        if (typeof cityId !== 'undefined' && cityId
                && typeof cityName !== 'undefined' && cityName) {
            // store.data.BuyCarCityID = cityId; // 不需要BuyCarCityID参数了，和CityId重复了？
            store.data.CityId = cityId;

            $('#selectCity span').html(cityName);
            $('#dataCity').text(cityName);
        }
        // 验证车城市预选
        this.confirmCarCity();
        // 获取顾问电话
        this.getAdviserTel();
        // 获取卡券信息
        this.getCardInfo();

        // 投放页
        // 1.头部logo链接去首页
        // 2.关于我们弹层
        if (typeof tfPageNumber !== 'undefined' && tfPageNumber) {
            $('.header-bar.tf a').on('click', function (e) {
                e.preventDefault();
                if (shouldShowLinks) {
                    window.location.href = "http://m.daikuan.com";
                }
            });

            $('#aboutus-window').appendTo(this.ref.wrapper);
            if ('pushState' in history) {
                $('#aboutus').on('click', function (e) {
                    e.preventDefault();
                    $('#aboutus-window').fadeIn(250);
                    $('#aboutus-window .content').scrollTop(0);
                    history.pushState({name: 'aboutus'}, '');
                });
                $('#aboutus-window .close-btn').on('click', function (e) {
                    e.preventDefault();
                    history.go(-1);
                });
                $('#aboutus-window .content').on('click', function (e) {
                    e.preventDefault();
                    history.go(-1);
                });
                window.onpopstate = function(event) {
                    $('#aboutus-window').fadeOut(250);
                }
            } else {
                $('#aboutus').on('click', function (e) {
                    e.preventDefault();
                    $('#aboutus-window').fadeIn(250);
                    $('#aboutus-window .content').scrollTop(0);
                });
                $('#aboutus-window .close-btn').on('click', function (e) {
                    e.preventDefault();
                    $('#aboutus-window').fadeOut(250);
                });
                $('#aboutus-window .content').on('click', function (e) {
                    e.preventDefault();
                    $('#aboutus-window').fadeOut(250);
                });
            }
        }

        // 第一个对话动效
        /* if (typeof tfPageNumber === 'undefined' || !tfPageNumber) {
            // 非投放页
            var delay = 0;
            if ($('#Chatting_z').length) {
                $('#Chatting_z').removeClass('hide').addClass(this.ref.CLASS_SLIDE_UP);
                delay = 300;
            }
            setTimeout(() => {
                $('#Chatting_0').removeClass('hide').addClass(this.ref.CLASS_SLIDE_UP);
                $('#carCityDiv').show().addClass(this.ref.CLASS_SLIDE_UP);
                page_scr_down();
            }, delay);
        } else {
            // 投放页
            var delay = 0;
            $('#tf-intro').removeClass('hide').addClass(this.ref.CLASS_SLIDE_UP);
            delay = 300;
            setTimeout(() => {
                delay = 0;
                if ($('#Chatting_z').length) {
                    $('#Chatting_z').removeClass('hide').addClass(this.ref.CLASS_SLIDE_UP);
                    delay = 300;
                }
                setTimeout(() => {
                    $('#Chatting_0').removeClass('hide').addClass(this.ref.CLASS_SLIDE_UP);
                    // 选车和城市动效
                    $('#carCityDiv').show().addClass(this.ref.CLASS_SLIDE_UP);
                    page_scr_down();
                }, delay);
            }, delay);
        }  */
        $('#carCityDiv').show();
        $('#tf-intro').removeClass('hide');
        $('#Chatting_z').removeClass('hide');
        $('#Chatting_0').removeClass('hide');
        if ($('#Chatting_z img').length) {
            var image = new Image();
            image.onload = function() {
                $this.myscrollTop($('#chattingInner').height(), 500, 'chattingWrap');
            };
            image.src = $('#Chatting_z img').attr('src');
        } else {
            $this.myscrollTop($('#chattingInner').height(), 500, 'chattingWrap');
        }
        
        store.vueInstance.selectCarCallback = function(data){
            let carDisplayName = data.brand.name + " " + data.series.name + " " + data.car.name
            if(data.brand.name && data.series.name.indexOf(data.brand.name) >= 0){
                carDisplayName = data.series.name + ' ' + data.car.name
            }

            let carImg = data.car.logo || data.series.logo || data.brand.logo
            $('#selectCar').find('span').text(carDisplayName)
            $('#dataCar').text(carDisplayName)
            $('#dataLogo').attr('src',carImg)
            store.data.CarId = data.car.id
            store.data.CarPrice = data.car.price
            $this.confirmCarCity()
        }
        $('#selectCar').on('click', () => {
            store.vueInstance.$broadcast('showCarSelector')
        })

        //选城市
        $($this.ref.selectCity).on('click', function (e) {
            e.preventDefault();
            var self = this;
            city.citySelect({}, function (result) {
                $('#CityValidata').hide();
                $(self).find('span').text(result.CityName);
                $($this.ref.chartCity).text(result.CityName);// 对话框赋值
                // store.data.BuyCarCityID = result.CityId; // 不需要BuyCarCityID参数了，和CityId重复了？
                store.data.CityId = result.CityId;
                $this.confirmCarCity();
                $this.getAdviserTel();
            })
        });

        // 下一步
        $($this.ref.nextBtn).on('click', function (e) {
            if ($this.chkFormFirst()) {
                // page_scr_down();
                $("#Chatting_1").removeClass('hide').addClass($this.ref.CLASS_SLIDE_UP);
                setTimeout(() => {
                    $("#Chatting_2").removeClass('hide').addClass($this.ref.CLASS_SLIDE_UP);
                    $("#carCityDiv").hide();
                    $("#CareerDiv").show().addClass($this.ref.CLASS_SLIDE_UP);
                    $this.myscrollTop($('#chattingInner').height(), 500, 'chattingWrap');
                    $('#card').addClass('lower');
                    $('#chattingWrap').addClass('lower');
                }, 300)
            }
        });

        var millisec=300;
        var interval;

        function setSelected(obj){
            $(obj).addClass('cur').siblings('a').removeClass('cur')
        }
        function setNext(showDomId,hideDomId){
            clearInterval(interval);
            interval = setInterval(function(){
                $("#"+hideDomId).hide();
                $("#"+showDomId).show().addClass('animated slideInUp');
                clearInterval(interval);
            },millisec);
        }

        $("#CareerDiv").on("click","a",function(e){
            e.preventDefault();
            store.data.Career = $(this).attr("id");

            setSelected(this);

            addDialogCust('chattingInner', $(this).text(),'msg_career');

            setNext("CreditDiv","CareerDiv");
        });

        $("#CreditDiv").on("click","a",function(e){
            e.preventDefault();
            store.data.Credit = $(this).attr("id");

            setSelected(this);

            addDialogCust('chattingInner', $(this).text(),'msg_credit');

            setNext("HouseStateDiv","CreditDiv")
        });

        $("#HouseStateDiv").on("click","a",function(e){
            e.preventDefault();
            store.data.HouseState = $(this).attr("id");

            setSelected(this);

            addDialogCust('chattingInner', $(this).text(),'msg_house');

            setNext("FundAndInsurance","HouseStateDiv");
        });

        $("#FundsDiv").on("click","a",function(e){
            e.preventDefault();
            store.data.Funds = $(this).attr("id");

            setSelected(this);

            $("#FundsText").val($(this).text());
            FundAndInsuranceCheck();
        });
        $("#InsuranceDiv").on("click","a",function(e){
            e.preventDefault();
            store.data.Insurance = $(this).attr("id");

            setSelected(this);

            $("#InsuranceText").val($(this).text());
            FundAndInsuranceCheck();
        });
        function FundAndInsuranceCheck(){
            if(store.data.Funds && store.data.Funds.length>0 && store.data.Insurance && store.data.Insurance.length>0) {
                var _txt = $("#FundsText").val() + '/' + $("#InsuranceText").val();

                addDialogCust('chattingInner', _txt,'msg_fundandinsurance');

                setNext("IncomeDiv","FundAndInsurance");
            }
        }

        $("#IncomeDiv").on("click","a",function(e){
            e.preventDefault();
            store.data.Income = $(this).attr("id");

            setSelected(this);

            addDialogCust('chattingInner', '月收入' + $(this).text(),'msg_income');

            clearInterval(interval);
            interval = setInterval(function(){
                $("#IncomeDiv").hide();
                $("#CircleDiv").show().addClass('animated slideInUp');
                CircleProgress(); // 显示圆环进度
                $this.setDispatchStatus(false);
                $this.goToPage('order');
                clearInterval(interval);
            },millisec);
        });

        function CircleProgress(){
            var circleInterval = null;
            var targetNum = null;
            var self = $('.circle-item');
            targetNum = self.find('.circle-mask span').text();
            var curNum = 0;
            circleInterval = setInterval(function(){
                if(curNum <= targetNum){
                    updatePrograss(self, curNum++)
                }else{
                    clearInterval(circleInterval);
                    circleInterval = null;
                    if (!isAuthenticated) {
                        setTimeout(function () {
                            $this.setDispatchStatus(true)
                        }, 500)
                    } else {
                        $this.setDispatchStatus(true)
                    }
                }
            }, 10)
        }

        function updatePrograss(el, persent){
            persent = +persent;
            var deg = persent*360/100;
            if(deg>180){
                //左右半圆均需旋转
                $(el).find('.circle-left').css({'-webkit-transform': 'rotate('+(deg-180)+'deg)', 'transform': 'rotate('+(deg-180)+'deg)'});
                $(el).find('.circle-right').css({'-webkit-transform': 'rotate(180deg)', 'transform': 'rotate(180deg)'});
            }else{
                //右半圆旋转
                $(el).find('.circle-left').css({'-webkit-transform': 'rotate(0deg)', 'transform': 'rotate(0deg)'});
                $(el).find('.circle-right').css({'-webkit-transform': 'rotate('+deg+'deg)', 'transform': 'rotate('+deg+'deg)'});
            }
            //文本
            $(el).find('.circle-mask span').text(persent);
        }
        // 对话框动效
        function addDialogCust(wrap_id, txt, flag) {
            var $chattingWrap = $('#' + wrap_id);
            var $articleDom = $("article[data-id='" + flag + "']");
            // var isExist = false;

            if ($articleDom && $articleDom.length > 0) {
                $articleDom.remove();
                // isExist = true;
            }
            $('<article class="dialog_cust uf uf_ase" data-id="' + flag + '"><div class="message uf_f1"><div class="txt">' + txt + '</div></div><i class="icon icon_cust"></i></article>').appendTo($chattingWrap).addClass('animated slideInUp');

            // 判断页面滚动
            /* var _pageH = $(window).height(),
                _topH = $('.header-bar').height(),
                _botH = 0,
                _contH = 0,
                _dialogH = $('#chattingInner').height(),
                $dialogWrap = $('#chattingWrap'),
                $botItem = $('.choose_bot');

            // 循环计算.choose_bot高度
            _botH = $botItem.eq(0).height();
            for (var i = 0; i < $botItem.length; i++) {
                _botH = (_botH < $botItem.eq(i).height()) ? $botItem.eq(i).height() : _botH
            }
            // 对话框容器高度
            _contH = _pageH - _topH - _botH - 0.2 * store.rootFontSize;
            $dialogWrap.height(_contH + 'px');

            // 对话超出容器高度后，滚动至最底部对话
            if (_dialogH >= _contH) {
                $this.myscrollTop(_dialogH, 500, 'chattingWrap')
            } */

            $this.myscrollTop($('#chattingInner').height(), 500, 'chattingWrap');
        }



        // 活动图片弹层
        const modal = $('.main-modal')
        if(modal.length){
            getElement('.imagewrap').on('click', () => {
                if(modal.length){
                    modal.show()
                }
            })
            modal.on('click','.main-modal-close', ()=>modal.hide())
            modal.on('click','a', ()=>{
                modal.hide()
                const carData = window.c2bConfigInfo && window.c2bConfigInfo.RedirectCarInfo
                if(carData){
                    const options = {}
                    if(carData.CarMasterBrandId){
                        options.brand = {
                            id: carData.CarMasterBrandId,
                            name: carData.CarMasterBrandName,
                            logo: carData.CarMasterBrandLogoUrl
                        }
                    }

                    if(carData.CarSerialId){
                        options.series = {
                            id: carData.CarSerialId,
                            name: carData.CarSerialName,
                            logo: carData.CarSerialImgUrl
                        }
                    }

                    if(carData.CarId){
                        options.car = {
                            id: carData.CarId,
                            name: carData.CarName,
                            price: carData.CarReferPrice
                        }
                        store.vueInstance.selectCarCallback(options)
                    }else{
                        store.vueInstance.$broadcast('showCarSelector', options)
                    }
                }
            })
        }

    }

    myscrollTop(scrollTo, time, domId) {
        var scrollFrom = parseInt(document.getElementById(domId).scrollTop),
            i = 0,
            runEvery = 5; // run every 5ms

        scrollTo = parseInt(scrollTo);
        time /= runEvery;

        var interval = setInterval(function () {
            i++;

            document.getElementById(domId).scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;

            if (i >= time) {
                clearInterval(interval)
            }
        }, runEvery);
    }

    confirmCarCity(){
        if (this.chkFormFirst()) {
            $(this.ref.nextBtn).removeClass('btn_disabled');
        } else {
            $(this.ref.nextBtn).addClass('btn_disabled');
        }
    }

    chkFormFirst(){
        if (!store.data.CarId) {
            //$('#CarValidata').show();
            return false;
        }

        if (!store.data.CityId) {
            //$('#CityValidata').show();
            return false;
        }

        return true;
    }

    // 获取c2c顾问电话
    getAdviserTel() {
        if (typeof c2bConfigInfo !== 'undefined' && c2bConfigInfo.IsC2CEnabled) {
            service.get_adviser_tel(res => {
                if (res.Result) {
                    $('#c2c')
                        .show()
                        .find('a')
                        .attr('href', 'tel:' + res.Data.CN400);
                } else {
                    $('#c2c').hide();
                }
            }, res => {
                $('#c2c').hide();
            });
        }
    }

    // 获取卡券信息
    getCardInfo() {
        if (typeof special_coupon_card_info_getting_url !== 'undefined' && special_coupon_card_info_getting_url) {
            service.special_coupon_card_info_getting();
        }
    }
}