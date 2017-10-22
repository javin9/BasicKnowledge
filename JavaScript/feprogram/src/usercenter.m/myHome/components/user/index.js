import './index.scss'
import 'zepto/src/touch'
import 'libs/selectControl'
import check from 'libs/check/m'
import citySelect from 'libs/citySelect'
import datePicker from 'libs/datePicker'

export default {
    init: function () {
        this.shear();
        this.UserProfile();
        this.Qualification();
        this.ChangePwd();
        this.CertificateInfo();

    },
    shear: function () {
        $('.selectBottom').selectControl({
            CallBacks: function (obj) {
                $(obj.item).attr('data-id', obj.id);
                $(obj.item).find('.td').html(obj.txt);
            }
        });
        
    },
    /*个人资料*/
    UserProfile: function () {
        /*昵称 - - NickName*/
        var NickNameVar = $('#NickName').find('.upf_input');
        function NickNameVarFUN() {
            $('#NickName .upf_input').removeClass('col_red');
            if ($(NickNameVar).val() != '' && $(NickNameVar).val() != '请输入您的昵称') {
                $('#NickName .upf_input').removeClass('col_red');
                $('#NickName').attr('data-id', 'true')
            } else if ($(NickNameVar).val() == '请输入您的昵称') {
                $(NickNameVar).val('');
                $('#NickName .upf_input').removeClass('col_red');
            }else {
                $('#NickName').attr('data-id', 'false');
            }
        }
        function NickNameVar2() {
            if ($(NickNameVar).val() == '') {
                $('#NickName .upf_input').val('请输入您的昵称');
                $('#NickName .upf_input').addClass('col_red');
                $('#NickName').attr('data-id', 'false')
            }
        }
        function NickNameVar3() {
            if ($(NickNameVar).val() != '' && $(NickNameVar).val() != '请输入您的昵称') {
                $('#NickName .upf_input').removeClass('col_red');
                $('#NickName').attr('data-id', 'true')
            } else {
                $('#NickName').attr('data-id', 'false');
            }
        }
        $('#NickName .upf_input').focus(function () { NickNameVarFUN(); })
        $('#NickName .upf_input').blur(function () { NickNameVar3(); })
        $('#NickName .upf_input').on('tap', function () {
            if ($(NickNameVar).val() == '请输入您的昵称') {
                $(NickNameVar).val('');
                $('#NickName .upf_input').removeClass('col_red');
            }
        })


        $('#userProfilEidt').on('tap', function () {
            $('#userProfilEidt').hide();
            $('#userProfilSave').show();
            $('.userPro_con .EidtBox').hide();
            $('.userPro_con .SaveBox').css('display', '-webkit-box');
            $('.upf_item_box_textarea').css('display', '-webkit-box');

        })
        //出生年月
        function BirthdayDataTd() {
            var _dp = new datePicker({
                CallBacks: function (obj) {
                    $('#BirthdayData .td').text(obj.year + '年' + obj.month + '月' + obj.day + '日');
                    var constellationNum = Number((obj.month).toString() + (obj.day).toString());
                    if (constellationNum >= 120 && constellationNum <= 218) {
                        $('#Constellation .td').text('水瓶座');
                    } else if (constellationNum >= 219 && constellationNum <= 320) {
                        $('#Constellation .td').text('双鱼座');
                    } else if (constellationNum >= 321 && constellationNum <= 419) {
                        $('#Constellation .td').text('白羊座');
                    } else if (constellationNum >= 420 && constellationNum <= 520) {
                        $('#Constellation .td').text('金牛座');
                    } else if (constellationNum >= 521 && constellationNum <= 621) {
                        $('#Constellation .td').text('双子座');
                    } else if (constellationNum >= 622 && constellationNum <= 722) {
                        $('#Constellation .td').text('巨蟹座');
                    } else if (constellationNum >= 723 && constellationNum <= 822) {
                        $('#Constellation .td').text('狮子座');
                    } else if (constellationNum >= 823 && constellationNum <= 922) {
                        $('#Constellation .td').text('处女座');
                    } else if (constellationNum >= 923 && constellationNum <= 1023) {
                        $('#Constellation .td').text('天秤座');
                    } else if (constellationNum >= 1024 && constellationNum <= 1122) {
                        $('#Constellation .td').text('天蝎座');
                    } else if (constellationNum >= 1123 && constellationNum <= 1221) {
                        $('#Constellation .td').text('射手座');
                    } else {
                        $('#Constellation .td').text('魔羯座');
                    }
                }
            });
            _dp.init({
                'trigger': '#BirthdayData', //标签id
                'type': 'date', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
                'minDate': '1916-1-1', //最小日期
                'maxDate': new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() //最大日期
            });
        }
        BirthdayDataTd();
        //选城市
        $('#selectCityID').on('tap', function (e) {
            e.preventDefault();
            var self = this;
            citySelect.citySelect(null, function (result) {
                $(self).find('.td').text(result.CityName);
                $(self).attr('data-id', result.CityId);
            });
        });
        $('#userProfilSave').on('tap', function () {
            NickNameVar2();
            NickNameVar3()
            if ($('#NickName').attr('data-id') == 'true') {
                var data = {};
                //data.Name = $('#Name').val();          //姓名
                data.NickName = $('#NickName .upf_input').val();       //昵称
                data.Gender = $('#Gender .SaveBox').attr('data-id');       //性别
                var dte = $('#Birthday .td').text();
                data.Birthday = dte.replace(/年/, '-').replace(/月/, '-').replace(/日/, '');//)+'-'+dte.getMonth()+'-'+dte.getDate()     //出生年月
                data.Constellation = $('#Constellation .td ').text();  //星座
                data.CityID = $('#selectCityID').attr('data-id');        //所在地
                data.Address = $('#AddressTxt').val();  //现居住地
                $.ajax({
                    type: 'post',
                    url: '/User/EidtUserProfile',
                    data: data,
                    dataType: 'json',
                    success: function (res) {
                        if (!res.Result) {
                            tools.showAlert(res.Message);
                        } else {
                            $('#NickName .bd').text($('#NickName .upf_input').val()) //昵称
                            var genderText = $('#Gender .td').text().trim() == '请选择' ? '' : $('#Gender .td').text()
                            $('#Gender .bd').text(genderText) //性别
                            var birthdayText = $('#Birthday .td').text().trim() == '请选择' ? '' : $('#Birthday .td').text();
                            $('#Birthday .bd').text(birthdayText) //出生年月
                            $('#Constellation .bd').text($('#Constellation .td').text()) //星座
                            var cityText = $('#CityID .td').text().trim() == '请选择' ? '' : $('#CityID .td').text()
                            $('#CityID .bd').text(cityText); //所在地
                            $('#Address .bd').text($('#AddressTxt').val()) //现居住地
                            $('.upf_item_box_textarea').css('display', 'none');
                            $('#userProfilSave').hide();
                            $('#userProfilEidt').show();
                            $('.userPro_con .EidtBox').css('display', '-webkit-box');
                            $('.userPro_con .SaveBox').hide();
                        }
                    },
                    error: function (res) {                            
                        tools.showAlert(res.Message);
                    }
                })
            }
        })
    },
    /*信用资质*/
    Qualification: function () {
        $('#userQuqliEidt').on('tap', function () {
            $(this).hide();
            $('#userQuqliSave').show();
            $('.userQua_con .EidtBox').hide();
            $('.userQua_con .SaveBox').css('display', '-webkit-box');
        })
        $('#userQuqliSave').on('tap', function () {
            var data = {};
            data.Career = $('#Career .SaveBox').attr('data-id');   //职业 int
            data.Income = $('#Income .SaveBox').attr('data-id');    //工资收入
            data.Insurance = $('#Insurance .SaveBox').attr('data-id');  //社保情况
            data.Funds = $('#Funds .SaveBox').attr('data-id');   //公积金
            data.Credit = $('#Credit .SaveBox').attr('data-id');    //信用记录
            data.HouseState = $('#HouseState .SaveBox').attr('data-id');//住房状态
            $.ajax({
                url: '/User/EditQualification',
                type: "post",
                dataType: "json",
                data: data,
                success: function (res) {                        
                    if ($('#Career .choose').text() == '请选择') {
                        $('#Career .EidtBox .bd').text('');
                    } else {
                        $('#Career .EidtBox .bd').text($('#Career .td').text());   //职业 int
                    }
                    if ($('#Income .choose').text() == '请选择') {
                        $('#Income .EidtBox .bd').text('');
                    } else {
                        $('#Income .EidtBox .bd').text($('#Income .td').text());    //工资收入
                    }
                    if ($('#Insurance .choose').text() == '请选择') {
                        $('#Insurance .EidtBox .bd').text('');
                    } else {
                        $('#Insurance .EidtBox .bd').text($('#Insurance .td').text());  //社保情况
                    }
                    if ($('#Funds .choose').text() == '请选择') {
                        $('#Funds .EidtBox .bd').text('');
                    } else {
                        $('#Funds .EidtBox .bd').text($('#Funds .td').text());   //公积金
                    }
                    if ($('#Credit .choose').text() == '请选择') {
                        $('#Credit .EidtBox .bd').text('');
                    } else {
                        $('#Credit .EidtBox .bd').text($('#Credit .td').text());    //信用记录
                    }
                    if ($('#HouseState .choose').text() == '请选择') {
                        $('#HouseState .EidtBox .bd').text('');
                    } else {
                        $('#HouseState .EidtBox .bd').text($('#HouseState .td').text());//住房状态
                    }
                    $('#userQuqliSave').hide();
                    $('#userQuqliEidt').show();
                    $('.userQua_con .EidtBox').css('display', '-webkit-box');
                    $('.userQua_con .SaveBox').hide();
                },
                error: function (res) {
                    
                    Tools.showAlert(res)
                }
            })
        })
    },
    /*修改密码*/
    ChangePwd: function () {
        var NoChinese = new RegExp(/^[^\u4e00-\u9fa5]{0,}$/);
        //function oldPasswordVar() {
        //    var _selfVal = $('#oldPassword').val()
        //    if (_selfVal == '') {
        //        $('#oldPassword').parent('div').attr('is-data', 'false');
        //        tools.showAlert('请输入当前密码')
        //    } else if (_selfVal.length != 0 && _selfVal.length >= 6) {
        //        $('#oldPassword').parent('div').attr('is-data', 'true');
        //    }
        //}
        function newPasswordVar() {
            if (!NoChinese.test($('#newPassword').val())) {
                $('#newPassword').val('');
                $('#newPassword').parent('div').attr('is-data', 'false');
                tools.showAlert('密码不符合规则要求');
            } else if (!check.isPassword($('#newPassword').val())) {
                $('#newPassword').parent('div').attr('is-data', 'false');
                tools.showAlert('密码不符合规则要求');
            } else {
                $('#newPassword').parent('div').attr('is-data', 'true');
            }
        }
        function confimPasswordVar() {
            if (!NoChinese.test($('#confimPassword').val())) {
                $('#confimPassword').val('');
                $('#confimPassword').parent('div').attr('is-data', 'false');
                tools.showAlert('密码不符合规则要求');
            } else if (!check.isPassword($('#confimPassword').val())) {
                $('#confimPassword').parent('div').attr('is-data', 'false');
                tools.showAlert('密码不符合规则要求');
            } else if ($('#confimPassword').val() != $('#newPassword').val()) {
                $('#confimPassword').parent('div').attr('is-data', 'false');
                tools.showAlert('两次输入密码不一致');
            } else if ($('#confimPassword').val() == $('#newPassword').val()) {
                $('#confimPassword').parent('div').attr('is-data', 'true');
            } else {
                $('#confimPassword').parent('div').attr('is-data', 'false');
            }
        }
        //$('#oldPassword').blur(function () {
        //    oldPasswordVar();
        //})
        $('#newPassword').blur(function () {
            newPasswordVar();
        })
        $('#confimPassword').blur(function () {
            confimPasswordVar();
        })
        $('#changPwdSubmit').on('click', function () {
            //oldPasswordVar();$('#oldPassword').parent('div').attr('is-data') == 'true' &&
            newPasswordVar();
            confimPasswordVar();
            if ($('#newPassword').parent('div').attr('is-data') == 'true' && $('#confimPassword').parent('div').attr('is-data') == 'true') {
                var data = {};
                //data.oldPassword = $('#oldPassword').val(); //旧密码
                data.newPassword = $('#newPassword').val(); //新密码
                data.confimPassword = $('#confimPassword').val(); //确认密码
                $.ajax({
                    url: '/User/ChangePassword',
                    type: "post",
                    dataType: "json",
                    data: data,
                    success: function (res) {
                        if (!res.Result) {
                            tools.showAlert(res.Message);
                        } else {
                            $('.uC_form').hide();
                            $('.uC_form_ok').show();
                            var countDown = $('#countDown').text();
                            window.tmo = setInterval(function () {
                                if (--countDown == 0) {
                                    clearInterval(tmo);
                                    window.location.href = '/User/Logout?currenturl=' + usercenterLoginUrl;
                                    return;
                                }
                                $('#countDown').text(countDown);
                            }, 1000);
                        }
                    },
                    error: function (res) {
                        tools.showAlert(res.Message);
                    }
                })
            }
            //else if ($('#oldPassword').val() == '') {
            //    tools.showAlert('请输入当前密码')
            //    $('#oldPassword').parent('div').attr('is-data', 'false');
            //} else if ($('#oldPassword').parent('div').attr('is-data') != 'true') {
            //    tools.showAlert('请输入当前密码')
            //    $('#oldPassword').parent('div').attr('is-data', 'false');
            //} else if ($('#newPassword').val() == '') {
            //    tools.showAlert('请输入新密码')
            //    $('#newPassword').parent('div').attr('is-data', 'false');
            //} else if ($('#newPassword').parent('div').attr('is-data') != 'true') {
            //    tools.showAlert('请输入新密码')
            //    $('#newPassword').parent('div').attr('is-data', 'false');
            //} else if ($('#confimPassword').val() == '') {
            //    tools.showAlert('请确认新密码')
            //    $('#confimPassword').parent('div').attr('is-data', 'false');
            //} else if ($('#confimPassword').parent('div').attr('is-data') != 'true') {
            //    tools.showAlert('请确认新密码')
            //    $('#confimPassword').parent('div').attr('is-data', 'false');
            //}
        });
    },
    /*实名认证*/
    CertificateInfo: function () {
        
        //$('.upf_input').focus(function () {
        //    $(this).val('');
        //})
        checkName();
        function checkName() {
            if (!check.isName($('#Name .upf_input').val())) {
                $('#Name').attr('is-data', 'false');
            } else {
                $('#Name').attr('is-data', 'true');
            }
        }
        $('#Name .upf_input').blur(function () {
            checkName();
        })
        function CertificateNumberFun() {
            if (!check.isID($('#CertificateNumber .upf_input').val())) {
                $('#CertificateNumber').attr('is-data', 'false');
            } else {
                $('#CertificateNumber').attr('is-data', 'true');
            }
        }
        $('#CertificateNumber .upf_input').blur(function () {
            CertificateNumberFun()
        })
        
        /*《易鑫认证服务协议》 CertificateXieYi*/
        $('.submitApply').on('tap', function () {
            $('.userCert_one').hide();
            $('.userCert_two').show();
        })
        $('#CertificateXieYi').on('tap', function () {
            if ($('#CertificateXieYi .small_ok').hasClass('checked')) {
                $('#CertificateXieYi .small_ok').removeClass('checked');
                $('#submitApply').removeClass('submitApply');
                $('#submitApply').off('tap');
            } else {
                $('#CertificateXieYi .small_ok').addClass('checked');
                $('#submitApply').addClass('submitApply');
                $('.submitApply').on('tap', function () {
                    $('.userCert_one').hide();
                    $('.userCert_two').show();
                })
            }
        })
        $('#xieYi').on('tap', function () {
            tools.serviceProvision({
                url: "/User/CertificateXieYi",
                title: "车贷服务条款"
            })
        })

        //验证---验证码
        function authcode() {
            if ($('#ImgCode').hasClass('hide')) {
                return false
            } else {
                var inp=$('#ImgCode .upf_input').val()
                console.log(check.isImagePassword,check.isImagePassword(inp))
                if (!check.isImagePassword(inp)){
                    tools.showAlert('请输入正确的图片校验码');
                }
            }

        }
    
        // submitCert 提交
        $('#submitCert').on('tap', function () {
            checkName()
            CertificateNumberFun()
            authcode();
            checkboxID();

        })
        //ImgCode
        $('#ImgCode .imgbox').on('click',function(){
            $(this).find('img').attr('src', IMAGECODE_GETTING_URL+'?' +(new Date().getTime()));
        });

        
        function checkboxID() {
            var $submitCert =  $('#submitCert');
            var UserRealName = $('#Name').attr('is-data');
            var IdCardCode = $('#CertificateNumber').attr('is-data');
            if (UserRealName == 'true' && IdCardCode == 'true' && !$submitCert.hasClass('disabled')) {
                $submitCert.addClass('disabled');
                var data = {};
                data.Name = $('#Name .upf_input').val(); //姓名
                data.CertificateType = $('#CertificateType .bd').attr('data-id'); //证件类型
                data.CertificateNumber = $('#CertificateNumber .upf_input').val(); //身份证号
                data.authcode = $('#ImgCode .upf_input').val(); //验证码
                $.ajax({
                    url: '/User/EditCertificateInfo',
                    type: "post",
                    dataType: "json",
                    data: data,
                    success: function (res) {

                        if (!res.Result) {
                            $('#ImgCode img').attr('src', IMAGECODE_GETTING_URL+'?' + (new Date().getTime()));
                            $submitCert.removeClass('disabled');
                            if (res.IsNeedCaptcha){
                                $('#ImgCode').removeClass('hide')
                            }
                            return tools.showAlert(res.Message);
                        } else {
                            $('.userCert_two').hide();
                            $('.userCert_three').show();
                            var countDown = $('#countDown').text();
                            window.tmo = setInterval(function () {
                                $submitCert.removeClass('disabled');
                                if (--countDown == 0) {
                                    clearInterval(tmo);
                                    var _nextUrl = '/User/Index';
                                    if (typeof window.returnurl && window.returnurl) {
                                        _nextUrl = window.returnurl;
                                    }
                                    location.href = _nextUrl;
                                    return;
                                }
                                $('#countDown').text(countDown);
                            }, 1000);
                        }
                    },
                    error: function (res) {
                        $submitCert.removeClass('disabled');
                        tools.showAlert(res.Message);
                    }
                })
            } else if (UserRealName != 'true') {
                tools.showAlert('请输入您的正确的姓名')//
                $('#UserRealName').attr('is-data', 'false');
            } else if (IdCardCode != 'true') {
                tools.showAlert('请输入正确证件号码')//
                $('#IdCardCode').attr('is-data', 'false');
            }
        }
    }
}
