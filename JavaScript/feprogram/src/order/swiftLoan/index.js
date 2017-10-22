import "./index.scss";
import check from 'libs/check';
import city from 'libs/selCity';
import car from 'libs/carSelect/selCarThird.pc.js';
import aes from "libs/aes";
$(function() {

    if (carId !== '') {
        $('#selectCar').val(carName).attr('title', carName).html(carName).addClass('black');
        $('#CarName').val(carName);
        $('#CarId').val(carId);
        $('#CarPrice').val('');
        hideErrorMsg($('#selectCar'));
    }
    if (ipLocationInfo) {
        $('#selectCity').text(ipLocationInfo.CityName).addClass('black');
        $('#CityName').val(ipLocationInfo.CityName);
        $('#CityId').val(ipLocationInfo.CityId);
        hideErrorMsg($('#selectCity'));
    }


    let u_name = $('#Name'),
        u_id = $('#CertificateNumber'),
        tel = $('#Telephone'),
        code = $('#ValidateCode'),
        yycode = $('.yy-box'),
        getcode = $('#GetValidateCodeBtn');

    if (isAuthenticated == 'true') {
        u_name.val(showUserName);
        hideErrorMsg(u_name);
        u_id.val(idNumber);
        hideErrorMsg(u_id);

    }
    if (isLogined == 'true') {
        tel.val(showMobile);
        getcode.hide();
        yycode.hide();
        code.parent().hide();
        code.val('****');
        hideErrorMsg(tel);
        hideErrorMsg(code);
    }
    tel.on('change', () => {
        if (isLogined == 'true') {
            if (isAuthenticated == 'true') {
                u_name.val('');
                u_id.val('');
                isAuthenticated = 'false';
            }
            changeValueEvent();
        }
    })
    u_name.on('change', () => {
        if (isAuthenticated == 'true') {
            u_id.val('');
            isAuthenticated = 'false';
        }
        if (isLogined == 'true') {
            tel.val('');
            changeValueEvent();
        }
    })
    u_id.on('change', () => {
        if (isAuthenticated == 'true') {
            u_name.val('');
            isAuthenticated = 'false';
        }
        if (isLogined == 'true') {
            tel.val('');
            changeValueEvent();
        }

    })
    var changeValueEvent = function() {
        code.val('');
        yycode.show();
        getcode.show();
        code.parent().show();
        isLogined = 'false';

    };
    $('#selectCity')
        .on('click', function(e) {
            $('#CarSelCon').hide();
        })
        .selCity({
            // isRelationHeader: true
            callBacks: function(result) {
                $('#selectCity').text(result.cityName).addClass('black');
                $('#CityName').val(result.cityName);
                $('#CityId').val(result.cityId);
                hideErrorMsg($('#selectCity'));
            }
        });

    //选车型
    $('#selectCar')
        .on('focus', function(e) {})
        .selCar2({
            OnlyOnSale: true,
            Callback: function(data) {
                var carName = data.data('fullname').trim();
                $('#selectCar').val(carName).attr('title', carName).addClass('black');
                $('#CarName').val(carName);
                $('#CarId').val(data.data("id"));
                $('#CarPrice').val(data.data("val"));
                hideErrorMsg($('#selectCar'));
            }
        });

    // 获取验证码
    var telElem = $('#Telephone');
    var vcElem = $('#ValidateCode');
    var isClick = false;
    $('#GetValidateCodeBtn').on('click', function(e) {
        e.preventDefault();
        var telval = $.trim(telElem.val());
        if (!telval || !check.isPhoneNumber(telval)) {
            showErrorMsg(telElem);
        } else {
            // hideErrorMsg(telElem);
            check.getCode(60, 'Telephone', 'GetValidateCodeBtn', '', false, false);
            $('#ValidateCode').focus();
        }
    });

    $('#GetValidateCodeLink').on('click', function(e) {
        if (isClick) {
            tools.showAlert('请60S后在尝试。');
            return;
        }

        e.preventDefault();
        var telval = $.trim(telElem.val());
        if (!telval || !check.isPhoneNumber(telval)) {
            showErrorMsg(telElem);
        } else {
            // hideErrorMsg(telElem);
            var params = { mobile: telval, line: '550', codelen: 4 }
            var token = $('input[name=__RequestVerificationToken]').val() || $('input[name=__RequestVerificationToken]').data('id')
            if (token) {
                params.__RequestVerificationToken = token
            }
            $.ajax({
                url: VOICE_CODE_GETTING_URL,
                type: 'POST',
                data: params,
                success: (res) => {
                    if (res.Result) {
                        isClick = true;
                        $('#GetValidateCodeLink').css({ 'color': '#999', 'cursor': 'Auto' })
                        setTimeout(() => {
                            isClick = false;
                            $('#GetValidateCodeLink').css({ 'color': '#5a67ae', 'cursor': 'pointer' })
                        }, 60000)
                    } else {
                        tools.showAlert(res.Message);
                    }

                }
            });
            $('#ValidateCode').focus();
        }
    });
    $('input').focus(function() {
            hideErrorMsg($(this));
        })
        // input失去焦点校验
    $('input.checked').blur(function() {
        let val = $.trim($(this).val()),
            _id = $(this).attr('id');
        if (val === "") {
            if (!$('#' + _id).is(":hidden")) {
                showErrorMsg($('#' + _id));
            }
        } else {
            switch (_id) {
                case 'Telephone':
                    if (val == showMobile) {
                        hideErrorMsg(telElem);
                        return;
                    }
                    if (!check.isPhoneNumber(val)) {
                        showErrorMsg(telElem);
                    } else {
                        //添加埋点
                        try {
                            bc.evt.send('mobile', 'mobblur', val);
                        } catch (err) {}

                        hideErrorMsg(telElem);
                    }
                    break;
                case 'Name':
                    if (val == showUserName) {
                        hideErrorMsg(telElem);
                        return;
                    }
                    if (!check.isName($.trim(val))) {
                        showErrorMsg($(this));
                    } else {
                        hideErrorMsg($(this));
                    }
                    break;
                case 'CertificateNumber':
                    if (val == idNumber) {
                        hideErrorMsg(telElem);
                        return;
                    }
                    if (!check.isID(val)) {
                        showErrorMsg($(this));
                    } else {
                        hideErrorMsg($(this));
                    }
                    break;
                case 'ValidateCode':
                    if ($('#Telephone').val() == showMobile) {
                        hideErrorMsg(telElem);
                        return;
                    }
                    check.checkCode($.trim($('#ValidateCode').val()), 'Telephone', '', function(data) {
                        if (!data.Result) {
                            showErrorMsg(vcElem);
                        } else {
                            hideErrorMsg(vcElem);
                        }
                    });
                    break;
            }
        }
    });

    // 提交表单
    $('#submit-btn').click(function(e) {
        e.preventDefault();
        if ($('#submit-btn').hasClass('disabled')) {
            return;
        }
        $('input.checked').trigger('blur');

        $('.selected').each(function() {
                let _val = $(this).text(),
                    _id = $(this).attr('id');
                _val.indexOf('请选择') >= 0 ? showErrorMsg($('#' + _id)) : hideErrorMsg($('#' + _id))

            })
            //提交
        let _data = {},
            userName = $('#Name'),
            userID = $('#CertificateNumber');
        if (userName[0] && userName.val() != showUserName) {
            if (!check.isName($.trim(userName.val()))) {
                showErrorMsg(userName);
                return;
            } else {
                hideErrorMsg(userName);
            }
        }
        if (userID[0] && userID.val() != idNumber) {
            if (!check.isID(userID.val())) {
                showErrorMsg(userID);
                return;
            } else {
                hideErrorMsg(userID);
            }
        }
        if ($('.yzts.show').length <= 0) {
            $('#form input').each(function() {
                if ($(this).val().indexOf('*') == -1)
                    $(this).attr('name') == 'CertificateNumber' ? _data[$(this).attr('name')] = aes.encrypt($(this).val()) : _data[$(this).attr('name')] = $(this).val()
            })
            console.log(_data)
            $('#submit-btn').addClass('disabled');
            tools.$ajax({
                type: 'POST',
                url: AddOrder,
                data: _data,
                success: function(res) {
                    if (res.Result) {
                        try {
                            //添加埋点
                            bc.evt.send('mobile', 'sbtclk', $("#Telephone").val(), '1', '极速贷款PC订单提交成功')
                        } catch (err) {}
                        location.href = res.Data;
                    } else {
                        try {
                            //添加埋点
                            bc.evt.send('mobile', 'sbtclk', $('#Telephone').val(), '0', '极速贷款PC订单提交失败 原因' + res.Message)
                        } catch (err) {}

                        tools.showAlert(res.Message);
                        $('#submit-btn').removeClass('disabled');
                    }
                }
            });
        }
    });

    function showErrorMsg(elem) {
        elem.parents('.row').addClass('show').next('.yzts').addClass('show');
    }

    function hideErrorMsg(elem) {
        elem.parents('.row').removeClass('show').next('.yzts').removeClass('show');
    }

});