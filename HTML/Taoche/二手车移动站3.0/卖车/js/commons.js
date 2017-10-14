/*默认值*/
Object.extend = function (destination, source) {
    if (!destination) return source;
    for (var property in source) {
        if (!destination[property]) {
            destination[property] = source[property];
        }
    }
    return destination;
};

(function ($) {
    $.fn.imgAdaption = function (options) {
        var setting = {
            vClass: 'vertical',
            hClass: 'horizontal'
        }
        options = Object.extend(options, setting);
        this.each(function (index, curr) {
            var $img = $(curr);
            $img.removeClass(options.vClass).removeClass(options.hClass);
            if ($img.width() > $img.height()) {
                $img.addClass(options.hClass);
            } else if ($img.width() < $img.height()) {
                $img.addClass(options.vClass);
            }
        })
    }
})(jQuery);

$(function () {
    //图片自适应
    $('[data-img=adaptive]').imgAdaption();
})