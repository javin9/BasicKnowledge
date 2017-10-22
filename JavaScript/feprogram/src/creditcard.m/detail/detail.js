import '../list/list.scss'
var swiper = require('libs/swiper');
    var cardDetail = {
        init: function () {
            $('.swi_ctn .detail_con').addClass('hide');
            $('.swi_ctn .detail_con').eq(0).removeClass('hide');
            var mySwiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                //autoplay: 5000,
                loop: false,
                autoplayDisableOnInteraction: false,
                onInit: function (swiper) {
                    //if (swiper.slides.length - 2 < 2) {
                    //    swiper.lockSwipes();
                    //    swiper.stopAutoplay();
                    //    $('.swiper-pagination').hide();
                    //} else {
                    //    swiper.unlockSwipes();
                    //    $('.swiper-pagination').show();
                    //}
                    if (swiper.imagesLoaded <= 1) {
                        swiper.lockSwipes();
                        swiper.stopAutoplay();
                        $('.swiper-pagination').hide();
                    } else {
                        swiper.unlockSwipes();
                        $('.swiper-pagination').show();
                    }
                },
////////////////////////////////////////
                effect: 'coverflow',
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 'auto',
                coverflow: {
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true
                },
                onTransitionEnd: function (swiper) {
                    var num = swiper.activeIndex+1;
                    var dataId = $('.swi_ctn .detail_con').attr('data-id');
                    $('.swi_ctn .detail_con').each(function (i, n) {
                        var dataIdNum = Number($(this).attr('data-id'));
                        if (dataIdNum == num) {
                            $('.swi_ctn .detail_con').addClass('hide');
                            $(this).removeClass('hide');
                        } else {
                        }
                    })
                }
            })
        },
    }
    cardDetail.init();
