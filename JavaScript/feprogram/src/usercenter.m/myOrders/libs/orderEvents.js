import 'zepto/src/touch'

$(function(){
    //滚动隐藏分享图标
    let _timer,$shareCard=$('.share-card'),_sign=0,$btnBarHeight = $('.buttons-bar').height();
    $(window).scroll(function () {
        // $('.two_txt').text('winTop:' + $(window).scrollTop() +'__' +$(document).height() + '__'+$(window).height() +"___"+$btnBarHeight)
        if($(window).scrollTop() >= $(document).height() - $(window).height() - $btnBarHeight - 5){
            _sign=1;
            _timer = setTimeout(function(){
                if(!$shareCard.hasClass('translucent') &&  _sign){
                    $shareCard.addClass('translucent')
                }
            },1000)
        }else{
            _sign=0;
            if(_timer){
                clearTimeout(_timer);
            }
            if($shareCard.hasClass('translucent')){
                $shareCard.removeClass('translucent')
            }
        }
    })
})
export default {
    init: function () {
        var _isWebView = tools.isWebView(),
            isApp = Boolean(_isWebView == 'yixinapp' || _isWebView == 'yixinbjapp');
        //app里隐藏 去详情的链接和icon ，隐藏评价，和晒单按钮
        if (isApp) {
            //tools.showAlert('进来了'+isApp);
            $('#prodct_url').removeAttr('href');
            $('#prodct_goto').hide();
            //$('#btn_gopay');
            //$('#btn_tk')
            $('#btn_pj').hide();
            $('#btn_sd').hide();
            //$('#btn_qx')
        } else {
           //tools.showAlert('没有进来'+isApp);
        }

        /*默认*/
        $('.header_right').removeClass('show');
        $('#maskLayer').hide();
        /**/
        $('.u_i_myO_ul .chezhudai').on('tap', function () {
            tools.showAlert('未完待续...');
        })
        //userExit
        //$('#userExit').on('tap', function () {
        //    tools.showAlert('退出成功');
        //    window.location.href = '/User/Logout?currenturl=' + xincheUrl;
        //})
        $('#userExit').on('click', function (e) {
            //e.stopPropagation();
            // e.preventDefault();
            $(this).parent('.header_right').addClass('show');
            $('#maskLayer').css({ 'background': 'transparent', 'width': '100%', 'hegith': '100%', 'z-index': '90' });
            $('#maskLayer').show();

            e.stopPropagation();
        })
        //$(document).on('tap', function (e) {
        //    var target=$(e.target);
        //    var self = this;
        //    if (!target.is(self.downMenuDom) && target.parents('.header_user_top').length <= 0) {
        //        $('.header_right').removeClass('show');
        //        $('#maskLayer').hide();
        //    }                
        //})
        $('.header_user_top a').on('click', function () {
            var thisHref = $(this).attr('href')
            window.location.href = thisHref;
            $('.header_right').removeClass('show');
            $('#maskLayer').hide();
        })
        $('#maskLayer').on('click', function () {
            $('.header_right').removeClass('show');
            $('#maskLayer').hide();
        })
        //关闭贷款礼包弹层
        $(".pop-up-layer .close-layer").on('click', function (e) {
            $("#gift-layer,#maskLayer").hide();
            e.stopPropagation();
        });

        //贷款礼包 详情
        $(".get-gifts").on('tap', function () {
            var data = {
                childOrderId: $(this).data("id")
            };
            $.ajax({
                type: 'get',
                url: '/MyOrder/GetPackageGiftsByChildOrderId',
                data: data,
                dataType: 'json',
                success: function (res) {
                    if (res.Result) {
                        var str = "<dt>恭喜您贷款成功，您已获得：</dt>",
                            temp = "<dd>$GiftName<span>价值$GiftValue元</span></dd>";
                        if (res.Data != null && res.Data.length > 0) {
                            for (var i = 0; i < res.Data.length; i++) {
                                var item = res.Data[i];
                                str += temp.replace("$GiftName", item.GiftName)
                                    .replace("$GiftValue", item.GiftValue);
                            }
                            $("#gift-layer dl").html("").html(str)
                            $("#gift-layer,#maskLayer").show();
                            $("#gift-layer .confirm-btn").data("id", data.childOrderId);
                        }
                    }
                    else {
                        tools.showAlert(res.Message);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    if (xhr.status == 401) {
                        tools.showAlert("请先登录", 24 * 60 * 60 * 1000);
                        window.location = usercenter;
                        return;
                    }
                    tools.showAlert("服务器异常,请稍后再试");
                }
            })
        });
        //没有订单交互
        if(isApp){
            $("#noOrder .col_blue").attr("href","javascript:void(0)").on("click",function (e) {
                e.preventDefault();
                if(Boolean(_isWebView == 'yixinapp')){
                    tools.jsNativeBridge("goHome");
                }else{
                    tools.jsNativeBridge("payResultAction","goHome");
                }

            })
        }

        //确认领取礼包
        $("#gift-layer .confirm-btn").on('tap', function () {
            var data = {
                childOrderId: $(this).data("id")
            };
            $.ajax({
                url: "/MyOrder/UpdateChildOrderPackageGiftReceived",
                type: "POST",
                dataType: 'json',
                data: data,
                success: function (res) {
                    if (res.Result) {
                        $("#gift-layer").hide();
                        window.location.href = window.location.href;
                    } else {
                        tools.showAlert(res.Message);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    if (xhr.status == 401) {
                        tools.showAlert("请先登录", 24 * 60 * 60 * 1000);
                        window.location = usercenter;
                        return;
                    }
                    tools.showAlert("服务器异常,请稍后再试");
                }
            });
        });

        // 去支付
        $('.btnPay').on('click', function () {
            //LiuFL 2016-08-19 Alter
            var childOrderId = "";
            if (typeof curOrderInfo != "undefined") {
                childOrderId = curOrderInfo.childOrderId;
            }
            else {
                childOrderId = $(this).data("childorderid")
            }
            $.ajax({
                url: '/MyOrder/CheckPayment?childOrderId=' + childOrderId,
                type: "GET",
                dataType: 'json',
                success: function (res) {
                    if (res.Result) {
                        window.location.href = res.Data;
                    } else {
                        tools.showAlert(res.Message, 24 * 60 * 60 * 1000);
                        window.location.href = window.location.href;
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    if (xhr.status == 401) {
                        tools.showAlert("请先登录", 24 * 60 * 60 * 1000);
                        window.location = usercenter;
                        return;
                    }
                    tools.showAlert("服务器异常,请稍后再试");
                }

            })
        });

        // 取消订单
        $('.btnCancel').on('click', () => {
            const showMask = () => $('#maskLayer').css('display', 'block')
            const hideMask = () => $('#maskLayer').css('display', 'none')
            const template = `
                <div class="modal-dialog">
                    <h3>注意：订单取消后将无法恢复，相应优惠也将一并取消，是否继续？</h3>
                    <div class="modal-dialog-btn">
                        <a href="javascript:void(0)" class="cancel">取消</a>
                        <a href="javascript:void(0)" class="confirm">确定</a>
                    </div>
                </div>`
            const $modal = $(template)
            $modal.on('click', '.cancel', () => {
                $modal.remove()
                hideMask()
            })
            $modal.on('click', '.confirm', () => {
                $modal.addClass('loading')
                $.post('/myorder/CancelOrder', { childOrderId: curOrderInfo && curOrderInfo.childOrderId || $(this).data("childorderid") }, res => {
                    $modal.removeClass('loading')
                    $modal.remove()
                    hideMask()
                    if (res.Result) {
                        if (dev) {
                            console.log('取消订单成功')
                        } else {
                            window.location.reload()
                        }
                    } else {
                        tools.showAlert(res.Message, 5000)
                    }
                }, 'json')
            })

            showMask()
            $modal.appendTo($('body'))
        })


        // 退款按钮
        $('.btnRefund').on('click', function () {
            var childOrderId = "";
            if (typeof curOrderInfo != "undefined") {
                childOrderId = curOrderInfo.childOrderId;
            }
            else {
                childOrderId = $(this).data("childorderid")
            }
            $.ajax({
                url: '/MyOrder/CheckRefund?childOrderId=' + childOrderId,
                type: "GET",
                dataType: 'json',
                success: function (res) {
                    if (res.Result) {
                        window.location.href = res.Data;
                    } else {
                        tools.showAlert(res.Message, 24 * 60 * 60 * 1000);
                        window.location.href = window.location.href;
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    if (xhr.status == 401) {
                        tools.showAlert("请先登录", 24 * 60 * 60 * 1000);
                        window.location = usercenter;
                        return;
                    }
                    tools.showAlert("服务器异常,请稍后再试");
                }

            })
        });

        // 增险
        $('#popInsuranceTrig').tap(function () {
            var _insuranceCompanyName = $(this).parents('.sec_insurance').find('img').data('companyname');
            if (_insuranceCompanyName == 'syzx') {
                tools.setCookie('InsComp', '2');
            } else {
                tools.setCookie('InsComp', '1');
            }
            tools.serviceProvision({
                "url": inusrance.Url,
                "title": inusrance.Title + '说明'
            });
        });

        ///////////////
        this.userPhoto();
    },
    ///更换头像
    userPhoto: function () {
        var flg, oldNumber = '', potoID = '';
        //poto
        $('.poto').on('tap', function () {
            potoID = $('.poto_img').attr('data-id')
            $('.potoIMg').show();
            var height = -($('.potoIMg_box').height() / 2)
            $('.potoIMg_box').css({ 'margin-top': height + 'px' })
            $('.poto_img_ul .itme .poto_div').each(function () {
                if ($(this).attr('data-id') == potoID) {
                    $('.poto_div').removeClass('cur')
                    $(this).addClass('cur');
                    $('.poto_img_ul').attr('data-id', 'true');
                }
            })
            $('body').bind('touchmove', function (e) {
                e.preventDefault();
            });
        })
        //
        $('.poto_div').on('click', function (e) {
            $('.poto_div').removeClass('cur')
            $(this).addClass('cur')
            //$(this).attr('data-id')
            $('.poto_img_ul').attr('data-id', 'true');
            $('.potoIMg').hide();
            if ($('.poto_img_ul').attr('data-id') == 'true') {
                var data = new Object();
                var potoImgSrc = $('.poto_img_ul .cur img').attr('src');
                $.ajax({
                    url: '/User/ChangeUserRandomHeadportrait',
                    type: "POST",
                    data: { headprotraitId: Number($('.poto_img_ul .cur').attr('data-id')) },
                    success: function (res) {
                        $('.poto_img').attr('src', potoImgSrc)
                        $('.poto_img').attr('data-id', $('.poto_img_ul .cur').attr('data-id'))
                        $('body').unbind('touchmove');
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        if (xhr.status == 401) {
                            tools.showAlert("请先登录", 24 * 60 * 60 * 1000);
                            window.location = usercenter;
                            return;
                        }
                        tools.showAlert("服务器异常,请稍后再试");
                    }

                })
            }
        })
        //关闭
        $('.closeMin').on('click', function () {
            $('.potoIMg').hide();
            if ($('.poto_img_ul').attr('data-id') == 'true') {
                var data = new Object();
                var potoImgSrc = $('.poto_img_ul .cur img').attr('src');
                $.ajax({
                    url: '/User/ChangeUserRandomHeadportrait',
                    type: "POST",
                    data: { headprotraitId: Number($('.poto_img_ul .cur').attr('data-id')) },
                    success: function (res) {
                        $('.poto_img').attr('src', potoImgSrc)
                        $('.poto_img').attr('data-id', $('.poto_img_ul .cur').attr('data-id'))
                        $('body').unbind('touchmove');
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        if (xhr.status == 401) {
                            tools.showAlert("请先登录", 24 * 60 * 60 * 1000);
                            window.location = usercenter;
                            return;
                        }
                        tools.showAlert("服务器异常,请稍后再试");
                    }

                })
            }


        })

    }
}