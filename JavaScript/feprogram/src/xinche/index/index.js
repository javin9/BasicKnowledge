import './index.scss'
import 'jquery.lazyload'
import 'libs/jquery.nivo.slider'
// import 'libs/citylocation/nation'
import 'libs/home_page_ad'
import 'libs/citylocation/pc'
import '../components/question'
import '../components/question/question'
import Swiper from 'libs/swiper/2.0'
import ko from 'knockout'
// import selcar from 'libs/carSelect/selCar.pc'
import main from '../libs/main'
import check from 'libs/check'

const $ajax = main.$ajax

//页面ViewModel
var indexViewModel = {
  /***已贷款总额 ***/
  //LoanTotalMoney: ko.observable('--'),
  /***申请人数 ***/
  //ApplyPersons: ko.observable(),
  /***最近申请***/
  LoanOrders: ko.observableArray(),
  /***常见问题***/
  commonQuestions: ko.observableArray(),
  /***全部车款***/
  // newCarAllBrands: ko.observableArray(),
  /***全部车款***/
  allNewCars: ko.observableArray(),

  brandName: ko.observable(),//车品牌名
}

var Index = {
  //选车文本框
  // selCarInput:$("#selCar"),
  footSwiperBox: $("#footSwiper"),
  tap: $('#tap'),
  chooseCar: $("#chooseCar"),
  carpop: $('#carPop'),
  isLazy: true,
  isSpaceLazy: true,
  footerPos: 0,
  loadBrandsUrl: APIURL + 'api/Common/GetCarMasterBrandListWithFirstLetter/',
  loadSerialsUrl: APIURL + 'api/Common/GetCarSerialListWithBrand/?masterBrandId=',
  // loadSerialsUrl:'http://api.chedai.bitauto.com/api/Common/GetCarSerialListWithBrand/?masterBrandId=',
  init: function () {
    var self = this;
    //轮询
    if (isReplaceDomainQueue && !(main.isIE8 || main.isIE9 || isMobile)) {
      $(".polling").each(function (index, el) {
        if ($(this).attr("data-original")) {
          var _strArr = $(this).attr("data-original").split('/');
          var numIndex = index % 4;
          _strArr[2] = domainQueue[numIndex];

          $(this).attr("data-original", _strArr.join("/"));
        }

      });
    }
    // 广告位延迟加载
    $("img.lazyAdSpace").lazyload({
      placeholder: RESURL + "/images/libs/transparent.gif",
      event: "space"
    });

    //广告层延迟加载
    $("img.lazyAd").lazyload({
      placeholder: RESURL + "/images/libs/transparent.gif",
      event: "sporty",
      skip_invisible: false
    });

    $("div.lazyOrg").lazyload({
      placeholder: RESURL + "/images/libs/transparent.gif",
      event: "sporty2"
    });

    check.telChannel('feedTelChannel', 'feedMobile', BusinessLine, {
      'CityId': CityId,
      'CityText': CityName,
      'PageType': 1,//入口页类型 1-首页 2-列表页结果区 3-列表页无结果 4-按预算列表无结果 5-列表页底部 6-详情页
      'statisticalMarker': 'pc-xinche-index-btn-tel-channel'
    });

    ko.applyBindings(indexViewModel);

    this.dynamicLayout();

    this.selCity();
    this.adInit();

    this.pluginInit();//插件初始化

    this.eventInit();//事件初始化

    this.changeTap();//tap切换初始化
    this.getBrandDate();
    //焦点图下方的接口
    this.getTopInfo();
    this.getRecentApply();
    this.getCommonQuestions();

    //图片惰性加载
    $("img.lazy").lazyload({
      placeholder: RESURL + "/images/libs/transparent.gif",
      threshold: 200
    });
    $("div.lazy").lazyload({
      placeholder: RESURL + "/images/libs/transparent.gif",
      threshold: 200
    });

    if (isMobile) {
      this.footerPos = 1000;
      $("img.lazy").lazyload({
        placeholder: RESURL + "/images/libs/transparent.gif",
        event: "sportyMb"
      });
      $("img.lazy").trigger("sportyMb");
    }

    if ($("#measurement").length > 0) {
      self.measurementFun();
    };
  },
  //遮罩层
  maskLayer: $("#maskLayer"),
  //广告层
  layerAD: $("#layerAD"),

  bodyDom: $("body"),
  // 切换筛选信息
  changeTap() {
    var $that = this;
    $that.tap.find('article .tap-item').mouseenter(function () {
      $(this).find('.right').removeClass('hide');
      $(this).parents('article').addClass('cur');
    }).mouseleave(function () {
      $(this).find('.right').addClass('hide');
      $(this).parents('article').removeClass('cur');
    });
  },
  // 车系弹层
  getBrandDate() {
    let $that = this;
    tools.$ajax({
      url: $that.loadBrandsUrl,
      dataType: 'jsonp',
      success: (res) => {
        if (!res.Result) {
          return tools.showAlert(res.Message);
        }
        let datas = res.Data,
          itemHtml = '',
          unitHtml = '';
        // $('#chooseCar').html(`
        //   <div id="item01" class="list-item"></div>
        //   <div id="item02" class="list-item"></div>
        //   <div id="item03" class="list-item"></div>
        // `); 
        for (let i = 0; i < datas.length; ++i) {

          let data = datas[i],
            brands = data.CategoryCollection,
            brandHtml = '';

          for (let j = 0; j < brands.length; ++j) {
            let brand = brands[j];
            var pb=promotionBrand.split(',')
            var cl='';
            for(var k=0;k<pb.length;k++){
              if(brand.Id==pb[k]){
                cl='branch_cur';
              }
            }
            brandHtml += `<a class="${cl}" href="/${citySpell}/budget/b${brand.Id}/?source=969&scroll=true" target="_blank" brandid=${brand.Id} brandname=${brand.Name}>${brand.Name}</a>`;
          }
          unitHtml = `<div class="car-items clrfix">
                          <div class="fl letter">${data.CategoryName}</div>
                          <div class="fl car-box">
                            ${brandHtml}
                          </div>
                        </div>`;

          // if(!$that.supportCss3('column-count')){
          // $('#chooseCar').html(`
          //   <div id="item01" class="list-item"></div>
          //   <div id="item02" class="list-item"></div>
          //   <div id="item03" class="list-item"></div>
          // `); 

          if (i <= 6) {
            $('#item01').append(unitHtml);
          } else if (i > 6 && i <= 14) {
            $('#item02').append(unitHtml);
          } else {
            $('#item03').append(unitHtml);
          }

          // }else {//支持column-count属性
          //   itemHtml += unitHtml;
          // }
        }
        // if($that.supportCss3('column-count'))
        //   $('#chooseCar').html(itemHtml);       
      }
    })
  },
  // 车款弹层数据
  // getCarData (id) {
  //   let $that = this;
  //   indexViewModel.allNewCars([]);

  //   tools.$ajax({
  //     url: $that.loadSerialsUrl+id,
  //     dataType: 'jsonp',
  //     success: (res) => {
  //       if(!res.Result) {
  //         return tools.showAlert(res.Message);
  //       }
  //       let datas = res.Data;
  //       for(let i = 0; i < datas.length; ++i){
  //         let carObj = {},
  //             data = datas[i],
  //             cars = data.CategoryCollection,
  //             newCar = [];

  //         carObj.carName = data.CategoryName;
  //         for(let j = 0; j < cars.length; ++j){
  //           let obj = {},
  //             car = cars[j];
  //           obj.Name = car.Name;  
  //           obj.ImgUrl = car.ImgUrl;  
  //           obj.Price = car.Price.replace('~','-');
  //           obj.url = '/'+ citySpell +'/'+ car.Spell +'/?source=969';
  //           newCar.push(obj);
  //         }
  //         carObj.carArr = newCar;
  //         indexViewModel.allNewCars.push(carObj);
  //       }

  //       setTimeout(function(){
  //         $that.carpop.show();
  //         $that.carpop.css({'margin-top':-$('#carPop').height()/2 + 'px', 'margin-left': -$('#carPop').width()/2 + 'px'});
  //         $that.carpop.css({'margin-left': -$('#carPop').width()/2 + 'px'});//重置下数据
  //       }, 200);
  //       setTimeout(function(){
  //         if($('.pop-cont').height() > 500){
  //           $('#popBox').css({'overflow-y':'auto'});
  //         }
  //       }, 300);
  //       // 关闭选车弹层
  //       $('#carPop .close, #maskLayer').on('click', function(){
  //         $('body').css({'overflow-y': 'auto'});
  //         $('#hotBrand a, #chooseCar a').removeClass('cur');
  //         $('#maskLayer, #carPop').hide();

  //         $('#maskLayer, #carPop').on('mouseleave', function(){
  //           $('.first').removeClass('cur').find('.right').addClass('hide');
  //         });

  //         $('#popBox').css({'overflow-y':'hidden'});
  //         $('#carPop .close, #maskLayer').off('click');
  //       });
  //     } 
  //   });
  // },
  //切换城市
  selCity: function () {
    window.selCityCallback = function (obj) {
      window.location.href = "/" + obj.citySpell + "/";
    };
  },
  //广告弹层
  adInit: function () {
    var self = this;
    if (self.layerAD.children().length == 0) {
      self.maskLayer.hide();
      self.layerAD.hide();
    } else if (tools.getCookie("adLayer")) {
      self.maskLayer.hide();
      self.layerAD.hide();
    } else {
      tools.setCookie("adLayer", "true")
      $("img.lazyAd").trigger("sporty");

      self.maskLayer.show();
      self.layerAD.show();
      setTimeout(function () {
        self.maskLayer.hide();
        self.layerAD.hide();
      }, 5000);
    }
  },
  
  //常见问题
  getCommonQuestions: function () {
    //常见问题滚动特效
    var commonProblemSwiper = new Swiper('#commonSwiper', {
      slidesPerView: 3,
      slidesPerGroup: 3,
      speed: 1000,
      mode: 'vertical',
      autoplay: 5000,
      loop: true
    });
    $("#commonSwiper").on('mouseover', function () {
      commonProblemSwiper.stopAutoplay();
    }).on('mouseout', function () {
      commonProblemSwiper.startAutoplay();
    })

    //我要提问
    $(".modular_9_qusbtn .question-btn").questions({
      "packageId": "0"
    });
  },
  // 贷款总额 && 正在申请贷款
  getTopInfo: function () {
    var $this = this;
    $ajax({
      url: APIURL + 'api/Other/GetNewCarLoanStatisticsInfo/',
      dataType: 'jsonp',
      success: function (res) {
        if (!res.Result)
          return;
        var _total = res.Data.TotalLoans, _applyingNum = res.Data.ApplyingNum,
          _number = "",
          _numStr = "";
        _total = _total.replace(/,/g, '');
        //_total = tools.formatCurrency(_total.substring(0,_total.length - 8));
        _total = (parseFloat(_total) / 100000000).toFixed(2);
        _total = tools.formatCurrency(_total);

        //_number = parseFloat("0." + _total.substring(_total.length - 8,_total.length - 5)).toFixed(2);

        //_numStr =_number.toString();
        //_numStr = _numStr.substring(2,4);

        //_total =_total.substring(0,_total.length - 3);
        _applyingNum = _applyingNum.replace(/,/g, '');
        // console.log(_total,_number);
        //(_number>0)?_total = _total +"."+ _numStr:_total=_total;
        //indexViewModel.LoanTotalMoney(_total);
        //indexViewModel.ApplyPersons(_applyingNum);
        //滚动数字
        Index.showPersonCount();
      }
    });
  },
  // 最近申请
  getRecentApply: function () {
    var $this = this;
    $ajax({
      url: APIURL + 'api/LoanOrder/GetNewestLoanOrderApprovalInfo/',
      dataType: 'jsonp',
      data: { top: 7 },
      success: function (res) {
        if (!res.Result) {
          return;
        }

        var data = res.Data;
        var ApplyArr = [];
        for (var i = 0; i < data.length; i++) {
          var gender = "";

          (data[i].UserCallName.indexOf("先生") >= 0) ? gender = "<span class='sir'><span>" : gender = "<span class='lady'><span>";
          var ApplyDetail = new Object();
          ApplyDetail.UserCallName = data[i].UserCallName;
          ApplyDetail.Mobile = data[i].Mobile;
          ApplyDetail.CarSerialName = data[i].CarSerialName.replace(',', '-');
          ApplyDetail.LoanAmount = data[i].LoanAmount >= 10000 ? tools.formatCurrency(data[i].LoanAmount / 10000, true) + '万' : tools.formatCurrency(data[i].LoanAmount, false) + '元';
          ApplyDetail.Status = data[i].Status;
          ApplyDetail.ApplyDate = data[i].ApplyTime.replace(/\//g, '-');
          ApplyDetail.Gender = gender;
          ApplyDetail.ApproveQuota = data[i].ApproveQuota >= 10000 ? tools.formatCurrency(data[i].ApproveQuota / 10000, true) + '万' : tools.formatCurrency(data[i].ApproveQuota, false) + '元';
          ApplyDetail.EarnMoney = data[i].EarnMoney >= 10000 ? tools.formatCurrency(data[i].EarnMoney / 10000, true) + '万' : tools.formatCurrency(data[i].EarnMoney, false) + '元';
          ApplyDetail.IncomeName = data[i].IncomeName;
          ApplyDetail.LoanCompanyName = data[i].LoanCompanyName;

          ApplyDetail.QualificationInfo = data[i].CreditName + " " + data[i].CareerName + " " + data[i].HouseStateName;

          ApplyArr.push(ApplyDetail);
        }
        indexViewModel.LoanOrders(ApplyArr);
        /**************最近申请滚动****************/
        var marquee = new Swiper('#marquee', {
          slidesPerView: 4,
          speed: 800,
          mode: 'vertical',
          autoplay: 5000,
          loop: true,
          autoplayDisableOnInteraction: false,
          onFirstInit: function () {
            $("#marquee").hover(function () {
              marquee.stopAutoplay();
            }, function () {
              marquee.startAutoplay();
            })
          }
        })
      }
    });
  },
  pluginInit: function () {

    /*获取贷款*/
    $(".selcar_con .getloan_btn").on("click", function () {
      if ($(this).attr("href") == "javascript:void(0);") {
        $("#carTip").fadeIn();
        setTimeout(function () {
          $("#carTip").fadeOut(1000);
        }, 2000);
      }
    })
    /************首页banner初始化************/
    $(".slider img").height($(".slider img").width() * 548 / 1920);
    $(".slider").nivoSlider({
      effect: "fade", //slideInLeft,slideInRight,sliceDown,sliceDownLeft,sliceUp,sliceUpLeft,sliceUpDown,sliceUpDownLeft,fold,fade,random,boxRandom,boxRain,boxRainReverse,boxRainGrow,boxRainGrowReverse
      manualAdvance: false,   // 是否手动播放(false为自动播放幻灯片) 
      directionNav: false,  //是否显示图片切换按钮(上/下页) 
      controlNav: true  // 显示序列导航 
    });
    /*************申请人数数字效果*************/
    setInterval(function () {
      Index.getTopInfo()
    }, 60000);





    /*****************选车*********************/
    //     this.selCarInput.selCar({
    //   CallBacks: selCarCallBack
    // });

    // function selCarCallBack(obj) {
    //   var hrefStr = "javascript:void(0);",
    //     targetStr="";

    //           if (obj.returnType == "carType") {
    //                var carName = obj.carType,
    //                   carId = obj.carTypeId,
    //                   brandName = obj.brandName,
    //                   spell = obj.spell;
    //               Index.selCarInput.val(brandName + " " + carName).attr("data-spell", spell);
    //             hrefStr = "/"+ citySpell +"/" + spell+"/?source=606";
    //             window.open(hrefStr);
    //             targetStr = "_blank"; 
    //           }else if(obj.returnType =="clear"){
    //             targetStr = "_self";
    //           }
    //           $(".selcar_con .getloan_btn").attr({"href":hrefStr,"target":targetStr});  
    //       };
    /*************选项卡切换事件***************/
    new Tabs({
      tabsId: "modular_2_tabs",//tabs  ID
      consId: "modular_2_sins" //cons  ID
    });
    new Tabs({
      tabsId: "modular_3_tabs",//tabs  ID
      consId: "modular_3_sins" //cons  ID
    });
    new Tabs({
      tabsId: "modular_4_tabs",//tabs  ID
      consId: "modular_4_sins" //cons  ID
    });
    /*****************swiper*******************/
    $(".index").find(".swiperEvt").each(function (i) {
      if ($(this).find(".swiper-slide").length > 1) {
        var num = $(this).data("swipernum");
        Index["mySwiper" + num] = new Swiper('#modular_' + num + '_swiper', {
          pagination: '.modular_' + num + '_pagination',
          loop: true,
          autoplay: 3000,
          grabCursor: true,
          paginationClickable: true,
          // cssWidthAndHeight: true
        });
        $('.arrow_' + num + '_left').on('click', function (e) {
          e.preventDefault();
          Index['mySwiper' + num].swipePrev();
        });
        $('#modular_' + num + '_swiper').parent().hover(function () {
          $(this).addClass("hover");
        }, function () {
          $(this).removeClass("hover");
        });
        $('.arrow_' + num + '_right').on('click', function (e) {
          e.preventDefault();
          Index['mySwiper' + num].swipeNext();
        });
      }

    });


    /****************************************/
  },
  dynamicLayout: function () {
    var $this = this;
    //console.log($(window).scrollTop() + $(window).height() + 200 + $this.footerPos > Index.footSwiperBox.offset().top);
    if ($(window).scrollTop() + $(window).height() + 200 + $this.footerPos > Index.footSwiperBox.offset().top) {
      if ($this.isLazy) {
        $("div.lazyOrg").trigger("sporty2");
        $this.isLazy = false;
        // 底部logo轮播
        setTimeout(function () {
          var footSwiper = new Swiper('#footSwiper', {
            paginationClickable: true,
            slidesPerView: 8,
            slidesPerGroup: 8,
            speed: 800
          })

          $('.footer_left').on('click', function (e) {
            e.preventDefault();
            footSwiper.swipePrev();
            // console.log(footSwiper.activeIndex);
          });
          $('.footer_right').on('click', function (e) {
            e.preventDefault();
            footSwiper.swipeNext();
            // console.log(footSwiper.activeIndex);
          });
        }, 400);
      };

    }

    /***********广告位轮播***********/
    // console.log($(window).scrollTop() + $(window).height() + 200 + this.footerPos, $('#adBox').offset().top)
    if ($('#adBox').length > 0) {

      if ($(window).scrollTop() + $(window).height() + 200 + $this.footerPos > $('#adBox').offset().top) {
        if ($this.isSpaceLazy) {
          $this.isSpaceLazy = false;
          $("img.lazyAdSpace").trigger("space");

          if ($("#adSpace .swiper-slide").length > 1) {
            setTimeout(function () {
              new Swiper('#adSpace', {
                pagination: '#adSpace .pagination',
                paginationClickable: true,
                loop: true,
                autoplay: 5000,
                autoplayDisableOnInteraction: false,
                observer: true,
                observeParents: true,
              });
            }, 400);
          }
        }
      }
    }
  },
  eventInit: function () {
    let $that = this;
    // 点击选车
    // $('#hotBrand, #chooseCar').on('click', 'a', function(){
    //   let _id = $(this).attr('brandid'),
    //       _name = $(this).attr('brandname');
    //   $(this).parents('.carEvent').find('a').removeClass('cur');
    //   $(this).addClass('cur');

    //   $('#maskLayer, #carPop').on('mouseenter', function(){
    //     $('.first').addClass('cur').find('.right').removeClass('hide');
    //   });
    //   indexViewModel.brandName(_name);
    //   $that.getCarData(_id);
    //   $('body').css({'overflow-y':'hidden'});
    //   $('#maskLayer').show();
    // });

    //滚动判断
    $(window).on("scroll resize", function () {

      Index.dynamicLayout();
    });

    //广告层关闭
    $("#layerAD .close-btn").on("click", function () {
      Index.maskLayer.hide();
      Index.layerAD.hide();
    })

 

    /****限时特卖*****/
    $(".modular_1>.modular_1_list:eq(0)").animate({ "top": 0 }, 600, "swing");
    var m1_index = 0, m1Timer;
    var m1Fn = function () {
      m1Timer = setInterval(function () {
        var m1_len = $(".modular_1").children(".modular_1_list").length;
        m1_index = (m1_index == m1_len - 1) ? 0 : m1_index + 1;
        $(".modular_1>.modular_1_list:eq(" + m1_index + ")").css("z-index", 2).animate({ "top": 0 }, 600, "swing", function () {
          $(".modular_1>.modular_1_list:eq(" + m1_index + ")").siblings().css("top", "-100%");
        })
          .siblings().css("z-index", 1);
      }, 5600);
    }
    m1Fn();
    $(".modular_1").on("mouseover", function () {
      clearInterval(m1Timer);
    })
      .on("mouseout", function () {
        m1Fn();
      });
    /****************/
    $(".modular_1_sin a").each(function () {
      if (!$(this).parents(".modular_1_sin").hasClass("no"))
        $(this).btnHover();
    });

    $(".modular_1 .modular_1_sin_special").hover(function (e) {
      if (!$(this).hasClass('no')) {
        $(this).find('.modular_1_btn .mask').stop().animate({
          'height': '100%'
        }, 300);
      }

    }, function (e) {
      if (!$(this).hasClass('no')) {
        $(this).find('.modular_1_btn .mask').stop().animate({
          'height': 0
        }, 300);
      }
    });

    $(".modular_2 .sin_model_3_sin img,.modular_5 .sin_model_3_car img").each(function () {
      $(this).leftMove({ time: 300, distance: 20 });
    });

    $(".modular_3").on("mouseover", ".sin_model_2_car", function () {
      if (main.isIE8 || main.isIE9) {
        $(this).find("p").stop().hide(500);
        $(this).find(".sin_model_2_btn").css({ "padding-top": "8px", "padding-bottom": "8px", "height": "auto" }).stop().animate({ "margin-top": "15px" }, 500);
      } else
        $(this).addClass("hover");
    })
      .on("mouseout", ".sin_model_2_car", function () {
        if (main.isIE8 || main.isIE9) {
          $(this).find("p").stop().show(500);
          $(this).find(".sin_model_2_btn").stop().animate({ "padding": 0, "height": 0, "margin-top": 0 }, 500);
        } else
          $(this).removeClass("hover");
      });

    $(".modular_4").on("mouseover", ".sin_model_3_car", function () {
      $(this).find(".sin_model_3_btn").stop().animate({ "bottom": 0 }, 300);
    })
      .on("mouseout", ".sin_model_3_car", function () {
        $(this).find(".sin_model_3_btn").stop().animate({ "bottom": "-40px" }, 300);

      });

    $(".modular_6 .imgEvt").on("mouseover", "img", function () {
      $(this).stop().animate({ "width": "110%", "height": "110%", "margin-left": "-10%", "margin-top": "-5%" }, 500);
    })
      .on("mouseout", "img", function () {
        $(this).stop().animate({ "width": "100%", "height": "100%", "margin-left": "0", "margin-top": "0" }, 500);
      });

    $(".xinzeng .actionImg").on("mouseover", "img", function () {
      $(this).stop().animate({ "width": "110%", "height": "110%", "margin-left": "-10%", "margin-top": "-5%" }, 500);
    })
      .on("mouseout", "img", function () {
        $(this).stop().animate({ "width": "100%", "height": "100%", "margin-left": "0", "margin-top": "0" }, 500);
      });

    $(".modular_8").on("mouseover", ".modular8Evt", function () {
      $(this).find(".modular_8_cover").stop().animate({ 'height': '100%' }, 300);
      $(this).find(".modular_8_btn").stop().animate({ 'opacity': 1 }, 300)
        .find("a").stop().animate({ 'width': '120px' }, 300)
        .find(".mask").stop().animate({ "height": "100%", "top": "0" });
    })
      .on("mouseout", ".modular8Evt", function () {
        $(this).find(".modular_8_cover").stop().animate({ 'height': '70px' }, 300);
        $(this).find(".modular_8_btn").stop().animate({ 'opacity': 0 }, 300)
          .find("a").stop().animate({ 'width': '185px' }, 300)
          .find(".mask").stop().animate({ "height": "0", "top": "50%" });
      });


    if (navigator.userAgent.toLowerCase().indexOf(' applewebkit/') <= -1) {
      $(".clame2Event").each(function () {
        tools.substringClame($(this), 30)
      });
      $(".clame3Event").each(function () {
        tools.substringClame($(this), 70);
      });
    }

  },
  showPersonCount: function () {
    //var n = indexViewModel.ApplyPersons();//模拟数据，需从服务取出真实数据
    /*$("#person_num").aniNumber({
      number: n,
      itemHeight: 40
    });*/
    // $("#money_num").aniNumber({
    //  number: (new Date().getTime()+"").substring(9)//模拟数据，需从服务取出真实数据
    // });
  },
  //身价测量
  measurementFun: function () {
    var self = this;
    $ajax({
      url: APIURL + 'api/Other/GetWorthMeasureTotalCount/',
      dataType: 'jsonp',
      success: function (res) {
        $("#measurement .measure-num").text(self.formatCurrency(res.Data, false));
      }
    })
  },
  /*  货币格式化  */
  formatCurrency: function (num, _bool) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
      num = "0";
    var sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    var cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
      cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
      num = num.substring(0, num.length - (4 * i + 3)) + ',' +
        num.substring(num.length - (4 * i + 3));
    if (_bool) {
      return (((sign) ? '' : '-') + num + '.' + cents);
    } else {
      return (((sign) ? '' : '-') + num);
    }
  }
}

$(function () {
  Index.init();
});







