import 'libs/carSelect/index.scss';
import '../main.scss';
import './IndexView.scss';
import Vue from 'vue';
import 'libs/swiper';
// import down from '../components/appDown.vue';
import citySelect from 'libs/citySelect';
import carSecondLevel from 'libs/carSelect/carSecondLevel';

var $selectCityBox = $('#selectCity')
//App下载按钮
tools.appDown(true);
new Vue({
  el: '#app',
  data: function(){
    return {
      city: {
        CityId: localcityid,
        CitySpell: localcityspell,
      }
    }
  },
  ready: function(){
    //顶部轮播图
    if($('#swiperTopBanner img').length > 1){
      var mySwiper = new Swiper('#swiperTopBanner', {
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
  components: {
    // down
  },
  methods: {
    changeCity: function(e){
      let self = this;
      e.preventDefault();
      // ipLocationInfo localcityid
      citySelect.citySelect(self.city, function(result){
        let flag =  window.location.href.substr(-1, 1);
        if(flag == '/')
          window.location.href = result.CitySpell;
        else
          window.location.href ='/' +result.CitySpell;
      });
    },
    flagshipClick: function(e){
      // alert($(e.target).parents('div') != $('#car_brands'));
      if($(e.target).parents() != $('#car_brands')){
        window.location.href =$(e.target).parents('.flagshipEvent').data('href');
      }
    },
    changeCar: function(e){
      var $that = $(e.target).parents('.shopEvent');
      e.stopPropagation();
      if($that.hasClass('more')){
        window.location.href = $(this).data('href');
      }else{
        //选车
        let bsid = $that.data('bsid'),
            bsname = $that.data('bsname'),
            imgsrc = $that.data('imgsrc'),
            comid = $that.data('companyid');

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
      }
    }
  }
});