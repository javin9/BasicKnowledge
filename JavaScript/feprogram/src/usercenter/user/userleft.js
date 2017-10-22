// JavaScript Document
// define(function (require, exports, module) {
    var check = require("libs/check");
    require('libs/jquery.datetimepicker'); //jquery.datetimepicker
    
    var indexProLeft = {
        init: function () {
            this.leftRightHeigh();
            this.userPhoto();
        },
        //userRight userLeft 左右对齐
        leftRightHeigh: function () {
            function leftRightHeigh() {
                $('#userRight').css('height', '');
                $('#userLeft').css('height', '');
                var userRight = dev?940:$('#userRight').height();
                var userLeft = dev?940:$('#userLeft').height();
                if (userRight > userLeft) {
                    $('#userRight').css('height', userRight + 'px');
                    $('#userLeft').css('height', userRight + 'px');
                } else {
                    $('#userRight').css('height', userLeft + 'px');
                    $('#userLeft').css('height', userLeft + 'px');
                }
            }
            leftRightHeigh();

            $('.user_icon.l.add_info').on('click', function () {
                $('.user_nav .user_ul li').removeClass("cur");
                $('.user_nav .user_ul li:eq(1)').addClass("cur");
                Tools.setCookie("navSelectIndex", $(this).attr("href"));
            });
            $('.user_icon.c.add_info').on('click', function () {
                $('.user_nav .user_ul li').removeClass("cur");
                $('.user_nav .user_ul li:eq(2)').addClass("cur");
                Tools.setCookie("navSelectIndex", $(this).attr("href"));
            });
            $('.user_icon.r.add_info').on('click', function () {
                $('.user_nav .user_ul li').removeClass("cur");
                $('.user_nav .user_ul li:eq(3)').addClass("cur");
                Tools.setCookie("navSelectIndex", $(this).attr("href"));
            });

            //url
            $('.user_nav .user_ul').on('click', 'li', function () {
                Tools.setCookie("navSelectIndex", $(this).find("a").attr("href"));
            });
			
            /*
				Remark:页面更新后及时设置对应的标签样式
				这块改成后端选中菜单了。(2016-06-14 LiuFL)
			*/
			
			/*
            (function leftCookie() {
                var navCookie = Tools.getCookie("navSelectIndex");
                if (navCookie) {
                    var curli = window.location.pathname;
                    if (window.location.href.indexOf(navCookie) > 0) {
                        //当前url包含cookie里面的值时
                        curli = navCookie;
                    }
                    $('.user_nav .user_ul li').each(function (index, item) {
                        var href = $(item).find("a").attr("href");
                        if (href == curli) {
                            $(item).addClass('cur');
                        }
                    });
                }
                else {
                    //coookie没值，默认选中第一个
                    $('.user_nav .user_ul li:first').addClass("cur");
                }
            })();
			*/
			
        },
        userPhoto: function () {
            var flg, flgClick = true, oldNumber = '';
   
            //if (flgClick == true) {
            $('.user_photo_bg').on('click', function () {
                if (flgClick) {
                    flgClick = false;
                    var random = Math.ceil(Math.random() * 8)
                    if (flg == true) {
                        if (oldNumber != random) {
                            //console.log('if: ', oldNumber, random)
                            oldNumber = random
                        } else {
                            random = Math.ceil(Math.random() * 8);
                            //console.log('ifelse: ', oldNumber, random)
                            oldNumber = random
                        }
                    } else {
                        flg = true
                        oldNumber = random
                        //console.log('else: ', oldNumber, random)
                    }
                    //console.log(arrImg[random - 1])
                    $.ajax({
                        url: '/User/ChangeUserRandomHeadportrait',
                        type: "POST",
                        data: { headprotraitId: random },
                        success: function (res) {
                            setTimeout(function () {
                                $('.user_photo .photo').attr('src', arrImg[random - 1])
                                flgClick = true;
                            }, 1000)
                            
                        }
                    })
                }
                })
            $('.user_photo_bg').hover(function () {
                $('.bg_txt').show();
            }, function () {
                $('.bg_txt').hide();
            })
           // }
          
            
        }
    }
    //exports.changePwd = indexPro.ChangePwd;
    /////////////
    $(function () {
        //var IsProfile = $('#IsProfile').attr('data-id');
        //var IsQualification = $('#IsQualification').attr('data-id');
        //var IsCertificate = $('#IsCertificate').attr('data-id');
        //console.log(IsProfile + '_' + IsQualification + '_' + IsCertificate)
        //if (IsProfile == 'False') {
        //    $('.user_icon.l').addClass('add_info');
        //} else {
        //    $('.user_icon.l').removeClass('add_info');
        //}
        //if (IsQualification == 'False') {
        //    $('.user_icon.c').addClass('add_info');
        //} else {
        //    $('.user_icon.c').removeClass('add_info');
        //}
        //if (IsCertificate == 'False') {
        //    $('.user_icon.r').addClass('add_info');
        //} else {
        //    $('.user_icon.r').removeClass('add_info');
        //}
        $('.user_icon_art .add_info').hover(function () {
            $(this).find('span').show();
        }, function () {
            $(this).find('span').hide();
        })
        
        //车主晒单-二维码
        $(".show_shareorder_QRCode").click(function(){
            $(".QRCode_box").removeClass("hide");
            $("#maskLayer").show();
        });
        $(".QRCode_box .closeEvent").click(function(){
            $(".QRCode_box").addClass("hide");
            $("#maskLayer").hide();
        });
        indexProLeft.init();
    })
// })