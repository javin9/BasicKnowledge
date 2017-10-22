/*
使用方法
var carPhotos = require("carPhotos");//加载
carPhotos.opts({})//配置相关参数需要时可以配置不需要可以省略
carPhotos.init();//启动

参数说明
wait: 10,
container: $("#SPhotosList"),//大图列表ID
conleft: $(".photos-focus-prev"),//大图上的左切换按钮
conright: $(".photos-focus-next"),//大图上的右切换按钮
consize: $(".scroll-photos-info"),//显示的图片数量里边可以有2个BOX,ID分别为curNum和totalNum
conwidth: 450,//大图宽度
icons: $("#SPhotosBtn"),//缩略图列表ID
iconleft: $(".photos-prev-btn"),//缩略图左侧按钮
iconright: $(".photos-next-btn"),//缩略图右侧按钮
iconwidth: 91,//缩略图box宽度

注意：页面结构查看新车列表页面
*/

    var intshow = 0;
    var maxsize = 4;
    var space = 2;
    var size = 0;
    var options = {
        wait: 10,
        container: $("#SPhotosList"),
        conleft: $(".photos-focus-prev"),
        conright: $(".photos-focus-next"),
        consize: $(".scroll-photos-info"),
        conwidth: 400,
        icons: $("#SPhotosBtn"),
        iconleft: $(".photos-prev-btn"),
        iconright: $(".photos-next-btn"),
        iconwidth: 91,
        isHover: false,
        curNum: $(".scroll-photos-info #curNum"),
        totalNum: $(".scroll-photos-info #totalNum"),
        clickleft: function() {
            if (options.container.is(":animated")) {
                return
            }
            var index = options.icons.find("li.current").index();
            if (index < 1) {
                return false
            } else {
                var tid = index - 1;
                options.curNum.html(tid + 1);
                options.icons.find(".current").removeClass("current");
                options.icons.find("li:eq(" + tid + ")").addClass("current");
                if (tid >= space && tid < size - space) {
                    options.icons.animate({
                        "left": ( - (tid - space) * options.iconwidth) + "px"
                    })
                }
                options.container.animate({
                    "left": ( - (tid * options.conwidth)) + "px"
                });
                if (tid < 1) {
                    options.conleft.hide();
                    if (!options.iconleft.hasClass("nohover") && size > maxsize) {
                        options.iconleft.addClass("nohover");
                        options.conleft.addClass("nohover");
                    }
                }
                if (tid < size - 1) {
                    if (!options.conleft.is(":hidden")) {
                        options.conright.show()
                    }
                    if (options.iconright.hasClass("nohover") && size > maxsize) {
                        options.iconright.removeClass("nohover");
                        options.conright.removeClass("nohover")
                    }
                }
            }
        },
        clickright: function() {
            if (options.container.is(":animated")) {
                return
            }
            var index = options.icons.find("li.current").index();

            if (index >= size - 1) {
                return false
            } else {
                var tid = index + 1;
                options.curNum.html(tid + 1);
                options.icons.find(".current").removeClass("current");
                options.icons.find("li:eq(" + tid + ")").addClass("current");
                if (tid > space && tid < size - 1) {
                    options.icons.animate({
                        "left": ( - (tid - space) * options.iconwidth) + "px"
                    })
                }
                options.container.animate({
                    "left": ( - (tid * options.conwidth)) + "px"
                });
                if (tid >= size - 1) {
                    options.conright.hide();
                    if (!options.iconright.hasClass("nohover") && size > maxsize) {
                        options.iconright.addClass("nohover");
                        options.conright.addClass('nohover');
                    }
                }
                if (tid > 0) {
                    if (!options.conright.is(":hidden")) {
                        options.conleft.show()
                    }
                    if (options.iconleft.hasClass("nohover") && size > maxsize) {
                        options.iconleft.removeClass("nohover");
                        options.conleft.removeClass("nohover")
                    }
                }
            }
        },
        clickme: function() {
        	
            if (options.container.is(":animated")) {
                return
            }
            var index = options.icons.find("li.current").index();
            var curindex = $(this).index();
            options.curNum.html(curindex +1);
            if (index == curindex) {
                return false
            } else {
                var tid = curindex;
                options.icons.find(".current").removeClass("current");
                options.icons.find("li:eq(" + tid + ")").addClass("current");
                if (tid > space && tid < size - space) {
                    options.icons.animate({
                        "left": ( - (tid - space) * options.iconwidth) + "px"
                    })
                } else {
                    if (tid <= space && size > maxsize) {
                        options.icons.animate({
                            "left": "0"
                        })
                    } else {
                        if (tid <= size - space && size > maxsize) {
                            options.icons.animate({
                                "left": ( - (size - maxsize) * options.iconwidth) + "px"
                            })
                        }
                    }
                }
                options.container.animate({
                    "left": ( - (tid * options.conwidth)) + "px"
                });
                if (tid >= size - 1 && size > maxsize) {
                    if (!options.iconright.hasClass("nohover")) {
                        options.iconright.addClass("nohover");
                        options.conright.addClass('nohover');
                    }
                }
                if (tid < size - 1 && size > maxsize) {
                    if (options.iconright.hasClass("nohover")) {
                        options.iconright.removeClass("nohover");
                        options.conright.removeClass("nohover")
                    }
                }
                if (tid > 0 && size > maxsize) {
                    if (options.iconleft.hasClass("nohover")) {
                        options.iconleft.removeClass("nohover");
                        options.conleft.removeClass("nohover")
                    }
                }
                if (tid == 0) {
                    if (!options.iconleft.hasClass("nohover")) {
                        options.iconleft.addClass("nohover");
                        options.conleft.addClass("nohover");
                    }
                }
            }
        }
    };
    function init(){
    	size = options.icons.find("li").size();
	    options.icons.css("width", (size * options.iconwidth) + "px");
	    if (size > 0) {
	    	options.curNum.html("1");
	    	options.totalNum.html(size);
	        options.icons.find("li:eq(0)").addClass("current");
	        options.container.css({"width": (size * options.conwidth) + "px","left":"0px"});
            options.conleft.hide();
            options.conright.show();
	        if(options.isHover){
	        	options.conleft.mouseover(function() {
		            if (intshow > 0) {
		                clearTimeout(intshow)
		            }
		        }).mouseout(function() {
		            intshow = setTimeout(function() {
		                options.conleft.hide();
		                options.conright.hide();
		                options.consize.hide();
		            },
		            options.wait)
		        });
		        options.conright.mouseover(function() {
		            if (intshow > 0) {
		                clearTimeout(intshow)
		            }
		        }).mouseout(function() {
		            intshow = setTimeout(function() {
		                options.conleft.hide();
		                options.conright.hide();
		                options.consize.hide();
		            },
		            options.wait)
		        });
		        options.container.mouseover(function() {
		            if (intshow > 0) {
		                clearTimeout(intshow)
		            }
		            var index = options.icons.find("li.current").index();
		            options.conleft.show();
		            options.conright.show();
		            options.consize.show();
		            if (index == 0) {
		                options.conleft.hide()
		            }
		            if (index == size - 1) {
		                options.conright.hide()
		            }
		        }).mouseout(function() {
		            intshow = setTimeout(function() {
		                options.conleft.hide();
		                options.conright.hide();
		                options.consize.hide()
		            },
		            options.wait)
		        })
	        };
	        
	    } else {
	    	options.curNum.html("0");
	    	options.totalNum.html("0");
	        options.container.append('<li><img src="../../images/libs/no_picture.png" alt="暂无图片"></li>');
	        options.container.css("width", (options.conwidth) + "px")
	    }
	    if (size > 1) {
	        options.conleft.click(options.clickleft);
	        options.conright.click(options.clickright);
	        options.icons.find("li").click(options.clickme)
	    }
	    if (size > maxsize) {
	        options.iconright.removeClass("nohover");
	        options.conright.removeClass("nohover");
	        options.iconleft.click(options.clickleft);
	        options.iconright.click(options.clickright)
	    }
    };
    
    function opts(opts){
    	options = $.extend(options,opts);
    }

    module.exports = {
        init,opts
    }