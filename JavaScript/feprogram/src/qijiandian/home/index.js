'user strict';
import './index.scss';
import 'libs/jquery.nivo.slider';
import './accordion.js';
import 'libs/selCity';
import 'libs/carSelect/selCar.pc.js';
$(function(){
  indexObj.init();
});
// 浏览器版本检测
const Main = {
    isIE8: navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/8./i)=="8.",
    isIE9: navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i)=="9."
};
var indexObj = {
  init : function init() {
    this.domInit();
  },
  domInit () {
    var self = this;
    // fix IE8不支持数组的indexOf方法
    if (Main.isIE8 && !Array.prototype.indexOf) {
      Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0)
          from += len;
        for (; from < len; from++) {
          if (from in this &&
            this[from] === elt)
            return from;
        }
        return -1;
      };
    }
    if (!('placeholder' in document.createElement('input'))) {
      $('input[placeholder],textarea[placeholder]').each(function () {
        var that = $(this),
        text = that.attr('placeholder');
        if (that.val() === "") {
          that.val(text).addClass('placeholder');
        }
        that.focus(function () {
          if (that.val() === text) {
              that.val("").removeClass('placeholder');
          }
        })
        .blur(function () {
          if (that.val() === "") {
              that.val(text).addClass('placeholder');
          }
        })
        .closest('form').submit(function () {
          if (that.val() === text) {
              that.val('');
          }
        });
      });
    }
    // 切换城市
    $('#changeCity').selCity({
      isRelationHeader:true,
      loadCityUrl: "/ShopIndex/GetCitiesByCompany?comId=" + companyid,
        dataType:'json'
    });
    $('#changeCity').click(function(){
      $('#nocityPop').addClass('transparent');

      var cityReady = setInterval(function() {
        if ($('#nocityPop .sel-city-menuCon').length) {
          var height = $('#nocityPop .sel-city-menuCon').height();
          if (height < 200) { height = 200; }
          $('#nocityPop').css({
            height: height - 83,  // 83是上下padding之和
            'margin-top': -height/2
          });

          $('#nocityPop .sel-city-nav').click(function() {
            setTimeout(function() {
              var height = $('#nocityPop .sel-city-menuCon').height();
              if (height < 200) { height = 200; }
              $('#nocityPop').css({
                height: height - 83,  // 83是上下padding之和
                'margin-top': -height/2
              });
            });
          });

          clearInterval(cityReady);
        }
      }, 5);
    });
    $('#nocityPop').on('click', '.icon-close',function(){
      $('#nocityPop').removeClass('transparent').removeAttr('style').show();
    });

    window.selCityCallback = function(obj) {
      let hrefArr = location.href.split('/');
      window.location.href = window.location.origin + '/'+ hrefArr[3] + '/' +obj.citySpell + location.search;
    };

    //车辆搜索
    $('#searchCar').selCar({
      EventType:'click',
      IsOpenSearch: true,
      IsBrandsBack: true,
      CallBacks: function(obj){
        if (obj.returnType == "carType") {
          $('#searchCar').val(obj.brandName + " " + obj.carType);
          window.open("/product/"+localcityspell+'/s'+ obj.carTypeId +'/c'+companyid);
        };
      }
    });

    //hover选车
    let _BrandsUrl = isshowallbrand ? false : '/ShopIndex/GetMasterBrandListBlueSky?comid='+companyid+'&cityid='+ localcityid,
        _SerialsUrl = isshowallbrand ? false : '/ShopIndex/GetCarSerialByMasterBrand?comid='+ companyid +'&cityid='+ localcityid + '&bsid=',
        _dataType = isshowallbrand ? 'jsonp' : 'json';
    $('#hoverCar').selCar({
      BrandsUrl: _BrandsUrl,
      BrandsType: _dataType,
      SerialsUrl: _SerialsUrl,
      SerialsType: _dataType,
      EventType:'hover',
      IsOpenSearch:false,
      CallBacks:function(obj){
        window.open("/product/"+localcityspell+'/s'+ obj.carTypeId +'/c'+companyid+(source||source!=''?'?source='+source:''));
      }
    });

    $('.jiduanEvent').each(function(){
      let _sedWidth = 251 - $(this).find('span').eq(0).css('width').replace('px','') - 37;
        $(this).find('span').eq(1).css('width', _sedWidth+'px');    
    });

    if(isshowallbrand){
      $('.search-box').show();
    }
    self.headerSlider();
    self.GetCurrentCity();
    self.renderHotCars();
  },
    //热门车型
    renderHotCars(){
      var $hotCars = $("#hotCars"),
          $hotCarsLoad = $hotCars.find(".loading"),
          $hotCarList = $hotCars.find(".hot-car-list"),
          $hotItem = $('.hot-item'),
          _html ="";
      $.ajax({
        url:"/shopindex/gethotsalelist?comid="+companyid+"&cityid="+localcityid,
        success:function(res){
          // res = JSON.parse(res);
          if(!res || ((res instanceof  Array) && res.length==0)){
              $hotItem.hide();
          }else{
              $.each(res,function(index,item){
                  _html += `<li>
              <a href="/product/${localcityspell}/s${item.cs_Id}/c${companyid}?source=${source}" target="_blank">
                  <img src="${item.CarSerialImgUrl}">
                  <div class="car-ctn">
                  <h3 class="ut-s">${item.CarShowName}</h3>`;
                  if(item.PackageFeatureIcon1 || item.PackageFeatureIcon2){
                      _html += `<p class="clrfix jiduanEvent">`;
                  }
                  if(item.PackageFeatureIcon1){
                      _html += `<span class="fl ut-s first"><i class="icon icon_ji"></i>${item.PackageFeatureIcon1}</span>`;
                  }
                  if(item.PackageFeatureIcon2){
                      _html += `<span class="fl ut-s" style="width: 150px;"><i class="icon icon_zheng"></i>${item.PackageFeatureIcon2}</span>`;
                  }
                  if(item.PackageFeatureIcon1 || item.PackageFeatureIcon2){
                      _html += `</p>`;
                  }
                  _html += `<div class="car-detail">
                  <span class="shoufu">首付<font>${item.DownPaymentText}</font></span>
              <span>月供<font>${item.MonthlyPaymentText}</font></span>
              </div>
              </div>
              </a>
              </li>`;

              })
              $hotCarsLoad.hide();
              $hotCarList.html(_html).show();
          }
        },
          error:function(){
              $hotItem.hide();
          }
      })
    },

    // 顶部轮播图
  headerSlider () {
    $("#sliderBox .slider").nivoSlider({
      effect:"fade", //slideInLeft,slideInRight,sliceDown,sliceDownLeft,sliceUp,sliceUpLeft,sliceUpDown,sliceUpDownLeft,fold,fade,random,boxRandom,boxRain,boxRainReverse,boxRainGrow,boxRainGrowReverse
      manualAdvance:false,   // 是否手动播放(false为自动播放幻灯片) 
      directionNav:false,  //是否显示图片切换按钮(上/下页) 
      controlNav:true,   // 显示序列导航 
      pauseOnHover: true    // 当鼠标滑向图片时，停止切换
    });
  },//判断是否当前城市
  GetCurrentCity:function(){
    $.ajax({
      url:'/ShopIndex/GetSupportCitys?comid='+ companyid +'&cityid=' + localcityid,
      type: 'Get',
      dataType: 'json',
      success: function (res) {
        if (res.length <= 0) {
          $("#nocityPop, #maskLayer").show();
          //用来记忆切换城市之后，弹框是否显示
          $("#isShowPop").val("1");
        }else {
          $("#nocityPop, #maskLayer").hide();
          $("#isShowPop").val("");
        }
      }
    });
  }
} 
