var __seo_title = $('#hidTitle').val();

$(function () {
    /*放大镜效果*/
    (function ($, window) {
        var cover = $(".taoche-details-mongolia-cover"), //获取cover层
                    float_div = $("#float_div"), //获取浮动层
                    big_pic_div = $("#big_pic_div"), //获取大图的DIV
                    big_pic = $("#bigImg"),
                    outerDiv = $('#taoche-details-pic');
        var valObj = {//比例计算暂存参数变量
            coverw: 0, //触摸层宽
            coverh: 0, ////触摸层高
            hasValue: true//是否已经取值
        };
        //鼠标over的时候
        var right_img;
        cover.mouseover(function () {
            //获取大图的url给bigImg赋值
            var currentIndex = $('#taoche-details-xs-pic li.current').index(), //当前图片的索引值 和小图选中的对应
                        zoomImgUrl = $("#taoche-details-piclist li").eq(currentIndex).find("img").attr("data-zoomimage"); //右侧大图的url
            !!zoomImgUrl && big_pic.attr("src", zoomImgUrl);
            right_img = new Image();
            right_img.onload = function () {
                $(this).css("cursor", "move"); //鼠标变成手的形状
                $("#float_div,#big_pic_div").show(); //移动浮层和大图外面的div展示
                if (valObj.hasValue) {
                    //获取大小图片的参数以便浮动层大小的计算，仅获取一次即可
                    valObj.coverw = cover.width(),
                                valObj.coverh = cover.height();
                    valObj.hasValue = false;
                }
            };
            right_img.src = zoomImgUrl;
        }).mouseout(function () {////鼠标移出
            $("#float_div,#big_pic_div").hide();
        }).mousemove(function (ev) { ////鼠标移动
            var sw = 256, sh = 170;
            var pos = ev || event,
                        left = pos.clientX - outerDiv.offset().left - sw / 2, //计算left 256/2=128
                        top = pos.clientY - outerDiv.offset().top - sh / 2 + $(window).scrollTop(); //计算top 130/2=65
            if (left < 0) {
                left = 0; //当小于0强制固定
            }
            else if (left > valObj.coverw - sw) {//大于某一参数也固定，以防浮动层移出图片区
                left = valObj.coverw - sw;
            }
            if (top < 0) {
                top = 0;
            }
            else if (top > valObj.coverh - sh) {
                top = valObj.coverh - sh;
            }
            //浮动层位置改变
            float_div.css({ "left": left + "px", "top": top + "px" });
            //大图的位置
            var percentX = left / valObj.coverw; //比例计算
            var percentY = top / valObj.coverh;
            var bigImgleft = -percentX * (big_pic.width()) + "px", //右边大图位置的改变，表现在实际中是放大区改变
                        bigImgTop = -percentY * (big_pic.height()) + "px";
            big_pic.css({ "left": bigImgleft, "top": bigImgTop });
        });
    })($, window);
    /*左右轮播*/
    (function ($, window) {
        /*大轮播图处理逻辑*/
        var bigUL = $("#taoche-details-piclist"),
                    bigLi = $("#taoche-details-piclist  li"),
                    bigLiCount = bigLi.length,
                    bigLiWidth = bigLi.width();
        //计算ul的宽度并赋值
        var bigULWidth = bigLiCount * bigLiWidth;
        bigUL.css({ "width": bigULWidth });

        /*小图处理逻辑*/
        var ul = $("#taoche-details-xs-pic"),
                    liObj = $('#taoche-details-xs-pic li'),
                    slideCount = liObj.length, //li的数量
                    slideWidth = liObj.width(), //li的宽度
                    pageCount = slideCount >= 5 ? 5 : slideCount; //显示出来的数量
        //计算ul的宽度并赋值
        var sliderUlWidth = (slideCount) * (slideWidth + 3) + 3;
        ul.css({ "width": sliderUlWidth });
        //初始化焦点图的样式
        liObj.first().addClass("current");

        var leftBtn = $("#move_left"), //向左按钮
                    rightBtn = $("#move_right"); //向右按钮
        bottomNow = 0; //底部ul最左边的li的索引

        //按钮初始化
        leftBtn.addClass("nohover");
        slideCount <= 1 && rightBtn.addClass("nohover");

        //左移动点击事件
        leftBtn.click(function () {
            var that = $(this);
            if (!that.hasClass("nohover") && !ul.is(":animated")) {
                var current = $('#taoche-details-xs-pic li.current'),
                            index = current.index();
                rightBtn.hasClass("nohover") && rightBtn.removeClass("nohover"); //去掉nohover
                if (bottomNow > 0) {
                    if (bottomNow == slideCount - pageCount && index >= slideCount - 2) {//右侧头部 并且 焦点图的索引大于中间位置
                        current.removeClass("current").prev("li").addClass("current");
                        bigMove($('#taoche-details-xs-pic li.current').index());
                    } else {
                        bottomNow = bottomNow - 1;
                        move(bottomNow, "left");
                    }
                } else if (bottomNow == 0) {//到左侧头了
                    if (slideCount > 5) {
                        if (index <= 2 && index > 0) {
                            current.removeClass("current").prev("li").addClass("current");
                            !(index - 1) && that.addClass("nohover");
                            bigMove($('#taoche-details-xs-pic li.current').index());
                        }
                    } else {
                        current.removeClass("current").prev("li").addClass("current");
                        !(index - 1) && that.addClass("nohover");
                        bigMove($('#taoche-details-xs-pic li.current').index());
                    }
                }
            }
        });
        //右移动点击事件
        rightBtn.click(function () {
            var that = $(this);
            if (!that.hasClass("nohover") && !ul.is(":animated")) {
                $("#move_left").hasClass("nohover") && $("#move_left").removeClass("nohover"); //去掉nohover
                var oldCurrent = $('#taoche-details-xs-pic li.current');
                index = oldCurrent.index();
                if (bottomNow < slideCount - pageCount) {
                    if (bottomNow == 0 && index < 2) {
                        oldCurrent.removeClass("current").next("li").addClass("current");
                        bigMove($('#taoche-details-xs-pic li.current').index());
                    } else {
                        bottomNow = bottomNow + 1;
                        move(bottomNow, "right");
                    }
                } else {//右侧到头了
                    var oldCurrent = $('#taoche-details-xs-pic li.current');
                    var index = oldCurrent.index();
                    if (index < slideCount - 1) {
                        oldCurrent.removeClass("current").next("li").addClass("current");
                        (index + 1) == (slideCount - 1) && that.addClass("nohover"); //slideCount-1 最后一个索引  index+1；下一个
                        bigMove($('#taoche-details-xs-pic li.current').index());
                    }
                }
            }
        });
        /*点击li事件*/
        liObj.click(function (ev) {
            ev.stopPropagation(); //阻止冒泡
            var that = $(this);
            if (!that.hasClass("current")) {
                var current = $('#taoche-details-xs-pic li.current'),
                            oldIndex = current.index();
                var thisIndex = that.index();
                that.addClass("current").siblings().removeClass("current");
                /*
                点击事件移动的条件
                1：li数量超过 5条 .......................slideCount > 5
                2：当前索引值大于前三条.............thisIndex >= 2 （索引从0开始）
                3：当前索引小于最后三个...................(slideCount-1)-2   最后一个索引=slideCount-1
                */
                // if (slideCount > 5) {//条数多余5条就移动，少于5条不移动  2
                if (thisIndex >= 1 && thisIndex <= slideCount - 2) {//1
                    var directionName = oldIndex < thisIndex ? "right" : "left";
                    if (thisIndex == slideCount - 2) {
                        bottomNow = slideCount - 5;
                        bottomNow = bottomNow < 0 ? 0 : bottomNow; //超出为0
                    } else {
                        bottomNow = thisIndex - 2; //重新计bottomNow值 点击的位置 减去2
                        bottomNow = bottomNow < 0 ? 0 : bottomNow; //超出为0
                    }
                    if (slideCount > 5) {
                        move(bottomNow, directionName, true);
                    }
                    if (thisIndex == slideCount - 1 && thisIndex != 0) {
                        disabledRightBtn_abledLeftBtn(); /*禁用右侧按钮，启用左侧按钮*/
                    } else if (thisIndex == 0 && thisIndex != slideCount - 1) {
                        disabledLeftBtn_abledRightBtn();    /*禁用左侧按钮，启用右侧按钮*/
                    } else if (thisIndex == 0 && thisIndex == slideCount - 1) {
                        disabledAllbtn();
                    } else {
                        ableAllBtn();
                    }
                } else if (thisIndex >= slideCount - 2) {//1
                    /*禁用右侧按钮，启用左侧按钮*/
                    thisIndex === 0 ? disabledLeftBtn_abledRightBtn() : disabledRightBtn_abledLeftBtn(); 
                } else if (thisIndex < 1) {
                    disabledLeftBtn_abledRightBtn(); /*禁用左侧按钮，启用右侧按钮*/
                }
                bigMove($('#taoche-details-xs-pic li.current').index());
            }
        });
        /*禁用左侧按钮，启用右侧按钮*/
        function disabledLeftBtn_abledRightBtn() {
            rightBtn.hasClass("nohover") && rightBtn.removeClass("nohover");
            !leftBtn.hasClass("nohover") && leftBtn.addClass("nohover");
        }
        /*禁用右侧按钮，启用左侧按钮*/
        function disabledRightBtn_abledLeftBtn() {
            leftBtn.hasClass("nohover") && leftBtn.removeClass("nohover");
            !rightBtn.hasClass("nohover") && rightBtn.addClass("nohover");
        }
        function ableAllBtn() {
            leftBtn.hasClass("nohover") && leftBtn.removeClass("nohover");
            rightBtn.hasClass("nohover") && rightBtn.removeClass("nohover");
        }
        function disabledAllbtn() {
            !leftBtn.hasClass("nohover") && leftBtn.addClass("nohover");
            !rightBtn.hasClass("nohover") && rightBtn.addClass("nohover");
        }
        /*方向对象*/
        var direction = {
            "left": function (that, ele) {
                return that.prev(ele);
            },
            "right": function (that, ele) {
                return that.next(ele);
            }
        }
        /*小图移动函数*/
        function move(bottomNow, directionName, isClick) {
            isClick = isClick || false;
            var that = $('#taoche-details-xs-pic li').eq(bottomNow),
                        l = that.position().left; //获取到需要展示的图片的偏移量
            //焦点图始终在中间位置
            if (!isClick) {//非点击触发
                var current = direction[directionName]($('#taoche-details-xs-pic li.current'), "li");
                current.addClass("current").siblings("li.current").removeClass("current");
                var topIndex = $('#taoche-details-xs-pic li.current').index();
                bigMove(topIndex);
            }
            ul.animate({ left: -l }, timeObj["samllImg"]); //执行动画
        }
        /*大图移动函数*/
        function bigMove(topIndex) {
            var l = $("#taoche-details-piclist  li").eq(topIndex).position().left;
            bigUL.animate({ left: -l }, timeObj["bigImg"]);
        }
    })($, window);

    myScroll(); //必须在后面

    /*车源图片大图轮播展示*/
    var carSourceImgShow = (function () {
        var index = 0,
                    carImgShowUl = $("#carSourceImgShowUl"),
                    currentImg = $("#currentImg");

        function carSourceImgMove(index, isClick) {
            var lisObj = $("#carSourceImgShowUl li"), //li的数量
             slideCount = lisObj.length, //li的数量
              that = lisObj.eq(index),
                        l = that.position().left; //获取到需要展示的图片的偏移量
            currentImg.text(index + 1);

            if (!index) {
                $("#carSourceImgLeft").parent("div").addClass("popover-big-prev-disabled");
            } else if (index >= slideCount - 1) {
                $("#carSourceImgRight").parent("div").addClass("popover-big-next-disabled");
            } else {
                var nextDiv = $("#carSourceImgRight").parent("div"),
                prevDiv = $("#carSourceImgLeft").parent("div");
                if (nextDiv.hasClass("popover-big-next-disabled")) {
                    nextDiv.removeClass("popover-big-next-disabled");
                }
                if (prevDiv.hasClass("popover-big-prev-disabled")) {
                    prevDiv.removeClass("popover-big-prev-disabled");
                }
            }
            if (isClick) {
                carImgShowUl.css({ "left": -l }); //执行动画
            } else {
                carImgShowUl.animate({ left: -l }, timeObj["carSourceImg"]); //执行动画
            }
        }

        return function (clickIndex, isClick) {
            var slideCount = $("#carSourceImgShowUl li").length; //li的数量
            if (slideCount <= 1) {
                $("#carSourceImgLeft").parent("div").addClass("popover-big-prev-disabled");
                $("#carSourceImgRight").parent("div").addClass("popover-big-next-disabled");
            }
            index = clickIndex || 0;
            backgroundC.load("carSourceImgShow", "bgCen");
            carSourceImgMove(index, isClick);
            $("#carsourceImgCount").text(slideCount); //总数
            currentImg.text(index + 1); //当前页码
            /*右侧按钮*/
            $("#carSourceImgRight").click(function () {
                var _me = $(this),
                _meparent = _me.parent("div");
                if (!_meparent.hasClass("popover-big-next-disabled")) {
                    if (!carImgShowUl.is(":animated")) {
                        if (index < slideCount - 1) {
                            index++;
                            carSourceImgMove(index, false);

                        }
                    }
                }
            });
            /*左侧按钮*/
            $("#carSourceImgLeft").click(function () {
                var _me = $(this),
                _meparent = _me.parent("div");
                if (!_meparent.hasClass("popover-big-prev-disabled")) {
                    if (!carImgShowUl.is(":animated")) {
                        if (index > 0) {
                            index--;
                            carSourceImgMove(index, false);
                            if (index <= 0) {
                                _meparent.addClass("popover-big-prev-disabled");
                            }
                        }
                    }
                }
            });
            /*关闭*/
            $("#carSourceImgShowClose").click(function () {
                backgroundC.close("carSourceImgShow", "bgCen");
                $("#carSourceImgRight").parent("div").removeClass("popover-big-next-disabled");
                $("#carSourceImgLeft").parent("div").removeClass("popover-big-prev-disabled");
            });
        } //function end
    })(); //carSourceImgShow end

    /*点击车源图片查看*/
    $(document).on("click", "#carSourceImgUl li", function () {
        var json = $.parseJSON($("#imgsJsonShow").val()),
          carImgShowUl = $("#carSourceImgShowUl");
        if (!!json) {
            if (!carImgShowUl.hasClass("isload")) {
                var liStr = "";
                for (var i = 0, len = json.length; i < len; i++) {
                    liStr += '<li data-id="' +
                        i +
                        '"  logwt="bytailsindex_cyxq_cydt"><img title="' +
                        __seo_title +
                        '" src="' +
                        json[i] +
                        '"  alt="" width="750" height="500"  /></li>';
                }
                carImgShowUl.html(liStr);

                var liObj = $("#carSourceImgShowUl li"),
                    currentImg = $("#currentImg");

                var slideCount = liObj.length, //li的数量
                    slideWidth = 750, //li的宽度
                    slideHeight = 500; //li的高度
                carImgShowUlWidth = slideCount * slideWidth;
                carImgShowUl.css({ "width": carImgShowUlWidth, "height": slideHeight });

                carImgShowUl.addClass("isload");
            }
            carSourceImgShow($(this).index(), true);
        }
    });
    //焦点大图延迟加载
    setTimeout(function () {
        $('#taoche-details-piclist img').each(function () {
            var g = $(this), h = g.attr('data-src');
            if (h != '') {
                g.attr('src', h);
            }
        });
    }, 30);
});
