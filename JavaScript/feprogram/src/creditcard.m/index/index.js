// define(["zepto", 'tools', 'swiper'], function ($, tools, swiper) {
import './index.scss'
var swiper = require('libs/swiper');

    var cardIndex = {
        init: function () {
            var activeIndex = null;

            var mySwiper = new Swiper('.swiper-container', {
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
                        $('.swiper-pagination').hide();
                    } else {
                        $('.swiper-pagination').show();
                    }
                }
            });

            // var mySwiper = new Swiper('', {
            //     autoplay: 5000,
            //     loop: false,
            //     pagination: '.swiper-pagination',
            //     autoplayDisableOnInteraction: false,
            //     onInit: function (swiper) {
            //         if (swiper.imagesLoaded <= 1) {
            //             swiper.lockSwipes();
            //             swiper.stopAutoplay();
            //             $('.swiper-pagination').hide();
            //         } else {
            //             swiper.unlockSwipes();
            //             $('.swiper-pagination').show();
            //         }
            //     },
            //     noSwiping: false,
            // });
        },
    }
cardIndex.init();
