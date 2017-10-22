import './list.scss';

import YXSliderClick from 'libs/yxSlider/click.pc';
import 'jquery.lazyload';
import Swiper from 'libs/swiper/2.0';
import ko from 'knockout';
import selcar from 'libs/carSelect/selCar.pc';
import check from 'libs/check';



$("img.lazy").lazyload({
    effect: "fadeIn",
    event: "sportyR"
});
$("img.lazy").trigger("sportyR");

var listViewModel = {  
  /***车型数据***/
  carId: ko.observable(),
  carPrice: ko.observable(),
  /***城市信息***/  
  cityId: ko.observable(),
  cityName: ko.observable(),
  /***贷款数据相关***/
  carPrice: ko.observable(), //车款报价
  downPaymentPercent: ko.observable(), // 首付比例
  downPaymentPercentText: ko.observable(),
  downPayment: ko.observable(), //首付
  downPaymentCount: ko.observable(),//首付金额
  suggestMonthlyPayment: ko.observable(),//建议月供
  loanVolumn: ko.observable(), //贷款额度
  loanVolumnCount: ko.observable(),
  taxes: ko.observable(), //税费
  purchaseTax: ko.observable(), //购置税
  purchaseTaxText: ko.observable(), //购置税显示文本
  purchaseTaxRate: ko.observable(), //购置税率
  repaymentPeriod: ko.observable(), // 分期类别
  career: ko.observable(), // 职业身份
  creditRecord: ko.observable(), // 信用记录
  housingStatus: ko.observable(), // 住房状态
  insuranceCertificate: ko.observable(), // 社保证明
  fundStatus: ko.observable(), // 公积金
  /***产品列表相关**/
  itemTotal: ko.observable("--"),//产品总数
  pageSize: ko.observable(), //产品数据页大小
  pageIndex: ko.observable(), //产品当前数据页
  pageTotal: ko.observable(), //产品总页数
  sortType: ko.observable(), //排序类型
  productsData: ko.observable(), //产品数据
  productsView: ko.observableArray(), //产品视图
  tiexi: ko.observable(), // 是否贴息
  elasticTail: ko.observable(), // 是否弹性尾款
  selectNum:ko.observable(),//选择数量
  company: ko.observable(""),//
  isYouXuan:ko.observable(false),//
  filterName:ko.observable(""),//vip顾问
  isTop:ko.observable(false),//是否置顶
  subHeading:ko.observable(),//副标题

  samePriceCar:ko.observableArray(),//同价位车款
  usedCarRecommend:ko.observableArray(),//超值二手车
  samePriceCarArr: ko.observableArray(),//同预算二手车
};

