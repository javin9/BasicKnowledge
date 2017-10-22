require('./qa.scss')

var QA = {
    init: function() {
        // 缓存问题
        window.selCityCallback = function(obj) {
            window.location.href= window.location.pathname + '?cityid=' + (obj.cityId) + window.location.hash
        };

        var $nav = $('.layout-left .sub a');
        var hash = location.hash || $nav.eq(0).attr('href');

        $nav.each(function() {
            if ($(this).attr('href') === hash) {
                $(this).addClass('active');
                $(this).parents('ul.sub').prev('a').addClass('current');
                $(hash).show().css('display', 'block');
            }
        });

        $nav.click(function(e) {
            //e.preventDefault();
            $nav.removeClass('active');
            $('.layout-left a').removeClass('current');
            $(this).addClass('active');
            $(this).parents('ul.sub').prev('a').addClass('current');
            $('.layout-right .page').hide();
            $($(this).attr('href')).show();
        });
    }
};

$(function() {
    QA.init();
});
