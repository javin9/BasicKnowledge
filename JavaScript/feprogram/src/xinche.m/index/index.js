require('./index.scss');
var Vue = require('vue')
var VueResource = require('vue-resource')
var Navbar = require('libs/vue-components/navbar')
var TopPromotion = require('libs/vue-components/top-promotion/index')
var AdviserPanel = require('libs/vue-components/adviser-panel')
var swiper = require('libs/swiper');
// require('libs/cityLocation');
var city = require('libs/citySelect');

import CarSelector from 'libs/vue-components/car-selector'

Vue.use(VueResource)

$(function () {
    $(document).on('click', 'a', function () {
        const href = $(this).attr('href')
        if (!/^tel:/.test(href) && href.indexOf('javascript') < 0) {
            location.href = $(this).attr('href');
        }
    })

    new Vue({
        el: 'body',
        methods: {
            selectCarCallback(data, extra){
                if(data.series){
                    const href = `/${localCity.CitySpell}/${data.series.spell}/?source=${extra.source}`
                    dev ? console.log(href) : document.location.href = href
                }else if(data.brand){
                    const href = `/${localCity.CitySpell}/budget?source=${extra.source}${data.brand.id ? ('&b=' + data.brand.id) : ''}`
                    dev ? console.log(href) : document.location.href = href
                }
            }
        },
        compiled() {
            if(!dev){
                this.$broadcast('showTopPromotion')
            }
        },
        ready(){
            $('#searchcar').on('click', () => this.$broadcast('showCarSelector', {source:959}))
            $('#more, #hcjnh_moreCar').on('click', () => this.$broadcast('showCarSelector', {source:714}))
            $('#b2cBlock').on('click', '.selCarEvent', e => {
                const $target = $(e.target).closest('.selCarEvent')
                const brand = {
                    id: $target.data('bsid'),
                    name: $target.data('bsname'),
                    logo: $target.data('imgsrc')
                }
                this.$broadcast('showCarSelector', {
                    source:940,
                    brand
                })
            })
            if(dev){
                // $('#searchcar').trigger('click')
            }
        },
        components: {
            TopPromotion,
            Navbar,
            AdviserPanel,
            CarSelector
        }
    })

    tools.appDown()//app下载

    $('.aviser-icon').click(function () {
        var h = $(this).attr('data-tel');
        location.href = h;
        event.stopPropagation();
        return false;
    });

    /*定位不到城市*/
    document.addEventListener("selectCity", function (e) {
        e.preventDefault();
        city.citySelect(ipLocationInfo, function (result) {
            $('#localText').text(result.CityName);
            // var cookieIsLayer = "isLayer=false;path=/;domain=" + tools.wildcardUrl();
            // document.cookie = cookieIsLayer;
            setTimeout(function () {
                window.location.href = '/' + result.CitySpell + '/'
            }, 100);
        });
    })


    //申请人数
    var $applyNowPepoleNum = $('#applyNowPepoleNum'),
        $TotalLoans = $('.TotalLoans');
    $.ajaxJSONP({
        url: APIURL + "api/Other/GetNewCarLoanStatisticsInfo?callback=?",
        success: function (data) {
            //console.log(data)
            //$applyNowPepoleNum.text(data.Data.ApplyingNum + "人");

            //申请贷款总额
            let totalLoanNum = +data.Data.TotalLoans.replace(/,/g, ''),
                totalLoan = 0;
            if (totalLoanNum < 10000) {
                totalLoan = totalLoanNum;
            } else if (totalLoanNum >= 100000000) {
                totalLoan = (totalLoanNum / 100000000).toFixed(2);
            } else {
                totalLoan = (totalLoanNum / 10000).toFixed(2);
            }
            $TotalLoans.text(totalLoan);
            // 平台介绍
            var $introSwiper = $('#introSlide');
            var intro_swiper = new Swiper('#introSwiper .swiper-container', {
                autoplay: 3000,
                direction: 'vertical',
                slidesPerView: 1,
                loop: true,
                spaceBetween: 10,
                autoHeight: true,
                simulateTouch: false,
                noSwiping: true,
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents: true,//修改swiper的父元素时，自动初始化swiper
            });
        },
        complete: function () {

        }
    });
    //申请信息
    var $applyHistoryInfo = $('#applyHistoryInfo');
    $.ajaxJSONP({
        url: APIURL + "api/LoanOrder/GetNewestLoanOrderApprovalInfo?top=7&callback=?",
        success: function (data) {
            //'<div class="swiper-slide text-overflow-ellipsis">张女士 平台自营 额度6.5万 奥迪A4L奥迪A4L</div>';
            //console.log(data)
            for (var i = 0; i < data.Data.length; i++) {
                var strInfo = data.Data[i].UserCallName + "　" + data.Data[i].LoanCompanyName + "　" + "额度" + quotaFormat(data.Data[i].ApproveQuota);
                var node = '<div class="swiper-slide"><div class="width-percent-100 height-percent-100 text-overflow-ellipsis" style="line-height: 0.4rem;">' + strInfo + '</div></div>';
                $applyHistoryInfo.append(node);
            }
            var applyNow_swiper = new Swiper('.second-block-line-3-applyHistory .swiper-container', {
                autoplay: 3000,
                direction: 'vertical',
                slidesPerView: 1,
                loop: true,
                spaceBetween: 10,
                simulateTouch: false,
                noSwiping: true,
                observer: true,//修改swiper自己或子元素时，自动初始化swiper
                observeParents: true,//修改swiper的父元素时，自动初始化swiper
                onSlideChangeEnd: function (swiper) {
                    swiper.update();
                },
            });
        },
        complete: function () {

        }
    });

    //重新加载当前页面
    $('#logo').on('tap', function (e) {
        location.reload();
    })

    var $fifteenBlock = $(".fifteen-block");
    tools.$ajax({
        url: '/api/home/GetTopicList/',
        type: 'Get',
        dataType: 'json',
        success: function (res) {

            if (res.Result && res.RowCount > 0) {
                $fifteenBlock.css({
                    'display': 'block'
                })
                var _html = "", isRender;
                $.each(res.Data, function (index, val) {
                   var _date =  new Date(parseInt(val.CreatedOn.replace("/Date(", "").replace(")/", ""), 10)),
                       _allDate = `${_date.getFullYear()}-${_date.getMonth() +1}-${_date.getDate()}`;
                    _html += `<li class="swiper-slide order-share-list">
                        <dl data-url="${val.Url}">
                            <dt>
                                <img src="${val.UserAvatar}" /><span class="font-size-24"><b class="font-size-32">${val.UserName}</b>${_allDate}</span>
                                <div class="font-size-24"><i></i><span>${val.BrowserCount}</span><i></i><span>${val.AgreeCount}</span></div>
                            </dt>
                            <dd>
                                <div class="font-title">${val.Title}</div>
                                <ul class="layout-flex">
                                        <li class="layout-flex-1" style="background-image:url(${val.ListImage[0].ImageUrl})"></li>
                                        <li class="layout-flex-1" style="background-image:url(${val.ListImage[1].ImageUrl})"></li>
                                        <li class="layout-flex-1" style="background-image:url(${val.ListImage[2].ImageUrl})"></li>
                                </ul>
                            </dd>
                        </dl>
                    </li>`;
                });

                $(window).on('scroll', function (event) {
                    event.preventDefault();
                    if ($(window).height() + $(window).scrollTop() >= $fifteenBlock.offset().top && !isRender) {
                        isRender = true;
                        $fifteenBlock.find('.swiper-wrapper').html(_html);
                        /*车主晒单*/
                        $(".fifteen-block").off('click').on('click', '.swiper-slide dl', function (e) {
                            e.preventDefault();
                            location.href = $(this).attr("data-url");
                        });
                        //车主晒单
                        var fifteen_mySwiper = new Swiper('.fifteen-block .swiper-container', {
                            autoplay: 3000,
                            loop: true,
                            slidesPerView: 1,
                            pagination: '.fifteen-block .swiper-pagination',
                            autoplayDisableOnInteraction: false,
                            observer: true,//修改swiper自己或子元素时，自动初始化swiper  
                            observeParents: true,//修改swiper的父元素时，自动初始化swiper  
                            onSlideChangeEnd: function (swiper) {
                                swiper.update();
                                Echo.render()
                            },
                            onInit: function (swiper) {
                                //console.log("abc:" + swiper.slides.length)
                                if (swiper.slides.length - 2 < 2) {
                                    swiper.stopAutoplay();
                                    $('.fifteen-block .swiper-pagination').hide();
                                }
                            }
                        });
                    }
                });

            } else {
                $fifteenBlock.css({
                    'display': 'none'
                })
            }
        }
    })

    // 手机号通道
    tools.telChannel({
        'CityId': localCity.CityId,
        'CityText': localCity.CityName,
        'id': 'userTel',//初始化DOM结构id
        'telId': 'indexTel',//手机号输入框id
        'statisticalMarker': 'm-xinche-index-btn-tel-channel'
    });



    //选城市
    $('#selectCity').on('click', function (e) {
        e.preventDefault();
        var self = this;
        city.citySelect(ipLocationInfo, function (result) {
            $('#localText').text(result.CityName);
            try {

                localStorage.cityName = result.CityName;
                localStorage.citySpellName = result.CitySpell;
                var saveDate = new Date();
                localStorage.cityChangeTime = saveDate.getTime().toString();
            }
            catch (err) {
                //在此处理错误
            }
            setTimeout(function () {
                document.location.href = '/' + result.CitySpell+'/';
            }, 100);
        });
    });

    //头部Banner图
    var first_mySwiper = new Swiper('.first-block .swiper-container', {
        autoplay: 3000,
        loop: true,
        pagination: '.swiper-pagination',
        autoplayDisableOnInteraction: false,
        lazyLoading: true,
        observer: true,
        observeParents: true,
        onSlideChangeEnd: function (swiper) {
            swiper.update();
        },
        //setWrapperSize:true,
        onInit: function (swiper) {
            // console.log(swiper.slides.length)
            if (swiper.slides.length - 2 < 2) {
                swiper.stopAutoplay();
                $('.first-block .swiper-pagination').hide();
            } else {
                $('.first-block .swiper-pagination').show();
            }
        }
    });

    //我们的优势
    var third_mySwiper = new Swiper('.third-block .swiper-container', {
        autoplay: 3000,
        loop: true,
        pagination: '.third-block .swiper-pagination',
        autoplayDisableOnInteraction: false,
        observer: true,
        observeParents: true,
        onSlideChangeEnd: function (swiper) {
            swiper.update();
        },
        onInit: function (swiper) {
            //console.log(swiper.slides.length)
            if (swiper.slides.length - 2 < 2) {
                swiper.stopAutoplay();
                $('.third-block .swiper-pagination').hide();
            } else {
                $('.third-block .swiper-pagination').show();
            }
        }
    });

    //限时抢购
    var five_mySwiper = new Swiper('.five-block .swiper-container', {
        slidesPerView: 'auto',
        observer: true,
        observeParents: true,
        onInit: function (swiper) {
            //console.log(swiper.snapIndex)
            if (swiper.snapIndex == 1) {
                $('.five-block .swiper-pagination').hide();
            }
        }
    });

    //贷款无压力，爱车轻松开
    var seven_mySwiper = new Swiper('.seven-block .swiper-container', {
        autoplay: 3000,
        pagination: '.seven-block .swiper-pagination',
        observer: true,
        observeParents: true,
        autoplayDisableOnInteraction: false,
        onInit: function (swiper) {
            //console.log(swiper.slides.length)
            if (swiper.slides.length - 2 < 2) {
                swiper.stopAutoplay();
                $('.seven-block .swiper-pagination').hide();
            }
        }
    });

    //官方旗舰店 品牌直营
    var ten_mySwiper = new Swiper('.ten-block .swiper-container', {
        slidesPerView: "auto",
        observer: true,
        observeParents: true,
        onInit: function (swiper) {
            //console.log(swiper.snapIndex)
            if (swiper.snapIndex == 0) {
                $('.ten-block .swiper-pagination').hide();
            }
        }
    });

    //身份测量 信用直通
    var twelve_mySwiper = new Swiper('.twelve-block .swiper-container', {
        slidesPerView: "auto",
        spaceBetween: 2,
        observer: true,
        observeParents: true,
        onInit: function (swiper) {
            //console.log(swiper.snapIndex)
            if (swiper.snapIndex == 1) {
                $('.twelve-block .swiper-pagination').hide();
            }
        }
    });

    //用户反馈
    var fourteen_mySwiper = new Swiper('.fourteen-block .swiper-container', {
        //autoplay: 3000,
        loop: true,
        slidesPerView: 1,
        pagination: '.fourteen-block .swiper-pagination',
        autoplayDisableOnInteraction: false,
        observer: true,
        observeParents: true,
        onSlideChangeEnd: function (swiper) {
            swiper.update();
        },
        onInit: function (swiper) {
            //console.log("abc:" + swiper.slides.length)
            if (swiper.slides.length - 2 < 2) {
                swiper.stopAutoplay();
                $('.fourteen-block .swiper-pagination').hide();
            }
        }
    });


    //易问答 点赞
    $(".easyAsk-block").on('tap', '.pariseEvent', function () {
        var $that = $(this);
        if (!$that.hasClass("cur")) {
            var $num = $that.find(".easyAsk-num"),
                count = parseInt($num.text()) + 1,
                qId = $that.parents("dd").data("id");
            tools.$ajax({
                url: '/ExpertQuestion/ClickAgree?questionId=' + qId + '&agreeUserId=' + loanUserId + '&deviceId=' + deviceId,
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (res.Result) {
                        $that.addClass("cur");
                        $num.text(count);
                    } else {
                        return tools.showAlert(res.Message);
                    }
                }
            })
        }
    });



    //判断转屏
    function screenChange() {
        self.location.reload();
    }
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", screenChange, false);

    $(window).scroll(function () {
        var scrollHei = $(window).scrollTop()
        var header = $('header.header')
        var headerTop = header.offset().top
        if (scrollHei > headerTop) {
            header.addClass('header-fixed')
        } else {
            header.removeClass('header-fixed')
        }

    })
    //底部新加 Banner图
    var swiperBottomBanner = new Swiper('.swiper_bottom_banner .swiper-container', {
        autoplay: 3000,
        loop: true,
        pagination: '.swiper_bottom_banner .swiper-pagination',
        autoplayDisableOnInteraction: false,
        observer: true,
        observeParents: true,
        onSlideChangeEnd: function (swiper) {
            swiper.update();
        },
        //setWrapperSize:true,
        onInit: function (swiper) {
            //console.log(swiper.slides.length)
            if (swiper.slides.length - 2 < 2) {
                swiper.stopAutoplay();
                $('.swiper_bottom_banner .swiper-pagination').hide();
            } else {
                $('.swiper_bottom_banner .swiper-pagination').show();
            }
        }
    });

});

function quotaFormat(value) {
    return (value / 10000).toFixed(2) + "万";
}

$(function () {
    Echo.init({
        offset: 100,
        throttle: 0
    });
});
