$(function(){
  $('#demo').click(function(){
    carSearch.search({
          'type': 'ershouche',
          'typeName': '二手车',
          'hide': false,
          'searchText': window.searchText || '',
          'searchLink': window.searchLink || ''
        }, function(result) {
          let citySpell = city.CitySpell;
          const BASEURL = "http://m.daikuan.com";

          if (result.hotCar) {//热门搜索
            let carData = result.hotCar;
              setTimeout(function () {
                if(carData.Url){//二手车
                  if(carData.IsNeddDomain){
                    document.location.href = '//'+carData.Url.replace('{0}',citySpell);
                  }else{
                    document.location.href = carData.Url;
                  }
                }else{//xinche
                  
                  document.location.href = BASEURL + '/' + citySpell + '/' + carData.CarSerialAllSpell + '/?source=' + Source;
                }
              }, 100);
          } else if (result.searchCar) {//input搜索
              let carData = result.searchCar;
              setTimeout(function () {
                if(carData.url){
                  document.location.href = carData.url;//二手车
                }else{//xinche
                  document.location.href = BASEURL + '/' + citySpell + '/' + carData.spell + '/?source=' + Source;
                }
              }, 100);
          } else if (result.brand && result.masterBrand) {//新车全品牌
              setTimeout(function () {
                  document.location.href = BASEURL + '/' + citySpell + '/' + result.brand.spell + '/?source=' + Source;
              }, 100);
          } else if(result.historyCar){//历史搜索
              console.log(result.historyCar)
          }
        })
  });
})