var list = {
  //接口
  // productsUrl = APIURL + "api/FinancialProduct/SearchFinancialProducts",
  productsUrl: 'http://' + location.host + '/Product/GetList/',

  /*
  DOM缓存部分
  */
  popUpLayer: $(".pop-up-layer"),
  maskLayer: $("#maskLayer"),
  carInfo: $(".car-info"),
  //不限按钮
  unlimitedBtn: $(".list-condition .unlimited"),
  //选择资质等吸顶以及右侧吸底特效
  ceilingBox: $("#ceilingBox"),
  ceilingBoxPos: 0,
  floorBoxHeight: 0,
  floorBox: $("#floorBox"),
  floorHeight: $("#floorBox").height(),
  windowHeight: $(window).height(),
  sortNumberBox: $("#sortNumber"),
  // bodyBox: $("body"),
  //首付期限下拉
  downPaymentBox: $(".sel-down-payment"),
  deadlineBox: $(".sel-deadline"),
  //列表
  loadingList: $(".list-left-box .loading-list"),
  noProduct: $(".list-left-box .no_product"),
  listBox: $(".list-left-box .list-box"),
  listPagination: $("#listPagination"),

  //猜你喜欢
  youLikeListBox: $("#youLikeList"),
  guessYouLikeBox: $("#overEffects01"),

  //您的资质部分DOM
  selOccupationBox: null,
  selCreditBox: null,
  selHousingBox: null,
  selSocialSecurityBox: null,
  selFundBox: null,
  //防止刷接口
  isShowData: true,
  //列表选中个数
  checkboxNum: 0,
  //form表单
  formDom: $("#orderInfoForm"),
  //选车提交按钮DOM
  getLoanBtn: $(".hot-car .sel-car-box .btn"),

  isApplyNow: true,//是否可点击申请
  browser: navigator.appName,
  // trim_Version: navigator.appVersion.split(";")[1].replace(/[ ]/g, ""),
  // 首付
  downPaymentPercent: 0.3, 
  downPaymentArr:[
    {'text':0,'isDisable':false,'isDefault':false,'unit':'%'},
    {'text':10,'isDisable':false,'isDefault':false,'unit':'%'},
    {'text':20,'isDisable':false,'isDefault':false,'unit':'%'},
    {'text':30,'isDisable':false,'isDefault':true,'unit':'%'},
    {'text':40,'isDisable':false,'isDefault':false,'unit':'%'},
    {'text':50,'isDisable':false,'isDefault':false,'unit':'%'},
    {'text':60,'isDisable':false,'isDefault':false,'unit':'%'},
    {'text':70,'isDisable':false,'isDefault':false,'unit':'%'}
  ],
  downPaymentNoUnit: [
    {'text':0,'isDisable':false,'isDefault':false},
    {'text':10,'isDisable':false,'isDefault':false},
    {'text':20,'isDisable':false,'isDefault':false},
    {'text':30,'isDisable':false,'isDefault':false},
    {'text':40,'isDisable':false,'isDefault':false},
    {'text':50,'isDisable':false,'isDefault':false},
    {'text':60,'isDisable':false,'isDefault':false},
    {'text':70,'isDisable':false,'isDefault':false}
  ],
  downPaymentPercentArr: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7],
  // 期限
  term: 36,
  termArr:[
    {'text':12,'isDisable':false,'isDefault':false,'unit':'期'},
    {'text':18,'isDisable':false,'isDefault':false,'unit':'期'},
    {'text':24,'isDisable':false,'isDefault':false,'unit':'期'},
    {'text':36,'isDisable':false,'isDefault':true,'unit':'期'},
    {'text':48,'isDisable':false,'isDefault':false,'unit':'期'},
    {'text':60,'isDisable':false,'isDefault':false,'unit':'期'}
  ],
  termNoUnitArr: [
    {'text':12,'isDisable':false,'isDefault':false},
    {'text':18,'isDisable':false,'isDefault':false},
    {'text':24,'isDisable':false,'isDefault':false},
    {'text':36,'isDisable':false,'isDefault':false},
    {'text':48,'isDisable':false,'isDefault':false},
    {'text':60,'isDisable':false,'isDefault':false}
  ],
  termPercentArr: [12, 18, 24, 36, 48, 60],
  init (){
    ko.applyBindings(listViewModel);
    this.renderDom();
  },
  renderDom (){
    let self = this;
    // 月供数组更改
    let _downP = tools.getUrlParam('downPayment'),
        _term = tools.getUrlParam('repaymentPeriod');
    if(_downP) {
      self.getIndex(self.downPaymentPercentArr, _downP, (i)=>{
        if(i != 3){
          self.downPaymentArr[i].isDefault = true;
          self.downPaymentArr[3].isDefault = false;
        }
      });
      self.downPaymentPercent = _downP;
      // listViewModel.downPaymentPercent(_downP);
    }
    // 期限数组更改
    if(_term){
      self.getIndex(self.termPercentArr, _term, (i)=>{
        if(i != 3){
          self.termArr[i].isDefault = true;
          self.termArr[3].isDefault = false;
        }
      });
      self.term = _term;
      // listViewModel.repaymentPeriod(_term);
    }
    //首付
    self.setYXSlider({
      'id': 'downPayment',
      'sliderArr': self.downPaymentArr,
      'sliderUnitArr': self.downPaymentNoUnit,
      'sliderPercentArr': self.downPaymentPercentArr
    });

    // 期限
    self.setYXSlider();

    //选择、资质下拉菜单事件
    $.each($(".car-info .select-ctrl"), function (index, item) {
        $(item).selectControl(selCallBack,"click","notRender");
    });
    $.each($(".list-condition .select-ctrl"), function (index, item){
        $(item).selectControl(selCallBack,"hover","notRender");
    });
    //下拉菜单的返回方法
    function selCallBack(selDataId, selText, item, selCategory, oldObj,link) {
        // console.log(selDataId + "_" +selText + "_" +item + "_" +selCategory + "_" +oldObj);
        var itemClassName = item.parent().attr("class"),
            itemDataId = item.find("div").attr("data-id"),
            itemTxt = item.find("div").text(),
            isUnlimited = 0;
        // console.log(itemClassName);
        //标红
        function standardRed(){
            if(itemDataId != 0){
                item.find("div").addClass('cur');
            }else{
                item.find("div").removeClass('cur');
            }
            
        }
        // console.log(item);
        if(itemClassName == "switching-models" || itemClassName == "select-offer-box"){
            // console.log(link)
            // if(link){
            //     window.location.href = link;
            // }
        }else if (self.isShowData) {
            
            //console.log(itemClassName);
            switch (itemClassName) {
                case "sel-down-payment"://首付
                    self.carInfoFun(itemDataId, itemTxt, "sel", "downPayment");
                    break;
                case "sel-deadline"://分期
                    self.carInfoFun(itemDataId, itemTxt, "sel", "deadline");
                    break;
                case "sel-occupation"://职业身份
                    listViewModel.career(itemDataId);
                     standardRed();
                    break;
                case "sel-credit"://信用记录
                    listViewModel.creditRecord(itemDataId);
                    standardRed();
                    break;
                case "sel-housing"://住房状态
                    listViewModel.housingStatus(itemDataId);
                    standardRed();
                    break;
                case "sel-social-security"://社保
                    listViewModel.insuranceCertificate(itemDataId);
                    standardRed();
                    break;
                case "sel-fund"://公积金
                    listViewModel.fundStatus(itemDataId);
                    standardRed();
                    break;

            }

            $(".unlimited").parent("dl").find(".select-ctrl div").each(function (index, el) {
                isUnlimited += $(this).attr("data-id");
                if (isUnlimited > 0) {
                    $(".unlimited").children('a').removeClass("cur");
                    return false;
                }
            });
            if (isUnlimited == 0) {
                $(".unlimited").children('a').addClass("cur");
            }

            // self.calculateLoanData();//计算贷款数据
            listViewModel.pageIndex(1);
            self.searchProducts();
        } else {
            var oldDataId = oldObj.oldDataId,
                oldText = oldObj.oldText;
            // if(itemClassName == "sel-down-payment"){
            //     item.find("div").attr("data-id", oldDataId).text("首付"+ oldDataId +"%");
            // }else if(itemClassName == "sel-deadline"){
            //     item.find("div").attr("data-id", oldDataId).text("期限"+ oldDataId +"期");
            // }else{
                item.find("div").attr("data-id", oldDataId).text(oldText);
            // }
            tools.showAlert("大侠手太快啦，等下再试试！");
        }
    };

    // 选择车款
    $('#changeCar').selCar({
      IsOpenSearch: false,
      CallBacks: function(obj){
        if (obj.returnType == "carType") {
          let carName = obj.carType,
              carId = obj.carTypeId,
              brandName = obj.brandName,
              spell = obj.spell;
          $(".car-series font").text(brandName + " " + carName);
          window.location.href = "/www/"+spell+"/?source="+source;
        }
      },
    });
    $('#selCar').selCar({
      IsOpenSearch: false,
      CallBacks: function(obj){
        if (obj.returnType == "carType") {
          var carName = obj.carType,
              carId = obj.carTypeId,
              brandName = obj.brandName,
              spell = obj.spell;
          $(".sel-car-box .text-box").text(brandName + " " + carName).attr("data-spell", spell);
          window.open("/www/"+spell+"/?source=624");
        }
      },
    });
    
    //选择城市
    $(".area-city-box").selCity({
        isRelationHeader: true
    });

    window.selCityCallback = function(obj) {
        $(".area-city-box .area-city-con").attr("data-id",obj.cityId).text(obj.cityName);
        window.location.href = obj.url;
    };

    check.telChannel('noProTelChannel', 'listMobile', BusinessLine, {
      'CityId': city.cityId,
      'CityText': city.cityName,
      'PageType': 3,//入口页类型 1-首页 2-列表页结果区 3-列表页无结果 4-按预算列表无结果 5-列表页底部 6-详情页
      'CarId': car.carId,
      'CarText': car.carSerialShowName+car.carName,
      'statisticalMarker': 'pc-xinche-list-btn-tel-channel'
    });

    check.telChannel('detailBottomTel', 'feedMobile', BusinessLine, {
      'CityId': city.cityId,
      'CityText': city.cityName,
      'PageType': 5,//入口页类型 1-首页 2-列表页结果区 3-列表页无结果 4-按预算列表无结果 5-列表页底部 6-详情页
      'CarId': car.carId,
      'CarText': car.carSerialShowName+car.carName,
      'statisticalMarker': 'pc-xinche-list-btn-tel-channel'
    });
    
    //同价位车款  由ajax改成同步页面输出，滚动效果还在这里
    self.samePriceCar();
    
    //猜你喜欢
    self.guessYouLike();

    //同预算二手车 由ajax改成同步页面输出，滚动/hover效果还在这里
    self.usedCarBudget();
    

    //贷款顾问展示
    $(".list-left-box").on('mouseenter', '.adviser-box', function(){
        $(this).find(".advBox").show();
    }).on('mouseleave', '.adviser-box', function(){
         $(this).find(".advBox").hide();
    });
    // $("document").not(".adviser_tip")
    self.initViewModel();
    self.bindEvent();
    self.getProductCunt();
  },
  // 月供数组需要修改的下标
  getIndex (arr, data, callback) {
    let contrastArr = arr,
        index = 0;
    for(let i = 0; i < contrastArr.length; ++i){
      if(data == contrastArr[i]){
        index = i;
        callback(index)
      }
    }
  },
  // 首付&期限
  setYXSlider (obj) {
    let self = this,
    // 默认值为期限
        defaultObj = {
          'id': 'term',
          'sliderArr': self.termArr,
          'sliderUnitArr': self.termNoUnitArr,
          'sliderPercentArr': self.termPercentArr
        },
        newData = $.extend(defaultObj, obj);
    let newSlider =  new YXSliderClick(newData.id, newData.sliderArr, function(result){
      if(!self.isShowData){
        let noUnit = newData.sliderUnitArr,
            oldNum = newData.id == 'downPayment'?listViewModel.downPaymentPercent():listViewModel.repaymentPeriod();
            
        self.getIndex(newData.sliderPercentArr, oldNum, (i)=>{
          for(let j =0 ; j< noUnit.length; ++j){
            noUnit[j].isDefault = false;
          }
          noUnit[i].isDefault = true;
          newSlider.update(noUnit);
        });
        return tools.showAlert("大侠手太快啦，等下再试试！");
      }
      if(newData.id == 'downPayment')
        listViewModel.downPaymentPercent((result.text/100).toFixed(1));
      else  
        listViewModel.repaymentPeriod(result.text);

      self.searchProducts();
      // self.calculateLoanData();
    });
  },
  //同价位车款
  samePriceCar (){
    var self = this;
    //同价位车款特效
     tools.$ajax({
      url: samePriceCarApiUrl+'?carid='+car.carId+'&cityid='+city.cityId,
      type: 'Get',
      dataType: 'json',
      success: function(res){
        if(!res.Result){
          return false;
        }
        let _data = res.Data;
        if (res.RowCount > 0) {
          for(let i = 0; i < res.RowCount; ++i){
            let sameCars = {},
                _car = _data[i];
            sameCars = {
              productUrl: '/'+city.citySpell+'/'+_car.CarSerialAllSpell+'/m'+_car.CarID+'/?source=619',
              imgUrl: _car.ImageUrl,
              carName: _car.Name,
              carPrice: _car.CarPrice,
              monthlyPaymentText: _car.MonthlyPayment>10000?(_car.MonthlyPayment/10000).toFixed(2)+'万':_car.MonthlyPayment+'元'
            }
            listViewModel.samePriceCar.push(sameCars);
          }

          $('.same-price-car').removeClass('hide');

          //同价位车款特效
          if(res.RowCount > 4){

            var samePriceCarSwiper = new Swiper('#samePriceCar', {
                slidesPerView : 4,
                slidesPerGroup : 4,
                speed: 800,
                mode: 'vertical',
                loop: true
            })
            
            $('.same-price-list .up-btn').on('click', function (e) {
                e.preventDefault();
                samePriceCarSwiper.swipePrev();
            });
            $('.same-price-list .down-btn').on('click', function (e) {
                e.preventDefault();
                samePriceCarSwiper.swipeNext();
            });
          }else {
            $('.same-price-list .swiper-switch').hide();
          }

          self.floorHeight = $("#floorBox").height();
        }
      }
    })

  },
  //猜你喜欢
  guessYouLike (){
      var self = this,
          _url = "/partial/recommend/product/UserFavoriteProducts/?carid="+ car.carId +"&cityID="+ city.cityId +"&citySpell="+ city.citySpell;
      self.sendAjax({
          url: _url,
          dataType: 'text'
      }, guessYouLikeTxt, sendAgain);

       //获取成功
      function guessYouLikeTxt(res) {

          self.guessYouLikeBox.html(res);
          if($.trim(res)!="" && res){

              self.youLikeListBox.fadeIn();
             //猜你喜欢特效
              var youLikeSwiper = new Swiper('#overEffects01', {
                  slidesPerView : 5,
                  slidesPerGroup : 5,
                  speed: 800,
                  autoplay: 8000,
                  loop: true
              })
              $("#overEffects01").on('mouseover',function(){
                  youLikeSwiper.stopAutoplay();
              }).on('mouseout',function(){
                  youLikeSwiper.startAutoplay();
              })
              $('.you-like-list .left-btn').on('click', function (e) {
                  e.preventDefault();
                  youLikeSwiper.swipePrev();
              });
              $('.you-like-list .right-btn').on('click', function (e) {
                  e.preventDefault();
                  youLikeSwiper.swipeNext();
              });

              //猜你喜欢列表鼠标滑过特效
              $("#overEffects01 li a").hover(
                  function () {
                      $(this).find("img").stop().animate({
                          top: '112px'
                      }, 500);
                      $(this).find(".btn").stop().fadeIn(500);
                  },
                  function () {
                      $(this).find("img").stop().animate({
                          top: '122px'
                      }, 500);
                      $(this).find(".btn").stop().fadeOut(500);
                  }
              );

          }else{
             self.youLikeListBox.fadeOut();
          }
          
      }
      // 出错后重新加载
      function sendAgain(info) {
          //console.log(info);
          self.sendAjax({
              url: _url,
              dataType: 'text'
          }, guessYouLikeTxt, sendAgain);
      };
  },
  //同预算二手车
  usedCarBudget (){
      let self = this,
          _userUrl = samePriceUsedCarApiUrl+'?carPrice='+car.carPrice+'&cityID='+city.cityId;
      self.sendAjax({
        url: _userUrl,
        type: 'Get',
        dataType:'json'
      }, usedCarBudgetSuc, usedCarBudgetAgain);

      function usedCarBudgetSuc(res){
        if(!res.Result){
          return false;
        }
        if(res.RowCount >0){//usedCarRecommend超值二手车
          for(let i = 0; i < res.RowCount; ++i){
            let _data = res.Data[i],
                _obj = {},
                _labelStyle = 'icon';

                if(_data.Labels.length > 0){
                  let type = _data.Labels[0].Type;
                  switch(type){
                    case 1:
                      _labelStyle='icon red';
                      break;
                    case 2:
                      _labelStyle='icon orange';
                      break; 
                    case 3:
                      _labelStyle='icon blue';
                      break; 
                    case 4:
                      _labelStyle='icon green';
                      break;  
                    default:
                      _labelStyle='icon';
                      break;
                  }
                }
                _obj = {
                  uCarDetailUrl: ERSHOUCHEURL+'/'+_data.CarCity+'/'+_data.UCarId+'/?source=639',
                  imgUrl: _data.CarPicPath,
                  carFullName: _data.CarFullName,
                  monthPay: _data.MonthPay,
                  spareCount: _data.SpareMoney,
                  spareText: '省'+(_data.SpareMoney>=1?(_data.SpareMoney).toFixed(2)+'万': Math.round(_data.SpareMoney*10000)+'元'),
                  isShowlabels:_data.Labels.length>0?true:false,
                  description: _data.Labels.length>0?_data.Labels[0].Description:'',
                  labelName: _data.Labels.length>0?_data.Labels[0].Name:'',
                  labelStyle: _labelStyle,
                  carYear: _data.CarYear,
                  carMileage: _data.CarMileage<100?'百公里内':(_data.CarMileage/10000).toFixed(2)+'万公里',
                  downPayment: _data.DownPayment,
                }
            if(i<=2){
              listViewModel.usedCarRecommend.push(_obj);
            }
            listViewModel.samePriceCarArr.push(_obj);
          }

          $('.used-car').removeClass('hide');
          if(res.RowCount>=4){
            $('#sameBudget').removeClass('hide');
            setTimeout(function(){
              //同预算二手车特效
              var sameBudgetSwiper = new Swiper('#overEffects02', {
                  slidesPerView : 4,
                  slidesPerGroup : 4,
                  autoplay: 5000,
                  speed: 800,
                  loop: true
              })
              $("#overEffects02").on('mouseover',function(){
                  sameBudgetSwiper.stopAutoplay();
              }).on('mouseout',function(){
                  sameBudgetSwiper.startAutoplay();
              })
              $('.same-budget .left-btn').on('click', function (e) {
                  e.preventDefault();
                  sameBudgetSwiper.swipePrev();
              });
              $('.same-budget .right-btn').on('click', function (e) {
                  e.preventDefault();
                  sameBudgetSwiper.swipeNext();
              });

              //同预算二手车列表鼠标滑过特效
              $("#overEffects02 li a").hover(
                  function () {
                      $(this).find(".same-budget-mask").stop().animate({
                          top: 0
                      }, 500);
                  },
                  function () {
                      $(this).find(".same-budget-mask").stop().animate({
                          top: '200px'
                      }, 500);
                  }
              );
            },300);
          }
          self.floorHeight = $("#floorBox").height();
        }
      }
      function usedCarBudgetAgain(info){
        self.sendAjax({
              url: _userUrl,
              type: 'Get',
              dataType: 'json'
          }, usedCarBudgetSuc, usedCarBudgetAgain);
      } 
  },
  
  //初始化视图Model
  initViewModel () {
      var self = this;
      /***车款数据***/
      listViewModel.carId(car.carId);

      /***城市信息***/
      listViewModel.cityId(city.cityId);
      listViewModel.cityName(city.cityName);
      /***贷款数据***/
      listViewModel.carPrice(car.carPrice);
      listViewModel.downPaymentPercent(self.downPaymentPercent);
      listViewModel.downPaymentPercentText(self.downPaymentPercent*100);
      listViewModel.repaymentPeriod(self.term);
      listViewModel.purchaseTaxRate(car.purchaseTaxRate);
      listViewModel.downPayment("--");
      listViewModel.suggestMonthlyPayment("--");
      listViewModel.loanVolumn("--");
      listViewModel.purchaseTaxText("--");
      listViewModel.career(0);
      listViewModel.creditRecord(0);
      listViewModel.insuranceCertificate(0);
      listViewModel.fundStatus(0);
      listViewModel.housingStatus(0);
      /***产品查询***/
      listViewModel.pageIndex(1);
      listViewModel.pageSize(20);
      listViewModel.sortType("MR");
      listViewModel.tiexi(false);
      listViewModel.elasticTail(false);
      //选择数量
      listViewModel.selectNum(0);
      listViewModel.isTop(false);//是否置顶

      //您的资质下拉菜单DOM获取
      self.selOccupationBox = $(".sel-occupation .select-ctrl");
      self.selCreditBox = $(".sel-credit .select-ctrl");
      self.selHousingBox = $(".sel-housing .select-ctrl");
      self.selSocialSecurityBox = $(".sel-social-security .select-ctrl");
      self.selFundBox = $(".sel-fund .select-ctrl");

      //根据cookie判断
      var _layerSel = tools.getCookie("layerSel");
      // console.log(_layerSel);
      if (!_layerSel) {
          // self.bodyBox.css({ "overflow": "hidden" });
          if(!dev){
            self.popUpLayer.show();
          }else{
            setTimeout(()=>{
              self.popUpLayer.show();
            },1000)
          }
          self.maskLayer.show();
      } else {
          _layerSel = JSON.parse(_layerSel);
          listViewModel.career(_layerSel.career);
          listViewModel.creditRecord(_layerSel.creditRecord);
          listViewModel.insuranceCertificate(_layerSel.insuranceCertificate);
          listViewModel.fundStatus(_layerSel.fundStatus);
          listViewModel.housingStatus(_layerSel.housingStatus);
          self.quaOptionFun(_layerSel);
      }

      //首付下拉菜单默认
      self.downPaymentBox.find(".select-ctrl li").each(function (index, el) {
          var _thisDataId = $(this).attr("data-id"),
              _thisDiv = $(this).parent("ul").siblings('div'),
              _DataType = _thisDiv.attr("data-type");
          if (_thisDataId == listViewModel.downPaymentPercent() * 100) {
              _thisDiv.attr("data-id", _thisDataId).text(_DataType + $(this).text());
          }
      });

      //期限下拉菜单默认
      self.deadlineBox.find(".select-ctrl li").each(function (index, el) {
          var _thisDataId = $(this).attr("data-id"),
              _thisDiv = $(this).parent("ul").siblings('div'),
              _DataType = _thisDiv.attr("data-type");
          if (_thisDataId == listViewModel.repaymentPeriod()) {
              _thisDiv.attr("data-id", _thisDataId).text(_DataType + $(this).text());
          }
      });

  },
  //您的资质选项
  quaOptionFun  (item) {
      var self = this,
          _item = item;
      // console.log(self.selOccupationBox);
      listViewModel.pageIndex(1);
      self.searchProducts('init');
      if (_item.career != 0) {
          selmodify(self.selOccupationBox, _item.career);
      }
      if (_item.creditRecord != 0) {
          selmodify(self.selCreditBox, _item.creditRecord);
      }
      if (_item.housingStatus != 0) {
          selmodify(self.selHousingBox, _item.housingStatus);
      }
      if (_item.insuranceCertificate != 0) {
          selmodify(self.selSocialSecurityBox, _item.insuranceCertificate);
      }
      if (_item.fundStatus != 0) {
          selmodify(self.selFundBox, _item.fundStatus);
      }

      function selmodify(selItem, dataId) {
          // console.log(selItem);
          selItem.find("li").each(function (index, el) {
              if ($(this).attr("data-id") == dataId) {
                  $(this).parent("ul").siblings("div").attr("data-id", dataId).text($(this).text())
              }
          });
          self.unlimitedBtn.find("a").removeClass('cur');
      }

  },
  //ajax
  sendAjax (options, _callback, _errorcallback) {
      var self = this;
      var setting = {
          url: '',
          timeout: 5000,
          type: 'get',
          dataType: 'json',
          cache: true,
          async: true,
          data: {}
      };
      setting = $.extend(setting, options);
      $.ajax({
          url: setting.url,
          type: setting.type,
          dataType: setting.dataType,
          async: setting.async,
          cache: setting.cache,
          data: setting.data,
          beforeSend: function () {
          },
          success: function (res) {
              _callback(res);
          },
          complete: function (XMLHttpRequest, textStatus) {
              if (status == 'timeout') {//超时,status还有success,error等值的情况
                  _errorcallback(textStatus);
              }
          }
      })
  },
  //吸顶吸底的动态布局
  dynamicLayout (){
      let self = this;
      let _right = ($(window).width() - 1200)/2 + 30,
          _height = $('#Header').height() +  $('.path-nav').height();
      self.ceilingBoxPos = $('#conditionBox').height()+$("#condBox").offset().top;
      self.floorBoxHeight = $("#list").offset().top + self.floorHeight;
      //吸顶判断
      if ($(window).scrollTop() > self.ceilingBoxPos && $(window).scrollTop() < self.listPagination.offset().top) {
          self.ceilingBox.css({
              "position": "fixed",
              "top": 0,
              "width": "1200px",
              "left": "50%",
              "margin-left": "-600px",
              "z-index": "100"
          });
          self.sortNumberBox.css({
            "position": "fixed",
            "top": "4px",
            "right": _right + 'px',
            "z-index": "101"
          });
      } else {
          self.ceilingBox.css({
              "position": "relative",
              "left": 0,
              "margin-left": 0,
              "width":"940px",
              "z-index": "1"
          });
          self.sortNumberBox.css({
            "position": "absolute",
            "top": 0,
            "right": "20px",
            "z-index": "0"
          });
      }

      if($(window).height() > self.floorBoxHeight){//右侧高度较低
        var _leftPos = $("#list").offset().left + $("#list .left").width() + 40 - $(window).scrollLeft();
        if($(window).scrollTop() <= $('#list').offset().top){
          self.floorBox.css({
              "bottom":"auto",
              "top":"0",
              "right": "0",
              "left":"auto",
              "marginLeft":0,
              "position":"absolute"
          });
        }else if($(window).scrollTop() > $('#list').offset().top && $(window).scrollTop() <= self.ceilingBoxPos){
          self.floorBox.css({
              "bottom":"auto",
              "left":_leftPos+"px",
              "right": "auto",
              "top":"50px",
              "position":"fixed"
          });
        }else if($(window).scrollTop() > self.ceilingBoxPos && $(window).scrollTop() <= $('#list').offset().top + $('#list').height() - self.floorBox.height() - 50){
          self.floorBox.css({
              "bottom":"auto",
              "left":_leftPos+"px",
              "right": "auto",
              "top":"80px",
              "position":"fixed"
          });
        }else {
          self.floorBox.css({
              "bottom":0,
              "top":"auto",
              "left":"auto",
              "right": "0",
              "marginLeft":0,
              "position":"absolute"
          });
        }
      }else {

        //吸底判断
        if($(window).scrollTop() + $(window).height() >= self.floorBoxHeight && 
            $(window).scrollTop() + $(window).height() < $(".list-con").offset().top+$(".list-con").height()){
            var _leftPos = $("#list").offset().left + $("#list .left").width() + 40 - $(window).scrollLeft();
            self.floorBox.css({
                "bottom":"15px",
                "left":_leftPos+"px",
                "right": "auto",
                "top":"auto",
                "position":"fixed"
            });
            
        }else if($(window).scrollTop() + $(window).height() >= $(".list-con").offset().top+$(".list-con").height()){


            self.floorBox.css({
                "bottom":0,
                "top":"auto",
                "left":"auto",
                "right": "0",
                "marginLeft":0,
                "position":"absolute"
            });
        }else{
            self.floorBox.css({
                "bottom":"auto",
                "top":"0",
                "right": "0",
                "left":"auto",
                "marginLeft":0,
                "position":"absolute"
            });
        }
      }
  },
  //事件
  bindEvent () {
      var self = this;

      //弹出层
      self.popUpLayer.on("click", "dd,.close-layer,.confirm-btn", function (e) {
          e.preventDefault();
          var curTarget = $(e.currentTarget);
          if (curTarget.is("dd")) {
              $(this).addClass('cur').siblings("dd").removeClass('cur');
              var _viewName = $(this).siblings("dt").attr("data-name"),
                  _dataId = $(this).attr("data-id");
              // console.log(_viewName);
              listViewModel[_viewName](_dataId);
          } else if (curTarget.is(".close-layer")) {
              listViewModel.career(0); // 职业身份
              listViewModel.creditRecord(0); // 信用记录
              listViewModel.housingStatus(0); // 住房状态
              listViewModel.insuranceCertificate(0); // 社保证明
              listViewModel.fundStatus(0); // 公积金
              popUpLayerFun();
          } else if (curTarget.is(".confirm-btn")) {
              popUpLayerFun();
          }

      });
      //列表页面总成本
      $('.list-left-box').on("mouseover", '.bor-bot6', function () {
          $(this).siblings('.TotalCost-tip').stop().fadeIn();
      }).on("mouseout", '.bor-bot6', function () {
          $(this).siblings('.TotalCost-tip').stop().fadeOut();
      });
      //礼 付 惠
      $('.list-left-box').on("mouseover", ".Pack-Amount li>div", function () {
          if($(this).hasClass('li-li')){
              //icon 礼包
              var _packageGiftUrl = APIURL + "api/FinancialProduct/GetPackageGiftInfoList/?packageId="+$(this).attr("data-id");
              var _tipBox = $(this).find(".info");
              var _this = $(this)
              $.ajax({
                  url: _packageGiftUrl,
                  dataType: 'jsonp',
                  cache: true,
                  beforeSend: function () {

                  },
                  success: function (res) {
                      if(res.Result){
                          var _packageGiftStr="申请成功后即赠：";
                          $.each(res.Data, function(index, val) {
                              _packageGiftStr +=("<br/>" +val.GiftDescription);
                          });
                          _tipBox.html(_packageGiftStr);
                          _this.stop().fadeIn(300);

                      }
                  }
              });
          }
          $(this).find(".Pack-Amount-tip").stop().fadeIn();
      }).on("mouseout",".Pack-Amount li>div", function () {
          $(this).find(".Pack-Amount-tip").stop().fadeOut();
      });

      //申请要求//严格、一般、宽松
      $('.list-left-box').on("mouseover", ".CommonRequirementType", function () {
          var _html = $(this).find(".info").html();
          if (_html != '') {
              $(this).find(".CommonRequirementType-tip").stop().fadeIn();
          }
          
      }).on("mouseout", ".CommonRequirementType",function () {
          $(this).find(".CommonRequirementType-tip").stop().fadeOut();
      });

      //1小时速批
      $('.list-left-box').on("mouseover", ".PackageEvent", function () {
          var _html = $(this).parents(".dl-Package").find(".info").html();
          if (_html != '' && $(this).parents(".dl-Package").find(".apply-btn").length>0 && 
             ($(this).parents(".dl-Package").find(".apply-btn font").text() == "1小时速批" ||$(this).parents(".dl-Package").find(".apply-btn font").text() == "一小时速批")) {
              $(this).parents(".dl-Package").find(".jisushenpi").stop().fadeIn();
          }else if($(this).hasClass("yxHxm-btn")){
              $(this).parents(".dl-Package").find(".shouxinma").stop().fadeIn();
          }
      }).on("mouseout", ".PackageEvent", function () {
          $(this).parents(".dl-Package").find(".CommonRequirementType-tip").stop().fadeOut();
      });
      //暂无评论.CommentCount
      $('.list-left-box').on("mouseover", '.eventip', function () {
          $(this).siblings('.CommentCount-tip').stop().fadeIn();
      }).on("mouseout", '.eventip', function () {
          $(this).siblings('.CommentCount-tip').stop().fadeOut();
      });
      
     
      //列表总成本滑过
      $(".list-left-box").on("mouseover",".price-box i",function(){
          $(this).siblings("font").stop().fadeIn();
      }).on("mouseout","i",function(){
          $(this).siblings("font").stop().fadeOut();
      });
      
      //弹出层选择
      function popUpLayerFun() {
          var exp = new Date();
          exp.setTime(exp.getTime() + 99999 * 24 * 60 * 60 * 1000);
          exp = exp.toGMTString();

          var _cookieStr = '{"career":' + listViewModel.career() + ',"creditRecord":' + listViewModel.creditRecord() + ',"housingStatus":' + listViewModel.housingStatus() + ',"insuranceCertificate":' + listViewModel.insuranceCertificate() + ',"fundStatus":' + listViewModel.fundStatus() + '}';
          tools.setCookie("layerSel", _cookieStr,exp);

          setTimeout(function () {
              self.maskLayer.hide();
              self.popUpLayer.hide();
              self.quaOptionFun(JSON.parse(_cookieStr));
          }, 300);

      }

      //获取贷款按钮
      self.getLoanBtn.on("click",function(){
          var pathname =  window.location.pathname;
              pathname = (pathname.split("/"))[1];
          var carSpell = $(this).siblings(".sel-car-wrapper").find("#selCar").attr("data-spell");
          if(carSpell){
              window.location.href = window.location.origin +"/"+ pathname +"/" + carSpell+"/?source=624";
          }else{
              tools.showAlert("请选择车型");
          }
      });

      //滚动判断
      $(window).on("scroll resize", function () {
          self.dynamicLayout();
      });

      //市场月供和费税鼠标滑过特效
      $(".car-info .car-info-other li i").hover(
          function () {
              $(this).siblings("font").stop().fadeIn();
          },
          function () {
              $(this).siblings("font").stop().fadeOut();
          }
      );
      //市场月供 新的布局
      $(".car-info .car-info-deadline .pr i").hover(
          function () {
              $(this).siblings("font").stop().fadeIn();
          },
          function () {
              $(this).siblings("font").stop().fadeOut();
          }
      );
      //不限按钮
      self.unlimitedBtn.on("click", function () {
          if (self.isShowData) {
              $(this).children('a').addClass('cur');
              listViewModel.career(0);
              listViewModel.creditRecord(0);
              listViewModel.housingStatus(0);
              listViewModel.insuranceCertificate(0);
              listViewModel.fundStatus(0);
              $(this).parent("dl").find(".select-ctrl").each(function (index, el) {
                  var _txt = $(this).find("ul li:eq(1)").attr("data-text");
                  $(this).find("div").text(_txt).attr("data-id", 0).removeClass('cur');
              });
              $(".list-condition dd .select-ctrl div").text();

              // self.calculateLoanData();//计算贷款数据
              listViewModel.pageIndex(1);
              self.searchProducts();
          } else {
              tools.showAlert("大侠手太快啦，等下再试试！");
          }

      });

      //焦点图右侧首付和期限事件
      self.carInfo.on("click", ".car-info-payment li a,.car-info-deadline li a,.car-info-apply .apply-btn,.total-product", function (e) {
          if (self.isShowData) {
              var curItem = $(e.currentTarget);
              $(this).parents(".car-info-list").find("li").removeClass('cur').end().end().parent("li").addClass('cur');
              if (curItem.is(".car-info-payment li a")) {
                  //单选
                  self.carInfoFun($(this).attr("data-id"), $(this).text(), "radio", "downPayment");
                  // self.calculateLoanData();//计算贷款数据
                  listViewModel.pageIndex(1);
                  self.searchProducts();
              } else if (curItem.is(".car-info-deadline li a")) {

                  self.carInfoFun($(this).attr("data-id"), $(this).text(), "radio", "deadline");
                  // self.calculateLoanData();//计算贷款数据
                  listViewModel.pageIndex(1);
                  self.searchProducts();
              }

              else if(curItem.is(".total-product")){
                  self.scrollListTop();
              }
              
          } else {
              tools.showAlert("大侠手太快啦，等下再试试！");
          }
      });

      //吸顶BOX中元素事件
      self.ceilingBox.on("click", ".sort-check-box .sort-0,.sort-check-box .sort-1,.sort-check-box .sort-2,.sort-check-box .sort-3,.sort-check-box .sort-4,.sort-MR,.sort-ZCB,.sort-YG,.sort-RQ,.apply-btn", function (e) {
          var curItem = $(e.currentTarget);
          if (self.isShowData) {
              self.scrollListTop();
              if (curItem.is(".sort-0")) {
                  var _iBox = $(this).children('i')
                  if (_iBox.hasClass('cur')) {
                      _iBox.removeClass("cur");
                      listViewModel.company("");
                  } else {
                      _iBox.addClass("cur");
                      listViewModel.company(472);
                  }
                  listViewModel.pageIndex(1);
                  self.searchProducts();
              } else if (curItem.is(".sort-1")) {
                  var _iBox = $(this).children('i')
                  if (_iBox.hasClass('cur')) {
                      _iBox.removeClass("cur");
                      listViewModel.tiexi(false);
                  } else {
                      _iBox.addClass("cur");
                      listViewModel.tiexi(true);
                  }
                  listViewModel.pageIndex(1);
                  self.searchProducts();
              } else if (curItem.is(".sort-2")) {
                  var _iBox = $(this).children('i')
                  if (_iBox.hasClass('cur')) {
                      _iBox.removeClass("cur");
                      listViewModel.filterName("");
                  } else {
                      _iBox.addClass("cur");
                      listViewModel.filterName("VIPGW");
                  }
                  listViewModel.pageIndex(1);
                  self.searchProducts();
              } else if (curItem.is(".sort-3")) {
                  var _iBox = $(this).children('i')
                  if (_iBox.hasClass('cur')) {
                      _iBox.removeClass("cur");
                      listViewModel.isYouXuan(false);
                  } else {
                      _iBox.addClass("cur");
                      listViewModel.isYouXuan(true);
                  }
                  listViewModel.pageIndex(1);
                  self.searchProducts();
              } else if (curItem.is(".sort-4")) {
                  var _iBox = $(this).children('i')
                  if (_iBox.hasClass('cur')) {
                      _iBox.removeClass("cur");
                      listViewModel.elasticTail(false);
                  } else {
                      _iBox.addClass("cur");
                      listViewModel.elasticTail(true);
                  }
                  listViewModel.pageIndex(1);
                  self.searchProducts();
              } else if (curItem.is(".sort-MR")) {
                  listViewModel.sortType("MR");
                  sortFun($(this));
              } else if (curItem.is(".sort-ZCB")) {
                  listViewModel.sortType("ZCB");
                  sortFun($(this));
              } else if (curItem.is(".sort-YG")) {
                  listViewModel.sortType("YG");
                  sortFun($(this));
              } else if (curItem.is(".sort-RQ")) {
                  listViewModel.sortType("RQ");
                  sortFun($(this));
              } 

          } else {
              tools.showAlert("大侠手太快啦，等下再试试！");
          }
      });
      //排序后的操作
      function sortFun(sortItem) {
          sortItem.addClass("cur").siblings("a").removeClass("cur");
          listViewModel.pageIndex(1);
          self.searchProducts();
      };


      //列表中的事件
      $(".list-left-box").on("click", ".checkbox,li .apply-btn", function (e) {
          var curItem = $(e.currentTarget);
          if (curItem.is(".checkbox") && !curItem.hasClass('disabled')) {
              if(self.checkboxNum >= 5 && !curItem.hasClass('cur')){
                  tools.showAlert("最多申请5个金融机构！");
              }else{
                  if ($(this).hasClass("cur")) {
                      $(this).removeClass("cur");
                      self.checkboxNum -= 1;
                      listViewModel.selectNum(self.checkboxNum);
                  } else {
                      $(this).addClass("cur");
                      self.checkboxNum += 1;
                      listViewModel.selectNum(self.checkboxNum);
                  }
              }
              
          }else if (curItem.is(".apply-btn") && !curItem.hasClass("disabled")) {
              var _dataApplyUrl = $(this).parents(".footer-info").attr("data-applyUrl");
              var _strUrl =loanOrderApplyUrl  +  (_dataApplyUrl.toLocaleLowerCase().indexOf("/onlineapproval")>=0?_dataApplyUrl.toLocaleLowerCase().replace("/onlineapproval", "/orderapplyyx"):_dataApplyUrl);

              $("#orderInfoForm").attr("action",_strUrl);
              self.checkboxNum = 1;
              listViewModel.selectNum(self.checkboxNum);
              self.listBox.find(".checkbox").removeClass('cur');
              //点击立即申请按钮
              if (self.isApplyNow) {
                  self.applyNow($(this));
                  self.isApplyNow = false;
                  setTimeout(function(){
                      self.isApplyNow = true;
                  }, 1000);
              }else{
                  tools.showAlert("大侠手太快啦，等下再试试！")
              }
          }
          
      });

      //空心按钮特效
      self.listBox.on("mouseover",".effect-btn",function(){
          $(this).find("i").stop().animate({
              height:"100%"
          },200)
      }).on("mouseout",".effect-btn",function(){
          $(this).find("i").stop().animate({
              height:"0"
          },200)
      })

      $(".list-left-box").on('mouseenter', '.adviser-box', function () {
        $(this).find('.adv-list').removeClass('hide');
        $(this).find('.adv-box').append('<div id="telChannel" class="user-box"></div>');
        check.telChannel('telChannel', 'listTel', BusinessLine, {
          'CityId': city.cityId,
          'CityText': city.cityName,
          'PageType': 2,//入口页类型 1-首页 2-列表页结果区 3-列表页无结果 4-按预算列表无结果 5-列表页底部 6-详情页
          'CarId': car.carId,
          'CarText': car.carSerialShowName+car.carName,
          'statisticalMarker': 'pc-xinche-list-btn-tel-channel'
        });
      }).on("mouseleave", '.adviser-box', function () {
        $(this).find('.adv-list').addClass('hide');
        $(this).find('#telChannel').remove();
      })
  },
  track(productId){
    try{
      const pids = $('.list-itme').map((key, item) => `${$(item).attr('data-productid')}_${$(item).find('.bor-bot6 span').text().replace(/\s/g,'')}_${$(item).find('.MonthlyPayment font').text().replace(/\s/g,'')}`).get().join(',')
      bc.evt.send('listproduct', 'listsubmit', pids, `${productId}_${listViewModel.sortType()}_${car.carId}_${city.cityId}_${listViewModel.downPaymentCount()}_${listViewModel.loanVolumnCount()}`)
    }catch(e){}
  },
  //立即申请
  applyNow (item){
      var self = this;

          var footerItem = item.parents("footer.clrfix");

          var _adviserId = footerItem.prev("header").find('.adviser-box').attr("data-id");
          var _checkbox = footerItem.siblings("header.clrfix").find(".checkbox");

          var _strData =  _checkbox.attr('data-pa') + '_' + _checkbox.attr('data-pd') + '_' +(_checkbox.attr('data-pp')?_checkbox.attr('data-pp'):0);
          var _arr = [_strData];
          this.track(_checkbox.attr('data-pd'))

          self.formDom.find('input[name="Orders"]').val(_arr.join());
          self.formDom.find('input[name="CarId"]').val(car.carId);
          self.formDom.find('input[name="CityId"]').val(city.cityId);
          self.formDom.find('input[name="CarPrice"]').val(car.carPrice);
          self.formDom.find('input[name="Source"]').val(source?source:0);
          self.formDom.find('input[name="Line"]').val(BusinessLine);
          self.formDom.find('input[name="AdviserId"]').val(_adviserId);
          self.formDom.find('input[name="From"]').val('');
          
          self.formDom.submit();
  },

  //计算贷款数据
  calculateLoanData () {
      var carPrice = listViewModel.carPrice();
      var downPayment = 0;
      var loanVolumn = 0;
      var taxes = 0;
      var purchaseTaxText = "";
      var purchaseTax = 0;
      var suggestMonthlyPayment = 0;
      var downPaymentPercent = listViewModel.downPaymentPercent();
      if (carPrice == "") {
          downPayment = "--";
          carPrice = "--";
          loanVolumn = "--";
          taxes = "--";
          purchaseTax = "--";
          suggestMonthlyPayment = "--";
      }
      else {
          // console.log(carPrice)
          carPrice = carPrice * 10000;
          // console.log(downPaymentPercent);
          downPayment = tools.addCmma(carPrice * downPaymentPercent);
          loanVolumn = tools.addCmma(carPrice - carPrice * downPaymentPercent);
          taxes = tools.addCmma(carPrice / 1.17 * listViewModel.purchaseTaxRate() + 500 + 950);
          purchaseTax =carPrice / 1.17 * listViewModel.purchaseTaxRate();

          /***
          市场月供＝　（贷款金额×（１＋费率））/期限
          贷款金额 = 车价 ×（1-首付比例）
          参考费率：
          12  9%
          24  17%
          36  25%
          48  34%
          60  42%
          ***/
          var rate = 0.25;
          var repaymentPeriod = listViewModel.repaymentPeriod();
          
          switch (repaymentPeriod) {
              case 12:
                  rate = 0.09;
                  break;
              case 24:
                  rate = 0.17;
                  break;
              case 36:
                  rate = 0.25;
                  break;
              case 48:
                  rate = 0.34;
                  break;
              case 60:
                  rate = 0.42;
                  break;
              default:
                  rate = 0.25;
                  break;
          }
          suggestMonthlyPayment =((carPrice * (1 - parseFloat(downPaymentPercent))) * (1 + rate)) / repaymentPeriod;
      }

      if (purchaseTax == '--') {
          purchaseTaxText = '--';
      } else {
          purchaseTaxText = tools.addCmma(purchaseTax);
      }

      if (suggestMonthlyPayment == '--') {
          suggestMonthlyPayment = '--';
      } else {
          suggestMonthlyPayment = tools.addCmma(suggestMonthlyPayment);
      }
          
      listViewModel.downPayment(downPayment);
      listViewModel.downPaymentCount(carPrice * downPaymentPercent >= 10000?(carPrice * downPaymentPercent/10000).toFixed(2) + '万': Math.round(carPrice * downPaymentPercent)+'元');
      // console.log(listViewModel.downPaymentCount());
      listViewModel.loanVolumn(loanVolumn);
      listViewModel.loanVolumnCount((carPrice - carPrice * downPaymentPercent) >= 10000? ((carPrice - carPrice * downPaymentPercent)/10000).toFixed(2) + '万': Math.round(carPrice - carPrice * downPaymentPercent)+'元')
      listViewModel.taxes(taxes);
      listViewModel.purchaseTaxText(purchaseTaxText);
      listViewModel.purchaseTax(purchaseTax);
      listViewModel.suggestMonthlyPayment(suggestMonthlyPayment);
  },
  // 获取产品总数
  getProductCunt () {
      tools.$ajax({
        url:productCountApiUrl+'&cityid='+city.cityId+'&carid='+car.carId+'&carprice='+car.carPrice,
        type: 'Get',
        dataType:'json',
        success: function(res){
          if(!res.Result){
            return;
          }
          $('#FirstPageProductList1').attr('data-rowcount', res.Data);
          $('#sortNumber span').text(res.Data);
        }
      })
  },
  //获取产品数据
  searchProducts (state) {
      listViewModel.productsView([]);
      listViewModel.downPayment("--");
      listViewModel.loanVolumn("--");
      listViewModel.purchaseTaxText("--");
      listViewModel.taxes("--");
      listViewModel.suggestMonthlyPayment("--");
      listViewModel.itemTotal("--");
      var _packageType;
      listViewModel.elasticTail() ? _packageType = 7 : _packageType = 0;
      var self = this,
          data = {
              carPrice: listViewModel.carPrice(),
              carId: listViewModel.carId(),
              cityId: listViewModel.cityId(),
              downPaymentRate: listViewModel.downPaymentPercent(),
              repaymentPeriod: listViewModel.repaymentPeriod(),
              packageType: _packageType,
              job: listViewModel.career(),
              credit: listViewModel.creditRecord(),
              house: listViewModel.housingStatus(),
              socialSecurity: listViewModel.insuranceCertificate(),
              fund: listViewModel.fundStatus,
              // isNeedFeatures: true,
              sortName: listViewModel.sortType(),
              isDiscount: listViewModel.tiexi(),
              pageIndex: listViewModel.pageIndex(),
              pageSize: listViewModel.pageSize(),
              // IsGmacBuyoutCar: false,
              companyId: listViewModel.company(),
              isYouXuan: listViewModel.isYouXuan(),
              filterName: listViewModel.filterName(),
              isNeedTop: true,
              dealerId: window.dealer.dealerId,
              source: window.source
          },
          _url = self.productsUrl;

      if (state === 'init') {
          self.loadingList.hide();
          self.listPagination.show();
          self.listBox.show();
          obtainList();
      } else {
          self.loadingList.show();
          self.listPagination.hide();
          self.listBox.hide();
          //分页
          tools.listPagination("listPagination", 1, 1);
          if (self.isShowData) {
              self.sendAjax({
                  url: _url,
                  dataType: 'html',
                  data: data
              }, obtainList, sendAgain);
              self.isShowData = false;
          }
      }

      //获取成功
      function obtainList(res) {
          window._companyIdArr =[];

          function callBacks(pageindex) {
              listViewModel.pageIndex(pageindex);
              self.searchProducts();
              self.scrollListTop();
          }

          // 有视图参数才更新视图
          if (res) {
              // 刷新产品视图
              listViewModel.productsData(res);
              self.refreshProductsView();
          } else {
              // 仅计算
              self.calculateLoanData();
          }

          var totalCount = parseInt(self.listBox.attr('data-rowcount'));
          var pageTotal = Math.ceil(totalCount / listViewModel.pageSize());
          //总页数
          listViewModel.pageTotal(pageTotal);
          //分页
          tools.listPagination("listPagination", listViewModel.pageTotal(), listViewModel.pageIndex(), callBacks);

          // 更新个数
          $('.sort-select-num span').text(totalCount);
          $('.total-product label').text(totalCount);

          if (totalCount) {
              $('.list-box').show();
              $('#listPagination').show();
              $('.leave-tel-bottom').show();
              $('.no_product').hide();
          } else {
              $('.list-box').hide();
              $('#listPagination').hide();
              $('.leave-tel-bottom').hide();
              $('.no_product').show();
          }

          //贷款顾问获取
          self.listBox.children('li').each(function (index, elem) {
              var _index = index;
              /**贷款顾问**/
              var cId = $(elem).attr('data-companyid');
              var pId = $(elem).attr('data-productid');
              var _url = adviserApi + `v2/group/getextenlist?CityId=${listViewModel.cityId()}&CompanyIds=${cId}`;
            var fomatPhone = function(phone) {
                return phone.slice(0,4) + '-' + phone.slice(4,7)  + '-' + phone.slice(7,phone.length);
            }
              self.sendAjax({
                  url: _url,
                  dataType: 'jsonp',
              }, adviserList, sendAgain);
              //获取成功
              function adviserList(result) {
                let _adviserId = '',
                    _adviserTitleHtml = '',
                    _advTelStr='',
                    _advTelStrHtml01 = '',
                    _advTelStrHtml02 = '',
                    _adviserListHtml = '',
                    _adviserIdHtml = '';
                if(!result.Total){
                  _adviserTitleHtml = `<font>4000-169-169</font>`;
                }else{
                  var data = result.Data[0],
                      _advLength = data.CallGroup.length;
                  let telNum = '';
                  _adviserListHtml='<dt>直接联系我们：</dt>'
                  for(let i=0; i < _advLength; ++i){
                    _adviserListHtml+=' <dd><span class="num"><font>'+fomatPhone(data.CallGroup[i].CN400)+'</font></span></dd>';
                  }

                  _adviserTitleHtml += `<font>${fomatPhone(data.CallGroup[0].CN400)}</font>`;
                }
                let isWhiteBg = !result.Total || _advLength <= 1 ?true:false;
                _adviserIdHtml = `<span class="img-box fl"></span>
                                  <span class="tel-box fl">${_adviserTitleHtml}</span>
                                  <div class="adv-list hide">
                                    <div class="adv-box">
                                      <dl>
                                        ${_adviserListHtml}
                                      </dl>
                                      <div class="${isWhiteBg?'adviser-tip bg-white':'adviser-tip'}">
                                        <b>小贴士 : </b>顾问服务时间为 <font>9:00-21:00</font>，<br/>我们将为您提供免费的咨询及申请服务，期待您的来电！
                                      </div>
                                      <p>免费打电话，获得专业的建议</p>
                                    </div>
                                  </div>`;
                $(".list-box>li.list-itme").eq(_index).find(".adviser-box").show().attr("data-id", _adviserId).html(_adviserIdHtml);
              };
              // 出错后重新加载
              function sendAgain(info) {
                  self.sendAjax({
                      url: _url,
                      dataType: 'jsonp'
                  }, adviserList, sendAgain);
              };
          });
      }
      // 出错后重新加载
      function sendAgain(info) {
          //console.log(info);
          self.sendAjax({
              url: _url,
              dataType: 'jsonp'
          }, showSerials, sendAgain);
      };
  },
  //刷新产品视图
  refreshProductsView () {
      var self = this,
          productsData = listViewModel.productsData();
      productsData = productsData.replace(/data-original/g, "src");
      self.listBox.replaceWith($(productsData));
      self.listBox = $(".list-left-box .list-box");

      self.loadingList.hide();
      self.listPagination.show();
      self.listBox.show();
      self.isShowData = true;

      self.calculateLoanData();
      // console.log(listViewModel.productsView());
      self.dynamicLayout();
  },
  //滚动到产品初始位置
  scrollListTop () {
      var listStart = $(".list-condition").offset().top;
      //console.log(listStart);
      $('html,body').animate({
          scrollTop: listStart + 'px'
      }, 500);
      return false;
  },
}
$(function(){
  list.init();
  $(".sort-check-box .sort-3").append('<div class="sort-tip">易鑫战略合作机构，拥有优质贷款产品、专业的服务团队</div>')
  $(".sort-check-box .sort-3").on("mouseover", function () {
      $(this).find(".sort-tip").stop().fadeIn();
  }).on("mouseout",  function () {
      $(this).find(".sort-tip").stop().fadeOut();
  });
})
