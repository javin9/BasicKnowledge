'use strict';

//css
import '../../common/css/common.scss';
import '../lib/css.scss';
//声明变量
import check from 'libs/check/m';
import citySelect from 'libs/citySelect';
import app from '../../common/script/app';
import XTK from '../../common/script/XTK';
import Store from '../../common/script/Store';
import 'zepto/src/touch';


var _packageId = 0;
var _carId = 0;
var _ProductId = 0;
var _ReferPrice = 0;
var ViewModel = {
    //初始页页面dom
    loadDomView() {
        $('[action]').hide();
        $('#city_btn').html(city.CityName);
        $('#commit_btn').click(function () {
            if ($('#commit_btn').hasClass('no'))
                return;
            $('#commit_btn').addClass('no');
            ViewModel.applyNow();

        });
    },

    //初始页页面dom元素事件
    loadDomEvent() {
        var self = this;
        // 产品详情锚点
        var productDetail = $('#product-detail');
        var productMarks = productDetail.find('.bookmark .mark');
        var productCons = productDetail.find('.conwrap .con');
        productMarks.each(function(index) {
            $(this).bind('click ', function(e) {
                e.preventDefault();
                self.scrollTo(Math.ceil(productCons.eq(index).offset().top - productMarks.eq(0).offset().height) + 2, 250);
            });
        });

        $(window).bind('scroll', function() {
            var top = document.documentElement.scrollTop || document.body.scrollTop;
            if (top >= productDetail.offset().top) {
                productDetail.addClass('fix-nav');
            } else {
                productDetail.removeClass('fix-nav');
            }

            for (var i = productCons.length - 1; i > 0;  i--) {
                if (/* 页面底部 */ top >= Math.floor(document.documentElement.scrollHeight - document.documentElement.clientHeight) - 1 || top >= Math.floor(productCons.eq(i).offset().top - productMarks.eq(0).offset().height)) {
                    break;
                }
            }
            if (!productMarks.eq(i).hasClass('active')) {
                productMarks.removeClass('active').eq(i).addClass('active');
            }
        });

        // 产品选择
        $('#list').on('click', '.index-list', function() {
            var $this = $(this);
            $('.index-list').removeClass('active');
            $this.addClass('active');
            _packageId = $this.attr('LoanPackageId');
            _carId = $this.attr('Car_Id');
            _ReferPrice = $this.attr("ReferPrice");
            _ProductId = $this.attr("ProductId");
            ViewModel.checkProcut();
        });

        // 产品详情图片懒加载
        window.Echo.init({
            offset: 0,
            throttle: 0
        });
    },
    //开始
    init() {
        var _this = this;
        _this.getProcutList();
        _this.loadDomEvent();
        _this.loadDomView();

    },
    //验证产品是否可用
    checkProcut() {
        if (_packageId == 0 || _carId == 0) {
            return;
        }
        var params = {
            packageId: _packageId,
            carId: _carId,
            cityId: city.CityId
        }

        Store.CheckProduct(CheckPriUrl, params).then((res) => {
            if (res.Data) {
                //成功
                $('#commit_btn').html('立即申请').removeClass('no');
            } else {
                //失败
                $('#commit_btn').html('暂不支持该城市').addClass('no');
                tools.showAlert('暂不支持该城市，可以选择临近城市提车');
            }
        });
    },
    //定位城市
    cityLocation() {
        var _this = this;
        /*定位不到城市*/
        $('#city_btn').click(function (e) {
            e.preventDefault();
            city.loadCityUrl = `${GetSupportGroupCitiesUrl}?packageID=${_packageId}&carid=${_carId}`;
            city.dataType = 'json';
            $('body').data('scrollTop', $(window).scrollTop());
            setTimeout(() => {
                $(window).scrollTop(0);
            }, 300);
            citySelect.citySelect(city, function (result) {
                $(window).scrollTop($('body').data('scrollTop'));
                $('#city_btn').html(result.CityName);
                city.CityId = result.CityId;
                city.CityName = result.CityName;
                city.CitySpell = result.CitySpell;
                city.RegionId = result.RegionId;
                _this.checkProcut();
            });
        });
        $('body').on('click', '.citySelect-close', function() {
            $(window).scrollTop($('body').data('scrollTop'));
        });
    },
    //获取产品list
    getProcutList() {
        var html = '';
        var _this = this;
        Store.GetProductList(GetPriListUrl).then((res) => {
            if (res.Result) {
                for (var i = 0; i < res.Data.length; i++) {
                    var info = res.Data[i];
                    html += '<div class="index-list" Car_Id="' + info.Car_Id + '" ReferPrice="' + info.ReferPrice + '"  ProductId="' + info.ProductId + '" LoanPackageId="' + info.LoanPackageId + '">';
                    html += '<div class="index-car-info">';
                    html += '<div class="car-img">';
                    html += '<img src="' + info.carSerialImageUrl + '">';
                    html += '</div>';
                    html += ' <div class="car-info">';
                    if ($(window).width() <= 640)
                        html += '<div style="height: 1.23667rem;" class="car-name">' + info.cb_Name + info.csName + ' ' + info.Car_YearType + ' ' + info.Car_Name + '</div>';
                    else
                        html += '<div class="car-name">' + info.cb_Name + info.csName + ' ' + info.Car_YearType + ' ' + info.Car_Name + '</div>';

                    html += ' <div class="car-pay">';
                    html += ' <span>厂商指导价：<a>¥' + tools.addCmma(info.ReferPrice * 10000) + '</a></span>';
                    html += '</div>';
                    html += '</div>';
                    html += '<a class="ck_no"></a>';
                    html += '</div>';
                    html += '<div class="index-price">';
                    if ((info.DownPaymentAmount / 10000) > 1) {
                        var n = (info.DownPaymentAmount / 10000)
                        html += '<span class="price-sf">首次支出</span><a>' + Number(n.toString().substring(0, n.toString().indexOf('.') + 3)) + '万</a>';
                    } else {
                        html += '<span class="price-sf">首次支出</span><a>' + (info.DownPaymentAmount) + '元</a>';
                    }
                    if ($(window).width() <= 640) {
                        html += '<span style="margin-left: 0.25rem;" class="price-yz">月租</span><a>' + info.MonthlyRental + '元</a>';
                        html += ' <span style="margin-left: 0.25rem;" class="price-qx">期限</span><a>' + info.RentRepaymentPeriod + '期</a>';
                    } else {
                        html += '<span class="price-yz">月租</span><a>' + info.MonthlyRental + '元</a>';
                        html += ' <span class="price-qx">期限</span><a>' + info.RentRepaymentPeriod + '期</a>';
                    }

                    html += '</div>';
                    html += '</div>';
                }
                var $list = $('#list');
                $list.html(html);

                $('.index-list').eq(0).addClass('active');
                //默认选中后的数据
                _packageId = $('.index-list').eq(0).attr("loanpackageid");
                _carId = $('.index-list').eq(0).attr("car_id");
                _ProductId = $('.index-list').eq(0).attr("productid");
                _ReferPrice = $('.index-list').eq(0).attr("referprice");
                _this.checkProcut();
                //这里要加
                $('#city_btn').css('display', 'block');
                _this.cityLocation();
            } else {
                tools.showAlert(res.Message);
            }

        })
    },
    //立即申请
    applyNow: function () {
        var orderForm = $('#orderInfoForm');
        orderForm.attr('action', orderAction)
        orderForm.find('input[name="Orders"]').val(_packageId + "_" + _ProductId + "_0");
        orderForm.find('input[name="CarId"]').val(_carId);
        orderForm.find('input[name="CityId"]').val(city.CityId);
        orderForm.find('input[name="CarPrice"]').val(_ReferPrice);
        orderForm.find('input[name="AdviserId"]').val('');
        orderForm.find('input[name="Source"]').val(typeof Source !== 'undefined' && Source ? Source : '');
        orderForm.find('input[name="Channel"]').val(typeof Channel !== 'undefined' && Channel ? Channel : '');
        orderForm.find('input[name="From"]').val(tools.getCookie('from') || '');

        //经销商
        if (typeof dealer !== 'undefined' && dealer.dealerId) {
            orderForm.find('input[name="DealerId"]').val(dealer.dealerId);
            orderForm.find('input[name="DealerName"]').val(dealer.dealerName);
            if (dealer.dealerTel) {
                orderForm.find('input[name="DealerTelphone"]').val(dealer.dealerTel);
            }
        }

        orderForm.submit();

    },
    // 页面滚动
    scrollTo: function(scrollTo, time) {
        var scrollFrom = parseInt(document.documentElement.scrollTop || document.body.scrollTop),
            i = 0,
            runEvery = 5; // run every 5ms

        scrollTo = parseInt(scrollTo);
        time /= runEvery;

        var interval = setInterval(function () {
            i++;

            document.documentElement.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;
            document.body.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;

            if (i >= time) {
                clearInterval(interval);
            }
        }, runEvery);
    }
};

//view
$(function () {
    XTK.Action.bind();
    ViewModel.init();

})