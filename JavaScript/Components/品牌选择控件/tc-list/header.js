(function(factory) {

    if (typeof module === 'object' && module.export) {
        module.export = factory();
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define([], factory);
    } else if (typeof window !== 'undefined') {
        window.HeaderComponent = factory();
    }

})(function() {
    /*菜单*/
    var menuMobile = $('#menu-mobile');
    $('.search_menu').click(function() {
        if (menuMobile.hasClass('hide')) {
            document.addEventListener('touchmove', preventScroll, isPassive() ? {
                capture: false,
                passive: false
            } : false);
        } else {
            document.removeEventListener('touchmove', preventScroll, false);
        }
        menuMobile.toggleClass('hide');
    });

    /*分享*/

    /*城市*/
    $('.search_city').click(function() {
    	window.location.href='';
    });
    /*搜索*/
     $('.search_icon').click(function() {
    	window.location.href='';
    });


    /*common function*/
    function isPassive() {
        var supportsPassiveOption = false;
        try {
            addEventListener("customTouch", null, Object.defineProperty({}, 'passive', {
                get: function() {
                    supportsPassiveOption = true;
                }
            }));
        } catch (e) {}
        return supportsPassiveOption;
    }

    function preventScroll() {
        arguments[0].preventDefault();
    }
});