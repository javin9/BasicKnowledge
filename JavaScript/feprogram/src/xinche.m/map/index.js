import './index.scss';

$(function () {
    $('#yxWrapper').append('<div class="tipsLetters" style="display: none;"></div>')

    $(".city-list a").on('click', function (event) {
        event.preventDefault();
        var _cityId = $(this).data("id"),
            _hrefUrl = $(this).attr("href");
        if (document.domain.search(".daikuan.com") != -1) {
            tools.setCookie("selectCityId", _cityId, "", ".daikuan.com");
            tools.setCookie("selectcity", _cityId, "", ".daikuan.com");
        } else {
            tools.setCookie("selectCityId", _cityId, "", document.domain);
            tools.setCookie("selectcity", _cityId, "", document.domain);
        }
        setTimeout(function () {
            window.location.href = _hrefUrl;
        }, 200)

    });
    var $tipsLetter = $('.tipsLetters');
    $('.city-nav-list a').click(function (e) {
        $tipsLetter.text($(e.target).text());
        $tipsLetter.show();
        setTimeout(() => {
            $tipsLetter.hide();
        }, 1000)
    })
})
