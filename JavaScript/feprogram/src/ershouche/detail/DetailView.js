'use strict';

import '../css/ershouche.scss'
import './detail.scss'
import 'jquery.lazyload'
//声明变量
import Swiper from 'libs/swiper/2.0';
import app from '../script/app';
import XTK from '../script/XTK';
import Store from '../script/Store';
import loginStore from '../script/LoginStore';
import carPhotos from 'libs/carPhotos';
import iScroll from 'iScroll';
import YXSlider from 'libs/yxSlider/YXSlider.pc'



var arry = [];
var indexShouFu;
var indexYuegong;
var getFrom = tools.getCookie("from");
Store.ershoucheAPI = ershoucheUrl;
Store.xincheAPI = xincheUrl;
var myChart;

$(document).ready(function() {


    var ViewModel = {
        init: function() {
            var _this = this;
            _this.scrollFun();
            _this.MoreRecommended();
            // _this.swiperFun();
            _this.loanAdviser();
            _this.loadDomVIew();
            _this.downPaymentPeriod();
            _this.otherInit();
            _this.LoadPackageComment();


        },
        otherInit: function() {
            carPhotos.opts({}) //配置相关参数需要时可以配置不需要可以省略
            carPhotos.init(); //启动
            //////
            $('.detail_car_top .tip_bottom').on('click', function() {
                    var _this = $(this);
                    if (_this.hasClass('tip_top')) {
                        _this.removeClass('tip_top');
                        $('.detail_car_top .product-icons').hide();
                    } else {
                        _this.addClass('tip_top');
                        $('.detail_car_top .product-icons').show();
                    }
                })
                //动销
            $('.btn_red,.nav-btn').hover(function() {
                $(this).stop().css({ 'background': '#d14045' });
            }, function() {
                $(this).stop().css({ 'background': '#e9474d' });
            })
            $('.btn_red_line').hover(function() {
                    $(this).stop().css({ 'background-color': '#e9474d', 'color': '#fff' });
                }, function() {
                    $(this).stop().css({ 'background-color': '#fff', 'color': '#e9474d' });
                })
                /*精真估*/
            var $maskLayer = $("#maskLayer"),
                $jzgLayer = $(".jingzhengu-layer"),
                $body = $("body");
            $("#jinzhengu").on('click', function(e) {
                e.preventDefault();
                $maskLayer.show();
                $jzgLayer.addClass('jzglayer-show');
                $body.css({
                    "overflow": "hidden"
                })
            });
            $jzgLayer.find(".close-layer").on('click', function(e) {
                e.preventDefault();
                $maskLayer.hide();
                $jzgLayer.removeClass('jzglayer-show');
                $body.css({
                    "overflow": "visible"
                })
            });
        },
        //立即申请
        applyNow: function() {
            var formDom = $("#orderInfoForm");
            console.log(product.packageID + "_" + product.productID + "_0")
            formDom.find('input[name="Orders"]').val(product.packageID + "_" + product.productID + "_0");
            formDom.find('input[name="CarId"]').val(car.carId);
            formDom.find('input[name="CityId"]').val(city.cityId);
            formDom.find('input[name="CarPrice"]').val(ucarPrice);
            formDom.find('input[name="Source"]').val(source ? source : 0);
            formDom.find('input[name="Line"]').val(line);
            formDom.find('input[name="AdviserId"]').val(adviserId);
            formDom.find('input[name="Channel"]').val(channel);
            formDom.find('input[name="From"]').val(getFrom ? getFrom : "");
            formDom.find('input[name="UcarId"]').val(v_ucarId);
            formDom.submit();

        },
        //ajax
        sendAjax: function(options, _callback, _errorcallback) {
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
                beforeSend: function() {},
                success: function(res) {
                    _callback(res);
                },
                complete: function(XMLHttpRequest, textStatus) {
                    if (status == 'timeout') { //超时,status还有success,error等值的情况
                        _errorcallback(textStatus);
                    }
                }
            })
        },
        //贷款顾问
        loanAdviser() {
            var self = this;
            var _url = adviserApi + "v2/group/getadviserlist?CityId=" + city.cityId + "&CompanyIds=" + companyID + "&BusinessLineId=551";
            self.sendAjax({
                url: _url,
                dataType: 'jsonp',
            }, adviserList, sendAgain);

            //获取成功
            function adviserList(result) {
                if (result.Data != null && result.Data[0] != null) {
                    var ad = result.Data[0].Adviser;
                    var fomatPhone = function(phone) {
                        return phone.slice(0, 4) + '-' + phone.slice(4, 7) + '-' + phone.slice(7, phone.length);
                    }

                    var html = `<div class="adviser-nav">
                    <ul class="clrfix">
                    <li class="adviser-logo"></li>
                    <li class="adviser-groups adviser-group01 ut-c">
                    <span class="adviser-photo"  style="background-image: url(${ad.Photo});"></span>
                    <span class="adviser-name adviser-level skillLevel_${ad.SkillLevelId}">${ad.Name}</span>
                    </li>
                    <li class="adviser-groups ut-c">
                    <div class="f-16 f-blod f-red">${ad.WorkingYears} 年</div>
                    <div class="f-12 f-gray3">从业经验</div>
                    </li>
                    <li class="adviser-groups ut-c">
                    <div class="f-16 f-blod f-red">${ad.ServeNumber}</div>
                    <div class="f-12 f-gray3">贷款服务人数</div>
                    </li>
                    <li class="adviser-groups ut-c">
                    <div class="f-16 f-blod f-red">${ad.Rate} %</div>
                    <div class="f-12 f-gray3">好评率</div>
                    </li>
                    <li class="adviser-groups ad-tell f-16 ut-c">
                    <span class="f-red f-blod">${fomatPhone(ad.CN400)}</span><span class="f-gray6"></span><span class="f-red f-blod"></span>
                    </li>
                    </ul>
                    </div>`;
                    $('.adviser-nav-box').html(html);
                }

            } // 出错后重新加载
            function sendAgain(info) {
                // console.log(info);
                self.sendAjax({
                    url: _url,
                    dataType: 'jsonp'
                }, adviserList, sendAgain);
            };
        },

        //更多推荐  最新成交
        MoreRecommended: function() {
            //json日期格式转换为正常格式
            function jsonDateFormat(jsonDate) {
                try {
                    var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));
                    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var seconds = date.getSeconds();
                    var milliseconds = date.getMilliseconds();
                    return date.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + "." + milliseconds;
                } catch (ex) {
                    return "";
                }
            }
            var _MoreData = {
                    cityId: cityInfo.cityId,
                    UCarId: v_ucarId,
                    productId: product.productID,
                    DisplayPrice: ucarPrice,
                    MainBrandID: 32
                }
                //更多推荐
            Store.getRecommendCarList(_MoreData).then(function(result) {
                var data = result;
                if (result) {
                    var h = "";
                    for (var i = 0; i < data.Data.length; i++) {
                        var csn = "";
                        var carDate = data.Data[i].BuyCarDate,
                            carDateTxt = "";
                        carDate = jsonDateFormat(carDate);
                        carDate = carDate.split('-');
                        if (carDate[0] == '0001') {
                            carDateTxt = '未上牌';
                        } else {
                            carDateTxt = carDate[0] + "年上牌";
                        }
                        //1:原厂质保;2:延长质保;5:原厂质保+免费过户;6:延长质保+免费过户);
                        if (data.Data[i].WarrantyTypes == 1) {
                            csn = '<span class="icon_txt green"><em>原厂<br/>质保</em></span>';
                        } else if (data.Data[i].WarrantyTypes == 2) {
                            csn = '<span class="icon_txt blue"><em>延长<br/>质保</em></span>';
                        } else if (data.Data[i].WarrantyTypes == 5) {
                            csn = '<span class="icon_txt green"><em>原厂<br/>质保</em></span><span class="icon_txt yellow"><em>免费<br/>过户</em></span>';
                        } else if (data.Data[i].WarrantyTypes == 6) {
                            csn = '<span class="icon_txt blue"><em>延长<br/>质保</em></span><span class="icon_txt yellow"><em>免费<br/>过户</em></span>';
                        } else {
                            csn = '';
                        }
                        var is_youzhi = ''
                        if (data.Data[i].OrderNum == '10') {
                            is_youzhi = '<i class="free_transfer"></i>'
                        }
                        var SavePrice = '';
                        if (data.Data[i].SavePrice < 1 && data.Data[i].SavePrice > 0) {
                            SavePrice = '<span>省 ' + Number(data.Data[i].SavePrice * 10000).toFixed(0) + '元</span>';
                        } else if (data.Data[i].SavePrice > 1) {
                            SavePrice = '<span>省 ' + Number(data.Data[i].SavePrice).toFixed(2) + '万</span>';
                        } else if (data.Data[i].SavePrice == 0) {
                            var sheng = Number(data.Data[i].ReferPrice) + Number(data.Data[i].ReferPrice) / 1.17 * 0.1 - Number(data.Data[i].DisplayPrice);
                            if (sheng > 0) {
                                SavePrice = '<span>省 ' + app.show_price_text(sheng) + '</span>';
                            }

                        } else {
                            SavePrice = '';
                        }
                        let imgSrc = '';
                        if (data.Data[i].FirstPicturePath) {
                            imgSrc = data.Data[i].FirstPicturePath.split("|")[0];
                        }
                        h += '<li>' +
                            '<a href="/' + data.Data[i].CarCityId + '/u' + data.Data[i].UcarID + '/?source=' + source + '" target="_blank">' +
                            '<div class="car_img">' +
                            '<div class="all_mark">' + csn + '</div>' +
                            '<div class="car_mask"></div>' +
                            '<img src="' + imgSrc + '">' +
                            ' </div>' +
                            '<div class="txt_info">' +
                            '<div class="name">' + data.Data[i].CarFullName + '</div>' +
                            '<div class="loan">首付 <em>' + app.show_price_text(data.Data[i].DownPaymentAmount) + '</em> 月供 <em>' + app.show_price_text(data.Data[i].MonthlyPayment) + '</em></div>' +
                            '<div class="save">' + SavePrice + '</div>' +
                            '</div>' +
                            '</a>' +
                            '</li>'
                    }
                    $(".recommend_ul").html(h)
                        //动效
                    $('.recommend_car .car_img').on('mouseover', function() {
                        $(this).find('.car_mask').css({ 'display': 'block' });
                    }).on('mouseout', function() {
                        $(this).find('.car_mask').css({ 'display': 'none' });
                    });
                }
            })
            var _data = {
                    cityId: cityInfo.cityId,
                    UCarId: v_ucarId,
                    productId: product.productID,
                    DisplayPrice: ucarPrice,
                    MainBrandID: 32,
                    SoldOrUnSold: 1
                }
                //最新成交
            Store.getRecommendCarList(_data).then(function(result) {
                    var data = result;
                    if (result) {
                        var h = "";
                        for (var i = 0; i < data.Data.length; i++) {
                            var csn = "";
                            var carDate = data.Data[i].BuyCarDate,
                                carDateTxt = "";
                            carDate = jsonDateFormat(carDate);
                            carDate = carDate.split('-');
                            if (carDate[0] == '0001') {
                                carDateTxt = '未上牌';
                            } else {
                                carDateTxt = carDate[0] + "年上牌";
                            }
                            var SavePrice = '';
                            if (data.Data[i].SavePrice < 1 && data.Data[i].SavePrice > 0) {
                                SavePrice = '<span>省 ' + +Number(data.Data[i].SavePrice * 10000).toFixed(0) + '元</span>';
                            } else if (data.Data[i].SavePrice > 1) {
                                SavePrice = '<span>省 ' + Number(data.Data[i].SavePrice).toFixed(2) + '万</span>';
                            } else if (data.Data[i].SavePrice == 0) {
                                var sheng = Number(data.Data[i].ReferPrice) + Number(data.Data[i].ReferPrice) / 1.17 * 0.1 - data.Data[i].DisplayPrice
                                if (sheng > 0) {
                                    SavePrice = '<span>省 ' + app.show_price_text(sheng) + '</span>';
                                }
                            } else {
                                SavePrice = '';
                            }
                            let imgSrc = '';
                            if (data.Data[i].FirstPicturePath) {
                                imgSrc = data.Data[i].FirstPicturePath.split("|")[0];
                            }
                            h += '<li>' +
                                '<a href="/' + data.Data[i].CarCityId + '/u' + data.Data[i].UcarID + '/?source=' + source + '" target="_blank">' +
                                '<div class="car_img">' +
                                '<span class="deal_img"></span>' +
                                '<div class="car_mask"></div>' +
                                '<img src="' + imgSrc + '">' +
                                '</div>' +
                                '<div class="txt_info">' +
                                '<div class="name">' + data.Data[i].CarFullName + '</div>' +
                                '<div class="loan">首付 <em>' + app.show_price_text(data.Data[i].DownPaymentAmount) +
                                '</em> 月供 <em>' + app.show_price_text(data.Data[i].MonthlyPayment) + '</em></div>' +
                                '<div class="save">' + SavePrice + '</div>' +
                                '</div>' +
                                '</a>' +
                                '</li>'
                        }
                        $('.deal_ul').html(h)
                            //动效
                        $('.recommend_car .car_img').on('mouseover', function() {
                            $(this).find('.car_mask').css({ 'display': 'block' });
                        }).on('mouseout', function() {
                            $(this).find('.car_mask').css({ 'display': 'none' });
                        });
                    }
                })
                //tab
            var tabsSwiper = new Swiper('.swiper-container', {
                speed: 500,
                onSlideChangeStart: function() {
                    $(".tabs .active").removeClass('active')
                    $(".tabs a").eq(tabsSwiper.activeIndex).addClass('active')
                }
            })
            $(".tabs a").on('mousemove', function(e) {
                e.preventDefault()
                $(".tabs .active").removeClass('active')
                $(this).addClass('active')
                tabsSwiper.swipeTo($(this).index())
            })
        },

        //滚动
        scrollFun: function() {
            ////

        },
        loadDomVIew: function() {
            var _this = this;
            app.log('charts', document.getElementById('myChart'))
            myChart = echarts.init(document.getElementById('myChart'));

            $('.price-detailed').click(() => {
                $('.total-cost-layer').show();
                $('#maskLayer').show();
                document.documentElement.style.overflow = 'hidden';
            });



            $('#moreJinrong').click(() => {
                $('.window_pop').show();
                _this.getFinancial();
                document.documentElement.style.overflow = 'hidden';
            });

            $('.close').click(() => {
                $('.window_pop').hide();
                document.documentElement.style.overflow = '';

            });
            $('#postRquest').click(() => {
                _this.applyNow();
            });
            $('#postRquest1').click(() => {
                _this.applyNow();
            });

            window.selCityCallback = function(obj) {
                location.href = '/' + obj.citySpell + '/list' + '/?source=' + source;
            };
            $('.common_box_info').find('font').hover(function() {
                $('.common_box_info').find('.type-tip').stop().fadeIn();
            }, function() {
                $('.common_box_info').find('.type-tip').stop().fadeOut();
            });
            // $('.preferential').hover(function(){
            //      $(this).find('.Pack-Amount-tip').stop().fadeIn();
            // },function(){
            //        $(this).find('.Pack-Amount-tip').stop().fadeOut();
            // })
        },

        //评价列表 分页
        getPackageComment: function(pageindex) {
            var params = {
                packageId: product.packageID,
                pageIndex: pageindex,
                pageSize: 10,
                pageCount: 0
            };
            Store.getPackageComment(params).then((res) => {

                $("#pagedCommentDiv").html(res);
            })
        },
        //初始化用户评论
        LoadPackageComment: function() {
            var self = this;
            if (totalComments > 10) {
                $("#listPagination").show();
            } else {
                $("#listPagination").hide()
            }
            var pageCount = Math.ceil(totalComments / 10);
            tools.listPagination("listPagination", pageCount, 1, callBacks);

            function callBacks(pageindex) {
                self.getPackageComment(pageindex);
                $('html,body').stop().animate({
                    "scrollTop": $("#userEvaluate").offset().top
                }, 500);
            }
        },
        //环状图
        doughnutChart: function(datasets) {
            var self = this;
            myChart.setOption({
                series: [{
                    name: '总花费',
                    type: 'pie',
                    radius: ['60%', '100%'],
                    clickable: false,
                    itemStyle: {
                        normal: {
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        },
                        emphasis: {
                            label: {
                                show: false,
                                position: 'center',
                                textStyle: {
                                    fontSize: '20',
                                    fontWeight: 'bold'
                                }
                            }
                        }
                    },
                    data: datasets
                }]
            });
        },
        getYXSlider: function(product, i) {
            var _this = this;
            if ($('#index_shoufu' + product.ID)[0]) {
                arry[i] = [];
                arry[i][0] = new YXSlider('index_shoufu' + product.ID, [
                    { 'text': 20, 'isDisable': false, 'isDefault': true, 'unit': '%' }
                ], (data) => {
                    _this.getDownPaymentPeriodByProductID(data.ProductID, i)
                })

                arry[i][1] = new YXSlider('index_yuegong' + product.ID, [
                    { 'text': 12, 'isDisable': false, 'isDefault': true, 'unit': '期' }
                ], (data) => {
                    _this.getDownPaymentPeriodByProductID(data.ProductID, i)
                });
                _this.loadData(product.ProductId, arry[i][0], arry[i][1], 2);
            }
        },
        getFinancial: function() {
            var _this = this;
            var html = '';
            var params = {
                carid: v_carId,
                carPrice: ucarPrice,
                cityid: cityInfo.cityId
            }
            var pidlist = [];
            Store.getPackageList(params).then((result) => {
                for (let i = 0; i < result.Data.length; i++) {
                    var p = result.Data[i];
                    pidlist.push(p);
                    html += '<li class="itme"  id="li' + i + '"><div id="shortcontent' + i + '"  data-id="' + i + '" class="easy_content"><span class="unfold tip_bot" data-id="' + i + '"><i class="tip_bottom"></i>展开</span>';
                    html += ' <div class="title_info"><img src="' + p.CompanyLogoUrl + '"/><span class="packName">' + p.PackageName + '</span><span class="FeaturesTag"></span></div>';
                    if (p.package) {
                        html += '<div class="common_box">';
                        html += '<div class="type">';
                        html += '   申请信息：<span>';
                        if (p.package.CommonRequirementType == 1) {
                            html += '<font class="level-one">严格</font>';
                        }
                        if (p.package.CommonRequirementType == 2) {
                            html += '<font class="level-two">一般</font>';
                        }
                        if (p.package.CommonRequirementType == 3) {
                            html += '<font class="level-three">宽松</font>';
                        }
                        html += '</span>';

                        html += ' <div class="type-tip" style="display: none;">';
                        html += '  <div class="info">';
                        if (p.package.CommonRequirementList) {
                            var cql = p.package.CommonRequirementList.split(',');
                            for (var x = 0; x < cql.length; x++) {
                                if (cql[x]) {
                                    html += '  <p>' + cql[x] + '</p>';
                                }
                            }
                        } else {
                            if (p.package.Condition) {
                                var cn = p.package.Condition.split(',');
                                for (var x = 0; x < cn.length; x++) {
                                    if (cn[x]) {
                                        html += '  <p>' + cn[x] + '</p>';
                                    }
                                }
                            } else {
                                html += '<p>1、身份证</p>';
                                html += '<p>2、居住证明</p>';
                                html += '<p>3、收入证明</p>';
                                html += '<p>4、婚姻证明</p>';
                            }
                        }
                        html += '  </div>';
                        html += ' </div>';
                        html += ' </div>';

                        if (p.package.PackageFeatureIcon1) {
                            html += '<div class="line_icon">' + p.package.PackageFeatureIcon1 + '</div>';
                        }
                        if (p.package.PackageFeatureIcon2) {
                            html += '<div class="card_icon" data-company-id="89">' + p.package.PackageFeatureIcon2 + '</div>';
                        }
                        html += '</div>';
                    }
                    html += '<div class="info_box"><span class="payment DownPaymentRate">首付' + p.DownPaymentRate * 100 + '%：<font class="col_red">¥' + tools.addCmma(p.DownPaymentText) + '</font></span>';
                    html += '<span class="payment RepaymentPeriod">月供' + p.RepaymentPeriod + '期：<font class="col_red">¥' + tools.addCmma(p.MonthPaymentText) + '</font></span>';
                    html += ' </div>';
                    html += '</div></li>';

                    _this.getHtml(p, i);
                }


                $('#windowList').html(html);

                $('.common_box').find('font').hover(function() {
                    $(this).parents('.common_box').find('.type-tip').stop().fadeIn();
                }, function() {
                    $(this).parents('.common_box').find('.type-tip').stop().fadeOut();
                });

                $('.tip_bot').click(function() {
                    var id = $(this).attr('data-id');
                    $('#shortcontent' + id).addClass('hide');
                    $('#longcontent' + id).removeClass('hide');
                });

                // setTimeout(function () {
                //     for (let i = 0; i < pidlist.length; i++) {
                //         if ($('#index_shoufu' + pidlist[i].ID)[0]) {
                //             arry[i] = [];
                //             arry[i][0] = new YXSlider('index_shoufu' + pidlist[i].ID, [
                //                 { 'text': 20, 'isDisable': false, 'isDefault': true, 'unit': '%' }
                //             ], (data) => {
                //                 _this.getDownPaymentPeriodByProductID(data.ProductID, i)
                //             })

                //             arry[i][1] = new YXSlider('index_yuegong' + pidlist[i].ID, [
                //                 { 'text': 12, 'isDisable': false, 'isDefault': true, 'unit': '期' }
                //             ], (data) => {
                //                 _this.getDownPaymentPeriodByProductID(data.ProductID, i)
                //             });
                //             _this.loadData(pidlist[i].ProductId, arry[i][0], arry[i][1], 2);
                //         }
                //     }
                // }, 2500);

            })


        },
        getHtml: function(p, index) {
            var _this = this;
            var params = {
                carPrice: ucarPrice,
                productId: p.ProductId,
                carId: v_carId
            }
            Store.calculateLoanInfo(params).then((res) => {
                if (res.Result) {
                    var _downPayment = res.Data.downPayment * 10000,
                        _loanAmount = res.Data.loanAmount * 10000,
                        _totalCost = res.Data.totalCost * 10000,
                        _monthlyPayment = res.Data.monthlyPayment * 10000,
                        _finalPaymentAmount = res.Data.finalPaymentAmount * 10000,
                        _interestRate = res.Data.interestRate * 100,
                        _totalInterest = res.Data.totalInterest * 10000,
                        _serviceFee = res.Data.serviceFee * 10000,
                        _purchaseTax = res.Data.purchaseTax * 10000,
                        _finalPaymentRate = res.Data.finalPaymentRate,
                        _totalExpenses = _downPayment + _totalCost + _loanAmount;
                    var html = '';
                    html += '<div id="longcontent' + index + '"  class="details_content hide">';
                    html += ' <div class="title_info"><img src="' + p.CompanyLogoUrl + '"/><span class="packName">' + p.PackageName + '</span></div>';
                    html += '<div class="common_box">';
                    if (p.package) {
                        html += '<div class="type">';
                        html += '   申请信息：<span>';
                        if (p.package.CommonRequirementType == 1) {
                            html += '<font class="level-one">严格</font>';
                        }
                        if (p.package.CommonRequirementType == 2) {
                            html += '<font class="level-two">一般</font>';
                        }
                        if (p.package.CommonRequirementType == 3) {
                            html += '<font class="level-three">宽松</font>';
                        }
                        html += '</span>';
                        html += ' <div class="type-tip" style="display: none;">';
                        html += '  <div class="info">';
                        if (p.package.CommonRequirementList) {
                            var cql = p.package.CommonRequirementList.split(',');
                            for (var x = 0; x < cql.length; x++) {
                                if (cql[x]) {
                                    html += '  <p>' + cql[x] + '</p>';
                                }
                            }
                        } else {
                            if (p.package.Condition) {
                                var cn = p.package.Condition.split(',');
                                for (var x = 0; x < cn.length; x++) {
                                    if (cn[x]) {
                                        html += '  <p>' + cn[x] + '</p>';
                                    }
                                }
                            } else {
                                html += '<p>1、身份证</p>';
                                html += '<p>2、居住证明</p>';
                                html += '<p>3、收入证明</p>';
                                html += '<p>4、婚姻证明</p>';
                            }
                        }
                        html += '  </div>';
                        html += ' </div>';
                        html += ' </div>';

                        if (p.package.PackageFeatureIcon1) {
                            html += '<div class="line_icon">' + p.package.PackageFeatureIcon1 + '</div>';
                        }
                        if (p.package.PackageFeatureIcon2) {
                            html += '<div class="card_icon" data-company-id="89">' + p.package.PackageFeatureIcon2 + '</div>';
                        }
                    }
                    html += '<a id="longcontent_a' + index + '" href="/' + cityInfo.citySpell + '/u' + v_ucarId + '/p' + p.ProductId + '/?source=' + source + '" class="win_btn_org">查看详情</a>';
                    html += '</div>';


                    html += '<section class="down-payment-wrapper" style="margin-top: 25px;margin-left: -111px;">';
                    html += '<div class="sel-items clrfix">';
                    html += ' <h3>首付</h3>';
                    html += '<div class="yx-silder-wrapper" >';
                    html += '<div id="index_shoufu' + p.ID + '"></div>';

                    html += '</div>';
                    html += ' <span id="index_shoufu_text' + index + '" class="sel-prices-list" >￥' + tools.addCmma(_downPayment) + '</span>';
                    html += '  </div>';

                    html += ' <div class="sel-items clrfix">';
                    html += '<h3>月供</h3>';
                    html += ' <div class="yx-silder-wrapper">';
                    html += '<div id="index_yuegong' + p.ID + '"></div>';
                    html += '</div>';
                    html += ' <span id="index_yuegong_text' + index + '" class="sel-prices-list">￥' + tools.addCmma(_monthlyPayment) + '</span>';
                    html += ' </div>';

                    html += '</section>';
                    html += '<div class="product_box_so">';
                    html += ' <dl class="dl_list">';
                    html += '    <dt class="tit_dt">贷款额度<span>(车价-首付)</span></dt>';
                    html += '     <dd class="info_dd">￥<span id="dkedText' + index + '">' + tools.addCmma(_loanAmount) + '</span></dd>';
                    html += ' </dl>';
                    if (_finalPaymentAmount != 0) {
                        html += ' <dl class="dl_list">';
                        html += '     <dt class="tit_dt">贷款尾款<span id="dkwkRateText' + index + '">(车价*' + (_finalPaymentRate * 100).toString() + '%)</span></dt>';
                        html += '     <dd class="info_dd">￥<span id="dkwkText' + index + '">' + tools.addCmma(_finalPaymentAmount) + '</span></dd>';
                        html += '  </dl>';
                    }
                    html += '<dl class="dl_list">';
                    html += '  <dt class="tit_dt">贷款成本<span>(利息+手续费)</span></dt>';
                    html += '  <dd class="info_dd">￥<span id="dkcbText' + index + '">' + tools.addCmma(_totalCost) + '</span></dd>';
                    html += ' </dl>';
                    html += '</div>';
                    html += '  <div class="unfold_box"><span data-id="' + index + '" class="unfold tip_top"><i class="tip_bottom"></i>收起</span></div>';
                    html += ' </div>';
                } else {
                    $('#li' + index).hide();
                }

                $('#li' + index).append(html);
                _this.getYXSlider(p, index);
                // app.log($('#li' + index).html());
                $('.tip_top').click(function() {
                    var id = $(this).attr('data-id');
                    $('#shortcontent' + id).removeClass('hide');
                    $('#longcontent' + id).addClass('hide');
                });
                $('.common_box').find('font').hover(function() {
                    $(this).parents('.common_box').find('.type-tip').stop().fadeIn();
                }, function() {
                    $(this).parents('.common_box').find('.type-tip').stop().fadeOut();
                });
            });
        },
        //获取首付月供
        getDownPaymentPeriodByProductID: function(productID, index) {
            $('#longcontent_a' + index).attr('href', '/' + cityInfo.citySpell + '/u' + v_ucarId + '/p' + productID + '/?source=' + source);
            var _this = this;
            _this.loadData(productID, arry[index][0], arry[index][1], 2, index);
        },
        //获取首付月供
        downPaymentPeriod: function() {
            var _this = this;
            indexShouFu = new YXSlider('index_shoufu', [
                { 'text': 20, 'isDisable': false, 'isDefault': true, 'unit': '%' }
            ], (data) => {
                product.productID = data.ProductID;
                _this.loadData(data.ProductID, indexShouFu, indexYuegong);
            });

            indexYuegong = new YXSlider('index_yuegong', [
                { 'text': 12, 'isDisable': false, 'isDefault': true, 'unit': '期' }
            ], (data) => {
                product.productID = data.ProductID;
                _this.loadData(data.ProductID, indexShouFu, indexYuegong);
            });

            _this.loadData(product.productID, indexShouFu, indexYuegong);
        },
        loadData: function(_productId, indexShouFu, indexYuegong, type, index) {
            var _this = this;
            Store.getSecondCarFinanceInfo(_productId).then((res) => {
                var shoufuList = [];
                var yuegongList = [];
                if (res.Result) {
                    if (type == 2) {
                        _this.loadCalculateLoanInfoOther(_productId, index);
                    } else {
                        _this.loadCalculateLoanInfo(_productId);
                    }

                    //构造首付数据
                    for (var i = 0; i < res.ProductDownpaymentrates.length; i++) {
                        var s = res.ProductDownpaymentrates[i];
                        var isDisable = false;
                        if (s.ProductID == _productId) {
                            isDisable = true;
                        }
                        if (type == 2) {
                            shoufuList.push({ 'text': s.DownPaymentRate * 100, 'isDisable': !s.HasProduct, 'isDefault': isDisable, 'ProductID': s.ProductID });

                        } else {
                            if (SoldOrUnSold == '1') {
                                shoufuList.push({ 'text': s.DownPaymentRate * 100, 'isDisable': !isDisable, 'isDefault': isDisable, 'ProductID': s.ProductID });
                            } else {
                                shoufuList.push({ 'text': s.DownPaymentRate * 100, 'isDisable': !s.HasProduct, 'isDefault': isDisable, 'ProductID': s.ProductID });
                            }

                        }

                    }

                    //构造月供数据
                    for (var i = 0; i < res.ProductRepaymentperiods.length; i++) {
                        var s = res.ProductRepaymentperiods[i];
                        var isDisable = false;
                        if (s.ProductID == _productId) {
                            isDisable = true;
                        }
                        if (type == 2) {

                            yuegongList.push({ 'text': s.RepaymentPeriod, 'isDisable': !s.HasProduct, 'isDefault': isDisable, 'ProductID': s.ProductID });
                        } else {
                            if (SoldOrUnSold == '1') {
                                yuegongList.push({ 'text': s.RepaymentPeriod, 'isDisable': !isDisable, 'isDefault': isDisable, 'ProductID': s.ProductID });
                            } else {
                                yuegongList.push({ 'text': s.RepaymentPeriod, 'isDisable': !s.HasProduct, 'isDefault': isDisable, 'ProductID': s.ProductID });
                            }

                        }

                    }
                    //重新绘制滚动轴
                    //new 完后至每次调用接口返回的数据在 update中更新
                    indexShouFu.update(shoufuList);
                    //new 完后至每次调用接口返回的数据在 update中更新
                    indexYuegong.update(yuegongList);
                }
            })
        },
        loadCalculateLoanInfo: function(productID) {
            var _this = this;
            var params = {
                carPrice: ucarPrice,
                productId: productID,
                carId: v_carId
            }
            var loadCalculateLoanInfoModel = {};
            Store.calculateLoanInfo(params).then((res) => {
                if (res.Result) {
                    var _downPayment = res.Data.downPayment * 10000,
                        _loanAmount = res.Data.loanAmount * 10000,
                        _totalCost = res.Data.totalCost * 10000,
                        _monthlyPayment = res.Data.monthlyPayment * 10000,
                        _finalPaymentAmount = res.Data.finalPaymentAmount * 10000,
                        _interestRate = res.Data.interestRate * 100,
                        _totalInterest = res.Data.totalInterest * 10000,
                        _serviceFee = res.Data.serviceFee * 10000,
                        _purchaseTax = res.Data.purchaseTax * 10000,
                        _finalPaymentRate = res.Data.finalPaymentRate,
                        _totalExpenses = _downPayment + _totalCost + _loanAmount;

                    //车价
                    loadCalculateLoanInfoModel.carPrices = ucarPrice;
                    //首付金额
                    loadCalculateLoanInfoModel.downPayment = tools.addCmma(_downPayment);
                    //首付比例
                    loadCalculateLoanInfoModel.downPaymentRate = (res.Data.downPaymentRate * 100).toString() + '%';
                    //贷款金额
                    loadCalculateLoanInfoModel.loanAmount = tools.addCmma(_loanAmount);

                    //首付金额万为单位
                    loadCalculateLoanInfoModel.downPayment2 = res.Data.downPayment;
                    //贷款金额万为单位
                    loadCalculateLoanInfoModel.loanAmount2 = res.Data.loanAmount;

                    //贷款成本
                    loadCalculateLoanInfoModel.totalCost = tools.addCmma(_totalCost);
                    //月供
                    loadCalculateLoanInfoModel.monthlyPayment = tools.addCmma(_monthlyPayment);
                    //贷款尾款
                    loadCalculateLoanInfoModel.finalPaymentAmount = tools.addCmma(_finalPaymentAmount);
                    loadCalculateLoanInfoModel.finalPaymentAmountNum = _finalPaymentAmount;
                    //尾款比例
                    loadCalculateLoanInfoModel.finalPaymentRate = (res.Data.finalPaymentRate * 100).toString() + '%';
                    //月费率/月利率文本
                    loadCalculateLoanInfoModel.rateText = res.Data.rateText;
                    //月费率/月利率金额
                    loadCalculateLoanInfoModel.interestRate = _interestRate.toFixed(2) + "%";
                    //利息
                    loadCalculateLoanInfoModel.totalInterest = tools.addCmma(_totalInterest);
                    //手续费
                    loadCalculateLoanInfoModel.serviceFee = tools.addCmma(_serviceFee);
                    //总花费
                    loadCalculateLoanInfoModel.totalExpenses = tools.addCmma(_totalExpenses);

                    //环形图初始数据
                    loadCalculateLoanInfoModel.datasetsData = [{
                                value: _downPayment,
                                itemStyle: {
                                    normal: { color: '#000000' },
                                    emphasis: { color: '#000000' }
                                },
                                name: '首付'
                            },
                            {
                                value: _loanAmount,
                                itemStyle: {
                                    normal: { color: '#dbb76c' },
                                    emphasis: { color: '#dbb76c' }
                                },
                                name: '贷款额度'
                            },
                            {
                                value: _totalCost,
                                itemStyle: {
                                    normal: { color: '#5f5f5e' },
                                    emphasis: { color: '#5f5f5e' }
                                },
                                name: '贷款成本'
                            }
                        ]
                        //刷新环形图
                    _this.doughnutChart(loadCalculateLoanInfoModel.datasetsData);
                    _this.loadViewDom(loadCalculateLoanInfoModel);
                }


            })
        },
        loadCalculateLoanInfoOther: function(productID, index) {
            var _this = this;
            var params = {
                carPrice: ucarPrice,
                productId: productID,
                carId: v_carId
            }
            var loadCalculateLoanInfoModel = {};
            Store.calculateLoanInfo(params).then((res) => {
                if (res.Result) {
                    var _downPayment = res.Data.downPayment * 10000,
                        _loanAmount = res.Data.loanAmount * 10000,
                        _monthlyPayment = res.Data.monthlyPayment * 10000,
                        _finalPaymentRate = res.Data.finalPaymentRate,
                        _totalCost = res.Data.totalCost * 10000,
                        _finalPaymentAmount = res.Data.finalPaymentAmount * 10000

                    //首付金额
                    loadCalculateLoanInfoModel.downPayment = tools.addCmma(_downPayment);
                    //首付比例
                    loadCalculateLoanInfoModel.downPaymentRate = (res.Data.downPaymentRate * 100).toString() + '%';
                    //首付金额万为单位
                    loadCalculateLoanInfoModel.downPayment2 = res.Data.downPayment;
                    //月供
                    loadCalculateLoanInfoModel.monthlyPayment = tools.addCmma(_monthlyPayment);

                    $('#index_shoufu_text' + index).html('¥' + loadCalculateLoanInfoModel.downPayment);
                    $('#index_yuegong_text' + index).html('¥' + loadCalculateLoanInfoModel.monthlyPayment);

                    $('#dkedText' + index).html(tools.addCmma(_loanAmount));
                    $('#dkwkRateText' + index).html('(车价*' + (_finalPaymentRate * 100).toString() + '%)');
                    $('#dkwkText' + index).html(tools.addCmma(_finalPaymentAmount));
                    $('#dkcbText' + index).html(tools.addCmma(_totalCost));

                }


            })
        },
        loadViewDom: function(data) {
            if (data.finalPaymentAmount == 0) {
                $('#weikuan').hide();
            } else {
                $('#weikuan').show();
                $('#weikuanChart').html('¥' + data.finalPaymentAmount);
            }

            $('#downPaymentChart').html('¥' + data.downPayment);
            $('#loanAmountChart').html('¥' + data.loanAmount);
            $('#borrowingCostsChart').html('¥' + data.totalCost);


            $('#total_price').html(data.totalExpenses);
            $('#index_shoufu_text').html('¥' + data.downPayment);
            $('#index_yuegong_text').html('¥' + data.monthlyPayment);
            $('#tip_sf').html('¥' + data.downPayment);
            $('#tip_yg').html('¥' + data.monthlyPayment);

            var html = `
         <header>总花费：<span data-bind="text:'￥'+ totalExpenses()">¥${data.totalExpenses}</span>
            <div class="close-layer"></div>
         </header> 
         <footer>
            <dl class="clrfix first-child">
                <dt class="clrfix" data-bind="visible:!isSecurityDeposit()">
                <ul>
                    <li class="box-01 font-20-black">首付</li>
                    <li class="box-02 font-18-gray">车价</li>
                    <li class="box-03 font-18-gray">×</li>
                    <li class="box-04 font-18-gray">首付比例</li>
                </ul>
                <ul>
                    <li class="box-01 font-20-red" >¥${data.downPayment}</li>
                    <li class="box-02 font-18-black">${tools.addCmma(data.carPrices * 10000)}</li>
                    <li class="box-03">&nbsp;</li>
                    <li class="box-04 font-18-black" data-bind="text:downPaymentRate">${data.downPaymentRate}</li>
                </ul>
                </dt>
            </dl>
            <dl class="clrfix first-child">
                <dt class="clrfix">
                <ul>
                    <li class="box-01 font-20-black">贷款额度</li>
                    <li class="box-02 font-18-gray">车价</li>
                    <li class="box-03 font-18-gray">-</li>
                    <li class="box-04 font-18-gray">首付</li>
                </ul>
                <ul>
                    <li class="box-01 font-20-red" >￥${data.loanAmount}</li>
                    <li class="box-02 font-18-black" >${tools.addCmma(data.carPrices * 10000)}</li>
                    <li class="box-03">&nbsp;</li>
                    <li class="box-04 font-18-black" >${data.downPayment}</li>
                </ul>
                </dt>
                <dd id="mingxiweikuan"  class="left-20-ul clrfix" style="display: none;">
                    <ul>
                        <li class="box-01">贷款尾款</li>
                        <li class="box-02">车价</li>
                        <li class="box-03">×</li>
                        <li class="box-04">尾款比例</li>
                    </ul>
                    <ul>
                        <li class="box-01" >￥${data.finalPaymentAmount}</li>
                        <li class="box-02">${tools.addCmma(data.carPrices * 10000)}</li>
                        <li class="box-03">&nbsp;</li>
                        <li class="box-04" >${data.finalPaymentRate}</li>
                    </ul>
                </dd>
            </dl>
            <dl class="clrfix first-child">
                <dt class="clrfix">
                <ul>
                    <li class="box-01 font-20-black">月供</li>
                    <li class="box-02 font-18-gray">月费率</li>
                    <li class="box-03">&nbsp;</li>
                    <li class="box-04">&nbsp;</li>
                </ul>
                <ul>
                    <li class="box-01 font-20-red" >¥${data.monthlyPayment}</li>
                    <li class="box-02 font-18-black">${data.interestRate}</li>
                    <li class="box-03">&nbsp;</li>
                    <li class="box-04">&nbsp;</li>
                </ul>
                </dt>
                <dd class="clrfix">
                    <ul>
                        <li class="box-01 font-18-gray">贷款成本</li>
                        <li class="box-02 font-18-gray">利息</li>
                        <li class="box-03 font-18-gray" data-bind="visible:serviceFee()>0" style="display: none;">+</li>
                        <li class="box-04 font-18-gray" data-bind="visible:serviceFee()>0" style="display: none;">手续费</li>
                    </ul>
                    <ul>
                        <li class="box-01 font-18-gray" >¥${data.totalCost}</li>
                        <li class="box-02 font-18-gray" >${data.totalInterest}</li>
                        <li class="box-03" data-bind="visible:serviceFee()>0" style="display: none;">&nbsp;</li>
                        <li class="box-04 font-18-gray" data-bind="text:serviceFee,visible:serviceFee()>0" style="display: none;">0</li>
                    </ul>
                </dd>
            </dl>
        </footer>
        `;
            $('.total-cost-layer').html(html);

            if (data.finalPaymentAmount == 0) {
                $('#mingxiweikuan').hide();
            } else {
                $('#mingxiweikuan').show();
            }
            $('.close-layer').click(() => {
                $('.total-cost-layer').hide();
                $('#maskLayer').hide();
                document.documentElement.style.overflow = '';
            });
        },

    }
    ViewModel.init();
    //图片惰性加载
    $("img.lazy").lazyload({
        effect: "fadeIn", //淡入效果
        placeholder: RESURL + "/images/libs/transparent.gif",
        threshold: 200 //设置 threshold 为 200 令图片在距离屏幕 200 像素时提前加载.
    });
})
window.onload = function() {
    var navLoanHei = 0,
        navfileHei = $(".car-record").offset().top - 170,
        navuserEvaluate = $(".userEvaluate").offset().top - 170,
        navadviser = $('.adviser').offset().top - 140
    if ($('#app').find('.loan_img').length != 0) {
        navLoanHei = $(".loan_img").offset().top - 170
    } else {
        navLoanHei = $(".loan-content").offset().top - 170
    }
    ///tab
    $('.nav-content').on('click', 'li', function() {
            var _this = $(this);
            var heighttop = 0;
            $('.nav-content li').removeClass('cur');
            _this.addClass('cur');
            if (_this.hasClass('nav-loan')) {
                heighttop = navLoanHei;
            } else if (_this.hasClass('nav-file')) {
                heighttop = navfileHei;
            } else if (_this.hasClass('nav-userEvaluate')) {
                heighttop = navuserEvaluate;
            } else if (_this.hasClass('nav-adviser')) {
                heighttop = navadviser;
            } else {
                heighttop = 0;
            }
            $('body,html').animate({ scrollTop: heighttop }, 500);

        })
        ///////////
    var nft = $(".nav-fixed").offset().top - 92;
    var carheight = $('.car-record-word').offset().top - 200;
    $(window).scroll(function() {
        var scrollHei = $(window).scrollTop() + 1;
        if ($(window).scrollTop() >= nft) {
            $(".nav-fixed").addClass("nav-fixed2");
        } else {
            $(".nav-fixed").removeClass("nav-fixed2");
        }
        if ($(window).scrollTop() >= carheight) {
            if ($('.car_img').hasClass('.car_img_antimation') && $('.car_chapter').hasClass('.car_chapter_antimation')) {} else {
                $('.car-record .car_img').addClass("car_img_antimation").css({ 'opacity': '1' });
                $('.car-record .car_chapter').addClass("car_chapter_antimation").css({ 'opacity': '1' });
            }

        }
        ////857 < 856  857 < 3733-1
        if (scrollHei > 0 && scrollHei < navfileHei - 1) {
            //console.log(11+': nav-file')
            $('.nav-content li').removeClass('cur');
            //console.log(12+': nav-file')
            $('.nav-loan').addClass('cur');
            //console.log(13+': nav-file')
            //console.log'贷款须知', navLoanHei)
        } else if (scrollHei >= navfileHei && scrollHei < navuserEvaluate) {
            //6862 > 3735  &&  6862 < 6862
            //6863 >= 3727 && 6862 < 7223
            //6862 858 3735 6862 7222 1
            //console.log(21+': nav-file')
            $('.nav-content li').removeClass('cur');
            //console.log(22+': nav-file')
            $('.nav-file').addClass('cur');
            //console.log(23+': nav-file')
            //console.log'车辆档案', navfileHei)
            //6863 >= 6863.14990234375 && 6863 < 7223
        } else if (scrollHei >= navuserEvaluate && scrollHei < navadviser) {
            //console.log(33+': nav-file')
            $('.nav-content li').removeClass('cur');
            //console.log(34+': nav-file')
            $('.nav-userEvaluate').addClass('cur');
            //console.log(35+': nav-file')
            //console.log'用户评价', navuserEvaluate)
        } else if (scrollHei >= navadviser) { //adviser
            ////console.log(44+': nav-file')
            $('.nav-content li').removeClass('cur');
            ////console.log(45+': nav-file')
            $('.nav-adviser').addClass('cur')
                //console.log(46+': nav-file')
                //console.log'易问答', navadviser)
        }
        //857 856.86669921875 3733.86669921875 6872.86669921875 7232.86669921875 1
        //           859 858 3735 6874 7234 1
        //           6863 856.1500244140625 3727.14990234375 6863.14990234375 7223.14990234375 1
        //console.log(scrollHei, navLoanHei, navfileHei, navuserEvaluate, navadviser, $('#app').find('.loan_img').length)

    })
}