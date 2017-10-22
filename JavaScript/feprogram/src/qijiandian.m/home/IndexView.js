import 'libs/carSelect/index.scss';
import '../main.scss';
import './IndexView.scss';
import Vue from 'vue';
import 'libs/swiper';
// import down from '../components/appDown.vue';
import citySelect from 'libs/citySelect';
import carSelect from 'libs/carSelect';
import carSecondLevel from 'libs/carSelect/carSecondLevel';

var $hotcarToend = $('#hotcarToend');
//App下载按钮
tools.appDown(true);
new Vue({
  el: '#app',
  ready: function(){
    this.swiperTopImg();
    this.swiperCarLogo();
    this.GetCurrentCity();
    this.getHotCars();
  },
  data: {
    hotCarLists: [],
    pageIndex: 1,
    pageSize: 10
  },
  components: {
    // down
  },
  methods: {
    goBack: function(){
      history.go(-1); 
      return false;
    },
    changeCity: function(e){
      e.preventDefault();
      let cityData ={
        CityId: localcityid,
        CitySpell: localcityspell,
        CityName: localcityname,
        RegionId: regionid,
        Url: "http://daikuan.com/beijing",
        loadCityUrl: "/ShopIndex/GetCitiesByCompany?comId=" + companyid,
        dataType: "json",
        NoHotCity:true
      }
      // ipLocationInfo localcityid
      citySelect.citySelect(cityData, function(result){
        let hrefArr = location.href.split('/');
        window.location.href = window.location.origin + '/'+ hrefArr[3] + '/' +result.CitySpell + location.search;
      });
    },
    swiperTopImg: function(){
      //顶部轮播图
      if($('#swiperTopBanner img').length > 1){
        let mySwiper = new Swiper('#swiperTopBanner', {
          autoplay: 3000,//可选选项，自动滑动
          loop: true,
          pagination : '#swiperTopBanner .swiper-pagination',
          autoplayDisableOnInteraction: false,
          observer:true,
          observeParents:true,
          onSlideChangeEnd: function(swiper){  
              swiper.update();  
          }, 
          //setWrapperSize:true,
          onInit: function (swiper) {
            //console.log(swiper.slides.length)
            if (swiper.slides.length - 2 < 2) {
              swiper.stopAutoplay();
              $('#swiperTopBanner .swiper-pagination').hide();
            } else {
              $('#swiperTopBanner .swiper-pagination').show();
            }
          }
        });
      }
    },
    swiperCarLogo: function(){
      let hotcarSwiper = new Swiper('#hotcarSwiper', {
        slidesPerView: 'auto',
        observer: false
      });
    },//更多品牌选车（全车系）
    selectAllCar: function(e){
      e.preventDefault();
      carSelect.carSelect({
        onlyOnSale: true,
        showLevel: 2,
        showAllBrand: false
      }, function (result) {
        let serialid = "";
        if (!!result.brand)
            serialid = result.brand.id;
        else if (!!result.searchCar)
            serialid = result.searchCar.id;
        else if (!!result.hotCar)
            serialid = result.hotCar.CarSerialID;
        $.ajax({
            url:APIURL + "api/Common/GetDefaultCarBaseInfo", 
            type: 'get',
            dataType: 'json',
            data: {
                "serialId": serialid
            },
            dataType: 'jsonp',
            success: function (res) {
                if (res.Result) {
                  window.location.href = '/product/'+ localcityspell +'/m' + res.Data.CarId + '/c'+ companyid;
                }
            }
        });  
      });   
    },
    //快速选车
    changeCar: function(e){
      let $that = $(e.target).parents('.swiper-slide');
      let bsid = $that.data('bsid'),
          bsname = $that.data('bsname'),
          imgsrc = $that.data('imgsrc'),
          comid = companyid;

      carSecondLevel.carSecondLevel({
        onlyOnSale: true,
        showLevel: 2,
        hide: false,
        secondInterfaceUrl: '/ShopIndex/GetCarSerialByComIdAndBsIdForMSite?comid='+comid+'&bsid='+bsid+'&cityid=' +localcityid,

        secondDataType: 'json'
      },{
          masterBrand: {
              id: bsid,
              name: bsname,
              logo: imgsrc,
              cityid: localcityid,
              companyid: comid
          }
      },function (result) {
        $.ajax({
          url: "/ShopIndex/GetCompanyCarList",
          type: 'get',
          dataType: 'json',
          data: {
            "serialId": result.brand.id,
            "comId": comid,
            "cityid":localcityid
          },
          success: function (res) {
            if (res.length > 0) {
              window.location.href = '/product/'+ localcityspell +'/m' + res[0].Car_id + '/c' + comid;
            }
            else {
              $.ajax({
                url: APIURL + "api/Common/GetDefaultCarBaseInfo",
                data: {
                  "serialId": result.brand.id
                },
                dataType: 'jsonp',
                success: function (res) {
                  if (res.Result) {
                      let carId = res.Data.CarId;
                      window.location.href = '/product/'+ localcityspell +'/m' + carId + '/c' + comid;
                  }
                }
              });
            }
          }
        });
      });
    },//tab切换
    changeTab: function(e){
      $(e.target).addClass('cur').siblings('li').removeClass('cur');
      $('#hotcar_cont > article').eq($(e.target).index()).addClass('cur').siblings('article').removeClass('cur');
    },
    //判断是否当前城市
    GetCurrentCity:function(){
      $.ajax({
        url:'/ShopIndex/GetSupportCitys', 
        data: {
          "comId": companyid,
          "cityid": localcityid
        },
        dataType: 'json',
        success: function (res) {
          if (res.length <= 0) {
            $("#nocityPop").show();
            //用来记忆切换城市之后，弹框是否显示
            $("#isShowPop").val("1");
            $("#hotcar_tri>li").eq(0).removeClass().siblings('li').addClass('cur');
            $("#hotcar_cont>article").eq(0).removeClass().siblings('article').addClass('cur');
          }else {
            $("#nocityPop").hide();
            $("#isShowPop").val("");
            $("#hotcar_tri>li").eq(0).addClass("cur").siblings('li').removeClass();
            $("#hotcar_cont>article").eq(0).addClass("cur").siblings('article').removeClass();
          }
        }
      });
    },//热门车型
    getHotCars: function(){
      let self = this;
      // 热门车型
      $.ajax({
        url: "/ShopIndex/GetHotCar",
        dataType: "json",
        data: { 
          "comid": companyid, 
          "cityid": localcityid, 
          "pageIndex": self.pageIndex,
          "pageSize": self.pageSize
        },
        success: function (data) {
            var loop = 0;
            for (let i = 0; i < data.length; i++) {
              let rdata = data[i];
              if (rdata.DownPaymentText != null){
                rdata.detailUrl = '/product/'+ localcityspell +'/m'+ rdata.Car_Id + '/c'+ rdata.CompanyID;
                self.hotCarLists.push(rdata);
                loop++;
              }
            }

            $('#loadingHotcar').hide();
            if (data.length == data[0].BrandListCount || data.length == 0 || loop == 0)
              $hotcarToend.show();
            else
              $hotcarToend.hide();
            $(".hotcar_list").show();
        }
      });
    }
  }
});