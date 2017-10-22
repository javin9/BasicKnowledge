require('./nation.scss')

var isSetCookie=true;
 /*var test='';*/
var nation = {
    init:function(){
        var self = this;
        //先渲染基本dom结构
        self.renderDom();
        self.loadCity();
        //添加事件
        self.bindEvent();
    },
    //ajax
    sendAjax:function(options, _callback, _errorcallback){
        var self = this;
        var setting={
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
            beforeSend: function(){

            },
            success: function(res){
                _callback(res);
            },
            complete: function(XMLHttpRequest, textStatus){
                if (status == 'timeout') {//超时,status还有success,error等值的情况
                    _errorcallback(textStatus);
                }
            }
        })
    },
    //渲染DOM
    renderDom:function(){
        var self =this,
            _relation = "", _cityDom = "",_cityDomCityName = '<span class="city col_grey">定位失败</span>';
        if(CityName){
            _cityDomCityName='<a class="city col_red" id="nationCityName" href="/' + citySpell + '/">'+CityName+'</a>'
        }
        _cityDom='<div class="city-loading"></div>'
        $('body').append('<div class="nation" ><div class="title_info">请选择城市，当前城市'+_cityDomCityName+'</div><div id="nationinfo" class="nationinfo">'+_cityDom+'</div></div>')
    },
    //加载城市
    loadCity:function(){
        var self =  this,
            _url = APIURL + "api/Common/GetGroupingCityList",
            domStr = "",
            domBtmStr ="",
            domObj= {},
            navHotStr="",
            navABCDEStr = "",
            navFGHIJStr = "",
            navKLMNOPStr = "",
            navQRSTUVStr = "",
            navWXYZStr = "",
            domHot = "",
            domABCDE ="",
            domFGHIJ = "",
            domKLMNOP = "",
            domQRSTUV = "",
            domWXYZ = "",
            domLiArr = [];

        var dataType = _url.indexOf(location.hostname) > -1 || _url.slice(0,1) === '/' ? 'json' : 'jsonp';
        self.sendAjax({
            url: _url,
            dataType: dataType,
        }, showBrands, sendAgain);

        //获取成功
        function showBrands(res){
            if(res.Result){
                var data = res.Data;


                $.each(data,function(i,item){
                    //console.log(item);
                    if(item.GroupName == "HOT"){
                        navHotStr += "热门城市";
                        domHot += '<div data-panel="domesticfrom" class="hot-city"><dl class="clrfix"><dt>城市</dt><dd class="clrfix"><ul>';
                        $.each(item.ItemCollection,function(index,cityItem){
                            domHot += '<li><a data-url="' + cityItem.Url + '" data-id="'+ cityItem.CityId +'" data-regionId="'+ cityItem.RegionId +'" data-citySpell="'+ cityItem.CitySpell +'" href="javascript:void(0);" title="'+ cityItem.CityName +'">'+ cityItem.CityName +'</a></li>';
                        });
                        domHot += '</ul></dd></dl></div>';
                        domLiArr[0]="Hot";
                    }else if(item.GroupName >="A" && item.GroupName <= "E" && item.GroupName !="HOT"){
                        navABCDEStr += item.GroupName;
                        domABCDE += '<dt>'+ item.GroupName +'</dt><dd class="clrfix"><ul>';
                        $.each(item.ItemCollection,function(index,cityItem){
                            domABCDE += '<li><a data-url="' + cityItem.Url + '" data-id="'+ cityItem.CityId +'" data-regionId="'+ cityItem.RegionId +'" data-citySpell="'+ cityItem.CitySpell +'" href="javascript:void(0);" title="'+ cityItem.CityName +'">'+ cityItem.CityName +'</a></li>';
                        });
                        domABCDE += '</ul></dd>';
                        domLiArr[1]="ABCDE";
                    }else if(item.GroupName >="F" && item.GroupName <= "J" && item.GroupName !="HOT"){
                        navFGHIJStr += item.GroupName;
                        domFGHIJ += '<dt>'+ item.GroupName +'</dt><dd class="clrfix"><ul>';
                        $.each(item.ItemCollection,function(index,cityItem){
                            domFGHIJ += '<li><a data-url="' + cityItem.Url + '" data-id="'+ cityItem.CityId +'" data-regionId="'+ cityItem.RegionId +'" data-citySpell="'+ cityItem.CitySpell +'" href="javascript:void(0);" title="'+ cityItem.CityName +'">'+ cityItem.CityName +'</a></li>';
                        });
                        domFGHIJ += '</ul></dd>';
                        domLiArr[2]="FGHIJ";
                    }else if(item.GroupName >="K" && item.GroupName <= "P" && item.GroupName !="HOT"){
                        navKLMNOPStr += item.GroupName;
                        domKLMNOP += '<dt>'+ item.GroupName +'</dt><dd class="clrfix"><ul>';
                        $.each(item.ItemCollection,function(index,cityItem){
                            domKLMNOP += '<li><a data-url="' + cityItem.Url + '" data-id="'+ cityItem.CityId +'" data-regionId="'+ cityItem.RegionId +'" data-citySpell="'+ cityItem.CitySpell +'" href="javascript:void(0);" title="'+ cityItem.CityName +'">'+ cityItem.CityName +'</a></li>';
                        });
                        domKLMNOP += '</ul></dd>';
                        domLiArr[3] = "KLMNOP";
                    }else if(item.GroupName >="Q" &&  item.GroupName <= "V" && item.GroupName !="HOT"){
                        navQRSTUVStr += item.GroupName;
                        domQRSTUV += '<dt>'+ item.GroupName +'</dt><dd class="clrfix"><ul>';
                        $.each(item.ItemCollection,function(index,cityItem){
                            domQRSTUV += '<li><a data-url="' + cityItem.Url + '" data-id="'+ cityItem.CityId +'" data-regionId="'+ cityItem.RegionId +'" data-citySpell="'+ cityItem.CitySpell +'" href="javascript:void(0);" title="'+ cityItem.CityName +'">'+ cityItem.CityName +'</a></li>';
                        });
                        domQRSTUV += '</ul></dd>';
                        domLiArr[4] = "QRSTUV";
                    }else if(item.GroupName >="W" &&  item.GroupName <= "Z" && item.GroupName !="HOT"){
                        navWXYZStr += item.GroupName;
                        domWXYZ += '<dt>'+ item.GroupName +'</dt><dd class="clrfix"><ul>';
                        $.each(item.ItemCollection,function(index,cityItem){
                            domWXYZ += '<li><a data-url="' + cityItem.Url + '" data-id="'+ cityItem.CityId +'" data-regionId="'+ cityItem.RegionId +'" data-citySpell="'+ cityItem.CitySpell +'" href="javascript:void(0);" title="'+ cityItem.CityName +'">'+ cityItem.CityName +'</a></li>';
                        });
                        domWXYZ += '</ul></dd>';
                        domLiArr[5] = "WXYZ";
                    }
                });
                domObj={
                    "navHotStr":navHotStr,
                    "navABCDEStr":navABCDEStr,
                    "navFGHIJStr":navFGHIJStr,
                    "navKLMNOPStr":navKLMNOPStr,
                    "navQRSTUVStr":navQRSTUVStr,
                    "navWXYZStr":navWXYZStr,
                    "domWXYZ":domWXYZ,
                    "domQRSTUV":domQRSTUV,
                    "domKLMNOP":domKLMNOP,
                    "domFGHIJ":domFGHIJ,
                    "domABCDE":domABCDE,
                    "domHot":domHot
                }
                domStr += '<div class="sel-city-menuCon"><div class="sel-city-nav">';
                var domLiArr2=[],
                    navClass = "",
                    conStyle = "";
                $.each(domLiArr,function(index, el) {
                    if(el!=undefined){
                        domLiArr2.push(el);
                    }
                });

                $.each(domLiArr2,function(index, el) {
                    if(index==0){
                        navClass="active";
                        conStyle ="";
                    }else{
                        navClass ="";
                        conStyle="display:none";
                    }
                    if(el=="Hot"){
                        domStr += '<span data-key="domesticfrom" class="'+navClass+'">' + navHotStr + '</span>';
                        domBtmStr += domHot;
                    }else{
                        domStr +='<span data-key="'+el+'" class="'+navClass+'">' + domObj['nav'+el+'Str'] + '</span>';
                        domBtmStr += '<div data-panel="'+el+'" class="other-city" style="'+conStyle+'"><dl>' + domObj['dom'+el] + '</dl></div>';
                    }
                });

                self.cityData = domStr +"</div>" + domBtmStr +"</div>";
                /*_cityDom=self.cityData;*/

                $('#nationinfo').html(self.cityData)
            }else{
                tools.showAlert("城市加载失败");
            }

        };

        // 出错后重新加载
        function sendAgain(info) {
            //console.log(info);
            self.sendAjax({
                url: _url,
                dataType: 'jsonp'
            }, showSerials, sendAgain);
        };
    },
    //绑定事件
    bindEvent:function(){
        var self = this,_nation=$('.nationinfo')
        $(".nation").on("click",".sel-city-nav span,dd li a,.nationCityName",function(e){
            e.preventDefault();
            var currentTarget = $(e.currentTarget);
            if(currentTarget.is(".sel-city-nav span")){
                $(this).siblings("span").removeClass("active").end().addClass("active");
                var key = currentTarget.attr("data-key");
                _nation.find("div[data-panel]").hide();
                _nation.find("div[data-panel="+key+"]").show();

                /*$('.nation .sel-city-menuCon>div').css({"background-color":"yellow","font-size":"200%"});*/
            }else if(currentTarget.is("dd li a")||currentTarget.is(".nationCityName")){
                var obj= {
                    "cityId":$(this).attr("data-id"),
                    "cityName":$(this).text(),
                    "regionId":$(this).attr("data-regionid"),
                    "url":$(this).attr("data-url"),
                    "citySpell":$(this).attr("data-citySpell")
                }

                //$(".sel-city .sel-city-wrapper").find(".upArrow-icon").removeClass('upArrow-icon').addClass('downArrow-icon');
                var domain = tools.wildcardUrl();
                if(isSetCookie){
                    var cookieString = "selectcity=" + obj.cityId + ";path=/;domain=" + domain;
                    var cookieString_selectCityId = "selectCityId=" + obj.cityId + ";path=/;domain=" + domain;
                    document.cookie = cookieString;
                    document.cookie = cookieString_selectCityId;
                }


                tools.setCookie("selectcity",obj.cityId,"",domain);
                console.log(document.cookie)
                //hasVisit=true; isLayer=false; selectcity=502; selectCityId=502
                setTimeout(function(){
                    $('.sel-city .city-con').text(obj.cityName);

                    //调用头部的城市切换
                    if(window.selCityHeader && $(".sel-city .sel-city-wrapper").attr("data-relation")=="true"){
                        window.selCityHeader(obj);
                    }

                    //全局的返回函数
                    if(window.selCityCallback && $(".sel-city .sel-city-wrapper").attr("data-relation")=="true"){
                        window.selCityCallback(obj);
                    }
                },300);
                $('#maskLayer').hide();
                $('.nation').hide();
            }
        });
    }
}
if (isChina){
    var cookieIsLayer = "isLayer=false;path=/;domain=" + tools.wildcardUrl();
    document.cookie = cookieIsLayer;
    nation.init();
    $('#maskLayer').show();
    setTimeout(function () {
        $('#maskLayer').show();
        $('#maskLayer').off();
    },500)

}


