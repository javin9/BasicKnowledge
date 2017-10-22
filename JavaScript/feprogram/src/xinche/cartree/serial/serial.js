import './serial.scss'

import swiper from 'libs/swiper';

class serialPage {
	constructor(){

        this.dom = {
            floorBox: $("#floorBox"),
            ulDownpay: $('#downpayment'),
            ulPeriod: $('#period'),
            ceilingTab: $("#carTab"),
            ceilingTabBot : $('#carTabBot'),
            ceilingTabHold : $('#carTabHolder')
        }

        // 首付
        this.downpayment = 30;
        // 期限
        this.period = 36;
        //滚动状态
        this.rollingFlag = true;

        // 定位
        this._ceilingTabPos;
        this._ceilingTabHeight;
        this._ceilingTabBotPos;
        this.targetPos = [];
	}
    // 初始化
    init(){
        // 动态布局
        this.getPos(); 
        this.dynamicLayout();
        // 默认选中效果
        this.setSelect( this.downpayment, this.period );
        // 默认高亮第n个tr
        this.hightlightTr(0);
        // 事件触发
        this.bindEvent();
        //同价位车款
        this.samePriceCar();
    }

    // 记录定位
    getPos(){
        let self = this;

        setTimeout(function(){
            self._ceilingTabPos = self.dom.ceilingTab.offset().top;
            self._ceilingTabBotPos = self.dom.ceilingTabBot.offset().top;
            self._ceilingTabHeight = self.dom.ceilingTab.height();
            self.dom.ceilingTabHold.height(self._ceilingTabHeight + 'px');

            $('.car_ul_box').each(function(index){
                self.targetPos[index] = $(this).offset().top - 53;
            });
            self.targetPos[self.targetPos.length] = self._ceilingTabBotPos + 53;
        },300)
    }
    // 动态布局
    dynamicLayout(){
        const self = this;

        if(self.rollingFlag){

            $(window).on('scroll', function(){

                let _winScrollTop = $(window).scrollTop();

                // tab吸顶效果
                if( _winScrollTop > self._ceilingTabPos && _winScrollTop < self._ceilingTabBotPos - 78 ){
                    self.dom.ceilingTab.addClass('fixed');
                } else {
                    self.dom.ceilingTab.removeClass('fixed');
                }

                // tab当前位置选中效果
                if ( _winScrollTop < self.targetPos[1] ){
                    self.dom.ceilingTab.find('li:nth-child(1)').addClass('cur').siblings().removeClass('cur');
                }
                for( let i = 1; i < self.targetPos.length-2; i++ ){
                    if ( _winScrollTop >= self.targetPos[i] && _winScrollTop < self.targetPos[i+1] ){
                        self.dom.ceilingTab.find('li:nth-child(' + (i+1) + ')').addClass('cur').siblings().removeClass('cur');
                    }
                }                
                if ( _winScrollTop >= self.targetPos[self.targetPos.length-2] ){
                    self.dom.ceilingTab.find('li:nth-child(' + (self.targetPos.length-1) + ')').addClass('cur').siblings().removeClass('cur');
                }

            });
        }
    }
    // 事件
    bindEvent(){
        const self = this;

        // 首付&期限 点击
        self.dom.ulDownpay.on('click', 'li', function(){
            self.downpayment = $(this).data('id');
            self.setSelect( self.downpayment, self.period );
            self.getData();
        })
        self.dom.ulPeriod.on('click', 'li', function(){
            self.period = $(this).data('id');
            self.setSelect( self.downpayment, self.period );
            self.getData();
        })

        // tab 点击
        self.dom.ceilingTab.on('click', 'li a', function(){

            self.rollingFlag = false;
            
            let _idName = '#' + $(this).data('name'),
                _itemTop;

            if ( self.dom.ceilingTab.hasClass('fixed') ){
                _itemTop = $(_idName).offset().top - self._ceilingTabHeight + 'px';
            } else {
                _itemTop = $(_idName).offset().top - self._ceilingTabHeight + 'px';
            }

            $('html, body').animate({
                'scrollTop': _itemTop
            }, 500);

            setTimeout(function(){
                self.rollingState  = true;
            },600);
        });

        // 查看贷款产品
        /*$('.car_table').on('click', 'tbody tr', function(){
            window.open($(this).data('link')+ '&DownPayment=' + self.downpayment/100 + '&RepaymentPeriod=' + self.period);
        });*/
    }
    /*首付&期限 选中效果
    参数：首付值downpayment，期限值period*/
    setSelect( downpayment, period ){
        const self = this;
        let _downpayment = downpayment,
            _period = period;

        self.dom.ulDownpay.find('li[data-id=' + _downpayment + ']').addClass('cur').siblings('li').removeClass('cur');
        self.dom.ulPeriod.find('li[data-id=' + _period + ']').addClass('cur').siblings('li').removeClass('cur');
        $('.sfProportion').text(self.downpayment);
    }
    /*获取数据*/
    getData(){
        const self = this;

        tools.$ajax({
            url: '/cartree/GetSimpleCalc',
            type: 'get',
            dataType: "json",
            data: {
                id: serialId,
                downpayment: self.downpayment / 100,
                periods: self.period
            },
            success: function (res) {
                if( res.Result ){
                    let data = res.Data;

                    for( let i = 0; i < data.length; i++ ){
                        let _curId = data[i].Id,
                            _curPrice = data[i].Price, // 参考价
                            _curLoanAmountText = data[i].LoanAmountText, // 贷款额度
                            _curDownPaymentText = data[i].DownPaymentText, // 首付
                            _curMonthlyPaymentText = data[i].MonthlyPaymentText; // 月供
                        $('.dl dd').each(function(){
                            if( $(this).find('a').data('id') == _curId ){
                                $(this).find('.call_2 b').text(_curPrice);
                                $(this).find('.call_3 b').text(_curLoanAmountText);
                                $(this).find('.call_4 b').text(_curDownPaymentText);
                                $(this).find('.call_5 b').text(_curMonthlyPaymentText);
                            }
                        });
                        $('.sfProportion').text(self.downpayment);
                    }
                } else {
                    tools.showAlert(res.Message);
                }
            }
        })
    }
    // 同价位车款
    samePriceCar(){
        var samePriceCarSwiper = new Swiper('#samePriceCar', {
            slidesPerView : 4,
            slidesPerGroup : 4,
            speed: 800,
            direction : 'vertical',
            loop: true,
            prevButton: '.swiper-switch .up-btn',
            nextButton: '.swiper-switch .down-btn'
        })
    }
    // 默认高亮
    hightlightTr(index){
        let _n = index;
        let $tr = $('.car_ul_box dl dd'),
            $trCur = $tr.eq(_n);

        $tr.hover(function(){
            $tr.removeClass('active');
            $(this).addClass('active');
        },function(){
            $(this).removeClass('active');
        }),
        
        $trCur.addClass('active') 
    }
}


$(function () {
    $(window).scrollTop(0);
    let sPage = new serialPage();
	sPage.init();
})
/////////////////
window.selCityCallback = function(obj) {
    var brandHref=obj.url,
        httpsubstr=brandHref.substr(0,brandHref.indexOf('.com')),
        brandsubstr=brandHref.substr(brandHref.indexOf('serial'));
    window.location.href = httpsubstr+'.com/'+ obj.citySpell+'/'+brandsubstr;

};
