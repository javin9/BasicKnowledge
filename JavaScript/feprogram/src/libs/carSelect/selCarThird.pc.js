/*
调用方法
$(obj).selCar2({
	OnlyOnSale: true,
	Callback:function(data){
		...
	}
});

返回值方法
data.data("id")   // CarId
data.data("val")  // CarPrice
*/
	require("./selCarThird.pc.scss");

	var m={CarsBrandVal:'', CarsSerialVal: '', CarsVal: ''};

		(function($){
			var APIURL = window.APIURL
			// if(dev){
			// 	APIURL = 'http://api.chedai.bitauto.com/'
			// }
			var CarSel = function(opts) {
				this.options = {
					CarsAId: 'CarsA',
					CarSelConId: 'CarSelCon',
					CrumbsId: 'carCrumbs',
					BrandConId: 'CarBrandCon',
					SerailConId: 'CarSerailCon',
					CarConId: 'CarCon',
					CarLoadingId: 'CarSelLoadingCon',
					BrandUrl: 'api/Common/GetCarMasterBrandListWithFirstLetter?onlyOnSale=true',
					SerailUrl: 'api/Common/GetCarSerialListWithBrand?onlyOnSale=true&masterBrandId=',
					CarUrl: 'api/Common/GetCarListWithPrice?onlyOnSale=true&serialId=',
					OnlyOnSale: true,
					ShowPrice: false,
					Callback: null,
					IsOutput:true
				};
				if (!opts.OnlyOnSale) {
					this.options.CarUrl = 'api/Common/GetCarListWithPrice?onlyOnSale=false&serialId=';
					this.options.SerailUrl = 'api/Common/GetCarSerialListWithBrand?onlyOnSale=false&masterBrandId=';
				}
				this.options = $.extend(this.options, opts);

				this.CarsACon =  this.options.CarsAId;
				/*if(this.CarsACon[0].tagName=="INPUT"){
					this.CarsACon.attr("data-bind","value : CarsFullVal");
				}else{
					this.CarsACon.attr("data-bind","text : CarsFullVal");
				}*/
				//this.CarsACon.parent().css("position","relative");
				$(document.body).append('<div id="CarSelCon">'+
					'<ul id="carCrumbs">'+
						'<li class="cur"><a href="javascript:void(0);">品牌</a></li>'+
						'<li><span class="jomt">></span></li>'+
						'<li><a href="javascript:void(0);">车型</a></li>'+
						'<li><span class="jomt">></span></li>'+
						'<li><a href="javascript:void(0);">车款</a></li>'+
					'</ul>'+
					'<div id="CarBrandCon">'+
						'<div class="brandLetter">'+
							'<ul ></ul>'+
						'</div>'+
						'<div class="brandList" >'+
						'</div>'+
					'</div>'+
					'<div id="CarSerailCon" >'+
					'</div>'+
					'<div id="CarCon">'+
						
					'</div>'+
					'<div id="CarSelLoadingCon">加载中...</div>'+
				'</div>');

				//ko.applyBindings(MortgageView);

				this.CarSelCon = $('#' + this.options.CarSelConId);
				this.Crumbs = $('#' + this.options.CrumbsId);
				this.BrandCon = $('#' + this.options.BrandConId);
				this.SerailCon = $('#' + this.options.SerailConId);
				this.CarCon = $('#' + this.options.CarConId);
				this.CarLoadingCon = $('#' + this.options.CarLoadingId);

				this.Letters = $('.brandLetter');
			};

			CarSel.prototype.Init = function() {
				var $this = this;

				$this.InitObj();
				$this.ShowCons('update');
				$this.ClickEvents();

				$this.GetAjax($this.options.BrandUrl, '', $this.GetBrandList);
			};

			CarSel.prototype.GetAjax = function(_url, _data, _callback) {
				var $this = this;

				$.ajax({
					type: 'GET',
					url: APIURL + _url + _data,
					dataType: 'jsonp',
					cache: true,
					beforeSend: function() {
						$this.BrandCon.hide();
						$this.SerailCon.hide();
						$this.CarCon.hide();
						$this.CarLoadingCon.show();
					},
					success: function(data) {
						$this.CarLoadingCon.hide();
						_callback($this, data);
					}
				});
			};

			CarSel.prototype.GetBrandList = function($this, obj) {
				if (obj.Result) {
					$this.BrandCon.show();
					var data = obj.Data;
					var letterArr = [];
					//MortgageView.CarBrands([]);
					//MortgageView.CarLetters([]);

					var h="";
					$(".brandList").html('');
					$.each(data, function(i, item) {
						if (item.CategoryCollection.length > 0) {
							//MortgageView.CarBrands.push(item);
							for(var i=0;i<item.CategoryCollection.length;i++){
								h=h+'<dl title="'+item.CategoryName+'"><dd data-id="'+item.CategoryCollection[i].Id+'">'+item.CategoryName + ' ' + item.CategoryCollection[i].Name+'</dd></dl>';
								
							}
							letterArr.push(item.CategoryName);
						}
					});

					$(".brandList").append(h);

					//MortgageView.CarLetters(letterArr);
					var _totalLettersHeight = 208;
					var _singleLettersHeight = 16;
					var DownHtml = '<a class="letters_down"></a>';
					var UpHtml = '<a class="letters_up"></a>';
					var _index = Math.floor(_totalLettersHeight / _singleLettersHeight) - 1;
					letterArr.splice(_index, 0, DownHtml);
					letterArr.splice(_index + 1, 0, UpHtml);
					//MortgageView.CarLetters(letterArr);
					
					h="";
					$(".brandLetter ul").html('');
					for(var i=0;i<letterArr.length;i++){
						h=h+"<li>"+letterArr[i]+"</li>";
					}

					$(".brandLetter ul").append(h);
				}
			};


			CarSel.prototype.GetSerialList = function($this, obj) {
				if (obj.Result) {
					$this.SerailCon.show();
					var data = obj.Data;

					//MortgageView.CarSerials(data);
					var h="";
					$("#CarSerailCon").html('');
					for(var i=0;i<data.length;i++){
						h=h+'<dl>'+'<dt>'+data[i].CategoryName+'</dt>'+'</dl>'+'<dl class="serila_dl">';
						for(var j=0;j<data[i].CategoryCollection.length;j++){
							h=h+'<dd data-id="'+data[i].CategoryCollection[j].Id+'">'+data[i].CategoryCollection[j].Name+'</dd>';
						}
						h=h+'</dl>';
					}

					$("#CarSerailCon").append(h);

					$this.Crumbs.find('li:gt(2)').hide();
					$this.Crumbs.find('li:lt(3)').show();
					$this.Crumbs.find('li:eq(2)').addClass('cur').siblings().removeClass('cur');

					$this.ShowCons('update');
				}
			};


			CarSel.prototype.GetCarsList = function($this, obj) {
				if (obj.Result) {
					$this.CarCon.show();
					var data = obj.Data;

					//MortgageView.CarDetails(data);
					var h="";
					$("#CarCon").html('');
					for(var i=0;i<data.length;i++){
						h=h+'<dl>'+'<dt>'+data[i].CategoryName+'</dt>'+'</dl>'+'<dl class="serila_dl">';
						for(var j=0;j<data[i].CategoryCollection.length;j++){
							h=h+'<dd data-id="'+data[i].CategoryCollection[j].Id+'" data-val="'+(data[i].CategoryCollection[j].OtherData||data[i].CategoryCollection[j].Price)+'" data-spell="'+data[i].CategoryCollection[j].Spell+'" title="'+data[i].CategoryCollection[j].Name+'">'+data[i].CategoryCollection[j].Name+'</dd>';
						}
						h=h+'</dl>';
					}

					$("#CarCon").append(h);
					$this.Crumbs.find('li').show();
					$this.Crumbs.find('li:eq(4)').addClass('cur').siblings().removeClass('cur');

					$this.ShowCons('update');
				}

			};


			CarSel.prototype.ClickLetter = function(letter, dirc) {
				var $this = this;
				if (letter !== '') {
					var dftTop = $('.brandList dl[title="A"]').eq(0).position().top
					var curTop = $('.brandList dl[title="' + letter + '"]').eq(0).position().top;
					$('.brandList').scrollTop(curTop - dftTop);
				} else {
					var _singleLettersHeight = $('.brandLetter li:eq(0)').height();
					var _index = $('.letters_down').parent('li').index();
					if (dirc == 'letters_down') {
						$('.brandLetter ul').css('margin-top', '-' + _singleLettersHeight * (_index + 1) + 'px');
					} else {
						$('.brandLetter ul').css('margin-top', '0px');
					}
				}
			};


			CarSel.prototype.InitObj = function() {
				var $this = this;

				$this.Crumbs.find('li:eq(0)').addClass('cur').siblings().removeClass('cur').hide();
				$this.BrandCon.show();
				$this.SerailCon.hide();
				$this.CarCon.hide();

				$this.Letters.find('li').removeClass('cur');
				$this.CarSelCon.find('dd').removeClass('cur');
				$('.brandList').scrollTop(0);
				$('.brandLetter ul').css('margin-top', '0px');

			};


			CarSel.prototype.ShowCons = function(_type) {
				var $this = this;

				$this.CarSelCon.show();
				var _curCrumb = Math.floor($this.Crumbs.find('.cur').index() / 2);
				$('#' + this.options.CarSelConId + ' > div:eq(' + _curCrumb + ')').show().siblings('div').hide();

				if (_type == 'update') {
					$('#' + this.options.CarSelConId + ' > div:eq(' + _curCrumb + ') dd').removeClass('cur');
				}
			};

			CarSel.prototype.ClickEvents = function() {
				var $this = this;

				$this.Crumbs.off('click').on('click', 'a', function(e) {
					$(this).parents('li').addClass('cur').siblings().removeClass('cur');
					$this.ShowCons('changeTab');

					e.stopPropagation();
				});


				$this.CarSelCon.off('click').on('click', function(e) {
					e = e || window.event;
					var $target = $(e.target);


					if ($target.is('.brandList dd')) {
						var _brandId = $target.attr('data-id');
						$this.GetAjax($this.options.SerailUrl, _brandId, $this.GetSerialList);
						$target.addClass('cur').siblings().removeClass('cur');
						m.CarsBrandVal=$target.text().substr(1);
					}

					else if ($target.is('.brandLetter li')) {
						var _letter = $target.text();
						$target.addClass('cur').siblings().removeClass('cur');
						$this.ClickLetter(_letter, '');
					} else if ($target.is('.brandLetter li a')) {
						var _dirc = $target.attr('class');
						$this.ClickLetter('', _dirc);
					}

					else if ($target.is('#' + $this.options.SerailConId + ' dd')) {
						var _serialId = $target.attr('data-id');
						$this.GetAjax($this.options.CarUrl, _serialId, $this.GetCarsList);
						$target.addClass('cur').siblings().removeClass('cur');
						m.CarsSerialVal=$target.text();

					}

					else if ($target.is('#' + $this.options.CarConId + ' dd') || $target.parents('#' + $this.options.CarConId + ' dd').length) {
						if ($this.options.ShowPrice) {
							m.CarsVal=$target.text();

							//MortgageView.CarPriceVal($target.attr('data-val') + '万');
							//MortgageView.CarsFullVal(MortgageView.CarsBrandVal() + ' - ' + MortgageView.CarsSerialVal() + ' - ' + MortgageView.CarsVal());
							if($this.CarsACon[0].tagName=="INPUT" && $this.options.IsOutput){
								$this.CarsACon.val(m.CarsBrandVal + ' - ' + m.CarsSerialVal + ' - ' + m.CarsVal);
							}else if($this.options.IsOutput){
								$this.CarsACon.html(m.CarsBrandVal + ' - ' + m.CarsSerialVal + ' - ' + m.CarsVal);
							}

							//MortgageView.CarId($target.attr('data-id'));
							$this.CarSelCon.hide();
							$this.InitObj();
							//MortgageView.CarYear($target.parents('dl').prev('dl').find('dt').text());

						} else {
							m.CarsVal=$target.text();

							//MortgageView.CarPriceVal($target.attr('data-val'));
							//MortgageView.CarsFullVal(MortgageView.CarsBrandVal() + ' - ' + MortgageView.CarsSerialVal() + ' - ' + MortgageView.CarsVal());
							if($this.CarsACon[0].tagName=="INPUT" && $this.options.IsOutput){
								$this.CarsACon.val(m.CarsBrandVal + ' - ' + m.CarsSerialVal + ' - ' + m.CarsVal);
							}else if($this.options.IsOutput){
								$this.CarsACon.html(m.CarsBrandVal + ' - ' + m.CarsSerialVal + ' - ' + m.CarsVal);
							}
							
							//MortgageView.CarId($target.attr('data-id'));
							$this.CarSelCon.hide();
							$this.InitObj();
							//MortgageView.CarYear($target.parents('dl').prev('dl').find('dt').text());
						}
						if($this.options.Callback && typeof($this.options.Callback) == 'function'){
							$target.attr("data-year",$target.parents('dl').prev('dl').find('dt').text());
							$target.attr("data-fullname",m.CarsBrandVal + ' - ' + m.CarsSerialVal + ' - ' + m.CarsVal);
							$this.options.Callback($target);
						}
					}

					// 阻止冒泡会造成无法统计，尚不清楚为什么要写停止冒泡，暂时移除， 是否有问题待观察
					// e.stopPropagation();
				});

                $(document.body).click(function(e) {
                    if($(e.target).attr('id') !== 'CarSelCon' && !$(e.target).parents("#CarSelCon").length) {
                        $this.CarSelCon.hide();
                    }
                })
				
			};
			

		    $.fn.selCar2 = function(options){
				options.CarsAId=this;
		        var selCar = new CarSel(options); 
				selCar.CarsACon.on('click', function(e) {
					if (selCar.CarSelCon.is(':visible')) {
						selCar.CarSelCon.hide();
					} else {
						selCar.CarSelCon.css("left",$(this).offset().left);
						selCar.CarSelCon.css("top",$(this).offset().top+$(this).height());
						
						selCar.CarSelCon.show();
						selCar.Init();
					}

					e.stopPropagation();
				});
				
		        return this;
		    };
		})(jQuery)
