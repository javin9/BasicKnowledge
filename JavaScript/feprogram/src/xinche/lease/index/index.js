/**
 * Created by qianyuan on 2017/3/20.
 */
import './index.scss';
import Swiper from 'libs/swiper/2.0';
import 'libs/home_page_ad';

var Lease = {
    init: function() {
        if ($('.banner .swiper-slide').length > 1) {
            var mySwiper = new Swiper('.swiper-container', {
                loop: true,
                // 如果需要分页器
                pagination: '.swiper-pagination',
                paginationClickable: true,
                autoplay: 3700,
                speed: 700,
                autoplayDisableOnInteraction: false
            });
        }

        // 切换城市
        window.selCityCallback = function(obj) {
            $(".sel-city-box .city-con").attr("data-id",obj.cityId).text(obj.cityName);
            var loc = window.location.href.replace(new RegExp(city.citySpell,"g"), obj.citySpell);
            window.location.href = loc;
        };
    }
};

$(function() {
    Lease.init();
});