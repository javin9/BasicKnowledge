import './photos.scss';
import Swiper from 'libs/swiper/2.0';

var photoSwiper = {
    imageSwiper: null,
    thumbnailSwiper: null,
    markPos: [],

    init: function(options) {
        var self = this;
        var carId = options.carId;
        self.getData(carId, self.initDom, self.showError);
    },

    update: function(options) {
        var self = this;
        var carId = options.carId;
        $('#photo-container .center-wrapper').empty();
        self.getData(carId, self.initDom, self.showError);
    },

    getData: function(carId, success, error) {
        var images = null,
            thumbnails = null,
            self = this;

        $.ajax({
            url: '/api/product/GetCarImages',
            type: 'get',
            data: {
                carId: carId,
                size: 16
            },
            success: function(result) {
                if (result.Result) {
                    images = result.Data;
                } else {
                    images = 'false';
                }
            }
        });

        $.ajax({
            url: '/api/product/GetCarImages',
            type: 'get',
            data: {
                carId: carId,
                size: 2
            },
            success: function(result) {
                if (result.Result) {
                    thumbnails = result.Data;
                } else {
                    thumbnails = 'false';
                }
            }
        });

        var dataReady = setInterval(function() {
            if (images && thumbnails) {
                success.call(self, images, thumbnails);
                clearInterval(dataReady);
            } else if (images === 'false' || thumbnails === 'false') {
                if (typeof error === 'function') {
                    error.call(self);
                }
                clearInterval(dataReady);
            }
        }, 100);
    },

    initDom: function(data, data2) {
        var self = this;
        var imageCount = 0; // 图片总数
        var pos = [];   // 各组图片第一张位置
        var marks = [];
        var images = [];
        var thumbnails = [];

        for (var i = 0; i < data.length; i++) {
            if (data[i].CarImages.length) {
                marks.push({name: data[i].GroupName, number: data[i].CarImages.length + '张', pos: images.length, isActive: marks.length === 0});
                pos.push(images.length);
                images = images.concat(data[i].CarImages);
                thumbnails = thumbnails.concat(data2[i].CarImages);
            }
        }
        imageCount = images.length;

        if (imageCount) {
            for (var i = 0; i < thumbnails.length; i++) {
                thumbnails[i].pos = i;
                thumbnails[i].isActive = i === 0 ? true : false;
            }

            /* photoData.marks(marks);
            photoData.images(images);
            photoData.thumbnails(thumbnails); */

            var marksHtml = '',
                imagesHtml = '',
                thumbnailsHtml = '';

            for (var i = 0; i < marks.length; i++) {
                marksHtml += '<li class="mark'+ (i === 0 ? ' active' : '') + '" pos="' + marks[i].pos + '">' +
                        '<div class="name">' + marks[i].name + '</div>' +
                        '<div class="number">' + marks[i].number + '</div>' +
                    '</li>';
            }

            for (var i = 0; i < images.length; i++) {
                imagesHtml += '<div class="swiper-slide">' +
                        '<img data-src="' + images[i].Url + '" alt="" class="swiper-lazy" />' +
                        '<div class="swiper-lazy-preloader"></div>' +
                    '</div>';
            }

            for (var i = 0; i < thumbnails.length; i++) {
                thumbnailsHtml += '<div class="swiper-slide'+ (i === 0 ? ' active' : '') + '" pos="' + thumbnails[i].pos + '">' +
                        '<img src="' + thumbnails[i].Url + '" alt="" class="swiper-lazy" />' +
                       // '<div class="swiper-lazy-preloader"></div>' +
                    '</div>';
            }

            var html = '<div class="slider-wrapper">' +
                '<div class="swiper-container" id="main-swiper">' +
                    '<div class="swiper-wrapper">' +
                        imagesHtml +
                    '</div>' +
                    '<div class="swiper-button-prev"></div>' +
                    '<div class="swiper-button-next"></div>' +
                '</div>' +
                '<div class="thumbnail-wrapper">' +
                    '<div class="swiper-container" id="thumbnail-swiper">' +
                        '<div class="swiper-wrapper">' +
                            thumbnailsHtml +
                        '</div>' +
                    '</div>' +
                    '<div class="swiper-button-prev"><span></span></div>' +
                    '<div class="swiper-button-next"><span></span></div>' +
                '</div>' +
            '</div>' +
            '<div class="photo-mark" id="photo-mark">' +
                '<ul>' +
                    marksHtml +
                '</ul>' +
            '</div>';

            $('#photo-container .center-wrapper').html(html);

            self.markPos = pos;

            // 初始化容器高度
            var tempImage = new Image(),
                tempThumb = new Image(),
                imageReady = false,
                thumbReady = false;
            tempImage.onload = function() {
                $('#main-swiper').height(this.height/this.width*1100);
                imageReady = true;
            };
            tempImage.onerror = function() {
                imageReady = true;
            };
            tempThumb.onload = function() {
                $('#thumbnail-swiper').height(this.height/this.width*120);
                thumbReady = true;
            };
            tempThumb.onerror = function() {
                thumbReady = true;
            };
            tempImage.src = $('#main-swiper .swiper-slide').eq(0).find('img').attr('data-src');
            tempThumb.src = $('#thumbnail-swiper .swiper-slide').eq(0).find('img').attr('src');

            var readyInterval = setInterval(function() {
                if (imageReady && thumbReady) {
                    clearInterval(readyInterval);
                    self.updateSwiper();
                }
            }, 200);

        } else {
            // TODO: 没图片的处理
            self.showError();
        }
    },

    updateSwiper: function() {
        var self = this;
        var mainPrev = $('#main-swiper .swiper-button-prev'),
            mainNext = $('#main-swiper .swiper-button-next'),
            thumbPrev = $('.thumbnail-wrapper .swiper-button-prev'),
            thumbNext = $('.thumbnail-wrapper .swiper-button-next');

        self.imageSwiper = new Swiper('#main-swiper', {
            loop: false,
            // effect: 'fade',
            //lazyLoading: true,
            simulateTouch: false,
            //nextButton: '.swiper-button-next',
            //prevButton: '.swiper-button-prev',
            onSlideChangeStart: function (swiper) {
                var index = swiper.activeIndex;

                // 懒加载
                lazyload(swiper);

                for (var i = 0; i < self.markPos.length; i++) {
                    if (index < self.markPos[i]) {
                        break;
                    }
                }
                $('.photo-mark .mark').removeClass('active').eq(i - 1).addClass('active');

                if (Math.floor(self.thumbnailSwiper.activeIndex/8) !== Math.floor(index/8)) {
                    self.thumbnailSwiper.swipeTo(Math.floor(index/8)*8);
                }
                $(self.thumbnailSwiper.slides).removeClass('active');
                $(self.thumbnailSwiper.slides[index]).addClass('active');

                // 左右按钮disabled
                if (index === 0) {
                    mainPrev.addClass('disabled');
                    mainNext.removeClass('disabled');
                } else if (index === swiper.slides.length - 1) {
                    mainPrev.removeClass('disabled');
                    mainNext.addClass('disabled');
                } else {
                    mainPrev.removeClass('disabled');
                    mainNext.removeClass('disabled');
                }
                // thumb左右按钮disabled
                if (index < 8) {
                    thumbPrev.addClass('disabled');
                    thumbNext.removeClass('disabled');
                }
                if (index > swiper.slides.length - 1 - 8) {
                    thumbPrev.removeClass('disabled');
                    thumbNext.addClass('disabled');
                }
                if (index >= 8 && index <= swiper.slides.length - 1 - 8) {
                    thumbPrev.removeClass('disabled');
                    thumbNext.removeClass('disabled');
                }
            },
            onFirstInit: function(swiper) {
                // 懒加载
                lazyload(swiper);
                mainPrev.addClass('disabled');
                thumbPrev.addClass('disabled');
            }
        });

        // 懒加载
        function lazyload(swiper) {
            var index = swiper.activeIndex;
            var slide = $(swiper.slides[index]);
            var image = slide.find('img');
            var loading = slide.find('.swiper-lazy-preloader');
            if (!image.attr('src')) {
                image.load(function() {
                    loading.fadeOut('fast');
                });
                image.attr('src', image.attr('data-src'));
            }
        }

        self.thumbnailSwiper = new Swiper('#thumbnail-swiper', {
            loop: false,
            //lazyLoading: true,
            simulateTouch: false,
            //nextButton: '.swiper-button-next',
            //prevButton: '.swiper-button-prev',
            slidesPerView: 8,
            slidesPerGroup: 8,
            //spaceBetween: 2,
            onSlideChangeStart: function (swiper) {
            },
            onFirstInit: function(swiper) {
            }
        });
        // 左右按钮
        $('#main-swiper .swiper-button-prev').on('click', function(e){
            e.preventDefault();
            self.imageSwiper.swipePrev();
        });
        $('#main-swiper .swiper-button-next').on('click', function(e){
            e.preventDefault();
            self.imageSwiper.swipeNext();
        });
        $('.thumbnail-wrapper .swiper-button-prev').on('click', function(e){
            e.preventDefault();
            if ($(this).hasClass('disabled')) { return false; }
            self.thumbnailSwiper.swipePrev();
            var index = self.thumbnailSwiper.activeIndex;
            self.imageSwiper.swipeTo(index);
        });
        $('.thumbnail-wrapper .swiper-button-next').on('click', function(e){
            e.preventDefault();
            if ($(this).hasClass('disabled')) { return false; }
            self.thumbnailSwiper.swipeNext();
            var index = self.thumbnailSwiper.activeIndex;
            self.imageSwiper.swipeTo(index);
        });
        // 左右按钮结束

        // 缩略图切换
        $('#thumbnail-swiper').on('click', '.swiper-slide', function() {
            var index = $(this).attr('pos');
            self.imageSwiper.swipeTo(index);
        });

        // 标签切换
        $('.photo-mark').on('click', '.mark', function() {
            var index = $(this).attr('pos');
            self.imageSwiper.swipeTo(index, 0);
        });
    },

    showError: function() {
        tools.showAlert('该车款暂无图片,请查看其它车款！');
    }
}

$(function() {
    photoSwiper.init({
        carId: carId
    });

    // 下拉切换车型
    $('.car-select .select-ctrl').selectControl(function (selDataId, selText, item, selCategory, oldObj, link) {
        var carId = selDataId;
        photoSwiper.update({
            carId: carId
        });
    }, 'click', 'notRender');
    $('.car-select .select-ctrl li[data-disabled=disabled]').click(function() {
        if (!$(this).hasClass('disabled')) {
            photoSwiper.showError();
        }
    });
    $('body').on('click', '#showAlertBox, #maskLayer', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $( '#showAlertBox, #maskLayer').fadeOut('fast');
    });
});