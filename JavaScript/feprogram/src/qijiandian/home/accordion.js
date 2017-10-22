import React from 'react';
import ReactDOM from 'react-dom';
import ReactRouter from 'react-router';
//快速选车组件

let FastChangeCar = React.createClass({
  getInitialState: function(){
    return {
      data:[]
    }
  },
  componentWillMount: function(){
    let carBrandArrs = [],
        carArrs = [];
    tools.$ajax({
      url: this.props.url,
      dataType: 'json',
      data: { 
        "comid": companyid, 
        "cityid": localcityid,
      },
      success: function(res) {
        let self = this;
        if(!res.Result){
          return tools.showAlert(res.Message);
        }
        for(let i = 0; i <  res.Data.length; ++i){
          let collection = res.Data[i].CategoryCollection;
          for(let k = 0; k < collection.length; ++k){
            carBrandArrs.push(collection[k]);
          }
        }
        carBrandArrs.sort(function(a, b){
          return b.Price - a.Price;
        });

        for(let i = 0; i < carBrandArrs.length; ++i){
          let carBrand = carBrandArrs[i];
          tools.$ajax({
            url: '/ShopIndex/GetCarSerialByMasterBrand?comid=' + companyid + '&bsid=' + carBrand.Id + '&cityid=' +localcityid,
            dataType: 'json',
            type:'Get',
            success: function(resData){
              if(!resData.Result){
                return tools.showAlert(resData.Message);
              }
              // if(resData.Data.length > 0){
                // let rDate = resData.Data[0];
                let rDate = resData.Data,
                    obj = {};
                obj.sortId = i;
                obj.brandName = carBrand.Name;
                obj.ImgUrl = carBrand.ImgUrl;
                obj.CategoryCollection = [];
                for(let m = 0; m < rDate.length; ++m){
                  let carDate = rDate[m],
                      Category = carDate.CategoryCollection;
                  for(let n = 0; n < Category.length; ++n){
                    obj.CategoryCollection.push(Category[n]);
                  }
                }
                obj.CategoryCollection.sort(function(a, b){
                  return b.Price - a.Price;
                });
                carArrs.push(obj);
                // console.log(carArrs);
                if(carArrs.length == carBrandArrs.length){
                  carArrs.sort(function(a,b){
                    return a.sortId - b.sortId; 
                  });
                  $('#accLoad').hide();
                  this.setState({data:carArrs});
                }
              // }
            }.bind(this),
            error: function(xhr, status, err) {
              alert(err.toString());
            }.bind(this)
          })
        }
        // console.log(carArrs)
      }.bind(this),
      error: function(xhr, status, err) {
        alert(err.toString());
      }.bind(this)
      
    });
  },
  handleClick: function(event) {
  	event.stopPropagation();
    let _duration = 200,
        clickDom = $(event.target).hasClass('car-brand')?$(event.target):$(event.target).parents('.car-brand'),
        clickLiDom = clickDom.parent('li'),
        clickCarsDom = clickLiDom.find('.car-box'),
        curCarsDom = $(".car-select li.cur").find(".car-box");  
    if(clickLiDom.hasClass('cur')) {
      clickLiDom.removeClass("cur");
      clickCarsDom.slideUp(_duration);
    }else {
      clickLiDom.addClass("cur").siblings("li").removeClass("cur");
      clickCarsDom.slideDown(_duration);
      curCarsDom.slideUp(_duration);
    }    
  },
  render: function() {
    var self = this;
    var carListView = self.state.data.map(function(carComponent, index){
      return (
        <li className={index == 0?'cur':''} key={index} ref="upDownEvent">
          <div className="car-brand" onClick={self.handleClick}>
            <img src={carComponent.ImgUrl}/>
            <span > {carComponent.brandName} </span>
            <i></i>
          </div>
          <div className={index==0?"car-box":"car-box hide"}>
            {
              carComponent.CategoryCollection.map(function(cars, i){
                let cIndex = i;
                return (
                  <a href={"/product/"+localcityspell+'/s'+ cars.Id +'/c'+companyid + (source||source!=""? '?source='+source : '')} className="ut-s" serialid={cars.Id} key={i} target="_blank">{cars.Name}</a>
                )
              })
            }
          </div>
        </li>
      );
    });

    return (
      <ul className="car-select">
        {carListView}
      </ul>
    );
  }
});

ReactDOM.render(
  <FastChangeCar url="/ShopIndex/GetMasterBrandListBlueSky"/>,
  document.getElementById('accordion')
);

// class FastChangeCar extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {isToggleOn: true};

//     // This binding is necessary to make `this` work in the callback
//     this.handleClick = this.handleClick.bind(this);
//   }

//   handleClick() {
//     this.setState(prevState => ({
//       isToggleOn: !prevState.isToggleOn
//     }));
//   }

//   render() {
//     return (
//       <li className={this.state.isToggleOn ? 'cur' : ''} onClick={this.handleClick}>
//         <div className="car-brand upDownEvent">
//           <img src="http://image.bitautoimg.com/bt/car/default/images/logo/masterbrand/png/55/m_30_55.png"/>
//           <span>日产</span>
//           <i></i>
//         </div>
//         <div className="car-box">
//           <a href="javascript:void(0);" className="ut-s cur">蓝鸟</a>
//           <a href="javascript:void(0);" className="ut-s">骐达TIIDA</a>
//           <a href="javascript:void(0);" className="ut-s">蓝鸟</a>
//         </div>
//       </li>
//     );
//   } 
// }