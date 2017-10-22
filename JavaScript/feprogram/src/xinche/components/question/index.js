require('./index.scss')

var questions = {
    init: function () {
        this.initTab();
    },
    initTab: function () {
        var qaSection = $('.qa-section');
        if (qaSection.length) {
            var tabs = qaSection.find('.tabs .tab');
            var tabcons = qaSection.find('.tabcons .tabcon');

            tabs.removeClass('active').eq(0).addClass('active');
            tabcons.hide().eq(0).show();

            tabs.each(function (index) {
                $(this).bind('mouseenter', function () {
                    tabs.removeClass('active');
                    tabs.eq(index).addClass('active');
                    tabcons.hide();
                    tabcons.eq(index).show();
                });
            });
        }
    }
}

$(function () {
    questions.init();
});
