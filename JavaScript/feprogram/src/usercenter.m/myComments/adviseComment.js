import './adviseComment.scss'
    ; (function ($) {
        var e = {
            nextAll: function (s) {
                var $els = $(), $el = this.next()
                while ($el.length) {
                    if (typeof s === 'undefined' || $el.is(s)) $els = $els.add($el)
                    $el = $el.next()
                }
                return $els
            },
            prevAll: function (s) {
                var $els = $(), $el = this.prev()
                while ($el.length) {
                    if (typeof s === 'undefined' || $el.is(s)) $els = $els.add($el)
                    $el = $el.prev()
                }
                return $els
            }
        }

        $.extend($.fn, e)
    })($);
    var index = {
        init: function () {
            var self = this;
            self.share();
        },
        share: function () {
            //标签点击事件
            $(".tag_box").on("tap", 'span.tag', function (e) {
                if ($(this).hasClass('on')) {
                    $(this).removeClass('on');
                } else {
                    if ($(this).siblings('span.on').length > 2) {
                        tools.showAlert("最多选3个哦~");
                    } else {
                        $(this).addClass('on');
                        $(this).parents('.tag_box').attr('data-id', true)
                    }
                }
            })
            //星星点击
            var starNum;
            $(".star-level i").on("click", function () {
                starNum = $(this).index() + 1;
                $(this).addClass('on').nextAll('i').removeClass("on");
                $(this).addClass("on").prevAll().addClass("on");
                $(this).parents('.star_box').attr('data-id', true);
            })
            //
            
            //返回按钮
            //$(".backGoPage").on('click', function (event) {
            //    event.preventDefault();
            //    maskLayerBox.show();
            //    backGoPageTipBox.show();
            //});
            //文本域事件
            $(".textarea").on("keyup input", function (e) {
                var Address = $('.taxtarea').val();
                $('.numTextCanBe').html(20 - Address.length)
            })

            $('.taxtarea').keyup(function () {
                var Address = $('.taxtarea').val();
                $('.numTextCanBe').html(20 - Address.length)
            })
            $('.taxtarea').blur(function () {
                if ($(this).val().trim() == "" || $(this).val().trim().length > 20) {
                    tools.showAlert('请输入5至20个文字评价')
                } else {

                }
            });
            function AddAntiForgeryToken(data) {
                data.__RequestVerificationToken = $('input[name=__RequestVerificationToken]').val();
                return data;
            };
            //先判断浏览器是不是万恶的IE，没办法，写的东西也有IE使用者
            var bind_name = 'input';
            if (navigator.userAgent.indexOf("MSIE") != -1) {
                bind_name = 'propertychange';
            }
            $('.taxtarea').bind(bind_name, function (e) {
                $('.numTextCanBe').text(19 - ($(this).val().length));
            })
            //提交数据
            $('.submit-btn').on('tap', function () {
                var star=$('.star_box').attr('data-id'),
                    tag=$('.tag_box').attr('data-id'),
                    taxtarea = $('.taxtarea').val().trim().length;
                if (star != 'true' ) {
                    tools.showAlert('请对顾问服务进行点评')
                } else if (tag != 'true') {
                    tools.showAlert('请对顾问印象进行点评')
                } else if (star == 'true' && tag == 'true' && (taxtarea == 0 || taxtarea > 4)) {
                    var _adviseEvaluateTags = '';
                    $.each($(".tag_box .on"), function (index, val) {
                        if (index == $(".tag_box .tag.on").length - 1) {
                            _adviseEvaluateTags += $(val).attr("data-id");
                        } else {
                            _adviseEvaluateTags += $(val).attr("data-id") + "|";
                        }
                    });
                    var _data = {
                        AdviserId: $("#AdviserId").val(), //顾问Id（来自隐藏域）
                        CallLogId: $("#CallLogId").val(), //话务Id（来自隐藏域）
                        Mobile: $('#Mobile').val(),//手机号
                        AdviserJudgeScore:starNum,   //顾问评分
                        AdviserJudgeContent:$(".taxtarea").val(),    //顾问评价内容
                        AdviseEvaluateTags:_adviseEvaluateTags,  //顾问标签,多个以"|"为分隔符
                    };
                    //console.log(_data)
                    $.ajax({
                        url: '/MyComment/SubmitAdviserEvaluate',
                        type: 'POST',
                        data: AddAntiForgeryToken(_data),
                        beforeSend: function () {},
                        success: function (res) {
                            //console.log(res)
                            location.href = "/MyComment/CommentResult?childOrderID=" + $('#Mobile').val();
                        },
                       // complete: function (XMLHttpRequest, textStatus) {}
                    })
                } else {
                    tools.showAlert('请输入5至20个文字评价')
                }

            })
        },
    }
    index.init()