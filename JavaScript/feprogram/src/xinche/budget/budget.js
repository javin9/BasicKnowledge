require('./budget.scss');
// import Swiper from 'libs/swiper/2.0';
import check from 'libs/check';
$(function() {

    //是否是从新车首页品牌区域进入的按预算列表页 
    let isXincheScroll = tools.getUrlParam('scroll');
    if(isXincheScroll){
        let _scrollTop = $('.budget-filter').offset().top + $('.budget-filter').height() - $('.condition-wrap').height();
        $('body,html').animate({
            'scrollTop': _scrollTop+'px'
        }, 300);
    }
    // 车列表
    // initSwiper();
    $('.carlist').on('mouseover', '.car-card', function(e) {
        let elem = $(e.target);
        if(!elem.hasClass('carNameUrl'))
            $(this).addClass('hover');
        else 
            $(this).removeClass('hover');
        //$(this).find('.swiper-button-prev, .swiper-button-next').show();
    });
    $('.carlist').on('mouseout', '.car-card', function() {
        $(this).removeClass('hover');
        //$(this).find('.swiper-button-prev, .swiper-button-next').hide();
    });
    $('.carlist').on('click', '.car-card', function(e) {
        var elem = $(e.target);
        if(!elem.hasClass('carNameUrl')){
            var href = $(this).find('a.carImgUrl').attr('href');
            // location.href = href;
            window.open(href, '');
        }else {
            var href = $(this).find('a.carNameUrl').attr('href');
            // location.href = href;
            window.open(href, '');
        }
        //if (!elem.hasClass('swiper-button-prev') && !elem.hasClass('swiper-button-next')) {
        //}
    });

    // 筛选条件
    $('.filter-tags').on('mouseenter', '.tag', function() {
        $(this).addClass('hover');
    });
    $('.filter-tags').on('mouseleave', '.tag', function() {
        $(this).removeClass('hover');
    });

    // 更多品牌
    $('#more-brand-btn').bind('mouseenter', function() {
        $(this).addClass('hover');
        $('#moreBrand').fadeIn('fast');
        $('#moreBrand .triangle-icon').css('left', ($(this).offset().left - $('#moreBrand').offset().left) + 33);
    });
    $('#more-brand-btn').bind('mouseleave', function() {
        $(this).removeClass('hover');
        $('#moreBrand').fadeOut('fast');
    });

    // 自定义条件
    $('.condition-wrap .custom').bind('mouseenter', function() {
        $(this).addClass('hover');
    });
    $('.condition-wrap .custom').bind('mouseleave', function() {
        $(this).removeClass('hover');
    });

    // 分页
    if ($('#listPagination').length) {
        var pageCount = Math.ceil(total / pagesize);
        var pageIndex = 1;
        var carlist = $('.carlist');
        var loading;    // todo loading
        tools.listPagination('listPagination', pageCount, pageIndex, function (pageindex) {
            carlist.empty();
            $('#list-loading').show();
            $('html, body').animate({
                scrollTop: $('#sort-wrap').offset().top - 5
            }, 500);
            $.ajax({
                url: getBudgetListUrl,
                type: 'get',
                data: {
                    condition: condition,
                    cityId: city.cityId,
                    pageIndex: pageindex,
                    pageSize: pagesize
                },
                success: function (result) {
                    carlist.html(result);
                    $('#list-loading').hide();

                    // initSwiper();
                }
            });
        });
    }

    check.telChannel('noProTelChannel', 'listMobile', BusinessLine, {
      'CityId': city.CityId,
      'CityText': city.CityName,
      'PageType': 4,//入口页类型 1-首页 2-列表页结果区 3-列表页无结果 4-按预算列表无结果 5-列表页底部 6-详情页
      'statisticalMarker': 'pc-xinche-budget-list-btn-tel-channel'
    });

    // 自定义参数
    $('.custom').each(function() {
        var custom = $(this);
        var inputs = custom.find('input');
        var inputMin = custom.find('input[name=min]');
        var inputMax = custom.find('input[name=max]');
        var submintBtn = custom.find('button');

        inputs.bind({
            'focus': function() {
                custom.addClass('active');

                if ($(this).attr('name') === 'min') {
                    if ($(this).attr('maxlength')) {
                        showError(this, '请输入' + $(this).attr('maxlength') + '位以内的整数');
                    }
                }

                checkready();
            },
            'blur': function() {
                custom.removeClass('active');
            },
            'input': function() {
                var value = $(this).val();
                var maxlength = parseInt($(this).attr('maxlength'));
                var min = 0;
                var max = Math.pow(10, maxlength) - 1;

                if (value) {
                    value = parseInt(value) || '';
                    if (typeof value === 'number') {
                        if (value < min) {
                            value = min;
                        } else if (value > max) {
                            value = max;
                        }
                    }
                }
                $(this).val(value);

                // checkready
                checkready(this);
            }
        });

        // ie8 无input事件，用keyup替换
        var browser = navigator.appName;
        if(browser === "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") === "MSIE8.0") {
            inputs.bind({'keyup': function() {
                    var value = $(this).val();
                    var maxlength = parseInt($(this).attr('maxlength'));
                    var min = 0;
                    var max = Math.pow(10, maxlength) - 1;

                    if (value) {
                        value = parseInt(value) || '';
                        if (typeof value === 'number') {
                            if (value < min) {
                                value = min;
                            } else if (value > max) {
                                value = max;
                            }
                        }
                    }
                    $(this).val(value);

                    // checkready
                    checkready(this);
                }
            })
        }

        // todo 数字大小错误提示
        submintBtn.bind('click', function(e) {
            e.preventDefault();
            var result = inputMin.attr('data-key') + inputMin.val().trim() + inputMax.attr('data-key') + inputMax.val().trim();
            var url = $(this).attr('data-url').replace(/\{placeholder\}/, result);
            location.href = url;
        });

        function checkready(elem) {
            var valueMin = parseInt(inputMin.val());
            var valueMax = parseInt(inputMax.val());
            if (valueMin && valueMax && valueMin < valueMax) {
                custom.addClass('ready');
                hideError(elem);
                return true;
            } else {
                custom.removeClass('ready');
                if (valueMin >= valueMax) {
                    showError(elem, '最小值和最大值输入错误');
                }
                return false;
            }
        }

        // 错误提示
        var errorTimeout = null
        function showError(input, log) {
            var errortip = $(input).parents('.custom').find('.error-tip');
            if (errortip.length) {
                errortip.text(log).fadeIn();
                if (errorTimeout) {
                    clearTimeout(errorTimeout);
                }
                errorTimeout = setTimeout(function () {
                    errortip.fadeOut();
                }, 2000);
            }
        }
        function hideError(input) {
            var errortip = $(input).parents('.custom').find('.error-tip');
            if (errortip.length) {
                errortip.fadeOut();
                if (errorTimeout) {
                    clearTimeout(errorTimeout);
                }
            }
        }
    });

    function initSwiper() {
        var swiperElems = $('.swiper-container');

        swiperElems.each(function() {
            var mySwiper = new Swiper (this, {
                loop: true,
                speed: 300
                // 如果需要前进后退按钮 3.0语法
                // nextButton: '.swiper-button-next',
                // prevButton: '.swiper-button-prev'
            });
            $(this).find('.swiper-button-prev').on('click', function(e){
                e.preventDefault()
                mySwiper.swipePrev()
            });
            $(this).find('.swiper-button-next').on('click', function(e){
                e.preventDefault()
                mySwiper.swipeNext()
            });
        });
    }
});


// 头部切换城市，不刷新
window.selCityCallback = function(obj) {
    $(".area-city-box .area-city-con").attr("data-id",obj.cityId).text(obj.cityName);
    window.location.href = obj.url;
};
