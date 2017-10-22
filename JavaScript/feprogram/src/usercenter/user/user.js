// JavaScript Document
// define(function (require, exports, module) {
require('libs/selCity');
var check = require("libs/check");
require('libs/jquery.datetimepicker'); //jquery.datetimepicker
var token = '';
var LicenseYear;
var LicenseMonth;
var LicenseDate;
var LicenseDateS;
var indexPro = {
    init: function() {
        this.leftRightHeigh();
        this.share();
        this.UserProfile();
        this.Qualification();
        this.CertificateInfo();
        this.ChangePwd();
        this.checkTelphone();
    },
    //userRight userLeft 左右对齐
    leftRightHeigh: function() {
        function leftRightHeigh() {
            $('#userRight').css('height', '');
            $('#userLeft').css('height', '');
            var userRight = dev ? 940 : $('#userRight').height();
            var userLeft = dev ? 940 : $('#userLeft').height();
            if (userRight > userLeft) {
                $('#userRight').css('height', userRight + 'px');
                $('#userLeft').css('height', userRight + 'px');
            } else {
                $('#userRight').css('height', userLeft + 'px');
                $('#userLeft').css('height', userLeft + 'px');
            }
        }
        leftRightHeigh();
    },
    share: function() {

        ////url
        //$('.user_nav .user_ul').on('click', 'li', function () {
        //    Tools.setCookie("navSelectIndex", $(this).find("a").attr("href"));
        //});
        ///*页面更新后及时设置对应的标签样式*/
        //(function leftCookie() {
        //    var navCookie = Tools.getCookie("navSelectIndex");
        //    if (navCookie) {
        //        var curli = window.location.pathname;
        //        if (window.location.href.indexOf(navCookie) > 0) {
        //            //当前url包含cookie里面的值时
        //            curli = navCookie;
        //        }
        //        $('.user_nav .user_ul li').each(function (index, item) {
        //            var href = $(item).find("a").attr("href");
        //            if (href == curli) {
        //                $(item).addClass('cur');
        //            }
        //        });
        //    }
        //    else {
        //        //coookie没值，默认选中第一个
        //        $('.user_nav .user_ul li:first').addClass("cur");
        //    }
        //})();
        /*下拉菜单*/
        $.each($(".select"), function(index, item) {
            $(item).selectControl();
        });
        /*input input_select selCityLeft user_textarea*/
        function inpSelHover(inputHover) {
            $(inputHover).hover(function() {
                $(this).addClass('box_red');
            }, function() {
                $(this).removeClass('box_red');
            })
        }
        inpSelHover('.input_line');
        inpSelHover('.input_select');
        inpSelHover('.selCityLeft');
        inpSelHover('.user_textarea');
    },
    //个人资料
    UserProfile: function() {
        /*时间 出生年月*/
        $('#Birthday').datetimepicker({
            lang: 'ch', //选择语言
            format: "Y年m月d日", //格式化日期
            monthpicker: false, //关闭时间选项
            timepicker: false,
            datepicker: true,
            yearStart: 1916, //设置最小年份
            yearEnd: (new Date()).getFullYear(), //设置最大年份
            minDate: '1916/01/1', //最小日期
            maxDate: (new Date()).getFullYear() + '/' + ((new Date()).getMonth() + 1) + '/' + (new Date()).getDate(), //最大日期
            //todayButton:false    //关闭选择今天按钮
            onChangeDateTime: function(dp, $input, obj) {
                LicenseYear = dp.getFullYear();
                LicenseMonth = dp.getMonth() + 1;
                LicenseDateS = (dp.getDate()).toString();
                if (LicenseDateS <= 9) {
                    LicenseDate = '0' + (dp.getDate()).toString();
                } else {
                    LicenseDate = (dp.getDate()).toString();
                }
                //console.log(LicenseMonth.toString() + '_' + LicenseDate.toString() + '_' + LicenseDateS)
                /*水瓶座120-218  双鱼座219-320 白羊座321-419 金牛座420-520 双子座521-621 巨蟹座622-722  狮子座723-822  处女座823-922 天秤座923-1023 天蝎座 1024-1122 射手座1123-1221 魔羯座1222-119 */
                var constellationNum = Number(LicenseMonth.toString() + LicenseDate.toString());
                if (constellationNum >= 120 && constellationNum <= 218) {
                    $('#Constellation').val('水瓶座');
                } else if (constellationNum >= 219 && constellationNum <= 320) {
                    $('#Constellation').val('双鱼座');
                } else if (constellationNum >= 321 && constellationNum <= 419) {
                    $('#Constellation').val('白羊座');
                } else if (constellationNum >= 420 && constellationNum <= 520) {
                    $('#Constellation').val('金牛座');
                } else if (constellationNum >= 521 && constellationNum <= 621) {
                    $('#Constellation').val('双子座');
                } else if (constellationNum >= 622 && constellationNum <= 722) {
                    $('#Constellation').val('巨蟹座');
                } else if (constellationNum >= 723 && constellationNum <= 822) {
                    $('#Constellation').val('狮子座');
                } else if (constellationNum >= 823 && constellationNum <= 922) {
                    $('#Constellation').val('处女座');
                } else if (constellationNum >= 923 && constellationNum <= 1023) {
                    $('#Constellation').val('天秤座');
                } else if (constellationNum >= 1024 && constellationNum <= 1122) {
                    $('#Constellation').val('天蝎座');
                } else if (constellationNum >= 1123 && constellationNum <= 1221) {
                    $('#Constellation').val('射手座');
                } else {
                    $('#Constellation').val('魔羯座');
                }
            }
        });
        /*城市*/
        $("#CityID").selCity({
            callBacks: function(obj) {
                $("#CityID").text(obj.cityName).attr('data-id', obj.cityId);
                // $("#Header .city-con").text(obj.cityName).attr('data-id', obj.cityId);
                if (obj.cityId != locationCityId) {
                    Tools.setCookie("selectcity", locationCityId, "", Tools.wildcardUrl());
                }
            }
        });
        $('.user_tip_box .colse').on('click', function() {
            $(this).parent('.user_tip_box').hide();
        })
        if ($('#NickName').val() != '') {
            $('#NickName').parents('li').attr('is-data', 'true');
        } else {
            $('#NickName').parents('li').attr('is-data', 'false');
        }
        //if ($('#Name').val() != '') {
        //    $('#Name').parents('li').attr('is-data', 'true');
        //} else {
        //    $('#Name').parents('li').attr('is-data', 'false');
        //}
        /*UsernameInput*/
        $('#NickName').blur(function() {
                var UsernameInput = $(this).val();
                if (UsernameInput.length > 10) {
                    $(this).parents('li').find('.alert').html('<i></i>您输入的字符过长，请限制在十个字符以内');
                    $(this).parents('li').find('.alert').show();
                    $(this).parents('li').attr('is-data', 'false');
                } else if (UsernameInput == '') {
                    $(this).parents('li').find('.alert').html('<i></i>请设置您的昵称');
                    $(this).parents('li').find('.alert').show();
                    $(this).parents('li').attr('is-data', 'false');
                } else {
                    $(this).parents('li').find('.alert').hide();
                    $(this).parents('li').attr('is-data', 'true');
                }
            })
            //$('#Name').blur(function () {
            //    var UsernameInput = $(this).val();
            //    if (UsernameInput.length > 10 || !check.isName(UsernameInput)) {
            //        $(this).parents('li').find('.alert').show();
            //        $(this).parents('li').attr('is-data', 'false');
            //    } else {
            //        $(this).parents('li').find('.alert').hide();
            //        $(this).parents('li').attr('is-data', 'true');
            //    }
            //})
            /*Address taxtareaTotal taxtareaActual*/
        function AddressTA() {
            var Address = $('#Address').val();
            $('#taxtareaTotal').html(Address.length);
            $('#taxtareaActual').html(100 - Address.length)
        }
        $('#Address').keyup(function() {
            AddressTA();
        })
        $('#UserEditBtn').on('click', function() {
            $('#userProfileText').hide();
            $('#userProfileInput').show();
            indexPro.leftRightHeigh();
            AddressTA();
        })
        $('#UserSaveBtn').on('click', function() {
            var UsernameLi = $('#NickName').parents('li').attr('is-data');
            //var Username2Li = $('#Name').parents('li').attr('is-data');if (UsernameLi == 'true' && Username2Li == 'true') {
            if (UsernameLi == 'true') {
                //data.Name = $('#Name').val();          //姓名
                data.NickName = $('#NickName').val(); //昵称
                data.Gender = $('#Gender .select-ctrl>div').attr('data-id'); //性别
                var dte = $('#Birthday').val();
                data.Birthday = dte.replace(/年/, '-').replace(/月/, '-').replace(/日/, ''); //)+'-'+dte.getMonth()+'-'+dte.getDate()     //出生年月
                data.Constellation = $('#Constellation').val(); //星座
                data.CityID = $('#CityID').attr('data-id'); //所在地
                data.Address = $('#Address').val(); //详细地址
                $.ajax({
                    url: '/User/EidtUserProfile',
                    type: "POST",
                    dataType: "JSON",
                    data: data,
                    success: function(res) {
                        //$('#NameTxt').html($('#Name').val());
                        $('#NickNameTxt').html($('#NickName').val());
                        $('.user_photo_box .user_name').html($('#NickName').val()); //左侧昵称
                        $('#GenderTxt').html($('#Gender .select-ctrl>div').attr('data-id'));
                        $('#BirthdayTxt').html($('#Birthday').val());
                        $('#ConstellationTxt').html($('#Constellation').val());
                        $('#CityIDTxt').html($('#CityID').text());
                        $('#AddressTxt').html($('#Address').val());
                        $('#userProfileText').show();
                        $('#userProfileInput').hide();
                    },
                    error: function(res) { Tools.showAlert(res); }
                })
            } else if ($('#NickName').val() == '') {
                $('#NickName').parents('li').find('.alert').html('<i></i>请设置您的昵称');
                $('#NickName').parents('li').find('.alert').show();
                $('#NickName').parents('li').attr('is-data', 'false');
            } else if (UsernameLi != 'true') {
                $('#NickName').parents('li').find('.alert').html('<i></i>您输入的字符过长，请限制在十个字符以内');
                $('#NickName').parents('li').find('.alert').show();
                $('#NickName').parents('li').attr('is-data', 'false');
            }
            //else if (!Username2Li != 'true') {
            //    $('#Name').parents('li').find('.alert').show();
            //    $(this).parents('li').attr('is-data', 'false');
            //}
            indexPro.leftRightHeigh();
        })
    },
    //信用信息
    Qualification: function() {
        $('#UserQuaEditBtn').on('click', function() {
            $('#qualificationText').hide();
            $('#qualificationInput').show();
            indexPro.leftRightHeigh();
        })
        $('#UserQuaSaveBtn').on('click', function() {
            data.Career = Number($('#Career .select-ctrl>div').attr('data-id')); //职业 int
            data.Income = Number($('#Income .select-ctrl>div').attr('data-id')); //工资收入
            data.Insurance = Number($('#Insurance .select-ctrl>div').attr('data-id')); //社保情况
            data.Funds = Number($('#Funds .select-ctrl>div').attr('data-id')); //公积金
            data.Credit = Number($('#Credit .select-ctrl>div').attr('data-id')); //信用记录
            data.HouseState = Number($('#HouseState .select-ctrl>div').attr('data-id')); //住房状态
            $.ajax({
                url: '/User/EditQualification',
                type: "POST",
                dataType: "JSON",
                data: data,
                success: function(res) {
                    if ($('#Career .select-ctrl>div').attr('data-id') == '0') {
                        $('#CareerTxt').html('');
                    } else {
                        $('#CareerTxt').html($('#Career .select-ctrl>div').text()); //职业 int
                    }
                    if ($('#Income .select-ctrl>div').attr('data-id') == '0') {
                        $('#IncomeTxt').html('');
                    } else {
                        $('#IncomeTxt').html($('#Income .select-ctrl>div').text()); //工资收入
                    }
                    if ($('#Credit .select-ctrl>div').attr('data-id') == '0') {
                        $('#CreditTxt').html('');
                    } else {
                        $('#CreditTxt').html($('#Credit .select-ctrl>div').text()); //信用记录
                    }
                    if ($('#HouseState .select-ctrl>div').attr('data-id') == '0') {
                        $('#HouseStateTxt').html('');
                    } else {
                        $('#HouseStateTxt').html($('#HouseState .select-ctrl>div').text()); //住房状态
                    }
                    if ($('#Insurance .select-ctrl>div').attr('data-id') == '-1') {
                        $('#InsuranceTxt').html('');
                    } else {
                        $('#InsuranceTxt').html($('#Insurance .select-ctrl>div').text()); //社保情况
                    }
                    if ($('#Funds .select-ctrl>div').attr('data-id') == '-1') {
                        $('#FundsTxt').html('');
                    } else {
                        $('#FundsTxt').html($('#Funds .select-ctrl>div').text()); //公积金
                    }

                    $('#qualificationText').show();
                    $('#qualificationInput').hide();
                },
                error: function(res) { Tools.showAlert(res) }
            })
        })
    },
    //实名认证
    CertificateInfo: function() {
        //alert(ViewBag.IsCert)
        //UserRealName   check.IsName
        if (!check.isName($('#UserRealName').val())) {
            //$('#UserRealName').parents('li').find('.alert').show();
            $('#UserRealName').parents('li').attr('is-data', 'false');
        } else {
            $('#UserRealName').parents('li').find('.alert').hide();
            $('#UserRealName').parents('li').attr('is-data', 'true');
        }
        $('#UserRealName').blur(function() {
                if (!check.isName($(this).val())) {
                    $(this).parents('li').find('.alert').show();
                    $(this).parents('li').attr('is-data', 'false');
                } else {
                    $(this).parents('li').find('.alert').hide();
                    $(this).parents('li').attr('is-data', 'true');
                }
            })
            //UserRealName   check.IsName
        $('#IdCardCode').blur(function() {
            if (!check.isID($(this).val())) {
                $(this).parents('li').find('.alert').show();
                $(this).parents('li').attr('is-data', 'false');
            } else {
                $(this).parents('li').find('.alert').hide();
                $(this).parents('li').attr('is-data', 'true');
            }
        })

        //图片验证码
        // if(!$('.imgValidateCodeBox').hasClass('hide')){
        $('#imgValidateCode').blur(function() {
            if ($(this).val().length != 4) {
                $(this).parents('li').find('.alert').show();
                $(this).parents('li').attr('is-data', 'false');
            } else {
                $(this).parents('li').find('.alert').hide();
                $(this).parents('li').attr('is-data', 'true');
            }
        });
        // }
        //tabTextBoxCer  tabInputBox checkboxID
        checkboxID();
        $('#checkboxID').on('click', function() {
            checkboxID();
        })

        function checkboxID() {
            if ($('#checkboxID').is(':checked') == true) {
                $('#UserEditBtnCer').removeClass('btn_del');
                $('#UserEditBtnCer').addClass('btn_org');
                $('#UserEditBtnCer').addClass('UserEditBtnCerTest');
                /////////////////////////////////////////////////////
                $('.UserEditBtnCerTest').on('click', function() {
                        var UserRealName = $('#UserRealName').parents('li').attr('is-data');
                        var IdCardCode = $('#IdCardCode').parents('li').attr('is-data');
                        var captcha = $('#imgValidateCode').parents('li').attr('is-data');
                        //var checkboxID = $('#checkboxID').parents('li').attr('is-data');

                        if ((UserRealName == 'true' && IdCardCode == 'true' && $('.imgValidateCodeBox').hasClass('hide')) || (UserRealName == 'true' && IdCardCode == 'true' && captcha == 'true' && !$('.imgValidateCodeBox').hasClass('hide'))) {
                            let _data = {};
                            _data.Name = $('#UserRealName').val() //姓名
                            _data.CertificateType = $('#CertificateType').attr('data-id') //证件类型
                            _data.CertificateNumber = $('#IdCardCode').val() //身份证号
                            _data.captcha = $('#imgValidateCode').val() //图片验证码
                            $.ajax({
                                url: '/User/EditCertificateInfo',
                                type: "POST",
                                dataType: "JSON",
                                data: _data,
                                success: function(res) {
                                    if (!res.Result && res.IsNeedCaptcha) {
                                        //需要验证码
                                        $('#GetImgValidateCode').find('img').attr('src', '/Login/GetImageValidateCode?t=' + (new Date().getTime()));
                                        $('.imgValidateCodeBox').removeClass('hide');
                                        if (res.RowCount == -1) {
                                            return tools.showAlert(res.Message);
                                        } else if (res.RowCount == 0) {
                                            tools.showAlert("请输入图片验证码");
                                        }

                                    } else if (res.Result) {
                                        $('#UserRealNameTxt').html($('#UserRealName').val()) //姓名
                                        $('#CertificateTypeTxt').html($('#CertificateType').val()) //证件类型
                                        var idCardCode = $('#IdCardCode').val();
                                        $('#IdCardCodeTxt').html(idCardCode.substring(0, 6) + '***********' + idCardCode.substring(idCardCode.length - 1, idCardCode.length)) //身份证号
                                        $('#tabTextBoxCer').hide();
                                        $('#tabInputBox').show();
                                    } else if (!res.Result && !res.Date) {
                                        $('#GetImgValidateCode').find('img').attr('src', '/Login/GetImageValidateCode?t=' + (new Date().getTime()));
                                        $('.imgValidateCodeBox').removeClass('hide');
                                        tools.showAlert(res.Message);
                                    }
                                },
                                error: function(res) {
                                    tools.showAlert(res.Message);
                                }
                            })
                        } else if (UserRealName != 'true') {
                            $('#UserRealName').parents('li').find('.alert').show();
                            $('#UserRealName').parents('li').attr('is-data', 'false');
                        } else if (IdCardCode != 'true') {
                            $('#IdCardCode').parents('li').find('.alert').show();
                            $('#IdCardCode').parents('li').attr('is-data', 'false');
                        } else if (captcha != 'true' && !$('.imgValidateCodeBox').hasClass('hide')) {
                            console.log(123)
                            $('#imgValidateCode').parents('li').find('.alert').show();
                            $('#imgValidateCode').parents('li').attr('is-data', 'false');
                        }

                        indexPro.leftRightHeigh();
                    })
                    /////////////////////////////////////////////////////
            } else {
                $('#UserEditBtnCer').addClass('btn_del');
                $('#UserEditBtnCer').removeClass('btn_org');
                $('#UserEditBtnCer').removeClass('UserEditBtnCerTest');
                $('#UserEditBtnCer').off("click")
            }
        }
    },
    // 验证手机号
    checkTelphone: function() {
        // 获取验证码
        $('#GetValidateCode').click(function() {
            check.getCode(60, "mobile", "GetValidateCode", BusinessLine, false, false);
            // if (!getCodeWithToken(60, "mobile", "GetValidateCode", BusinessLine)) {
            //  checkInput(check.isPhoneNumber($("#mobile").val()), $("#mobile"), 'mobile');
        });

        $('#ValidateCode').blur(function() {
            if ($.trim($(this).val()).length !== 4) {
                $(this).parents('li').find('.alert').show();
                $(this).parents('li').attr('is-data', 'false');
            } else {
                $(this).parents('li').find('.alert').hide();
                $(this).parents('li').attr('is-data', 'true');
            }
        });

        $('#checkTelText').click(function() {
            var _value = $.trim($('#ValidateCode').val());
            check.checkCode(_value, 'mobile', BusinessLine, function(res) {
                if (res.Result) {
                    tools.showAlert('手机验证成功');
                    const params = {
                        mobile: $('#mobile').val(),
                        mobileValidateCode: _value
                    }
                    $.post('/ForgetPwd/FindPasswordSetpTwo', params, (res) => {
                        if (res.Result) {
                            token = res.Data;
                        }
                    })
                    setTimeout(function() {
                        $('#checkTelphone li').eq(1).find('.alert').hide();
                        $('#checkTelphone li').eq(1).attr('is-data', 'true');
                        $('#checkTelphone').addClass('hide');
                        $('#ChangePwdInput').removeClass('hide').show();
                    }, 2300);
                } else {
                    $('#checkTelphone li').eq(1).find('.alert').show();
                    $('#checkTelphone li').eq(1).attr('is-data', 'false');
                }
            });
        });
    },
    //修改密码
    ChangePwd: function() {
        $('#UserNewPWD').blur(function() {
            let length = $(this).val().length;
            if (!isNaN($(this).val())) {
                $(this).parents('li').find('.alert').show();
                $(this).parents('li').attr('is-data', 'false');
            } else if (length > 0 && length < 8) {
                $(this).parents('li').find('.alert').show();
                $(this).parents('li').attr('is-data', 'false');
            } else if (length > 20) {
                $(this).parents('li').find('.alert').show();
                $(this).parents('li').attr('is-data', 'false');
            } else {
                $(this).parents('li').find('.alert').hide();
                $(this).parents('li').attr('is-data', 'true');
            }
        })
        $('#UserNewPWDT').blur(function() {
            if ($('#UserNewPWD').val() == $(this).val()) {
                $(this).parents('li').find('.alert').hide();
                $(this).parents('li').attr('is-data', 'true');
            } else {
                $(this).parents('li').find('.alert').show();
                $(this).parents('li').attr('is-data', 'false');
            }
        })
        $('#ChangePwdText').on('click', function() {
            let data = {};
            if ($('#LiUserNewPWD').attr('is-data') == 'true' && $('#LiUserNewPWDT').attr('is-data') == 'true') {
                data.newPassword = $('#UserNewPWD').val(); //新密码
                data.confimPassword = $('#UserNewPWDT').val(); //确认密码
                data.__RequestVerificationToken = $("#__RequestVerificationToken").val(); //token
                data.mobileValidateCode = $('#ValidateCode').val();
                data.token = token; //token
                $.ajax({
                    url: '/User/ChangePassword',
                    type: "POST",
                    dataType: "JSON",
                    data: data,
                    success: function(res) {
                        if (!res.Result) {
                            Tools.showAlert(res.Message);
                        } else {
                            $('#ChangePwdInput').hide();
                            $('#ChangePwdTextBox').show();
                        }
                    },
                    error: function(res) {
                        Tools.showAlert(res.Message);
                    }
                })
            } else if ($('#UserNewPWD').val() == '') {
                $('#LiUserNewPWD').find('.alert').show();
                $('#LiUserNewPWD').parents('li').attr('is-data', 'false');
            } else if ($('#UserNewPWDT').val() == '') {
                $('#LiUserNewPWDT').find('.alert').show();
                $('#LiUserNewPWDT').parents('li').attr('is-data', 'false');
            }
        });
        /***************************************/
        //var i = 50;
        //var intervalid = setInterval(funTime(), 500);
        //function funTime() {
        //    if (i == 0) {
        //        window.location.href = "Login/Index";
        //        clearInterval(intervalid);
        //    }
        //    $('.user_pwd_text_b_f12 .mi').html(i);
        //    i--;
        //}
        //var c = 5;
        //var t;
        //function timedCount() {
        //    //var c = 5
        //    c--;
        //    $('.user_pwd_text_b_f12 .mi').html(c);

        //    t = setTimeout("timedCount()", 100)
        //}
        //timedCount();
        //function stopCount() {
        //    clearTimeout(t)
        //}
        /***************************************/
    }
}

$(function() {
        indexPro.init();
        $('#changeCode').click(function() {
            $('#GetImgValidateCode').find('img').attr('src', '/Login/GetImageValidateCode?t=' + (new Date().getTime()));
        });
    })
    //exports.changePwd = indexPro.ChangePwd;
    // })