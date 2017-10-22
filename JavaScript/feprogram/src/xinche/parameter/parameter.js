import './parameter.scss';

class Parameter {
  constructor() {
    this.navIdArr = [];
    this.scrollEvent = true;
  }
  
  init () {
    this.$body = $('.body');
    this.headerHeight = $('#Header').height();
    this.winWidth = $(window).width();
    this.$nav = $('#paramNav');
    this.liHeight = $('#paramUl li').height();
    this.renderDom();
  }

  renderDom () {
    let self = this;
    $.each($(".switching-models .select-ctrl"), (index, item) => {
        $(item).selectControl(function(){},"click","notRender");
    });
    //滚动判断
    $(window).on("scroll resize", function () {
      self.dynamicLayout();
    });

    // 存储参数类型id
    $('.body-ctn dl').each(function(){
      self.navIdArr.push($(this).attr('id'));
    });

    // 切换头部城市
    window.selCityCallback = function(obj){
      window.location.href = window.location.pathname+'/?cityid='+obj.cityId;
    }
    self.bindEvent();
  }

  //绑定事件
  bindEvent () {
    let self = this;
    $('#paramUl li').on('click', function(){
      self.scrollEvent = false;
      let id = $(this).attr('data-id'),
          _top = $('#'+id).offset().top -(self.$body.offset().top - self.headerHeight);

      $(this).addClass('cur').siblings('li').removeClass('cur');  
      setTimeout(function(){
        self.scrollEvent = true;
      }, 300);
      $('body, html').animate({'scrollTop':_top + 'px' });    
    })
  }

  // 吸顶判断
  dynamicLayout () {
    let self = this;
    let _top = self.$body.offset().top - self.headerHeight,
       _left =self.winWidth - (self.winWidth -1060)/2 - 50;

    if($(window).scrollTop() >= self.headerHeight){
      if($(window).scrollTop() + $(window).height() < $("#paramCtn").offset().top + $("#paramCtn").height()) {

        self.$nav.css({
          'position': 'fixed',
          'top':_top + 'px',
          'bottom':'auto',
          'left':_left + 'px'
        });
      }else{
        self.$nav.css({
          'position': 'absolute',
          'top':'auto',
          'bottom': '20px',
          'left':1060 + 20 + 'px'
        });
      }
      // 左侧悬浮工具自动地位
      if(self.scrollEvent){
        $.each(self.navIdArr, function(i, item){
          if(i<self.navIdArr.length-1 && $(window).scrollTop() + _top + self.liHeight*(i+1) >= $('#'+item).offset().top && $(window).scrollTop() + _top + self.liHeight*i < $('#'+self.navIdArr[i+1]).offset().top){
            self.$nav.find('li').eq(i).addClass('cur').siblings('li').removeClass('cur');
          }else if(i == self.navIdArr.length-1 && $(window).scrollTop() + _top + self.liHeight*i >= $('#'+item).offset().top){
             self.$nav.find('li').eq(i).addClass('cur').siblings('li').removeClass('cur');
          }
        });
      }

    }else {
      self.$nav.css({
        'position': 'absolute',
        'top': 0,
        'bottom':'auto',
        'left': 1060 + 20 + 'px'
      });
    } 
  }

}

$(function(){
  var param = new Parameter();
  param.init();
})